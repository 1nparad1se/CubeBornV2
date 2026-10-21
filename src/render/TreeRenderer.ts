import * as THREE from 'three';
import { TREE_CHUNK, TREE_KINDS, TREE_SPECS, TREE_VARIANTS, type TreeList } from '../world/trees';
import { treeGeometry } from './treeModels';

const _m = new THREE.Matrix4();
const _r = new THREE.Matrix4();
const _c = new THREE.Color();

/**
 * Draws the world's trees near the camera: one instanced mesh per species variant (32 draws in
 * all, however big the world), refilled from the tree chunks around the camera whenever it has
 * moved a few blocks. Trees beyond the fog are never drawn.
 */
export class TreeRenderer {
  readonly group = new THREE.Group();
  /** Near trees (full detail, casting shadows) and far trees (coarse voxels, no shadows). */
  private meshes: THREE.InstancedMesh[] = [];
  private geos: THREE.BufferGeometry[] = [];
  private farMeshes: THREE.InstancedMesh[] = [];
  private farGeos: THREE.BufferGeometry[] = [];
  private mat = new THREE.MeshLambertMaterial({ vertexColors: true });
  private lastX = 1e9;
  private lastZ = 1e9;
  private lastR = 0;
  /** Trees drawn after the last refill (debug and tests). */
  drawn = 0;

  constructor(private trees: TreeList, private shadows: boolean) {
    for (let k = 0; k < TREE_KINDS; k++)
      for (let v = 0; v < TREE_VARIANTS; v++) {
        const g = treeGeometry(k, v);
        const f = treeGeometry(k, v, true);
        // single-voxel trunks are centred on the block like the thick ones
        if (TREE_SPECS[k].trunk === 1) {
          g.translate(-0.25, 0, -0.25);
          f.translate(-0.5, 0, -0.5);
        }
        this.geos.push(g);
        this.meshes.push(this.makeMesh(g, 256, this.shadows));
        this.farGeos.push(f);
        this.farMeshes.push(this.makeMesh(f, 256, false));
      }
  }

  private makeMesh(g: THREE.BufferGeometry, cap: number, shadows: boolean) {
    const m = new THREE.InstancedMesh(g, this.mat, cap);
    m.count = 0;
    m.castShadow = shadows;
    // lit by the sun and the sky only: shadow maps on the many small leaf faces turn to acne
    m.receiveShadow = false;
    // the instances are already limited to the view radius
    m.frustumCulled = false;
    m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.group.add(m);
    return m;
  }

  /**
   * Refills the instances around (x, z) out to `radius` once the view has moved enough; trees
   * farther than `near` use the coarse models.
   */
  update(x: number, z: number, radius: number, near = 42) {
    if (Math.hypot(x - this.lastX, z - this.lastZ) < 6 && Math.abs(radius - this.lastR) < 8) return;
    this.lastX = x;
    this.lastZ = z;
    this.lastR = radius;
    const L = this.trees;
    const want: number[][] = this.meshes.map(() => []);
    const wantFar: number[][] = this.meshes.map(() => []);
    const n2 = near * near;
    const c0x = Math.max(0, Math.floor((x - radius) / TREE_CHUNK));
    const c1x = Math.min(L.per - 1, Math.floor((x + radius) / TREE_CHUNK));
    const c0z = Math.max(0, Math.floor((z - radius) / TREE_CHUNK));
    const c1z = Math.min(L.per - 1, Math.floor((z + radius) / TREE_CHUNK));
    const r2 = radius * radius;
    for (let cz = c0z; cz <= c1z; cz++)
      for (let cx = c0x; cx <= c1x; cx++) {
        const c = cz * L.per + cx;
        for (let i = L.chunkStart[c]; i < L.chunkStart[c + 1]; i++) {
          const dx = L.x[i] - x;
          const dz = L.z[i] - z;
          const d2 = dx * dx + dz * dz;
          if (d2 > r2) continue;
          (d2 > n2 ? wantFar : want)[L.kind[i] * TREE_VARIANTS + L.variant[i]].push(i);
        }
      }
    this.drawn = 0;
    this.fill(this.meshes, this.geos, want, this.shadows);
    this.fill(this.farMeshes, this.farGeos, wantFar, false);
  }

  private fill(meshes: THREE.InstancedMesh[], geos: THREE.BufferGeometry[], want: number[][], shadows: boolean) {
    const L = this.trees;
    want.forEach((list, mi) => {
      let mesh = meshes[mi];
      if (list.length > mesh.instanceMatrix.count) {
        // grow (rare): a bigger buffer for this variant
        this.group.remove(mesh);
        mesh.dispose();
        mesh = meshes[mi] = this.makeMesh(geos[mi], Math.ceil(list.length * 1.5), shadows);
      }
      list.forEach((i, n) => {
        const s = L.scale[i];
        _r.makeRotationY((L.turn[i] * Math.PI) / 2);
        _m.makeScale(s, s, s).premultiply(_r);
        _m.setPosition(L.x[i], L.y[i], L.z[i]);
        mesh.setMatrixAt(n, _m);
        // each tree a little lighter or darker
        const k = 0.9 + (((i * 2654435761) >>> 0) / 4294967296) * 0.2;
        mesh.setColorAt(n, _c.setRGB(k, k, k));
      });
      mesh.count = list.length;
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      this.drawn += list.length;
    });
  }

  dispose() {
    for (const m of [...this.meshes, ...this.farMeshes]) m.dispose();
    for (const g of [...this.geos, ...this.farGeos]) g.dispose();
    this.mat.dispose();
    this.group.clear();
  }
}

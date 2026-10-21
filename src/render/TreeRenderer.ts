import * as THREE from 'three';
import { TREE_CHUNK, TREE_KINDS, TREE_VARIANTS, type TreeList } from '../world/trees';
import { treeGeometry, type TreeLod } from './treeModels';

const _m = new THREE.Matrix4();
const _r = new THREE.Matrix4();
const _c = new THREE.Color();
const _zero = new THREE.Matrix4().makeScale(0, 0, 0);
const _box = new THREE.Box3();
const _ray = new THREE.Ray();
const _hit = new THREE.Vector3();
const _p = new THREE.Vector3();

/** Distances (blocks) where trees switch to the mid and the far model. */
const NEAR = 16;
const MID = 48;
/** Opacity of a tree that hides the hero, and how fast it fades (per second). */
const GHOST_ALPHA = 0.32;
const FADE_RATE = 4;

interface LodSet {
  lod: TreeLod;
  meshes: THREE.InstancedMesh[];
  geos: THREE.BufferGeometry[];
  shadows: boolean;
  mat: THREE.Material;
}

/** A tree drawn see-through because it stands between the camera and the hero. */
interface Ghost {
  tree: number;
  alpha: number;
  target: number;
  depth: THREE.Mesh;
  color: THREE.Mesh;
}

/**
 * Draws the world's trees near the camera: one instanced mesh per species variant and level of
 * detail, refilled from the tree chunks around the camera whenever it has moved a few blocks.
 * Near trees use the fine model (1/6-block leaves); their shadows come from an invisible
 * mid-detail copy, which looks the same in the shadow map at a fraction of the cost. Trees beyond
 * the fog are never drawn. A tree that hides the hero fades to half see-through and back.
 */
export class TreeRenderer {
  readonly group = new THREE.Group();
  private mat = new THREE.MeshLambertMaterial({ vertexColors: true });
  /** Shadow casters only: draws nothing on screen. */
  private shadowMat = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false });
  private near: LodSet;
  private mid: LodSet;
  private far: LodSet;
  private proxy: LodSet;
  /** Where each near tree sits: tree index -> variant * 65536 + instance. */
  private slot = new Map<number, number>();
  private nearList: number[] = [];
  private ghosts: Ghost[] = [];
  private ghostDepthMat = new THREE.MeshBasicMaterial({ colorWrite: false, transparent: true, opacity: 0 });
  private lastX = 1e9;
  private lastZ = 1e9;
  private lastR = 0;
  /** Trees drawn after the last refill (debug and tests). */
  drawn = 0;

  constructor(private trees: TreeList, private shadows: boolean) {
    this.ghostDepthMat.depthWrite = true;
    this.near = this.makeSet(0, false, this.mat);
    this.mid = this.makeSet(1, shadows, this.mat);
    this.far = this.makeSet(2, false, this.mat);
    this.proxy = this.makeSet(1, shadows, this.shadowMat, this.mid.geos);
    if (!shadows) this.proxy.meshes.forEach((m) => (m.visible = false));
  }

  private makeSet(lod: TreeLod, shadows: boolean, mat: THREE.Material, share?: THREE.BufferGeometry[]): LodSet {
    const geos: THREE.BufferGeometry[] = [];
    for (let k = 0; k < TREE_KINDS; k++) for (let v = 0; v < TREE_VARIANTS; v++) geos.push(share ? share[k * TREE_VARIANTS + v] : treeGeometry(k, v, lod));
    const set: LodSet = { lod, geos, shadows, mat, meshes: [] };
    set.meshes = geos.map((g) => this.makeMesh(set, g, 128));
    return set;
  }

  private makeMesh(set: LodSet, g: THREE.BufferGeometry, cap: number) {
    const m = new THREE.InstancedMesh(g, set.mat, cap);
    m.count = 0;
    m.castShadow = set.shadows;
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
   * farther than NEAR use the mid model, farther than MID the far one.
   */
  update(x: number, z: number, radius: number) {
    if (Math.hypot(x - this.lastX, z - this.lastZ) < 6 && Math.abs(radius - this.lastR) < 8) return;
    this.lastX = x;
    this.lastZ = z;
    this.lastR = radius;
    const L = this.trees;
    const n = TREE_KINDS * TREE_VARIANTS;
    const want = [0, 1, 2].map(() => Array.from({ length: n }, () => [] as number[]));
    const n2 = NEAR * NEAR;
    const m2 = MID * MID;
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
          want[d2 < n2 ? 0 : d2 < m2 ? 1 : 2][L.kind[i] * TREE_VARIANTS + L.variant[i]].push(i);
        }
      }
    this.drawn = 0;
    this.slot.clear();
    this.nearList = want[0].flat();
    this.fill(this.near, want[0], true);
    this.fill(this.proxy, want[0], false);
    this.fill(this.mid, want[1], false);
    this.fill(this.far, want[2], false);
    // trees fading out stay hidden in the instanced meshes
    for (const g of this.ghosts) this.hide(g.tree);
  }

  private fill(set: LodSet, want: number[][], slots: boolean) {
    want.forEach((list, mi) => {
      let mesh = set.meshes[mi];
      if (list.length > mesh.instanceMatrix.count) {
        // grow (rare): a bigger buffer for this variant
        this.group.remove(mesh);
        mesh.dispose();
        mesh = set.meshes[mi] = this.makeMesh(set, set.geos[mi], Math.ceil(list.length * 1.5));
        if (set === this.proxy && !this.shadows) mesh.visible = false;
      }
      list.forEach((i, n) => {
        this.matrix(i, _m);
        mesh.setMatrixAt(n, _m);
        mesh.setColorAt(n, _c.setScalar(this.tint(i)));
        if (slots) this.slot.set(i, mi * 65536 + n);
      });
      mesh.count = list.length;
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      if (set !== this.proxy) this.drawn += list.length;
    });
  }

  private matrix(i: number, out: THREE.Matrix4) {
    const L = this.trees;
    const s = L.scale[i];
    _r.makeRotationY((L.turn[i] * Math.PI) / 2);
    out.makeScale(s, s, s).premultiply(_r);
    out.setPosition(L.x[i], L.y[i], L.z[i]);
    return out;
  }

  /** Each tree a little lighter or darker. */
  private tint(i: number) {
    return 0.9 + (((i * 2654435761) >>> 0) / 4294967296) * 0.2;
  }

  private hide(tree: number, show = false) {
    const s = this.slot.get(tree);
    if (s === undefined) return;
    const mesh = this.near.meshes[s >> 16];
    mesh.setMatrixAt(s & 65535, show ? this.matrix(tree, _m) : _zero);
    mesh.instanceMatrix.needsUpdate = true;
  }

  /** World box of a near tree's model, its crown pulled in a little at the sides. */
  private bounds(i: number, out: THREE.Box3) {
    const L = this.trees;
    const g = this.near.geos[L.kind[i] * TREE_VARIANTS + L.variant[i]];
    out.copy(g.boundingBox!).applyMatrix4(this.matrix(i, _m));
    const sx = (out.max.x - out.min.x) * 0.1;
    const sz = (out.max.z - out.min.z) * 0.1;
    out.min.x += sx;
    out.max.x -= sx;
    out.min.z += sz;
    out.max.z -= sz;
    return out;
  }

  /**
   * Fades the trees that stand between the camera and the hero (`hero` = feet, `height` tall)
   * to see-through, and the ones that no longer do back to solid.
   */
  occlude(cam: THREE.Vector3, hero: THREE.Vector3, height: number, dt: number) {
    const hit = new Set<number>();
    for (const i of this.nearList) {
      const dx = this.trees.x[i] - hero.x;
      const dz = this.trees.z[i] - hero.z;
      // only trees on the camera's side of the hero can hide them
      if (dx * (cam.x - hero.x) + dz * (cam.z - hero.z) < -4) continue;
      if (dx * dx + dz * dz > 400) continue;
      this.bounds(i, _box);
      for (const k of [0.25, 0.55, 0.9]) {
        _p.set(hero.x, hero.y + height * k, hero.z);
        const len = _p.distanceTo(cam);
        _ray.set(cam, _hit.subVectors(_p, cam).normalize());
        // hit before reaching the hero (the hero standing inside the box counts too)
        if (_ray.intersectBox(_box, _hit) && _hit.distanceTo(cam) < len - 0.2) {
          hit.add(i);
          break;
        }
      }
    }
    for (const i of hit)
      if (!this.ghosts.some((g) => g.tree === i) && this.slot.has(i)) this.ghosts.push(this.makeGhost(i));
    for (let n = this.ghosts.length - 1; n >= 0; n--) {
      const g = this.ghosts[n];
      g.target = hit.has(g.tree) ? GHOST_ALPHA : 1;
      const step = FADE_RATE * dt * (1 - GHOST_ALPHA);
      g.alpha = g.alpha < g.target ? Math.min(g.target, g.alpha + step) : Math.max(g.target, g.alpha - step);
      (g.color.material as THREE.MeshLambertMaterial).opacity = g.alpha;
      if (g.alpha >= 1 || !this.slot.has(g.tree)) {
        this.hide(g.tree, true);
        this.group.remove(g.depth, g.color);
        (g.color.material as THREE.Material).dispose();
        this.ghosts.splice(n, 1);
      }
    }
  }

  private makeGhost(i: number): Ghost {
    const L = this.trees;
    const geo = this.near.geos[L.kind[i] * TREE_VARIANTS + L.variant[i]];
    const k = this.tint(i);
    const mat = new THREE.MeshLambertMaterial({ vertexColors: true, transparent: true, depthWrite: false, opacity: 1 });
    mat.color.setScalar(k);
    // a depth pass first, so only the tree's front leaves blend over the hero (no inner faces)
    const depth = new THREE.Mesh(geo, this.ghostDepthMat);
    const color = new THREE.Mesh(geo, mat);
    for (const m of [depth, color]) {
      this.matrix(i, m.matrix);
      m.matrixAutoUpdate = false;
      m.castShadow = false;
      m.frustumCulled = false;
    }
    // after the water and the other see-through things
    depth.renderOrder = 20;
    color.renderOrder = 21;
    this.group.add(depth, color);
    this.hide(i);
    return { tree: i, alpha: 1, target: GHOST_ALPHA, depth, color };
  }

  /** Trees fading or faded (tests). */
  get ghostCount() {
    return this.ghosts.length;
  }

  dispose() {
    for (const set of [this.near, this.mid, this.far, this.proxy]) for (const m of set.meshes) m.dispose();
    for (const set of [this.near, this.mid, this.far]) for (const g of set.geos) g.dispose();
    for (const g of this.ghosts) (g.color.material as THREE.Material).dispose();
    this.mat.dispose();
    this.shadowMat.dispose();
    this.ghostDepthMat.dispose();
    this.group.clear();
  }
}

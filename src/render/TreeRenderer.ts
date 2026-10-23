import * as THREE from 'three';
import { TREE_CHUNK, TREE_KINDS, TREE_VARIANTS, type TreeList } from '../world/trees';
import { GLSL_NOISE } from './glsl';
import { SURF, TREE_LODS, treeGeometry, type TreeLod } from './treeModels';

const _m = new THREE.Matrix4();
const _r = new THREE.Matrix4();
const _c = new THREE.Color();
const _zero = new THREE.Matrix4().makeScale(0, 0, 0);
const _box = new THREE.Box3();
const _ray = new THREE.Ray();
const _hit = new THREE.Vector3();
const _p = new THREE.Vector3();

/**
 * Farthest distance (blocks from the hero) of each level of detail: 1/6-block cubes near, then
 * 1/3, 1/2 and 1 block. Each step halves the detail at about twice the distance, so a switch
 * changes a tree by no more than its pixels already shrank.
 */
const LOD_DIST = [18, 34, 56];
/** Level whose model casts the near trees' shadows (cheap and the same outline). */
const SHADOW_LOD: TreeLod = 2;
/** Opacity of a tree that hides the hero, and how fast it fades (per second). */
const GHOST_ALPHA = 0.32;
const FADE_RATE = 4;

/**
 * Tree material: vertex colours (clumps, shade) plus soft painted dabs in the model's own space
 * (light and dark leaf masses, a warmer or cooler patch, bark in vertical strokes), at no
 * geometry cost.
 */
export function treeMaterial(opts: THREE.MeshLambertMaterialParameters = {}): THREE.MeshLambertMaterial {
  const mat = new THREE.MeshLambertMaterial({ vertexColors: true, ...opts });
  mat.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aSurf;\nvarying float vSurf;\nvarying vec3 vObj;\nvarying vec3 vObjN;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvSurf = aSurf;\nvObj = position;\nvObjN = normal;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>\nvarying float vSurf;\nvarying vec3 vObj;\nvarying vec3 vObjN;\n${GLSL_NOISE}`)
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
{
  // painted surfaces in the model's own space: soft dabs of light and dark leaves, bark in long
  // vertical brush strokes; the underside of every mass sinks into shade
  float t = 1.0;
  vec3 tint = vec3(1.0);
  float up = normalize(vObjN).y;
  if (vSurf < ${(SURF.leaf + 0.5).toFixed(1)}) {
    float d = vnoise(vObj.xy * 4.2 + vObj.z * 2.7) * 0.55 + vnoise(vObj.zy * 9.0 + vObj.x * 3.3 + 7.0) * 0.45;
    float db = floor(d * 4.0);
    d = (db + smoothstep(0.3, 0.7, d * 4.0 - db)) / 4.0;
    t = 0.84 + d * 0.28;
    t *= mix(0.82, 1.04, smoothstep(-0.5, 0.9, up));
    tint = mix(vec3(0.9, 1.0, 1.04), vec3(1.05, 1.02, 0.9), smoothstep(0.45, 0.8, vnoise(vObj.xz * 1.7 + vObj.y)));
  } else if (vSurf < ${(SURF.wood + 0.5).toFixed(1)}) {
    float g = vnoise(vec2((vObj.x + vObj.z) * 11.0, vObj.y * 1.4)) * 0.6 + vnoise(vec2((vObj.x - vObj.z) * 23.0, vObj.y * 3.0)) * 0.4;
    t = 0.72 + smoothstep(0.25, 0.75, g) * 0.34;
  } else {
    t = 0.9 + smoothstep(0.2, 0.9, up) * 0.25;
  }
  diffuseColor.rgb *= t * tint;
}`,
      );
  };
  mat.customProgramCacheKey = () => 'tree-' + (opts.transparent ? 't' : 'o');
  return mat;
}

interface LodSet {
  lod: TreeLod;
  meshes: (THREE.InstancedMesh | null)[];
  shadows: boolean;
  mat: THREE.Material;
  hidden?: boolean;
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
 * Models are built the first time a variant is needed. Near trees use the fine model (1/6-block
 * leaves); their shadows come from an invisible coarser copy, which looks the same in the shadow
 * map at a fraction of the cost. Trees beyond the fog are never drawn. A tree that hides the hero
 * fades to half see-through and back.
 */
export class TreeRenderer {
  readonly group = new THREE.Group();
  private mat = treeMaterial();
  /** Shadow casters only: draws nothing on screen. */
  private shadowMat = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false });
  /** Levels of detail, nearest first. */
  private sets: LodSet[];
  private proxy: LodSet;
  private geos = new Map<number, THREE.BufferGeometry>();
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

  constructor(private trees: TreeList, shadows: boolean) {
    this.ghostDepthMat.depthWrite = true;
    const n = TREE_KINDS * TREE_VARIANTS;
    // the second level casts its own shadows; farther trees are past the shadow map anyway
    this.sets = Array.from({ length: TREE_LODS }, (_, lod) => ({ lod: lod as TreeLod, meshes: new Array(n).fill(null), shadows: shadows && lod === 1, mat: this.mat }));
    this.proxy = { lod: SHADOW_LOD, meshes: new Array(n).fill(null), shadows, mat: this.shadowMat, hidden: !shadows };
  }

  /** The model of variant `mi` at a level of detail (built on first use). */
  private geo(lod: TreeLod, mi: number) {
    const key = lod * 1024 + mi;
    let g = this.geos.get(key);
    if (!g) {
      g = treeGeometry(Math.floor(mi / TREE_VARIANTS), mi % TREE_VARIANTS, lod);
      this.geos.set(key, g);
    }
    return g;
  }

  private makeMesh(set: LodSet, mi: number, cap: number) {
    const m = new THREE.InstancedMesh(this.geo(set.lod, mi), set.mat, cap);
    m.count = 0;
    m.castShadow = set.shadows;
    // lit by the sun and the sky only: shadow maps on the many small leaf faces turn to acne
    m.receiveShadow = false;
    // the instances are already limited to the view radius
    m.frustumCulled = false;
    m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    if (set.hidden) m.visible = false;
    this.group.add(m);
    return m;
  }

  /** Refills the instances around (x, z) out to `radius` once the view has moved enough. */
  update(x: number, z: number, radius: number) {
    if (Math.hypot(x - this.lastX, z - this.lastZ) < 6 && Math.abs(radius - this.lastR) < 8) return;
    this.lastX = x;
    this.lastZ = z;
    this.lastR = radius;
    const L = this.trees;
    const n = TREE_KINDS * TREE_VARIANTS;
    const want = this.sets.map(() => Array.from({ length: n }, () => [] as number[]));
    const lim = LOD_DIST.map((d) => d * d);
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
          let lod = 0;
          while (lod < lim.length && d2 >= lim[lod]) lod++;
          want[lod][L.kind[i] * TREE_VARIANTS + L.variant[i]].push(i);
        }
      }
    this.drawn = 0;
    this.slot.clear();
    this.nearList = want[0].flat();
    this.sets.forEach((set, lod) => this.fill(set, want[lod], lod === 0));
    this.fill(this.proxy, want[0], false);
    // trees fading out stay hidden in the instanced meshes
    for (const g of this.ghosts) this.hide(g.tree);
  }

  private fill(set: LodSet, want: number[][], slots: boolean) {
    want.forEach((list, mi) => {
      let mesh = set.meshes[mi];
      if (!mesh && !list.length) return;
      if (!mesh || list.length > mesh.instanceMatrix.count) {
        // first use or grow: a buffer for this variant with room to spare
        if (mesh) {
          this.group.remove(mesh);
          mesh.dispose();
        }
        mesh = set.meshes[mi] = this.makeMesh(set, mi, Math.max(16, Math.ceil(list.length * 1.5)));
      }
      const m = mesh;
      list.forEach((i, n) => {
        this.matrix(i, _m);
        m.setMatrixAt(n, _m);
        m.setColorAt(n, _c.setScalar(this.tint(i)));
        if (slots) this.slot.set(i, mi * 65536 + n);
      });
      m.count = list.length;
      m.instanceMatrix.needsUpdate = true;
      if (m.instanceColor) m.instanceColor.needsUpdate = true;
      if (set !== this.proxy) this.drawn += list.length;
    });
  }

  private matrix(i: number, out: THREE.Matrix4) {
    const L = this.trees;
    const s = L.scale[i];
    // any turn (organic trees have no grid to line up with)
    _r.makeRotationY((L.turn[i] + (((i * 2246822519) >>> 0) / 4294967296)) * (Math.PI / 2));
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
    const mesh = this.sets[0].meshes[s >> 16];
    if (!mesh) return;
    mesh.setMatrixAt(s & 65535, show ? this.matrix(tree, _m) : _zero);
    mesh.instanceMatrix.needsUpdate = true;
  }

  /** World box of a near tree's model, its crown pulled in a little at the sides. */
  private bounds(i: number, out: THREE.Box3) {
    const L = this.trees;
    const g = this.geo(0, L.kind[i] * TREE_VARIANTS + L.variant[i]);
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
    const geo = this.geo(0, L.kind[i] * TREE_VARIANTS + L.variant[i]);
    const mat = treeMaterial({ transparent: true, depthWrite: false, opacity: 1 });
    mat.color.setScalar(this.tint(i));
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
    for (const set of [...this.sets, this.proxy]) for (const m of set.meshes) m?.dispose();
    for (const g of this.geos.values()) g.dispose();
    for (const g of this.ghosts) (g.color.material as THREE.Material).dispose();
    this.mat.dispose();
    this.shadowMat.dispose();
    this.ghostDepthMat.dispose();
    this.group.clear();
  }
}

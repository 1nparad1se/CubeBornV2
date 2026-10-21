import * as THREE from 'three';
import { hash2 } from '../core/Rng';
import { TREE, treeHeight } from '../world/trees';

/**
 * Blocky tree models: each tree is a set of half-block voxels (trunk, branches, leaves, fruit)
 * meshed with hidden faces dropped, coloured per voxel (no textures). Slightly cubic like the
 * rest of CubeBorn, but shaped per species: oak, spruce, birch, willow, dead tree, fruit tree,
 * small tree and the tall Scots pine. Variants differ in height, trunk and crown.
 */

/** Size of a model voxel in blocks. */
const VOX = 0.5;
const V = VOX;

class Voxels {
  private m = new Map<number, number>();
  /** Key of voxel (i, j, k); i, k in -128..127, j in 0..1023. */
  private key(i: number, j: number, k: number) {
    return ((j & 1023) << 16) | ((i + 128) << 8) | (k + 128);
  }
  put(i: number, j: number, k: number, c: number, over = true) {
    if (j < 0) return;
    const key = this.key(i, j, k);
    if (!over && this.m.has(key)) return;
    this.m.set(key, c);
  }
  has(i: number, j: number, k: number) {
    return this.m.has(this.key(i, j, k));
  }
  get(i: number, j: number, k: number) {
    return this.m.get(this.key(i, j, k));
  }
  each(f: (i: number, j: number, k: number, c: number) => void) {
    for (const [key, c] of this.m) f(((key >> 8) & 255) - 128, (key >> 16) & 1023, (key & 255) - 128, c);
  }
}

/** Deterministic 0..1 random for a tree being built. */
function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (Math.imul(s ^ (s >>> 15), 2246822519) + 0x9e3779b9) >>> 0;
    s ^= s >>> 13;
    return (s >>> 0) / 4294967296;
  };
}

const pick = (list: number[], r: number) => list[Math.min(list.length - 1, Math.floor(r * list.length))];

/** Fills an ellipsoid of leaves (centre and radii in voxels) with a ragged rim. */
function blob(vx: Voxels, cx: number, cy: number, cz: number, rx: number, ry: number, rz: number, colors: number[], seed: number, over = false) {
  for (let j = Math.floor(cy - ry); j <= Math.ceil(cy + ry); j++)
    for (let i = Math.floor(cx - rx); i <= Math.ceil(cx + rx); i++)
      for (let k = Math.floor(cz - rz); k <= Math.ceil(cz + rz); k++) {
        const d = ((i - cx) / rx) ** 2 + ((j - cy) / ry) ** 2 + ((k - cz) / rz) ** 2;
        if (d > 1 + (hash2(i * 7 + k, j, seed) - 0.5) * 0.45) continue;
        vx.put(i, j, k, pick(colors, hash2(i + k * 3, j * 5, seed + 1)), over);
      }
}

/** A line of voxels (branch) from a to b, `w` voxels thick. */
function line(vx: Voxels, a: number[], b: number[], c: number, w = 1) {
  const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])));
  for (let s = 0; s <= n; s++) {
    const t = s / n;
    const x = Math.round(a[0] + (b[0] - a[0]) * t);
    const y = Math.round(a[1] + (b[1] - a[1]) * t);
    const z = Math.round(a[2] + (b[2] - a[2]) * t);
    for (let dx = 0; dx < w; dx++) for (let dz = 0; dz < w; dz++) vx.put(x + dx, y, z + dz, c);
  }
}

/** Square trunk `w` voxels wide from j0 to j1, colour per voxel. */
function trunk(vx: Voxels, w: number, j0: number, j1: number, color: (j: number, i: number, k: number) => number) {
  const o = -Math.floor(w / 2);
  for (let j = j0; j <= j1; j++) for (let i = o; i < o + w; i++) for (let k = o; k < o + w; k++) vx.put(i, j, k, color(j, i, k));
}

const BARK = [0x80583a, 0x704c30, 0x8a6040];
const OAK_LEAF = [0x52a03a, 0x5eae44, 0x4a9234, 0x58a640];
const SPRUCE = [0x34784a, 0x2e6c42, 0x3a8450, 0x327446];
const BIRCH_LEAF = [0x9ccc54, 0x8ec04a, 0xa6d45e, 0x96c650];
const WILLOW = [0xa6cc52, 0x96c246, 0xb0d45c, 0x9ec84e];
const DEAD = [0x8a7a68, 0x7a6c5a, 0x968672];
const FRUIT_LEAF = [0x5aa63e, 0x509a36, 0x62b046];
const PINE_NEEDLE = [0x4a8a40, 0x407c38, 0x529648];

function build(kind: number, variant: number): Voxels {
  const vx = new Voxels();
  const r = rng(kind * 977 + variant * 131 + 7);
  const H = Math.round(treeHeight(kind, variant) / V);
  const seed = kind * 31 + variant * 7;
  switch (kind) {
    case TREE.oak: {
      // a thick trunk splitting into heavy limbs, a broad irregular crown of several clumps
      const tH = Math.round(H * 0.5);
      trunk(vx, 2, 0, tH, (j, i, k) => pick(BARK, hash2(i + j, k, 3)));
      const limbs = 3 + (variant & 1);
      const spread = 3.2 + variant * 0.3;
      for (let b = 0; b < limbs; b++) {
        const a = (b / limbs) * Math.PI * 2 + r() * 0.8;
        const ex = Math.cos(a) * spread;
        const ez = Math.sin(a) * spread;
        const ey = tH + 2 + r() * 3;
        line(vx, [0, tH - 2 - b, 0], [ex, ey, ez], BARK[1]);
        blob(vx, ex, ey + 1.5, ez, 3 + r() * 1.2, 2.2 + r() * 0.6, 3 + r() * 1.2, OAK_LEAF, seed + b);
      }
      blob(vx, 0.5, H - 3.5, 0.5, 4 + variant * 0.3, 3, 4 + variant * 0.3, OAK_LEAF, seed + 9);
      break;
    }
    case TREE.spruce: {
      // a cone of drooping tiers, wider and narrower in turn, bare trunk at the foot
      trunk(vx, 1, 0, H, () => BARK[1]);
      const base = 2 + (variant & 1);
      const R = 4.6 + variant * 0.35;
      for (let j = base; j <= H; j++) {
        const f = (j - base) / (H - base);
        const tier = (j - base) % 3;
        const rad = R * (1 - f) * (tier === 0 ? 1 : tier === 1 ? 0.78 : 0.6) + 0.6;
        for (let i = -Math.ceil(rad); i <= Math.ceil(rad); i++)
          for (let k = -Math.ceil(rad); k <= Math.ceil(rad); k++) {
            const d = Math.hypot(i, k);
            if (d > rad + (hash2(i * 3 + k, j, seed) - 0.5) * 0.9) continue;
            vx.put(i, j, k, pick(SPRUCE, hash2(i + k * 5, j, seed + 1)) + (d > rad - 1 && tier === 0 ? 0x050805 : 0));
          }
      }
      vx.put(0, H + 1, 0, SPRUCE[2]);
      break;
    }
    case TREE.birch: {
      // a slender white trunk with dark marks, a small high oval crown
      const tH = Math.round(H * 0.72);
      trunk(vx, 1, 0, tH, (j) => (hash2(j, 0, seed) < 0.28 ? 0x2a2a2a : hash2(j, 1, seed) < 0.15 ? 0xbcb8ac : 0xe8e6dc));
      blob(vx, 0, H - 3, 0, 2.6 + (variant & 1) * 0.5, 4 + variant * 0.3, 2.6 + (variant >> 1) * 0.5, BIRCH_LEAF, seed);
      blob(vx, r() < 0.5 ? 2 : -2, H - 6, r() < 0.5 ? 1 : -1, 1.6, 1.4, 1.6, BIRCH_LEAF, seed + 2);
      for (let b = 0; b < 2; b++) line(vx, [0, tH - 4 - b * 3, 0], [b ? -2 : 2, tH - 1 - b * 3, b ? 1 : -1], 0xe0ddd2);
      break;
    }
    case TREE.willow: {
      // a short thick trunk, a wide dome and long strands hanging nearly to the ground
      const tH = Math.round(H * 0.5);
      trunk(vx, 2, 0, tH, (j, i, k) => pick(BARK, hash2(i + j, k, 5)));
      const R = 5.4 + variant * 0.3;
      const top = H - 2;
      blob(vx, 0.5, top, 0.5, R, 2.8, R, WILLOW, seed);
      for (let s = 0; s < 30; s++) {
        const a = r() * Math.PI * 2;
        const rr = R * (0.55 + r() * 0.5);
        const x = Math.round(0.5 + Math.cos(a) * rr);
        const z = Math.round(0.5 + Math.sin(a) * rr);
        const len = 3 + Math.floor(r() * (top - 6));
        for (let j = top - 1; j > top - 1 - len && j > 1; j--) vx.put(x, j, z, pick(WILLOW, hash2(x, j, seed + s)), false);
      }
      break;
    }
    case TREE.dead: {
      // a bare grey trunk and crooked forking branches, no leaves
      trunk(vx, 1, 0, H - 2, () => pick(DEAD, r()));
      const branches = 3 + (variant % 3);
      for (let b = 0; b < branches; b++) {
        const j = Math.round(H * (0.35 + (b / branches) * 0.5));
        const a = r() * Math.PI * 2;
        const len = 2.5 + r() * 2.5;
        const end = [Math.cos(a) * len, j + 1.5 + r() * 2, Math.sin(a) * len];
        line(vx, [0, j, 0], end, DEAD[1]);
        // a fork at the end, reaching up
        const a2 = a + (r() - 0.5) * 1.6;
        line(vx, end, [end[0] + Math.cos(a2) * 1.6, end[1] + 2, end[2] + Math.sin(a2) * 1.6], DEAD[2]);
      }
      break;
    }
    case TREE.fruit: {
      // a short trunk, a round crown dotted with fruit (red apples, or orange)
      const tH = Math.round(H * 0.45);
      trunk(vx, 1, 0, tH, () => BARK[0]);
      const R = 3 + variant * 0.2;
      blob(vx, 0, tH + R - 0.5, 0, R, R * 0.85, R, FRUIT_LEAF, seed);
      const fruit = variant % 2 ? [0xf08a24, 0xe87a1c] : [0xd8302a, 0xc42420];
      vx.each((i, j, k) => {
        const surface = !vx.has(i + 1, j, k) || !vx.has(i - 1, j, k) || !vx.has(i, j, k + 1) || !vx.has(i, j, k - 1);
        if (j > tH && surface && hash2(i * 13 + k, j * 7, seed + 4) < 0.1) vx.put(i, j, k, pick(fruit, hash2(i, j, k)));
      });
      break;
    }
    case TREE.small: {
      // a young tree: a thin trunk and a compact crown
      const tH = Math.round(H * 0.55);
      trunk(vx, 1, 0, tH, () => BARK[2]);
      blob(vx, 0, H - 1.5, 0, 1.9 + (variant & 1) * 0.4, 1.9, 1.9 + (variant >> 1) * 0.4, OAK_LEAF.map((c) => c + 0x0a0e04), seed);
      break;
    }
    case TREE.pine: {
      // a long straight trunk, grey low and orange-brown high, side stubs, crown clumps at the top
      trunk(vx, 2, 0, 3, () => 0x8a8278);
      trunk(vx, 1, 4, H, (j) => (j < H * 0.45 ? (hash2(j, 2, seed) < 0.5 ? 0x8a8278 : 0x9a7a5a) : hash2(j, 3, seed) < 0.3 ? 0xa05e2c : 0xb46c34));
      for (let b = 0; b < 3; b++) {
        const j = Math.round(H * (0.4 + b * 0.12));
        const a = r() * Math.PI * 2;
        line(vx, [0, j, 0], [Math.cos(a) * 2, j + 1, Math.sin(a) * 2], 0x8a6a4a);
      }
      const clumps = 4 + (variant % 2);
      for (let c = 0; c < clumps; c++) {
        const f = c / clumps;
        const j = H * (0.68 + f * 0.27);
        const a = r() * Math.PI * 2;
        const d = (1 - f) * (2 + r() * 1.5);
        const cx = Math.cos(a) * d;
        const cz = Math.sin(a) * d;
        line(vx, [0, Math.round(j - 1), 0], [cx, j, cz], 0xa05e2c);
        blob(vx, cx, j + 0.5, cz, 2.6 - f + r() * 0.8, 1.2 + r() * 0.4, 2.6 - f + r() * 0.8, PINE_NEEDLE, seed + c);
      }
      blob(vx, 0, H + 1, 0, 1.4, 1.6, 1.4, PINE_NEEDLE, seed + 20);
      break;
    }
  }
  return vx;
}

const FACES: [number, number, number, number[][], number][] = [
  [1, 0, 0, [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]], 0.86],
  [-1, 0, 0, [[0, 0, 1], [0, 1, 1], [0, 1, 0], [0, 0, 0]], 0.86],
  [0, 1, 0, [[0, 1, 0], [0, 1, 1], [1, 1, 1], [1, 1, 0]], 1],
  [0, -1, 0, [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]], 0.7],
  [0, 0, 1, [[1, 0, 1], [1, 1, 1], [0, 1, 1], [0, 0, 1]], 0.92],
  [0, 0, -1, [[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]], 0.92],
];

/**
 * The far version of a tree: voxels twice the size, each kept where at least three of its eight
 * small voxels were (thin trunks always kept), in their most common colour. About a quarter of
 * the faces, for trees far from the camera.
 */
function coarse(vx: Voxels): Voxels {
  const cells = new Map<string, number[]>();
  vx.each((i, j, k, c) => {
    const key = `${i >> 1},${j >> 1},${k >> 1}`;
    const l = cells.get(key) ?? [];
    l.push(c);
    cells.set(key, l);
  });
  const out = new Voxels();
  const trunkish = new Set([...BARK, ...DEAD, 0x8a8278, 0xa05e2c, 0xb46c34, 0x9a7a5a, 0xe8e6dc, 0x2a2a2a, 0xbcb8ac, 0xe0ddd2, 0x8a6a4a]);
  for (const [key, l] of cells) {
    if (l.length < 3 && !l.some((c) => trunkish.has(c))) continue;
    const [i, j, k] = key.split(',').map(Number);
    const count = new Map<number, number>();
    for (const c of l) count.set(c, (count.get(c) ?? 0) + 1);
    let best = l[0];
    for (const [c, n] of count) if (n > (count.get(best) ?? 0)) best = c;
    out.put(i, j, k, best);
  }
  return out;
}

/**
 * Mesh of one species variant: base of the trunk at the origin, y up, blocks as units. `far`
 * gives the coarse version (whole-block voxels) for distant trees.
 */
export function treeGeometry(kind: number, variant: number, far = false): THREE.BufferGeometry {
  const fine = build(kind, variant);
  const vx = far ? coarse(fine) : fine;
  const V = far ? VOX * 2 : VOX;
  const pos: number[] = [];
  const nor: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];
  const c = new THREE.Color();
  vx.each((i, j, k, hex) => {
    for (const [nx, ny, nz, quad, shade] of FACES) {
      if (vx.has(i + nx, j + ny, k + nz)) continue;
      c.setHex(hex).convertSRGBToLinear();
      // a touch of per-voxel variety so the crowns read as clumps of leaves
      const v = shade * (0.94 + hash2(i * 3 + k, j, 41) * 0.1);
      const b = pos.length / 3;
      for (const q of quad) {
        pos.push((i + q[0]) * V, (j + q[1]) * V, (k + q[2]) * V);
        nor.push(nx, ny, nz);
        col.push(c.r * v, c.g * v, c.b * v);
      }
      idx.push(b, b + 1, b + 2, b, b + 2, b + 3);
    }
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeBoundingSphere();
  return g;
}

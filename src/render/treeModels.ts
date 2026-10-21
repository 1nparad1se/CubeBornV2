import * as THREE from 'three';
import { TREE, TREE_SPECS, treeHeight } from '../world/trees';

/**
 * Blocky tree models. Each species variant is first described as a few primitives in block units
 * (trunk boxes, branch segments, leaf clumps, spruce cones, fruit), then rasterized into voxel
 * grids and meshed with hidden faces dropped and same-coloured faces merged. The near model uses
 * leaf and trunk voxels of 1/6 block and branch voxels of 1/8 block: small cubes, so crowns have
 * ragged edges, little gaps and thin twigs while staying cubic. The same primitives give the
 * coarser models for distant trees (1/2 and 1 block voxels), so all three have one silhouette.
 */

/** Voxel sizes (blocks) of the near model's leaves and trunk, and of its branches. */
export const LEAF_VOX = 1 / 6;
export const BRANCH_VOX = 1 / 8;
/** Level of detail: near (1/6 and 1/8 voxels), mid (1/2) and far (1). */
export type TreeLod = 0 | 1 | 2;
const LOD_RES = [LEAF_VOX, 0.5, 1];

// ---------- noise ----------

function h3(x: number, y: number, z: number, s: number): number {
  let h = (Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(z | 0, 1274126177) ^ Math.imul(s | 0, 2246822519)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

/** Smooth 3D value noise in [0,1). */
function noise3(x: number, y: number, z: number, s: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  let fx = x - xi;
  let fy = y - yi;
  let fz = z - zi;
  fx = fx * fx * (3 - 2 * fx);
  fy = fy * fy * (3 - 2 * fy);
  fz = fz * fz * (3 - 2 * fz);
  const a0 = h3(xi, yi, zi, s);
  const a1 = h3(xi + 1, yi, zi, s);
  const b0 = h3(xi, yi + 1, zi, s);
  const b1 = h3(xi + 1, yi + 1, zi, s);
  const c0 = h3(xi, yi, zi + 1, s);
  const c1 = h3(xi + 1, yi, zi + 1, s);
  const d0 = h3(xi, yi + 1, zi + 1, s);
  const d1 = h3(xi + 1, yi + 1, zi + 1, s);
  const e = a0 + (a1 - a0) * fx;
  const f = b0 + (b1 - b0) * fx;
  const g = c0 + (c1 - c0) * fx;
  const h = d0 + (d1 - d0) * fx;
  const lo = e + (f - e) * fy;
  return lo + (g + (h - g) * fy - lo) * fz;
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

/** A colour darkened (or lightened) by k. */
function tone(hex: number, k: number): number {
  const r = Math.min(255, Math.round(((hex >> 16) & 255) * k));
  const g = Math.min(255, Math.round(((hex >> 8) & 255) * k));
  const b = Math.min(255, Math.round((hex & 255) * k));
  return (r << 16) | (g << 8) | b;
}

// ---------- primitives ----------

type Vec = [number, number, number];
type ColorFn = (x: number, y: number, z: number) => number;

interface Box {
  t: 'box';
  min: Vec;
  max: Vec;
  color: ColorFn;
}
/** A branch (wood grid) or a hanging strand (leaf grid), `w` blocks thick. */
interface Seg {
  t: 'seg';
  a: Vec;
  b: Vec;
  w: number;
  color: ColorFn;
  leaf?: boolean;
}
/** A leaf clump: a ragged ellipsoid with gaps near its surface. */
interface Blob {
  t: 'blob';
  c: Vec;
  r: Vec;
  pal: number[];
  seed: number;
  /** Edge raggedness (fraction of the radius) and how much of the outer shell opens up. */
  rough: number;
  gaps: number;
}
/** Spruce needles: a cone of drooping tiers around the trunk. */
interface Cone {
  t: 'cone';
  y0: number;
  y1: number;
  r: number;
  tier: number;
  pal: number[];
  seed: number;
}
type Prim = Box | Seg | Blob | Cone;

interface Shape {
  prims: Prim[];
  /** Fruit colours and how often a surface clump carries one. */
  fruit?: { pal: number[]; rate: number };
}

// ---------- voxel grid ----------

const EMPTY = -1;
const WOOD = 1;
const LEAF = 2;

/**
 * A dense voxel grid of `res` blocks. With `centred`, a voxel is centred on x = z = 0 (odd trunk
 * widths); otherwise voxel edges meet there (even widths).
 */
class Grid {
  readonly sh: number;
  readonly i0: number;
  readonly k0: number;
  readonly nx: number;
  readonly ny: number;
  readonly nz: number;
  readonly c: Int32Array;
  readonly kind: Uint8Array;

  constructor(readonly res: number, centred: boolean, half: number, height: number) {
    this.sh = centred ? 0.5 : 0;
    this.i0 = Math.floor(-half / res + this.sh) - 1;
    this.k0 = this.i0;
    this.nx = this.nz = Math.ceil(half / res + this.sh) + 1 - this.i0;
    this.ny = Math.ceil(height / res) + 2;
    this.c = new Int32Array(this.nx * this.ny * this.nz).fill(EMPTY);
    this.kind = new Uint8Array(this.nx * this.ny * this.nz);
  }

  /** Local index of the voxel holding x (and z). */
  ix(x: number) {
    return Math.floor(x / this.res + this.sh) - this.i0;
  }
  iy(y: number) {
    return Math.floor(y / this.res);
  }
  /** Centre (blocks) of local voxel i (and k). */
  cx(i: number) {
    return (i + this.i0 - this.sh + 0.5) * this.res;
  }
  cy(j: number) {
    return (j + 0.5) * this.res;
  }
  idx(i: number, j: number, k: number) {
    return (j * this.nz + k) * this.nx + i;
  }
  inside(i: number, j: number, k: number) {
    return i >= 0 && j >= 0 && k >= 0 && i < this.nx && j < this.ny && k < this.nz;
  }
  get(i: number, j: number, k: number) {
    return this.inside(i, j, k) ? this.c[this.idx(i, j, k)] : EMPTY;
  }
  put(i: number, j: number, k: number, c: number, kind: number, over: boolean) {
    if (!this.inside(i, j, k)) return;
    const n = this.idx(i, j, k);
    if (!over && this.c[n] !== EMPTY) return;
    this.c[n] = c;
    this.kind[n] = kind;
  }
  /** Range of local voxels whose centres lie in [a, b] (at least the nearest one). */
  span(a: number, b: number, y: boolean): [number, number] {
    const s = y ? 0 : this.sh;
    const o = y ? 0 : this.i0;
    let i0 = Math.ceil(a / this.res + s - 0.5 - 1e-6);
    let i1 = Math.floor(b / this.res + s - 0.5 + 1e-6);
    if (i1 < i0) i0 = i1 = Math.round((a + b) / 2 / this.res + s - 0.5);
    return [i0 - o, i1 - o];
  }
}

/** Fills a box of voxels. */
function box(g: Grid, p: Box) {
  const [i0, i1] = g.span(p.min[0], p.max[0], false);
  const [j0, j1] = g.span(Math.max(0, p.min[1]), p.max[1], true);
  const [k0, k1] = g.span(p.min[2], p.max[2], false);
  for (let j = j0; j <= j1; j++)
    for (let k = k0; k <= k1; k++) for (let i = i0; i <= i1; i++) g.put(i, j, k, p.color(g.cx(i), g.cy(j), g.cx(k)), WOOD, true);
}

/** Draws a segment as a face-connected run of `w`-wide voxel cubes (stair steps on diagonals). */
function seg(g: Grid, p: Seg) {
  const wv = Math.max(1, Math.round(p.w / g.res));
  const o = Math.floor((wv - 1) / 2);
  const [ax, ay, az] = p.a;
  const [bx, by, bz] = p.b;
  const len = Math.hypot(bx - ax, by - ay, bz - az);
  const steps = Math.max(1, Math.ceil(len / (g.res * 0.4)));
  const kind = p.leaf ? LEAF : WOOD;
  let li = NaN;
  let lj = NaN;
  let lk = NaN;
  const cube = (i: number, j: number, k: number) => {
    const c = p.color(g.cx(i), g.cy(j), g.cx(k));
    for (let dj = 0; dj < wv; dj++)
      for (let dk = 0; dk < wv; dk++) for (let di = 0; di < wv; di++) g.put(i - o + di, j - o + dj, k - o + dk, c, kind, !p.leaf);
  };
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const i = g.ix(ax + (bx - ax) * t);
    const j = g.iy(ay + (by - ay) * t);
    const k = g.ix(az + (bz - az) * t);
    if (i === li && j === lj && k === lk) continue;
    if (!Number.isNaN(li)) {
      // step one axis at a time so the run stays face-connected
      if (i !== li) cube((li = i), lj, lk);
      if (j !== lj) cube(li, (lj = j), lk);
      if (k !== lk) cube(li, lj, (lk = k));
    } else {
      li = i;
      lj = j;
      lk = k;
      cube(i, j, k);
    }
  }
}

/** A leaf colour for a point: clumps of half a block share a colour, lower and inner leaves darker. */
function leafColor(pal: number[], seed: number, x: number, y: number, z: number, lowK: number, inner: boolean) {
  const base = pick(pal, h3(Math.floor(x * 2 + 64), Math.floor(y * 2.4), Math.floor(z * 2 + 64), seed));
  const k = inner ? 0.7 : 0.88 + Math.round(Math.min(1, Math.max(0, lowK)) * 3) * 0.06;
  return tone(base, k);
}

function blob(g: Grid, p: Blob) {
  const [cx, cy, cz] = p.c;
  const [rx, ry, rz] = p.r;
  const fine = g.res < 0.3;
  const m = 1 + p.rough * 0.6;
  const [i0, i1] = g.span(cx - rx * m, cx + rx * m, false);
  const [j0, j1] = g.span(Math.max(0, cy - ry * m), cy + ry * m, true);
  const [k0, k1] = g.span(cz - rz * m, cz + rz * m, false);
  for (let j = j0; j <= j1; j++) {
    const y = g.cy(j);
    for (let k = k0; k <= k1; k++) {
      const z = g.cx(k);
      for (let i = i0; i <= i1; i++) {
        const x = g.cx(i);
        const d = Math.sqrt(((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + ((z - cz) / rz) ** 2);
        if (d > m) continue;
        // broad bumps (clumps sticking out, dents) and, on the near model, small ragged leaves
        let edge = 1 + (noise3(x / 0.8, y / 0.8, z / 0.8, p.seed) - 0.5) * p.rough * 1.3;
        if (fine) edge += (noise3(x / 0.28, y / 0.28, z / 0.28, p.seed + 3) - 0.5) * 0.22;
        else edge += 0.04;
        if (d > edge) continue;
        if (fine && p.gaps > 0) {
          // gaps between the clumps: pockets in the outer shell and a few holes deeper in
          if (d > edge - 0.32 && noise3(x / 0.42, y / 0.42, z / 0.42, p.seed + 7) < p.gaps) continue;
          if (d > 0.35 && noise3(x / 0.9, y / 0.9, z / 0.9, p.seed + 9) < p.gaps * 0.45) continue;
        }
        const inner = d < edge - 0.42;
        g.put(i, j, k, leafColor(p.pal, p.seed, x, y, z, (y - (cy - ry)) / (2 * ry), inner), LEAF, false);
      }
    }
  }
}

function cone(g: Grid, p: Cone) {
  const fine = g.res < 0.3;
  const R = p.r * 1.25;
  const [i0, i1] = g.span(-R, R, false);
  const [j0, j1] = g.span(p.y0, p.y1, true);
  for (let j = j0; j <= j1; j++) {
    const y = g.cy(j);
    const f = (y - p.y0) / (p.y1 - p.y0);
    for (let k = i0; k <= i1; k++) {
      const z = g.cx(k);
      for (let i = i0; i <= i1; i++) {
        const x = g.cx(i);
        const d = Math.hypot(x, z);
        // tiers: each starts wide at its foot and narrows up to the next; outer twigs droop
        const ph = (((y + d * 0.28 - p.y0) / p.tier) % 1 + 1) % 1;
        let rad = p.r * (1 - f) * (1 - ph * 0.45) + 0.28;
        rad += (noise3(x / 0.7, y / 0.5, z / 0.7, p.seed) - 0.5) * 0.7;
        if (fine) rad += (noise3(x / 0.25, y / 0.25, z / 0.25, p.seed + 1) - 0.5) * 0.3;
        if (d > rad) continue;
        if (fine && d > rad - 0.35 && noise3(x / 0.4, y / 0.4, z / 0.4, p.seed + 5) < 0.3) continue;
        const inner = d < rad - 0.5;
        g.put(i, j, k, leafColor(p.pal, p.seed, x, y, z, 0.35 + (1 - ph) * 0.65, inner), LEAF, false);
      }
    }
  }
}

/** Paints fruit on surface leaves: a 2-voxel clump on the near model, one voxel on the coarse ones. */
function fruit(g: Grid, f: NonNullable<Shape['fruit']>) {
  const cell = g.res < 0.3 ? 2 : 1;
  const out: number[] = [];
  for (let j = 0; j < g.ny; j++)
    for (let k = 0; k < g.nz; k++)
      for (let i = 0; i < g.nx; i++) {
        const n = g.idx(i, j, k);
        if (g.kind[n] !== LEAF) continue;
        const ci = Math.floor((i + g.i0) / cell);
        const cj = Math.floor(j / cell);
        const ck = Math.floor((k + g.k0) / cell);
        if (h3(ci, cj, ck, 77) >= f.rate * (cell === 2 ? 0.5 : 1)) continue;
        if (g.get(i + 1, j, k) >= 0 && g.get(i - 1, j, k) >= 0 && g.get(i, j, k + 1) >= 0 && g.get(i, j, k - 1) >= 0 && g.get(i, j - 1, k) >= 0) continue;
        out.push(n, pick(f.pal, h3(ci, cj, ck, 78)));
      }
  for (let q = 0; q < out.length; q += 2) g.c[out[q]] = out[q + 1];
}

// ---------- species ----------

const BARK = [0x80583a, 0x704c30, 0x8a6040];
const OAK_LEAF = [0x52a03a, 0x5eae44, 0x4a9234, 0x58a640];
const SPRUCE = [0x34784a, 0x2e6c42, 0x3a8450, 0x327446];
const BIRCH_LEAF = [0x9ccc54, 0x8ec04a, 0xa6d45e, 0x96c650];
const WILLOW = [0xa6cc52, 0x96c246, 0xb0d45c, 0x9ec84e];
const DEAD = [0x8a7a68, 0x7a6c5a, 0x968672];
const FRUIT_LEAF = [0x5aa63e, 0x509a36, 0x62b046];
const PINE_NEEDLE = [0x4a8a40, 0x407c38, 0x529648];
const SMALL_LEAF = OAK_LEAF.map((c) => c + 0x0a0e04);

/** Bark in vertical streaks of 1/6 x 1/3 block. */
const bark =
  (pal: number[], seed: number): ColorFn =>
  (x, y, z) =>
    pick(pal, h3(Math.floor(x * 6 + 50), Math.floor(y * 3), Math.floor(z * 6 + 50), seed));
const flat =
  (c: number): ColorFn =>
  () =>
    c;

function build(kind: number, variant: number): Shape {
  const r = rng(kind * 977 + variant * 131 + 7);
  const h = treeHeight(kind, variant);
  const seed = kind * 31 + variant * 7;
  const P: Prim[] = [];
  const shape: Shape = { prims: P };
  const trunk = (w: number, y0: number, y1: number, color: ColorFn) =>
    P.push({ t: 'box', min: [-w / 2, y0, -w / 2], max: [w / 2, y1, w / 2], color });
  const branch = (a: Vec, b: Vec, w: number, color: ColorFn) => P.push({ t: 'seg', a, b, w, color });
  const leaves = (c: Vec, rr: Vec, pal: number[], s: number, rough = 0.32, gaps = 0.3) =>
    P.push({ t: 'blob', c, r: rr, pal, seed: s, rough, gaps });
  /** A limb from `a` to `b`: thick at the base, thin at the tip, with a twig or two. */
  const limb = (a: Vec, b: Vec, color: ColorFn, twigs = 2) => {
    const m: Vec = [a[0] + (b[0] - a[0]) * 0.55, a[1] + (b[1] - a[1]) * 0.55, a[2] + (b[2] - a[2]) * 0.55];
    branch(a, m, 0.25, color);
    branch(m, b, 0.125, color);
    for (let t = 0; t < twigs; t++) {
      const from = t ? b : m;
      const ang = r() * Math.PI * 2;
      const l = 0.35 + r() * 0.45;
      branch(from, [from[0] + Math.cos(ang) * l, from[1] + 0.2 + r() * 0.35, from[2] + Math.sin(ang) * l], 0.125, color);
    }
  };
  /** Small clumps around a crown so its outline is never a clean ellipsoid. */
  const satellites = (c: Vec, rr: Vec, n: number, pal: number[], size: number) => {
    for (let s = 0; s < n; s++) {
      const a = r() * Math.PI * 2;
      const e = (r() - 0.35) * 1.2;
      const p: Vec = [c[0] + Math.cos(a) * rr[0] * 0.9, c[1] + e * rr[1] * 0.8, c[2] + Math.sin(a) * rr[2] * 0.9];
      const q = size * (0.7 + r() * 0.5);
      leaves(p, [q, q * 0.8, q], pal, seed + 40 + s, 0.4, 0.2);
    }
  };

  switch (kind) {
    case TREE.oak: {
      // a thick trunk splitting into heavy limbs, a broad irregular crown of several clumps
      const tH = h * 0.5;
      const col = bark(BARK, 3);
      trunk(1, 0, tH, col);
      trunk(2 / 3, tH - 0.5, tH + 0.7, col);
      // root flare
      for (let s = 0; s < 4; s++) {
        const a = (s / 4) * Math.PI * 2 + r() * 0.6;
        const x = Math.cos(a) * 0.55;
        const z = Math.sin(a) * 0.55;
        P.push({ t: 'box', min: [x - 0.17, 0, z - 0.17], max: [x + 0.17, 0.2 + r() * 0.25, z + 0.17], color: col });
      }
      const limbs = 3 + (variant & 1);
      const spread = 1.6 + variant * 0.15;
      for (let b = 0; b < limbs; b++) {
        const a = (b / limbs) * Math.PI * 2 + r() * 0.8;
        const ex = Math.cos(a) * spread;
        const ez = Math.sin(a) * spread;
        const ey = tH + 1 + r() * 1.5;
        limb([0, tH - 1 - b * 0.5, 0], [ex, ey, ez], col);
        leaves([ex, ey + 0.75, ez], [1.5 + r() * 0.6, 1.1 + r() * 0.3, 1.5 + r() * 0.6], OAK_LEAF, seed + b);
      }
      const top: Vec = [0.25, h - 1.75, 0.25];
      const tr: Vec = [2 + variant * 0.15, 1.5, 2 + variant * 0.15];
      leaves(top, tr, OAK_LEAF, seed + 9);
      satellites(top, tr, 5, OAK_LEAF, 0.7);
      break;
    }
    case TREE.spruce: {
      // a cone of drooping tiers, wider and narrower in turn, bare trunk at the foot
      trunk(0.5, 0, h, bark(BARK.map((c) => tone(c, 0.9)), 4));
      const base = 1 + (variant & 1) * 0.5;
      const R = 2.3 + variant * 0.18;
      P.push({ t: 'cone', y0: base, y1: h + 0.2, r: R, tier: 1.5, pal: SPRUCE, seed });
      // the lowest branches show under the tiers
      for (let y = base; y < h * 0.6; y += 0.75) {
        const a = r() * Math.PI * 2;
        const l = R * (1 - (y - base) / (h - base)) * 0.8;
        branch([0, y, 0], [Math.cos(a) * l, y - 0.25, Math.sin(a) * l], 0.125, flat(BARK[1]));
      }
      P.push({ t: 'box', min: [-0.09, h, -0.09], max: [0.09, h + 0.6, 0.09], color: flat(SPRUCE[2]) });
      break;
    }
    case TREE.birch: {
      // a slender white trunk with dark marks, a small high oval crown of loose clumps
      const tH = h * 0.72;
      const white: ColorFn = (x, y, z) => {
        const band = Math.floor(y * 4);
        const side = Math.floor((x + z) * 6 + 50);
        return h3(band, side, 0, seed) < 0.24 ? 0x2a2a2a : h3(band, side, 1, seed) < 0.15 ? 0xbcb8ac : 0xe8e6dc;
      };
      trunk(0.5, 0, tH, white);
      const top: Vec = [0, h - 1.5, 0];
      const tr: Vec = [1.3 + (variant & 1) * 0.25, 2 + variant * 0.15, 1.3 + (variant >> 1) * 0.25];
      leaves(top, tr, BIRCH_LEAF, seed, 0.38, 0.34);
      satellites(top, tr, 4, BIRCH_LEAF, 0.55);
      const sx = r() < 0.5 ? 1 : -1;
      const sz = r() < 0.5 ? 0.5 : -0.5;
      leaves([sx, h - 3, sz], [0.8, 0.7, 0.8], BIRCH_LEAF, seed + 2, 0.4, 0.3);
      limb([0, tH - 2, 0], [sx, h - 3.2, sz], flat(0xe0ddd2), 1);
      limb([0, tH - 1.2, 0], [-sx * 0.9, tH + 0.2, -sz], flat(0xe0ddd2), 1);
      break;
    }
    case TREE.willow: {
      // a short thick trunk, a wide dome and long strands hanging nearly to the ground
      const tH = h * 0.5;
      const col = bark(BARK, 5);
      trunk(1, 0, tH, col);
      const R = 2.7 + variant * 0.15;
      const top = h - 1;
      for (let b = 0; b < 4; b++) {
        const a = (b / 4) * Math.PI * 2 + r();
        limb([0, tH - 0.3, 0], [Math.cos(a) * R * 0.6, top - 0.2, Math.sin(a) * R * 0.6], col, 1);
      }
      leaves([0, top, 0], [R, 1.4, R], WILLOW, seed, 0.3, 0.26);
      satellites([0, top, 0], [R, 1.4, R], 4, WILLOW, 0.8);
      for (let s = 0; s < 46; s++) {
        const a = r() * Math.PI * 2;
        const rr = R * (0.5 + r() * 0.55);
        const x = Math.cos(a) * rr;
        const z = Math.sin(a) * rr;
        const len = 1.5 + r() * (top - 3.2);
        const w = r() < 0.6 ? 1 / 6 : 1 / 3;
        const sw = (r() - 0.5) * 0.3;
        const pal = WILLOW.map((c) => tone(c, 0.92 + r() * 0.12));
        // a strand in two pieces with a slight bend
        const mid: Vec = [x + sw, top - 0.5 - len * 0.5, z - sw];
        const ps = { t: 'seg' as const, w, leaf: true, color: (px: number, py: number, pz: number) => pick(pal, h3(Math.floor(px * 3), Math.floor(py * 2), s, seed)) };
        P.push({ ...ps, a: [x, top - 0.3, z], b: mid }, { ...ps, a: mid, b: [x + sw * 2, Math.max(0.6, top - 0.5 - len), z - sw] });
      }
      break;
    }
    case TREE.dead: {
      // a bare grey trunk and crooked forking branches, no leaves
      const col = bark(DEAD, 6);
      trunk(0.5, 0, h - 1, col);
      const branches = 3 + (variant % 3);
      for (let b = 0; b < branches; b++) {
        const y = h * (0.35 + (b / branches) * 0.5);
        const a = r() * Math.PI * 2;
        const len = 1.25 + r() * 1.25;
        const end: Vec = [Math.cos(a) * len, y + 0.75 + r(), Math.sin(a) * len];
        const m: Vec = [end[0] * 0.5, (y + end[1]) / 2 + (r() - 0.3) * 0.3, end[2] * 0.5];
        branch([0, y, 0], m, 0.25, col);
        branch(m, end, 0.25, col);
        // forks at the end and halfway, reaching up
        const a2 = a + (r() - 0.5) * 1.6;
        branch(end, [end[0] + Math.cos(a2) * 0.8, end[1] + 1, end[2] + Math.sin(a2) * 0.8], 0.125, col);
        const a3 = a - (r() - 0.2) * 1.4;
        branch(end, [end[0] + Math.cos(a3) * 0.6, end[1] + 0.4, end[2] + Math.sin(a3) * 0.6], 0.125, col);
        const a4 = a + (r() - 0.5) * 2;
        branch(m, [m[0] + Math.cos(a4) * 0.6, m[1] + 0.6, m[2] + Math.sin(a4) * 0.6], 0.125, col);
      }
      branch([0, h - 1, 0], [(r() - 0.5) * 0.8, h - 0.1, (r() - 0.5) * 0.8], 0.125, col);
      break;
    }
    case TREE.fruit: {
      // a short trunk, a round crown dotted with fruit (red apples, or orange)
      const tH = h * 0.45;
      const col = bark(BARK, 7);
      trunk(0.5, 0, tH, col);
      const R = 1.5 + variant * 0.1;
      const c: Vec = [0, tH + R - 0.25, 0];
      for (let b = 0; b < 3; b++) {
        const a = (b / 3) * Math.PI * 2 + r();
        limb([0, tH - 0.3, 0], [Math.cos(a) * R * 0.6, c[1] + 0.2, Math.sin(a) * R * 0.6], col, 1);
      }
      leaves(c, [R, R * 0.85, R], FRUIT_LEAF, seed, 0.34, 0.26);
      satellites(c, [R, R * 0.85, R], 4, FRUIT_LEAF, 0.55);
      shape.fruit = { pal: variant % 2 ? [0xf08a24, 0xe87a1c] : [0xd8302a, 0xc42420], rate: 0.1 };
      break;
    }
    case TREE.small: {
      // a young tree: a thin trunk and a compact crown
      const tH = h * 0.55;
      const col = bark(BARK.map((c) => tone(c, 1.06)), 8);
      trunk(1 / 3, 0, tH, col);
      const c: Vec = [0, h - 0.75, 0];
      const cr: Vec = [0.95 + (variant & 1) * 0.2, 0.95, 0.95 + (variant >> 1) * 0.2];
      limb([0, tH - 0.5, 0], [0.5, tH + 0.4, 0.2], col, 1);
      leaves(c, cr, SMALL_LEAF, seed, 0.36, 0.26);
      satellites(c, cr, 3, SMALL_LEAF, 0.4);
      break;
    }
    case TREE.pine: {
      // a long straight trunk, grey low and orange-brown high, side stubs, crown pads at the top
      trunk(1, 0, 1.5, bark([0x8a8278, 0x7e766c, 0x948c80], 9));
      const high = bark([0xa05e2c, 0xb46c34, 0xa86630], 10);
      const low = bark([0x8a8278, 0x9a7a5a, 0x8a8278], 11);
      trunk(0.5, 1.5, h, (x, y, z) => (y < h * 0.45 ? low(x, y, z) : high(x, y, z)));
      for (let b = 0; b < 4; b++) {
        const y = h * (0.38 + b * 0.09);
        const a = r() * Math.PI * 2;
        branch([0, y, 0], [Math.cos(a) * 0.9, y + 0.3, Math.sin(a) * 0.9], 0.125, flat(0x8a6a4a));
      }
      const clumps = 4 + (variant % 2);
      for (let c = 0; c < clumps; c++) {
        const f = c / clumps;
        const y = h * (0.68 + f * 0.27);
        const a = r() * Math.PI * 2;
        const d = (1 - f) * (1 + r() * 0.75);
        const cx = Math.cos(a) * d;
        const cz = Math.sin(a) * d;
        limb([0, y - 0.5, 0], [cx, y, cz], high, 1);
        const q = 1.3 - f * 0.5 + r() * 0.4;
        leaves([cx, y + 0.25, cz], [q, 0.6 + r() * 0.2, q], PINE_NEEDLE, seed + c, 0.45, 0.3);
      }
      leaves([0, h + 0.5, 0], [0.7, 0.8, 0.7], PINE_NEEDLE, seed + 20, 0.4, 0.2);
      break;
    }
  }
  return shape;
}

// ---------- meshing ----------

/** Face brightness by direction (+x, -x, +y, -y, +z, -z). */
const SHADE = [0.86, 0.86, 1, 0.7, 0.92, 0.92];

interface Out {
  pos: number[];
  nor: number[];
  col: number[];
  idx: number[];
}

/** Greedy meshing: visible faces of one colour in a plane merge into larger quads. */
function mesh(g: Grid, out: Out) {
  const dims = [g.nx, g.ny, g.nz];
  // only the occupied part of the grid is scanned
  const lo = [g.nx, g.ny, g.nz];
  const hi = [-1, -1, -1];
  for (let j = 0; j < g.ny; j++)
    for (let k = 0; k < g.nz; k++)
      for (let i = 0; i < g.nx; i++) {
        if (g.c[g.idx(i, j, k)] < 0) continue;
        if (i < lo[0]) lo[0] = i;
        if (i > hi[0]) hi[0] = i;
        if (j < lo[1]) lo[1] = j;
        if (j > hi[1]) hi[1] = j;
        if (k < lo[2]) lo[2] = k;
        if (k > hi[2]) hi[2] = k;
      }
  if (hi[0] < 0) return;
  const res = g.res;
  const stride = [1, g.nz * g.nx, g.nx];
  // corner offsets of the local grid in blocks
  const org = [(g.i0 - g.sh) * res, 0, (g.k0 - g.sh) * res];
  const col = new THREE.Color();
  const cells = g.c;
  for (let d = 0; d < 3; d++) {
    const u = (d + 1) % 3;
    const v = (d + 2) % 3;
    const W = hi[u] - lo[u] + 1;
    const Hh = hi[v] - lo[v] + 1;
    const mask = new Float64Array(W * Hh);
    const sd = stride[d];
    const su = stride[u];
    const sv = stride[v];
    for (let xd = lo[d] - 1; xd <= hi[d]; xd++) {
      const okA = xd >= 0;
      const okB = xd + 1 < dims[d];
      let n = 0;
      for (let j = 0; j < Hh; j++) {
        let base = xd * sd + (lo[v] + j) * sv + lo[u] * su;
        for (let i = 0; i < W; i++, base += su) {
          const a = okA ? cells[base] : EMPTY;
          const b = okB ? cells[base + sd] : EMPTY;
          mask[n++] = (a >= 0) === (b >= 0) ? 0 : a >= 0 ? a + 1 : -(b + 1);
        }
      }
      n = 0;
      for (let j = 0; j < Hh; j++)
        for (let i = 0; i < W; ) {
          const c = mask[n];
          if (!c) {
            i++;
            n++;
            continue;
          }
          let w = 1;
          while (i + w < W && mask[n + w] === c) w++;
          let hh = 1;
          grow: for (; j + hh < Hh; hh++)
            for (let k = 0; k < w; k++) if (mask[n + k + hh * W] !== c) break grow;
          const p = [0, 0, 0];
          p[d] = xd + 1;
          p[u] = lo[u] + i;
          p[v] = lo[v] + j;
          const du = [0, 0, 0];
          const dv = [0, 0, 0];
          du[u] = w;
          dv[v] = hh;
          const pos = c > 0;
          const hex = (pos ? c : -c) - 1;
          const face = d * 2 + (pos ? 0 : 1);
          col.setHex(hex).convertSRGBToLinear();
          const s = SHADE[face];
          const corners = pos
            ? [p, add(p, du), add(add(p, du), dv), add(p, dv)]
            : [p, add(p, dv), add(add(p, du), dv), add(p, du)];
          const b0 = out.pos.length / 3;
          const sign = pos ? 1 : -1;
          for (const cn of corners) {
            out.pos.push(org[0] + cn[0] * res, org[1] + cn[1] * res, org[2] + cn[2] * res);
            out.nor.push(d === 0 ? sign : 0, d === 1 ? sign : 0, d === 2 ? sign : 0);
            out.col.push(col.r * s, col.g * s, col.b * s);
          }
          out.idx.push(b0, b0 + 1, b0 + 2, b0, b0 + 2, b0 + 3);
          for (let l = 0; l < hh; l++) for (let k = 0; k < w; k++) mask[n + k + l * W] = 0;
          i += w;
          n += w;
        }
    }
  }
}

const add = (a: number[], b: number[]) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

/** Horizontal reach and height (blocks) a species variant may fill. */
function extent(shape: Shape): [number, number] {
  let half = 1;
  let top = 1;
  const grow = (p: Vec, m: number) => {
    half = Math.max(half, Math.abs(p[0]) + m, Math.abs(p[2]) + m);
    top = Math.max(top, p[1] + m);
  };
  for (const p of shape.prims) {
    if (p.t === 'box') (grow(p.min, 0.1), grow(p.max, 0.1));
    else if (p.t === 'seg') (grow(p.a, p.w + 0.1), grow(p.b, p.w + 0.1));
    else if (p.t === 'blob') grow(p.c, Math.max(...p.r) * 1.3 + 0.2);
    else (grow([0, p.y1, 0], 0.4), (half = Math.max(half, p.r * 1.3 + 0.8)));
  }
  return [half + 1, top + 1];
}

const shapes = new Map<number, Shape>();

/**
 * Mesh of one species variant: base of the trunk centred on the origin, y up, blocks as units.
 * `lod` 0 is the near model (1/6-block leaves and trunk, 1/8-block branches), 1 and 2 the
 * coarser ones (1/2 and 1 block voxels, twigs left out) for trees farther away.
 */
export function treeGeometry(kind: number, variant: number, lod: TreeLod = 0): THREE.BufferGeometry {
  const key = kind * 16 + variant;
  let shape = shapes.get(key);
  if (!shape) shapes.set(key, (shape = build(kind, variant)));
  const [half, top] = extent(shape);
  const trunkW = TREE_SPECS[kind].trunk * 0.5;
  const res = LOD_RES[lod];
  const centred = (r: number) => Math.max(1, Math.round(trunkW / r)) % 2 === 1;
  const leaf = new Grid(res, centred(res), half, top);
  const wood = lod === 0 ? new Grid(BRANCH_VOX, centred(BRANCH_VOX), half, top) : leaf;
  for (const p of shape.prims) {
    if (p.t === 'box') box(leaf, p);
    else if (p.t === 'seg') {
      // twigs are too thin for the coarse models
      if (lod > 0 && p.w < 0.2 && !p.leaf) continue;
      seg(p.leaf ? leaf : wood, p);
    }
  }
  for (const p of shape.prims) {
    if (p.t === 'blob') blob(leaf, p);
    else if (p.t === 'cone') cone(leaf, p);
  }
  if (shape.fruit) fruit(leaf, shape.fruit);
  const out: Out = { pos: [], nor: [], col: [], idx: [] };
  mesh(leaf, out);
  if (wood !== leaf) mesh(wood, out);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(out.pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(out.nor, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(out.col, 3));
  g.setIndex(out.idx);
  g.computeBoundingSphere();
  g.computeBoundingBox();
  return g;
}

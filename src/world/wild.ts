import { fbm2, hash2, noise2 } from '../core/Rng';
import { CELL, Terrain } from '../game/Terrain';
import type { MapDef } from '../data/types';
import { TREE, TREE_CHUNK, TREE_KINDS, TREE_SPECS, treeHeight, type TreeList } from './trees';
import { BLOCKS, BLOCK_ORDER } from './blocks';
import { makeRoads } from './roads';

/**
 * «Дикие земли»: the open world, 2000 × 2000 blocks. Everything follows from what came before it,
 * the way land forms:
 *
 * 1. the continent: an irregular landmass (bays, capes, no straight edges) in the ocean;
 * 2. tectonics: long curving mountain belts (warped ridge lines), rising from foothills to peaks,
 *    with spurs, high plateaus and a volcanic range;
 * 3. climate: cold north, warm south, colder with height; a west wind brings rain from the ocean
 *    and drops it on the windward slopes, so the lands behind the ranges lie in a rain shadow;
 * 4. water: the land drains to the sea along the steepest way down (priority flood), so every
 *    river runs downhill; streams join into rivers, closed hollows fill into lakes, rivers cut
 *    valleys (gorges in the mountains) and fall as waterfalls where their bed drops sharply;
 * 5. biomes from temperature, rainfall, height, slope and water: snow and ice in the cold and
 *    high, bare rock and scree on steep peaks, sand and sandstone in the hot dry lands, clay and
 *    gravel on banks and shores, meadows grading from dry to lush with the rain;
 * 6. trees grow where water and climate allow: forest massifs, groves, single trees, willows on
 *    the banks, conifers in the cold and the mountains, dead trees in the dry lands.
 *
 * Coarse fields (climate, drainage) use a 4-block grid; the ground itself is per block. Pure
 * logic (no DOM): the tests run it in Node.
 */

export const WILD_SIZE = 2000;
/** Ocean cells stand at this level (their water surface is 0.62 below it). */
export const SEA = 6;
/** Coarse grid step (blocks) for climate and drainage. */
const C = 4;

/** Biome codes (coarse grid), for the tests, the maps and the trees. */
export const BIOME = {
  ocean: 0,
  beach: 1,
  desert: 2,
  steppe: 3,
  plains: 4,
  forest: 5,
  conifer: 6,
  tundra: 7,
  alpine: 8,
  volcanic: 9,
} as const;
export const BIOME_NAME = ['Океан', 'Побережье', 'Пустыня', 'Степь', 'Равнины', 'Лиственный лес', 'Хвойный лес', 'Снежная тайга', 'Высокогорье', 'Вулканическое нагорье'];

export interface DummySpot {
  id: string;
  name: string;
  x: number;
  z: number;
}

export interface WildWorld {
  map: MapDef;
  terrain: Terrain;
  spawn: { x: number; z: number };
  dummies: DummySpot[];
  trees: TreeList;
  /** Coarse fields (M × M, M = size / 4): biome, temperature 0..1, rainfall 0..1, water flow. */
  coarse: { m: number; biome: Uint8Array; temp: Float32Array; rain: Float32Array; flow: Float32Array; level: Float32Array; down: Int32Array; river: Uint8Array };
  /** Cells of rivers (shallow water), lakes, waterfalls (river cells above a drop) found. */
  stats: { riverCells: number; lakeCells: number; oceanCells: number; swampCells: number; roadCells: number; waterfalls: number; land: number; ms: number };
}

export const WILD_MAP: MapDef = {
  id: 'wild',
  name: { ru: 'Дикие земли', en: 'The Wild Lands' },
  desc: { ru: 'Открытый мир 2000 × 2000: горы, реки, леса и пустыни.', en: 'An open world of 2000 × 2000 blocks.' },
  size: WILD_SIZE,
  generator: 'wild',
  palette: {
    sky: 0x9fd2ec, fog: 0xa8d0c8, fogNear: 40, fogFar: 92, ambient: 0xd6ecff, ambientIntensity: 0.6,
    sun: 0xfff1d6, sunIntensity: 1.2, hemiGround: 0x5a7a34,
    tiles: {
      grass: [0x6aa842, 0x70ad46, 0x64a23f],
      grass2: [0x78b44c, 0x7eb952],
      grass_lush: [0x5c9c3a, 0x60a03c, 0x58983a],
      grass_sun: [0x84b44a, 0x8ab84f, 0x80ae47],
      grass_dry: [0x9cae52, 0xa4b458, 0x96a84c],
      grass_clover: [0x67aa47, 0x6db04c, 0x62a443],
      grass_cold: [0x5e9a52, 0x62a056, 0x5a944e],
      snow: [0xeef3f8, 0xf6f9fc, 0xe4ecf4],
      gravel: [0x8a8a8c, 0x7e7e82, 0x96969a],
      clay: [0xa87458, 0xb07c60, 0x9e6c50],
      basalt: [0x56545c, 0x4c4a52, 0x605e66],
      tuff: [0x9c9888, 0xa4a090, 0x94907e],
      moss_stone: [0x7e8284, 0x74787a, 0x5a8a34],
      ice: [0x9cc8f0, 0xa8d0f4, 0x90c0ec],
      sandstone: [0xd8c08a, 0xdcc692, 0xd2b880],
      sand: [0xe4d29c, 0xe8d8a4, 0xdecb94],
      stone: [0x8a8c90, 0x80828a, 0x92949a],
      water_sea_4: [0x2f6fb8, 0x3577c0],
      water_lake_3: [0x3a82c8, 0x408ad0],
      water_river_2: [0x4a92d4, 0x529ad8],
      water_fast_2: [0x5aa0dc, 0x62a8e0],
      water_swamp_1: [0x56603a, 0x5c6640],
      // the reference blocks (world/blocks.ts: earth, rock, desert, snow and ice, forest floors,
      // and the mixed blocks of the transitions)
      ...Object.fromEntries(BLOCK_ORDER.map((k) => [k, BLOCKS[k].colors])),
    },
    // earth under grass and snow, grey rock deep in cliffs; rock-like blocks are their own sides
    blocks: { soil: [0x9a6a42], cliff: [0x8a8c92], snowSoil: [1], selfRock: [1] },
  },
  music: { root: 45, scale: 'dorian', tempo: 100, mood: 'forest' },
};

const smooth = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const ridged = (x: number, z: number, s: number) => 1 - Math.abs(noise2(x, z, s) * 2 - 1);

/** Land vs ocean: > 0.12 is land. An irregular continent with bays and capes, ocean at the edges. */
function landShape(x: number, z: number, n: number): number {
  const u = x / n;
  const v = z / n;
  const wx = (fbm2(x / 420, z / 420, 11) - 0.5) * 0.5;
  const wz = (fbm2(x / 420 + 31, z / 420 - 17, 12) - 0.5) * 0.5;
  const dx = (u - 0.5 + wx) * 2;
  const dz = (v - 0.52 + wz) * 2;
  let land = 1 - Math.hypot(dx * 0.86, dz * 0.98);
  land += (fbm2(x / 150, z / 150, 13) - 0.5) * 0.38;
  land += (fbm2(x / 55, z / 55, 14) - 0.5) * 0.08;
  // the open ocean all around
  // (a ragged rim, so no coast follows the map's edge)
  const edge = Math.max(Math.abs(u - 0.5), Math.abs(v - 0.5)) * 2 + (fbm2(x / 90, z / 90, 15) - 0.5) * 0.12;
  land -= smooth(0.86, 1.0, edge) * 0.9;
  return land;
}

/** Mountain belts 0..1: two families of long warped ridge lines, strong only in uplift zones. */
function mountains(x: number, z: number): number {
  const ax = x + (fbm2(x / 300, z / 300, 21) - 0.5) * 260;
  const az = z + (fbm2(x / 300 + 9, z / 300 + 4, 22) - 0.5) * 260;
  const r1 = ridged(ax / 560, az / 560, 23);
  const r2 = ridged(az / 380 + 5, ax / 380 - 3, 24);
  const belt1 = smooth(0.76, 0.99, r1) * smooth(0.3, 0.55, fbm2(x / 650, z / 650, 25));
  const belt2 = smooth(0.8, 0.99, r2) * smooth(0.4, 0.62, fbm2(x / 500 + 7, z / 500, 26)) * 0.78;
  return Math.max(belt1, belt2);
}

/** Volcanic zone 0..1 (basalt and tuff) — one hot spot along a range. */
function volcanic(x: number, z: number): number {
  return smooth(0.66, 0.76, fbm2(x / 380 + 13, z / 380 - 8, 27));
}

/** Land height before rivers (blocks): sea floor, coastal lowlands, hills, plateaus, ranges. */
function landHeight(x: number, z: number, n: number): { h: number; mtn: number; land: number } {
  const land = landShape(x, z, n);
  const c = smooth(0.12, 0.5, land);
  const mtn = mountains(x, z) * smooth(0.1, 0.3, land);
  // low, broad relief: plains rising gently inland, long soft hills, valleys between them
  let base = SEA + 1 + c * 8 + (fbm2(x / 260, z / 260, 31) - 0.5) * 10 * c + (fbm2(x / 90, z / 90, 32) - 0.5) * 3 * c;
  // plateaus: wide raised tablelands with sloping edges
  const pl = smooth(0.58, 0.72, fbm2(x / 260, z / 260, 33)) * c;
  base += pl * 6;
  // rolling ground at the scale of a day's walk (also breaks up straight drainage lines)
  base += (fbm2(x / 60, z / 60, 35) - 0.5) * 2.6 * c;
  // glacial hollows on the lowlands: they fill with water into lakes
  base -= smooth(0.7, 0.84, fbm2(x / 110, z / 110, 36)) * 6 * c * (1 - mountains(x, z));
  // ranges rise gradually from wide foothills to rounded summits (about forty blocks)
  const peaks = Math.pow(mtn, 1.7) * 34 + mtn * ridged(x / 90, z / 90, 34) * 8;
  const h = land < 0.04 ? SEA - 4 - (0.04 - land) * 40 : SEA - 4 + (base + peaks - (SEA - 4)) * smooth(0.04, 0.17, land);
  return { h, mtn, land };
}

/** Binary min-heap of cell ids by key (priority flood). */
class MinHeap {
  private ids: Int32Array;
  private keys: Float32Array;
  size = 0;
  constructor(cap: number) {
    this.ids = new Int32Array(cap);
    this.keys = new Float32Array(cap);
  }
  push(id: number, k: number) {
    let i = this.size++;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.keys[p] <= k) break;
      this.ids[i] = this.ids[p];
      this.keys[i] = this.keys[p];
      i = p;
    }
    this.ids[i] = id;
    this.keys[i] = k;
  }
  pop(): number {
    const top = this.ids[0];
    const id = this.ids[--this.size];
    const k = this.keys[this.size];
    let i = 0;
    for (;;) {
      const l = i * 2 + 1;
      if (l >= this.size) break;
      const r = l + 1;
      const c = r < this.size && this.keys[r] < this.keys[l] ? r : l;
      if (this.keys[c] >= k) break;
      this.ids[i] = this.ids[c];
      this.keys[i] = this.keys[c];
      i = c;
    }
    this.ids[i] = id;
    this.keys[i] = k;
    return top;
  }
}

const D8X = [1, -1, 0, 0, 1, 1, -1, -1];
const D8Z = [0, 0, 1, -1, 1, -1, 1, -1];

/**
 * Drainage of a height grid: `fill` raises closed hollows to their spill level (lakes) with a tiny
 * rise so every cell has a way down to the sea; `down` is the next cell downhill (-1: sea); `flow`
 * sums the rain flowing through each cell.
 */
function drain(m: number, h: Float32Array, rain: Float32Array, sea: (i: number) => boolean) {
  const fill = new Float32Array(m * m);
  const done = new Uint8Array(m * m);
  const heap = new MinHeap(m * m);
  for (let i = 0; i < m * m; i++) {
    const x = i % m;
    const z = (i / m) | 0;
    if (sea(i) || x === 0 || z === 0 || x === m - 1 || z === m - 1) {
      fill[i] = h[i];
      done[i] = 1;
      heap.push(i, h[i]);
    }
  }
  const order = new Int32Array(m * m);
  let on = 0;
  while (heap.size) {
    const i = heap.pop();
    order[on++] = i;
    const x = i % m;
    const z = (i / m) | 0;
    for (let k = 0; k < 8; k++) {
      const nx = x + D8X[k];
      const nz = z + D8Z[k];
      if (nx < 0 || nz < 0 || nx >= m || nz >= m) continue;
      const j = nz * m + nx;
      if (done[j]) continue;
      done[j] = 1;
      // a tiny rise, uneven so that water crossing a flat finds a winding way, not a ruler line
      fill[j] = Math.max(h[j], fill[i] + 0.004 + hash2(nx, nz, 7) * 0.03);
      heap.push(j, fill[j]);
    }
  }
  // each cell drains to its lowest lower neighbour on the filled surface
  const down = new Int32Array(m * m).fill(-1);
  for (let i = 0; i < m * m; i++) {
    if (sea(i)) continue;
    const x = i % m;
    const z = (i / m) | 0;
    let best = -1;
    let bh = fill[i];
    for (let k = 0; k < 8; k++) {
      const nx = x + D8X[k];
      const nz = z + D8Z[k];
      if (nx < 0 || nz < 0 || nx >= m || nz >= m) continue;
      const j = nz * m + nx;
      const d = (fill[i] - fill[j]) / (k < 4 ? 1 : Math.SQRT2);
      if (fill[j] < bh && d > 0 && (best < 0 || fill[j] < bh)) {
        bh = fill[j];
        best = j;
      }
    }
    down[i] = best;
  }
  // flow: from the highest cells down (the flood order reversed is highest-filled first)
  const flow = new Float32Array(m * m);
  for (let k = on - 1; k >= 0; k--) {
    const i = order[k];
    flow[i] += rain[i];
    if (down[i] >= 0) flow[down[i]] += flow[i];
  }
  return { fill, down, flow, order: order.subarray(0, on) };
}

/** Bilinear sample of a coarse field at block (x, z). */
function sampler(m: number, f: Float32Array) {
  return (x: number, z: number) => {
    const gx = Math.max(0, Math.min(m - 1.001, x / C - 0.5));
    const gz = Math.max(0, Math.min(m - 1.001, z / C - 0.5));
    const ix = Math.floor(gx);
    const iz = Math.floor(gz);
    const fx = gx - ix;
    const fz = gz - iz;
    const i = iz * m + ix;
    const a = f[i] + (f[i + 1] - f[i]) * fx;
    const b = f[i + m] + (f[i + m + 1] - f[i + m]) * fx;
    return a + (b - a) * fz;
  };
}

/** Builds the wild world (deterministic: the same world every time). */
export function generateWild(n = WILD_SIZE): WildWorld {
  const t0 = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const m = n / C;
  // ------------------------------------------------------------------ coarse land
  const H0 = new Float32Array(m * m);
  const MTN = new Float32Array(m * m);
  const LAND = new Float32Array(m * m);
  for (let z = 0; z < m; z++)
    for (let x = 0; x < m; x++) {
      const r = landHeight(x * C + C / 2, z * C + C / 2, n);
      const i = z * m + x;
      H0[i] = r.h;
      MTN[i] = r.mtn;
      LAND[i] = r.land;
    }
  const isSea = (i: number) => H0[i] < SEA - 0.5;
  // ------------------------------------------------------------------ climate
  // temperature: cold north, warm south, colder with height
  const TEMP = new Float32Array(m * m);
  for (let z = 0; z < m; z++)
    for (let x = 0; x < m; x++) {
      const i = z * m + x;
      const lat = 0.06 + 0.86 * (z / m);
      // warm and cold tongues (sea currents, open plains) bend the climate zones
      const swing = (fbm2(x / 70, z / 70, 63) - 0.5) * 0.34 + (fbm2(x / 20, z / 20, 61) - 0.5) * 0.1;
      TEMP[i] = Math.max(0, Math.min(1, lat - Math.max(0, H0[i] - SEA) * 0.0155 + swing));
    }
  // rain: the west wind picks up moisture over the sea and loses it as it climbs the land
  // (the wind front moves east column by column; air mixes between neighbouring rows, so the
  // rain field has no streaks)
  const RAW = new Float32Array(m * m);
  {
    const q = new Float32Array(m).fill(1);
    const prev = new Float32Array(m).fill(SEA);
    const tmp = new Float32Array(m);
    for (let x = 0; x < m; x++) {
      for (let z = 0; z < m; z++) {
        const i = z * m + x;
        const h = Math.max(SEA, H0[i]);
        if (isSea(i)) {
          q[z] = Math.min(1, q[z] + 0.06);
          RAW[i] = q[z] * 0.7;
        } else {
          const rise = Math.max(0, h - prev[z]);
          const fall = q[z] * (0.0014 + rise * 0.034);
          q[z] = Math.max(0, q[z] - fall);
          RAW[i] = Math.min(1, q[z] * 0.85 + rise * 0.04 * (q[z] + 0.2));
        }
        prev[z] = h;
      }
      for (let pass = 0; pass < 3; pass++) {
        for (let z = 0; z < m; z++) tmp[z] = (q[Math.max(0, z - 1)] + q[z] * 2 + q[Math.min(m - 1, z + 1)]) * 0.25;
        q.set(tmp);
      }
    }
  }
  const RAIN = blur(m, RAW, 5);
  for (let i = 0; i < m * m; i++) RAIN[i] = Math.max(0, Math.min(1, RAIN[i] * 1.15 + (fbm2((i % m) / 60, ((i / m) | 0) / 60, 62) - 0.5) * 0.18));
  // ------------------------------------------------------------------ drainage and erosion
  let dr = drain(m, H0, RAIN, isSea);
  // rivers wear the land down: deeper where more water flows and the ground is steep
  const ERO = new Float32Array(m * m);
  for (let i = 0; i < m * m; i++) {
    if (isSea(i)) continue;
    const d = dr.down[i];
    const slope = d >= 0 ? Math.max(0, H0[i] - H0[d]) : 0;
    ERO[i] = Math.min(14, Math.sqrt(dr.flow[i]) * (0.25 + Math.min(1, slope / 6) * 0.6));
  }
  const EROb = blur(m, ERO, 1);
  const H1 = new Float32Array(m * m);
  for (let i = 0; i < m * m; i++) H1[i] = isSea(i) ? H0[i] : Math.max(SEA - 0.3, H0[i] - Math.max(ERO[i], EROb[i] * 0.8));
  dr = drain(m, H1, RAIN, isSea);
  const { fill, down, order } = dr;
  // the mountains catch more rain and hold snow that melts into springs: their water counts more
  const flow = new Float32Array(m * m);
  for (let k = order.length - 1; k >= 0; k--) {
    const i = order[k];
    flow[i] += RAIN[i] * (1 + 2.5 * smooth(SEA + 9, SEA + 28, H1[i]));
    if (down[i] >= 0) flow[down[i]] += flow[i];
  }
  // lakes: hollows the water fills (deeper than a block)
  const LAKE = new Uint8Array(m * m);
  for (let i = 0; i < m * m; i++) if (!isSea(i) && fill[i] - H1[i] > 1.1) LAKE[i] = 1;
  // one water level per lake (its outlet), so the surface is flat from shore to shore
  {
    const seen = new Uint8Array(m * m);
    const q: number[] = [];
    for (let s0 = 0; s0 < m * m; s0++) {
      if (!LAKE[s0] || seen[s0]) continue;
      q.length = 0;
      q.push(s0);
      seen[s0] = 1;
      let lv = Infinity;
      for (let h = 0; h < q.length; h++) {
        const i = q[h];
        lv = Math.min(lv, fill[i]);
        const x = i % m;
        const z = (i / m) | 0;
        for (let k = 0; k < 8; k++) {
          const nx = x + D8X[k];
          const nz = z + D8Z[k];
          if (nx < 0 || nz < 0 || nx >= m || nz >= m) continue;
          const j = nz * m + nx;
          if (LAKE[j] && !seen[j]) {
            seen[j] = 1;
            q.push(j);
          }
        }
      }
      for (const i of q) fill[i] = lv;
    }
    // below a lake the water never stands higher than the lake (its outlet follows its level)
    for (let k = order.length - 1; k >= 0; k--) {
      const i = order[k];
      const d = down[i];
      if (d >= 0 && fill[d] > fill[i]) fill[d] = fill[i];
    }
  }
  // ------------------------------------------------------------------ biomes (coarse)
  const BIO = new Uint8Array(m * m);
  for (let i = 0; i < m * m; i++) {
    const t = TEMP[i];
    const r = RAIN[i];
    const h = H1[i] - SEA;
    if (isSea(i)) BIO[i] = BIOME.ocean;
    else if (MTN[i] > 0.35 && volcanic((i % m) * C, ((i / m) | 0) * C) > 0.5) BIO[i] = BIOME.volcanic;
    else if (t < 0.17) BIO[i] = BIOME.tundra;
    else if (h > 21 && MTN[i] > 0.3) BIO[i] = BIOME.alpine;
    else if (h < 1.6 && LAND[i] < 0.2) BIO[i] = BIOME.beach;
    else if (r < 0.2 && t > 0.52) BIO[i] = BIOME.desert;
    else if (r < 0.32) BIO[i] = BIOME.steppe;
    else if (t < 0.36) BIO[i] = BIOME.conifer;
    else if (r > 0.5) BIO[i] = BIOME.forest;
    else BIO[i] = BIOME.plains;
  }
  // ------------------------------------------------------------------ rivers (block scale)
  const RIVER_MIN = 44;
  // where rivers are: springs need less water in the uplands than on the plains (rivers rise in
  // the hills and mountains), and once a river flows it flows on to the sea
  const RIVER = new Uint8Array(m * m);
  for (let i = 0; i < m * m; i++) if (!isSea(i) && flow[i] >= RIVER_MIN * (4.4 - 4 * smooth(SEA + 6, SEA + 22, H1[i]))) RIVER[i] = 1;
  // mountain springs: high ground with a little catchment above it already feeds a stream
  for (let i = 0; i < m * m; i++) if (!isSea(i) && H1[i] > SEA + 16 && flow[i] >= 9 && RAIN[i] > 0.2) RIVER[i] = 1;
  for (let k = order.length - 1; k >= 0; k--) {
    const i = order[k];
    if (RIVER[i] && down[i] >= 0 && !isSea(down[i])) RIVER[down[i]] = 1;
  }
  // rivers meander: the river field is drawn in gently warped coordinates (a smooth sideways sway
  // along every course, the same for the channel and its valley)
  // (broad bends over a hundred blocks, and smaller meanders on them)
  const WARP = 22;
  // computed once on a 2-block grid (it is smooth) and read per block
  const WG = n / 2;
  const wpx = new Float32Array(WG * WG);
  const wpz = new Float32Array(WG * WG);
  for (let z = 0; z < WG; z++)
    for (let x = 0; x < WG; x++) {
      const bx = x * 2;
      const bz = z * 2;
      wpx[z * WG + x] = (fbm2(bx / 95, bz / 95, 78) - 0.5) * 30 + (fbm2(bx / 24, bz / 24, 76) - 0.5) * 10;
      wpz[z * WG + x] = (fbm2(bx / 95 + 21, bz / 95 - 9, 79) - 0.5) * 30 + (fbm2(bx / 24 + 40, bz / 24 - 30, 77) - 0.5) * 10;
    }
  const warpX = (x: number, z: number) => wpx[(z >> 1) * WG + (x >> 1)];
  const warpZ = (x: number, z: number) => wpz[(z >> 1) * WG + (x >> 1)];
  const N2 = n * n;
  /** Per block near a river: distance to the channel (1/8 block, 255 = none), water level, half width. */
  const rDist = new Uint8Array(N2).fill(255);
  const rLevel = new Float32Array(N2);
  const rWide = new Uint8Array(N2);
  const rFlow = new Uint8Array(N2);
  /** River drop per block along the flow (rapids where it is steep). */
  const rSteep = new Float32Array(N2);
  const jit = (i: number, k: number) => (hash2(i % m, (i / m) | 0, 71 + k) - 0.5) * 2.2;
  const center = (i: number): [number, number] => [(i % m) * C + C / 2 + jit(i, 0), ((i / m) | 0) * C + C / 2 + jit(i, 1)];
  for (let i = 0; i < m * m; i++) {
    if (!RIVER[i] || LAKE[i]) continue;
    const j = down[i];
    if (j < 0) continue;
    const [ax, az] = center(i);
    const [bx, bz] = center(j);
    const w = 0.7 + Math.min(3.6, Math.sqrt(Math.max(0, flow[i] - RIVER_MIN * 0.4)) / 9);
    const fi = fill[i];
    const fj = fill[j];
    const fallTo = fi - fj >= 2.2;
    const reach = w + 10 + w * 2 + MTN[i] * 8 + WARP;
    const x0 = Math.max(0, Math.floor(Math.min(ax, bx) - reach));
    const x1 = Math.min(n - 1, Math.ceil(Math.max(ax, bx) + reach));
    const z0 = Math.max(0, Math.floor(Math.min(az, bz) - reach));
    const z1 = Math.min(n - 1, Math.ceil(Math.max(az, bz) + reach));
    const sx = bx - ax;
    const sz = bz - az;
    const len2 = sx * sx + sz * sz || 1;
    for (let z = z0; z <= z1; z++)
      for (let x = x0; x <= x1; x++) {
        const px = x + 0.5 + warpX(x, z);
        const pz = z + 0.5 + warpZ(x, z);
        const u = Math.max(0, Math.min(1, ((px - ax) * sx + (pz - az) * sz) / len2));
        const d = Math.hypot(px - (ax + sx * u), pz - (az + sz * u));
        if (d > reach - WARP) continue;
        const k = z * n + x;
        const dq = Math.min(254, Math.round(d * 8));
        if (dq >= rDist[k]) continue;
        rDist[k] = dq;
        // the surface steps down along the flow; a sharp drop makes a waterfall in the middle
        // (never below the sea it flows into)
        rLevel[k] = Math.max(SEA - 0.62, fallTo ? (u < 0.5 ? fi : fj) : fi + (fj - fi) * u);
        rWide[k] = Math.round(w * 8);
        rFlow[k] = (Math.round((Math.atan2(sz, sx) / (Math.PI * 2)) * 256) & 255) || 1;
        rSteep[k] = (fi - fj) / Math.sqrt(len2);
      }
  }
  // ------------------------------------------------------------------ the ground, block by block
  const t = new Terrain(n, true);
  const names = Object.keys(WILD_MAP.palette.tiles);
  for (const nm of names) t.tileId(nm);
  const id = (nm: string) => t.tileId(nm);
  const sH = sampler(m, H1);
  const sFill = sampler(m, fill);
  const sMtn = sampler(m, MTN);
  const sTemp = sampler(m, TEMP);
  const sRain = sampler(m, RAIN);
  const sLand = sampler(m, LAND);
  const raw = new Float32Array(N2);
  const kind = new Uint8Array(N2); // 0 land, 1 river, 2 lake, 3 sea
  const level = new Float32Array(N2); // water level of water cells
  const bankBand = new Uint8Array(N2); // level strip along a river (walk in and out of the water)
  for (let z = 0; z < n; z++)
    for (let x = 0; x < n; x++) {
      const k = z * n + x;
      const mt = sMtn(x, z);
      let h = sH(x, z) + (fbm2(x / 26, z / 26, 41) - 0.5) * (1.1 + mt * 3.5) + (noise2(x / 9, z / 9, 42) - 0.5) * (0.25 + mt * 1.1);
      // lakes: inside a filled hollow the water lies at the spill level
      const cx = Math.min(m - 1, Math.floor(x / C));
      const cz = Math.min(m - 1, Math.floor(z / C));
      const ci = cz * m + cx;
      if (LAKE[ci]) {
        const lv = fill[ci];
        if (h < lv + 0.3) {
          kind[k] = 2;
          level[k] = lv;
          // the bed follows the hollow: shallow by the shore, deeper toward the middle
          h = Math.min(h - 0.5, lv - 0.3);
        }
      } else if (sFill(x, z) - h > 1.4 && !isSea(ci)) {
        // the rim of a lake just outside its coarse cells
        let near = false;
        for (let dz = -1; dz <= 1 && !near; dz++) for (let dx = -1; dx <= 1; dx++) if (LAKE[Math.max(0, Math.min(m - 1, cz + dz)) * m + Math.max(0, Math.min(m - 1, cx + dx))]) near = true;
        if (near) h = Math.max(h, sFill(x, z) + 0.2);
      }
      // rivers: the channel, the banks a little above the water, the valley sides sloping up
      const rd = rDist[k];
      if (rd !== 255 && kind[k] === 0) {
        const d = rd / 8;
        const w = rWide[k] / 8;
        const L = Math.round(rLevel[k] + 0.62);
        const surf = L - 0.62;
        if (d < w) {
          kind[k] = 1;
          level[k] = rLevel[k];
          // shallow at the banks, deeper mid-channel on the wider rivers (still waded)
          h = surf - 0.3 - 0.6 * (1 - d / w) * Math.min(1, Math.max(0, (w - 0.8) / 2));
        } else if (d < w + 1.2) {
          h = surf + 0.13;
          bankBand[k] = 1;
        } else {
          const valley = surf + 0.13 + (d - w - 1.2) * (0.18 + mt * 0.8);
          h = Math.max(surf + 0.13, Math.min(h, valley));
        }
      }
      // the sea
      if (kind[k] === 0 && h < SEA - 0.5) {
        kind[k] = 3;
        level[k] = SEA - 0.62;
      }
      raw[k] = h;
    }
  // smooth ground (owner, update 8): the land keeps its own height (no block steps); the cell
  // heights become a smooth surface at the end (Terrain.buildSmooth)
  const top = new Float32Array(N2);
  for (let k = 0; k < N2; k++) top[k] = Math.max(0, raw[k]);
  // ------------------------------------------------------------------ cells and blocks
  const stats = { riverCells: 0, lakeCells: 0, oceanCells: 0, swampCells: 0, roadCells: 0, waterfalls: 0, land: 0, ms: 0 };
  const g = {
    grass: id('grass'), grass2: id('grass2'), lush: id('grass_lush'), sun: id('grass_sun'), dry: id('grass_dry'), clover: id('grass_clover'), cold: id('grass_cold'),
    snow: id('snow'), gravel: id('gravel'), clay: id('clay'), basalt: id('basalt'), tuff: id('tuff'), moss: id('moss_stone'), ice: id('ice'),
    sandstone: id('sandstone'), sand: id('sand'), stone: id('stone'), sea: id('water_sea_4'), lake: id('water_lake_3'), river: id('water_river_2'), fast: id('water_fast_2'),
    swamp: id('water_swamp_1'),
    // the reference blocks
    dirt: id('dirt'), dirtWet: id('dirt_wet'), dirtDry: id('dirt_dry'), dirtStony: id('dirt_stony'), chernozem: id('chernozem'), mud: id('mud'), peat: id('peat'),
    humus: id('humus'), litter: id('forest_litter'), packed: id('dirt_packed'), granite: id('granite'), andesite: id('andesite'), diorite: id('diorite'),
    limestone: id('limestone'), slate: id('slate'), marble: id('marble'), obsidian: id('obsidian'), cracked: id('stone_cracked'), lichen: id('stone_lichen'),
    redSand: id('red_sand'), sandPacked: id('sand_packed'), sandStony: id('sand_stony'), redSandstone: id('red_sandstone'), crackedEarth: id('cracked_earth'),
    salt: id('salt_flat'), dryClay: id('dry_clay'), desertRock: id('desert_rock'), snowLoose: id('snow_loose'), snowPacked: id('snow_packed'), snowDeep: id('snow_deep'),
    snowDirty: id('snow_dirty'), snowStony: id('snow_stony'), iceBlue: id('ice_blue'), iceCracked: id('ice_cracked'), frozenDirt: id('frozen_dirt'), icyStone: id('icy_stone'),
    dirtMoss: id('dirt_moss'), roots: id('dirt_roots'), leafLitter: id('leaf_litter'), needles: id('needle_litter'), swampMud: id('swamp_mud'), silt: id('silt'),
    pebbles: id('dirt_pebbles'), cobble: id('cobble_overgrown'), grassDirt: id('grass_dirt'), grassStone: id('grass_stone'), grassSand: id('grass_sand'),
    dirtGravel: id('dirt_gravel'), stoneSnow: id('stone_snow'), stoneMoss: id('stone_moss'), sandStone: id('sand_stone'), mudGrass: id('mud_grass'),
    snowDirt: id('snow_dirt'), sandClay: id('sand_clay'),
  };
  t.top = top;
  const flowDir = new Uint8Array(N2);
  t.flow = flowDir;
  t.shadeElev = new Uint8Array(N2);
  for (let z = 0; z < n; z++)
    for (let x = 0; x < n; x++) {
      const k = z * n + x;
      const h = top[k];
      // gradual borders: the climate read a little off from the cell itself, plus fine noise
      const tj = sTemp(x, z) + (hash2(x, z, 81) - 0.5) * 0.05 + (noise2(x / 9, z / 9, 82) - 0.5) * 0.05;
      const rj = sRain(x, z) + (hash2(x, z, 83) - 0.5) * 0.05 + (noise2(x / 11, z / 11, 84) - 0.5) * 0.06;
      const mt = sMtn(x, z);
      const kd = kind[k];
      if (kd) {
        const frozen = tj < 0.13;
        const L = kd === 3 ? SEA : Math.round(level[k] + 0.62);
        t.elev[k] = L;
        if (frozen && kd !== 3) {
          // frozen lakes (blue ice, plain ice by the shore) and rivers (cracked ice): ice to walk on
          t.cell[k] = CELL.ice;
          t.tile[k] = kd === 1 ? g.iceCracked : hash2(x, z, 86) < 0.3 ? g.ice : g.iceBlue;
          top[k] = Math.floor((L - 0.62) * 4) / 4;
        } else if (frozen && tj < 0.08 && sLand(x, z) > 0.0) {
          // the frozen sea along the northern shores
          t.cell[k] = CELL.ice;
          t.tile[k] = hash2(x, z, 86) < 0.6 ? g.ice : g.iceBlue;
          top[k] = Math.floor((L - 0.62) * 4) / 4;
        } else {
          t.cell[k] = kd === 1 ? CELL.shallow : CELL.liquid;
          t.tile[k] = kd === 3 ? g.sea : kd === 2 ? g.lake : mt > 0.3 || rSteep[k] > 0.1 ? g.fast : g.river;
          // the bed always lies a little under the surface
          top[k] = Math.max(0, Math.min(top[k], Math.floor((L - 0.62 - 0.25) * 4) / 4));
          if (kd === 1) flowDir[k] = rFlow[k];
        }
        if (kd === 1) stats.riverCells++;
        else if (kd === 2) stats.lakeCells++;
        else stats.oceanCells++;
        t.shadeElev[k] = Math.round(top[k] * 4) & 255;
        continue;
      }
      stats.land++;
      t.elev[k] = Math.floor(h);
      t.shadeElev[k] = Math.round(h * 4) & 255;
      const gx = top[z * n + Math.min(n - 1, x + 1)] - top[z * n + Math.max(0, x - 1)];
      const gz = top[Math.min(n - 1, z + 1) * n + x] - top[Math.max(0, z - 1) * n + x];
      const steep = Math.hypot(gx, gz) * 0.5;
      const above = h - SEA;
      const rd = rDist[k] / 8;
      const bank = rDist[k] !== 255 && rd < rWide[k] / 8 + 1.6;
      const coast = sLand(x, z) < 0.2 && above < 2;
      const vol = mt > 0.3 ? volcanic(x, z) : 0;
      // choices between grounds come in patches a few blocks across (with ragged edges), not as a
      // speckle of single blocks
      const pj = noise2(x / 4.5, z / 4.5, 87) * 0.8 + hash2(x, z, 85) * 0.2;
      const bio = BIO[Math.min(m - 1, (z / C) | 0) * m + Math.min(m - 1, (x / C) | 0)];
      // broad patches (fbm2 fields) decide which rock or soil a stretch of land has; the forest
      // massifs (field 93, the same the trees grow by) have a floor of litter, not grass
      let tile: number;
      if (tj < 0.15 || (tj < 0.2 && pj < (0.2 - tj) * 20)) {
        // snow: icy rock on the steepest crags, stony snow on slopes, loose snow in the woods,
        // deep drifts on the open snowfields
        if (steep > 1.2) tile = above > 20 && pj < 0.55 ? g.icyStone : pj < 0.7 ? g.stoneSnow : g.stone;
        else if (steep > 0.6) tile = pj < 0.55 ? g.snowStony : g.stoneSnow;
        else if ((bio === BIOME.tundra || bio === BIOME.conifer) && fbm2(x / 90, z / 90, 93) > 0.45) tile = g.snowLoose;
        else tile = fbm2(x / 60, z / 60, 620) > 0.56 ? g.snowDeep : g.snow;
      } else if (tj < 0.21) {
        // the edge of the snow: thawing patches over frozen earth
        tile = steep > 0.8 ? g.stoneSnow : pj < 0.45 ? g.snowDirt : pj < 0.75 ? g.frozenDirt : g.cold;
      } else if (vol > 0.5 && mt > 0.3) tile = steep > 0.8 || above > 26 ? (above > 28 && pj < 0.14 ? g.obsidian : g.basalt) : pj < 0.15 ? g.gravel : g.tuff;
      else if (steep > 0.8 && above > 10) {
        // rock faces: the rock of the range, wet rock mossy, old cliffs cracked
        const rock = fbm2(x / 140, z / 140, 611);
        if (mt > 0.3 && rDist[k] !== 255 && rd < 12) tile = g.slate;
        else if (steep > 1.4 && pj < 0.3) tile = g.cracked;
        else if (rj > 0.58) tile = pj < 0.5 ? g.lichen : g.stoneMoss;
        else if (rj < 0.24 && tj > 0.48) tile = g.desertRock;
        else if (fbm2(x / 70, z / 70, 612) > 0.76) tile = g.marble;
        else if (fbm2(x / 60, z / 60, 613) > 0.72) tile = g.diorite;
        else if (tj > 0.5 && fbm2(x / 90, z / 90, 614) > 0.66) tile = g.limestone;
        else tile = rock > 0.6 ? g.granite : rock < 0.4 ? g.andesite : g.stone;
      } else if (above > 22 && mt > 0.3) tile = pj < 0.4 ? g.gravel : steep > 0.4 ? g.andesite : pj < 0.7 ? g.dirtStony : g.grassStone;
      else if (coast) tile = tj > 0.35 ? (pj < 0.85 ? g.sand : g.grassSand) : g.gravel;
      // banks: gravel and mossy stones in the mountains and the cold, wet earth and clay where
      // the land is wet, sand where it is dry
      else if (bank) tile = mt > 0.3 || tj < 0.3 ? (pj < 0.6 ? g.gravel : g.moss) : rj < 0.3 ? (pj < 0.6 ? g.sand : g.gravel) : pj < 0.25 ? g.clay : pj < 0.6 ? g.dirtWet : pj < 0.72 && mt < 0.1 ? g.silt : g.lush;
      else if (rj < 0.18 && tj > 0.5) {
        // desert: red sand in its own stretches, sandstone in the rises, stony sand on the
        // foothills, cracked earth and salt in the dry basins
        const red = fbm2(x / 170, z / 170, 615) > 0.58;
        if (steep > 0.45 || above > 14) tile = red ? g.redSandstone : pj < 0.6 ? g.sandstone : g.desertRock;
        else if (mt > 0.12) tile = pj < 0.55 ? g.sandStony : g.sandStone;
        else {
          const basin = fbm2(x / 55, z / 55, 616);
          tile = basin > 0.72 ? (rj < 0.12 ? g.salt : g.crackedEarth) : red ? g.redSand : g.sand;
        }
      } else if (rj < 0.24 && tj > 0.48) tile = pj < (0.24 - rj) * 14 ? g.sandClay : g.dryClay;
      else if (rj < 0.32) tile = steep > 0.45 || pj < 0.08 ? g.dirtDry : g.dry;
      else if (tj < 0.3) {
        if (rj > 0.5 && steep > 0.6) tile = g.moss;
        else if (steep > 0.5) tile = g.dirtStony;
        else tile = g.cold;
      } else if (steep > 0.55) tile = pj < 0.5 ? g.dirt : g.grassDirt;
      else if (mt > 0.15 && pj < 0.22) tile = pj < 0.11 ? g.dirtStony : g.grassStone;
      else if (rj < 0.4) tile = g.sun;
      else if (rj < 0.5) tile = fbm2(x / 5, z / 5, 303) > 0.72 ? g.clover : g.grass2;
      else if (rj < 0.64) tile = g.grass;
      else tile = g.lush;
      t.tile[k] = tile;
    }
  // swamps: on wet, warm-enough flat lowland the ground water stands in shallow pools
  makeSwamps(t, n, top, kind, sTemp, sRain, sMtn, g.swamp, g.mudGrass, g.peat, g.swampMud, stats);
  // the spawn is chosen now: the roads start from it
  const spawn = findSpawn(t, n, m, BIO, TEMP, RAIN, rDist);
  // roads and paths between the places people would go, by the easiest ways over the land
  const roads = makeRoads(t, n, top, spawn, { BIO, H1, MTN, isSea, fill, m, C }, {
    packed: g.packed, pebbles: g.pebbles, gravel: g.gravel, cobble: g.cobble, sandPacked: g.sandPacked, snowPacked: g.snowPacked, snowDirty: g.snowDirty,
    mud: g.mud, grassDirt: g.grassDirt, dirtGravel: g.dirtGravel, dirt: g.dirt, sandStony: g.sandStony,
  });
  stats.roadCells = roads.cells;
  // transitions: where two kinds of ground meet, the border cells mix both (mixed blocks)
  mixBorders(t, n, g);
  // banks: no dry cell lies below the water beside it (the water would hang in the air), so
  // land cut lower by a valley next to a lake is raised to a low bank above its surface
  for (let z = 1; z < n - 1; z++)
    for (let x = 1; x < n - 1; x++) {
      const k = z * n + x;
      if (!isWaterCell(t.cell[k]) || t.cell[k] === CELL.ice) continue;
      const s = t.elev[k] - 0.62;
      for (const o of [1, -1, n, -n, n + 1, n - 1, -n + 1, -n - 1]) {
        const j = k + o;
        if (t.cell[j] !== CELL.floor || top[j] >= s + 0.1) continue;
        top[j] = Math.ceil((s + 0.1) * 4) / 4;
        t.elev[j] = Math.floor(top[j]);
        t.shadeElev[j] = Math.round(top[j] * 4) & 255;
      }
    }
  // waterfalls: river water above a drop of two blocks or more
  for (let z = 1; z < n - 1; z++)
    for (let x = 1; x < n - 1; x++) {
      const k = z * n + x;
      if (t.cell[k] !== CELL.shallow) continue;
      for (const o of [1, -1, n, -n]) {
        const j = k + o;
        if ((t.cell[j] === CELL.shallow || t.cell[j] === CELL.liquid) && t.elev[k] - t.elev[j] >= 2) {
          stats.waterfalls++;
          break;
        }
      }
    }
  // ------------------------------------------------------------------ the spawn clearing
  const clear = { x: spawn.x + 1, z: spawn.z - 5, r: 13 };
  {
    const base = top[Math.floor(spawn.z) * n + Math.floor(spawn.x)];
    for (let z = Math.floor(clear.z - clear.r - 6); z <= clear.z + clear.r + 6; z++)
      for (let x = Math.floor(clear.x - clear.r - 6); x <= clear.x + clear.r + 6; x++) {
        const k = z * n + x;
        const d = Math.hypot(x + 0.5 - clear.x, z + 0.5 - clear.z);
        if (d > clear.r + 6 || isWaterCell(t.cell[k])) continue;
        // level inside, easing into the land around it
        const w = smooth(clear.r, clear.r + 6, d);
        top[k] = base * (1 - w) + top[k] * w;
        t.elev[k] = Math.floor(top[k]);
        t.shadeElev[k] = Math.round(top[k] * 4) & 255;
        if (d < clear.r) t.tile[k] = g.grass;
      }
  }
  const dummies: DummySpot[] = [
    { id: 'dummy_a', name: 'Манекен А', x: spawn.x - 2.7, z: spawn.z - 10 },
    { id: 'dummy_b', name: 'Манекен Б', x: spawn.x - 1.3, z: spawn.z - 10 },
    { id: 'dummy_c', name: 'Манекен В', x: spawn.x + 6, z: spawn.z - 10 },
  ];
  // ------------------------------------------------------------------ trees
  const trees = placeTrees(t, n, m, { BIO, TEMP, RAIN, MTN, rDist, kind, road: roads.mask }, clear);
  // the floor under the trees: what falls from them (leaves, needles, twigs), roots by the
  // big trunks, moss and peat under the swamp trees
  forestFloor(t, n, trees, roads.mask, g, sRain);
  // the smooth ground over the final heights; trees stand on it
  t.buildSmooth(1);
  for (let i = 0; i < trees.count; i++) trees.y[i] = t.groundY(trees.x[i], trees.z[i]);
  stats.ms = Math.round((typeof performance !== 'undefined' ? performance.now() : Date.now()) - t0);
  return { map: WILD_MAP, terrain: t, spawn, dummies, trees, coarse: { m, biome: BIO, temp: TEMP, rain: RAIN, flow, level: fill, down, river: RIVER }, stats };
}

/**
 * Swamp pools: where the land is flat, low and wet, the hollows hold standing water a third of a
 * block deep (murky, waded like a stream), with boggy grass, peat and swamp mud around them and
 * over the wet ground between them. A pool only forms where all its dry neighbours rise to its
 * surface, so no water hangs over a bank.
 */
function makeSwamps(
  t: Terrain,
  n: number,
  top: Float32Array,
  kind: Uint8Array,
  sTemp: (x: number, z: number) => number,
  sRain: (x: number, z: number) => number,
  sMtn: (x: number, z: number) => number,
  swamp: number,
  mudGrass: number,
  peat: number,
  swampMud: number,
  stats: { swampCells: number },
) {
  const surf = new Float32Array(n * n).fill(NaN);
  const near = (k: number) => {
    const x = k % n;
    const z = (k / n) | 0;
    return x > 1 && z > 1 && x < n - 2 && z < n - 2;
  };
  for (let z = 2; z < n - 2; z++)
    for (let x = 2; x < n - 2; x++) {
      const k = z * n + x;
      if (t.cell[k] !== CELL.floor) continue;
      const above = top[k] - SEA;
      if (above < 0.5 || above > 14) continue;
      const rj = sRain(x, z);
      const tj = sTemp(x, z);
      if (rj < 0.6 || tj < 0.3 || tj > 0.8 || sMtn(x, z) > 0.15) continue;
      // swampy land comes in patches; inside them, pools where the ground dips
      const patch = fbm2(x / 70, z / 70, 611) + (rj - 0.6) * 0.8;
      if (patch < 0.63) continue;
      // the wet ground of the swamp between the pools
      const r = hash2(x, z, 615);
      if (r < (patch - 0.63) * 2.5) t.tile[k] = r < 0.12 ? peat : mudGrass;
      if (noise2(x / 6, z / 6, 612) * 0.7 + noise2(x / 2.5, z / 2.5, 613) * 0.3 < 0.52 - (patch - 0.6) * 0.6) continue;
      let flat = true;
      for (const o of [1, -1, n, -n]) if (Math.abs(top[k + o] - top[k]) > 0.5) flat = false;
      if (!flat) continue;
      // the surface on the water levels used everywhere (whole block - 0.62)
      surf[k] = Math.floor(top[k] + 0.62 + 0.05) - 0.62;
      if (surf[k] < top[k] - 0.65) surf[k] = NaN;
    }
  // drop pools whose dry neighbours are lower than the water, or whose wet neighbours differ
  for (let pass = 0; pass < 4; pass++)
    for (let k = 0; k < n * n; k++) {
      if (Number.isNaN(surf[k]) || !near(k)) continue;
      for (const o of [1, -1, n, -n, n + 1, n - 1, -n + 1, -n - 1]) {
        const j = k + o;
        const wet = !Number.isNaN(surf[j]);
        if ((wet && surf[j] !== surf[k]) || (!wet && (isWaterCell(t.cell[j]) || top[j] < surf[k] + 0.1))) {
          surf[k] = NaN;
          break;
        }
      }
    }
  for (let k = 0; k < n * n; k++) {
    if (Number.isNaN(surf[k])) continue;
    const x = k % n;
    const z = (k / n) | 0;
    t.cell[k] = CELL.shallow;
    t.tile[k] = swamp;
    t.elev[k] = Math.round(surf[k] + 0.62);
    top[k] = Math.floor((surf[k] - 0.3) * 4) / 4;
    t.shadeElev![k] = Math.round(top[k] * 4) & 255;
    kind[k] = 1;
    stats.swampCells++;
    // the swamp's banks: lush grass, moss and mud
    for (const o of [1, -1, n, -n, 2, -2, 2 * n, -2 * n]) {
      const j = k + o;
      if (t.cell[j] !== CELL.floor || !Number.isNaN(surf[j])) continue;
      const r = hash2(x + o, z, 614);
      t.tile[j] = r < 0.45 ? mudGrass : r < 0.75 ? peat : swampMud;
    }
  }
}

/**
 * The ground under the crowns of the trees: a ragged patch around each trunk of what falls from
 * that tree (fallen leaves and forest litter under broadleaves, needles under conifers, peat and
 * moss under swamp trees, nothing new in the desert or on snow), roots beside the big trunks, and
 * a mixed grass-and-earth edge where the litter meets the meadow. Where the trees stand close,
 * the patches join into a forest floor; single trees keep their own small circle.
 */
function forestFloor(t: Terrain, n: number, L: TreeList, road: Uint8Array, g: Record<string, number>, sRain: (x: number, z: number) => number) {
  const grassy = new Set([g.grass, g.grass2, g.lush, g.sun, g.clover, g.cold, g.dry, g.grassDirt]);
  const conifer = new Set<number>([TREE.spruce, TREE.pine]);
  const swampy = new Set<number>([TREE.cypress, TREE.tupelo, TREE.mossy, TREE.swampWillow, TREE.mangrove]);
  const skip = new Set<number>([TREE.joshua, TREE.ironwood, TREE.paloVerde, TREE.doumPalm, TREE.quiver, TREE.dead]);
  const src = t.tile.slice();
  for (let i = 0; i < L.count; i++) {
    const kd = L.kind[i];
    if (skip.has(kd)) continue;
    const tx = L.x[i];
    const tz = L.z[i];
    const big = TREE_SPECS[kd].trunk > 1;
    const R = 1.6 + L.scale[i] * (big ? 1.4 : 1);
    const wet = sRain(tx, tz) > 0.62;
    for (let z = Math.floor(tz - R - 1); z <= tz + R + 1; z++)
      for (let x = Math.floor(tx - R - 1); x <= tx + R + 1; x++) {
        if (x < 1 || z < 1 || x >= n - 1 || z >= n - 1) continue;
        const k = z * n + x;
        if (t.cell[k] !== CELL.floor || road[k] || !grassy.has(src[k])) continue;
        const d = Math.hypot(x + 0.5 - tx, z + 0.5 - tz) + (hash2(x, z, 621) - 0.5) * 1.4;
        if (d > R + 0.8) continue;
        if (d > R) {
          // the ragged edge: grass and earth mixed
          if (hash2(x, z, 622) < 0.6) t.tile[k] = g.grassDirt;
          continue;
        }
        // the kinds of litter lie in patches, not block by block
        const r = noise2(x / 3.5, z / 3.5, 623) * 0.8 + hash2(x, z, 622) * 0.2;
        if (big && d < 1.4 && r < 0.5) t.tile[k] = g.roots;
        else if (conifer.has(kd)) t.tile[k] = r < 0.85 ? g.needles : g.litter;
        else if (swampy.has(kd)) t.tile[k] = r < 0.45 ? g.peat : r < 0.8 ? g.dirtMoss : g.mudGrass;
        else if (wet) t.tile[k] = r < 0.35 ? g.dirtMoss : r < 0.65 ? g.litter : r < 0.85 ? g.leafLitter : g.humus;
        else t.tile[k] = r < 0.45 ? g.leafLitter : r < 0.8 ? g.litter : r < 0.92 ? g.humus : g.chernozem;
      }
  }
}

/**
 * Mixed blocks at the borders: a cell whose neighbour is another kind of ground becomes, often,
 * the block that mixes both (grass + earth, stone + snow, sand + clay ...), so no two grounds meet
 * along a hard line.
 */
function mixBorders(t: Terrain, n: number, g: Record<string, number>) {
  const fam = new Map<number, string>();
  const set = (f: string, ids: number[]) => ids.forEach((i) => fam.set(i, f));
  set('grass', [g.grass, g.grass2, g.lush, g.sun, g.clover, g.cold, g.dry]);
  set('dirt', [g.dirt, g.dirtDry, g.dirtStony, g.chernozem, g.packed, g.litter, g.leafLitter, g.humus, g.pebbles]);
  set('sand', [g.sand, g.redSand, g.sandPacked, g.sandStony]);
  set('stone', [g.stone, g.granite, g.andesite, g.diorite, g.limestone, g.cracked, g.desertRock, g.slate]);
  set('snow', [g.snow, g.snowLoose, g.snowDeep, g.snowPacked, g.snowStony]);
  set('gravel', [g.gravel]);
  set('moss', [g.moss, g.lichen]);
  set('mud', [g.mud, g.peat, g.swampMud]);
  set('clay', [g.clay, g.dryClay]);
  const pairs: Record<string, number> = {
    'grass/dirt': g.grassDirt, 'grass/stone': g.grassStone, 'grass/gravel': g.grassStone, 'grass/sand': g.grassSand, 'dirt/gravel': g.dirtGravel,
    'stone/snow': g.stoneSnow, 'stone/moss': g.stoneMoss, 'sand/stone': g.sandStone, 'mud/grass': g.mudGrass, 'snow/dirt': g.snowDirt,
    'snow/grass': g.snowDirt, 'sand/clay': g.sandClay, 'clay/sand': g.sandClay, 'gravel/dirt': g.dirtGravel, 'grass/mud': g.mudGrass,
  };
  const src = t.tile.slice();
  for (let z = 1; z < n - 1; z++)
    for (let x = 1; x < n - 1; x++) {
      const k = z * n + x;
      if (t.cell[k] !== CELL.floor) continue;
      const a = fam.get(src[k]);
      if (!a) continue;
      for (const o of [1, -1, n, -n]) {
        const j = k + o;
        if (t.cell[j] !== CELL.floor) continue;
        const b = fam.get(src[j]);
        if (!b || b === a) continue;
        const mixed = pairs[a + '/' + b];
        if (mixed !== undefined && hash2(x, z, 617) < 0.6) {
          t.tile[k] = mixed;
          break;
        }
      }
    }
}

function isWaterCell(c: number) {
  return c === CELL.liquid || c === CELL.shallow || c === CELL.ice;
}

/** Box blur of a coarse field (radius r cells), two passes. */
function blur(m: number, f: Float32Array, r: number): Float32Array {
  let a = f;
  for (let pass = 0; pass < 2; pass++) {
    const b = new Float32Array(m * m);
    for (let z = 0; z < m; z++)
      for (let x = 0; x < m; x++) {
        let s = 0;
        let c = 0;
        for (let d = -r; d <= r; d++) {
          const xx = pass === 0 ? x + d : x;
          const zz = pass === 0 ? z : z + d;
          if (xx < 0 || zz < 0 || xx >= m || zz >= m) continue;
          s += a[zz * m + xx];
          c++;
        }
        b[z * m + x] = s / c;
      }
    a = b;
  }
  return a;
}

/**
 * Where the hero starts: mild open plains near a river and near the middle of the land, on level
 * ground (the dummies' clearing is flattened around it).
 */
function findSpawn(t: Terrain, n: number, m: number, BIO: Uint8Array, TEMP: Float32Array, RAIN: Float32Array, rDist: Uint8Array): { x: number; z: number } {
  let best = -1;
  let bestScore = -1e9;
  for (let cz = 20; cz < m - 20; cz += 2)
    for (let cx = 20; cx < m - 20; cx += 2) {
      const ci = cz * m + cx;
      if (BIO[ci] !== BIOME.plains && BIOME.forest !== BIO[ci]) continue;
      const x = cx * C + 2;
      const z = cz * C + 2;
      // level, dry ground all around the clearing
      let lo = 1e9;
      let hi = -1e9;
      let ok = true;
      for (let dz = -16; dz <= 12 && ok; dz += 2)
        for (let dx = -14; dx <= 16; dx += 2) {
          const k = (z + dz) * n + x + dx;
          if (t.cell[k] !== CELL.floor) {
            ok = false;
            break;
          }
          lo = Math.min(lo, t.top![k]);
          hi = Math.max(hi, t.top![k]);
        }
      if (!ok || hi - lo > 2.5) continue;
      // a river within sight but not on the clearing
      let river = 99;
      for (let r = 14; r < 60 && river === 99; r += 4)
        for (let a = 0; a < 16; a++) {
          const rx = Math.round(x + Math.cos((a / 16) * Math.PI * 2) * r);
          const rz = Math.round(z + Math.sin((a / 16) * Math.PI * 2) * r);
          if (rx < 0 || rz < 0 || rx >= n || rz >= n) continue;
          if (t.cell[rz * n + rx] === CELL.shallow) {
            river = r;
            break;
          }
        }
      const score = -Math.hypot(cx - m / 2, cz - m / 2) * 0.5 - Math.abs(TEMP[ci] - 0.55) * 120 - Math.abs(RAIN[ci] - 0.5) * 60 - (hi - lo) * 10 - (river === 99 ? 60 : river * 0.3);
      if (score > bestScore) {
        bestScore = score;
        best = ci;
      }
    }
  if (best < 0) return { x: n / 2 + 0.5, z: n / 2 + 0.5 };
  return { x: (best % m) * C + 2.5, z: ((best / m) | 0) * C + 2.5 };
}

interface TreeFields {
  BIO: Uint8Array;
  TEMP: Float32Array;
  RAIN: Float32Array;
  MTN: Float32Array;
  rDist: Uint8Array;
  kind: Uint8Array;
  /** Road and path cells (no trees on them). */
  road: Uint8Array;
}

/**
 * Trees: one candidate per 3 × 3 block patch, kept with a probability from the biome, rain and
 * height, gathered into forest massifs and groves by a broad noise; neighbouring trees share a
 * species (species patches). Willows only by water, conifers in the cold and the mountains, dead
 * trees in the dry lands, fruit trees on fertile plains and forest edges. Trunk cells are solid.
 */
function placeTrees(t: Terrain, n: number, m: number, f: TreeFields, clear: { x: number; z: number; r: number }): TreeList {
  const xs: number[] = [];
  const zs: number[] = [];
  const kinds: number[] = [];
  const vars: number[] = [];
  const scales: number[] = [];
  const turns: number[] = [];
  const top = t.top!;
  const S = 2;
  // swamp ground (around the pools) grows the swamp trees
  const swampGround = new Set(['mud_grass', 'peat', 'swamp_mud'].map((nm) => t.tileNames.indexOf(nm)));
  /** A warm sea shore within a few blocks (mangroves). */
  const seaShore = (x: number, z: number) => {
    for (let a = 0; a < 8; a++)
      for (const r of [2, 4]) {
        const sx = Math.round(x + Math.cos((a / 8) * Math.PI * 2) * r);
        const sz = Math.round(z + Math.sin((a / 8) * Math.PI * 2) * r);
        if (sx >= 0 && sz >= 0 && sx < n && sz < n && f.kind[sz * n + sx] === 3) return true;
      }
    return false;
  };
  // distance to fresh water (lakes and rivers), coarse, for willows and lusher growth
  const water = new Uint8Array(m * m).fill(255);
  {
    const q: number[] = [];
    for (let i = 0; i < m * m; i++) {
      const x = (i % m) * C + 2;
      const z = ((i / m) | 0) * C + 2;
      const k = z * n + x;
      if (f.kind[k] === 1 || f.kind[k] === 2) {
        water[i] = 0;
        q.push(i);
      }
    }
    for (let h = 0; h < q.length; h++) {
      const i = q[h];
      const x = i % m;
      const z = (i / m) | 0;
      for (let k = 0; k < 4; k++) {
        const nx = x + D8X[k];
        const nz = z + D8Z[k];
        if (nx < 0 || nz < 0 || nx >= m || nz >= m) continue;
        const j = nz * m + nx;
        if (water[j] !== 255 || water[i] >= 12) continue;
        water[j] = water[i] + 1;
        q.push(j);
      }
    }
  }
  for (let gz = 0; gz < n / S; gz++)
    for (let gx = 0; gx < n / S; gx++) {
      const x = Math.min(n - 1, gx * S + Math.floor(hash2(gx, gz, 91) * S));
      const z = Math.min(n - 1, gz * S + Math.floor(hash2(gx, gz, 92) * S));
      const k = z * n + x;
      if (t.cell[k] !== CELL.floor || f.road[k]) continue;
      if (Math.hypot(x + 0.5 - clear.x, z + 0.5 - clear.z) < clear.r + 3) continue;
      const ci = Math.min(m - 1, (z / C) | 0) * m + Math.min(m - 1, (x / C) | 0);
      const bio = f.BIO[ci];
      const temp = f.TEMP[ci];
      const rain = f.RAIN[ci];
      const h = top[k] - SEA;
      // level ground only (no trees on cliffs) and room around the trunk
      let flat = true;
      for (const o of [1, -1, n, -n]) {
        const j = k + o;
        if (j < 0 || j >= n * n || t.cell[j] !== CELL.floor || Math.abs(top[j] - top[k]) > 0.5) flat = false;
      }
      if (!flat) continue;
      const wd = water[ci];
      const massif = fbm2(x / 90, z / 90, 93);
      const grove = fbm2(x / 28, z / 28, 94);
      let p = 0;
      const swamp = swampGround.has(t.tile[k]);
      const mangrove = temp > 0.55 && h < 3 && rain > 0.35 && seaShore(x, z);
      switch (bio) {
        case BIOME.forest:
          p = 0.2 + smooth(0.5, 0.8, rain) * 0.14 - smooth(0.42, 0.3, massif) * 0.2;
          break;
        case BIOME.conifer:
          p = 0.18 + rain * 0.15 - smooth(0.42, 0.3, massif) * 0.17;
          break;
        case BIOME.tundra:
          p = temp > 0.1 ? 0.14 * smooth(0.45, 0.62, massif) + 0.015 : 0.005;
          break;
        case BIOME.plains:
          p = smooth(0.58, 0.7, grove) * 0.28 + smooth(0.62, 0.75, massif) * 0.2 + 0.006;
          break;
        case BIOME.steppe:
          p = 0.006 + smooth(0.68, 0.78, grove) * 0.07;
          break;
        case BIOME.desert:
          // a few hardy trees on the sand, palms at the oases by the water
          p = 0.005 + (wd <= 3 ? 0.08 : 0);
          break;
        case BIOME.alpine:
          p = 0.035 * (1 - smooth(36, 55, h));
          break;
        case BIOME.volcanic:
          p = 0.01;
          break;
        case BIOME.beach:
          p = 0.01;
          break;
      }
      if (swamp) p = 0.16;
      if (mangrove) p = 0.08;
      // fewer trees high up, more by the water
      p *= 1 - smooth(20, 40, h);
      if (wd <= 3 && bio !== BIOME.desert && bio !== BIOME.tundra) p += 0.1;
      // a little more room in the woods (with the spacing below, about a fifth fewer trees):
      // small glades where the canopy opens; the dense heart of a massif stays dense
      p *= 1.04;
      p *= 1 - smooth(0.6, 0.68, fbm2(x / 26, z / 26, 101)) * (1 - smooth(0.6, 0.75, massif));
      if (hash2(x, z, 95) >= p) continue;
      // no two trunks side by side: a tree needs a free block around it (now and then two)
      let crowded = false;
      for (let dz = -2; dz <= 2 && !crowded; dz++)
        for (let dx = -2; dx <= 2; dx++) {
          const j = k + dz * n + dx;
          if ((dx || dz) && j >= 0 && j < n * n && t.cell[j] === CELL.solid && (Math.max(Math.abs(dx), Math.abs(dz)) < 2 || hash2(x + dx, z + dz, 102) < 0.08)) {
            crowded = true;
            break;
          }
        }
      if (crowded) continue;
      // species by biome, in patches (one species dominating a stretch of forest)
      const patch = fbm2(x / 40, z / 40, 96);
      const r = hash2(x, z, 97);
      let kd: number;
      if (swamp) {
        // swamp trees: cypress by the pools, tupelo and old moss-hung trees, crooked swamp willows
        kd = r < 0.32 ? TREE.cypress : r < 0.55 ? TREE.tupelo : r < 0.78 ? TREE.mossy : TREE.swampWillow;
      } else if (mangrove) kd = TREE.mangrove;
      else if (bio === BIOME.desert) {
        if (wd <= 3) kd = r < 0.6 ? TREE.doumPalm : TREE.paloVerde;
        else kd = r < 0.32 ? TREE.joshua : r < 0.52 ? TREE.ironwood : r < 0.68 ? TREE.paloVerde : r < 0.86 ? TREE.quiver : TREE.dead;
      } else if (wd <= 2 && temp > 0.45 && rain > 0.6 && r < 0.25) kd = TREE.swampWillow;
      else if (wd <= 2 && temp > 0.3 && r < 0.65) kd = TREE.willow;
      else if (bio === BIOME.steppe && temp > 0.5) kd = r < 0.3 ? TREE.dead : r < 0.48 ? TREE.ironwood : r < 0.64 ? TREE.paloVerde : r < 0.76 ? TREE.joshua : TREE.small;
      else if (bio === BIOME.desert || bio === BIOME.steppe || bio === BIOME.volcanic || bio === BIOME.beach) kd = r < 0.7 ? TREE.dead : TREE.small;
      else if (bio === BIOME.tundra) kd = r < 0.8 ? TREE.spruce : TREE.pine;
      else if (bio === BIOME.conifer || bio === BIOME.alpine) kd = patch < 0.5 ? (r < 0.75 ? TREE.spruce : TREE.pine) : r < 0.75 ? TREE.pine : TREE.spruce;
      else if (bio === BIOME.forest) {
        // fruit trees at the edges of the forest, oak and birch stands inside
        const edge = massif < 0.47;
        if (edge && r < 0.3) kd = TREE.fruit;
        else if (r < 0.18) kd = TREE.small;
        else kd = patch < 0.45 ? (r < 0.8 ? TREE.oak : TREE.birch) : r < 0.75 ? TREE.birch : TREE.oak;
        if (temp < 0.42 && r > 0.85) kd = TREE.spruce;
        // old trees hung with moss in the wettest woods
        if (rain > 0.68 && r > 0.92) kd = TREE.mossy;
      } else {
        kd = r < 0.32 ? TREE.fruit : r < 0.62 ? TREE.oak : r < 0.82 ? TREE.small : TREE.birch;
      }
      const v = Math.floor(hash2(x, z, 98) * 4);
      const sc = 0.88 + hash2(x, z, 99) * 0.26;
      xs.push(x + 0.5);
      zs.push(z + 0.5);
      kinds.push(kd);
      vars.push(v);
      scales.push(sc);
      turns.push(Math.floor(hash2(x, z, 100) * 4));
      // the trunk blocks its cell (shots and walkers alike)
      t.cell[k] = CELL.solid;
      t.height[k] = Math.min(255, Math.round(treeHeight(kd, v) * sc));
    }
  // sort into chunks
  const per = Math.ceil(n / TREE_CHUNK);
  const count = xs.length;
  const chunkOf = (i: number) => Math.floor(zs[i] / TREE_CHUNK) * per + Math.floor(xs[i] / TREE_CHUNK);
  const counts = new Int32Array(per * per + 1);
  for (let i = 0; i < count; i++) counts[chunkOf(i) + 1]++;
  for (let c = 0; c < per * per; c++) counts[c + 1] += counts[c];
  const fillAt = counts.slice();
  const L: TreeList = {
    count,
    x: new Float32Array(count),
    z: new Float32Array(count),
    y: new Float32Array(count),
    kind: new Uint8Array(count),
    variant: new Uint8Array(count),
    turn: new Uint8Array(count),
    scale: new Float32Array(count),
    per,
    chunkStart: counts,
  };
  for (let i = 0; i < count; i++) {
    const j = fillAt[chunkOf(i)]++;
    L.x[j] = xs[i];
    L.z[j] = zs[i];
    L.y[j] = top[Math.floor(zs[i]) * n + Math.floor(xs[i])];
    L.kind[j] = kinds[i];
    L.variant[j] = vars[i];
    L.turn[j] = turns[i];
    L.scale[j] = scales[i];
  }
  void TREE_KINDS;
  return L;
}

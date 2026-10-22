import { hash2 } from '../core/Rng';
import { CELL, type Terrain } from '../game/Terrain';

/**
 * Roads and paths of the wild world. Places people would go (open low ground spread over the
 * continent, the spawn among them) are joined by roads along the easiest ways: a search over an
 * 8-block grid that avoids steep ground, lakes and the sea and crosses rivers at fords. The way is
 * then rounded into smooth curves, the ground under it eased to gentle steps, and the surface
 * chosen by the land it crosses: packed earth on the plains, pebbly earth in the woods, gravel in
 * the mountains, packed sand in the desert, trodden snow in the north, mud in the swamps, and here
 * and there an old overgrown cobble road. Narrow paths lead off the roads into the land around.
 */

export interface RoadFields {
  BIO: Uint8Array;
  H1: Float32Array;
  MTN: Float32Array;
  isSea: (i: number) => boolean;
  fill: Float32Array;
  m: number;
  C: number;
}

export interface RoadTiles {
  packed: number;
  pebbles: number;
  gravel: number;
  cobble: number;
  sandPacked: number;
  snowPacked: number;
  snowDirty: number;
  mud: number;
  grassDirt: number;
  dirtGravel: number;
  dirt: number;
  sandStony: number;
}

/** Road grid step (blocks). */
const G = 8;
/** Widths (blocks) of a road and of a path. */
const ROAD_W = 3;
const PATH_W = 1.4;
/** Places joined by roads (the spawn is one of them). */
const SITES = 26;

class Heap {
  ids: number[] = [];
  keys: number[] = [];
  get size() {
    return this.ids.length;
  }
  push(id: number, k: number) {
    const ids = this.ids;
    const keys = this.keys;
    let i = ids.length;
    ids.push(id);
    keys.push(k);
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (keys[p] <= k) break;
      ids[i] = ids[p];
      keys[i] = keys[p];
      i = p;
    }
    ids[i] = id;
    keys[i] = k;
  }
  pop(): number {
    const ids = this.ids;
    const keys = this.keys;
    const top = ids[0];
    const id = ids.pop()!;
    const k = keys.pop()!;
    if (!ids.length) return top;
    let i = 0;
    for (;;) {
      const l = i * 2 + 1;
      if (l >= ids.length) break;
      const r = l + 1;
      const c = r < ids.length && keys[r] < keys[l] ? r : l;
      if (keys[c] >= k) break;
      ids[i] = ids[c];
      keys[i] = keys[c];
      i = c;
    }
    ids[i] = id;
    keys[i] = k;
    return top;
  }
}

export function makeRoads(t: Terrain, n: number, top: Float32Array, spawn: { x: number; z: number }, f: RoadFields, tl: RoadTiles): { mask: Uint8Array; cells: number } {
  const R = n / G;
  // ------------------------------------------------------------------ the road grid
  const hgt = new Float32Array(R * R);
  /** Extra cost of entering a cell: Infinity for lakes and the sea, a ford over a river. */
  const extra = new Float32Array(R * R);
  for (let z = 0; z < R; z++)
    for (let x = 0; x < R; x++) {
      const i = z * R + x;
      const bx = x * G + G / 2;
      const bz = z * G + G / 2;
      const k = Math.floor(bz) * n + Math.floor(bx);
      const ci = Math.min(f.m - 1, Math.floor(bz / f.C)) * f.m + Math.min(f.m - 1, Math.floor(bx / f.C));
      hgt[i] = top[k];
      const c = t.cell[k];
      let wet = 0;
      let deep = 0;
      for (let dz = -3; dz <= 3; dz += 3)
        for (let dx = -3; dx <= 3; dx += 3) {
          const cc = t.cell[Math.min(n - 1, Math.max(0, Math.floor(bz) + dz)) * n + Math.min(n - 1, Math.max(0, Math.floor(bx) + dx))];
          if (cc === CELL.liquid) deep++;
          if (cc === CELL.shallow) wet++;
        }
      if (f.isSea(ci) || c === CELL.liquid || deep > 2) extra[i] = Infinity;
      else extra[i] = (wet ? 8 : 0) + f.MTN[ci] * 6 + (x < 2 || z < 2 || x > R - 3 || z > R - 3 ? Infinity : 0);
    }
  const used = new Uint8Array(R * R);
  /** Easiest way between two grid cells (A*), or null. */
  const route = (a: number, b: number): number[] | null => {
    const g = new Float32Array(R * R).fill(Infinity);
    const from = new Int32Array(R * R).fill(-1);
    const heap = new Heap();
    const bx = b % R;
    const bz = (b / R) | 0;
    g[a] = 0;
    heap.push(a, 0);
    while (heap.size) {
      const i = heap.pop();
      if (i === b) break;
      const x = i % R;
      const z = (i / R) | 0;
      for (let dz = -1; dz <= 1; dz++)
        for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dz) continue;
          const nx = x + dx;
          const nz = z + dz;
          if (nx < 0 || nz < 0 || nx >= R || nz >= R) continue;
          const j = nz * R + nx;
          if (extra[j] === Infinity) continue;
          const len = dx && dz ? Math.SQRT2 : 1;
          const climb = Math.abs(hgt[j] - hgt[i]) / (G * len);
          // roads join roads already built, avoid slopes, cross rivers only where they must
          const c = len * (1 + climb * 40 + climb * climb * 400 + extra[j]) * (used[j] ? 0.45 : 1);
          const ng = g[i] + c;
          if (ng >= g[j]) continue;
          g[j] = ng;
          from[j] = i;
          heap.push(j, ng + Math.hypot(nx - bx, nz - bz) * 0.9);
        }
    }
    if (from[b] < 0) return null;
    const out: number[] = [];
    for (let i = b; i >= 0; i = from[i]) {
      out.push(i);
      if (i === a) break;
    }
    return out.reverse();
  };
  // ------------------------------------------------------------------ places and roads between them
  const cellOf = (x: number, z: number) => Math.min(R - 1, Math.max(0, Math.floor(z / G))) * R + Math.min(R - 1, Math.max(0, Math.floor(x / G)));
  const cand: number[] = [];
  for (let z = 4; z < R - 4; z += 3)
    for (let x = 4; x < R - 4; x += 3) {
      const i = z * R + x;
      if (extra[i] === Infinity || extra[i] > 3) continue;
      let flat = true;
      for (const o of [1, -1, R, -R]) if (Math.abs(hgt[i + o] - hgt[i]) > 2.5) flat = false;
      if (flat) cand.push(i);
    }
  const sites = [cellOf(spawn.x, spawn.z)];
  while (sites.length < SITES && cand.length) {
    let best = -1;
    let bs = -Infinity;
    for (const c of cand) {
      let d = Infinity;
      for (const s of sites) d = Math.min(d, Math.hypot((c % R) - (s % R), ((c / R) | 0) - ((s / R) | 0)));
      // spread out, but rather in the valleys than on the heights
      const sc = d - Math.max(0, hgt[c] - 6) * 0.15 + hash2(c, 3, 501) * 3;
      if (sc > bs) {
        bs = sc;
        best = c;
      }
    }
    if (best < 0 || bs < 18) break;
    sites.push(best);
  }
  // a tree of roads joining all places (shortest links first), plus a few loops
  const edges: [number, number][] = [];
  {
    const inTree = [0];
    const rest = sites.slice(1).map((_, i) => i + 1);
    const dist = (a: number, b: number) => Math.hypot((sites[a] % R) - (sites[b] % R), ((sites[a] / R) | 0) - ((sites[b] / R) | 0));
    while (rest.length) {
      let bi = -1;
      let bj = -1;
      let bd = Infinity;
      for (const a of inTree)
        for (let r = 0; r < rest.length; r++) {
          const d = dist(a, rest[r]);
          if (d < bd) {
            bd = d;
            bi = a;
            bj = r;
          }
        }
      edges.push([bi, rest[bj]]);
      inTree.push(rest[bj]);
      rest.splice(bj, 1);
    }
    for (let a = 0; a < sites.length; a++) {
      let bb = -1;
      let bd = Infinity;
      for (let b = 0; b < sites.length; b++) {
        if (a === b || edges.some(([p, q]) => (p === a && q === b) || (p === b && q === a))) continue;
        const d = dist(a, b);
        if (d < bd) {
          bd = d;
          bb = b;
        }
      }
      if (bb >= 0 && bd < 40 && hash2(a, bb, 502) < 0.35) edges.push([a, bb]);
    }
  }
  // ------------------------------------------------------------------ lay them on the ground
  /** Per block: distance to the nearest road line, that line's height and width, its kind. */
  const dist = new Float32Array(n * n).fill(99);
  const lineH = new Float32Array(n * n);
  const lineW = new Float32Array(n * n);
  const lineOld = new Uint8Array(n * n);
  const lay = (path: number[], w: number, old: boolean) => {
    for (const i of path) used[i] = 1;
    // grid cell centres, rounded into curves (Chaikin), then sampled every half block
    let pts = path.map((i) => [(i % R) * G + G / 2 + (hash2(i, 1, 503) - 0.5) * 3, ((i / R) | 0) * G + G / 2 + (hash2(i, 2, 503) - 0.5) * 3]);
    for (let it = 0; it < 3; it++) {
      const q: number[][] = [pts[0]];
      for (let k = 0; k < pts.length - 1; k++) {
        const [ax, az] = pts[k];
        const [bx, bz] = pts[k + 1];
        q.push([ax * 0.75 + bx * 0.25, az * 0.75 + bz * 0.25], [ax * 0.25 + bx * 0.75, az * 0.25 + bz * 0.75]);
      }
      q.push(pts[pts.length - 1]);
      pts = q;
    }
    const samp: number[][] = [];
    for (let k = 0; k < pts.length - 1; k++) {
      const [ax, az] = pts[k];
      const [bx, bz] = pts[k + 1];
      const steps = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az) * 2));
      for (let s = 0; s < steps; s++) samp.push([ax + ((bx - ax) * s) / steps, az + ((bz - az) * s) / steps]);
    }
    // the road's own height: the ground under it, evened out along the way
    const raw = samp.map(([x, z]) => top[Math.min(n - 1, Math.max(0, Math.floor(z))) * n + Math.min(n - 1, Math.max(0, Math.floor(x)))]);
    const W = 12;
    const sm = raw.map((_, k) => {
      let s = 0;
      let c = 0;
      for (let j = Math.max(0, k - W); j <= Math.min(raw.length - 1, k + W); j++) {
        s += raw[j];
        c++;
      }
      return s / c;
    });
    const reach = w / 2 + 2.6;
    samp.forEach(([px, pz], k) => {
      for (let z = Math.floor(pz - reach); z <= pz + reach; z++)
        for (let x = Math.floor(px - reach); x <= px + reach; x++) {
          if (x < 1 || z < 1 || x >= n - 1 || z >= n - 1) continue;
          const d = Math.hypot(x + 0.5 - px, z + 0.5 - pz) - w / 2;
          const j = z * n + x;
          if (d >= dist[j]) continue;
          dist[j] = d;
          lineH[j] = sm[k];
          lineW[j] = w;
          lineOld[j] = old ? 1 : 0;
        }
    });
  };
  edges.forEach(([a, b], e) => {
    const p = route(sites[a], sites[b]);
    // an old road here and there, overgrown cobbles
    if (p) lay(p, ROAD_W, hash2(e, 0, 504) < 0.22);
  });
  // paths: narrow ways from each place out into the land around
  sites.forEach((s, si) => {
    for (let k = 0; k < 2; k++) {
      const a = hash2(si, k, 505) * Math.PI * 2;
      const len = 8 + hash2(si, k, 506) * 8;
      const tx = Math.round((s % R) + Math.cos(a) * len);
      const tz = Math.round(((s / R) | 0) + Math.sin(a) * len);
      if (tx < 3 || tz < 3 || tx >= R - 3 || tz >= R - 3) continue;
      const tgt = tz * R + tx;
      if (extra[tgt] === Infinity) continue;
      const p = route(s, tgt);
      if (p) lay(p, PATH_W, false);
    }
  });
  // ------------------------------------------------------------------ surface and grade
  const mask = new Uint8Array(n * n);
  let cells = 0;
  const q4 = (v: number) => Math.round(v * 4) / 4;
  for (let z = 1; z < n - 1; z++)
    for (let x = 1; x < n - 1; x++) {
      const k = z * n + x;
      const d = dist[k];
      if (d >= 2.6 || t.cell[k] !== CELL.floor) continue;
      const hl = lineH[k];
      if (d < 0) {
        // the road itself: level with the road line (a gentle cut or fill)
        top[k] = Math.max(0, q4(hl));
        mask[k] = lineW[k] > 2 ? 1 : 2;
        cells++;
        const ci = Math.min(f.m - 1, Math.floor(z / f.C)) * f.m + Math.min(f.m - 1, Math.floor(x / f.C));
        t.tile[k] = surface(t, k, x, z, lineW[k] > 2, lineOld[k] === 1, d, f.BIO[ci] === 5 || f.BIO[ci] === 6, tl);
      } else {
        // the verge eases back into the land
        const w = d / 2.6;
        top[k] = Math.max(0, q4(hl * (1 - w) + top[k] * w));
        if (d < 0.8 && hash2(x, z, 507) < 0.5) t.tile[k] = edge(t, k, tl);
      }
      t.elev[k] = Math.floor(top[k]);
      if (t.shadeElev) t.shadeElev[k] = Math.round(top[k] * 4) & 255;
    }
  return { mask, cells };
}

/** The ground a road cell gets, by the land it crosses. */
function surface(t: Terrain, k: number, x: number, z: number, road: boolean, old: boolean, d: number, woods: boolean, tl: RoadTiles): number {
  const nm = t.tileNames[t.tile[k]] ?? '';
  const rag = hash2(x, z, 508);
  if (/snow|ice|frozen/.test(nm)) return d > -0.6 && rag < 0.5 ? tl.snowDirty : tl.snowPacked;
  if (/sand|salt|cracked_earth|dry_clay|desert/.test(nm)) return d > -0.6 && rag < 0.4 ? tl.sandStony : tl.sandPacked;
  if (/mud|peat|swamp/.test(nm)) return tl.mud;
  if (old && road) return rag < 0.12 ? tl.grassDirt : tl.cobble;
  if (/stone|granite|andesite|slate|gravel|basalt|tuff|rock|marble|diorite|limestone|moss_stone|lichen/.test(nm)) return rag < 0.3 ? tl.dirtGravel : tl.gravel;
  // forest ways: pebbly earth paths, packed roads with pebbles in them
  if (woods || /litter|humus|needle|roots|chernozem|moss/.test(nm)) return road ? (rag < 0.3 ? tl.pebbles : tl.packed) : tl.pebbles;
  // the middle of a road is worn bare, its sides a little grassy
  if (!road) return rag < 0.2 ? tl.dirt : tl.packed;
  return d > -0.6 && rag < 0.35 ? tl.dirtGravel : tl.packed;
}

/** The ragged edge of a road: grass and earth mixed, or the land's own mix. */
function edge(t: Terrain, k: number, tl: RoadTiles): number {
  const nm = t.tileNames[t.tile[k]] ?? '';
  if (/snow|ice|frozen/.test(nm)) return tl.snowDirty;
  if (/sand|salt|desert/.test(nm)) return tl.sandStony;
  if (/grass/.test(nm)) return tl.grassDirt;
  return t.tile[k];
}

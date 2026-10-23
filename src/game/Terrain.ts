import { WALLS } from '../config/walls';
import { noise2 } from '../core/Rng';

/** Cell kinds on the navigation grid (1 cell = 1 world unit = 1 block). */
export const CELL = {
  floor: 0,
  solid: 1, // blocks walkers, flyers pass
  liquid: 2, // water/lava lake/void: blocks walkers, flyers pass
  hazard: 3, // walkable, damages the player
  ice: 4, // walkable, slippery
  wall: 5, // map border: blocks everything
  shallow: 6, // a shallow stream or river: walkable (the hero wades), drawn as water
} as const;

/** Cells drawn as water: deep (blocks walkers) and shallow (waded). */
export function isWater(c: number): boolean {
  return c === CELL.liquid || c === CELL.shallow;
}

/** Height limits for walkers (world units): a step taken on foot, and a ledge caught mid-jump. */
const STEP = {
  walk: 1.01,
  /** Added to the feet height while airborne: the 1.35 jump apex reaches two-block ledges. */
  air: 0.8,
};

/**
 * Continuous ground: walkers follow the sloped surface (see Terrain.buildSurface). A slope steeper
 * than `maxTan` (rise per unit run, ~40°) cannot be climbed; a sudden rise taller than `lip` is a
 * wall (cliff, rock face); a drop taller than `fall` is a fall.
 */
export const SLOPE = {
  /** Owner (update 8, D212): smooth slopes up to 45° are walked, steeper ones are blocked. */
  maxTan: Math.tan((45 * Math.PI) / 180),
  /** Half blocks (and quarter blocks) are stepped up on foot; a whole block needs a jump. */
  lip: 0.55,
  fall: 0.6,
  /**
   * Rises the hero climbs by jumping (rpg/Player JUMP: the jump peaks 1.35 above the feet, a
   * double jump about 2.45): paths may cross them and the hero jumps at the foot on its own.
   */
  jump: 1.2,
  doubleJump: 2.2,
};

/** Surface height of liquid cells over their elevation: water and lava below the banks, the void a chasm. */
export function liquidLevel(name: string): number {
  if (/void/.test(name)) return -6;
  if (/lava/.test(name)) return -0.5;
  return -0.62;
}

export class Terrain {
  readonly cell: Uint8Array;
  readonly tile: Uint8Array;
  /** Column height used for block culling and visuals. */
  readonly height: Uint8Array;
  /**
   * Ground elevation in whole blocks (0 = the lowest floor). Every cell can be raised: walkers
   * step up and down one block at a time, jump up two, and fall off anything taller (see STEP).
   */
  readonly elev: Uint8Array | Uint16Array;
  /**
   * World position of cell (0, 0) (0 on fixed maps). Every coordinate method takes WORLD coordinates and subtracts this;
   * index-based methods (centerY(i), passable(i, j), ...) and the arrays are window-local.
   * Map builders run with the origin at 0, so their local cells are world cells.
   */
  ox = 0;
  oz = 0;
  /** Optional per-cell shade elevation for the ground shader (0..15 scale, snow/rock looks). */
  shadeElev: Uint8Array | null = null;
  /** Cells the hero can reach from the spawn on foot or with jumps (1), set by the generator. */
  reach: Uint8Array | null = null;
  tileNames: string[] = [];
  /**
   * Sloped ground: four corner heights per cell (k = dx + 2 * dz from the cell's min corner),
   * null until buildSurface. Corners are shared with linked neighbours (no gaps); across a cliff
   * (elevation tiers two or more apart, or a shore) they differ and the renderer draws a rock face.
   */
  corner: Float32Array | null = null;
  /** Smoothed centre height per cell (the field the corners are made from). */
  surf: Float32Array | null = null;
  /**
   * Block ground: one flat-topped block per cell, its top height here (quarter-block steps).
   * Takes the place of `corner` (a quarter of the memory on big worlds); for water cells it is the
   * bed under the water.
   */
  top: Float32Array | null = null;
  /**
   * Running water: the direction a river cell flows (angle * 256 / 2pi, plus 1; 0 = still
   * water), set by the generator for the water's surface animation.
   */
  flow: Uint8Array | null = null;
  /**
   * Smooth ground (owner, update 8): one height per cell corner, (size + 1)² vertices shared by all
   * neighbouring dry cells, so the surface has no steps (bilinear inside a cell, smooth normals).
   * Built from `top` by buildSmooth. Water cells take the same vertices, kept just under their
   * surface at the banks; `hard` cells keep their own flat top with sheer sides (real cliffs).
   */
  vert: Float32Array | null = null;
  /** Cells kept as flat-topped blocks with sheer sides (test-scene pillars and steps), or null. */
  hard: Uint8Array | null = null;
  constructor(readonly size: number, tall = false) {
    this.cell = new Uint8Array(size * size);
    this.tile = new Uint8Array(size * size);
    this.height = new Uint8Array(size * size);
    this.elev = tall ? new Uint16Array(size * size) : new Uint8Array(size * size);
  }

  /** Window-local cell tests (no origin shift). */
  inLocal(cx: number, cz: number): boolean {
    return cx >= 0 && cz >= 0 && cx < this.size && cz < this.size;
  }
  blocksLocal(cx: number, cz: number): boolean {
    if (!this.inLocal(cx, cz)) return true;
    const c = this.cell[cz * this.size + cx];
    return c === CELL.solid || c === CELL.liquid || c === CELL.wall;
  }

  /** Ground elevation of the cell under (x, z), 0 outside the map. */
  elevAt(x: number, z: number): number {
    const cx = Math.floor(x - this.ox);
    const cz = Math.floor(z - this.oz);
    return this.inLocal(cx, cz) ? this.elev[cz * this.size + cx] : 0;
  }

  private cbuf = new Float32Array(4);
  private cbuf2 = new Float32Array(4);
  /** The four walking-surface corners of cell i (k = dx + 2 dz), or null on flat-block ground. */
  private cornersOf(i: number, out = this.cbuf): Float32Array | null {
    if (this.corner) return this.corner.subarray(i * 4, i * 4 + 4);
    if (!this.vert) return null;
    for (let k = 0; k < 4; k++) out[k] = this.cornerH(i, k);
    return out;
  }

  /** Surface height of a water cell (water and lava sit below the banks, the void is a chasm). */
  waterLevel(i: number): number {
    return this.elev[i] + liquidLevel(this.tileNames[this.tile[i]] ?? '');
  }

  /** Height of corner k (dx + 2 dz) of cell i on the smooth ground. */
  cornerH(i: number, k: number): number {
    if (this.corner) return this.corner[i * 4 + k];
    const V = this.vert;
    if (!V) return this.top ? this.top[i] : this.elev[i];
    if (this.hard && this.hard[i]) return this.top![i];
    const n = this.size;
    const x = i % n;
    const z = (i / n) | 0;
    return V[(z + (k >> 1)) * (n + 1) + x + (k & 1)];
  }

  /**
   * Turns the per-cell heights in `top` into the smooth ground (`vert`): each vertex takes the mean
   * of the dry cells around it (water beds where it has none), then `iters` passes of smoothing;
   * a vertex beside water never sinks below that water's surface (banks above the water).
   */
  buildSmooth(iters = 2) {
    const n = this.size;
    const N = n + 1;
    const top = this.top!;
    const V = new Float32Array(N * N);
    const floor = new Float32Array(N * N).fill(-Infinity);
    const dry = new Uint8Array(N * N);
    for (let vz = 0; vz < N; vz++)
      for (let vx = 0; vx < N; vx++) {
        let sd = 0, cd = 0, sw = 0, cw = 0, sh = 0, chd = 0;
        let wl = -Infinity;
        for (let k = 0; k < 4; k++) {
          const cx = vx - 1 + (k & 1);
          const cz = vz - 1 + (k >> 1);
          if (cx < 0 || cz < 0 || cx >= n || cz >= n) continue;
          const i = cz * n + cx;
          if (this.hard && this.hard[i]) {
            sh += top[i];
            chd++;
          } else if (isWater(this.cell[i])) {
            sw += top[i];
            cw++;
            wl = Math.max(wl, this.waterLevel(i));
          } else {
            sd += top[i];
            cd++;
          }
        }
        const v = vz * N + vx;
        V[v] = cd ? sd / cd : cw ? sw / cw : chd ? sh / chd : 0;
        if (cd) {
          dry[v] = 1;
          if (cw) floor[v] = wl + 0.06;
          V[v] = Math.max(V[v], floor[v]);
        }
      }
    let A = V;
    let B = new Float32Array(N * N);
    for (let it = 0; it < iters; it++) {
      for (let vz = 0; vz < N; vz++)
        for (let vx = 0; vx < N; vx++) {
          const v = vz * N + vx;
          if (!dry[v]) {
            B[v] = A[v];
            continue;
          }
          let s = A[v] * 4;
          let c = 4;
          if (vx > 0 && dry[v - 1]) (s += A[v - 1]), c++;
          if (vx < n && dry[v + 1]) (s += A[v + 1]), c++;
          if (vz > 0 && dry[v - N]) (s += A[v - N]), c++;
          if (vz < n && dry[v + N]) (s += A[v + N]), c++;
          B[v] = Math.max(s / c, floor[v]);
        }
      [A, B] = [B, A];
    }
    this.shoreline(A, dry);
    this.vert = A;
  }

  /**
   * Smooth shorelines: the water's edge is where the smooth ground crosses the water surface, not a
   * cell edge. Vertices shared by water and land sit a little under the water (by a smooth noise),
   * the dry vertices next to them a little over it (by another), the vertices inside the water on
   * its bed; so the shore curves through the bank cells in organic bays and points while every dry
   * cell keeps its middle above the water (see shoreY).
   */
  private shoreline(V: Float32Array, dry: Uint8Array) {
    const n = this.size;
    const N = n + 1;
    const wl = new Float32Array(N * N).fill(-Infinity);
    const wet = new Uint8Array(N * N);
    for (let vz = 0; vz < N; vz++)
      for (let vx = 0; vx < N; vx++) {
        const v = vz * N + vx;
        for (let k = 0; k < 4; k++) {
          const cx = vx - 1 + (k & 1);
          const cz = vz - 1 + (k >> 1);
          if (cx < 0 || cz < 0 || cx >= n || cz >= n) continue;
          const i = cz * n + cx;
          if (isWater(this.cell[i]) && !(this.hard && this.hard[i])) {
            wet[v] = 1;
            wl[v] = Math.max(wl[v], this.waterLevel(i));
          }
        }
      }
    const ox = this.ox;
    const oz = this.oz;
    const nz = (x: number, z: number, s: number) => {
      const v = noise2((x + ox) * 0.23, (z + oz) * 0.23, s) * 0.6 + noise2((x + ox) * 0.7, (z + oz) * 0.7, s + 7) * 0.4;
      const k = Math.max(0, Math.min(1, (v - 0.28) / 0.44));
      return k * k * (3 - 2 * k);
    };
    // the lowest water level next to each dry vertex (for the ring of bank vertices)
    const ring = new Float32Array(N * N).fill(-Infinity);
    for (let vz = 0; vz < N; vz++)
      for (let vx = 0; vx < N; vx++) {
        const v = vz * N + vx;
        if (!wet[v]) continue;
        if (dry[v]) V[v] = wl[v] - 0.12 - 0.2 * nz(vx, vz, 31);
        else V[v] = Math.min(V[v], wl[v] - 0.3);
        for (let dz = -1; dz <= 1; dz++)
          for (let dx = -1; dx <= 1; dx++) {
            const ax = vx + dx;
            const az = vz + dz;
            if (ax < 0 || az < 0 || ax > n || az > n) continue;
            const a = az * N + ax;
            if (!wet[a]) ring[a] = Math.max(ring[a], wl[v]);
          }
      }
    for (let v = 0; v < N * N; v++) if (ring[v] > -Infinity) V[v] = Math.max(V[v], ring[v] + 0.3 + 0.3 * nz(v % N, (v / N) | 0, 47));
    // a bank cell squeezed between waters (a spit, an islet) still keeps its middle above them:
    // its shore corners rise until it does
    for (let pass = 0; pass < 3; pass++)
      for (let z = 0; z < n; z++)
        for (let x = 0; x < n; x++) {
          const i = z * n + x;
          if (isWater(this.cell[i]) || (this.hard && this.hard[i])) continue;
          const vs = [z * N + x, z * N + x + 1, (z + 1) * N + x, (z + 1) * N + x + 1];
          let w = -Infinity;
          let s = 0;
          let c = 0;
          for (const v of vs) {
            s += V[v];
            if (wet[v]) {
              w = Math.max(w, wl[v]);
              c++;
            }
          }
          if (!c || s / 4 > w + 0.08) continue;
          const d = ((w + 0.1) * 4 - s) / c;
          // never above the water: the water cells around must keep a visible surface
          for (const v of vs) if (wet[v]) V[v] = Math.min(V[v] + d, wl[v] - 0.06);
        }
    // every water cell keeps its bed under its own surface (where waters of two levels meet, the
    // shared corners follow the lower one), so each shows water
    for (let i = 0; i < n * n; i++) {
      if (!isWater(this.cell[i]) || (this.hard && this.hard[i])) continue;
      const x = i % n;
      const z = (i / n) | 0;
      const lim = this.waterLevel(i) - 0.12;
      for (const v of [z * N + x, z * N + x + 1, (z + 1) * N + x, (z + 1) * N + x + 1]) V[v] = Math.min(V[v], lim);
    }
  }

  /** Whether cells i and j (neighbours) meet with a step (a sheer face) rather than smooth ground. */
  stepBetween(i: number, j: number): boolean {
    if (!this.corner && !this.vert) return true;
    const n = this.size;
    const dx = (j % n) - (i % n);
    const dz = ((j / n) | 0) - ((i / n) | 0);
    const ca = this.cornersOf(i, this.cbuf);
    const cb = this.cornersOf(j, this.cbuf2);
    if (!ca || !cb) return true;
    const k = (x: number, z: number) => x + 2 * z;
    let d: number;
    if (dx && dz) {
      const vx = dx > 0 ? 1 : 0;
      const vz = dz > 0 ? 1 : 0;
      d = Math.abs(ca[k(vx, vz)] - cb[k(1 - vx, 1 - vz)]);
    } else if (dx) {
      const ea = dx > 0 ? 1 : 0;
      d = Math.max(Math.abs(ca[k(ea, 0)] - cb[k(1 - ea, 0)]), Math.abs(ca[k(ea, 1)] - cb[k(1 - ea, 1)]));
    } else {
      const ea = dz > 0 ? 1 : 0;
      d = Math.max(Math.abs(ca[k(0, ea)] - cb[k(0, 1 - ea)]), Math.abs(ca[k(1, ea)] - cb[k(1, 1 - ea)]));
    }
    return d > 0.05;
  }

  /**
   * A sheer rise (a step, not a slope) on the line from (x, z) along (dx, dz) within `dist`: the
   * height of the rise above the feet, or 0 when the ground ahead is smooth (no jump needed).
   */
  ledgeAhead(x: number, z: number, dx: number, dz: number, dist: number, feet: number): number {
    let prev = this.groundY(x, z);
    for (let s = 0.1; s <= dist + 1e-6; s += 0.1) {
      const g = this.groundY(x + dx * s, z + dz * s);
      // steeper than ~70° over a tenth of a block: a face, not a slope
      if (g - prev > 0.28) return Math.max(0, this.groundY(x + dx * dist, z + dz * dist) - feet);
      prev = g;
    }
    return 0;
  }

  /** Ground height (world y) under (x, z): the sloped surface (bilinear in the cell's corners). */
  groundY(x: number, z: number): number {
    return this.groundL(x - this.ox, z - this.oz);
  }
  private groundL(x: number, z: number): number {
    const cx = Math.floor(x);
    const cz = Math.floor(z);
    if (!this.inLocal(cx, cz)) return 0;
    const i = cz * this.size + cx;
    if (this.top && !this.vert) return this.top[i];
    const c = this.cornersOf(i);
    if (!c) return this.elev[i];
    const fx = x - cx;
    const fz = z - cz;
    const a = c[0] + (c[1] - c[0]) * fx;
    const b = c[2] + (c[3] - c[2]) * fx;
    return a + (b - a) * fz;
  }

  /** Surface gradient (dy/dx, dy/dz) at (x, z). */
  slopeAt(x: number, z: number): [number, number] {
    return this.slopeL(x - this.ox, z - this.oz);
  }
  private slopeL(x: number, z: number): [number, number] {
    const cx = Math.floor(x);
    const cz = Math.floor(z);
    if (!this.inLocal(cx, cz) || (this.top && !this.vert)) return [0, 0];
    const c = this.cornersOf(cz * this.size + cx);
    if (!c) return [0, 0];
    const fx = x - cx;
    const fz = z - cz;
    return [(c[1] - c[0]) * (1 - fz) + (c[3] - c[2]) * fz, (c[2] - c[0]) * (1 - fx) + (c[3] - c[1]) * fx];
  }

  /** Height of the walking surface at the centre of cell i. */
  centerY(i: number): number {
    if (this.top && !this.vert) return this.top[i];
    const c = this.cornersOf(i);
    return c ? (c[0] + c[1] + c[2] + c[3]) * 0.25 : this.elev[i];
  }

  /** Lowest / highest corner of cell i (shots stop at the highest). */
  minCorner(i: number): number {
    if (this.top && !this.vert) return this.top[i];
    const c = this.cornersOf(i);
    return c ? Math.min(c[0], c[1], c[2], c[3]) : this.elev[i];
  }
  maxCorner(i: number): number {
    if (this.top && !this.vert) return this.top[i];
    const c = this.cornersOf(i);
    return c ? Math.max(c[0], c[1], c[2], c[3]) : this.elev[i];
  }

  /**
   * Whether a walker with feet at `feet` may move from (x0, z0) to (x1, z1) (a short step): the
   * cell is walkable, a rise is no taller than SLOPE.lip and the slope there no steeper than
   * SLOPE.maxTan; while airborne, anything up to STEP.air above the feet. Drops are always allowed.
   */
  canWalk(x0: number, z0: number, x1: number, z1: number, feet: number, airborne = false): boolean {
    x0 -= this.ox;
    x1 -= this.ox;
    z0 -= this.oz;
    z1 -= this.oz;
    const cx = Math.floor(x1);
    const cz = Math.floor(z1);
    if (this.blocksLocal(cx, cz)) return false;
    const g = this.groundL(x1, z1);
    if (airborne) return g <= feet + STEP.air;
    const rise = g - feet;
    if (rise <= 0.02) return true;
    if (rise > SLOPE.lip) return false;
    // climbing: the slope at the new spot must be walkable
    const [gx, gz] = this.slopeL(x1, z1);
    const dx = x1 - x0;
    const dz = z1 - z0;
    const l = Math.hypot(dx, dz);
    if (l < 1e-6) return true;
    // steepest gradient decides; moving across a slope (no rise along the way) stays allowed
    const along = (gx * dx + gz * dz) / l;
    return along <= 0.02 || Math.hypot(gx, gz) <= SLOPE.maxTan;
  }

  /** Whether a walker standing at height `feet` may move into cell (cx, cz) (cell-level check). */
  canEnter(cx: number, cz: number, feet: number, airborne = false): boolean {
    cx -= this.ox;
    cz -= this.oz;
    if (this.blocksLocal(cx, cz)) return false;
    return this.centerY(cz * this.size + cx) <= feet + (airborne ? STEP.air : SLOPE.lip + SLOPE.maxTan * 0.5);
  }

  /**
   * Neighbouring cells i and j (side or diagonal) joined by walkable ground both ways: neither
   * blocks walkers, no rock face between them, and the slope between their centres is walkable.
   */
  passable(i: number, j: number): boolean {
    const n = this.size;
    const ax = i % n;
    const az = (i / n) | 0;
    const bx = j % n;
    const bz = (j / n) | 0;
    if (this.blocksLocal(ax, az) || this.blocksLocal(bx, bz)) return false;
    const dx = bx - ax;
    const dz = bz - az;
    const ha = this.centerY(i);
    const hb = this.centerY(j);
    const dist = dx && dz ? Math.SQRT2 : 1;
    if (Math.abs(ha - hb) > SLOPE.maxTan * dist + 0.04) return false;
    // block ground: neighbours join when the step between their tops can be walked
    if (this.top && !this.vert) return Math.abs(ha - hb) <= SLOPE.lip;
    const ca = this.cornersOf(i, this.cbuf);
    const cb = this.cornersOf(j, this.cbuf2);
    if (!ca || !cb) return Math.abs(this.elev[i] - this.elev[j]) <= 1;
    // the shared edge (or corner) must meet without a step
    const k = (x: number, z: number) => x + 2 * z;
    if (dx && dz) {
      const vx = dx > 0 ? 1 : 0;
      const vz = dz > 0 ? 1 : 0;
      return Math.abs(ca[k(vx, vz)] - cb[k(1 - vx, 1 - vz)]) <= SLOPE.lip;
    }
    if (dx) {
      const ea = dx > 0 ? 1 : 0;
      const eb = 1 - ea;
      return Math.abs(ca[k(ea, 0)] + ca[k(ea, 1)] - cb[k(eb, 0)] - cb[k(eb, 1)]) * 0.5 <= SLOPE.lip;
    }
    const ea = dz > 0 ? 1 : 0;
    const eb = 1 - ea;
    return Math.abs(ca[k(0, ea)] + ca[k(1, ea)] - cb[k(0, eb)] - cb[k(1, eb)]) * 0.5 <= SLOPE.lip;
  }

  /** Ground creatures and paths: neighbouring cells joined by walkable ground (see passable). */
  stepOk(ax: number, az: number, bx: number, bz: number): boolean {
    ax -= this.ox;
    bx -= this.ox;
    az -= this.oz;
    bz -= this.oz;
    if (!this.inLocal(ax, az) || !this.inLocal(bx, bz)) return false;
    if (ax === bx && az === bz) return true;
    if (Math.abs(ax - bx) > 1 || Math.abs(az - bz) > 1) return false;
    return this.passable(az * this.size + ax, bz * this.size + bx);
  }

  /** Cells reachable on foot from (sx, sz) over walkable ground (both ways), for t.reach. */
  computeReach(sx: number, sz: number): Uint8Array {
    const n = this.size;
    const seen = new Uint8Array(n * n);
    const q = new Int32Array(n * n);
    let qh = 0;
    let qt = 0;
    const s = Math.floor(sz - this.oz) * n + Math.floor(sx - this.ox);
    seen[s] = 1;
    q[qt++] = s;
    while (qh < qt) {
      const i = q[qh++];
      const x = i % n;
      const z = (i / n) | 0;
      for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx;
        const nz = z + dz;
        if (nx < 0 || nz < 0 || nx >= n || nz >= n) continue;
        const j = nz * n + nx;
        if (seen[j] || !this.passable(i, j) || !this.passable(j, i)) continue;
        seen[j] = 1;
        q[qt++] = j;
      }
    }
    return seen;
  }

  /** Two cells whose ground joins smoothly: both dry, elevation tiers at most one apart. */
  linked(i: number, j: number): boolean {
    if (this.cell[i] === CELL.liquid || this.cell[j] === CELL.liquid) return false;
    return Math.abs(this.elev[i] - this.elev[j]) <= 1;
  }

  /**
   * Turns the block tiers in `elev` into a continuous sloped surface: the heights are smoothed
   * over linked cells only (tiers one block apart melt into slopes, taller steps stay cliffs and
   * water keeps its flat bed), then each cell corner takes the mean of the linked cells around it.
   * `relief` (optional, per cell) adds gentle undulation before smoothing. Call once the
   * elevations and water are final.
   */
  buildSurface(o: { iters?: number; relief?: Float32Array } = {}) {
    const n = this.size;
    let s = new Float32Array(n * n);
    for (let i = 0; i < n * n; i++) s[i] = this.elev[i] + (o.relief && this.cell[i] !== CELL.liquid ? o.relief[i] : 0);
    // neighbour links (8 directions) computed once
    const links = new Uint8Array(n * n);
    const D8 = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]];
    for (let z = 0; z < n; z++)
      for (let x = 0; x < n; x++) {
        const i = z * n + x;
        let m = 0;
        D8.forEach(([dx, dz], k) => {
          const cx = x + dx;
          const cz = z + dz;
          if (cx >= 0 && cz >= 0 && cx < n && cz < n && this.linked(i, cz * n + cx)) m |= 1 << k;
        });
        links[i] = m;
      }
    let t2 = new Float32Array(n * n);
    const iters = o.iters ?? 7;
    for (let it = 0; it < iters; it++) {
      for (let z = 0; z < n; z++)
        for (let x = 0; x < n; x++) {
          const i = z * n + x;
          const m = links[i];
          let sum = s[i] * 2;
          let w = 2;
          if (m)
            for (let k = 0; k < 8; k++)
              if (m & (1 << k)) {
                const ww = k < 4 ? 1 : 0.7;
                sum += s[(z + D8[k][1]) * n + x + D8[k][0]] * ww;
                w += ww;
              }
          t2[i] = sum / w;
        }
      [s, t2] = [t2, s];
    }
    // water stays flat at its own level; its banks never dip below the water
    for (let i = 0; i < n * n; i++) if (this.cell[i] === CELL.liquid) s[i] = this.elev[i];
    for (let z = 0; z < n; z++)
      for (let x = 0; x < n; x++) {
        const i = z * n + x;
        if (this.cell[i] === CELL.liquid) continue;
        for (let dz = -1; dz <= 1; dz++)
          for (let dx = -1; dx <= 1; dx++) {
            const cx = x + dx;
            const cz = z + dz;
            if (cx < 0 || cz < 0 || cx >= n || cz >= n) continue;
            const j = cz * n + cx;
            if (this.cell[j] === CELL.liquid) s[i] = Math.max(s[i], this.elev[j] - 0.3);
          }
      }
    this.surf = s;
    this.corner = new Float32Array(n * n * 4);
    this.recomputeCorners(0, 0, n - 1, n - 1);
  }

  /** Recomputes the corners of cells x0..x1, z0..z1 from `surf` (after cells changed kind). */
  recomputeCorners(x0: number, z0: number, x1: number, z1: number) {
    const s = this.surf;
    const C = this.corner;
    if (!s || !C) return;
    const n = this.size;
    const ids = [0, 0, 0, 0];
    const par = [0, 1, 2, 3];
    const find = (a: number): number => (par[a] === a ? a : (par[a] = find(par[a])));
    for (let vz = Math.max(0, z0); vz <= Math.min(n, z1 + 1); vz++)
      for (let vx = Math.max(0, x0); vx <= Math.min(n, x1 + 1); vx++) {
        // the cells around the vertex: 0 (-,-), 1 (+,-), 2 (-,+), 3 (+,+); their corner k = 3 - slot
        for (let k = 0; k < 4; k++) {
          const cx = vx - 1 + (k & 1);
          const cz = vz - 1 + (k >> 1);
          ids[k] = cx >= 0 && cz >= 0 && cx < n && cz < n ? cz * n + cx : -1;
          par[k] = k;
        }
        for (const [a, b] of [[0, 1], [0, 2], [1, 3], [2, 3], [0, 3], [1, 2]]) {
          if (ids[a] < 0 || ids[b] < 0 || !this.linked(ids[a], ids[b])) continue;
          par[find(a)] = find(b);
        }
        for (let k = 0; k < 4; k++) {
          if (ids[k] < 0) continue;
          const r = find(k);
          let sum = 0;
          let cnt = 0;
          for (let j = 0; j < 4; j++)
            if (ids[j] >= 0 && find(j) === r) {
              sum += s[ids[j]];
              cnt++;
            }
          C[ids[k] * 4 + (3 - k)] = sum / cnt;
        }
      }
  }

  /**
   * Sets the surface at vertex (vx, vz) to h for every cell around it that shares the vertex with
   * cell `ref` (the same smooth sheet), keeping the ground continuous. Used to flatten pads.
   */
  setVertex(vx: number, vz: number, h: number, ref: number) {
    const C = this.corner;
    if (!C) return;
    const n = this.size;
    const rx = ref % n;
    const rz = (ref / n) | 0;
    const old = C[ref * 4 + (vx - rx) + 2 * (vz - rz)];
    for (let k = 0; k < 4; k++) {
      const cx = vx - 1 + (k & 1);
      const cz = vz - 1 + (k >> 1);
      if (cx < 0 || cz < 0 || cx >= n || cz >= n) continue;
      const i = cz * n + cx;
      const ci = i * 4 + (3 - k);
      if (Math.abs(C[ci] - old) < 1e-4) C[ci] = h;
    }
  }

  /** Flattens the ground under cells  to height h. */
  flattenPad(cells: number[], h: number) {
    if (!this.corner) return;
    const n = this.size;
    for (const i of cells) {
      const x = i % n;
      const z = (i / n) | 0;
      if (this.cell[i] === CELL.liquid) continue;
      for (let k = 0; k < 4; k++) this.setVertex(x + (k & 1), z + (k >> 1), h, i);
      if (this.surf) this.surf[i] = h;
    }
  }

  idx(cx: number, cz: number): number {
    return (cz - this.oz) * this.size + cx - this.ox;
  }
  inBounds(cx: number, cz: number): boolean {
    return this.inLocal(cx - this.ox, cz - this.oz);
  }
  cellAt(x: number, z: number): number {
    const cx = Math.floor(x - this.ox);
    const cz = Math.floor(z - this.oz);
    if (!this.inLocal(cx, cz)) return CELL.wall;
    return this.cell[cz * this.size + cx];
  }
  blocksWalker(cx: number, cz: number): boolean {
    return this.blocksLocal(cx - this.ox, cz - this.oz);
  }
  blocksFlyer(cx: number, cz: number): boolean {
    cx -= this.ox;
    cz -= this.oz;
    if (!this.inLocal(cx, cz)) return true;
    return this.cell[cz * this.size + cx] === CELL.wall;
  }
  /** Cells that stop shots and sight lines (see WALLS): the border and tall solid obstacles. */
  blocksShot(cx: number, cz: number, y = Infinity): boolean {
    return this.shotL(cx - this.ox, cz - this.oz, y);
  }
  private shotL(cx: number, cz: number, y: number): boolean {
    if (!this.inLocal(cx, cz)) return true;
    const i = cz * this.size + cx;
    // terrain rising above the shot's height (a hill or cliff face) stops it
    if ((this.corner || this.top || this.vert ? this.maxCorner(i) : this.elev[i]) > y) return true;
    const c = this.cell[i];
    if (c === CELL.wall) return true;
    if (c !== CELL.solid) return false;
    const h = this.height[i];
    return h === 0 || h >= WALLS.minHeight;
  }

  /**
   * Walks the grid from (x0,z0) to (x1,z1) and returns the fraction of the segment travelled
   * before entering the first shot-blocking cell (1 = clear). The start cell never blocks, so
   * shooters standing or hovering in an obstacle cell can still fire out of it.
   */
  shotRay(x0: number, z0: number, x1: number, z1: number, ignoreEnd = false, y = Infinity): number {
    x0 -= this.ox;
    x1 -= this.ox;
    z0 -= this.oz;
    z1 -= this.oz;
    let cx = Math.floor(x0);
    let cz = Math.floor(z0);
    const ex = Math.floor(x1);
    const ez = Math.floor(z1);
    if (cx === ex && cz === ez) return 1;
    const dx = x1 - x0;
    const dz = z1 - z0;
    const stepX = dx > 0 ? 1 : -1;
    const stepZ = dz > 0 ? 1 : -1;
    const tdx = dx !== 0 ? Math.abs(1 / dx) : Infinity;
    const tdz = dz !== 0 ? Math.abs(1 / dz) : Infinity;
    let tmx = dx !== 0 ? (dx > 0 ? cx + 1 - x0 : x0 - cx) * tdx : Infinity;
    let tmz = dz !== 0 ? (dz > 0 ? cz + 1 - z0 : z0 - cz) * tdz : Infinity;
    for (let n = 0; n < 512; n++) {
      let t: number;
      if (tmx < tmz) {
        t = tmx;
        tmx += tdx;
        cx += stepX;
      } else {
        t = tmz;
        tmz += tdz;
        cz += stepZ;
      }
      if (t > 1) return 1;
      const end = cx === ex && cz === ez;
      if (end && ignoreEnd) return 1;
      if (this.shotL(cx, cz, y)) return t;
      if (end) return 1;
    }
    return 1;
  }

  /** True when nothing blocks a shot between the points; the target's own cell is ignored. */
  los(x0: number, z0: number, x1: number, z1: number): boolean {
    // sight runs at chest height above the higher of the two ends
    const y = Math.max(this.groundY(x0, z0), this.groundY(x1, z1)) + 1.5;
    return this.shotRay(x0, z0, x1, z1, true, y) >= 1;
  }

  walkableAt(x: number, z: number): boolean {
    return !this.blocksWalker(Math.floor(x), Math.floor(z));
  }

  tileId(name: string): number {
    let i = this.tileNames.indexOf(name);
    if (i < 0) {
      i = this.tileNames.length;
      this.tileNames.push(name);
    }
    return i;
  }
  setTile(cx: number, cz: number, name: string, cell?: number) {
    if (!this.inBounds(cx, cz)) return;
    const i = this.idx(cx, cz);
    if (this.cell[i] === CELL.wall) return;
    this.tile[i] = this.tileId(name);
    if (cell !== undefined) this.cell[i] = cell;
  }
  setCell(cx: number, cz: number, cell: number) {
    if (!this.inBounds(cx, cz)) return;
    const i = this.idx(cx, cz);
    if (this.cell[i] === CELL.wall) return;
    this.cell[i] = cell;
  }

  isFree(cx: number, cz: number): boolean {
    return this.inBounds(cx, cz) && this.cell[this.idx(cx, cz)] === CELL.floor;
  }

  areaFree(cx: number, cz: number, r: number): boolean {
    for (let z = cz - r; z <= cz + r; z++) for (let x = cx - r; x <= cx + r; x++) if (!this.isFree(x, z)) return false;
    return true;
  }
}

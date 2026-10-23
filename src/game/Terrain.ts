import { WALLS } from '../config/walls';

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
  maxTan: Math.tan((40 * Math.PI) / 180),
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
  tileNames: string[] = [];
  /**
   * Sloped ground: four corner heights per cell (k = dx + 2 * dz from the cell's min corner),
   * null until buildSurface. Corners are shared with linked neighbours (no gaps); across a cliff
   * (elevation tiers two or more apart, or a shore) they differ and the renderer draws a rock face.
   */
  corner: Float32Array | null = null;
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

  /** The four walking-surface corners of cell i , or null before buildSurface. */
  private cornersOf(i: number): Float32Array | null {
    return this.corner ? this.corner.subarray(i * 4, i * 4 + 4) : null;
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
    if (this.top) return this.top[i];
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
    if (!this.inLocal(cx, cz) || this.top) return [0, 0];
    const c = this.cornersOf(cz * this.size + cx);
    if (!c) return [0, 0];
    const fx = x - cx;
    const fz = z - cz;
    return [(c[1] - c[0]) * (1 - fz) + (c[3] - c[2]) * fz, (c[2] - c[0]) * (1 - fx) + (c[3] - c[1]) * fx];
  }

  /** Height of the walking surface at the centre of cell i. */
  centerY(i: number): number {
    if (this.top) return this.top[i];
    const c = this.cornersOf(i);
    return c ? (c[0] + c[1] + c[2] + c[3]) * 0.25 : this.elev[i];
  }

  maxCorner(i: number): number {
    if (this.top) return this.top[i];
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
    if (this.top) return Math.abs(ha - hb) <= SLOPE.lip;
    const ca = this.cornersOf(i);
    const cb = this.cornersOf(j);
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

  /** Cells that stop shots and sight lines (see WALLS): the border and tall solid obstacles. */
  blocksShot(cx: number, cz: number, y = Infinity): boolean {
    return this.shotL(cx - this.ox, cz - this.oz, y);
  }
  private shotL(cx: number, cz: number, y: number): boolean {
    if (!this.inLocal(cx, cz)) return true;
    const i = cz * this.size + cx;
    // terrain rising above the shot's height (a hill or cliff face) stops it
    if ((this.corner || this.top ? this.maxCorner(i) : this.elev[i]) > y) return true;
    const c = this.cell[i];
    if (c === CELL.wall) return true;
    if (c !== CELL.solid) return false;
    const h = this.height[i];
    return h === 0 || h >= WALLS.minHeight;
  }

  tileId(name: string): number {
    let i = this.tileNames.indexOf(name);
    if (i < 0) {
      i = this.tileNames.length;
      this.tileNames.push(name);
    }
    return i;
  }

}

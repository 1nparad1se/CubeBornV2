import * as THREE from 'three';
import type { VoxWeapon } from './weaponModels';

/**
 * The three weapons of the owner's reference sheets (docs/references/anim/*-combat-idle.png),
 * built here from voxel cells (original, no imported assets): the sword (grey blade, crossguard,
 * leather grip), the greatsword (the same, bigger), the recurve bow (brown wood, gold wraps, a
 * string) and the staff (brown shaft, gold rings, a glowing cyan crystal in a cradle). Every cell
 * gets a little colour noise, so the faces read as pixel textures like the references.
 *
 * Grip frame like every weapon: the grip point at the origin, the handle along +y (toward the
 * blade / the crystal / the upper limb), the edge (the bow: the arrow's way) along +z.
 *
 * Sizes follow the references against the 1.8 m hero: the sword is as long as leg + torso
 * (1.2 m), the greatsword 1.6 m, the bow almost the hero's height (1.55 m), the staff a little
 * taller than the hero (1.9 m).
 */

type Cell = [number, number, number, number]; // x, y, z (cells), colour

const PAL = {
  steel: 0xb8bcc2,
  steelHi: 0xd8dce0,
  steelLo: 0x8a8e96,
  guard: 0x7a7e86,
  guardHi: 0x9a9ea6,
  leather: 0x5a3a22,
  leatherLo: 0x3e2716,
  wood: 0x7a4a26,
  woodLo: 0x5a3418,
  woodHi: 0x94602f,
  gold: 0xc8962e,
  goldHi: 0xe2b448,
  crystal: 0x6ee8ff,
  crystalHi: 0xb8f6ff,
  crystalLo: 0x34b8e0,
  cradle: 0x4a3020,
};

/** Small stable noise per cell (pixel texture). */
function noise(x: number, y: number, z: number): number {
  let h = (x * 374761393 + y * 668265263 + z * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return (((h ^ (h >>> 16)) >>> 0) % 1000) / 1000;
}

const FACES: [number, number, number, number[][], number][] = [
  [1, 0, 0, [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]], 0.86],
  [-1, 0, 0, [[0, 0, 1], [0, 1, 1], [0, 1, 0], [0, 0, 0]], 0.86],
  [0, 1, 0, [[0, 1, 0], [0, 1, 1], [1, 1, 1], [1, 1, 0]], 1],
  [0, -1, 0, [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]], 0.7],
  [0, 0, 1, [[1, 0, 1], [1, 1, 1], [0, 1, 1], [0, 0, 1]], 0.94],
  [0, 0, -1, [[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]], 0.94],
];

/**
 * Meshes cells (hidden faces dropped) into a grip-frame geometry: `s` metres per cell, the grip
 * cell corner `grip`; cells whose colour is in `glow` go to draw group 1 (unlit, glowing).
 */
function mesh(cells: Cell[], s: number, grip: [number, number, number], glow: Set<number> = new Set()): THREE.BufferGeometry {
  const key = (x: number, y: number, z: number) => `${x},${y},${z}`;
  const map = new Map<string, number>();
  for (const [x, y, z, c] of cells) map.set(key(x, y, z), c);
  const out = [0, 1].map(() => ({ pos: [] as number[], nor: [] as number[], col: [] as number[], idx: [] as number[] }));
  const col = new THREE.Color();
  for (const [k, c] of map) {
    const [x, y, z] = k.split(',').map(Number);
    const g = glow.has(c) ? 1 : 0;
    const o = out[g];
    const n = noise(x, y, z);
    col.setHex(c).convertSRGBToLinear();
    const jit = 0.9 + n * 0.2;
    for (const [fx, fy, fz, quad, shade] of FACES) {
      const nb = map.get(key(x + fx, y + fy, z + fz));
      // a face between two cells is hidden (a glowing cell still shows against a solid one)
      if (nb !== undefined && glow.has(nb) === glow.has(c)) continue;
      const b = o.pos.length / 3;
      for (const q of quad) {
        o.pos.push((x + q[0] - grip[0]) * s, (y + q[1] - grip[1]) * s, (z + q[2] - grip[2]) * s);
        o.nor.push(fx, fy, fz);
        const sh = g ? 1 : shade;
        o.col.push(col.r * jit * sh, col.g * jit * sh, col.b * jit * sh);
      }
      o.idx.push(b, b + 2, b + 1, b, b + 3, b + 2);
    }
  }
  const geo = new THREE.BufferGeometry();
  const pos = [...out[0].pos, ...out[1].pos];
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute([...out[0].nor, ...out[1].nor], 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute([...out[0].col, ...out[1].col], 3));
  const off = out[0].pos.length / 3;
  geo.setIndex([...out[0].idx, ...out[1].idx.map((i) => i + off)]);
  geo.addGroup(0, out[0].idx.length, 0);
  if (out[1].idx.length) geo.addGroup(out[0].idx.length, out[1].idx.length, 1);
  geo.computeBoundingBox();
  geo.computeBoundingSphere();
  return geo;
}

/** A box of cells [x0, x1) × [y0, y1) × [z0, z1) of one colour (or a picker per cell). */
function box(cells: Cell[], x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, c: number | ((x: number, y: number, z: number) => number)) {
  for (let x = x0; x < x1; x++) for (let y = y0; y < y1; y++) for (let z = z0; z < z1; z++) cells.push([x, y, z, typeof c === 'number' ? c : c(x, y, z)]);
}

/**
 * Sword: pommel, wrapped grip, crossguard, a grey blade with a lighter edge and a pointed tip.
 * The blade's flat faces look along ±x, the edges along ±z (the edge direction of the grip frame).
 */
function sword(great: boolean): VoxWeapon {
  const s = great ? 1 / 36 : 1 / 40;
  const grip = great ? 13 : 8;
  const blade = great ? 44 : 36;
  const bw = great ? 5 : 4; // blade width in cells (along z)
  const guardW = great ? 14 : 12;
  const cells: Cell[] = [];
  const cz = 0;
  // pommel
  box(cells, -1, 1, 0, 2, -1, 1, PAL.guardHi);
  // grip: leather wraps (darker every third row)
  box(cells, -1, 0, 2, 2 + grip, -1, 1, (_x, y) => ((y - 2) % 3 === 0 ? PAL.leatherLo : PAL.leather));
  box(cells, 0, 1, 2, 2 + grip, -1, 1, (_x, y) => ((y - 2) % 3 === 0 ? PAL.leatherLo : PAL.leather));
  // crossguard (two rows, the ends a little lifted)
  const gy = 2 + grip;
  box(cells, -1, 1, gy, gy + 2, -guardW / 2, guardW / 2, (_x, y, z) => (y === gy + 1 && Math.abs(z + 0.5) < 2 ? PAL.guardHi : PAL.guard));
  box(cells, -1, 1, gy + 2, gy + 3, -guardW / 2, -guardW / 2 + 2, PAL.guard);
  box(cells, -1, 1, gy + 2, gy + 3, guardW / 2 - 2, guardW / 2, PAL.guard);
  // blade along y, its width along z (the edges), its flat faces along ±x
  const by = gy + 2;
  for (let i = 0; i < blade; i++) {
    const y = by + i;
    // taper the last cells into a point
    const left = blade - i;
    const w = left <= bw ? Math.max(1, left) : bw;
    const z0 = cz - Math.floor(w / 2);
    for (let z = z0; z < z0 + w; z++) {
      const edge = z === z0 || z === z0 + w - 1;
      const c = edge ? PAL.steelHi : noise(0, y, z) > 0.75 ? PAL.steelLo : PAL.steel;
      cells.push([0, y, z, c]);
      // two cells thick (a solid grey blade), the very tip one cell
      if (w > 1) cells.push([-1, y, z, edge ? PAL.steelHi : noise(1, y, z) > 0.8 ? PAL.steelLo : PAL.steel]);
    }
  }
  const total = by + blade;
  // the main hand sits just under the guard (two hands: the second below it)
  const gripCell: [number, number, number] = [0, gy - 2.5, 0];
  const geo = mesh(cells, s, gripCell);
  return { id: great ? 'ref_greatsword' : 'ref_sword', kind: 'sword', great, geometry: geo, length: total * s, cell: s, tip: new THREE.Vector3(0, (total - gripCell[1]) * s, 0), gripLen: grip * s };
}

/**
 * Recurve bow: a riser with a wrapped grip, limbs bending back toward the archer (-z) and the tips
 * curling forward again; gold wraps at the riser and near the tips; the string runs tip to tip.
 */
function bow(): VoxWeapon {
  const s = 1 / 40;
  const H = 31; // half height in cells
  const cells: Cell[] = [];
  const zOf = (ay: number) => {
    // limb profile: straight riser, the limb bends back, the tip recurves forward
    if (ay < 6) return 0;
    const u = (ay - 6) / (H - 6);
    let z = -Math.round(u * u * 7 + u * 2);
    if (ay > H - 4) z += ay - (H - 4);
    return z;
  };
  for (let y = -H; y <= H; y++) {
    const ay = Math.abs(y);
    const z = zOf(ay);
    const thick = ay < 6 ? 3 : ay < H - 5 ? 2 : 1;
    let c = (ay + (y < 0 ? 1 : 0)) % 4 === 0 ? PAL.woodLo : PAL.wood;
    if (ay < 4) c = ay % 2 ? PAL.leather : PAL.leatherLo; // grip wrap
    else if (ay === 5 || ay === 6) c = PAL.gold; // gold wraps by the riser
    else if (ay === H - 6 || ay === H - 5) c = PAL.goldHi; // and near the tips
    else if (ay >= H - 1) c = PAL.gold; // tip caps
    box(cells, -1, thick - 1, y, y + 1, z - (thick > 2 ? 1 : 0), z + (thick > 1 ? 1 : 0), c);
    // fill the step between two rows of a bending limb (no gaps in the curve)
    const zn = zOf(ay + 1);
    if (ay < H && zn !== z) {
      const yn = y + (y >= 0 ? 1 : -1);
      for (let zz = Math.min(z, zn); zz <= Math.max(z, zn); zz++) cells.push([-1, yn, zz, c]);
    }
  }
  const gripCell: [number, number, number] = [-0.5, 0.5, 0.5];
  const geo = mesh(cells, s, gripCell);
  const tz = (zOf(H) - gripCell[2] + 0.5) * s;
  const w: VoxWeapon = { id: 'ref_bow', kind: 'bow', geometry: geo, length: (2 * H + 1) * s, cell: s, tip: new THREE.Vector3(0, (H - 0.5) * s, tz - s), tipLow: new THREE.Vector3(0, (-H + 0.5) * s, tz - s) };
  return w;
}

/**
 * Staff: brown shaft, gold butt cap and three gold rings, a dark cradle with four prongs holding a
 * glowing cyan crystal (pointed top and bottom).
 */
function staff(): VoxWeapon {
  const s = 1 / 42;
  const cells: Cell[] = [];
  const shaft = 66;
  box(cells, -1, 1, 0, 3, -1, 1, PAL.gold); // butt cap
  box(cells, -1, 1, 3, shaft, -1, 1, (x, y, z) => (noise(x, y, z) > 0.8 ? PAL.woodLo : noise(x + 7, y, z) > 0.85 ? PAL.woodHi : PAL.wood));
  for (const ry of [20, 40, 58]) box(cells, -2, 2, ry, ry + 2, -2, 2, (_x, y) => (y === ry ? PAL.gold : PAL.goldHi));
  // cradle: a collar and four prongs
  box(cells, -2, 2, shaft, shaft + 2, -2, 2, PAL.gold);
  box(cells, -2, 2, shaft + 2, shaft + 3, -2, 2, PAL.cradle);
  for (const [px, pz] of [[-3, -3], [2, -3], [-3, 2], [2, 2]]) box(cells, px, px + 1, shaft + 2, shaft + 9, pz, pz + 1, (_x, y) => (y > shaft + 6 ? PAL.gold : PAL.cradle));
  // crystal: a long diamond of glowing cells
  const cy = shaft + 3;
  const rows = [1, 2, 3, 3, 3, 3, 2, 2, 1, 1];
  rows.forEach((r, i) => {
    for (let x = -r; x < r; x++)
      for (let z = -r; z < r; z++) {
        const edge = Math.abs(x + 0.5) + Math.abs(z + 0.5) > r + 0.6;
        if (edge) continue;
        const c = (x + z + i) % 3 === 0 ? PAL.crystalHi : x < 0 ? PAL.crystal : PAL.crystalLo;
        cells.push([x, cy + i, z, c]);
      }
  });
  const total = cy + rows.length;
  const gripCell: [number, number, number] = [0, 36.5, 0];
  const geo = mesh(cells, s, gripCell, new Set([PAL.crystal, PAL.crystalHi, PAL.crystalLo]));
  return { id: 'ref_staff', kind: 'staff', geometry: geo, length: total * s, cell: s, tip: new THREE.Vector3(0, (cy + 4 - gripCell[1]) * s, 0), glow: true, butt: -gripCell[1] * s };
}

const BUILDERS: Record<string, () => VoxWeapon> = {
  ref_sword: () => sword(false),
  ref_greatsword: () => sword(true),
  ref_bow: bow,
  ref_staff: staff,
};

const cache = new Map<string, VoxWeapon>();

/** The reference weapon by id (null for other ids). */
export function refWeapon(id: string): VoxWeapon | null {
  const b = BUILDERS[id];
  if (!b) return null;
  let w = cache.get(id);
  if (!w) {
    w = b();
    cache.set(id, w);
  }
  return w;
}

export const REF_IDS = Object.keys(BUILDERS);

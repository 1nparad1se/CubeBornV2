import * as THREE from 'three';
import { refWeapon } from './refWeapons';

/**
 * The owner's voxel weapons (weapons.zip, converted by tools/assets/convert_weapons.py): ten
 * swords, ten staves and ten bows. Each is meshed once from its cells (hidden faces dropped) into
 * a grip frame: the grip point at the origin, the handle along +y (toward the blade, the head of
 * the staff, the upper limb of the bow), the edge (the arrow's way for the bow) along +z.
 */
export type VoxKind = 'sword' | 'staff' | 'bow';

interface VoxAsset {
  kind: VoxKind;
  n: number;
  size: [number, number, number];
  origin: [number, number, number];
  pal: number[];
  v: string;
}

const FILES = import.meta.glob('../../assets/weapons/*.json', { eager: true, import: 'default' }) as Record<string, VoxAsset>;
const ASSETS: Record<string, VoxAsset> = {};
for (const a of Object.values(FILES)) ASSETS[`${a.kind}_${String(a.n).padStart(2, '0')}`] = a;

/** Asset ids («sword_01» .. «bow_10»). */
export const VOX_IDS = Object.keys(ASSETS).sort();

/**
 * Size and grip of each kind, in the asset's cells: the length the whole model gets in the
 * world (metres), the grip cell (x, y, z) and where the handle points. Swords: pommel at y = 0,
 * guard at y ≈ 18, blade up. Staves: butt at y = 0, head on top. Bows: a D on its side, the grip on
 * the flat side at x ≈ 1.5, y ≈ 39, limbs up and down, the tips (string side) at x ≈ 14.5.
 */
const GRIP: Record<VoxKind, { len: number; cell: [number, number, number] }> = {
  sword: { len: 1.12, cell: [6.25, 10.5, 2.125] },
  staff: { len: 1.8, cell: [4.6, 30, 2.1] },
  bow: { len: 1.3, cell: [1.5, 39.5, 1.5] },
};
/** Greatswords: the broad-guarded models are drawn longer. */
const GREAT_LEN = 1.5;

export interface VoxWeapon {
  id: string;
  kind: VoxKind;
  geometry: THREE.BufferGeometry;
  /** Model length in metres and the scale of one cell. */
  length: number;
  cell: number;
  /** Grip frame points (metres): the tip of the blade / head of the staff; bow: limb tips (string ends). */
  tip: THREE.Vector3;
  tipLow?: THREE.Vector3;
  /** Reference weapons: a two-hander, a glowing part (draw group 1), the grip length, the butt (staff). */
  great?: boolean;
  glow?: boolean;
  gripLen?: number;
  butt?: number;
}

const cache = new Map<string, VoxWeapon>();

const FACES: [number, number, number, number[][], number][] = [
  [1, 0, 0, [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]], 0.86],
  [-1, 0, 0, [[0, 0, 1], [0, 1, 1], [0, 1, 0], [0, 0, 0]], 0.86],
  [0, 1, 0, [[0, 1, 0], [0, 1, 1], [1, 1, 1], [1, 1, 0]], 1],
  [0, -1, 0, [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]], 0.7],
  [0, 0, 1, [[1, 0, 1], [1, 1, 1], [0, 1, 1], [0, 0, 1]], 0.94],
  [0, 0, -1, [[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]], 0.94],
];

function decode(s: string): Uint8Array {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/**
 * The mesh of a voxel weapon (built once per id). `great` draws a sword as a two-hander (longer).
 * Bows are turned so that the arrow leaves along +z (the string behind, at -z).
 */
export function voxWeapon(id: string, great = false): VoxWeapon | null {
  const ref = refWeapon(id);
  if (ref) return ref;
  const key = id + (great ? ':2h' : '');
  const hit = cache.get(key);
  if (hit) return hit;
  const a = ASSETS[id];
  if (!a) return null;
  const [nx, ny, nz] = a.size;
  const v = decode(a.v);
  const at = (x: number, y: number, z: number) => (x < 0 || y < 0 || z < 0 || x >= nx || y >= ny || z >= nz ? 0 : v[(z * ny + y) * nx + x]);
  const g = GRIP[a.kind];
  const len = a.kind === 'sword' && great ? GREAT_LEN : g.len;
  const s = len / ny;
  const [gx, gy, gz] = g.cell;
  const pos: number[] = [];
  const nor: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];
  const c = new THREE.Color();
  // grip frame: handle +y; the sword's flat faces ±z with the edge toward +x of the asset, which
  // becomes +z of the grip frame; the bow's string side (+x of the asset) goes to -z
  const map = (x: number, y: number, z: number): [number, number, number] => {
    const lx = (x - gx) * s;
    const ly = (y - gy) * s;
    const lz = (z - gz) * s;
    if (a.kind === 'bow') return [lz, ly, -lx];
    return [lz, ly, lx];
  };
  const mapN = (x: number, y: number, z: number): [number, number, number] => (a.kind === 'bow' ? [z, y, -x] : [z, y, x]);
  for (let z = 0; z < nz; z++)
    for (let y = 0; y < ny; y++)
      for (let x = 0; x < nx; x++) {
        const ci = at(x, y, z);
        if (!ci) continue;
        c.setHex(a.pal[ci - 1]).convertSRGBToLinear();
        for (const [fx, fy, fz, quad, shade] of FACES) {
          if (at(x + fx, y + fy, z + fz)) continue;
          const b = pos.length / 3;
          const pts = quad.map((q) => map(x + q[0], y + q[1], z + q[2]));
          // the axis swap mirrors the bow; keep the winding counter-clockwise from outside
          const flip = a.kind !== 'bow';
          for (const p of pts) {
            pos.push(...p);
            nor.push(...mapN(fx, fy, fz));
            col.push(c.r * shade, c.g * shade, c.b * shade);
          }
          if (flip) idx.push(b, b + 2, b + 1, b, b + 3, b + 2);
          else idx.push(b, b + 1, b + 2, b, b + 2, b + 3);
        }
      }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  geo.setIndex(idx);
  geo.computeBoundingBox();
  geo.computeBoundingSphere();
  const bb = geo.boundingBox!;
  const w: VoxWeapon = { id, kind: a.kind, geometry: geo, length: len, cell: s, tip: new THREE.Vector3(0, bb.max.y, 0) };
  if (a.kind === 'bow') {
    // string ends: the limb tips at the far (string) side, top and bottom
    const back = bb.min.z + s * 0.5;
    w.tip = new THREE.Vector3(0, bb.max.y - s * 2, back);
    w.tipLow = new THREE.Vector3(0, bb.min.y + s * 2, back);
  }
  cache.set(key, w);
  return w;
}

/** Which asset a game weapon is drawn with (main game items and RPG catalog meshes). */
export const ITEM_VOX: Record<string, { id: string; great?: boolean }> = {
  // the reference weapons (src/render/human/refWeapons.ts) for the basic ones
  sword_recruit: { id: 'ref_sword' },
  sword_guard2h: { id: 'ref_greatsword', great: true },
  staff_spark: { id: 'staff_02' },
  staff_apprentice: { id: 'ref_staff' },
  bow_hunter: { id: 'ref_bow' },
};

/** A simple arrow along +z (nock at the origin), shaft, fletching and head. */
export function arrowGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const box = (w: number, h: number, d: number, z: number, color: number, y = 0) => {
    const g = new THREE.BoxGeometry(w, h, d);
    g.translate(0, y, z);
    const c = new THREE.Color(color).convertSRGBToLinear();
    const n = g.attributes.position.count;
    g.setAttribute('color', new THREE.Float32BufferAttribute(Array.from({ length: n * 3 }, (_, i) => [c.r, c.g, c.b][i % 3]), 3));
    parts.push(g);
  };
  box(0.022, 0.022, 0.66, 0.33, 0x9a7048);
  box(0.05, 0.05, 0.07, 0.69, 0x8a8c92);
  box(0.006, 0.07, 0.12, 0.07, 0xe8e2d4);
  box(0.07, 0.006, 0.12, 0.07, 0xc84a3a);
  return merge(parts);
}

/** Merges box geometries (position, normal, color) into one. */
export function merge(parts: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const out = new THREE.BufferGeometry();
  for (const name of ['position', 'normal', 'color']) {
    const arrs = parts.map((p) => Array.from((p.getAttribute(name) as THREE.BufferAttribute).array));
    out.setAttribute(name, new THREE.Float32BufferAttribute(arrs.flat(), 3));
  }
  let off = 0;
  const idx: number[] = [];
  for (const p of parts) {
    for (const i of Array.from(p.index!.array)) idx.push(i + off);
    off += p.getAttribute('position').count;
  }
  out.setIndex(idx);
  parts.forEach((p) => p.dispose());
  return out;
}

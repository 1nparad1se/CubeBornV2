import * as THREE from 'three';
import { hash2 } from '../core/Rng';
import { FRUIT, Grid, LEAF, WOOD, h3, mesh, tone, type Out } from './treeModels';

/**
 * Small bushes of the wild world (owner's references, docs/references/plants): twenty species of
 * low plants built from voxels of 1/24 block, the scale of the grass pixels, so they sit among
 * the grass like the references show. A model is about half a block across at full size; the
 * world places most of them at a third or less of that (see BUSH_SIZES).
 */

export const BUSH = {
  // green (forests and plains)
  forest: 0,
  clover: 1,
  blueberry: 2,
  fern: 3,
  meadow: 4,
  ivy: 5,
  strawberry: 6,
  mossHummock: 7,
  // desert
  wormwood: 8,
  thorn: 9,
  sandBush: 10,
  succulent: 11,
  desertFlower: 12,
  tumbleweed: 13,
  // winter
  snowy: 14,
  dwarfConifer: 15,
  heather: 16,
  lingonberry: 17,
  // swamps
  tussock: 18,
  creeper: 19,
} as const;
export const BUSH_KINDS = 20;
export const BUSH_VARIANTS = 2;
export const BUSH_NAMES = [
  'Лесной кустик', 'Клеверная подушка', 'Лесная черника', 'Молодой папоротник', 'Цветущий луговой кустик', 'Стелющийся плющ', 'Земляничный кустик', 'Моховая кочка',
  'Пустынная полынь', 'Сухая колючка', 'Песчаный кустик', 'Карликовый суккулент', 'Пустынный цветок', 'Сухой перекати-куст',
  'Снежный кустик', 'Карликовая хвоя', 'Морозный вереск', 'Зимняя брусника',
  'Болотная кочка', 'Влажный стелющийся куст',
];
/** Instance sizes (scale of the model): very small 0.15 block, small 0.3, medium 0.5. */
export const BUSH_SIZES = [0.3, 0.6, 1];

/** Model voxel size (blocks). */
export const BUSH_VOX = 1 / 24;

const GREEN = [0x4e8a2c, 0x5a9a34, 0x447a26, 0x66a63c];
const DARK_GREEN = [0x2e5a24, 0x36682a, 0x284e20, 0x3e7230];
const LIGHT_GREEN = [0x7ab43e, 0x88c046, 0x6ea838, 0x96ca52];
const TWIG = [0x6a4a2c, 0x5a3e24, 0x7a5634];
const SNOW = [0xf4f8fc, 0xe6eef8, 0xffffff];

/** Paints one bush: voxel units, x and z centred on 0, y up from the ground. */
class Painter {
  readonly g: Grid;
  private o: number;
  constructor(readonly seed: number) {
    // 0.75 block across, 0.75 tall
    this.g = new Grid(BUSH_VOX, false, 0.4, 0.8);
    this.o = this.g.ix(0);
  }
  put(x: number, y: number, z: number, c: number, kind = LEAF, over = false) {
    if (y < 0) return;
    this.g.put(Math.round(x) + this.o, Math.round(y), Math.round(z) + this.o, c, kind, over);
  }
  has(x: number, y: number, z: number) {
    return this.g.get(Math.round(x) + this.o, Math.round(y), Math.round(z) + this.o) >= 0;
  }
  /** Colour from a palette for a voxel, in clumps of two (a texture of leaves, not one colour). */
  col(pal: number[], x: number, y: number, z: number, k = 1) {
    return tone(pal[Math.floor(h3(Math.floor(x / 2), Math.floor(y / 2), Math.floor(z / 2), this.seed) * pal.length)], k);
  }
  /** A ragged ball of leaves; lower voxels darker. */
  ball(cx: number, cy: number, cz: number, rx: number, ry: number, rz: number, pal: number[], gaps = 0.18) {
    for (let y = Math.floor(cy - ry); y <= cy + ry; y++)
      for (let z = Math.floor(cz - rz); z <= cz + rz; z++)
        for (let x = Math.floor(cx - rx); x <= cx + rx; x++) {
          const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + ((z - cz) / rz) ** 2;
          if (d > 1 + (h3(x, y, z, this.seed + 1) - 0.5) * 0.5) continue;
          if (d > 0.55 && h3(x, y, z, this.seed + 2) < gaps) continue;
          this.put(x, y, z, this.col(pal, x, y, z, 0.8 + Math.min(1, Math.max(0, (y - cy + ry) / (2 * ry))) * 0.25));
        }
  }
  /** A line of voxels (stem, twig, blade). */
  line(a: number[], b: number[], c: number | number[], kind = WOOD) {
    const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])));
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const x = a[0] + (b[0] - a[0]) * t;
      const y = a[1] + (b[1] - a[1]) * t;
      const z = a[2] + (b[2] - a[2]) * t;
      this.put(x, y, z, Array.isArray(c) ? this.col(c, x, y, z) : c, kind, true);
    }
  }
  /** A flat leaf: a little diamond of voxels around (x, y, z) facing up. */
  leaf(x: number, y: number, z: number, r: number, pal: number[]) {
    for (let dz = -r; dz <= r; dz++)
      for (let dx = -r; dx <= r; dx++) if (Math.abs(dx) + Math.abs(dz) <= r) this.put(x + dx, y + (Math.abs(dx) + Math.abs(dz) === r ? 0 : 0), z + dz, this.col(pal, x + dx, y, z + dz, Math.abs(dx) + Math.abs(dz) === 0 ? 0.9 : 1));
  }
  /** Berries, flowers or frost on the outside of the leaves: `rate` of the surface voxels. */
  dots(pal: number[], rate: number, kind = FRUIT, size = 1) {
    const g = this.g;
    const out: [number, number, number][] = [];
    for (let j = 0; j < g.ny; j++)
      for (let k = 0; k < g.nz; k++)
        for (let i = 0; i < g.nx; i++) {
          const n = g.idx(i, j, k);
          if (g.kind[n] !== LEAF) continue;
          if (g.get(i, j + 1, k) >= 0 && g.get(i + 1, j, k) >= 0 && g.get(i - 1, j, k) >= 0 && g.get(i, j, k + 1) >= 0 && g.get(i, j, k - 1) >= 0) continue;
          if (h3(i >> (size - 1), j >> (size - 1), k >> (size - 1), this.seed + 7) < rate) out.push([i, j, k]);
        }
    for (const [i, j, k] of out) {
      const c = pal[Math.floor(h3(i, j, k, this.seed + 8) * pal.length)];
      g.put(i, j, k, c, kind, true);
      if (size > 1) g.put(i, j + 1, k, c, kind, false);
    }
  }
  /** Snow lying on top of the plant: the topmost voxel of each column, and a cap above some. */
  snow(rate: number) {
    const g = this.g;
    for (let k = 0; k < g.nz; k++)
      for (let i = 0; i < g.nx; i++)
        for (let j = g.ny - 1; j >= 0; j--) {
          if (g.get(i, j, k) < 0) continue;
          if (h3(i >> 1, j, k >> 1, this.seed + 9) < rate) {
            g.put(i, j, k, SNOW[Math.floor(h3(i, j, k, 3) * 3)], FRUIT, true);
            if (h3(i >> 1, j, k >> 1, this.seed + 10) < 0.5) g.put(i, j + 1, k, SNOW[0], FRUIT, false);
          }
          break;
        }
  }
}

/** A deterministic 0..1 stream. */
function rng(seed: number) {
  let i = 0;
  return () => hash2(i++, 17, seed);
}

/** Leaves on twigs fanning out from the root: `n` twigs, `h` tall, crowned by small balls. */
function twiggy(p: Painter, r: () => number, n: number, h: number, spread: number, twig: number[], pal: number[], ball = 2.2) {
  for (let s = 0; s < n; s++) {
    const a = (s / n) * Math.PI * 2 + r() * 0.8;
    const l = spread * (0.5 + r() * 0.6);
    const top = [Math.cos(a) * l, h * (0.6 + r() * 0.4), Math.sin(a) * l];
    p.line([0, 0, 0], top, twig);
    if (ball > 0) p.ball(top[0], top[1], top[2], ball, ball * 0.8, ball, pal);
  }
}

function build(kind: number, variant: number): Painter {
  const p = new Painter(kind * 13 + variant * 5 + 1);
  const r = rng(kind * 31 + variant * 7);
  const v = variant;
  switch (kind) {
    case BUSH.forest:
      // a small round green bush of little leaves
      twiggy(p, r, 5, 7, 3, TWIG, GREEN, 0);
      p.ball(0, 6, 0, 5.5 + v, 4.5, 5 + v, GREEN, 0.2);
      p.ball(r() * 3 - 1.5, 9, r() * 2 - 1, 3, 2.5, 3, LIGHT_GREEN, 0.2);
      break;
    case BUSH.clover:
      // a low dense cushion of three-part leaves
      for (let s = 0; s < 26 + v * 6; s++) {
        const a = r() * Math.PI * 2;
        const d = r() * 5;
        const x = Math.round(Math.cos(a) * d);
        const z = Math.round(Math.sin(a) * d);
        const y = 2 + Math.round(r() * 3 * (1 - d / 6));
        p.line([x, 0, z], [x, y, z], DARK_GREEN, LEAF);
        for (const [dx, dz] of [[1, 0], [-1, 1], [0, -1]]) p.leaf(x + dx * 1.5, y, z + dz * 1.5, 1, LIGHT_GREEN);
      }
      break;
    case BUSH.blueberry:
      // dark green leaves on thin stems, small blue berries
      twiggy(p, r, 6, 7, 4, TWIG, DARK_GREEN, 2.2);
      p.ball(0, 5, 0, 4.5, 3.5, 4.5, DARK_GREEN, 0.3);
      p.dots([0x2a3a9a, 0x3a4ab8, 0x22307a], 0.09);
      break;
    case BUSH.fern:
      // short cut fronds spreading out from the middle
      for (let s = 0; s < 7 + v; s++) {
        const a = (s / (7 + v)) * Math.PI * 2 + r() * 0.4;
        const cx = Math.cos(a);
        const cz = Math.sin(a);
        const len = 6 + r() * 3;
        for (let t = 0; t <= len; t++) {
          const x = cx * t;
          const z = cz * t;
          const y = 1 + t * 0.9 - (t * t) / (len * 1.6);
          p.put(x, y, z, p.col(LIGHT_GREEN, x, y, z, 0.9), LEAF, true);
          // leaflets on both sides, shorter toward the tip
          const side = Math.max(0, Math.round((len - t) / 3));
          for (let q = 1; q <= side; q++) {
            if (t % 2) continue;
            p.put(x - cz * q, y, z + cx * q, p.col(GREEN, x, y, z), LEAF);
            p.put(x + cz * q, y, z - cx * q, p.col(GREEN, x, y, z), LEAF);
          }
        }
      }
      break;
    case BUSH.meadow:
      // light green leaves and a few white flowers with yellow eyes
      twiggy(p, r, 5, 6, 3, [0x5a7a2c], LIGHT_GREEN, 0);
      p.ball(0, 5, 0, 5, 3.8, 5, LIGHT_GREEN, 0.22);
      p.dots([0xf4f4ee, 0xffffff, 0xf0e070], 0.05, FRUIT, 2);
      break;
    case BUSH.ivy:
      // low twigs creeping over the ground in every direction, leaves along them
      for (let s = 0; s < 6 + v * 2; s++) {
        const a = r() * Math.PI * 2;
        let x = 0;
        let z = 0;
        for (let t = 0; t < 9; t++) {
          x += Math.cos(a + Math.sin(t) * 0.5);
          z += Math.sin(a + Math.sin(t) * 0.5);
          p.put(x, 0, z, TWIG[1], WOOD, true);
          if (t % 2) p.leaf(x, 1, z, 1, GREEN);
        }
      }
      break;
    case BUSH.strawberry:
      // three-part leaves on stems, small red berries
      for (let s = 0; s < 9 + v * 3; s++) {
        const a = r() * Math.PI * 2;
        const d = 1 + r() * 4;
        const x = Math.cos(a) * d;
        const z = Math.sin(a) * d;
        const y = 3 + r() * 4;
        p.line([0, 0, 0], [x, y, z], [0x5a8a2c], WOOD);
        for (const [dx, dz] of [[1.5, 0], [-1, 1.2], [-0.5, -1.5]]) p.leaf(x + dx, y, z + dz, 1, GREEN);
      }
      for (let s = 0; s < 5; s++) p.put(r() * 8 - 4, 1 + r() * 2, r() * 8 - 4, 0xd8202a, FRUIT, true);
      p.dots([0xd8202a, 0xe83a3a], 0.04);
      break;
    case BUSH.mossHummock:
      // a dense uneven cushion of moss
      p.ball(0, 1.5, 0, 6 + v, 3.5, 5.5, [0x6a8a2c, 0x7a9a34, 0x5e7e26, 0x86a63c], 0.04);
      p.ball(2, 3.5, -1, 3, 2.5, 3, [0x7a9a34, 0x8aaa3e], 0.05);
      p.dots([0xa8c050, 0x98b048], 0.08, LEAF);
      break;
    case BUSH.wormwood:
      // thin grey-green twigs, feathery
      twiggy(p, r, 9, 9, 4, [0x8a9a7a, 0x7a8a6a], [0x9aaa88, 0x8a9a7a, 0xa8b498], 1.4);
      break;
    case BUSH.thorn:
      // a small leafless bush of brown thorny twigs
      for (let s = 0; s < 7; s++) {
        const a = (s / 7) * Math.PI * 2 + r();
        const top = [Math.cos(a) * 4, 6 + r() * 4, Math.sin(a) * 4];
        p.line([0, 0, 0], top, [0x8a5a34, 0x7a4e2c]);
        const mid = [top[0] * 0.6, top[1] * 0.6, top[2] * 0.6];
        p.line(mid, [mid[0] + Math.cos(a + 1) * 2, mid[1] + 2, mid[2] + Math.sin(a + 1) * 2], [0x9a6a3e]);
      }
      break;
    case BUSH.sandBush:
      // sparse yellow-green leaves on brown twigs
      twiggy(p, r, 7, 7, 4, TWIG, [0xb4b440, 0xa0a838, 0xc4c04c], 1.6);
      break;
    case BUSH.succulent:
      // a few thick fleshy green shoots, red flowers on some
      for (let s = 0; s < 4 + v; s++) {
        const a = (s / (4 + v)) * Math.PI * 2 + r();
        const d = s ? 2 + r() * 1.5 : 0;
        const x = Math.round(Math.cos(a) * d);
        const z = Math.round(Math.sin(a) * d);
        const h = 4 + Math.floor(r() * 6);
        for (let y = 0; y < h; y++)
          for (let dx = 0; dx < 2; dx++) for (let dz = 0; dz < 2; dz++) p.put(x + dx, y, z + dz, p.col([0x4a8a34, 0x3e7a2c, 0x56963c], x, y, z), LEAF, true);
        if (r() < 0.6) p.put(x, h, z, 0xe04a2a, FRUIT, true);
      }
      break;
    case BUSH.desertFlower:
      // low grey-green leaves and yellow flowers
      p.ball(0, 2, 0, 5, 2.5, 5, [0x7a8a54, 0x6a7a48, 0x8a9a60], 0.2);
      for (let s = 0; s < 5 + v; s++) {
        const x = r() * 8 - 4;
        const z = r() * 8 - 4;
        p.line([x, 1, z], [x, 4 + r() * 2, z], [0x6a8a3a]);
        p.leaf(x, 5 + r() * 2, z, 1, [0xf0c020, 0xf8d440]);
      }
      break;
    case BUSH.tumbleweed:
      // a loose ball of tangled dry twigs
      for (let s = 0; s < 40; s++) {
        const a = r() * Math.PI * 2;
        const b = r() * Math.PI;
        const R = 5 + v;
        const c = [0, R, 0];
        p.line([c[0] + Math.cos(a) * Math.sin(b) * R, c[1] + Math.cos(b) * R, c[2] + Math.sin(a) * Math.sin(b) * R], [c[0] + Math.cos(a + 2) * Math.sin(b + 1) * R * 0.6, c[1] + Math.cos(b + 1) * R * 0.6, c[2] + Math.sin(a + 2) * Math.sin(b + 1) * R * 0.6], [0x9a6a3c, 0x8a5c32, 0xa87a48]);
      }
      break;
    case BUSH.snowy:
      // a low dark green bush under caps of snow
      twiggy(p, r, 5, 6, 3, TWIG, DARK_GREEN, 0);
      p.ball(0, 5, 0, 5.5, 4, 5.5, DARK_GREEN, 0.15);
      p.snow(0.65);
      break;
    case BUSH.dwarfConifer:
      // a small spreading conifer, tiers of needles, snow on top
      p.line([0, 0, 0], [0, 10, 0], TWIG);
      for (let y = 2; y <= 10; y += 2) {
        const rr = (11 - y) * 0.55;
        p.ball(0, y, 0, rr, 1.2, rr, DARK_GREEN.concat([0x2a5a34]), 0.15);
      }
      p.snow(0.35);
      break;
    case BUSH.heather:
      // dark twigs topped with purple flowers and frost
      twiggy(p, r, 8, 9, 3.5, [0x4a3a3a, 0x5a4440], [0x9a4ab8, 0xb05ac8, 0x8a3aa8], 1.3);
      p.dots([0xe8e8f4, 0xd8dcec], 0.1);
      break;
    case BUSH.lingonberry:
      // low glossy leaves with red berries, a little snow
      p.ball(0, 2.5, 0, 5, 3, 5, [0x2e6a2c, 0x387a34, 0x285e26], 0.15);
      p.dots([0xd81a24, 0xb8141e], 0.12);
      p.snow(0.25);
      break;
    case BUSH.tussock:
      // a thick clump of dark green blades
      for (let s = 0; s < 40; s++) {
        const a = r() * Math.PI * 2;
        const d = r() * 3;
        const x = Math.cos(a) * d;
        const z = Math.sin(a) * d;
        const h = 6 + r() * 7;
        p.line([x, 0, z], [x * 1.8, h, z * 1.8], [0x3e6a2a, 0x4a7a30, 0x2e5a22, 0x5a8a34], LEAF);
      }
      break;
    case BUSH.creeper:
      // low tangled twigs with patches of moss
      for (let s = 0; s < 8; s++) {
        const a = r() * Math.PI * 2;
        let x = 0;
        let z = 0;
        let y = 2;
        for (let t = 0; t < 8; t++) {
          x += Math.cos(a + t * 0.3);
          z += Math.sin(a + t * 0.3);
          y = Math.max(0, y + (r() - 0.6));
          p.put(x, y, z, TWIG[t % 3], WOOD, true);
          if (r() < 0.4) p.ball(x, y + 1, z, 1.5, 1, 1.5, [0x6a8a2c, 0x5e7e26, 0x7a9a34], 0.1);
        }
      }
      break;
  }
  return p;
}

/** Mesh of a bush species variant: base centred on the origin, blocks as units. */
export function bushGeometry(kind: number, variant: number): THREE.BufferGeometry {
  const p = build(kind, variant);
  const out: Out = { pos: [], nor: [], col: [], surf: [], idx: [] };
  mesh(p.g, out);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(out.pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(out.nor, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(out.col, 3));
  g.setIndex(out.idx);
  g.computeBoundingBox();
  return g;
}

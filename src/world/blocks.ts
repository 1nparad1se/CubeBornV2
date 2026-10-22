import { hash2 } from '../core/Rng';

/**
 * Looks of the ground blocks of the wild world (owner's references, docs/references/blocks):
 * a palette per block and a 16 × 16 pixel pattern that picks one palette colour and a brightness
 * per pixel, so a block mixes materials (pebbles in earth, moss on stone, leaves on soil) instead
 * of being one colour. Pure logic (no DOM): the generator and the maps read the colours, the
 * renderer paints the atlas from the patterns. `side` says what the block looks like from the
 * side: itself all the way down (stone, sand), or earth under a thin top layer (snow, litter).
 */

/** A pixel: [palette index, brightness multiplier]. */
export type BlockPx = [number, number];
export type BlockPattern = (seed: number) => (x: number, y: number) => BlockPx;

export interface BlockLook {
  /** Russian name (docs and the map legend). */
  name: string;
  colors: number[];
  pat: BlockPattern;
  /** 'self': the same block down the sides; 'soil': earth under a top layer `hang` pixels deep. */
  side: 'self' | 'soil';
  hang?: number;
  /** Earth colour under a 'soil' block (default: the map's soil). */
  soil?: number;
}

/** Tileable hash of a pixel of the 16 × 16 tile. */
const H = (x: number, y: number, s: number) => hash2(((x % 16) + 16) % 16, ((y % 16) + 16) % 16, s);
/** Soft blotches: coarse cells blended with finer ones (ragged pixel patches). */
const blotch = (x: number, y: number, s: number) => H(x >> 2, y >> 2, s) * 0.5 + H(x >> 1, y >> 1, s + 1) * 0.32 + H(x, y, s + 2) * 0.18;
/** Brightness jitter of a plain pixel. */
const jit = (x: number, y: number, s: number, k = 0.14) => 1 - k / 2 + H(x, y, s + 9) * k;

/** Toroidal Voronoi on the 16px tile: [cell id, distance to the nearest edge]. */
function voronoi(x: number, y: number, s: number, cells = 4): [number, number] {
  const step = 16 / cells;
  let d1 = 99;
  let d2 = 99;
  let id = 0;
  for (let gy = -1; gy <= cells; gy++)
    for (let gx = -1; gx <= cells; gx++) {
      const cx = ((gx % cells) + cells) % cells;
      const cy = ((gy % cells) + cells) % cells;
      const px = gx * step + 0.5 + hash2(cx, cy, s) * (step - 1);
      const py = gy * step + 0.5 + hash2(cx, cy, s + 1) * (step - 1);
      const d = Math.hypot(x + 0.5 - px, y + 0.5 - py);
      if (d < d1) {
        d2 = d1;
        d1 = d;
        id = cy * cells + cx;
      } else if (d < d2) d2 = d;
    }
  return [id, d2 - d1];
}

/**
 * Grainy ground: base colours `base` (picked per pixel), with spots of accent colours. Each
 * accent is [palette index, chance, spot size in pixels].
 */
function grain(base: number[], accents: [number, number, number][] = [], k = 0.16): BlockPattern {
  return (s) => (x, y) => {
    for (let a = 0; a < accents.length; a++) {
      const [ci, p, size] = accents[a];
      const cx = Math.floor(x / size);
      const cy = Math.floor(y / size);
      if (H(cx, cy, s + 20 + a * 3) < p) {
        // spots are lit on their upper left and shaded on their lower right
        const ex = x - cx * size;
        const ey = y - cy * size;
        const edge = size > 1 ? (ex + ey === 0 ? 1.12 : ex === size - 1 && ey === size - 1 ? 0.84 : 1) : 1;
        return [ci, edge * jit(x, y, s, 0.1)];
      }
    }
    return [base[Math.floor(H(x, y, s) * base.length)], jit(x, y, s, k)];
  };
}

/** Two materials in ragged pixel patches (the mixed blocks): `frac` of the tile is `b`. */
function mix(a: BlockPattern, b: BlockPattern, frac: number): BlockPattern {
  return (s) => {
    const pa = a(s);
    const pb = b(s + 5);
    return (x, y) => (blotch(x, y, s + 40) < frac ? pb(x, y) : pa(x, y));
  };
}

/** Stone of grains and blotches: colours `base`, darker and lighter pixels, coarse mottling. */
function mottled(base: number[], k = 0.2): BlockPattern {
  return (s) => (x, y) => {
    const v = blotch(x, y, s);
    return [base[Math.min(base.length - 1, Math.floor(v * base.length * 1.2))], jit(x, y, s, k)];
  };
}

/** Lines where Voronoi cells meet (cracks, veins, plates): `line` colour, `width` in pixels. */
function cracked(under: BlockPattern, line: number, width: number, cells = 4, lineK = 1): BlockPattern {
  return (s) => {
    const u = under(s);
    return (x, y) => {
      const [, e] = voronoi(x, y, s + 60, cells);
      return e < width ? [line, lineK * jit(x, y, s, 0.1)] : u(x, y);
    };
  };
}

/** Short strokes (fibres, needles, roots, twigs) over a ground: [colour, count, length, slant]. */
function strokes(under: BlockPattern, sets: [number, number, number, number][]): BlockPattern {
  return (s) => {
    const u = under(s);
    const hit = new Map<number, number>();
    sets.forEach(([ci, count, len, slant], si) => {
      for (let k = 0; k < count; k++) {
        let x = Math.floor(hash2(k, si, s + 70) * 16);
        let y = Math.floor(hash2(k, si, s + 71) * 16);
        const dir = hash2(k, si, s + 72) < 0.5 ? 1 : -1;
        const along = hash2(k, si, s + 73) < 0.5;
        for (let i = 0; i < len; i++) {
          hit.set(((y & 15) << 4) | (x & 15), ci);
          if (along) {
            x += 1;
            if (slant && i % slant === slant - 1) y += dir;
          } else {
            y += 1;
            if (slant && i % slant === slant - 1) x += dir;
          }
        }
      }
    });
    return (x, y) => {
      const c = hit.get(((y & 15) << 4) | (x & 15));
      return c !== undefined ? [c, jit(x, y, s, 0.14)] : u(x, y);
    };
  };
}

/** Little leaves (a plus of 5 pixels, or 3) of `colors` over a ground. */
function leaves(under: BlockPattern, colors: number[], count: number): BlockPattern {
  return (s) => {
    const u = under(s);
    const hit = new Map<number, BlockPx>();
    for (let k = 0; k < count; k++) {
      const cx = Math.floor(hash2(k, 1, s + 80) * 16);
      const cy = Math.floor(hash2(k, 2, s + 80) * 16);
      const ci = colors[Math.floor(hash2(k, 3, s + 80) * colors.length)];
      const big = hash2(k, 4, s + 80) < 0.6;
      const pts = big ? [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]] : [[0, 0], [1, 0], [0, 1]];
      for (const [dx, dy] of pts) hit.set((((cy + dy) & 15) << 4) | ((cx + dx) & 15), [ci, dx === 0 && dy === 0 ? 0.9 : 1.05]);
    }
    return (x, y) => hit.get(((y & 15) << 4) | (x & 15)) ?? u(x, y);
  };
}

/** Horizontal layers (slate, sandstone): colours by row band, a little sway along the row. */
function layered(base: number[], band = 3): BlockPattern {
  return (s) => (x, y) => {
    const row = Math.floor((y + (H(x >> 2, 0, s) < 0.3 ? 1 : 0)) / band);
    const c = base[Math.floor(hash2(row, 0, s) * base.length)];
    return [c, (y % band === 0 ? 1.08 : y % band === band - 1 ? 0.88 : 1) * jit(x, y, s, 0.1)];
  };
}

/** Stones of a cobble road: Voronoi stones, joints of `joint` colour. */
function cobbles(stone: number[], joint: number): BlockPattern {
  return (s) => (x, y) => {
    const [id, e] = voronoi(x, y, s + 90, 4);
    if (e < 1.1) return [joint, jit(x, y, s, 0.2)];
    return [stone[id % stone.length], (0.88 + hash2(id, 0, s) * 0.2) * (e > 3 ? 1.06 : 1) * jit(x, y, s, 0.08)];
  };
}

// palette indices are positions in each block's `colors`
const EARTH = [0x8a5a34, 0x7e5230, 0x96643a, 0xa8a6a2, 0x7a7874];

export const BLOCKS: Record<string, BlockLook> = {
  // ---------------------------------------------------------------- earth (1-10)
  dirt: { name: 'Обычная земля', colors: EARTH, pat: grain([0, 1, 2], [[3, 0.05, 1], [4, 0.03, 2]]), side: 'self' },
  dirt_wet: { name: 'Влажная земля', colors: [0x6a4630, 0x5e3e2a, 0x765036, 0x9a9aa0, 0x7a7c88], pat: grain([0, 1, 2], [[4, 0.06, 1], [3, 0.03, 1]], 0.12), side: 'self' },
  dirt_dry: { name: 'Сухая земля', colors: [0xc08a4c, 0xb47e44, 0xcc9656, 0xd8a868], pat: grain([0, 1, 2], [[3, 0.08, 1]], 0.12), side: 'self' },
  dirt_stony: { name: 'Каменистая земля', colors: [0x7e5636, 0x724c30, 0xa4a2a0, 0x8c8a88, 0xc0bebc], pat: grain([0, 1], [[2, 0.2, 3], [3, 0.12, 2], [4, 0.04, 1]]), side: 'self' },
  chernozem: { name: 'Чернозём', colors: [0x4a3628, 0x40302a, 0x54402e, 0x9a8a78], pat: grain([0, 1, 2], [[3, 0.05, 1]], 0.12), side: 'self' },
  mud: { name: 'Грязь', colors: [0x5e4430, 0x523c2a, 0x6a4c36, 0x5e6a80, 0x7480a0], pat: (s) => { const g = grain([0, 1, 2])(s); return (x, y) => (blotch(x, y, s + 3) > 0.72 ? [blotch(x, y, s + 4) > 0.5 ? 3 : 4, 1] : g(x, y)); }, side: 'self' },
  peat: { name: 'Торф', colors: [0x4e3a28, 0x44322a, 0x5a4430, 0x6a8a32, 0x7e9a3c], pat: mix(grain([0, 1, 2]), grain([3, 4], [], 0.2), 0.22), side: 'self' },
  humus: { name: 'Перегной', colors: [0x4a382c, 0x403026, 0x543e30, 0x8a5a30, 0x9a6a3a], pat: strokes(grain([0, 1, 2], [], 0.12), [[3, 7, 3, 2], [4, 4, 2, 0]]), side: 'self' },
  forest_litter: { name: 'Лесная подстилка', colors: [0x54402c, 0x4a3828, 0x8e6234, 0xa4884a, 0x66743a, 0x6a5034], pat: strokes(leaves(grain([0, 1]), [2, 3, 4, 2], 6), [[5, 4, 4, 2]]), side: 'soil', hang: 2, soil: 0x5a3e28 },
  dirt_packed: { name: 'Утоптанная земля', colors: [0xb0865a, 0xa67c52, 0xba9064, 0x9a9890], pat: grain([0, 1, 2], [[3, 0.03, 1]], 0.08), side: 'self' },
  // ---------------------------------------------------------------- stone (11-20)
  stone: { name: 'Обычный камень', colors: [0x8a8c90, 0x7a7c80, 0x9a9ca0, 0x6a6c70], pat: mottled([3, 1, 0, 2]), side: 'self' },
  granite: { name: 'Гранит', colors: [0xb4684c, 0xa45c44, 0xc07858, 0x2e2a2a, 0x8a8888, 0xd8d0c8], pat: grain([0, 1, 2], [[3, 0.14, 1], [4, 0.1, 1], [5, 0.05, 1]]), side: 'self' },
  andesite: { name: 'Андезит', colors: [0x7e8084, 0x72747a, 0x8a8c90, 0x5e6064, 0x9c9ea2], pat: grain([0, 1, 2], [[3, 0.1, 1], [4, 0.08, 1]], 0.12), side: 'self' },
  diorite: { name: 'Диорит', colors: [0xd4d4d0, 0xc4c4c2, 0xe0e0dc, 0x6a6a70, 0x9a9aa0], pat: grain([0, 1, 2], [[3, 0.08, 1], [4, 0.1, 1]], 0.1), side: 'self' },
  limestone: { name: 'Известняк', colors: [0xd8c08e, 0xccb282, 0xe2cc9c, 0xa88c5c, 0xeedcb4], pat: grain([0, 1, 2], [[3, 0.07, 1], [4, 0.06, 2]], 0.1), side: 'self' },
  slate: { name: 'Сланец', colors: [0x565a62, 0x4c5058, 0x62666e, 0x70747c, 0x8a7a62], pat: layered([0, 1, 2, 3, 1, 4], 3), side: 'self' },
  marble: { name: 'Мрамор', colors: [0xe8e8e6, 0xdcdcda, 0xf2f2f0, 0x8a8c96], pat: cracked(grain([0, 1, 2], [], 0.06), 3, 0.7, 3, 0.95), side: 'self' },
  obsidian: { name: 'Обсидиан', colors: [0x1e1828, 0x16121e, 0x282034, 0x7a4ac8, 0x9a6ae0], pat: grain([0, 1, 2], [[3, 0.07, 1], [4, 0.03, 2]], 0.1), side: 'self' },
  stone_cracked: { name: 'Потрескавшийся камень', colors: [0x9a9894, 0x8a8884, 0xa8a6a2, 0x2a2826], pat: cracked(mottled([1, 0, 2], 0.14), 3, 0.55, 3), side: 'self' },
  stone_lichen: { name: 'Камень с лишайником', colors: [0x8e8e8a, 0x7e7e7a, 0x9c9c98, 0x8aa83a, 0xa0b84a], pat: cracked(mottled([1, 0, 2], 0.14), 3, 0.9, 4, 1.05), side: 'self' },
  // ---------------------------------------------------------------- desert (21-28)
  red_sand: { name: 'Красный песок', colors: [0xc8643a, 0xbc5a34, 0xd47044, 0x9a4428], pat: grain([0, 1, 2], [[3, 0.08, 1]], 0.1), side: 'self' },
  sand_packed: { name: 'Уплотнённый песок', colors: [0xe0c48c, 0xd6ba82, 0xe8cc96], pat: grain([0, 1, 2], [], 0.06), side: 'self' },
  sand_stony: { name: 'Песок с камнями', colors: [0xe2c890, 0xd8be86, 0xeacf98, 0x8a8682, 0x6e6a66], pat: grain([0, 1, 2], [[3, 0.07, 2], [4, 0.05, 1]], 0.1), side: 'self' },
  red_sandstone: { name: 'Красный песчаник', colors: [0xc0603a, 0xb05434, 0xcc6e44, 0xd88050, 0x9a4a2c], pat: layered([0, 1, 2, 3, 4], 3), side: 'self' },
  cracked_earth: { name: 'Потрескавшаяся земля', colors: [0xd0aa78, 0xc69e6e, 0xdab484, 0x6a4a30], pat: cracked(grain([0, 1, 2], [], 0.08), 3, 0.7, 3), side: 'self' },
  salt_flat: { name: 'Солончак', colors: [0xeae4e0, 0xe0d8d4, 0xf4f0ec, 0xd4c0bc], pat: mix(grain([0, 1, 2], [], 0.06), grain([3, 1], [], 0.08), 0.3), side: 'self' },
  dry_clay: { name: 'Сухая глина', colors: [0xb0704a, 0xa46644, 0xbc7a52, 0x8a5434], pat: grain([0, 1, 2], [[3, 0.06, 1]], 0.1), side: 'self' },
  desert_rock: { name: 'Пустынный камень', colors: [0xb49a74, 0xa48a66, 0xc0a880, 0x6a5440], pat: cracked(mottled([1, 0, 2], 0.14), 3, 0.6, 2), side: 'self' },
  // ---------------------------------------------------------------- snow and ice (29-37)
  snow_loose: { name: 'Рыхлый снег', colors: [0xf2f6fa, 0xe4ecf6, 0xffffff, 0xc8d6ec], pat: grain([0, 1, 2, 0], [[3, 0.06, 2]], 0.08), side: 'soil', hang: 4 },
  snow_packed: { name: 'Утрамбованный снег', colors: [0xdce6f2, 0xd2deee, 0xe6eef8, 0xbccce4], pat: grain([0, 1, 2], [[3, 0.05, 1]], 0.05), side: 'soil', hang: 3 },
  snow_deep: { name: 'Глубокий снег', colors: [0xf8fafe, 0xeef2fa, 0xffffff, 0xd6e0f0], pat: mottled([3, 1, 0, 2], 0.06), side: 'soil', hang: 6 },
  snow_dirty: { name: 'Грязный снег', colors: [0xeaeef2, 0xdce2ea, 0x7a5a3e, 0x8a6a4a], pat: mix(grain([0, 1], [], 0.06), grain([2, 3], [], 0.12), 0.3), side: 'soil', hang: 3 },
  snow_stony: { name: 'Снег с камнями', colors: [0xf0f4f8, 0xe2eaf2, 0x8a8886, 0x747270], pat: grain([0, 1], [[2, 0.1, 3], [3, 0.06, 2]], 0.06), side: 'soil', hang: 3 },
  ice_blue: { name: 'Голубой лёд', colors: [0x3a78d8, 0x346ec8, 0x4282e0, 0x9ac4f4], pat: cracked(grain([0, 1, 2], [], 0.06), 3, 0.45, 4, 1), side: 'self' },
  ice_cracked: { name: 'Потрескавшийся лёд', colors: [0x2e64c0, 0x2a5cb4, 0x3870cc, 0xd8ecfc], pat: cracked(grain([0, 1, 2], [], 0.06), 3, 0.9, 3, 1), side: 'self' },
  frozen_dirt: { name: 'Мёрзлая земля', colors: [0x6e5240, 0x624838, 0x7a5c48, 0xc0d4ea, 0xe0ecf8], pat: grain([0, 1, 2], [[3, 0.05, 1], [4, 0.03, 1]]), side: 'self' },
  icy_stone: { name: 'Обледенелый камень', colors: [0x7a7c80, 0x6a6c70, 0x8a8c90, 0x9ac8f0, 0xc8e4fa], pat: strokes(mottled([1, 0, 2], 0.14), [[3, 4, 7, 2], [4, 3, 5, 3]]), side: 'self' },
  // ---------------------------------------------------------------- forest and swamp (38-46)
  dirt_moss: { name: 'Земля со мхом', colors: [0x6e4a2e, 0x62422a, 0x5e9a2e, 0x78b23a, 0x4a7e26], pat: mix(grain([0, 1]), grain([2, 3, 4], [], 0.18), 0.4), side: 'soil', hang: 2, soil: 0x6a462c },
  dirt_roots: { name: 'Земля с корнями', colors: [0x5e4430, 0x523c2a, 0x6a4c36, 0xb89260, 0xa27e50], pat: strokes(grain([0, 1, 2], [], 0.12), [[3, 3, 12, 3], [4, 3, 8, 2]]), side: 'self' },
  leaf_litter: { name: 'Земля с опавшей листвой', colors: [0x5a4430, 0x4e3c2a, 0x9a6632, 0xae9046, 0x8a5430, 0x7a7e3a], pat: leaves(grain([0, 1]), [2, 3, 4, 5, 2], 9), side: 'soil', hang: 2, soil: 0x5a3e28 },
  needle_litter: { name: 'Хвойная подстилка', colors: [0x5a4632, 0x4e3c2c, 0x8a6a40, 0x7a5e38, 0x947446, 0x4a4632], pat: strokes(grain([0, 1]), [[2, 10, 4, 1], [3, 8, 3, 1], [4, 6, 3, 2], [5, 3, 3, 1]]), side: 'soil', hang: 2, soil: 0x5a3e28 },
  swamp_mud: { name: 'Болотная грязь', colors: [0x4a3a2c, 0x403226, 0x56443a, 0x5a6a7a, 0x6a8a34], pat: (s) => { const g = grain([0, 1, 2], [[4, 0.08, 2]])(s); return (x, y) => (blotch(x, y, s + 3) > 0.7 ? [3, 0.95 + H(x, y, s) * 0.1] : g(x, y)); }, side: 'self' },
  silt: { name: 'Илистое дно', colors: [0x7a7a4a, 0x6e7042, 0x868652, 0x9a9a8e, 0x5e6a36], pat: grain([0, 1, 2], [[3, 0.04, 2], [4, 0.08, 2]], 0.12), side: 'self' },
  dirt_pebbles: { name: 'Земля с мелкими камнями', colors: [0x9a6a3e, 0x8e6038, 0xa47446, 0x9a9894, 0x7e7c78, 0xbab8b4], pat: grain([0, 1, 2], [[3, 0.14, 1], [4, 0.1, 1], [5, 0.05, 1]]), side: 'self' },
  cobble_overgrown: { name: 'Заросшая брусчатка', colors: [0x9a9a96, 0x8a8a86, 0xaaaaa6, 0x5a8a2c], pat: cobbles([0, 1, 2], 3), side: 'self' },
  // ---------------------------------------------------------------- mixed blocks (transitions)
  grass_dirt: { name: 'Трава + земля', colors: [0x6aa842, 0x5e9a3a, 0x7ab44c, 0x8a5a34, 0x7e5230], pat: mix(grain([0, 1, 2]), grain([3, 4], [], 0.14), 0.45), side: 'soil', hang: 3 },
  grass_stone: { name: 'Трава + камень', colors: [0x8a8c90, 0x7a7c80, 0x9a9ca0, 0x6aa842, 0x5e9a3a], pat: mix(mottled([1, 0, 2], 0.16), grain([3, 4], [], 0.18), 0.4), side: 'self' },
  grass_sand: { name: 'Трава + песок', colors: [0x7ab44c, 0x6aa842, 0x86bc52, 0xe4d29c, 0xdecb94], pat: mix(grain([0, 1, 2]), grain([3, 4], [], 0.08), 0.5), side: 'soil', hang: 2 },
  dirt_gravel: { name: 'Земля + гравий', colors: [0x8a5a34, 0x7e5230, 0x8a8a8c, 0x7a7a7e, 0xa4a4a6], pat: mix(grain([0, 1], [], 0.14), grain([2, 3, 4], [], 0.2), 0.45), side: 'self' },
  stone_snow: { name: 'Камень + снег', colors: [0x7a7c80, 0x6a6c70, 0x8a8c90, 0xf0f4f8, 0xdde6f0], pat: mix(mottled([1, 0, 2], 0.16), grain([3, 4], [], 0.06), 0.5), side: 'self' },
  stone_moss: { name: 'Камень + мох', colors: [0x7e8284, 0x6e7274, 0x8a8e90, 0x5a8a34, 0x6a9a3c], pat: mix(mottled([1, 0, 2], 0.16), grain([3, 4], [], 0.2), 0.45), side: 'self' },
  sand_stone: { name: 'Песок + камень', colors: [0xe2c890, 0xd8be86, 0x8a8682, 0x7a7672, 0x9a9692], pat: mix(grain([0, 1], [], 0.08), mottled([3, 2, 4], 0.14), 0.35), side: 'self' },
  mud_grass: { name: 'Грязь + трава', colors: [0x5e4430, 0x523c2a, 0x5e9a3a, 0x6aa842, 0x5a6a7a], pat: (s) => { const m = mix(grain([0, 1]), grain([2, 3], [], 0.18), 0.5)(s); return (x, y) => (blotch(x, y, s + 7) > 0.8 ? [4, 1] : m(x, y)); }, side: 'self' },
  snow_dirt: { name: 'Снег + земля', colors: [0xeef3f8, 0xe0e8f2, 0x7a5638, 0x6e4e32], pat: mix(grain([0, 1], [], 0.06), grain([2, 3], [], 0.14), 0.42), side: 'soil', hang: 2 },
  sand_clay: { name: 'Песок + глина', colors: [0xe2c48c, 0xd8ba82, 0xb0704a, 0xa46644], pat: mix(grain([0, 1], [], 0.08), grain([2, 3], [], 0.1), 0.45), side: 'self' },
};

/** Block names in the reference order (1-46, then the mixed blocks), for tests and the docs. */
export const BLOCK_ORDER = Object.keys(BLOCKS);

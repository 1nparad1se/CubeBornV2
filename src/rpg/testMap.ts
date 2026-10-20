import { fbm2 } from '../core/Rng';
import type { MapDef } from '../data/types';
import { CELL, Terrain } from '../game/Terrain';

/**
 * «Тренировочная поляна»: the fixed 100 × 100 test map. A flat open meadow (block-step ground,
 * no slopes) with the spawn point, exactly three training dummies and a few 1-block terrain
 * obstacles near the edges for jumping.
 */
export const TEST_MAP: MapDef = {
  id: 'training',
  name: { ru: 'Тренировочная поляна', en: 'Training Meadow' },
  desc: { ru: 'Поле 100 × 100 с тремя манекенами.', en: '100 × 100 field with three dummies.' },
  size: 100,
  generator: 'meadow',
  palette: {
    sky: 0x9fd2ec, fog: 0xa8d0c8, fogNear: 34, fogFar: 72, ambient: 0xd6ecff, ambientIntensity: 0.6,
    sun: 0xfff1d6, sunIntensity: 1.2, hemiGround: 0x5a7a34,
    // six summer meadow grounds, close in tone: lush hollows, the plain meadow, a lighter
    // meadow, sunlit slopes, dry patches and clover; buildTestMap lays them out by smooth noise
    tiles: {
      grass: [0x6aa842, 0x70ad46, 0x64a23f],
      grass2: [0x78b44c, 0x7eb952],
      grass_lush: [0x62a03c, 0x66a43f, 0x5e9c3a],
      grass_sun: [0x7cb44a, 0x82b84f, 0x78b047],
      grass_dry: [0x84ae4c, 0x8ab252, 0x80aa49],
      grass_clover: [0x67aa47, 0x6db04c, 0x62a443],
    },
  },
  music: { root: 45, scale: 'dorian', tempo: 100, mood: 'forest' },
};

/** Where every character appears (and returns to on load), facing the dummies (north, -z). */
export const SPAWN = { x: 50, z: 60 };

interface DummySpot {
  id: string;
  name: string;
  x: number;
  z: number;
}

/**
 * Exactly three dummies: a close pair (1.4 blocks apart, for the spear sweep hitting two at once)
 * and a lone one seven blocks to the east (single-target tests).
 */
export const DUMMIES: DummySpot[] = [
  { id: 'dummy_a', name: 'Манекен А', x: 47.3, z: 50 },
  { id: 'dummy_b', name: 'Манекен Б', x: 48.7, z: 50 },
  { id: 'dummy_c', name: 'Манекен В', x: 56, z: 50 },
];

/** Impassable border band (cells). */
const RIM = 4;

/** 1-block obstacles (cell rectangles x0, z0, x1, z1 inclusive), all near the edges. */
export const OBSTACLES: [number, number, number, number][] = [
  [10, 30, 12, 30],
  [86, 68, 87, 69],
  [20, 84, 20, 84],
  [70, 12, 72, 12],
];

/**
 * Meadow ground at cell (x, z). A broad moisture field orders the main grounds from lush through
 * the plain and light meadow to sunlit grass, so neighbouring cells always differ by one step
 * in tone; dry patches sit only on the sunny side and clover only on the moist side.
 */
export function meadowTile(x: number, z: number): string {
  const wet = fbm2(x / 15, z / 15, 301);
  const dry = fbm2(x / 9, z / 9, 302);
  const clover = fbm2(x / 5, z / 5, 303);
  if (wet > 0.56 && dry > 0.62) return 'grass_dry';
  if (wet < 0.5 && clover > 0.7) return 'grass_clover';
  if (wet < 0.36) return 'grass_lush';
  if (wet < 0.5) return 'grass';
  if (wet < 0.62) return 'grass2';
  return 'grass_sun';
}

export function buildTestMap(): Terrain {
  const n = TEST_MAP.size;
  const t = new Terrain(n);
  for (const name of Object.keys(TEST_MAP.palette.tiles)) t.tileId(name);
  for (let z = 0; z < n; z++)
    for (let x = 0; x < n; x++) {
      const i = z * n + x;
      t.tile[i] = t.tileId(meadowTile(x, z));
      if (Math.min(x, z, n - 1 - x, n - 1 - z) < RIM) t.cell[i] = CELL.wall;
    }
  // 1-block steps to jump onto (block-step ground: no slopes anywhere)
  for (const [x0, z0, x1, z1] of OBSTACLES) for (let z = z0; z <= z1; z++) for (let x = x0; x <= x1; x++) t.elev[z * n + x] = 1;
  return t;
}

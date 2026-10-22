import type { MapDef } from '../data/types';
import { CELL, type Terrain } from '../game/Terrain';
import { DUMMIES, SPAWN, TEST_MAP, buildTestMap } from '../rpg/testMap';
import type { WorldSite } from '../rpg/World';
import type { MotorGround } from './motor';

/**
 * «Тестовая площадка» (D214): a separate copy of the 100 × 100 training meadow for the RPG
 * systems. The original map (menu backdrop, tests) is not touched: this copy is built from the
 * same generator and then gets its own test features:
 *  - a level pad east of the clearing with a row of fall pillars (3, 5, 8, 12, 20 and 21 m above
 *    the pad: the edges of the D191 table) and a staircase of 1 m steps;
 *  - a step strip (0.25 / 0.5 / 0.75 m) for the D212 step limit;
 *  - a pond: a shallow rim in quarter-block steps (wading) and a deep middle (2.6 m, D192), with a 21 m pillar on its
 *    bank to jump into it.
 * Later stages place their NPCs, enemies, stations and stones here (placeholders until then).
 */
export const RPG_TEST_MAP: MapDef = {
  ...TEST_MAP,
  id: 'rpg_test',
  name: { ru: 'Тестовая площадка', en: 'Test Ground' },
  desc: { ru: 'Копия тренировочной поляны для проверки RPG-систем.', en: 'A copy of the training meadow for the RPG systems.' },
  palette: {
    ...TEST_MAP.palette,
    tiles: { ...TEST_MAP.palette.tiles, water_lake_3: [0x3a82c8, 0x408ad0] },
  },
};

/** Height of the clearing and the test pad (blocks = metres). */
export const PAD = 2.5;
/** Water surface of the pond: the renderer draws water at elev − 0.62, so elev 3 gives 2.38. */
export const POND_ELEV = 3;
export const POND_SURFACE = POND_ELEV - 0.62;

export interface TestMarker {
  id: string;
  label: string;
  x: number;
  z: number;
  /** Height of the top the marker stands on. */
  y: number;
  /** Teleport target for the dev panel. */
  tp?: boolean;
}

/** Fall pillars: [x0, z0] of a 2 × 2 column and its height above the pad. */
const PILLARS: [number, number, number][] = [
  [60, 46, 3],
  [63, 46, 5],
  [66, 46, 8],
  [69, 46, 12],
  [72, 46, 20],
  [75, 46, 21],
];
/** The pond: shallow rim and deep middle (cell rectangles, inclusive). */
const POND = { x0: 64, z0: 54, x1: 73, z1: 63 };
const POND_DEEP = { x0: 66, z0: 56, x1: 73, z1: 61 };
/** A 21 m pillar on the east bank of the deep water. */
const BANK_PILLAR: [number, number, number] = [74, 57, 21];

function rect(t: Terrain, h: Float32Array, x0: number, z0: number, x1: number, z1: number, v: number) {
  for (let z = z0; z <= z1; z++) for (let x = x0; x <= x1; x++) h[z * t.size + x] = v;
}

export interface TestSite extends WorldSite {
  markers: TestMarker[];
  ground: MotorGround;
}

export function buildTestSite(): TestSite {
  const t = buildTestMap();
  const n = t.size;
  const top = t.top!;
  const markers: TestMarker[] = [];
  // the test pad
  rect(t, top, 57, 43, 79, 66, PAD);
  // fall pillars
  for (const [x, z, hgt] of PILLARS) {
    rect(t, top, x, z, x + 1, z + 1, PAD + hgt);
    markers.push({ id: `pillar_${hgt}`, label: `Столб ${hgt} м`, x: x + 1, z: z + 1, y: PAD + hgt, tp: true });
  }
  // staircase of 1 m steps (jump each) up to 6 m, north-west of the pillars
  for (let i = 0; i < 6; i++) rect(t, top, 57 + i * 2, 43, 58 + i * 2, 44, PAD + 1 + i);
  markers.push({ id: 'stairs', label: 'Ступени по 1 м', x: 57, z: 45.2, y: PAD });
  // step strip: 0.25, 0.5, 0.75 m rises (D212: 0.3 m is walked, higher needs a jump)
  rect(t, top, 58, 50, 59, 52, PAD + 0.25);
  rect(t, top, 58, 53, 59, 55, PAD + 0.5);
  rect(t, top, 58, 56, 59, 58, PAD + 0.75);
  markers.push({ id: 'steps', label: 'Ступени 0,25 / 0,5 / 0,75 м', x: 57.3, z: 54, y: PAD });
  // pond
  const lake = t.tileId('water_lake_3');
  for (let z = POND.z0; z <= POND.z1; z++)
    for (let x = POND.x0; x <= POND.x1; x++) {
      const i = z * n + x;
      const deep = x >= POND_DEEP.x0 && x <= POND_DEEP.x1 && z >= POND_DEEP.z0 && z <= POND_DEEP.z1;
      t.tile[i] = lake;
      t.cell[i] = deep ? CELL.liquid : CELL.shallow;
      // the rim steps down by quarter blocks (walkable both ways), then the deep middle
      const edge = Math.min(x - POND.x0, z - POND.z0, POND.z1 - z);
      top[i] = deep ? POND_SURFACE - 2.6 : edge <= 0 ? PAD - 0.25 : PAD - 0.5;
    }
  markers.push({ id: 'pond', label: 'Пруд: мелко 0,1–0,4 м / глубоко 2,6 м', x: 63.2, z: 58.5, y: PAD, tp: true });
  {
    const [x, z, hgt] = BANK_PILLAR;
    rect(t, top, x, z, x + 1, z + 1, PAD + hgt);
    markers.push({ id: 'bank_pillar', label: `Столб у пруда ${hgt} м`, x: x + 1, z: z + 1, y: PAD + hgt, tp: true });
  }
  markers.push({ id: 'spawn', label: 'Точка появления', x: SPAWN.x + 2.2, z: SPAWN.z + 0.5, y: PAD, tp: true });
  // refresh the derived arrays the renderer reads
  for (let i = 0; i < n * n; i++) {
    const water = t.cell[i] === CELL.liquid || t.cell[i] === CELL.shallow;
    t.elev[i] = water ? POND_ELEV : Math.floor(top[i]);
    t.shadeElev![i] = Math.round(top[i] * 4) & 255;
  }
  const ground: MotorGround = {
    top: (x, z) => t.groundY(x, z),
    wall: (x, z) => {
      const cx = Math.floor(x - t.ox);
      const cz = Math.floor(z - t.oz);
      if (!t.inLocal(cx, cz)) return true;
      const c = t.cell[cz * n + cx];
      return c === CELL.wall || c === CELL.solid;
    },
    water: (x, z) => {
      const cx = Math.floor(x - t.ox);
      const cz = Math.floor(z - t.oz);
      if (!t.inLocal(cx, cz)) return null;
      const c = t.cell[cz * n + cx];
      return c === CELL.liquid || c === CELL.shallow ? t.elev[cz * n + cx] - 0.62 : null;
    },
  };
  return { map: RPG_TEST_MAP, terrain: t, spawn: SPAWN, dummies: DUMMIES, markers, ground };
}

import { fbm2, hash2 } from '../core/Rng';
import { CELL, type Terrain } from '../game/Terrain';
import { DUMMIES, SPAWN } from '../rpg/testMap';
import { SPRITE } from './Textures';

/**
 * Where the meadow's bushes grow. Decor only (the hero walks through them, pushing them aside),
 * but placed by one deterministic rule so the world and the maps (minimap, world map) agree.
 */
export interface BushSpot {
  x: number;
  z: number;
  /** Foliage sprite (SPRITE.bush, berryBush or shrub). */
  sprite: number;
  /** Size multiplier. */
  s: number;
}

/**
 * Bushes gather in loose groves (a broad noise field) with a few loners; none on the border,
 * the raised blocks, next to the spawn point or crowding the dummies.
 */
export function bushSpots(t: Terrain): BushSpot[] {
  const n = t.size;
  const out: BushSpot[] = [];
  const clear = (x: number, z: number) => {
    if (Math.hypot(x - SPAWN.x, z - SPAWN.z) < 3.5) return false;
    for (const d of DUMMIES) if (Math.hypot(x - d.x, z - d.z) < 2.2) return false;
    for (let dz = -1; dz <= 1; dz++)
      for (let dx = -1; dx <= 1; dx++) {
        const cx = Math.floor(x) + dx;
        const cz = Math.floor(z) + dz;
        if (cx < 0 || cz < 0 || cx >= n || cz >= n) return false;
        const i = cz * n + cx;
        if (t.cell[i] !== CELL.floor || t.centerY(i) !== t.centerY(Math.floor(z) * n + Math.floor(x))) return false;
      }
    return true;
  };
  for (let z = 0; z < n; z++)
    for (let x = 0; x < n; x++) {
      const grove = fbm2(x / 11, z / 11, 411);
      const p = grove > 0.6 ? (grove - 0.6) * 0.9 : 0.004;
      if (hash2(x, z, 412) >= p) continue;
      const fx = x + 0.2 + hash2(x, z, 413) * 0.6;
      const fz = z + 0.2 + hash2(x, z, 414) * 0.6;
      if (!clear(fx, fz)) continue;
      const r = hash2(x, z, 415);
      const sprite = r < 0.58 ? SPRITE.bush : r < 0.8 ? SPRITE.shrub : SPRITE.berryBush;
      out.push({ x: fx, z: fz, sprite, s: 0.95 + hash2(x, z, 416) * 0.45 });
    }
  return out;
}

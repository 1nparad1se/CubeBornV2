/**
 * The wild world (2000 × 2000): an irregular continent, ranges as long ridges, water that always
 * runs downhill to the sea, waterfalls on drops, biomes in large zones with gradual borders, trees
 * by climate and water, the new ground blocks, a usable spawn. Run: npx tsx tools/tests/wild.ts
 */
import { BIOME, SEA, WILD_SIZE, generateWild } from '../../src/world/wild';
import { TREE, TREE_KINDS, TREE_SPECS } from '../../src/world/trees';
import { CELL } from '../../src/game/Terrain';
import { findPath } from '../../src/game/arpg/Path';
import { World } from '../../src/rpg/World';
import { GameClock } from '../../src/game/GameClock';
import { NullFx } from '../../src/game/types';
import { newGear } from '../../src/rpg/equipment';
import { STARTER_ITEMS } from '../../src/rpg/items';

let fails = 0;
const ok = (c: boolean, msg: string) => {
  console.log((c ? 'ok   ' : 'FAIL ') + msg);
  if (!c) fails++;
};

const t0 = Date.now();
const w = generateWild();
const ms = Date.now() - t0;
const t = w.terrain;
const n = t.size;
const top = t.top!;
const water = (c: number) => c === CELL.liquid || c === CELL.shallow || c === CELL.ice;
ok(n === WILD_SIZE && n === 2000, 'the world is 2000 × 2000 blocks');
ok(ms < 20000, `generated in ${(ms / 1000).toFixed(1)} s`);

// ---------------------------------------------------------------- shape: not a square
{
  const sea = (k: number) => t.cell[k] === CELL.liquid && t.elev[k] === SEA;
  let land = 0;
  for (let k = 0; k < n * n; k++) if (!sea(k)) land++;
  const frac = land / (n * n);
  ok(frac > 0.35 && frac < 0.8, `land covers ${(frac * 100).toFixed(0)} % of the map, the ocean the rest`);
  let edgeLand = 0;
  for (let i = 0; i < n; i++) for (const k of [i, (n - 1) * n + i, i * n, i * n + n - 1]) if (!sea(k)) edgeLand++;
  ok(edgeLand === 0, 'ocean all along the map edge (no coast follows the edge)');
  // the west coast: where the first land of each row begins varies a lot (bays and capes)
  const starts: number[] = [];
  for (let z = 300; z < 1700; z += 10) {
    let x = 0;
    while (x < n && sea(z * n + x)) x++;
    if (x < n) starts.push(x);
  }
  const mean = starts.reduce((a, b) => a + b, 0) / starts.length;
  const sd = Math.sqrt(starts.reduce((a, b) => a + (b - mean) ** 2, 0) / starts.length);
  ok(sd > 25, `the coastline is irregular (west coast varies by ${sd.toFixed(0)} blocks)`);
}

// ---------------------------------------------------------------- mountains: long ridges
{
  const high = new Uint8Array(n * n);
  let count = 0;
  let peak = 0;
  for (let k = 0; k < n * n; k++)
    if (!water(t.cell[k]) && top[k] > SEA + 35) {
      high[k] = 1;
      count++;
      peak = Math.max(peak, top[k]);
    }
  ok(count > 20000 && peak > SEA + 60, `mountains: ${count} blocks above ${SEA + 35}, peaks up to ${peak}`);
  // the biggest ranges are elongated: their extent is long compared with their area
  const seen = new Uint8Array(n * n);
  const ranges: { area: number; len: number }[] = [];
  for (let s = 0; s < n * n; s += 7) {
    if (!high[s] || seen[s]) continue;
    const q = [s];
    seen[s] = 1;
    let x0 = n, x1 = 0, z0 = n, z1 = 0;
    for (let h = 0; h < q.length; h++) {
      const k = q[h];
      const x = k % n;
      const z = (k / n) | 0;
      x0 = Math.min(x0, x);
      x1 = Math.max(x1, x);
      z0 = Math.min(z0, z);
      z1 = Math.max(z1, z);
      for (const o of [1, -1, n, -n]) {
        const j = k + o;
        if (j >= 0 && j < n * n && high[j] && !seen[j]) {
          seen[j] = 1;
          q.push(j);
        }
      }
    }
    if (q.length > 3000) ranges.push({ area: q.length, len: Math.hypot(x1 - x0, z1 - z0) });
  }
  ranges.sort((a, b) => b.area - a.area);
  const r0 = ranges[0];
  ok(!!r0 && r0.len * r0.len > r0.area * 4, `the main range is a long ridge (${r0?.len.toFixed(0)} blocks long, ${r0?.area} blocks of area)`);
}

// ---------------------------------------------------------------- water runs downhill
{
  const { m, down, level, river } = w.coarse;
  let broken = 0;
  let checked = 0;
  for (let i = 0; i < m * m; i++) {
    if (!river[i] || down[i] < 0) continue;
    checked++;
    // follow the river to the sea: the water level never rises on the way
    let c = i;
    for (let s = 0; s < m * m && down[c] >= 0; s++) {
      if (level[down[c]] > level[c] + 1e-4) {
        broken++;
        break;
      }
      c = down[c];
    }
  }
  ok(checked > 1000 && broken === 0, `${checked} river cells: each flows downhill all the way to the sea (${broken} rising)`);
  // block scale: every river block has a neighbouring water block at its level or lower (it can drain)
  let stuck = 0;
  let rivers = 0;
  for (let z = 1; z < n - 1; z++)
    for (let x = 1; x < n - 1; x++) {
      const k = z * n + x;
      if (t.cell[k] !== CELL.shallow) continue;
      rivers++;
      let drains = false;
      for (const o of [1, -1, n, -n, n + 1, n - 1, -n + 1, -n - 1]) if (water(t.cell[k + o]) && t.elev[k + o] <= t.elev[k]) drains = true;
      if (!drains) stuck++;
    }
  ok(rivers > 30000 && stuck / rivers < 0.002, `river water is never trapped above its banks (${stuck} of ${rivers})`);
  ok(w.stats.waterfalls > 20, `waterfalls where rivers drop two blocks or more: ${w.stats.waterfalls}`);
  ok(w.stats.lakeCells > 5000, `lakes fill the hollows: ${w.stats.lakeCells} blocks of lake water`);
  // rivers rise in the highlands: the sources stand well above the average land
  let srcH = 0;
  let src = 0;
  let landH = 0;
  let land = 0;
  const up = new Uint8Array(m * m);
  for (let i = 0; i < m * m; i++) if (river[i] && down[i] >= 0) up[down[i]] = 1;
  for (let i = 0; i < m * m; i++) {
    if (level[i] > SEA) {
      landH += level[i];
      land++;
    }
    if (river[i] && down[i] >= 0 && !up[i]) {
      srcH += level[i];
      src++;
    }
  }
  ok(srcH / src > (landH / land) * 1.15, `rivers rise in the highlands (sources at ${(srcH / src).toFixed(1)}, land on average ${(landH / land).toFixed(1)})`);
}

// ---------------------------------------------------------------- biomes in large zones, gradual borders
{
  const { m, biome } = w.coarse;
  const count = new Array(10).fill(0);
  for (const b of biome) count[b]++;
  ok([BIOME.desert, BIOME.steppe, BIOME.plains, BIOME.forest, BIOME.conifer, BIOME.tundra].every((b) => count[b] > 3000), 'every main climate zone covers a large area');
  // desert and snow never meet on the same level: within 40 blocks of a desert, snow lies only on
  // mountains well above it (the slope between is the transition)
  const lvl = w.coarse.level;
  let clash = 0;
  for (let i = 0; i < m * m; i++) {
    if (biome[i] !== BIOME.desert) continue;
    const x = i % m;
    const z = (i / m) | 0;
    for (let dz = -10; dz <= 10; dz++)
      for (let dx = -10; dx <= 10; dx++) {
        const xx = x + dx;
        const zz = z + dz;
        if (xx >= 0 && zz >= 0 && xx < m && zz < m && biome[zz * m + xx] === BIOME.tundra && lvl[zz * m + xx] - lvl[i] < 15) clash++;
      }
  }
  ok(clash === 0, 'no snowfield lies next to a desert (only high mountains above it)');
  // zones are wide: along random lines the biome changes rarely
  let changes = 0;
  let steps = 0;
  for (let z = 30; z < m - 30; z += 37)
    for (let x = 1; x < m; x++) {
      const a = biome[z * m + x - 1];
      const b = biome[z * m + x];
      if (a === BIOME.ocean || b === BIOME.ocean) continue;
      steps++;
      if (a !== b) changes++;
    }
  ok(changes / steps < 0.06, `biomes change about every ${((steps / Math.max(1, changes)) * 4).toFixed(0)} blocks along a line`);
}

// ---------------------------------------------------------------- ground blocks
{
  const names = new Set<string>();
  for (let k = 0; k < n * n; k += 3) names.add(t.tileNames[t.tile[k]]);
  const want = ['snow', 'gravel', 'clay', 'basalt', 'tuff', 'moss_stone', 'ice', 'sandstone', 'sand'];
  ok(want.every((b) => names.has(b)), `all nine new ground blocks are used (${want.filter((b) => !names.has(b)).join(', ') || 'none missing'})`);
}

// ---------------------------------------------------------------- trees
{
  const T = w.trees;
  const kinds = new Array(TREE_KINDS).fill(0);
  for (let i = 0; i < T.count; i++) kinds[T.kind[i]]++;
  ok(T.count > 20000 && kinds.every((c) => c > 300), `${T.count} trees of all eight species (${TREE_SPECS.map((s, i) => `${s.name} ${kinds[i]}`).join(', ')})`);
  const { m, biome, temp, rain } = w.coarse;
  const at = (i: number) => Math.min(m - 1, Math.floor(T.z[i] / 4)) * m + Math.min(m - 1, Math.floor(T.x[i] / 4));
  // willows by the water
  let wet = 0;
  let wil = 0;
  for (let i = 0; i < T.count; i++) {
    if (T.kind[i] !== TREE.willow) continue;
    wil++;
    const x = Math.floor(T.x[i]);
    const z = Math.floor(T.z[i]);
    let near = false;
    for (let dz = -14; dz <= 14 && !near; dz += 2) for (let dx = -14; dx <= 14; dx += 2) if (water(t.cell[(z + dz) * n + x + dx])) near = true;
    if (near) wet++;
  }
  ok(wet / wil > 0.95, `willows grow by the water (${wet} of ${wil})`);
  let cold = 0;
  let con = 0;
  let dry = 0;
  let dead = 0;
  let trunks = 0;
  for (let i = 0; i < T.count; i++) {
    const c = at(i);
    if (T.kind[i] === TREE.spruce || T.kind[i] === TREE.pine) {
      con++;
      if (temp[c] < 0.45 || biome[c] === BIOME.alpine) cold++;
    }
    if (T.kind[i] === TREE.dead) {
      dead++;
      if (rain[c] < 0.38 || ([BIOME.desert, BIOME.steppe, BIOME.volcanic, BIOME.beach, BIOME.alpine] as number[]).includes(biome[c])) dry++;
    }
    const k = Math.floor(T.z[i]) * n + Math.floor(T.x[i]);
    if (t.cell[k] === CELL.solid && t.height[k] > 0) trunks++;
  }
  ok(cold / con > 0.9, `spruces and pines grow in the cold and the mountains (${cold} of ${con})`);
  ok(dry / dead > 0.85, `dead trees stand in the dry and barren lands (${dry} of ${dead})`);
  ok(trunks === T.count, 'every trunk blocks its block');
  // forests are massifs, not an even sprinkle: tree counts per 64-block square vary strongly
  const per = new Map<number, number>();
  for (let i = 0; i < T.count; i++) {
    const key = Math.floor(T.z[i] / 64) * 64 + Math.floor(T.x[i] / 64);
    per.set(key, (per.get(key) ?? 0) + 1);
  }
  const vals = [...per.values()];
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  const dense = vals.filter((v) => v > avg * 2).length;
  const sparse = vals.filter((v) => v < avg * 0.3).length;
  ok(dense > 20 && sparse > 20, `forest massifs and open land (${dense} dense and ${sparse} sparse squares of 64 blocks)`);
}

// ---------------------------------------------------------------- spawn
{
  const s = w.spawn;
  const k = Math.floor(s.z) * n + Math.floor(s.x);
  const h = top[k];
  let level = true;
  for (const d of w.dummies) if (top[Math.floor(d.z) * n + Math.floor(d.x)] !== h || t.cell[Math.floor(d.z) * n + Math.floor(d.x)] !== CELL.floor) level = false;
  ok(t.cell[k] === CELL.floor && level, `spawn (${s.x}, ${s.z}) and the three dummies on one level clearing`);
  const world = new World(NullFx, new GameClock(), 'human', newGear(STARTER_ITEMS), { map: w.map, terrain: t, spawn: s, dummies: w.dummies, trees: w.trees });
  ok(world.player.y === h && world.dummies.length === 3, 'the hero appears on the clearing');
  // walking out of the clearing works
  const path = findPath(t, s.x, s.z, s.x + 30, s.z + 20);
  ok(path.length > 0, 'a path leads out of the clearing');
  world.ctl.clickMove = { x: s.x + 8, z: s.z + 6 };
  for (let i = 0; i < 600; i++) world.update(1 / 60);
  ok(Math.hypot(world.player.x - s.x - 8, world.player.z - s.z - 6) < 0.8, 'the hero walks there by a click');
}

console.log(fails ? `${fails} wild world check(s) FAILED` : 'all wild world checks passed');
process.exit(fails ? 1 : 0);

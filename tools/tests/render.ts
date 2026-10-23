/**
 * Render-side model checks (no WebGL needed): tree and bush models are organic (rounded, not
 * voxel cubes), keep each species' height and stay within a triangle budget; water geometry has
 * a smooth surface at the water levels and falling sheets where it drops.
 */
import { TREE_KINDS, TREE_SPECS, TREE_VARIANTS, treeHeight } from '../../src/world/trees';
import { treeGeometry } from '../../src/render/treeModels';
import { Terrain, CELL } from '../../src/game/Terrain';
import { WATER, waterBody, waterGeometry } from '../../src/render/water';
import { BUSH_KINDS, BUSH_SIZES, BUSH_VARIANTS, bushGeometry } from '../../src/render/bushModels';

let fails = 0;
const ok = (c: boolean, msg: string) => {
  console.log(`${c ? 'ok  ' : 'FAIL'} ${msg}`);
  if (!c) fails++;
};
/** Share of a model's triangles that face straight along x or z (the sides of cubes; flat leaves lying level are fine). */
const boxy = (g: import('three').BufferGeometry) => {
  const p = g.attributes.position.array as Float32Array;
  const ix = g.index!.array;
  let axis = 0;
  for (let t = 0; t < ix.length; t += 3) {
    const a = ix[t] * 3, b = ix[t + 1] * 3, c = ix[t + 2] * 3;
    const ux = p[b] - p[a], uy = p[b + 1] - p[a + 1], uz = p[b + 2] - p[a + 2];
    const vx = p[c] - p[a], vy = p[c + 1] - p[a + 1], vz = p[c + 2] - p[a + 2];
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const l = Math.hypot(nx, ny, nz);
    // (flat soles resting on the ground do not count)
    if (Math.max(p[a + 1], p[b + 1], p[c + 1]) < 0.02) continue;
    if (l > 1e-9 && Math.max(Math.abs(nx), Math.abs(nz)) / l > 0.999) axis++;
  }
  return axis / (ix.length / 3);
};

// ---------------------------------------------------------------- trees
{
  let offGrid = 0;
  let wrongHeight = 0;
  let maxTris = 0;
  let sum = 0;
  for (let k = 0; k < TREE_KINDS; k++)
    for (let v = 0; v < TREE_VARIANTS; v++) {
      const g = treeGeometry(k, v);
      // the world is not cubic (owner): rounded trunks and soft clumps, almost no cube faces
      if (boxy(g) > 0.05) offGrid++;
      g.computeBoundingBox();
      const top = g.boundingBox!.max.y;
      const h = treeHeight(k, v);
      // the species height is the trunk and crown body; ragged clumps may rise a little above it
      if (top < h * 0.88 || top > h * 1.25) {
        wrongHeight++;
        console.log(`     ${TREE_SPECS[k].name} ${v}: ${top.toFixed(2)} tall, wants ${h}`);
      }
      const tris = g.index!.count / 3;
      maxTris = Math.max(maxTris, tris);
      sum += tris;
    }
  ok(offGrid === 0, `tree models are organic, not voxel cubes (${offGrid} boxy models)`);
  ok(wrongHeight === 0, 'every species keeps its height (crown tops within -12 % .. +25 %)');
  ok(maxTris < 30000 && sum / (TREE_KINDS * TREE_VARIANTS) < 12000, `near models stay light (${Math.round(sum / (TREE_KINDS * TREE_VARIANTS))} triangles on average, ${maxTris} at most)`);
  // coarser levels of detail are much lighter and just as tall
  let lighter = true;
  for (let k = 0; k < TREE_KINDS; k++) {
    const a = treeGeometry(k, 0, 0).index!.count;
    const b = treeGeometry(k, 0, 1).index!.count;
    const c = treeGeometry(k, 0, 2).index!.count;
    const d = treeGeometry(k, 0, 3).index!.count;
    if (!(b < a * 0.7 && c <= b && d < c)) lighter = false;
  }
  ok(lighter, 'each coarser model (fewer facets, no twigs) is lighter than the one before');
}

// ---------------------------------------------------------------- water
{
  ok(waterBody('water_sea_4') === WATER.sea && waterBody('water_swamp_1') === WATER.swamp && waterBody('water_fast_2') === WATER.fast && waterBody('water_lake_3') === WATER.lake && waterBody('water_river_2') === WATER.plain, 'water tiles map to their bodies');
  // a 6 x 4 strip: an upper pool (x 0..2), a lower pool (x 3..5) two blocks down
  const t = new Terrain(6, true);
  t.top = new Float32Array(36);
  for (let z = 0; z < 6; z++)
    for (let x = 0; x < 6; x++) {
      const i = z * 6 + x;
      if (z === 0 || z === 5) {
        t.top[i] = 9;
        continue;
      }
      t.cell[i] = CELL.shallow;
      t.elev[i] = x < 3 ? 8 : 6;
      t.top[i] = t.elev[i] - 1.25;
    }
  const level = new Float32Array(36);
  for (let i = 0; i < 36; i++) level[i] = t.cell[i] === CELL.shallow ? t.elev[i] - 0.62 : t.top[i];
  const g = waterGeometry(t, level, 0, 0, 6, 6)!;
  const fall = g.attributes.aFall.array as Float32Array;
  const pos = g.attributes.position.array as Float32Array;
  let surf = 0;
  let sheets = 0;
  let spray = 0;
  let badY = 0;
  for (let v = 0; v < fall.length; v += 4) {
    if (fall[v] === 0) {
      surf++;
      const y = pos[v * 3 + 1];
      // smooth surface: at a pool's level inside it, between the two levels where they meet
      const x = pos[v * 3];
      const want = x <= 2 ? 7.38 : x >= 4 ? 5.38 : NaN;
      if (Number.isNaN(want) ? y < 5.38 - 1e-3 || y > 7.38 + 1e-3 : Math.abs(y - want) > 1e-3) badY++;
    } else if (fall[v] === 1) sheets++;
    else spray++;
  }
  ok(surf > 0 && badY === 0, `water surfaces lie at their water levels, sloping only where two pools meet (${surf} quads)`);
  ok(sheets === 4, `a falling sheet on each edge where the water drops (${sheets})`);
  ok(spray === 8, `spray where a tall fall lands (${spray / 2} puffs)`);
}

// ---------------------------------------------------------------- bushes
{
  let sizes = 0;
  let heavy = 0;
  let cubic = 0;
  for (let k = 0; k < BUSH_KINDS; k++)
    for (let v = 0; v < BUSH_VARIANTS; v++) {
      const g = bushGeometry(k, v);
      g.computeBoundingBox();
      const b = g.boundingBox!;
      // a bush model is at most about half a block across and tall (the medium size)
      if (b.max.y > 0.7 || b.max.y < 0.04 || b.max.x - b.min.x > 0.85) sizes++;
      if (g.index!.count / 3 > 3000) heavy++;
      if (boxy(g) > 0.05) cubic++;
    }
  ok(sizes === 0, `${BUSH_KINDS} bush species: models fit the medium size (half a block), placed at 0.3 / 0.6 / 1 of it`);
  ok(heavy === 0, 'bush models stay light (under 3000 triangles each)');
  ok(cubic === 0, `bush models are rounded, not voxel cubes (${cubic} boxy)`);
  ok(BUSH_SIZES[0] * 0.5 <= 0.16 && BUSH_SIZES[1] * 0.5 <= 0.31, 'very small (~0.15 block) and small (~0.3 block) sizes');
}

console.log(fails ? `${fails} render check(s) FAILED` : 'all render checks passed');
process.exit(fails ? 1 : 0);

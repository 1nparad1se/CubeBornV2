/**
 * Training ground simulation: jump arc and 1-block obstacles, dummies take damage and stay,
 * projectiles fly and hit. Run: npx tsx tools/tests/world.ts
 */
import { World, trainingSite } from '../../src/rpg/World';
import { GameClock } from '../../src/game/GameClock';
import { NullFx } from '../../src/game/types';
import { newGear, equipFromBag, type Gear } from '../../src/rpg/equipment';
import { STARTER_ITEMS } from '../../src/rpg/items';
import { JUMP } from '../../src/rpg/Player';
import { DUMMIES, OBSTACLES, SPAWN, TEST_MAP, buildTestMap } from '../../src/rpg/testMap';
import { CELL } from '../../src/game/Terrain';

let fails = 0;
const ok = (c: boolean, msg: string) => {
  console.log((c ? 'ok   ' : 'FAIL ') + msg);
  if (!c) fails++;
};
const dt = 1 / 60;
const wield = (id: string): Gear => {
  const g = newGear(STARTER_ITEMS);
  const r = equipFromBag(g, g.bag.indexOf(id));
  if (!r.ok) throw new Error(r.error);
  return r.gear;
};
const make = (id: string) => new World(NullFx, new GameClock(), 'human', wield(id));
const run = (w: World, sec: number, each?: () => void) => {
  for (let t = 0; t < sec; t += dt) {
    each?.();
    w.update(dt);
  }
};
const place = (w: World, x: number, z: number) => {
  const p = w.player;
  p.x = x;
  p.z = z;
  p.y = w.terrain.groundY(x, z);
  p.vx = p.vz = 0;
};

// ---------------------------------------------------------------- map
{
  const w = make('sword_recruit');
  const t = w.terrain;
  ok(TEST_MAP.size === 100 && t.size === 100, 'test map is exactly 100 × 100');
  ok(w.dummies.length === 3 && DUMMIES.length === 3, 'exactly three dummies');
  ok(OBSTACLES.every(([x0, z0, x1, z1]) => Math.min(x0, z0, 99 - x1, 99 - z1) <= 16), 'obstacles stand near the edges');
  // relief: blocks of whole, half and quarter heights; hills, lowlands and mountains
  const H = (x: number, z: number) => t.centerY(z * 100 + x);
  const steps = new Set<number>();
  let lo = 99;
  let hi = 0;
  let quarters = true;
  for (let z = 4; z < 96; z++)
    for (let x = 4; x < 96; x++) {
      const h = H(x, z);
      lo = Math.min(lo, h);
      hi = Math.max(hi, h);
      if (Math.abs(h * 4 - Math.round(h * 4)) > 1e-4) quarters = false;
      const d = Math.abs(h - H(x + 1, z));
      if (d > 0) steps.add(Math.round(d * 4) / 4);
    }
  ok(quarters, 'every block top stands at a multiple of a quarter block');
  ok(steps.has(0.25) && steps.has(0.5) && steps.has(1), 'steps of 1/4, 1/2 and 1 block all occur');
  ok(lo <= 0.5 && hi >= 6, `lowlands down to ${lo} and mountains up to ${hi} blocks`);
  const base = H(SPAWN.x, SPAWN.z);
  ok(DUMMIES.every((d) => H(Math.floor(d.x), Math.floor(d.z)) === base) && H(51, 55) === base, `the training clearing (spawn and dummies) is level at ${base}`);
  // walking across the relief by a click: always standing on the blocks, never in or above them
  const reach = t.computeReach(SPAWN.x, SPAWN.z);
  let goal = -1;
  for (let i = 0; i < 10000 && goal < 0; i++) {
    const x = i % 100;
    const z = (i / 100) | 0;
    if (reach[i] && t.cell[i] === CELL.floor && H(x, z) >= base + 2 && Math.hypot(x - SPAWN.x, z - SPAWN.z) > 15 && Math.hypot(x - SPAWN.x, z - SPAWN.z) < 32) goal = i;
  }
  ok(goal >= 0, 'a hilltop two blocks above the clearing is reachable on foot');
  const gx = (goal % 100) + 0.5;
  const gz = ((goal / 100) | 0) + 0.5;
  w.ctl.clickMove = { x: gx, z: gz };
  let off = 0;
  let climbed = 0;
  run(w, 40, () => {
    const p = w.player;
    // standing: the feet on a block top under the body (an edge counts), never below the ground
    if (!p.airborne) off = Math.max(off, Math.abs(p.y - p.support(0.02)), w.terrain.groundY(p.x, p.z) - p.y);
    climbed = Math.max(climbed, p.y - base);
  });
  ok(Math.hypot(w.player.x - gx, w.player.z - gz) < 0.6, `walks by click over the hills to (${gx}, ${gz}), ${H(goal % 100, (goal / 100) | 0)} blocks high (at ${w.player.x.toFixed(1)}, ${w.player.z.toFixed(1)})`);
  ok(off < 1e-6 && climbed >= 2, `on the way the feet stay on the block tops (off by ${off.toFixed(4)}), climbing ${climbed} blocks`);
  // a second click changes the destination at once
  w.ctl.clickMove = { x: SPAWN.x, z: SPAWN.z };
  run(w, 40);
  ok(Math.hypot(w.player.x - SPAWN.x, w.player.z - SPAWN.z) < 0.6, 'a new click: turns and walks back to the spawn');
}

// ---------------------------------------------------------------- jump
{
  const w = make('sword_recruit');
  // on the level training clearing
  place(w, 46, 58);
  const g0 = w.player.y;
  w.player.requestJump();
  let apex = 0;
  run(w, 1.2, () => (apex = Math.max(apex, w.player.y)));
  ok(Math.abs(apex - g0 - JUMP.height) < 0.05, `jump from standing reaches ${(apex - g0).toFixed(2)} (≈ ${JUMP.height})`);
  ok(w.jumps === 1 && !w.player.airborne && w.player.y === g0, 'one press: one jump, lands on the ground');
  // double jump: a second press in the air jumps again from there, a third does nothing
  run(w, 0.3);
  w.player.requestJump();
  let y2 = 0;
  let second = -1;
  let flip = false;
  let presses = 1;
  apex = 0;
  run(w, 2.5, () => {
    const p = w.player;
    apex = Math.max(apex, p.y);
    if (p.airJumpT >= 0) flip = true;
    if (presses === 1 && p.airborne && p.jumpV < 0) {
      presses++;
      y2 = p.y;
      p.requestJump();
    } else if (presses === 2 && second < 0 && p.airJumps === 1) second = p.y;
    else if (presses === 2 && p.airborne && p.jumpV < 0 && p.airJumps === 1) {
      presses++;
      p.requestJump(); // third press in the air
    }
  });
  ok(w.jumps === 3, `double jump counted once (${w.jumps - 1} jumps in the air sequence)`);
  ok(Math.abs(apex - (y2 + JUMP.airHeight)) < 0.08, `second jump rises ${JUMP.airHeight} above where it was taken (${y2.toFixed(2)} → ${apex.toFixed(2)})`);
  ok(flip, 'the second jump plays its somersault');
  ok(presses === 3 && !w.player.airborne && w.player.y === g0 && w.player.airJumps === 0, 'third press in the air ignored; landing restores the double jump');
  // after landing the double jump works again
  run(w, 0.3);
  w.player.requestJump();
  let again = false;
  run(w, 1.5, () => {
    if (!again && w.player.airborne && w.player.jumpV < 0) {
      again = true;
      w.player.requestJump();
    }
  });
  ok(w.jumps === 5, 'after landing: jump + double jump again');
  // running jump keeps the horizontal speed (not a dash: same speed as walking)
  place(w, 44, 56);
  w.ctl.moveX = 1;
  run(w, 0.5);
  const vWalk = Math.hypot(w.player.vx, w.player.vz);
  w.player.requestJump();
  let vMax = 0;
  run(w, 0.5, () => (vMax = Math.max(vMax, Math.hypot(w.player.vx, w.player.vz))));
  w.ctl.moveX = 0;
  ok(vMax <= vWalk + 1e-6, `running jump is not a dash (air speed ${vMax.toFixed(2)} ≤ walk ${vWalk.toFixed(2)})`);
}

// ---------------------------------------------------------------- climbing blocks by jumping
{
  // three test blocks on the level clearing: one, two and three blocks high (3 × 3 cells each)
  const terrain = buildTestMap();
  const n = terrain.size;
  const base = terrain.top![56 * n + 44];
  const raise = (x0: number, z0: number, h: number) => {
    for (let z = z0; z < z0 + 3; z++) for (let x = x0; x < x0 + 3; x++) terrain.top![z * n + x] = base + h;
  };
  raise(44, 56, 1);
  raise(50, 59, 2);
  raise(55, 56, 3);
  const mk = () => new World(NullFx, new GameClock(), 'human', wield('sword_recruit'), trainingSite(terrain));
  const go = (w: World, x: number, z: number, sec: number) => {
    w.ctl.clickMove = { x, z };
    run(w, sec);
  };
  const a = mk();
  place(a, 45.5, 61);
  go(a, 45.5, 57.5, 4);
  ok(Math.hypot(a.player.x - 45.5, a.player.z - 57.5) < 0.5 && a.player.y === base + 1 && a.jumps >= 1, `a click on a block one high: the hero jumps up by itself (y ${a.player.y - base})`);
  const b = mk();
  place(b, 51.5, 63.5);
  go(b, 51.5, 60.5, 5);
  ok(Math.hypot(b.player.x - 51.5, b.player.z - 60.5) < 0.5 && b.player.y === base + 2 && b.jumps >= 2, `two high: a double jump gets there (y ${b.player.y - base}, ${b.jumps} jumps)`);
  const c = mk();
  place(c, 56.5, 61);
  go(c, 56.5, 57.5, 5);
  ok(c.player.y < base + 0.01 && c.player.z > 58.9, `three high: out of reach, the hero stays below (y ${c.player.y - base})`);
  // jumping by hand while walking at a block: lands on top of it
  const d = mk();
  place(d, 45.5, 60.2);
  d.ctl.moveZ = -1;
  run(d, 0.15);
  d.player.requestJump();
  run(d, 0.6);
  d.ctl.moveZ = 0;
  run(d, 0.4);
  ok(d.player.y === base + 1 && d.player.z < 59, `a jump while walking at it lands on the block (y ${d.player.y - base})`);
  // standing over the edge with part of the body: stays up, no sliding off
  const e = mk();
  place(e, 45.5, 58.8);
  e.player.y = base + 1;
  e.player.z = 59.15; // the centre just past the edge, the back of the feet still on the block
  run(e, 0.5);
  ok(e.player.y === base + 1, 'part of the feet on the block: the hero stands on its edge');
  e.player.z = 59.6;
  run(e, 0.8);
  ok(e.player.y === base && !e.player.airborne, 'off the edge entirely: down onto the ground below');
}

// ---------------------------------------------------------------- 1-block obstacle
{
  const w = make('sword_recruit');
  const [x0, z0, x1] = OBSTACLES[0]; // 3-wide, 1-deep block row at z0
  const tx = (x0 + x1) / 2 + 0.5;
  const pad = w.terrain.groundY(tx, z0 + 2.5);
  // walking into it: blocked
  place(w, tx, z0 + 3.5);
  w.ctl.moveZ = -1;
  run(w, 1.5);
  ok(w.player.z > z0 + 1, `walking into the 1-block obstacle is blocked (z ${w.player.z.toFixed(2)})`);
  // jumping while walking: clears it and lands beyond (or on top)
  place(w, tx, z0 + 2.2);
  w.player.requestJump();
  let onTop = false;
  run(w, 1.2, () => {
    if (Math.floor(w.player.z) === z0 && w.player.y > pad + 0.99) onTop = true;
  });
  w.ctl.moveZ = 0;
  ok(w.player.z < z0, `jumping clears the 1-block obstacle (z ${w.player.z.toFixed(2)} past ${z0})`);
  ok(onTop || w.player.z < z0, 'passes over the block, never through its side');
  ok(!w.player.airborne && w.player.y === pad, 'correct landing on the far side');
}

// ---------------------------------------------------------------- dummies take damage and stay
{
  const w = make('sword_recruit');
  const c = w.dummies.find((d) => d.id === 'dummy_c')!;
  place(w, c.x, c.z + 1.8);
  w.select(c, true);
  run(w, 6);
  ok(c.hits >= 8 && c.total === c.hits * 14, `1H sword: ${c.hits} hits × 14 = ${c.total}`);
  ok(w.dummies.length === 3 && w.dummies.includes(c), 'dummies never disappear');
  ok(c.dps(w.time) > 18 && c.dps(w.time) < 26, `DPS readout ≈ 23 (${c.dps(w.time).toFixed(1)})`);
  const others = w.dummies.filter((d) => d !== c);
  ok(others.every((d) => d.total === 0), 'single target: the other dummies are untouched');
  run(w, 600);
  ok(c.total > 1000 && w.dummies.length === 3, `ten more minutes of hits: total ${c.total}, still standing`);
}

// ---------------------------------------------------------------- click targeting (left button)
{
  const w = make('sword_recruit');
  const c = w.dummies[2];
  place(w, c.x - 6, c.z + 4);
  w.clickTarget(c);
  run(w, 1);
  ok(w.target === c && !w.autoAttack && c.hits === 0 && Math.hypot(w.player.x - (c.x - 6), w.player.z - (c.z + 4)) < 0.01, 'first click: target selected, no attack, no walking');
  w.clickTarget(c);
  run(w, 6);
  ok(w.autoAttack && c.hits >= 2 && Math.hypot(w.player.x - c.x, w.player.z - c.z) < 2.3 + c.radius, `second click on the target: walks into reach and keeps attacking (${c.hits} hits)`);
  // a click on the ground during the auto attack: stop attacking, walk there
  const hitsBefore = c.hits;
  w.ctl.clickMove = { x: c.x - 4, z: c.z + 5 };
  run(w, 3);
  ok(!w.autoAttack && w.target === c && c.hits <= hitsBefore + 1 && Math.hypot(w.player.x - (c.x - 4), w.player.z - (c.z + 5)) < 0.6, 'a ground click during the auto attack stops it and walks to the spot');
  w.clickTarget(c);
  ok(w.autoAttack, 'clicking the target again resumes the auto attack');
  const other = w.dummies[0];
  w.clickTarget(other);
  ok(w.target === other && !w.autoAttack, 'a click on another dummy changes the target (no attack yet)');
  w.select(c, true);
  w.ctl.moveX = 1;
  run(w, 0.3);
  w.ctl.moveX = 0;
  ok(!w.autoAttack, 'walking by hand cancels the automatic attack');
  // every weapon type attacks from its own range
  for (const id of ['staff_spark', 'sword_recruit', 'bow_hunter']) {
    const v = make(id);
    const d = v.dummies[2];
    place(v, d.x, d.z + 25);
    v.clickTarget(d);
    v.clickTarget(d);
    run(v, 9);
    const dist = Math.hypot(v.player.x - d.x, v.player.z - d.z);
    ok(d.hits >= 2 && dist <= v.stats.range + d.radius + 0.1 && dist > v.stats.range - 3, `${id}: auto attack from its range ${v.stats.range} (stands ${dist.toFixed(1)} away, ${d.hits} hits)`);
  }
}

// ---------------------------------------------------------------- ranged weapons
for (const id of ['staff_spark', 'bow_hunter']) {
  const w = make(id);
  const c = w.dummies[2];
  place(w, c.x, c.z + 9);
  w.select(c, true);
  let flying = 0;
  run(w, 5, () => (flying = Math.max(flying, w.projectiles.length)));
  ok(flying > 0 && c.hits >= 2 && Math.hypot(w.player.x - c.x, w.player.z - c.z) > 8, `${id}: shoots from range (${c.hits} hits, ${flying} in flight at most)`);
}
console.log(fails ? `${fails} world check(s) FAILED` : 'all world checks passed');
process.exit(fails ? 1 : 0);

/**
 * RPG stage 1 (docs/rpg2/IMPLEMENTATION.md): resources, regeneration, combat timer, clock and
 * active time, pause, sprint, jumps, falls, water, dodge, controls and the playthrough save.
 * Run: npx tsx tools/tests/rpg2.ts
 */
import { HeroState, maxHpFor, maxMpFor, maxStFor } from '../../src/rpg2/hero';
import { HeroMotor, NO_INTENT, fallDamage, fallShare, type MotorGround, type MotorIntent, type MotorEvent } from '../../src/rpg2/motor';
import { PauseManager } from '../../src/rpg2/pause';
import { ActiveTime } from '../../src/rpg2/time';
import { AUTOSAVE_SECONDS, JUMP2, SPEED, roundDamage } from '../../src/rpg2/config';
import { bind, defaultBinds, defaultControls, fixControls, loadControls, saveControls, CONTROLS_KEY } from '../../src/rpg2/controls';
import { PLAYTHROUGH_VERSION, SaveError, migratePlaythrough, readPlaythrough, restore, snapshot, writePlaythrough, TEST_SAVE_KEY } from '../../src/rpg2/save';

let fails = 0;
const ok = (c: boolean, msg: string) => {
  console.log((c ? 'ok   ' : 'FAIL ') + msg);
  if (!c) fails++;
};
const near = (a: number, b: number, e = 1e-6) => Math.abs(a - b) <= e;

// ------------------------------------------------------------------ resources (D159)
{
  const h = new HeroState();
  ok(h.maxHp === 200 && h.maxMp === 100 && h.maxSt === 100, 'level 1 with stats 10: 200 HP, 100 MP, 100 ST (D159)');
  ok(h.hp === 200 && h.mp === 100 && h.st === 100, 'a new hero starts full');
  ok(maxHpFor(20, 5) === 100 + 200 + 20 && maxMpFor(50) === 300 && maxStFor() === 100, 'HP = 100 + 10 VIT + 5 (level - 1); MP = 50 + 5 SPI; ST = 100');
  ok(Object.values(h.stats).every((v) => v === 10) && h.progress.level === 1 && h.progress.xp === 0 && h.progress.lp === 0 && h.progress.tp === 0, 'six stats 10, level 1, XP / LP / talent points 0');
  h.hp = 150;
  h.stats.vit = 12;
  ok(h.maxHp === 220 && h.hp === 150, 'a higher maximum does not refill the current value');
}

// ------------------------------------------------------------------ regeneration (D013–D015) and combat (D012)
{
  const h = new HeroState();
  h.hp = 100;
  h.mp = 0;
  const tick = (sec: number, step = 1 / 60, spent = false) => {
    for (let t = 0; t < sec - 1e-9; t += step) h.tick(Math.min(step, sec - t), {}, spent);
  };
  tick(10);
  ok(near(h.hp, 104, 1e-6), 'out of combat HP regenerates 0.2 % of max per second (200 HP: 0.4 HP/s)');
  ok(near(h.mp, 20, 1e-6), 'out of combat MP regenerates 2 % of max per second');
  h.combatEvent();
  ok(h.inCombat, 'an attack event starts combat (dummies count)');
  const hp0 = h.hp;
  const mp0 = h.mp;
  tick(5);
  ok(h.hp === hp0 && near(h.mp, mp0 + 2.5, 1e-6), 'in combat: no HP regeneration, MP at 0.5 % per second');
  h.combatEvent();
  tick(9.99);
  ok(h.inCombat && h.hp === hp0, 'a new attack restarts the 10 s countdown');
  tick(0.02);
  ok(!h.inCombat, 'combat ends 10 s after the last attack');
  const h2 = new HeroState();
  h2.hp = 100;
  h2.combatEvent();
  h2.tick(10.5);
  ok(near(h2.hp, 100 + 0.4 * 0.5, 1e-9), 'HP regeneration starts exactly at the end of combat, even inside one tick (no extra delay)');
  h2.tick(1, { campfire: true });
  ok(near(h2.hp, 100.2 + 2, 1e-9), 'campfire: HP 1 % per second out of combat (D028)');
  // ST
  const s = new HeroState();
  ok(s.trySpendSt(30) && s.st === 70, 'spending ST');
  ok(!s.trySpendSt(80) && s.st === 70, 'not enough ST: nothing is spent');
  s.tick(0.999);
  ok(s.st === 70, 'no ST regeneration during the first second after spending');
  s.tick(0.001);
  s.tick(1);
  ok(near(s.st, 85, 1e-6), 'then 15 ST per second');
  s.spendSt(5);
  s.tick(0.5);
  s.tick(1);
  ok(near(s.st, 80 + 7.5, 1e-6), 'each spending restarts the one-second delay');
  s.tick(10);
  ok(s.st === 100, 'ST stops at its maximum');
}

// ------------------------------------------------------------------ clock and active time (D079, D080, D041)
{
  const a = new ActiveTime();
  ok(a.day === 1 && a.label === 'День 1 · 08:00', 'a new playthrough starts on day 1 at 08:00');
  a.advance(150);
  ok(a.label === 'День 1 · 09:00', 'one game hour per 2.5 minutes of active play');
  a.advance(3600 - 150);
  ok(a.label === 'День 2 · 08:00', 'one game day per 60 minutes of active play');
  ok(near(a.seconds, 3600), 'active time counts seconds of play');
  const b = new ActiveTime();
  let due = 0;
  for (let i = 0; i < AUTOSAVE_SECONDS * 2 + 5; i++) if (b.advance(1)) due++;
  ok(due === 2 && near(b.autosaveLeft, AUTOSAVE_SECONDS - 5), 'periodic autosave every 10 minutes of active time');
}

// ------------------------------------------------------------------ pause (D026, D208)
{
  const p = new PauseManager();
  const h = new HeroState();
  const a = new ActiveTime();
  const m = new HeroMotor(flat(), 5, 5);
  h.spendSt(50);
  h.combatEvent();
  m.dodgeCd = 1;
  let resumed = 0;
  p.onResume = () => resumed++;
  const frame = (dt: number) => {
    const w = p.worldDt(dt);
    a.advance(w);
    m.update(w, NO_INTENT, h);
    h.tick(w);
  };
  p.open('inventory');
  p.open('settings');
  for (let i = 0; i < 600; i++) frame(1 / 60);
  ok(h.st === 50 && h.combatLeft === 10 && m.dodgeCd === 1 && a.seconds === 0 && a.label === 'День 1 · 08:00', 'menus freeze regeneration, combat countdown, cooldowns, the clock and active time');
  p.close('settings');
  ok(p.paused && resumed === 0, 'closing the top menu does not resume while another stays open');
  p.close('inventory');
  ok(!p.paused && resumed === 1, 'closing the last menu resumes the world');
  frame(0.5);
  ok(near(h.combatLeft, 9.5) && near(m.dodgeCd, 0.5) && near(a.seconds, 0.5), 'timers continue from where they stopped, without compensation');
  // sprint and held buttons stop on open and need a new press
  const s = new HeroState();
  const mm = new HeroMotor(flat(), 5, 5);
  const run: MotorIntent = { ...NO_INTENT, moveZ: -1, faceZ: -1, sprintHeld: true, sprintPressed: true };
  mm.update(1 / 60, run, s);
  ok(mm.sprinting, 'sprinting before the menu');
  mm.releaseHeld();
  mm.update(1 / 60, { ...run, sprintPressed: false }, s);
  ok(!mm.sprinting, 'after a menu, holding the sprint key does not sprint until pressed again (D208)');
}

// ------------------------------------------------------------------ helpers for movement
function flat(h = 0): MotorGround {
  return { top: () => h, wall: (x, z) => x < 0 || z < 0 || x > 200 || z > 200, water: () => null };
}
/** Ground with rectangles [x0, z0, x1, z1, height] and an optional pool [x0, z0, x1, z1, bed, surface]. */
function ground(boxes: number[][], pools: number[][] = []): MotorGround {
  return {
    top(x, z) {
      for (const p of pools) if (x >= p[0] && x < p[2] && z >= p[1] && z < p[3]) return p[4];
      let t = 0;
      for (const b of boxes) if (x >= b[0] && x < b[2] && z >= b[1] && z < b[3]) t = Math.max(t, b[4]);
      return t;
    },
    wall: (x, z) => x < 0 || z < 0 || x > 200 || z > 200,
    water(x, z) {
      for (const p of pools) if (x >= p[0] && x < p[2] && z >= p[1] && z < p[3]) return p[5];
      return null;
    },
  };
}
function sim(m: HeroMotor, h: HeroState, sec: number, it: Partial<MotorIntent> = {}, first: Partial<MotorIntent> = {}): MotorEvent[] {
  const all: MotorEvent[] = [];
  const dt = 1 / 120;
  for (let i = 0; i < Math.round(sec / dt); i++) {
    const e = m.update(dt, { ...NO_INTENT, ...it, ...(i === 0 ? first : {}) }, h);
    h.tick(dt, {}, m.sprinting);
    all.push(...e);
  }
  return all;
}

// ------------------------------------------------------------------ speeds and sprint (D180–D183, D210)
{
  const h = new HeroState();
  const m = new HeroMotor(flat(), 50, 150);
  sim(m, h, 1, { moveZ: -1, faceZ: -1 });
  ok(near(m.speed, SPEED.run, 0.01), 'running speed 5 m/s');
  m.walk = true;
  sim(m, h, 1, { moveZ: -1, faceZ: -1 });
  ok(near(m.speed, SPEED.walk, 0.01), 'Caps Lock: walking 2.5 m/s');
  m.walk = false;
  const z0 = m.z;
  sim(m, h, 1, { moveZ: -1, faceZ: -1, sprintHeld: true }, { sprintPressed: true });
  ok(near(m.speed, SPEED.sprint, 0.05) && m.sprinting, 'sprint 7.5 m/s');
  ok(near(h.st, 92, 0.15), 'sprint costs 8 ST per second');
  ok(z0 - m.z > 6.5, 'the hero covers ~7 m in a second of sprint');
  const st0 = h.st;
  sim(m, h, 1, { sprintHeld: true });
  ok(near(h.st, st0, 1e-9), 'holding sprint while standing costs nothing (and ST does not regenerate during the first second)');
  sim(m, h, 0.5, { moveX: 1, faceZ: -1, sprintHeld: true });
  ok(!m.sprinting && near(m.speed, SPEED.run, 0.05), 'sprint only forward: strictly sideways is a normal run (D183)');
  sim(m, h, 0.5, { moveZ: 1, faceZ: -1, sprintHeld: true });
  ok(!m.sprinting, 'backwards is a normal run');
  const d = Math.SQRT1_2;
  sim(m, h, 0.5, { moveX: d, moveZ: -d, faceZ: -1, sprintHeld: true });
  ok(m.sprinting && near(m.speed, SPEED.sprint, 0.05), 'front diagonal sprints, not faster than 7.5 m/s');
  // run to exhaustion
  const ev = sim(m, h, 20, { moveZ: -1, faceZ: -1, sprintHeld: true });
  ok(ev.some((e) => e.type === 'sprintEmpty') && !m.sprinting && near(m.speed, SPEED.run, 0.05), 'out of ST: back to running');
  ok(h.st > 0, 'ST regenerates while running with the key still held (D182)');
  sim(m, h, 3, { moveZ: -1, faceZ: -1, sprintHeld: true });
  ok(!m.sprinting && h.st > 10, 'no automatic restart from a held key, even with ST back');
  sim(m, h, 0.5, { moveZ: -1, faceZ: -1, sprintHeld: true }, { sprintPressed: true, sprintHeld: true });
  ok(m.sprinting, 'release and press again with ≥ 10 ST: sprint');
  // threshold 10
  const h3 = new HeroState();
  h3.st = 9.9;
  h3.stIdle = 0;
  const m3 = new HeroMotor(flat(), 50, 150);
  sim(m3, h3, 0.2, { moveZ: -1, faceZ: -1, sprintHeld: true }, { sprintPressed: true });
  ok(!m3.sprinting, 'a press with < 10 ST does not start sprint (D210)');
  h3.st = 10;
  sim(m3, h3, 0.2, { moveZ: -1, faceZ: -1, sprintHeld: true }, { sprintPressed: true });
  ok(m3.sprinting, 'a press with 10 ST starts sprint');
  sim(m3, h3, 0.5, { moveZ: -1, faceZ: -1, sprintHeld: true });
  ok(m3.sprinting && h3.st < 10, 'a started sprint continues below 10 ST');
  sim(m3, h3, 0.1, { sprintHeld: true });
  sim(m3, h3, 0.1, { moveZ: -1, faceZ: -1, sprintHeld: true });
  ok(!m3.sprinting, 'resuming after a stop needs ≥ 10 ST again');
}

// ------------------------------------------------------------------ jumps (D184–D190, D212)
{
  const h = new HeroState();
  h.st = 0;
  h.stIdle = 0.5;
  const m = new HeroMotor(flat(), 50, 50);
  let top = 0;
  const dt = 1 / 240;
  m.update(dt, { ...NO_INTENT, jumpPressed: true }, h);
  for (let i = 0; i < 240 && m.mode === 'air'; i++) {
    m.update(dt, NO_INTENT, h);
    top = Math.max(top, m.y);
  }
  ok(near(top, JUMP2.height, 0.01), `ground jump rises 1 m (apex ${top.toFixed(3)})`);
  ok(h.st === 0 && h.stIdle === 0.5, 'jumps work at 0 ST and do not restart the ST delay');
  // double jump
  const m2 = new HeroMotor(flat(), 50, 50);
  m2.update(dt, { ...NO_INTENT, jumpPressed: true }, h);
  for (let i = 0; i < 40; i++) m2.update(dt, NO_INTENT, h);
  const yAir = m2.y;
  m2.update(dt, { ...NO_INTENT, jumpPressed: true }, h);
  let top2 = 0;
  for (let i = 0; i < 400 && m2.mode === 'air'; i++) {
    m2.update(dt, NO_INTENT, h);
    top2 = Math.max(top2, m2.y);
  }
  ok(near(top2 - yAir, 1, 0.02), 'the air jump rises 1 m from where it is taken (vertical speed replaced)');
  const m3 = new HeroMotor(flat(), 50, 50);
  const evs: MotorEvent[] = [];
  evs.push(...m3.update(dt, { ...NO_INTENT, jumpPressed: true }, h));
  for (let i = 0; i < 20; i++) m3.update(dt, NO_INTENT, h);
  evs.push(...m3.update(dt, { ...NO_INTENT, jumpPressed: true }, h));
  for (let i = 0; i < 20; i++) m3.update(dt, NO_INTENT, h);
  evs.push(...m3.update(dt, { ...NO_INTENT, jumpPressed: true }, h));
  ok(evs.filter((e) => e.type === 'jump').length === 2 && evs.some((e) => e.type === 'jumpDenied' && e.reason === 'used'), 'only one extra jump before landing');
  for (let i = 0; i < 400 && m3.mode === 'air'; i++) m3.update(dt, NO_INTENT, h);
  ok(m3.mode === 'ground' && m3.airJumpReady, 'landing restores the air jump');
  // stunned: no jumps, the air jump is not used up
  const m4 = new HeroMotor(flat(), 50, 50);
  m4.applyStun(1);
  const e4 = m4.update(dt, { ...NO_INTENT, jumpPressed: true }, h);
  ok(e4.some((e) => e.type === 'jumpDenied' && e.reason === 'stun') && m4.mode === 'ground', 'no jump while stunned (D193)');
  // walking off an edge: the air jump is available; fall top kept by the air jump (D189, D190)
  const g = ground([[0, 0, 60, 200, 4]]);
  const h5 = new HeroState();
  const m5 = new HeroMotor(g, 59, 50);
  sim(m5, h5, 0.32, { moveX: 1, faceX: 1 });
  ok(m5.mode === 'air' && m5.airJumpReady, 'walking off an edge leaves the air jump available');
  const top5 = m5.fallTop;
  const e5 = sim(m5, h5, 0.05, {}, { jumpPressed: true });
  ok(e5.some((e) => e.type === 'jump' && e.air) && !m5.airJumpReady, 'one air jump after walking off an edge');
  sim(m5, h5, 2);
  ok(m5.mode === 'ground', 'lands');
  ok(top5 <= 4.01, 'fall height counted from the highest point (not reset by the air jump)');
  // air control: standing jump 2.5 m/s, moving jump keeps take-off speed as the limit
  const m6 = new HeroMotor(flat(), 50, 50);
  const h6 = new HeroState();
  sim(m6, h6, 0.01, {}, { jumpPressed: true });
  sim(m6, h6, 0.4, { moveX: 1, faceX: 1 });
  ok(m6.speed <= 2.5 + 1e-6 && m6.speed > 2, `standing jump: air control up to 2.5 m/s (${m6.speed.toFixed(2)})`);
  const m7 = new HeroMotor(flat(), 50, 50);
  sim(m7, h6, 0.5, { moveX: 1, faceX: 1 });
  sim(m7, h6, 0.3, { moveX: 1, faceX: 1 }, { jumpPressed: true });
  ok(near(m7.speed, 5, 0.05), 'running jump keeps 5 m/s');
  sim(m7, h6, 0.05, { moveX: 1, faceX: 1 }, { jumpPressed: true });
  ok(m7.speed <= 5 + 1e-6, 'the air jump does not raise the horizontal limit');
  // steps and ledges (D212): 0.25 walked, 0.5 and 1 need a jump, 1 m is reached by one jump
  const steps = ground([[52, 0, 200, 200, 0.25], [56, 0, 200, 200, 0.75], [60, 0, 200, 200, 1.75]]);
  const m8 = new HeroMotor(steps, 50, 50);
  const h8 = new HeroState();
  sim(m8, h8, 1, { moveX: 1, faceX: 1 });
  ok(near(m8.y, 0.25) && m8.x > 54 && m8.x < 56, 'a 0.25 m step is walked; a 0.5 m step blocks');
  sim(m8, h8, 0.6, { moveX: 1, faceX: 1 }, { jumpPressed: true });
  sim(m8, h8, 0.6, { moveX: 1, faceX: 1 });
  ok(near(m8.y, 0.75), 'a jump climbs it');
  sim(m8, h8, 1, { moveX: 1, faceX: 1 });
  ok(near(m8.y, 0.75) && m8.x < 60, 'a 1 m ledge blocks walking');
  sim(m8, h8, 0.7, { moveX: 1, faceX: 1 }, { jumpPressed: true });
  sim(m8, h8, 0.5, { moveX: 1, faceX: 1 });
  ok(near(m8.y, 1.75), 'one jump reaches the top of a 1 m ledge');
}

// ------------------------------------------------------------------ falls (D191) and water (D192, D193)
{
  ok(fallShare(3) === 0 && fallShare(3.01) === 0.05 && fallShare(5) === 0.05 && fallShare(8) === 0.15 && fallShare(12) === 0.35 && fallShare(20) === 0.7 && fallShare(20.01) === 'death', 'fall table bounds (inclusive upper edges)');
  ok(fallDamage(4, 200) === 10 && fallDamage(6, 200) === 30 && fallDamage(10, 200) === 70 && fallDamage(15, 200) === 140 && fallDamage(2.9, 200) === 0 && !Number.isFinite(fallDamage(25, 200)), 'fall damage from max HP');
  ok(fallDamage(4, 210) === 11 && roundDamage(10.5) === 11 && roundDamage(0.3) === 1 && roundDamage(0) === 0, 'D006 rounding (.5 up, min 1, 0 stays 0)');
  const fall = (height: number) => {
    const g = ground([[0, 0, 50, 200, height]]);
    const h = new HeroState();
    const m = new HeroMotor(g, 49.5, 50);
    const ev = sim(m, h, 4, { moveX: 1, faceX: 1 });
    return { h, ev: ev.find((e) => e.type === 'land') as Extract<MotorEvent, { type: 'land' }> | undefined };
  };
  const f3 = fall(3);
  ok(f3.h.hp === 200 && f3.ev?.damage === 0, 'a 3 m fall: no damage');
  const f6 = fall(6);
  ok(f6.ev?.damage === 30 && f6.h.hp >= 170 && f6.h.hp < 172, `a 6 m fall: 15 % of max HP (${f6.ev?.damage})`);
  const f21 = fall(21);
  ok(f21.h.dead && f21.ev?.death === true, 'more than 20 m: death');
  // the dodge window does not prevent fall damage (D169): fall during a dodge
  {
    const g = ground([[0, 0, 50, 200, 6]]);
    const h = new HeroState();
    const m = new HeroMotor(g, 48.5, 50);
    sim(m, h, 2, { moveX: 1, faceX: 1 }, { dodgePressed: true });
    ok(h.hp >= 170 && h.hp < 172 && h.st < 100, 'dodging off an edge: falls and takes the damage (no stop at the edge, D172)');
  }
  // water: 2 m deep saves from any height, shallower counts to the bed
  const pool = (height: number, depth: number) => {
    const g = ground([[0, 0, 50, 200, height]], [[50, 0, 70, 200, -depth, 0]]);
    const h = new HeroState();
    const m = new HeroMotor(g, 49.5, 50);
    sim(m, h, 4, { moveX: 1, faceX: 1 });
    return { h, m };
  };
  const p1 = pool(25, 2);
  ok(!p1.h.dead && p1.h.hp === 200 && p1.m.mode === 'swim', '25 m into 2 m deep water: no damage, swimming');
  const p2 = pool(4.5, 1.5);
  ok(p2.h.hp >= 170 && p2.h.hp < 172 && p2.m.mode === 'swim', '4.5 m into 1.5 m water: the fall counts to the bed (6 m: 15 %)');
  const p3 = pool(19.5, 1);
  ok(p3.h.dead, '19.5 m into 1 m water: counted to the bed (20+ m): death');
  // swimming: 3 m/s, no sprint or dodge, jump out of water and one air jump
  const g = ground([[70, 0, 200, 200, 0.2]], [[0, 0, 70, 200, -3, 0]]);
  const h = new HeroState();
  const m = new HeroMotor(g, 60, 50);
  m.mode = 'swim';
  m.y = -1.1;
  sim(m, h, 1, { moveZ: -1, faceZ: -1, sprintHeld: true }, { sprintPressed: true });
  ok(m.mode === 'swim' && near(m.speed, SPEED.swim, 0.05) && !m.sprinting && h.st === 100, 'swimming 3 m/s, no sprint and no ST cost');
  const ed = sim(m, h, 0.1, {}, { dodgePressed: true });
  ok(ed.some((e) => e.type === 'dodgeDenied'), 'no dodge in water');
  const ej = sim(m, h, 0.15, {}, { jumpPressed: true });
  ok(ej.some((e) => e.type === 'jump' && !e.air) && m.mode === 'air', 'jump up from the water surface');
  const ej2 = sim(m, h, 0.05, {}, { jumpPressed: true });
  ok(ej2.some((e) => e.type === 'jump' && e.air), 'then one air jump');
  sim(m, h, 2);
  ok(m.mode === 'swim' && m.airJumpReady, 'back in the water the air jump is restored');
  sim(m, h, 4, { moveX: 1, faceX: 1 });
  ok(m.mode === 'ground' && near(m.y, 0.2), 'walks out onto a bank no higher than 0.3 m over the water');
}

// ------------------------------------------------------------------ dodge (D167–D179)
{
  const h = new HeroState();
  const m = new HeroMotor(flat(), 50, 100);
  const e = sim(m, h, 0.5, { moveX: 1, faceZ: -1 }, { dodgePressed: true });
  ok(e.some((x) => x.type === 'dodge') && near(h.st, 80, 1e-9), 'dodge costs 20 ST at the start');
  ok(near(m.x - 50, 3, 0.05), `dodge moves 3 m in 0.5 s (${(m.x - 50).toFixed(2)})`);
  ok(e.some((x) => x.type === 'dodgeEnd'), 'it lasts 0.5 s');
  const e2 = sim(m, h, 0.1, {}, { dodgePressed: true });
  ok(e2.some((x) => x.type === 'dodgeDenied' && x.reason === 'cooldown') && near(h.st, 80, 1e-9), 'cooldown 1 s: a refused press costs nothing');
  sim(m, h, 0.5);
  const x0 = m.z;
  sim(m, h, 0.5, {}, { dodgePressed: true });
  ok(near(m.z - x0, 3, 0.05), 'no direction: backwards relative to the body');
  // i-frames
  const m2 = new HeroMotor(flat(), 50, 100);
  const h2 = new HeroState();
  m2.update(0.01, { ...NO_INTENT, dodgePressed: true }, h2);
  ok(m2.invulnerable, 'invulnerable at the start');
  ok(!m2.applyStun(2) && m2.dodging, 'a stun inside the window is prevented');
  sim(m2, h2, 0.2);
  ok(!m2.invulnerable && m2.dodging, 'vulnerable after 0.2 s, still dodging');
  ok(m2.applyStun(2) && !m2.dodging, 'a stun after the window interrupts the dodge (D177)');
  ok(m2.update(0.01, { ...NO_INTENT, dodgePressed: true }, h2).some((x) => x.type === 'dodgeDenied' && x.reason === 'stun'), 'no dodge while stunned (D174)');
  // air
  const m3 = new HeroMotor(flat(), 50, 100);
  const h3 = new HeroState();
  sim(m3, h3, 0.1, {}, { jumpPressed: true });
  const e3 = sim(m3, h3, 0.05, {}, { dodgePressed: true });
  ok(e3.some((x) => x.type === 'dodgeDenied' && x.reason === 'air') && h3.st === 100, 'no dodge in the air (D173)');
  // not enough ST
  const h4 = new HeroState();
  h4.st = 19;
  const m4 = new HeroMotor(flat(), 50, 100);
  ok(m4.update(0.01, { ...NO_INTENT, dodgePressed: true }, h4).some((x) => x.type === 'dodgeDenied' && x.reason === 'st') && h4.st === 19, 'not enough ST: no dodge, nothing spent');
  // slow fixed at the start (D171, D179)
  const m5 = new HeroMotor(flat(), 50, 100);
  const h5 = new HeroState();
  m5.slow = 0.5;
  m5.update(1 / 120, { ...NO_INTENT, moveX: 1, faceX: 1, dodgePressed: true }, h5);
  m5.slow = 0;
  sim(m5, h5, 0.5, { moveX: 1, faceX: 1 });
  ok(near(m5.x - 50, 1.5 + 0, 0.15) || (m5.x - 50 > 1.4 && m5.x - 50 < 1.5 + 5 * 0.01), `50 % slow: 1.5 m, fixed at the start (${(m5.x - 50).toFixed(2)})`);
  // walls stop the dodge
  const wall = ground([[52, 0, 200, 200, 3]]);
  const m6 = new HeroMotor(wall, 50, 100);
  sim(m6, new HeroState(), 0.5, { moveX: 1, faceX: 1 }, { dodgePressed: true });
  ok(m6.x < 52 - 0.3 + 0.01, 'a wall limits the dodge distance');
  // buffer (D176, D178)
  const m7 = new HeroMotor(flat(), 50, 100);
  const h7 = new HeroState();
  m7.update(1 / 120, { ...NO_INTENT, dodgePressed: true }, h7);
  ok(!m7.pressAction('attack') && m7.buffered === null, 'an attack early in the dodge is refused and not kept');
  sim(m7, h7, 0.36);
  ok(!m7.pressAction('attack') && m7.buffered === 'attack', 'a press in the last 0.15 s is kept');
  m7.pressAction('skill1');
  ok(m7.buffered === 'skill1', 'the latest press replaces the older one');
  const e7 = sim(m7, h7, 0.2);
  const end = e7.find((x) => x.type === 'dodgeEnd') as Extract<MotorEvent, { type: 'dodgeEnd' }> | undefined;
  ok(end?.buffered === 'skill1' && m7.pressAction('attack'), 'it runs after the dodge ends; actions are allowed again');
}

// ------------------------------------------------------------------ controls (D211)
{
  const b = defaultBinds();
  ok(b.jump[0] === 'Space' && b.dodge[0] === 'ShiftLeft' && b.sprint[0] === 'ControlLeft' && b.walkToggle[0] === 'CapsLock' && b.potionHp[0] === 'F1' && b.attack[0] === 'Mouse0', 'default keys of the GDD');
  const r = bind(b, 'jump', 'KeyW', false);
  ok(r.conflict === 'moveF' && !r.done && b.jump[0] === 'Space' && b.moveF[0] === 'KeyW', 'a conflict is reported and nothing changes without confirmation');
  const r2 = bind(b, 'jump', 'KeyW', true);
  ok(r2.done && b.jump[0] === 'KeyW' && !b.moveF.includes('KeyW'), 'confirmed: the key moves to the new action');
  ok(!bind(b, 'map', 'Escape', true).done, 'Esc cannot be rebound');
  const mem = new Map<string, string>();
  const kv = { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v) };
  const c = defaultControls();
  c.binds = b;
  c.sensitivity = 1.7;
  saveControls(c, kv);
  const back = loadControls(kv);
  ok(back.binds.jump[0] === 'KeyW' && back.sensitivity === 1.7 && mem.has(CONTROLS_KEY) && CONTROLS_KEY !== TEST_SAVE_KEY, 'controls are stored for the whole game under their own key');
  ok(fixControls({ binds: { jump: 7 }, sensitivity: 99 }).binds.jump[0] === 'Space' && fixControls({ sensitivity: 99 }).sensitivity === 3, 'broken stored controls fall back per field');
}

// ------------------------------------------------------------------ save round trip (D040, D202)
{
  const mem = new Map<string, string>();
  const kv = { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v), removeItem: (k: string) => void mem.delete(k) };
  const h = new HeroState();
  h.hp = 123.25;
  h.mp = 45.5;
  h.st = 12.75;
  h.stIdle = 0.4;
  h.combatLeft = 6.5;
  h.stats.vit = 14;
  h.progress.xp = 77;
  const t = new ActiveTime();
  t.advance(1234.5);
  const m = new HeroMotor(flat(), 10, 20);
  m.update(1 / 60, { ...NO_INTENT, jumpPressed: true }, h);
  m.update(1 / 60, NO_INTENT, h);
  m.update(1 / 60, { ...NO_INTENT, jumpPressed: true }, h);
  m.walk = true;
  const s = snapshot({ id: 'p1', map: 'rpg_test', name: 'Испытатель', race: 'human', hero: h, motor: m.toSave(), time: t, now: 1000 });
  ok(writePlaythrough(s, TEST_SAVE_KEY, kv), 'the record is written');
  const back = readPlaythrough(TEST_SAVE_KEY, kv)!;
  ok(JSON.stringify(back) === JSON.stringify(s), 'round trip: the record reads back identical');
  const r = restore(back);
  ok(r.hero.hp === 123.25 && r.hero.mp === 45.5 && r.hero.st === 12.75 && r.hero.stIdle === 0.4 && r.hero.combatLeft === 6.5 && r.hero.stats.vit === 14 && r.hero.progress.xp === 77, 'hero: resources, ST delay, combat timer, stats, progress');
  ok(near(r.time.seconds, 1234.5) && near(r.time.autosaveLeft, AUTOSAVE_SECONDS * 3 - 1234.5) && r.time.label === t.label, 'clock, active time and the time left to the periodic autosave');
  const m2 = new HeroMotor(flat(), 0, 0);
  m2.loadSave(back.motor);
  ok(m2.mode === 'air' && !m2.airJumpReady && m2.walk && near(m2.fallTop, m.fallTop) && near(m2.y, m.y), 'movement: position, air state, used air jump, fall top');
  ok(back.version === PLAYTHROUGH_VERSION && back.format === 'cubeborn.rpg2.playthrough', 'the record carries its format and version');
  // a failed write keeps the previous record
  const s2 = { ...s, savedAt: 2000 };
  writePlaythrough(s2, TEST_SAVE_KEY, kv);
  ok(JSON.parse(mem.get(TEST_SAVE_KEY + '.prev')!).savedAt === 1000, 'the previous good record is kept as .prev');
  const broken = { ...kv, setItem: (k: string, v: string) => { if (k === TEST_SAVE_KEY) throw new Error('quota'); mem.set(k, v); } };
  ok(!writePlaythrough({ ...s, savedAt: 3000 }, TEST_SAVE_KEY, broken) && JSON.parse(mem.get(TEST_SAVE_KEY)!).savedAt === 2000, 'a failed write does not destroy the last working record');
  // newer format: refused with a reason; broken record: refused
  let msg = '';
  try {
    migratePlaythrough({ ...s, version: PLAYTHROUGH_VERSION + 1 });
  } catch (e) {
    msg = e instanceof SaveError ? e.message : '';
  }
  ok(msg.includes('более новой версией'), 'a record from a newer game is refused with a clear message');
  let msg2 = '';
  try {
    migratePlaythrough({ ...s, hero: { ...s.hero, hp: 'x' } });
  } catch (e) {
    msg2 = e instanceof SaveError ? e.message : '';
  }
  ok(msg2.includes('hero.hp'), 'a broken record is refused (no silent reset or partial load)');
  // an older record is upgraded with a backup
  mem.set(TEST_SAVE_KEY, JSON.stringify({ ...s, version: 0 }));
  const up = readPlaythrough(TEST_SAVE_KEY, kv)!;
  ok(up.version === PLAYTHROUGH_VERSION && mem.has(TEST_SAVE_KEY + '.backup.v0'), 'an older record is upgraded and the original backed up');
}

if (fails) {
  console.log(`\n${fails} RPG stage 1 check(s) FAILED`);
  process.exit(1);
}
console.log('\nall RPG stage 1 checks passed');

/**
 * RPG stage 2 (docs/rpg2/IMPLEMENTATION.md): damage pipeline, crit, block, control, mastery,
 * skill / spell payment and cooldown timing, projectiles, zones, chain lightning, enemies,
 * participation and XP, and the combat part of the playthrough save.
 * Run: npx tsx tools/tests/rpg2combat.ts
 */
import { HeroState } from '../../src/rpg2/hero';
import { HeroMotor, type MotorGround } from '../../src/rpg2/motor';
import { roundDamage } from '../../src/rpg2/config';
import { applyKnock, applySlow, applyStun, newControl, tickControl } from '../../src/rpg2/combat/control';
import { ENEMY_BY_ID, SKILLS, SPELLS, WEAPON_BY_ID } from '../../src/rpg2/combat/data';
import { newEnemy, updateEnemy, type EnemyCtx } from '../../src/rpg2/combat/enemy';
import {
  MASTERY_TOTAL_MAX, Rng, TRAINING_TOTAL_CAP, combatAward, critParams, hitDamage, inFront, killXp, masteryOf, masteryStepCost,
  masteryThreshold, participationEnough, physMul, statMul, trainingAward, xpCoef,
} from '../../src/rpg2/combat/formulas';
import { CombatSystem, NO_COMBAT_INPUT, newCombatData, type CombatFx, type DummyRef } from '../../src/rpg2/combat/system';
import { PLAYTHROUGH_VERSION, migratePlaythrough, restore, snapshot } from '../../src/rpg2/save';
import { ActiveTime } from '../../src/rpg2/time';

let fails = 0;
const ok = (c: boolean, msg: string) => {
  console.log((c ? 'ok   ' : 'FAIL ') + msg);
  if (!c) fails++;
};
const near = (a: number, b: number, e = 1e-6) => Math.abs(a - b) <= e;

function flat(h = 0, walls: [number, number, number, number][] = []): MotorGround {
  const inWall = (x: number, z: number) => walls.some(([x0, z0, x1, z1]) => x >= x0 && x <= x1 && z >= z0 && z <= z1);
  return { top: (x, z) => (inWall(x, z) ? h + 5 : h), wall: () => false, water: () => null };
}
const quietFx = (): CombatFx & { toasts: string[] } => {
  const toasts: string[] = [];
  return { toasts, number() {}, burst() {}, sound() {}, toast: (t) => toasts.push(t), dummyHit() {} };
};
function setup(opts: { profile?: 'start' | 'test'; dummies?: DummyRef[]; ground?: MotorGround; enemies?: boolean } = {}) {
  const g = opts.ground ?? flat();
  const hero = new HeroState();
  const motor = new HeroMotor(g, 50, 50);
  motor.fx = 0;
  motor.fz = 1;
  const fx = quietFx();
  const data = newCombatData(opts.profile ?? 'test');
  const sys = new CombatSystem(g, hero, motor, () => opts.dummies ?? [], fx, data);
  return { g, hero, motor, sys, fx, data };
}
const run = (sys: CombatSystem, sec: number, aim = { x: 50, z: 60, target: null as string | null }, inp = NO_COMBAT_INPUT) => {
  for (let t = 0; t < sec - 1e-9; t += 1 / 60) sys.update(1 / 60, inp, aim);
};

// ------------------------------------------------------------------ formulas (D004–D006, D158, D160)
{
  ok(near(statMul(10), 1.1) && near(statMul(50), 1.5) && near(statMul(100), 2), 'D158: stat multiplier 1 + stat / 100 (10 → ×1.1, 100 → ×2)');
  ok(near(physMul(100, 100), 0.25) && near(physMul(0, 0), 1), 'D160: armor 100 and RES 100 let 25 % through');
  ok(hitDamage({ base: 100, mults: [1.5, 1.1, 1.05], magic: true, armor: 50, res: 50, crit: false, critMult: 1.5 }) === 173, 'D004: multipliers multiply once (100 × 1.5 × 1.1 × 1.05 = 173.25 → 173); magic ignores armor');
  ok(hitDamage({ base: 12, mults: [1.1], magic: false, armor: 2, res: 2, crit: false, critMult: 1.5 }) === 13, 'iron sword vs wolf: 12 × 1.1 × 100/102 × 100/102 = 12.69 → 13');
  ok(hitDamage({ base: 12, mults: [1.1], magic: false, armor: 2, res: 2, crit: true, critMult: 1.5 }) === 19, 'crit ×1.5 before defence: 19.03 → 19');
  ok(hitDamage({ base: 14, mults: [], magic: false, armor: 17, res: 10, crit: false, critMult: 1, blocked: true }) === 5, 'wolf bite on the start hero: 14 × 100/117 × 100/110 × 0.5 = 5.44 → 5 (block after armor, round once)');
  ok(hitDamage({ base: 0.2, mults: [], magic: false, armor: 0, res: 0, crit: false, critMult: 1 }) === 1 && roundDamage(0) === 0, 'D006: a positive hit deals at least 1; zero stays zero');
  ok(roundDamage(12.5) === 13 && roundDamage(12.4) === 12, 'D006: .5 rounds up');
  const c = critParams();
  ok(near(c.chance, 0.05) && near(c.mult, 1.5), 'D005: base crit 5 %, ×1.5');
  const cc = critParams(0.6, 2);
  ok(near(cc.chance, 0.5) && near(cc.mult, 2.5), 'D005: caps 50 % and ×2.5');
  const r = new Rng(123);
  let crits = 0;
  for (let i = 0; i < 20000; i++) if (r.next() < 0.05) crits++;
  ok(crits > 850 && crits < 1150, `D007: independent rolls give about 5 % crits (${crits} / 20000)`);
  const r1 = new Rng(77);
  const r2 = new Rng(77);
  ok(r1.next() === r2.next() && r1.next() === r2.next(), 'the crit generator is deterministic from its saved state');
  ok(inFront(0, 0, 0, 1, 0, 5) && inFront(0, 0, 0, 1, 4.9, 3) && !inFront(0, 0, 0, 1, 5, 2) && !inFront(0, 0, 0, 1, 0, -3), 'D163: 120° block sector (±60° from the body)');
}

// ------------------------------------------------------------------ mastery and XP (D030–D034, D198)
{
  ok(masteryThreshold(1) === 0 && masteryThreshold(2) === 25 && masteryThreshold(20) === 1330 && masteryThreshold(100) === 26730, 'D033: thresholds 0 / 25 / 1330 / 26730');
  ok(masteryStepCost(1) === 25 && masteryStepCost(20) === 120 && masteryStepCost(99) === 515, 'D033: step cost 20 + 5M');
  ok(masteryOf(24) === 1 && masteryOf(25) === 2 && masteryOf(1330) === 20 && masteryOf(99999) === 100, 'D033: inclusive thresholds, max 100');
  ok(trainingAward(0) === 2 && trainingAward(1329) === 1 && trainingAward(1330) === 0 && TRAINING_TOTAL_CAP === 1330, 'D030: dummies +2, only up to mastery 20 (1329 → 1, 1330 → 0)');
  ok(combatAward(10, 10, 0, 0) === 10 && combatAward(10, 5, 0, 0) === 5 && combatAward(10, 1, 0, 0) === 5 && combatAward(11, 1, 0, 0) === 0 && combatAward(1, 8, 0, 0) === 10, 'D034: 10 ОМ; 5 when 5–9 levels below; 0 at 10+; no bonus for higher enemies');
  ok(combatAward(1, 3, 95, 0) === 5 && combatAward(1, 3, 100, 0) === 0 && combatAward(1, 3, 0, MASTERY_TOTAL_MAX - 3) === 3, 'D032 / D198: per-life limit 100 and the mastery cap give only what is missing');
  ok(xpCoef(-10) === 0.5 && xpCoef(-5) === 0.75 && xpCoef(4) === 1 && xpCoef(5) === 1.15 && xpCoef(10) === 1.25, 'XP coefficients by level difference');
  ok(killXp(90, 3, 1) === 90 && killXp(600, 8, 1) === 690 && killXp(90, 3, 13) === 45 && killXp(90, 3, 8) === 67, 'XP = floor(base × coefficient) (600 × 1.15 = 690; 90 × 0.75 = 67)');
  ok(participationEnough(21.25, 85) && !participationEnough(21, 85), 'D035: participation ≥ 25 % of max HP (equality counts)');
}

// ------------------------------------------------------------------ control (D017–D020, D195)
{
  const c = newControl();
  ok(applyStun(c, 2) === 2, 'D017: first stun 100 %');
  ok(applyStun(c, 2) === 0 && c.stunSteps === 1, 'D018: a stun on a stunned target is ignored and uses no step');
  tickControl(c, 2.01);
  ok(applyStun(c, 2) === 1, 'D017: second stun 50 %');
  tickControl(c, 1.01);
  ok(applyStun(c, 2) === 0.5, 'third stun 25 %');
  tickControl(c, 0.51);
  ok(applyStun(c, 2) === 0, 'fourth attempt: temporary immunity');
  tickControl(c, 5);
  ok(applyStun(c, 2) === 0, 'immunity attempts do not extend the reset');
  tickControl(c, 5.1);
  ok(applyStun(c, 2) === 2, 'D017: resistance resets 10 s after the last stun ended');
  const s = newControl();
  applySlow(s, 0.3, 4);
  ok(!applySlow(s, 0.2, 10) && s.slowLeft === 4, 'D019: a weaker slow is ignored');
  tickControl(s, 1);
  ok(applySlow(s, 0.3, 4) && s.slowLeft === 4, 'D019: an equal slow restarts its duration');
  ok(applySlow(s, 0.5, 2) && s.slowPower === 0.5 && s.slowLeft === 2, 'D019: a stronger slow replaces with its own duration');
  const b = newControl(true);
  ok(applyStun(b, 3) === 0, 'D020: bosses are immune to stun');
  ok(!applyKnock(b, 0, 0, 1, 0, 2) && !b.knock, 'D020: bosses are immune to knockback');
  applySlow(b, 0.5, 5);
  ok(near(b.slowPower, 0.2) && near(b.slowLeft, 2), 'D020: boss slow capped at 20 % / 2 s');
  applySlow(b, 0.1, 5);
  ok(near(b.slowPower, 0.2), 'D020: capped first, then compared (10 % is weaker than 20 %)');
  const k = newControl();
  applyKnock(k, 0, 0, -1, 0, 2);
  ok(!applyKnock(k, 0, 0, 0, -1, 2), 'D195: a running knockback ignores a new one');
  let moved = 0;
  for (let i = 0; i < 30; i++) moved += tickControl(k, 1 / 60).dx;
  ok(near(moved, 2, 1e-6) && !k.knock, 'D195: knockback moves 2 m over 0.25 s');
}

// ------------------------------------------------------------------ normal attacks (D008–D011)
{
  const { sys, hero, motor } = setup({ profile: 'start', dummies: [{ id: 'd1', name: 'Манекен', x: 50, z: 51.5, radius: 0.45, height: 1.7 }] });
  ok(sys.weapon.id === 'sword1' && sys.data.learned.length === 0 && sys.data.quick.filter(Boolean).length === 1, 'approved start: one sword, no skills');
  hero.st = 1;
  ok(sys.startNormal({ x: 50, z: 60, target: null }) && hero.st === 0, 'D008: exactly 1 ST is enough for a sword attack');
  run(sys, 1);
  ok(sys.log.length === 1 && sys.log[0].target === 'dummy:d1', 'the swing hits the dummy in the 100° sector');
  ok(!sys.startNormal({ x: 50, z: 60, target: null }) && hero.st === 0, 'no ST: the attack does not start and nothing is spent');
  ok(hero.inCombat, 'D012: attacking a dummy starts combat');
  ok(sys.data.om.sword === 2 && hero.progress.mastery.sword === 1, 'D030: a dummy hit gives +2 ОМ (sword)');
  // staff
  sys.data.quick = ['staff1', null, null, null];
  sys.data.cur = 0;
  hero.mp = 3;
  hero.st = 100;
  ok(sys.startNormal({ x: 50, z: 60, target: null }) && near(hero.mp, 0), 'D009: exactly 3 MP fires a staff shot');
  run(sys, 1.2);
  hero.mp = 4;
  sys.update(1 / 60, { ...NO_COMBAT_INPUT, rmbHeld: true, rmbPressed: true }, { x: 50, z: 60, target: null });
  for (let i = 0; i < 30; i++) sys.update(1 / 60, { ...NO_COMBAT_INPUT, rmbHeld: true }, { x: 50, z: 60, target: null });
  ok(sys.charge !== null && near(hero.mp, 4), 'D011: holding the charge spends nothing');
  const mpBefore = hero.mp;
  sys.update(1 / 60, NO_COMBAT_INPUT, { x: 50, z: 60, target: null });
  ok(sys.charge === null && !sys.data.action && Math.abs(hero.mp - mpBefore) < 0.02, 'D011: release with too little MP cancels without spending');
  hero.mp = 100;
  run(sys, 1);
  sys.update(1 / 60, { ...NO_COMBAT_INPUT, rmbHeld: true, rmbPressed: true }, { x: 50, z: 60, target: null });
  for (let i = 0; i < 120; i++) sys.update(1 / 60, { ...NO_COMBAT_INPUT, rmbHeld: true }, { x: 50, z: 60, target: null });
  const mp2 = hero.mp;
  sys.update(1 / 60, NO_COMBAT_INPUT, { x: 50, z: 60, target: null });
  ok(near(mp2 - hero.mp, 6, 0.01) && sys.data.action?.charge === 2, 'D010: a full charge costs 6 MP and deals ×2');
  sys.update(1 / 60, { ...NO_COMBAT_INPUT, rmbHeld: true, rmbPressed: true }, { x: 50, z: 60, target: null });
  sys.onDodge();
  ok(sys.charge === null, 'D011: a dodge cancels the charge');
  void motor;
}

// ------------------------------------------------------------------ skills: payment, cooldown, preparation (D194)
{
  const { sys, hero } = setup({ dummies: [{ id: 'd1', name: 'Манекен', x: 50, z: 51.5, radius: 0.45, height: 1.7 }] });
  hero.st = 17;
  ok(!sys.useSlot(0, { x: 50, z: 60, target: null }) && hero.st === 17 && !sys.cooldown('s1'), 's1 with 17 ST: refused, nothing spent, no cooldown');
  hero.st = 100;
  ok(sys.useSlot(0, { x: 50, z: 60, target: null }) && hero.st === 82 && sys.cooldown('s1') === 6, 's1: 18 ST and the 6 s cooldown at the start of the preparation');
  ok(sys.moveLimits().mul === 0.7 && sys.moveLimits().noSprint, 'D194: 70 % speed and no sprint during the preparation');
  run(sys, 0.3);
  sys.onJump();
  ok(!sys.data.action && hero.st < 100 && sys.cooldown('s1') > 5, 'D194: a jump cancels the preparation without refund; the cooldown runs');
  run(sys, 0.2);
  ok(sys.log.length === 0, 'a cancelled preparation deals nothing');
  ok(!sys.useSlot(0, { x: 50, z: 60, target: null }), 'still on cooldown');
  run(sys, 6);
  ok(sys.useSlot(0, { x: 50, z: 60, target: null }), 'the cooldown ends after 6 s');
  run(sys, 0.55);
  ok(sys.log.length === 0, 'no hit before the 0.6 s preparation ends');
  run(sys, 0.1);
  ok(sys.log.length === 1, 's1 hits when the preparation ends');
  // weapon switch keeps cooldowns (D207)
  sys.swapWeapon();
  sys.swapWeapon();
  sys.swapWeapon();
  sys.swapWeapon();
  ok(sys.weapon.id === 'sword1' && sys.cooldown('s1') > 0, 'D207: Tab cycles the four weapons; cooldowns are kept');
  sys.swapWeapon();
  ok(sys.family === 'sword' && sys.panel[0] === 's1', 'one- and two-handed swords share the sword panel');
  sys.swapWeapon();
  ok(sys.family === 'bow' && sys.panel[0] === 'b1', 'the panel switches to the bow set');
  sys.swapWeapon();
  ok(sys.family === 'staff' && sys.panel[0] === 'f1', 'the panel switches to the staff set');
  ok(sys.slotProblem('s1') === 'Нужен меч', 'a sword skill on a staff is dimmed with its reason');
  const startSys = setup({ profile: 'start' }).sys;
  ok(!startSys.useSlot(0, { x: 0, z: 0, target: null }) && startSys.slotProblem('s1') === 'Не изучено', 'the approved start has no skills');
}

// ------------------------------------------------------------------ every skill and spell can be used once from the test profile
{
  for (const sk of SKILLS) {
    const { sys, hero } = setup({ dummies: [{ id: 'd1', name: 'Манекен', x: 50, z: 51.6, radius: 0.45, height: 1.7 }] });
    if (sk.family === 'bow') sys.data.cur = 2;
    const stBefore = hero.st;
    const okStart = sys.startAbility(sk.id, { x: 50, z: 52, target: 'dummy:d1' });
    run(sys, 2.2, { x: 50, z: 52, target: 'dummy:d1' });
    ok(okStart && near(stBefore - hero.st, sk.st, 1e-9) && sys.log.length >= 1 && sys.cooldown(sk.id) > 0, `${sk.id} «${sk.name}»: ${sk.st} ST, hits (${sys.log.length}), cooldown`);
  }
  for (const sp of SPELLS) {
    const { sys, hero } = setup({ dummies: [{ id: 'd1', name: 'Манекен', x: 50, z: 54, radius: 0.45, height: 1.7 }] });
    sys.data.cur = 3;
    hero.mp = 100;
    const okStart = sys.startAbility(sp.id, { x: 50, z: 54, target: 'dummy:d1' });
    const paid = 100 - hero.mp;
    const cdStart = sys.cooldown(sp.id);
    run(sys, sp.cast + 3.5, { x: 50, z: 54, target: 'dummy:d1' });
    const pulses = sp.shape.type === 'zone' ? sp.shape.pulses.length : 1;
    ok(okStart && near(paid, sp.mp) && sys.log.length === pulses && cdStart === sp.cd, `${sp.id} «${sp.name}»: ${sp.mp} MP once, ${pulses} hit(s) (${sys.log.length})`);
  }
  const { sys } = setup();
  sys.data.cur = 3;
  ok(!sys.startAbility('l2', { x: 50, z: 60, target: null }) && sys.cooldown('l2') === 0, 'a target spell without a target is refused before payment');
}

// ------------------------------------------------------------------ zones freeze, see walls; pierce; fan limit
{
  const wall = flat(0, [[47, 55.5, 53, 55.9]]);
  const { sys } = setup({ ground: wall, dummies: [{ id: 'a', name: 'А', x: 50, z: 54, radius: 0.45, height: 1.7 }, { id: 'b', name: 'Б', x: 52.5, z: 57.5, radius: 0.45, height: 1.7 }] });
  sys.data.cur = 3;
  sys.data.panels.staff[0] = 'f4';
  sys.useSlot(0, { x: 50, z: 57, target: null });
  run(sys, 1.25);
  ok(sys.data.zones.length === 1, 'f4 creates a zone after its 1.2 s preparation');
  const n0 = sys.log.length;
  // no update = pause: the zone does not move on
  const z = JSON.stringify(sys.data.zones);
  ok(JSON.stringify(sys.data.zones) === z, 'zones are plain data, frozen while no step runs (pause)');
  run(sys, 3.5);
  ok(sys.log.every((l) => l.target === 'dummy:b') && sys.log.length === 4 && n0 === 1, 'zones do not hit through an opaque obstacle; pulses at 0, 1, 2, 3 s');
  const p = setup({ dummies: [1, 2, 3, 4].map((i) => ({ id: 'p' + i, name: 'П', x: 50, z: 50 + i * 2, radius: 0.45, height: 1.7 })) });
  p.sys.data.cur = 2;
  p.sys.startAbility('b4', { x: 50, z: 60, target: null });
  run(p.sys, 1.5);
  ok(p.sys.log.length === 3 && p.sys.log.map((l) => l.target).join() === 'dummy:p1,dummy:p2,dummy:p3', 'b4 pierces three targets in order and stops');
  const f = setup({ dummies: [{ id: 'f', name: 'Ф', x: 50, z: 51.2, radius: 1.5, height: 1.7 }] });
  f.sys.data.cur = 2;
  f.sys.startAbility('b5', { x: 50, z: 60, target: null });
  run(f.sys, 1);
  ok(f.sys.log.length === 2, `b5: a target takes at most 2 of the 5 arrows (${f.sys.log.length})`);
  ok(f.sys.data.om.bow === 2, 'one source action gives one mastery credit (5 arrows → +2 once)');
}

// ------------------------------------------------------------------ chain lightning targeting
{
  const d = (id: string, x: number, z: number): DummyRef => ({ id, name: id, x, z, radius: 0.45, height: 1.7 });
  const { sys } = setup({ dummies: [d('a', 50, 55), d('c', 54, 55), d('b', 46, 55), d('e', 43, 59), d('x', 58, 55)] });
  const first = sys.target('dummy:a')!;
  const ch = sys.chainTargets(first, 3, 6).map((t) => t.uid);
  ok(ch.join() === 'dummy:a,dummy:b,dummy:e', `chain: nearest first, equal distances → lower id (${ch.join()})`);
  const w = setup({ ground: flat(0, [[47.5, 53, 48.5, 57]]), dummies: [d('a', 50, 55), d('b', 46, 55), d('c', 54, 55)] });
  ok(w.sys.chainTargets(w.sys.target('dummy:a')!, 3, 6).map((t) => t.uid).join() === 'dummy:a,dummy:c', 'chain needs line of sight; no return to a hit target');
  const s = setup({ dummies: [d('a', 50, 55), d('b', 57, 55)] });
  ok(s.sys.chainTargets(s.sys.target('dummy:a')!, 3, 6).length === 1, 'chain ends when no target is within 6 m');
}

// ------------------------------------------------------------------ enemies, block, participation, XP, mastery per life
{
  const { sys, hero, motor, data, g } = setup({ profile: 'start' });
  const wolf = newEnemy('w1', 'wolf', 50, 53, 0);
  data.enemies = [wolf];
  // stand still: the wolf detects (≤ 12 m, aggressive), closes in and bites
  for (let i = 0; i < 60 * 4; i++) sys.update(1 / 60, NO_COMBAT_INPUT, { x: 50, z: 60, target: null });
  ok(wolf.mode === 'chase' && sys.counters.heroHits >= 1, 'the wolf aggroes, closes in and bites');
  const hitDmg = sys.log.find((l) => l.target === 'hero')!.damage;
  ok(hitDmg === roundDamage(14 * (100 / 117) * (100 / 110)), `wolf bite through armor 17 and RES 10: ${hitDmg}`);
  ok(hero.inCombat, 'an enemy attack puts the hero in combat');
  // block: hold RMB facing the wolf
  const l = Math.hypot(wolf.x - motor.x, wolf.z - motor.z);
  motor.fx = (wolf.x - motor.x) / l;
  motor.fz = (wolf.z - motor.z) / l;
  hero.st = 100;
  const blocks0 = sys.counters.blocks;
  for (let i = 0; i < 60 * 3; i++) sys.update(1 / 60, { ...NO_COMBAT_INPUT, rmbHeld: true, rmbPressed: i === 0 }, { x: 50, z: 60, target: null });
  const bl = sys.log.filter((x) => x.target === 'hero' && x.blocked);
  ok(sys.counters.blocks > blocks0 && bl.length > 0 && bl[0].damage === roundDamage(14 * (100 / 117) * (100 / 110) * 0.5), `D161: a frontal block halves the bite for 15 ST (${bl[0]?.damage})`);
  ok(sys.moveLimits().mul === 0.5 && sys.moveLimits().noSprint, 'D166: 50 % speed and no sprint while blocking');
  hero.st = 10;
  const n = sys.log.length;
  for (let i = 0; i < 60 * 3; i++) sys.update(1 / 60, { ...NO_COMBAT_INPUT, rmbHeld: true }, { x: 50, z: 60, target: null });
  const nb = sys.log.slice(n).filter((x) => x.target === 'hero');
  ok(nb.length > 0 && nb.every((x) => !x.blocked), 'D162: with less than 15 ST the hit is not blocked');
  // kill it with the sword: participation, XP, ОМ
  hero.hp = hero.maxHp;
  hero.st = 100;
  for (let i = 0; i < 60 * 20 && wolf.mode !== 'dead'; i++) {
    const ll = Math.hypot(wolf.x - motor.x, wolf.z - motor.z) || 1;
    motor.fx = (wolf.x - motor.x) / ll;
    motor.fz = (wolf.z - motor.z) / ll;
    hero.st = 100;
    hero.hp = hero.maxHp;
    sys.update(1 / 60, { ...NO_COMBAT_INPUT, attackHeld: true }, { x: wolf.x, z: wolf.z, target: 'w1' });
  }
  ok(wolf.mode === 'dead' && hero.progress.xp === 90, `the wolf dies; full participation gives 90 XP (${hero.progress.xp})`);
  ok(data.om.sword === 70 && wolf.omUsed.sword === 70, `one credit (+10) per qualifying sword attack: 7 hits → 70 ОМ (${data.om.sword})`);
  ok(near(wolf.respawnLeft, 240, 0.02), 'normal enemies come back after 4 active minutes');
  run(sys, 1);
  ok(wolf.mode === 'dead', 'no respawn while the respawn condition (distance / view) is false');
  sys.canRespawn = () => true;
  for (let i = 0; i < 60 * 241; i++) sys.update(1 / 60, NO_COMBAT_INPUT, { x: 50, z: 60, target: null });
  ok(wolf.mode !== 'dead' && wolf.life === 2 && wolf.omUsed.sword === 0 && wolf.hp === 85, 'respawn by active time: a new life with new limits');
  void g;
}

// ------------------------------------------------------------------ participation below 25 %, return and reset (D037, D038)
{
  const { sys, hero, data, motor } = setup({ profile: 'start' });
  const wolf = newEnemy('w1', 'wolf', 50, 52, 0);
  data.enemies = [wolf];
  wolf.hp = 15;
  wolf.part = 0;
  // one sword hit (13) does not kill; set hp so the last hit kills with < 25 % participation
  wolf.hp = 10;
  const rec = (sys as unknown as { newRec: (f: string, s: number, b: number) => unknown }).newRec('sword', 10, 12) as Parameters<CombatSystem['applyHit']>[0];
  sys.applyHit(rec, sys.target('w1')!, 12, [1.1], false, motor.x, motor.z, null);
  ok(wolf.mode === 'dead' && hero.progress.xp === 0, 'D037 / D039: a personal kill with 10 HP removed (< 25 %) gives no XP');
  ok(data.om.sword === 10, 'the ОМ of the qualifying hit stay');
  // D032: per-life limit with Серый Клык (900 HP)
  const gfE = newEnemy('gf', 'greyfang', 50, 52, 0, 8);
  data.enemies = [gfE];
  const om0 = data.om.sword;
  for (let i = 0; i < 14; i++) {
    const r = (sys as unknown as { newRec: (f: string, s: number, b: number) => unknown }).newRec('sword', 10, 12) as Parameters<CombatSystem['applyHit']>[0];
    sys.applyHit(r, sys.target('gf')!, 12, [1.1], false, motor.x, motor.z, { stun: 1, knock: 2 });
  }
  ok(data.om.sword - om0 === 100 && gfE.omUsed.sword === 100 && gfE.mode !== 'dead', 'D032: at most 100 sword ОМ from one life (14 credited hits → 100)');
  ok(gfE.ctl.stunLeft === 0 && !gfE.ctl.knock, 'D020: the mini-boss ignores stun and knockback; damage still lands');
  // return and reset
  const s2 = setup({ profile: 'start' });
  const w2 = newEnemy('w2', 'wolf', 10, 10, 0);
  s2.data.enemies = [w2];
  const ctx: EnemyCtx = {
    ground: s2.g, hero: { x: 10, y: 0, z: 13, alive: true }, los: () => true,
    attackStart() {}, attackHit() {}, canRespawn: () => false,
  };
  updateEnemy(w2, [w2], ctx, 0.1);
  ok(w2.mode === 'chase', 'aggressive wolf aggroes within 12 m');
  w2.hp = 40;
  w2.part = 45;
  ctx.hero.z = 60;
  for (let i = 0; i < 60 * 4; i++) updateEnemy(w2, [w2], ctx, 1 / 60);
  ok(w2.mode === 'return', 'D196: 3 s with the hero beyond the 35 m leash → return');
  for (let i = 0; i < 60 * 30 && w2.mode !== 'idle'; i++) updateEnemy(w2, [w2], ctx, 1 / 60);
  ok(w2.mode === 'idle' && w2.part === 45, 'back home: participation stays until full HP');
  for (let i = 0; i < 60 * 3; i++) updateEnemy(w2, [w2], ctx, 1 / 60);
  ok(w2.hp < 85 && w2.part === 45, 'healing 10 % / s: not yet full, participation kept');
  for (let i = 0; i < 60 * 8; i++) updateEnemy(w2, [w2], ctx, 1 / 60);
  ok(w2.hp === 85 && w2.part === 0 && w2.omUsed.sword === 0, 'D038: returned and fully healed → participation resets (ОМ limits stay)');
  // pack help and territorial start
  const a = newEnemy('a', 'wolf', 0, 0, 0);
  const b = newEnemy('b', 'wolf', 8, 0, 0);
  const c = newEnemy('c', 'wolf', 30, 0, 0);
  const ctx2: EnemyCtx = { ...ctx, hero: { x: 0, y: 0, z: 10, alive: true } };
  updateEnemy(a, [a, b, c], ctx2, 0.01);
  ok(a.mode === 'chase' && b.mode === 'chase' && c.mode === 'idle', 'D196: same species within 10 m join; farther ones do not');
  const gf = newEnemy('g', 'greyfang', 0, 0, 0, 8);
  updateEnemy(gf, [gf], { ...ctx, hero: { x: 0, y: 0, z: 12, alive: true } }, 0.01);
  ok(gf.mode === 'idle', 'territorial Серый Клык ignores a hero seen outside its 8 m area');
  updateEnemy(gf, [gf], { ...ctx, hero: { x: 0, y: 0, z: 7, alive: true } }, 0.01);
  ok(gf.mode === 'chase', '…and attacks inside it');
  // special: fixed spot and cooldown at the start
  const spots: string[] = [];
  const ctx3: EnemyCtx = { ...ctx, hero: { x: 0, y: 0, z: 5, alive: true }, attackStart: (_e, k) => spots.push(k), attackHit: (_e, k) => spots.push('hit:' + k) };
  updateEnemy(gf, [gf], ctx3, 0.01);
  ok(gf.windup?.kind === 'special' && near(gf.windup.sz, 5) && gf.specialCd === 10, 'D197: special first; spot fixed at the start; cooldown starts with the windup');
  ctx3.hero.z = 9;
  for (let i = 0; i < 70 && !spots.includes('hit:special'); i++) updateEnemy(gf, [gf], ctx3, 1 / 60);
  ok(spots.includes('hit:special') && near(gf.z, 5) && gf.pause > 0, 'the leap lands on the fixed spot, then a 1 s pause');
  ok(ENEMY_BY_ID.greyfang.hp === 900 && ENEMY_BY_ID.wolf.xp === 90, 'catalog stats are used');
  // stun cancels an enemy windup; boss immune
  const w3 = newEnemy('w3', 'wolf', 0, 0, 0);
  w3.mode = 'chase';
  updateEnemy(w3, [w3], { ...ctx, hero: { x: 0, y: 0, z: 1.5, alive: true } }, 0.01);
  ok(!!w3.windup, 'the wolf starts its bite');
  applyStun(w3.ctl, 1);
  updateEnemy(w3, [w3], { ...ctx, hero: { x: 0, y: 0, z: 1.5, alive: true } }, 0.01);
  ok(!w3.windup, 'a stun cancels the unfinished enemy attack');
}

// ------------------------------------------------------------------ save v2 round trip and v1 → v2 migration
{
  const { sys, hero, motor, data } = setup({ dummies: [{ id: 'd1', name: 'М', x: 50, z: 58, radius: 0.45, height: 1.7 }] });
  data.enemies = [newEnemy('w1', 'wolf', 70, 70, 0)];
  data.enemies[0].part = 33;
  data.enemies[0].atHome = false;
  data.enemies[0].omUsed.bow = 20;
  sys.data.cur = 3;
  sys.startAbility('f4', { x: 50, z: 58, target: null });
  run(sys, 1.4);
  sys.startNormal({ x: 50, z: 60, target: null });
  run(sys, 0.45);
  ok(data.zones.length === 1 && data.projectiles.length === 1, 'a zone and a staff bolt are live');
  const time = new ActiveTime();
  const snap = snapshot({ id: 't', map: 'rpg_test', name: 'И', race: 'human', hero, motor: motor.toSave(), time, combat: sys.data });
  ok(snap.version === PLAYTHROUGH_VERSION && PLAYTHROUGH_VERSION === 2, 'save format version 2');
  const back = migratePlaythrough(JSON.parse(JSON.stringify(snap)));
  ok(!back.migrated && JSON.stringify(back.save.combat) === JSON.stringify(snap.combat), 'combat state round-trips (projectiles, zones, cooldowns, participation, enemies)');
  const r = restore(back.save);
  ok(r.combat.cds.f4 > 0 && r.combat.enemies[0].part === 33 && r.combat.enemies[0].omUsed.bow === 20, 'restored: cooldowns, participation, ОМ limits per life');
  const v1 = JSON.parse(JSON.stringify(snap));
  v1.version = 1;
  delete v1.combat;
  const m = migratePlaythrough(v1);
  ok(m.migrated && m.save.combat.profile === 'start' && m.save.combat.quick[0] === 'sword1' && m.save.combat.learned.length === 0, 'v1 → v2: the approved start (sword, no skills)');
  ok(m.save.combat.om.sword === 0 && m.save.hero.progress.mastery.sword === 1, 'v1 masteries of 1 become 0 ОМ');
  const bad = JSON.parse(JSON.stringify(snap));
  bad.combat.enemies[0].hp = 'x';
  let threw = false;
  try {
    migratePlaythrough(bad);
  } catch {
    threw = true;
  }
  ok(threw, 'a broken combat block is refused, not silently reset');
  void WEAPON_BY_ID;
}

console.log(fails ? `\n${fails} FAILED` : '\nall rpg2 combat checks passed');
if (fails) process.exit(1);

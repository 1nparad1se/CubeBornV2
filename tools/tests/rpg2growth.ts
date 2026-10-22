/**
 * RPG stage 3 (docs/rpg2/IMPLEMENTATION.md): XP curve and levels, stat costs at mentors, learning
 * skills / circles / spells, three-tier modifications, talents and their resets, equipment
 * requirements, rarity armor, affixes, legendary effects, upgrades and the v3 save.
 * Run: npx tsx tools/tests/rpg2growth.ts
 */
import { HeroState } from '../../src/rpg2/hero';
import { HeroMotor, type MotorGround } from '../../src/rpg2/motor';
import { masteryThreshold, xpCoef, killXp } from '../../src/rpg2/combat/formulas';
import { newCombatData } from '../../src/rpg2/combat/system';
import { MAX_LEVEL, XP_CAP, addXp, levelForXp, tpForLevel, xpForLevel, xpStep } from '../../src/rpg2/growth/levels';
import { TALENTS, talentProblem, talentResetCost } from '../../src/rpg2/growth/talents';
import { ARMORS, RARITY, TEMPLATE_COUNT, itemArmor, makeItem, reqProblem, weaponBonuses } from '../../src/rpg2/growth/items';
import {
  CIRCLES, abilityMods, addItem, buyModTier, chooseMod, combatBonuses, equip, learnSkill, learnSpell, learnTalent, modResetCost, newGrowth,
  openCircle, resetMods, resetTalents, statCost, totalArmor, trainStat, unequip, type LearnCtx,
} from '../../src/rpg2/growth/growth';
import { PLAYTHROUGH_VERSION, migratePlaythrough, restore, snapshot } from '../../src/rpg2/save';
import { ActiveTime } from '../../src/rpg2/time';

let fails = 0;
const ok = (c: boolean, msg: string) => {
  console.log((c ? 'ok   ' : 'FAIL ') + msg);
  if (!c) fails++;
};
const near = (a: number, b: number, e = 1e-9) => Math.abs(a - b) <= e;

function ctx(): LearnCtx {
  const hero = new HeroState();
  const combat = newCombatData('start');
  return { g: newGrowth(), hero, learned: combat.learned, om: combat.om, inCombat: false };
}

// ---------------------------------------------------------------- levels
{
  ok(xpStep(1) === 320 && xpStep(59) === 75720, 'XP step 200 + 100L + 20L²');
  ok(xpForLevel(2) === 320 && XP_CAP === 1_593_000, 'total XP to level 60 is 1 593 000');
  ok(levelForXp(319) === 1 && levelForXp(320) === 2 && levelForXp(XP_CAP) === MAX_LEVEL, 'level for XP at the boundaries');
  ok(tpForLevel(4) === 0 && tpForLevel(5) === 1 && tpForLevel(60) === 12, 'talent points at 5, 10, …, 60 (12 in all)');
  const h = new HeroState();
  h.hp = 10;
  const up = addXp(h.progress, xpForLevel(11));
  ok(up === 10 && h.progress.level === 11 && h.progress.lp === 100 && h.progress.tp === 2, 'several levels at once: +10 LP each, talent points at 5 and 10');
  ok(h.hp === 10, 'D119: a level-up does not refill HP');
  addXp(h.progress, 10_000_000);
  ok(h.progress.level === 60 && h.progress.xp === XP_CAP && h.progress.lp === 590 && h.progress.tp === 12, 'XP capped at level 60');
  ok(addXp(h.progress, 500) === 0 && h.progress.xp === XP_CAP, 'no XP above the cap');
  ok(xpCoef(-10) === 0.5 && xpCoef(0) === 1 && xpCoef(10) === 1.25 && killXp(90, 5, 1) === 90 && killXp(90, 10, 1) === 103, 'level difference coefficient of kill XP');
}

// ---------------------------------------------------------------- stats at mentors
{
  ok(statCost(10).lp === 1 && statCost(24).gold === 20 && statCost(25).lp === 2 && statCost(49).gold === 150, 'stat cost bands 10–24 / 25–49');
  ok(statCost(50).lp === 3 && statCost(75).gold === 4000 && statCost(100).lp === 5 && statCost(100).gold === 10000, 'stat cost bands 50+ / 75+ / 100+');
  const c = ctx();
  ok(trainStat(c, 'arden', 'str') === 'Нужно 1 LP', 'no LP: refused');
  c.hero.progress.lp = 5;
  c.g.gold = 25;
  ok(trainStat(c, 'mira', 'str') !== null, 'Мира does not teach STR (D205)');
  ok(trainStat(c, 'arden', 'str') === null && c.hero.stats.str === 11 && c.hero.progress.lp === 4 && c.g.gold === 5, 'one point for 1 LP and 20 gold');
  ok(trainStat(c, 'arden', 'str') !== null && c.hero.stats.str === 11, 'not enough gold: refused, nothing paid');
  c.g.gold = 1000;
  c.inCombat = true;
  ok(trainStat(c, 'hira', 'dex') === 'Только вне боя', 'no training in combat');
  c.inCombat = false;
  const mp0 = c.hero.mp;
  ok(trainStat(c, 'mira', 'spi') === null && c.hero.mp === mp0, 'D120: SPI raises only the maximum');
}

// ---------------------------------------------------------------- skills, circles, spells, mods
{
  const c = ctx();
  c.hero.progress.lp = 1000;
  c.g.gold = 100_000;
  ok(learnSkill(c, 'hira', 's1') !== null, 'sword skills come from Арден');
  ok(learnSkill(c, 'arden', 's1') === null && c.learned.includes('s1') && c.hero.progress.lp === 997 && c.g.gold === 99_925, 's1 learned for 3 LP and 75 gold');
  ok(learnSkill(c, 'arden', 's1') === 'Уже изучено' && c.g.gold === 99_925, 'no repeat purchase');
  ok(learnSkill(c, 'arden', 's2')!.startsWith('Нужно STR'), 'attribute requirement checked');
  ok(openCircle(c, 'mira', 2) === 'Сначала предыдущий круг', 'circles open in order');
  ok(openCircle(c, 'arden', 1) === 'Круги открывает Мира', 'circles come from Мира');
  ok(openCircle(c, 'mira', 1) === null && c.g.circles === 1 && openCircle(c, 'mira', 1) === 'Уже открыт', 'circle I opened once (INT 10, mastery 1)');
  ok(openCircle(c, 'mira', 2) === 'Нужно INT 25', 'circle II needs INT 25');
  ok(learnSpell(c, 'mira', 'f1') === null || learnSpell(c, 'mira', 'f1') === 'Уже изучено', 'a circle I spell can be learned');
  ok(learnSpell(c, 'mira', 'f4')!.startsWith('Нужен открытый круг') || c.learned.includes('f4'), 'a higher circle spell needs its circle');
  ok(CIRCLES.length === 5 && CIRCLES[4].int === 85, 'five circles');
  // mods on s1
  ok(buyModTier(c, 'arden', 's1', 1)!.includes('мастерство'), 'tier I needs mastery 20');
  c.om.sword = masteryThreshold(80);
  ok(buyModTier(c, 'arden', 's1', 2) === 'Сначала предыдущая ступень', 'tiers in order');
  const lp = c.hero.progress.lp;
  ok(buyModTier(c, 'arden', 's1', 1) === null && c.hero.progress.lp === lp - 2, 'tier I paid once (2 LP, 100 gold)');
  ok(buyModTier(c, 'arden', 's1', 1) === 'Ступень уже оплачена', 'no repeat tier purchase');
  ok(buyModTier(c, 'arden', 's1', 2)!.startsWith('Сначала выберите'), 'tier II needs a tier I variant chosen');
  ok(chooseMod(c.g, 's1', 1, 0, true) === 'Только вне боя', 'variants chosen out of combat');
  ok(chooseMod(c.g, 's1', 1, 0, false) === null && chooseMod(c.g, 's1', 1, 1, false) !== null, 'D059: a variant is permanent');
  ok(buyModTier(c, 'arden', 's1', 2) === null && chooseMod(c.g, 's1', 2, 0, false) === null, 'tier II bought and chosen');
  const m = abilityMods(c.g, 's1');
  ok(near(m.dmg, 1.1) && near(m.cd, 0.85) && m.cost === 1, 'mod multipliers: damage ×1.10, cooldown ×0.85');
  const gold = c.g.gold;
  ok(resetMods(c, 'arden', 's1') === null && c.g.gold === gold - modResetCost(1) && c.g.mods.s1.paid === 2 && c.g.mods.s1.chosen.every((x) => x === null), 'D058: reset 50 + 10 × level, paid tiers kept');
}

// ---------------------------------------------------------------- talents
{
  ok(TALENTS.length === 18, '3 trees × 2 branches × 3 tiers');
  ok(talentProblem('p_a1', [], 4, 1, false) === 'Нужен уровень 5', 'tier I needs level 5');
  ok(talentProblem('p_a2', ['p_a1'], 20, 1, false)!.startsWith('Нужно 2 ОТ'), 'tier II needs 2 points in the tree');
  ok(talentProblem('p_a2', ['p_b1', 'p_b2'], 20, 1, false) === 'Нужен талант «Твёрдая рука»', 'tier II needs the previous node of the branch');
  ok(talentProblem('p_a1', [], 5, 0, false) === 'Нет очков талантов', 'no points: refused');
  ok(talentProblem('p_a1', [], 5, 1, true) === 'Только вне боя', 'talents only out of combat');
  const c = ctx();
  addXp(c.hero.progress, xpForLevel(10));
  const hp0 = c.hero.hp;
  const max0 = c.hero.maxHp;
  ok(learnTalent(c, 's_a1') === null && c.hero.maxHp === Math.floor(max0 * 1.1) && c.hero.hp === hp0, 'D121: +10% max HP, current HP kept');
  c.g.gold = 1000;
  ok(resetTalents(c) === null && c.g.gold === 1000 - talentResetCost(10) && c.hero.progress.tp === 2 && c.hero.maxHp === max0, 'D057: full reset 100 + 25 × level, points back');
  ok(c.hero.hp <= c.hero.maxHp, 'current HP clamped after the reset');
}

// ---------------------------------------------------------------- equipment
{
  ok(TEMPLATE_COUNT === 45, 'equipment catalog: 45 templates');
  ok(ARMORS.filter((a) => a.weight !== 'crafted').length === 27, '27 catalog armor pieces');
  const c = ctx();
  ok(totalArmor(c.g) === 17, 'start: light armor I 4 / 8 / 5');
  const heavy = addItem(c.g, 'heavy_chest1', 'common');
  ok(equip(c.g, heavy.uid, c.hero) === 'Требуется STR 15', 'D200: requirements checked on equip');
  c.hero.stats.str = 15;
  c.hero.stats.res = 10;
  ok(equip(c.g, heavy.uid, c.hero) === null && totalArmor(c.g) === 4 + 14 + 5, 'heavy chest equipped');
  ok(unequip(c.g, 'weapon') !== null && unequip(c.g, 'head') === null && totalArmor(c.g) === 19, 'armor comes off, the weapon is only replaced');
  const vals = (['common', 'uncommon', 'rare', 'epic', 'legendary'] as const).map((r) => itemArmor(makeItem('x', 'light_chest1', r)));
  ok(JSON.stringify(vals) === JSON.stringify([8, 9, 10, 11, 13]), `rarity armor ×1 / 1.12 / 1.25 / 1.4 / 1.6 rounded: ${vals}`);
  ok(itemArmor(makeItem('x', 'light_head1', 'rare')) === 5, '4 × 1.25 = 5');
  ok(RARITY.legendary.armor === 1.6, 'legendary armor multiplier');
  const unc = makeItem('u', 'sword1', 'uncommon');
  ok(unc.affixes.length === 1 && unc.affixes[0].id === 'physicalDamage', 'uncommon: one fixed affix');
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const rare = makeItem('r', 'bow1', 'rare', rnd);
  const epic = makeItem('e', 'staff1', 'epic', rnd);
  ok(rare.affixes.length === 2 && new Set(rare.affixes.map((a) => a.id)).size === 2, 'rare: 2 different random affixes');
  ok(epic.affixes.length === 3 && epic.affixes.every((a) => ['magicDamage', 'attackSpeed', 'critChance', 'critPower', 'mpCost', 'spellCD'].includes(a.id)), 'epic: 3 affixes from the staff pool');
  const leg = makeItem('l', 'sword1', 'legendary', rnd, 'tempered');
  const b = weaponBonuses(leg);
  ok(b.legendary === 'firstStrike' && b.physicalDamage === 8 && b.attackSpeed === 6 && b.critChance === 4 && b.baseMul === 1.15, 'legendary sword: 3 fixed affixes, Первый натиск, tempering ×1.15');
  ok(makeItem('a', 'light_head1', 'epic').affixes.length === 0, 'armor has no affixes');
  // affixes and talents combine in the combat bonuses
  const g = newGrowth();
  const w = addItem(g, 'sword1', 'legendary');
  g.equip.weapon = w.uid;
  g.talents = ['p_a1', 'p_a2'];
  const cb = combatBonuses(g);
  ok(near(cb.physDmg, 1.08 * 1.05) && near(cb.physCrit, 0.07) && near(cb.atkSpeed, 1.06) && cb.legendary === 'firstStrike', 'combat bonuses: affix and talent multiply / add');
  ok(reqProblem(makeItem('x', 'light_chest3', 'common'), new HeroState().stats) === 'Требуется DEX 50', 'requirement text');
}

// ---------------------------------------------------------------- save v3
{
  const ground: MotorGround = { top: () => 0, wall: () => false, water: () => null };
  const hero = new HeroState();
  addXp(hero.progress, 5000);
  const motor = new HeroMotor(ground, 50, 50);
  const growth = newGrowth('bow1');
  growth.gold = 321;
  growth.talents = ['s_a1'];
  growth.mods = { b1: { paid: 1, chosen: [1, null, null] } };
  addItem(growth, 'bow1', 'epic');
  const combat = newCombatData('start');
  combat.quick = [growth.equip.weapon, null, null, null];
  const snap = snapshot({ id: 't', map: 'rpg_test', name: 'И', race: 'human', hero, motor: motor.toSave(), time: new ActiveTime(), combat, growth });
  ok(snap.version === PLAYTHROUGH_VERSION && PLAYTHROUGH_VERSION === 3, 'save version 3');
  const back = migratePlaythrough(JSON.parse(JSON.stringify(snap)));
  const r = restore(back.save);
  ok(!back.migrated && JSON.stringify(r.growth) === JSON.stringify(growth), 'growth round-trips (gold, items, affixes, talents, mods)');
  ok(r.hero.progress.level === hero.progress.level && r.hero.progress.lp === hero.progress.lp, 'level and LP round-trip');
  // v2 → v3
  const v2 = JSON.parse(JSON.stringify(snap));
  v2.version = 2;
  delete v2.growth;
  v2.combat.quick = ['sword1', 'bow1', null, null];
  v2.combat.cur = 1;
  v2.combat.learned = ['s1', 'f1', 'i4'];
  v2.hero.progress = { ...v2.hero.progress, level: 1, xp: xpForLevel(6), lp: 0, tp: 0 };
  const m = migratePlaythrough(v2);
  const g = m.save.growth;
  ok(m.migrated && g.gold === 0 && g.items.find((i) => i.uid === g.equip.weapon)?.tpl === 'bow1', 'v2 → v3: equipped weapon = quick slot at cur');
  ok(m.save.combat.quick.every((q) => q === null || g.items.some((i) => i.uid === q)), 'v2 → v3: quick list holds item uids');
  ok(m.save.hero.progress.level === 6 && m.save.hero.progress.lp === 50 && m.save.hero.progress.tp === 1, 'v2 → v3: level from XP with its LP and talent points');
  ok(g.circles >= 1, `v2 → v3: circles from learned spells (${g.circles})`);
  const bad = JSON.parse(JSON.stringify(snap));
  bad.growth.gold = 'много';
  let threw = false;
  try {
    migratePlaythrough(bad);
  } catch {
    threw = true;
  }
  ok(threw, 'a broken growth block is refused');
}

console.log(fails ? `\n${fails} FAILED` : '\nall rpg2 growth checks passed');
if (fails) process.exit(1);

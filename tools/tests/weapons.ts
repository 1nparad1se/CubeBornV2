/** Weapon and armor numbers make sense: trade-offs, not one weapon best at everything. Run: npx tsx tools/tests/weapons.ts */
import { ITEMS, ITEM_BY_ID, baseDps, ARMOR_SETS } from '../../src/rpg/items';
import { computeStats, newGear, equipFromBag } from '../../src/rpg/equipment';
import { WEAPON_TYPES } from '../../src/rpg/weapons';

let fails = 0;
const ok = (c: boolean, msg: string) => {
  console.log((c ? 'ok   ' : 'FAIL ') + msg);
  if (!c) fails++;
};
const w = (id: string) => ITEM_BY_ID[id].weapon!;
ok(!ITEM_BY_ID.sword_recruit.twoHanded && !ITEM_BY_ID.staff_spark.twoHanded, '1H sword and 1H staff are one-handed (shield compatible)');
ok(ITEM_BY_ID.bow_hunter.twoHanded === true, 'the bow is two-handed');
ok(['sword_guard2h', 'spear_militia', 'staff_apprentice', 'crossbow_light'].every((id) => !ITEM_BY_ID[id]), 'the removed weapons are gone from the item list');
const ranged = ['staff_spark', 'bow_hunter'];
const melee = ['sword_recruit'];
ok(ranged.every((r) => melee.every((m) => w(r).range > 3 * w(m).range && baseDps(w(r)) < baseDps(w(m)))), 'ranged weapons trade single-target DPS for range');
ok(w('staff_spark').dmgType === 'magic', 'the staff deals magic damage');
ok(ITEMS.filter((i) => i.weapon).every((i) => i.weapon!.hitAt > 0 && i.weapon!.hitAt < 1), 'every weapon hits inside its attack cycle');
// no weapon dominates every metric (damage, speed, DPS, range)
const ws = ITEMS.filter((i) => i.weapon).map((i) => i.weapon!);
const dominates = (a: typeof ws[0], b: typeof ws[0]) => a.damage >= b.damage && a.interval <= b.interval && a.range >= b.range && (a !== b);
ok(!ws.some((a) => ws.some((b) => a !== b && dominates(a, b))), 'no weapon is better than another on every metric');
// armor classes
const def = (set: string) => ARMOR_SETS.find((s) => s.id === set)!.items.reduce((s, id) => s + (ITEM_BY_ID[id].stats.physDef ?? 0), 0);
ok(def('apprentice') < def('scout') && def('scout') < def('guard'), `defense: magic ${def('apprentice')} < light ${def('scout')} < heavy ${def('guard')}`);
const sum = (set: string, k: 'magicDmg' | 'castSpeed' | 'moveSpeed' | 'atkSpeed') => ARMOR_SETS.find((s) => s.id === set)!.items.reduce((s, id) => s + (ITEM_BY_ID[id].stats[k] ?? 0), 0);
ok(sum('apprentice', 'magicDmg') > 0 && sum('apprentice', 'castSpeed') > 0, 'apprentice set: magic damage and cast speed');
ok(sum('scout', 'moveSpeed') > 0 && sum('scout', 'atkSpeed') > 0, 'scout set: move speed and attack speed');
ok(sum('guard', 'moveSpeed') < 0, 'guard set: slower movement');
// stats follow gear
let g = newGear(['staff_spark', 'app_hood', 'app_gloves', 'app_boots', 'app_robe']);
const base = computeStats('human', g);
for (let i = 0; i < 5; i++) {
  const r = equipFromBag(g, g.bag.findIndex((x) => x));
  if (r.ok) g = r.gear;
}
const robed = computeStats('human', g);
ok(robed.hitDamage > 12 && robed.interval < 0.7 && robed.physDef === 6, `apprentice set boosts the staff: ${robed.hitDamage.toFixed(1)} dmg every ${robed.interval.toFixed(3)} s, defense ${robed.physDef}`);
ok(base.weapon === null && base.hitDamage === 4, 'bare hands without a weapon');
// one weapon system: every weapon item names a registered type, and agrees with it
for (const it of ITEMS.filter((i) => i.weapon)) {
  const t = WEAPON_TYPES[it.weapon!.kind];
  ok(!!t && t.shape === it.weapon!.shape && (t.hands === 2) === !!it.twoHanded, `${it.id}: matches its weapon type (${t?.family}, ${t?.style}, ${t?.hands} hand(s))`);
}
ok(WEAPON_TYPES.staff1h.style === 'magic' && WEAPON_TYPES.sword1h.style === 'melee' && WEAPON_TYPES.bow.style === 'ranged', 'staff casts magic, sword fights in melee, bow shoots from range');
ok(WEAPON_TYPES.sword1h.hands === 1 && WEAPON_TYPES.bow.grip === 'bow' && WEAPON_TYPES.bow.hands === 2, 'one-hand sword leaves a hand free, the bow takes both hands');
ok(Object.keys(WEAPON_TYPES).sort().join() === 'bow,staff1h,sword1h', 'three weapon types remain');
console.log(fails ? `${fails} weapon check(s) FAILED` : 'all weapon checks passed');
process.exit(fails ? 1 : 0);

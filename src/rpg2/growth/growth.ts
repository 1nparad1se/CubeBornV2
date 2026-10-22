import { SKILL_BY_ID, SPELL_BY_ID, WEAPON_BY_ID, type WeaponFamily } from '../combat/data';
import { baseMods, type HeroMods, type HeroState, type StatId } from '../hero';
import { REGEN } from '../config';
import { masteryOf } from '../combat/formulas';
import { ARMOR_SLOTS, isGear, isItemTpl, itemArmor, itemSlot, makeItem, reqProblem, weaponBonuses, type EquipSlot, type Item, type LegendaryId, type Rarity } from './items';
import { TALENT_BY_ID, talentProblem, talentResetCost } from './talents';

/**
 * Stage 3 state and rules: gold, inventory and equipment, talents, magic circles and the
 * modifications of skills and spells; mentors (D122–D127, D205), learning requirements
 * («Мастерство и обучение», Combat Talents, Magic tables), resets (D057, D058) and the bonuses
 * that combat and the hero read. Plain data for the save.
 */
export interface ModState {
  /** Paid tiers 0..3 (each paid once, D056). */
  paid: number;
  /** Confirmed variant per tier: 0 = A, 1 = Б (D059). */
  chosen: (0 | 1 | null)[];
}

export interface GrowthData {
  gold: number;
  talents: string[];
  /** Open magic circles 0..5 (opened in order, D053: none at the start). */
  circles: number;
  mods: Record<string, ModState>;
  items: Item[];
  equip: Record<EquipSlot, string | null>;
  nextUid: number;
  /** Stage 4: stackable materials and consumables by key (unlimited bag, stacks of 99 shown, D100). */
  stacks: Record<string, number>;
  /** Craft professions learned tier 0..3 (Кузнечное дело, Алхимия, Кулинария). */
  crafts: { smith: number; alchemy: number; cooking: number };
  /** Hunting tier 0..3 (Охотник, Опытный охотник, Мастер охоты). */
  hunt: number;
  /** Rare gathering skills learned: rareplants, rareminerals, rarewood. */
  gather: string[];
  /** D199: the potion size chosen for F1 / F2 / F3 and the shared potion cooldown (active seconds). */
  potionSel: { hp: string; mp: string; st: string };
  potionCd: number;
  /** D048: the starting weapon chosen for this playthrough. */
  startWeapon: 'sword1' | 'bow1' | 'staff1';
}

/** D048–D054: one chosen weapon, light armor I equipped, 0 gold, 3 small HP potions, nothing learned. */
export function newGrowth(start: 'sword1' | 'bow1' | 'staff1' = 'sword1'): GrowthData {
  const g: GrowthData = {
    gold: 0, talents: [], circles: 0, mods: {}, items: [], equip: { head: null, chest: null, legs: null, weapon: null }, nextUid: 1,
    stacks: { potionHP1: 3 }, crafts: { smith: 0, alchemy: 0, cooking: 0 }, hunt: 0, gather: [],
    potionSel: { hp: 'potionHP1', mp: 'potionMP1', st: 'potionST1' }, potionCd: 0, startWeapon: start,
  };
  const w = addItem(g, start, 'common');
  g.equip.weapon = w.uid;
  for (const s of ARMOR_SLOTS) g.equip[s] = addItem(g, `light_${s}1`, 'common').uid;
  return g;
}

export function addItem(g: GrowthData, tpl: string, rarity: Rarity, rnd?: () => number): Item {
  const it = makeItem('i' + g.nextUid++, tpl, rarity, rnd);
  g.items.push(it);
  return it;
}
export function itemOf(g: GrowthData, uid: string | null): Item | undefined {
  return uid ? g.items.find((i) => i.uid === uid) : undefined;
}
export function isEquipped(g: GrowthData, uid: string): boolean {
  return Object.values(g.equip).includes(uid);
}

/** D200: equips after the requirement check (trained stats). Returns the reason when refused. */
export function equip(g: GrowthData, uid: string, hero: HeroState): string | null {
  const it = itemOf(g, uid);
  if (!it) return 'Предмета нет';
  if (!isGear(it.tpl)) return 'Это не экипировка';
  const p = reqProblem(it, hero.stats);
  if (p) return p;
  g.equip[itemSlot(it)] = uid;
  return null;
}
/** Armor can be taken off; the weapon slot is never left empty in the test scene (base actions need it). */
export function unequip(g: GrowthData, slot: EquipSlot): string | null {
  if (slot === 'weapon') return 'Оружие можно только заменить';
  g.equip[slot] = null;
  return null;
}
export function totalArmor(g: GrowthData): number {
  return ARMOR_SLOTS.reduce((s, sl) => s + (itemOf(g, g.equip[sl]) ? itemArmor(itemOf(g, g.equip[sl])!) : 0), 0);
}

// ------------------------------------------------------------------ mentors and stats
export type MentorId = 'arden' | 'hira' | 'mira';
export interface MentorDef {
  id: MentorId;
  name: string;
  place: string;
  stats: StatId[];
  /** What else they teach (D205). */
  teaches: 'sword' | 'bow' | 'magic';
}
export const MENTORS: Record<MentorId, MentorDef> = {
  arden: { id: 'arden', name: 'Арден', place: 'Учебный двор', stats: ['str', 'dex', 'vit', 'res'], teaches: 'sword' },
  hira: { id: 'hira', name: 'Хира', place: 'Лесной Привал · площадка для стрельбы', stats: ['dex', 'res'], teaches: 'bow' },
  mira: { id: 'mira', name: 'Мира', place: 'Лавка алхимика', stats: ['int', 'spi'], teaches: 'magic' },
};
/** D127: personal interaction range (technical: the GDD's 3 m interaction distance). */
export const MENTOR_RANGE = 3;

/** D122: price of the next +1 by the value before the step. */
export function statCost(value: number): { lp: number; gold: number } {
  if (value < 25) return { lp: 1, gold: 20 };
  if (value < 50) return { lp: 2, gold: 150 };
  if (value < 75) return { lp: 3, gold: 1000 };
  if (value < 100) return { lp: 4, gold: 4000 };
  return { lp: 5, gold: 10000 };
}

export interface LearnCtx {
  g: GrowthData;
  hero: HeroState;
  learned: string[];
  om: Record<WeaponFamily, number>;
  inCombat: boolean;
}

function pay(c: LearnCtx, lp: number, gold: number): string | null {
  if (c.inCombat) return 'Только вне боя';
  if (c.hero.progress.lp < lp) return `Нужно ${lp} LP`;
  if (c.g.gold < gold) return `Нужно ${gold} зол.`;
  return null;
}
function charge(c: LearnCtx, lp: number, gold: number) {
  c.hero.progress.lp -= lp;
  c.g.gold -= gold;
}

/** D123 / D126: +1 point at a mentor who teaches it; HP / MP keep their current values (D120). */
export function statProblem(c: LearnCtx, m: MentorId, s: StatId): string | null {
  if (!MENTORS[m].stats.includes(s)) return `${MENTORS[m].name} этому не обучает`;
  const k = statCost(c.hero.stats[s]);
  return pay(c, k.lp, k.gold);
}
export function trainStat(c: LearnCtx, m: MentorId, s: StatId): string | null {
  const p = statProblem(c, m, s);
  if (p) return p;
  const k = statCost(c.hero.stats[s]);
  charge(c, k.lp, k.gold);
  c.hero.stats[s]++;
  return null;
}

// ------------------------------------------------------------------ skills, circles, spells, mods

export const CIRCLES = [
  { int: 10, mastery: 1, lp: 3, gold: 100 },
  { int: 25, mastery: 20, lp: 5, gold: 250 },
  { int: 45, mastery: 40, lp: 8, gold: 600 },
  { int: 65, mastery: 60, lp: 12, gold: 1200 },
  { int: 85, mastery: 80, lp: 16, gold: 2000 },
];
export const MOD_TIERS = [
  { mastery: 20, lp: 2, gold: 100 },
  { mastery: 45, lp: 3, gold: 300 },
  { mastery: 75, lp: 4, gold: 700 },
];
export const SKILL_MODS = [
  [{ name: 'Мощь', text: 'урон навыка ×1,10' }, { name: 'Бережная техника', text: 'ST ×0,85' }],
  [{ name: 'Боевой ритм', text: 'откат ×0,85' }, { name: 'Уверенный удар', text: 'урон ×1,08' }],
  [{ name: 'Мастерский удар', text: 'урон ×1,12' }, { name: 'Выверенная техника', text: 'ST ×0,90 и откат ×0,95' }],
];
export const SPELL_MODS = [
  [{ name: 'Сила плетения', text: 'урон ×1,10' }, { name: 'Бережное плетение', text: 'MP ×0,85' }],
  [{ name: 'Быстрое восстановление', text: 'откат ×0,85' }, { name: 'Глубокое плетение', text: 'урон ×1,08' }],
  [{ name: 'Мастер стихий', text: 'урон ×1,12' }, { name: 'Совершенное плетение', text: 'MP ×0,90 и откат ×0,95' }],
];
/** Multipliers of each tier's variants: [damage, cost, cooldown]. */
const MOD_EFFECT: [number, number, number][][] = [
  [[1.1, 1, 1], [1, 0.85, 1]],
  [[1, 1, 0.85], [1.08, 1, 1]],
  [[1.12, 1, 1], [1, 0.9, 0.95]],
];

function teacherOf(id: string): MentorId {
  const sk = SKILL_BY_ID[id];
  return sk ? (sk.family === 'sword' ? 'arden' : 'hira') : 'mira';
}
function familyOf(id: string): WeaponFamily {
  return SKILL_BY_ID[id]?.family ?? 'staff';
}
const mastery = (c: LearnCtx, f: WeaponFamily) => masteryOf(c.om[f]);

export function skillProblem(c: LearnCtx, m: MentorId, id: string): string | null {
  const sk = SKILL_BY_ID[id];
  if (!sk) return 'Неизвестный навык';
  if (teacherOf(id) !== m) return `${MENTORS[m].name} этому не обучает`;
  if (c.learned.includes(id)) return 'Уже изучено';
  const attr = sk.family === 'sword' ? 'str' : 'dex';
  if (c.hero.stats[attr] < sk.attr) return `Нужно ${attr.toUpperCase()} ${sk.attr}`;
  if (mastery(c, sk.family) < sk.mastery) return `Нужно мастерство ${sk.mastery}`;
  return pay(c, sk.lp, sk.gold);
}
export function learnSkill(c: LearnCtx, m: MentorId, id: string): string | null {
  const p = skillProblem(c, m, id);
  if (p) return p;
  const sk = SKILL_BY_ID[id];
  charge(c, sk.lp, sk.gold);
  c.learned.push(id);
  return null;
}

/** Circles open in order, once for all schools. */
export function circleProblem(c: LearnCtx, m: MentorId, n: number): string | null {
  if (m !== 'mira') return 'Круги открывает Мира';
  if (n <= c.g.circles) return 'Уже открыт';
  if (n !== c.g.circles + 1) return 'Сначала предыдущий круг';
  const r = CIRCLES[n - 1];
  if (c.hero.stats.int < r.int) return `Нужно INT ${r.int}`;
  if (mastery(c, 'staff') < r.mastery) return `Нужно мастерство посоха ${r.mastery}`;
  return pay(c, r.lp, r.gold);
}
export function openCircle(c: LearnCtx, m: MentorId, n: number): string | null {
  const p = circleProblem(c, m, n);
  if (p) return p;
  charge(c, CIRCLES[n - 1].lp, CIRCLES[n - 1].gold);
  c.g.circles = n;
  return null;
}
/** A spell: its circle open; the circle's INT and staff mastery are checked again. */
export function spellProblem(c: LearnCtx, m: MentorId, id: string): string | null {
  const sp = SPELL_BY_ID[id];
  if (!sp) return 'Неизвестное заклинание';
  if (m !== 'mira') return 'Заклинаниям обучает Мира';
  if (c.learned.includes(id)) return 'Уже изучено';
  if (c.g.circles < sp.tier) return `Нужен открытый круг ${'I II III IV V'.split(' ')[sp.tier - 1]}`;
  const r = CIRCLES[sp.tier - 1];
  if (c.hero.stats.int < r.int) return `Нужно INT ${r.int}`;
  if (mastery(c, 'staff') < r.mastery) return `Нужно мастерство посоха ${r.mastery}`;
  return pay(c, sp.lp, sp.gold);
}
export function learnSpell(c: LearnCtx, m: MentorId, id: string): string | null {
  const p = spellProblem(c, m, id);
  if (p) return p;
  const sp = SPELL_BY_ID[id];
  charge(c, sp.lp, sp.gold);
  c.learned.push(id);
  return null;
}

export function modState(g: GrowthData, id: string): ModState {
  return g.mods[id] ?? { paid: 0, chosen: [null, null, null] };
}
/** Buying tier `t` (1..3) at the skill's mentor: learned, mastery, previous tier chosen, paid once. */
export function modTierProblem(c: LearnCtx, m: MentorId, id: string, t: number): string | null {
  if (teacherOf(id) !== m) return `${MENTORS[m].name} этому не обучает`;
  if (!c.learned.includes(id)) return 'Умение не изучено';
  const st = modState(c.g, id);
  if (st.paid >= t) return 'Ступень уже оплачена';
  if (t !== st.paid + 1) return 'Сначала предыдущая ступень';
  if (t > 1 && st.chosen[t - 2] === null) return `Сначала выберите вариант ступени ${t - 1}`;
  const r = MOD_TIERS[t - 1];
  if (mastery(c, familyOf(id)) < r.mastery) return `Нужно мастерство ${r.mastery}`;
  return pay(c, r.lp, r.gold);
}
export function buyModTier(c: LearnCtx, m: MentorId, id: string, t: number): string | null {
  const p = modTierProblem(c, m, id, t);
  if (p) return p;
  charge(c, MOD_TIERS[t - 1].lp, MOD_TIERS[t - 1].gold);
  const st = modState(c.g, id);
  c.g.mods[id] = { paid: t, chosen: [...st.chosen] };
  return null;
}
/** D059: choosing a variant of a paid tier in the personal screen, out of combat; confirmed for good. */
export function chooseModProblem(g: GrowthData, id: string, t: number, inCombat: boolean): string | null {
  const st = modState(g, id);
  if (st.paid < t) return 'Ступень не оплачена';
  if (st.chosen[t - 1] !== null) return 'Вариант уже выбран (смена — платный сброс)';
  if (t > 1 && st.chosen[t - 2] === null) return 'Сначала предыдущая ступень';
  if (inCombat) return 'Только вне боя';
  return null;
}
export function chooseMod(g: GrowthData, id: string, t: number, v: 0 | 1, inCombat: boolean): string | null {
  const p = chooseModProblem(g, id, t, inCombat);
  if (p) return p;
  const st = modState(g, id);
  const chosen = [...st.chosen];
  chosen[t - 1] = v;
  g.mods[id] = { paid: st.paid, chosen };
  return null;
}
/** D058: 50 + 10 × level gold for one ability; paid tiers stay; nothing charged without choices. */
export function modResetCost(level: number): number {
  return 50 + 10 * level;
}
export function resetMods(c: LearnCtx, m: MentorId, id: string): string | null {
  if (teacherOf(id) !== m) return `${MENTORS[m].name} этого не сбрасывает`;
  if (c.inCombat) return 'Только вне боя';
  const st = modState(c.g, id);
  if (!st.chosen.some((x) => x !== null)) return 'Нет выбранных модификаций';
  const cost = modResetCost(c.hero.progress.level);
  if (c.g.gold < cost) return `Нужно ${cost} зол.`;
  c.g.gold -= cost;
  c.g.mods[id] = { paid: st.paid, chosen: [null, null, null] };
  return null;
}
/** Multipliers of an ability's chosen modifications. */
export function abilityMods(g: GrowthData, id: string): { dmg: number; cost: number; cd: number } {
  const r = { dmg: 1, cost: 1, cd: 1 };
  const st = g.mods[id];
  if (!st) return r;
  st.chosen.forEach((v, i) => {
    if (v === null || i >= st.paid) return;
    const [d, c, k] = MOD_EFFECT[i][v];
    r.dmg *= d;
    r.cost *= c;
    r.cd *= k;
  });
  return r;
}

// ------------------------------------------------------------------ talents
export function learnTalent(c: LearnCtx, id: string): string | null {
  const p = talentProblem(id, c.g.talents, c.hero.progress.level, c.hero.progress.tp, c.inCombat);
  if (p) return p;
  c.g.talents.push(id);
  c.hero.progress.tp--;
  applyHeroMods(c.g, c.hero);
  return null;
}
/** D057: full reset at a mentor, out of combat; points come back; nothing charged without talents. */
export function resetTalents(c: LearnCtx): string | null {
  if (c.inCombat) return 'Только вне боя';
  if (!c.g.talents.length) return 'Таланты не изучены';
  const cost = talentResetCost(c.hero.progress.level);
  if (c.g.gold < cost) return `Нужно ${cost} зол.`;
  c.g.gold -= cost;
  c.hero.progress.tp += c.g.talents.length;
  c.g.talents = [];
  applyHeroMods(c.g, c.hero);
  return null;
}

/** D121: talents change maxima; current values stay, clamped to the new maxima. */
export function applyHeroMods(g: GrowthData, hero: HeroState) {
  const t = new Set(g.talents);
  const m: HeroMods = baseMods();
  if (t.has('s_a1')) m.hpMul = 1.1;
  if (t.has('s_a2')) m.stBonus = 15;
  if (t.has('s_a3')) m.stDelay = REGEN.stDelay - 0.3;
  if (t.has('s_b1')) m.sprintCost = 8 * 0.85;
  if (t.has('s_b2')) m.dodgeCost = 20 * 0.9;
  if (t.has('s_b3')) m.hpRegenMul = 1.25;
  if (t.has('m_b2')) m.mpRegenMul = 1.15;
  hero.mods = m;
  hero.clamp();
}

/** What combat reads from talents, the equipped weapon and the modifications. */
export interface CombatBonuses {
  physDmg: number;
  magicDmg: number;
  physCrit: number;
  physCritPow: number;
  magicCrit: number;
  magicCritPow: number;
  skillSt: number;
  skillCd: number;
  spellMp: number;
  spellCd: number;
  atkSpeed: number;
  blockReduce: number;
  baseMul: number;
  legendary: LegendaryId | null;
  ability(id: string): { dmg: number; cost: number; cd: number };
}
export function combatBonuses(g: GrowthData): CombatBonuses {
  const t = new Set(g.talents);
  const w = weaponBonuses(itemOf(g, g.equip.weapon) ?? null);
  return {
    physDmg: (1 + w.physicalDamage / 100) * (t.has('p_a1') ? 1.05 : 1),
    magicDmg: (1 + w.magicDamage / 100) * (t.has('m_a1') ? 1.05 : 1),
    physCrit: w.critChance / 100 + (t.has('p_a2') ? 0.03 : 0),
    physCritPow: w.critPower + (t.has('p_a3') ? 0.2 : 0),
    magicCrit: w.critChance / 100 + (t.has('m_a2') ? 0.03 : 0),
    magicCritPow: w.critPower + (t.has('m_a3') ? 0.2 : 0),
    skillSt: (1 - w.stCost / 100) * (t.has('p_b1') ? 0.9 : 1),
    skillCd: (1 - w.weaponCD / 100) * (t.has('p_b2') ? 0.92 : 1),
    spellMp: (1 - w.mpCost / 100) * (t.has('m_b1') ? 0.9 : 1),
    spellCd: (1 - w.spellCD / 100) * (t.has('m_b3') ? 0.92 : 1),
    atkSpeed: 1 + w.attackSpeed / 100,
    blockReduce: t.has('p_b3') ? 0.6 : 0.5,
    baseMul: w.baseMul,
    legendary: w.legendary,
    ability: (id) => abilityMods(g, id),
  };
}

export function weaponTplOf(g: GrowthData): string {
  return itemOf(g, g.equip.weapon)?.tpl ?? 'sword1';
}
export { WEAPON_BY_ID, TALENT_BY_ID };

// ------------------------------------------------------------------ save check
import { RARITIES, AFFIXES } from './items';
import { consumableDef, isStackKey } from '../economy/goods';

/** Checks a saved growth block (D202: refused when broken, never partly loaded). */
export function checkGrowth(raw: unknown): GrowthData {
  const bad = (f: string): never => {
    throw new Error(`поле «growth.${f}»`);
  };
  if (!raw || typeof raw !== 'object') bad('');
  const r = raw as Record<string, any>;
  const n = (v: unknown, f: string) => (typeof v === 'number' && Number.isFinite(v) ? v : bad(f));
  const g = newGrowth();
  g.items = [];
  g.gold = n(r.gold, 'gold');
  g.circles = n(r.circles, 'circles');
  if (g.circles < 0 || g.circles > 5) bad('circles');
  if (!Array.isArray(r.talents)) bad('talents');
  g.talents = (r.talents as unknown[]).map((t, i) => (typeof t === 'string' && TALENT_BY_ID[t] ? t : bad(`talents.${i}`)));
  g.mods = {};
  for (const [k, v] of Object.entries((r.mods ?? {}) as Record<string, any>)) {
    if (!SKILL_BY_ID[k] && !SPELL_BY_ID[k]) bad(`mods.${k}`);
    const paid = n(v?.paid, `mods.${k}.paid`);
    if (!Array.isArray(v.chosen) || v.chosen.length !== 3) bad(`mods.${k}.chosen`);
    g.mods[k] = { paid, chosen: v.chosen.map((c: unknown) => (c === 0 || c === 1 ? c : null)) };
  }
  if (!Array.isArray(r.items)) bad('items');
  g.items = (r.items as any[]).map((it, i) => {
    if (!it || typeof it.uid !== 'string' || !isItemTpl(it.tpl) || !RARITIES.includes(it.rarity)) bad(`items.${i}`);
    if (!Array.isArray(it.affixes)) bad(`items.${i}.affixes`);
    const affixes = it.affixes.map((a: any, j: number) => (a && AFFIXES[a.id as keyof typeof AFFIXES] && typeof a.value === 'number' ? { id: a.id, value: a.value } : bad(`items.${i}.affixes.${j}`)));
    return { uid: it.uid, tpl: it.tpl, rarity: it.rarity, affixes, upgrade: it.upgrade === 'sharp' || it.upgrade === 'tempered' ? it.upgrade : null, fav: it.fav === true } as Item;
  });
  const eq = (r.equip ?? {}) as Record<string, unknown>;
  for (const s of ['head', 'chest', 'legs', 'weapon'] as EquipSlot[]) {
    const v = eq[s];
    if (v !== null && (typeof v !== 'string' || !g.items.some((i) => i.uid === v && itemSlot(i) === s))) bad(`equip.${s}`);
    g.equip[s] = v as string | null;
  }
  if (!g.equip.weapon) bad('equip.weapon');
  g.nextUid = n(r.nextUid, 'nextUid');
  // stage 4 fields; a v3 record carries only «potions.hpSmall» (small HP potions → potionHP1)
  g.stacks = {};
  if (r.stacks === undefined) {
    const hp = n(r.potions?.hpSmall ?? 0, 'potions.hpSmall');
    if (hp > 0) g.stacks.potionHP1 = hp;
  } else {
    if (!r.stacks || typeof r.stacks !== 'object') bad('stacks');
    for (const [k, v] of Object.entries(r.stacks as Record<string, unknown>)) {
      if (!isStackKey(k)) bad(`stacks.${k}`);
      const q = n(v, `stacks.${k}`);
      if (q < 0 || q !== Math.floor(q)) bad(`stacks.${k}`);
      if (q > 0) g.stacks[k] = q;
    }
  }
  const tier = (v: unknown, f: string) => {
    const t = n(v ?? 0, f);
    return t >= 0 && t <= 3 && t === Math.floor(t) ? t : bad(f);
  };
  g.crafts = { smith: tier(r.crafts?.smith, 'crafts.smith'), alchemy: tier(r.crafts?.alchemy, 'crafts.alchemy'), cooking: tier(r.crafts?.cooking, 'crafts.cooking') };
  g.hunt = tier(r.hunt, 'hunt');
  g.gather = Array.isArray(r.gather) ? (r.gather as unknown[]).map((x, i) => (x === 'rareplants' || x === 'rareminerals' || x === 'rarewood' ? x : bad(`gather.${i}`))) : r.gather === undefined ? [] : bad('gather');
  const ps = r.potionSel ?? {};
  const pk = (v: unknown, def: string, stat: string) => (typeof v === 'string' && consumableDef(v)?.result.kind === 'potion' && consumableDef(v)?.result.stat === stat ? v : def);
  g.potionSel = { hp: pk(ps.hp, 'potionHP1', 'HP'), mp: pk(ps.mp, 'potionMP1', 'MP'), st: pk(ps.st, 'potionST1', 'ST') };
  g.potionCd = Math.max(0, n(r.potionCd ?? 0, 'potionCd'));
  g.startWeapon = r.startWeapon === 'bow1' || r.startWeapon === 'staff1' ? r.startWeapon : 'sword1';
  return g;
}

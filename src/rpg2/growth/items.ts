import { WEAPONS, WEAPON_BY_ID, type WeaponDef, type WeaponKind2 } from '../combat/data';
import type { Stats, StatId } from '../hero';

/**
 * Equipment of GDD v1.2 (Equipment tables, JSON gearTemplates, D049, D134–D138, D200): 45
 * templates (12 weapons, 27 armor pieces, 6 crafted variants), four slots (helmet, chest, legs,
 * weapon), five rarities, weapon affixes, the fixed legendary sets and their unique effects, and
 * smith upgrades kept as data (the service comes with the smith).
 */
export type ArmorSlot = 'head' | 'chest' | 'legs';
export type EquipSlot = ArmorSlot | 'weapon';
export const SLOT_NAME: Record<EquipSlot, string> = { head: 'Шлем', chest: 'Нагрудник', legs: 'Штаны', weapon: 'Оружие' };
export const ARMOR_SLOTS: ArmorSlot[] = ['head', 'chest', 'legs'];

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export const RARITIES: Rarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
export const RARITY: Record<Rarity, { name: string; color: string; armor: number; randomAffixes: number }> = {
  common: { name: 'Обычное', color: '#a4aaae', armor: 1, randomAffixes: 0 },
  uncommon: { name: 'Необычное', color: '#85b980', armor: 1.12, randomAffixes: 0 },
  rare: { name: 'Редкое', color: '#77a9dc', armor: 1.25, randomAffixes: 2 },
  epic: { name: 'Эпическое', color: '#ba91dc', armor: 1.4, randomAffixes: 3 },
  legendary: { name: 'Легендарное', color: '#e2a065', armor: 1.6, randomAffixes: 0 },
};

export interface ArmorDef {
  id: string;
  name: string;
  slot: ArmorSlot;
  weight: 'light' | 'medium' | 'heavy' | 'crafted';
  tier: number;
  armor: number;
  req: Partial<Record<StatId, number>>;
  /** Existing cubic model piece used to draw it (src/rpg/items.ts). */
  mesh: string;
}

const MESH: Record<'light' | 'medium' | 'heavy', Record<ArmorSlot, string>> = {
  light: { head: 'scout_helm', chest: 'scout_armor', legs: 'scout_boots' },
  medium: { head: 'app_hood', chest: 'app_robe', legs: 'app_boots' },
  heavy: { head: 'guard_helm', chest: 'guard_cuirass', legs: 'guard_boots' },
};
const ROMAN = ['', 'I', 'II', 'III'];
const A = (w: 'light' | 'medium' | 'heavy', tier: number, slot: ArmorSlot, armor: number, req: Partial<Record<StatId, number>>): ArmorDef => {
  const nm = { light: ['Лёгкий шлем', 'Лёгкий нагрудник', 'Лёгкие штаны'], medium: ['Средний шлем', 'Средний нагрудник', 'Средние штаны'], heavy: ['Тяжёлый шлем', 'Тяжёлый нагрудник', 'Тяжёлые штаны'] }[w][ARMOR_SLOTS.indexOf(slot)];
  return { id: `${w}_${slot}${tier}`, name: `${nm} ${ROMAN[tier]}`, slot, weight: w, tier, armor, req, mesh: MESH[w][slot] };
};
const set = (w: 'light' | 'medium' | 'heavy', tier: number, a: [number, number, number], req: Partial<Record<StatId, number>>) => ARMOR_SLOTS.map((s, i) => A(w, tier, s, a[i], req));

/** «Каталог брони»: 27 templates, plus «Варианты из ремесленных рецептов»: 6. */
export const ARMORS: ArmorDef[] = [
  ...set('light', 1, [4, 8, 5], { dex: 10 }),
  ...set('medium', 1, [4, 10, 6], { str: 10 }),
  ...set('heavy', 1, [6, 14, 9], { str: 15, res: 10 }),
  ...set('light', 2, [7, 14, 9], { dex: 25 }),
  ...set('medium', 2, [7, 18, 11], { str: 25 }),
  ...set('heavy', 2, [11, 25, 16], { str: 35, res: 20 }),
  ...set('light', 3, [12, 24, 15], { dex: 50 }),
  ...set('medium', 3, [12, 30, 18], { str: 50 }),
  ...set('heavy', 3, [18, 42, 27], { str: 50, res: 35 }),
  { id: 'craft_leather_chest', name: 'Кожаный нагрудник', slot: 'chest', weight: 'crafted', tier: 1, armor: 8, req: { dex: 10 }, mesh: 'scout_armor' },
  { id: 'craft_iron_head', name: 'Железный шлем', slot: 'head', weight: 'crafted', tier: 1, armor: 4, req: { str: 10 }, mesh: 'guard_helm' },
  { id: 'craft_steel_chest', name: 'Стальной нагрудник', slot: 'chest', weight: 'crafted', tier: 2, armor: 18, req: { str: 25 }, mesh: 'guard_cuirass' },
  { id: 'craft_steel_legs', name: 'Стальные штаны', slot: 'legs', weight: 'crafted', tier: 2, armor: 10, req: { str: 25 }, mesh: 'guard_boots' },
  { id: 'craft_heavy_chest', name: 'Тяжёлый нагрудник', slot: 'chest', weight: 'crafted', tier: 3, armor: 30, req: { str: 50, res: 35 }, mesh: 'guard_cuirass' },
  { id: 'craft_fortified_head', name: 'Укреплённый шлем', slot: 'head', weight: 'crafted', tier: 3, armor: 14, req: { str: 50, res: 35 }, mesh: 'guard_helm' },
];
export const ARMOR_BY_ID: Record<string, ArmorDef> = Object.fromEntries(ARMORS.map((a) => [a.id, a]));
export const TEMPLATE_COUNT = WEAPONS.length + ARMORS.length;

export type AffixId = 'physicalDamage' | 'magicDamage' | 'attackSpeed' | 'critChance' | 'critPower' | 'stCost' | 'weaponCD' | 'mpCost' | 'spellCD';
export const AFFIXES: Record<AffixId, { name: string; values: number[]; unit: '%' | 'pp' | 'x'; effect: string }> = {
  physicalDamage: { name: 'Сила удара', values: [4, 6, 8], unit: '%', effect: 'Физический урон оружия и его навыков' },
  magicDamage: { name: 'Сила стихий', values: [4, 6, 8], unit: '%', effect: 'Урон обычной магической атаки и заклинаний' },
  attackSpeed: { name: 'Быстрый замах', values: [3, 4, 6], unit: '%', effect: 'Скорость обычных атак' },
  critChance: { name: 'Острый взгляд', values: [2, 3, 4], unit: 'pp', effect: 'Шанс критического попадания' },
  critPower: { name: 'Сокрушение', values: [0.1, 0.15, 0.2], unit: 'x', effect: 'Коэффициент критического урона' },
  stCost: { name: 'Экономия сил', values: [6, 8, 10], unit: '%', effect: 'Расход ST активных навыков этого оружия' },
  weaponCD: { name: 'Боевой ритм', values: [4, 6, 8], unit: '%', effect: 'Откаты активных навыков этого оружия' },
  mpCost: { name: 'Экономия маны', values: [6, 8, 10], unit: '%', effect: 'Расход MP заклинаний' },
  spellCD: { name: 'Магический ритм', values: [4, 6, 8], unit: '%', effect: 'Откаты заклинаний' },
};
export const AFFIX_POOLS: Record<WeaponKind2, AffixId[]> = {
  sword: ['physicalDamage', 'attackSpeed', 'critChance', 'critPower', 'stCost', 'weaponCD'],
  greatsword: ['physicalDamage', 'attackSpeed', 'critChance', 'critPower', 'stCost', 'weaponCD'],
  bow: ['physicalDamage', 'attackSpeed', 'critChance', 'critPower', 'stCost', 'weaponCD'],
  staff: ['magicDamage', 'attackSpeed', 'critChance', 'critPower', 'mpCost', 'spellCD'],
};
export interface Affix {
  id: AffixId;
  value: number;
}
export const FIXED_AFFIXES: Record<WeaponKind2, { uncommon: Affix[]; legendary: Affix[] }> = {
  sword: { uncommon: [{ id: 'physicalDamage', value: 5 }], legendary: [{ id: 'physicalDamage', value: 8 }, { id: 'attackSpeed', value: 6 }, { id: 'critChance', value: 4 }] },
  greatsword: { uncommon: [{ id: 'physicalDamage', value: 5 }], legendary: [{ id: 'physicalDamage', value: 10 }, { id: 'critPower', value: 0.2 }, { id: 'stCost', value: 10 }] },
  bow: { uncommon: [{ id: 'critChance', value: 2 }], legendary: [{ id: 'physicalDamage', value: 8 }, { id: 'critChance', value: 4 }, { id: 'weaponCD', value: 8 }] },
  staff: { uncommon: [{ id: 'magicDamage', value: 5 }], legendary: [{ id: 'magicDamage', value: 8 }, { id: 'mpCost', value: 10 }, { id: 'spellCD', value: 8 }] },
};
export type LegendaryId = 'firstStrike' | 'lastArgument' | 'farLine' | 'firstFormula';
export const LEGENDARY: Record<WeaponKind2, { id: LegendaryId; name: string; effect: string }> = {
  sword: { id: 'firstStrike', name: 'Первый натиск', effect: 'Обычное попадание по цели с полным HP: +20% урона.' },
  greatsword: { id: 'lastArgument', name: 'Последний довод', effect: 'Обычное попадание по цели с HP не выше 30%: +15% урона.' },
  bow: { id: 'farLine', name: 'Дальний рубеж', effect: 'Обычный выстрел дальше 15 м в момент выпуска: +15% урона.' },
  staff: { id: 'firstFormula', name: 'Первая формула', effect: 'Заклинания I круга с этим посохом: MP −10%.' },
};

/** «Кузнечные улучшения»: +10 % (заточка) or +15 % (закалка) of the base; one, permanent (D002). */
export type Upgrade = 'sharp' | 'tempered';
export const UPGRADE: Record<Upgrade, { name: string; mul: number }> = { sharp: { name: 'Заточка', mul: 1.1 }, tempered: { name: 'Закалка', mul: 1.15 } };
export const FORGE_COSTS: Record<number, Record<Upgrade, { gold: number; materials: Record<string, number> }>> = {
  1: { sharp: { gold: 100, materials: { coal: 2 } }, tempered: { gold: 180, materials: { iron: 2, coal: 2 } } },
  2: { sharp: { gold: 300, materials: { coal: 3 } }, tempered: { gold: 500, materials: { steel: 2, coal: 3 } } },
  3: { sharp: { gold: 700, materials: { coal: 4 } }, tempered: { gold: 1200, materials: { fortified: 2, coal: 4 } } },
};

/** One item instance (D138: the favourite mark belongs to the instance). */
export interface Item {
  uid: string;
  tpl: string;
  rarity: Rarity;
  affixes: Affix[];
  upgrade: Upgrade | null;
  fav: boolean;
}

export function isWeapon(tpl: string): boolean {
  return !!WEAPON_BY_ID[tpl];
}
export function itemName(it: Item): string {
  return WEAPON_BY_ID[it.tpl]?.name ?? ARMOR_BY_ID[it.tpl]?.name ?? it.tpl;
}
export function itemSlot(it: Item): EquipSlot {
  return isWeapon(it.tpl) ? 'weapon' : ARMOR_BY_ID[it.tpl].slot;
}
export function itemReq(it: Item): Partial<Record<StatId, number>> {
  const w = WEAPON_BY_ID[it.tpl];
  if (w) return { [w.attr]: w.req };
  return ARMOR_BY_ID[it.tpl]?.req ?? {};
}

/** D200: requirements are checked against trained stats (no temporary bonuses); level is not a requirement. */
export function reqProblem(it: Item, stats: Stats): string | null {
  const miss = Object.entries(itemReq(it)).filter(([k, v]) => stats[k as StatId] < (v as number));
  if (!miss.length) return null;
  return 'Требуется ' + miss.map(([k, v]) => `${k.toUpperCase()} ${v}`).join(', ');
}

/** D200: armor of one piece with the rarity multiplier, rounded to nearest (half up). */
export function itemArmor(it: Item): number {
  const a = ARMOR_BY_ID[it.tpl];
  if (!a) return 0;
  return Math.floor(a.armor * RARITY[it.rarity].armor + 0.5 + 1e-9);
}

/** Creates an item. Weapons get their affixes from the rarity (D200); armor never has affixes. */
export function makeItem(uid: string, tpl: string, rarity: Rarity, rnd: () => number = Math.random, upgrade: Upgrade | null = null): Item {
  const w = WEAPON_BY_ID[tpl];
  let affixes: Affix[] = [];
  if (w) {
    if (rarity === 'uncommon' || rarity === 'legendary') affixes = FIXED_AFFIXES[w.kind][rarity].map((a) => ({ ...a }));
    else {
      const pool = [...AFFIX_POOLS[w.kind]];
      for (let i = 0; i < RARITY[rarity].randomAffixes; i++) {
        const k = Math.floor(rnd() * pool.length);
        const id = pool.splice(k, 1)[0];
        const vals = AFFIXES[id].values;
        affixes.push({ id, value: vals[Math.floor(rnd() * vals.length)] });
      }
    }
  } else upgrade = null;
  return { uid, tpl, rarity, affixes, upgrade: w ? upgrade : null, fav: false };
}

/** Summed bonuses of the equipped weapon (D200: only while equipped). */
export interface WeaponBonuses {
  physicalDamage: number;
  magicDamage: number;
  attackSpeed: number;
  critChance: number;
  critPower: number;
  stCost: number;
  weaponCD: number;
  mpCost: number;
  spellCD: number;
  legendary: LegendaryId | null;
  /** Smith upgrade multiplier of the base (1 / 1.10 / 1.15). */
  baseMul: number;
}
export function weaponBonuses(it: Item | null): WeaponBonuses {
  const b: WeaponBonuses = { physicalDamage: 0, magicDamage: 0, attackSpeed: 0, critChance: 0, critPower: 0, stCost: 0, weaponCD: 0, mpCost: 0, spellCD: 0, legendary: null, baseMul: 1 };
  if (!it) return b;
  for (const a of it.affixes) b[a.id] += a.value;
  const w = WEAPON_BY_ID[it.tpl];
  if (w && it.rarity === 'legendary') b.legendary = LEGENDARY[w.kind].id;
  if (it.upgrade) b.baseMul = UPGRADE[it.upgrade].mul;
  return b;
}

export function affixText(a: Affix): string {
  const d = AFFIXES[a.id];
  const v = d.unit === 'x' ? `+${String(a.value).replace('.', ',')} к множителю` : d.unit === 'pp' ? `+${a.value} п.п.` : a.id === 'stCost' || a.id === 'mpCost' || a.id === 'weaponCD' || a.id === 'spellCD' ? `−${a.value}%` : `+${a.value}%`;
  return `${d.name}: ${v}`;
}

export function weaponDef(it: Item): WeaponDef | undefined {
  return WEAPON_BY_ID[it.tpl];
}

import CRAFT from '../data/craft.json';
import type { GrowthData } from '../growth/growth';
import { isEquipped } from '../growth/growth';
import type { HeroState, StatId } from '../hero';
import { FORGE_COSTS, isWeapon, makeItem, upgradeName, weaponGroup, type Upgrade } from '../growth/items';
import { addStack, removeStack, stackCount } from './bag';
import { RECIPES, RECIPE_BY_ID, stackName, type RecipeDef } from './goods';

/**
 * Crafts, hunting and rare gathering (Craft tables, JSON craftTraining / huntingTraining /
 * gatheringTraining / recipes, D133–D135, D153–D157, D205). Tiers are learned in order at the
 * right NPC for LP and gold with the attribute threshold; recipes need their station and tier,
 * are made out of combat in a chosen number of runs with one check and one consumption.
 */
export type Profession = 'smith' | 'alchemy' | 'cooking';
export type Station = 'forge' | 'alchemy' | 'stove';
export const STATION_OF: Record<Profession, Station> = { smith: 'forge', alchemy: 'alchemy', cooking: 'stove' };
export const STATION_NAME: Record<Station, string> = { forge: 'Кузница', alchemy: 'Алхимический стол', stove: 'Костёр / печь' };
export const PROFESSION_NAME: Record<Profession, string> = { smith: 'Кузнечное дело', alchemy: 'Алхимия', cooking: 'Кулинария' };

/** D205: who teaches what (NPC ids of the test scene). */
export type TeacherId = 'smith' | 'alchemist' | 'cook' | 'hunter' | 'supplier';
interface Training {
  id: string;
  name: string;
  lp: number;
  gold: number;
  attr: string | null;
  threshold: number;
  tier?: number;
  profession?: Profession;
  effect?: string;
}
const CT = CRAFT.craftTraining as Training[];
const HT = CRAFT.huntingTraining as Training[];
const GT = CRAFT.gatheringTraining as Training[];

export interface TrainOption {
  id: string;
  name: string;
  lp: number;
  gold: number;
  attr: StatId | null;
  threshold: number;
  effect: string;
}
const opt = (t: Training): TrainOption => ({ id: t.id, name: t.name, lp: t.lp, gold: t.gold, attr: t.attr ? (t.attr.toLowerCase() as StatId) : null, threshold: t.threshold, effect: t.effect ?? '' });
export const TEACHES: Record<TeacherId, TrainOption[]> = {
  smith: CT.filter((t) => t.profession === 'smith').map(opt),
  alchemist: [...CT.filter((t) => t.profession === 'alchemy').map(opt), opt(GT.find((g) => g.id === 'rareplants')!)],
  cook: CT.filter((t) => t.profession === 'cooking').map(opt),
  hunter: HT.map(opt),
  supplier: GT.filter((g) => g.id !== 'rareplants').map(opt),
};
export const TRAINING_BY_ID: Record<string, TrainOption> = Object.fromEntries(Object.values(TEACHES).flat().map((t) => [t.id, t]));

export interface CraftCtx {
  g: GrowthData;
  hero: HeroState;
  inCombat: boolean;
}

/** Learned already? (crafts and hunting by tier, gathering by id) */
export function knows(g: GrowthData, id: string): boolean {
  const m = /^(smith|alchemy|cooking|hunt)(\d)$/.exec(id);
  if (m) return (m[1] === 'hunt' ? g.hunt : g.crafts[m[1] as Profession]) >= Number(m[2]);
  return g.gather.includes(id);
}

export function trainProblem(c: CraftCtx, teacher: TeacherId, id: string): string | null {
  const t = TEACHES[teacher].find((x) => x.id === id);
  if (!t) return 'Этот NPC этому не обучает';
  if (knows(c.g, id)) return 'Уже изучено';
  const m = /^(smith|alchemy|cooking|hunt)(\d)$/.exec(id);
  if (m && Number(m[2]) > 1 && !knows(c.g, `${m[1]}${Number(m[2]) - 1}`)) return 'Сначала предыдущая ступень';
  if (t.attr && c.hero.stats[t.attr] < t.threshold) return `Нужно ${t.attr.toUpperCase()} ${t.threshold}`;
  if (c.inCombat) return 'Только вне боя';
  if (c.hero.progress.lp < t.lp) return `Нужно ${t.lp} LP`;
  if (c.g.gold < t.gold) return `Нужно ${t.gold} зол.`;
  return null;
}
/** One payment; the fee never goes into a merchant's purse (D157). */
export function train(c: CraftCtx, teacher: TeacherId, id: string): string | null {
  const p = trainProblem(c, teacher, id);
  if (p) return p;
  const t = TRAINING_BY_ID[id];
  c.hero.progress.lp -= t.lp;
  c.g.gold -= t.gold;
  const m = /^(smith|alchemy|cooking|hunt)(\d)$/.exec(id);
  if (m && m[1] === 'hunt') c.g.hunt = Number(m[2]);
  else if (m) c.g.crafts[m[1] as Profession] = Number(m[2]);
  else c.g.gather.push(id);
  return null;
}

// ------------------------------------------------------------------ recipes
/** Armor recipes make the crafted variants of the equipment catalog. */
export const RECIPE_ARMOR: Record<string, string> = {
  chest1: 'craft_leather_chest', armor1: 'craft_iron_head', chest2: 'craft_steel_chest',
  armor2: 'craft_steel_legs', chest3: 'craft_heavy_chest', armor3: 'craft_fortified_head',
};
export function recipesAt(st: Station): RecipeDef[] {
  return RECIPES.filter((r) => STATION_OF[r.profession] === st);
}
/** What one run gives: a stack key and amount, or an item template. */
export function recipeOutput(r: RecipeDef): { stack: string; qty: number } | { tpl: string } {
  if (r.result.kind === 'material') return { stack: r.result.key!, qty: r.result.qty ?? 1 };
  if (r.result.kind === 'potion' || r.result.kind === 'food') return { stack: r.id, qty: r.result.qty ?? 1 };
  if (r.result.kind === 'weapon') return { tpl: r.id };
  return { tpl: RECIPE_ARMOR[r.id] };
}
export const CRAFT_MAX = 99;

export function craftProblem(c: CraftCtx, st: Station, id: string, runs: number): string | null {
  const r = RECIPE_BY_ID[id];
  if (!r) return 'Нет такого рецепта';
  if (STATION_OF[r.profession] !== st) return `Нужна станция «${STATION_NAME[STATION_OF[r.profession]]}»`;
  if (c.g.crafts[r.profession] < r.tier) return `Нужно «${PROFESSION_NAME[r.profession]} ${'I'.repeat(r.tier)}»`;
  if (c.inCombat) return 'Изготовление только вне боя';
  if (!Number.isInteger(runs) || runs < 1 || runs > CRAFT_MAX) return `Количество 1–${CRAFT_MAX}`;
  const miss = Object.entries(r.ingredients).filter(([k, n]) => stackCount(c.g, k) < n * runs);
  if (miss.length) return 'Не хватает: ' + miss.map(([k, n]) => `${stackName(k)} ${stackCount(c.g, k)}/${n * runs}`).join(', ');
  return null;
}
/** D133 / D134: all runs at once or nothing; one consumption and one output; equipment is common, without affixes. */
export function craft(c: CraftCtx, st: Station, id: string, runs: number, nextUid: () => string): string | null {
  const p = craftProblem(c, st, id, runs);
  if (p) return p;
  const r = RECIPE_BY_ID[id];
  for (const [k, n] of Object.entries(r.ingredients)) removeStack(c.g, k, n * runs);
  const out = recipeOutput(r);
  if ('stack' in out) addStack(c.g, out.stack, out.qty * runs);
  else for (let i = 0; i < runs; i++) c.g.items.push(makeItem(nextUid(), out.tpl, 'common'));
  return null;
}

// ------------------------------------------------------------------ smith upgrades (Бран)
export function forgeCost(tpl: string, u: Upgrade) {
  return FORGE_COSTS[weaponGroup(tpl)][u];
}
/** D153 / D155 / D156: an unequipped weapon without an upgrade; all gold and materials checked first. */
export function upgradeProblem(c: CraftCtx, uid: string, u: Upgrade): string | null {
  const it = c.g.items.find((i) => i.uid === uid);
  if (!it || !isWeapon(it.tpl)) return 'Нужно оружие';
  if (it.upgrade) return `Уже улучшено: ${upgradeName(it.tpl, it.upgrade)}`;
  if (isEquipped(c.g, uid)) return 'Надетое оружие сначала нужно снять или заменить';
  if (c.inCombat) return 'Услуги только вне боя';
  const k = forgeCost(it.tpl, u);
  if (c.g.gold < k.gold) return `Нужно ${k.gold} зол.`;
  for (const [m, n] of Object.entries(k.materials)) {
    if (stackCount(c.g, m) < n) return `Нужно: ${stackName(m)} ×${n}`;
  }
  return null;
}
export function upgradeWeapon(c: CraftCtx, uid: string, u: Upgrade): string | null {
  const p = upgradeProblem(c, uid, u);
  if (p) return p;
  const it = c.g.items.find((i) => i.uid === uid)!;
  const k = forgeCost(it.tpl, u);
  c.g.gold -= k.gold;
  for (const [m, n] of Object.entries(k.materials)) removeStack(c.g, m, n);
  it.upgrade = u;
  return null;
}

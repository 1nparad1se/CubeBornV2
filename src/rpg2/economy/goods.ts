import CRAFT from '../data/craft.json';
import ECON from '../data/economy.json';
import { WEAPON_BY_ID } from '../combat/data';
import { ARMOR_BY_ID, RUNE_NAMES, TOOL_NAMES, isRune, isTool, itemName, weaponGroup, type Item, type Rarity } from '../growth/items';

/**
 * Goods of stage 4 (Craft and Trade Economy tables, «Торговые цены и цели экономики», D100,
 * D151): stackable materials and consumables (stacks of up to 99, unlimited in the hero's
 * bag), and separate items (equipment, tools, runes). Prices: fixed buy prices, sale at 25 %
 * rounded down with a minimum of 1 per unit, buyback at the full buy price.
 */
export const STACK_MAX = 99;

export interface RecipeDef {
  id: string;
  profession: 'smith' | 'alchemy' | 'cooking';
  tier: 1 | 2 | 3;
  name: string;
  ingredients: Record<string, number>;
  result: { kind: 'material' | 'weapon' | 'armor' | 'potion' | 'food'; key?: string; qty?: number; stat?: 'HP' | 'MP' | 'ST'; amount?: number };
  effect: string;
}
export const RECIPES = CRAFT.recipes as unknown as RecipeDef[];
export const RECIPE_BY_ID: Record<string, RecipeDef> = Object.fromEntries(RECIPES.map((r) => [r.id, r]));

/** Materials (25 resources of the Craft catalog). */
export const MATERIAL_NAMES = CRAFT.resourceNames as Record<string, string>;
/** Consumables are keyed by their recipe id (nine potions, nine dishes). */
export const CONSUMABLES = RECIPES.filter((r) => r.result.kind === 'potion' || r.result.kind === 'food');
const CONSUMABLE_BY_ID: Record<string, RecipeDef> = Object.fromEntries(CONSUMABLES.map((r) => [r.id, r]));

export type GoodsCat = 'gear' | 'material' | 'consumable' | 'tool' | 'rune';
export const CAT_NAME: Record<GoodsCat, string> = { gear: 'Экипировка', material: 'Материалы', consumable: 'Расходники', tool: 'Инструменты', rune: 'Руны' };

export function isMaterial(key: string): boolean {
  return key in MATERIAL_NAMES;
}
export function isConsumable(key: string): boolean {
  return !!CONSUMABLE_BY_ID[key];
}
export function isStackKey(key: string): boolean {
  return isMaterial(key) || isConsumable(key);
}
export function consumableDef(key: string): RecipeDef | undefined {
  return CONSUMABLE_BY_ID[key];
}
export function stackName(key: string): string {
  return MATERIAL_NAMES[key] ?? CONSUMABLE_BY_ID[key]?.name ?? key;
}
export function stackCat(key: string): GoodsCat {
  return isConsumable(key) ? 'consumable' : 'material';
}
export function itemCat(it: Item): GoodsCat {
  return isTool(it.tpl) ? 'tool' : isRune(it.tpl) ? 'rune' : 'gear';
}

// ------------------------------------------------------------------ prices
const MAT_PRICE = ECON.materialBuyPrices as Record<string, number>;
const TOOL_PRICE = ECON.toolBuyPrices as Record<string, number>;
const WEAPON_PRICE = ECON.weaponBuyPrices as Record<string, number[]>;
const RARITY_PRICE = ECON.rarityPriceFactors as Record<Rarity, number>;
/** Consumable prices from the merchants' offers (the same price at every merchant, D150). */
const CONS_PRICE: Record<string, number> = {};
for (const offs of Object.values(ECON.merchantOffers as Record<string, { kind: string; recipe?: string; unitBuyPrice: number }[]>))
  for (const o of offs) if (o.kind === 'consumable' && o.recipe) CONS_PRICE[o.recipe] = o.unitBuyPrice;
const RUNE_PRICE: Record<string, number> = Object.fromEntries(
  (ECON.runeTrade.destinations as { runeId: string; buyPrice: number }[]).map((d) => [d.runeId, d.buyPrice]),
);

/** Non-negative prices are rounded half up. */
const round = (v: number) => Math.floor(v + 0.5 + 1e-9);

export function stackBuyPrice(key: string): number {
  return MAT_PRICE[key] ?? CONS_PRICE[key] ?? 0;
}
/**
 * Buy price of an item: weapons by group and family × rarity factor; armor = the template's
 * common defense × 8 / 12 / 20 by group × rarity factor; tools and runes by the catalog.
 * Smith upgrades and affix values never change the price (D152).
 */
export function itemBuyPrice(it: Item): number {
  const w = WEAPON_BY_ID[it.tpl];
  if (w) return round(WEAPON_PRICE[w.kind][weaponGroup(it.tpl) - 1] * RARITY_PRICE[it.rarity]);
  const a = ARMOR_BY_ID[it.tpl];
  if (a) return round(a.armor * [8, 12, 20][a.tier - 1] * RARITY_PRICE[it.rarity]);
  if (isTool(it.tpl)) return TOOL_PRICE[it.tpl];
  if (isRune(it.tpl)) return RUNE_PRICE[it.tpl];
  return 0;
}
/** D151: max(1, floor(buy × 0.25)) per unit; the total is unit × quantity. */
export function sellUnit(buy: number): number {
  return Math.max(1, Math.floor(buy * 0.25));
}

export { TOOL_NAMES, RUNE_NAMES, itemName };

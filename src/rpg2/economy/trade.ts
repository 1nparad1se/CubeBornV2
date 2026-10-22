import ECON from '../data/economy.json';
import { isEquipped, type GrowthData } from '../growth/growth';
import { makeItem, type Item, type Rarity } from '../growth/items';
import { addStack, removeStack, stackCount, type Entry } from './bag';
import { STACK_MAX, isStackKey, itemBuyPrice, sellUnit, stackBuyPrice, stackName, itemName } from './goods';

/**
 * Trade with the five merchants (Trade Economy tables, JSON merchantOffers — 101 offers, D139–D152,
 * D203–D204, «Торговые цены и цели экономики»): finite stock, finite purses, one restock cycle per
 * merchant of 120 active minutes started only by buying a restockable offer, sale at 25 % (floor,
 * min 1) only when the purse pays the whole lot, buyback forever at the full buy price, 1–99 per
 * operation for stackable goods, one for items; every check happens before one single transfer.
 */
export type MerchantId = 'smith' | 'alchemist' | 'cook' | 'hunter' | 'supplier';
export const MERCHANT_IDS: MerchantId[] = ['smith', 'alchemist', 'cook', 'hunter', 'supplier'];

export interface OfferDef {
  id: string;
  kind: 'gear' | 'material' | 'consumable' | 'tool' | 'rune';
  template?: string;
  rarity?: Rarity;
  key?: string;
  recipe?: string;
  unitBuyPrice: number;
  unitSellPrice: number;
  stock: number;
  replenishes: boolean;
  restockMinutes: number | null;
}
export interface MerchantDef {
  id: MerchantId;
  name: string;
  role: string;
  place: string;
  greeting: string;
  specialty: string;
}
export const MERCHANTS: Record<MerchantId, MerchantDef> = Object.fromEntries((ECON.merchants as MerchantDef[]).map((m) => [m.id, m])) as Record<MerchantId, MerchantDef>;
export const OFFERS: Record<MerchantId, OfferDef[]> = ECON.merchantOffers as unknown as Record<MerchantId, OfferDef[]>;
export const OFFER_COUNT = MERCHANT_IDS.reduce((s, m) => s + OFFERS[m].length, 0);
/** D148 / D203: initial purses. */
export const WALLET: Record<MerchantId, number> = ECON.merchantWallets.assignments as Record<MerchantId, number>;
/** D142: 120 active minutes. */
export const RESTOCK_SECONDS = ECON.merchantWallets.minutes * 60;
export const TRADE_MAX = 99;

/** Catalog template ids «lightШлем1» → our armor ids «light_head1». */
export function offerTemplate(o: OfferDef): string {
  const t = o.template ?? o.key ?? '';
  return t.replace('Шлем', '_head').replace('Нагрудник', '_chest').replace('Штаны', '_legs');
}
/** What an offer sells: a stack key or an item template. */
export function offerGoods(o: OfferDef): { stack: string } | { tpl: string; rarity: Rarity } {
  if (o.kind === 'material') return { stack: o.key! };
  if (o.kind === 'consumable') return { stack: o.recipe! };
  if (o.kind === 'gear') return { tpl: offerTemplate(o), rarity: o.rarity ?? 'common' };
  return { tpl: o.key!, rarity: 'common' };
}

export interface MerchantState {
  /** Left in the original assortment by offer id. */
  stock: Record<string, number>;
  /** Equipment of the assortment, created with the playthrough (its affixes are fixed then). */
  gear: Record<string, Item>;
  wallet: number;
  /** Seconds to the next restock; null until the first purchase of a restockable offer (D143 / D147). */
  cycleLeft: number | null;
  /** Things the hero sold to this merchant (D139 / D140 / D076 / D203): kept forever. */
  buyback: Entry[];
}

export function newMerchant(id: MerchantId, nextUid: () => string, rnd: () => number = Math.random): MerchantState {
  const m: MerchantState = { stock: {}, gear: {}, wallet: WALLET[id], cycleLeft: null, buyback: [] };
  for (const o of OFFERS[id]) {
    m.stock[o.id] = o.stock;
    const g = offerGoods(o);
    if ('tpl' in g) m.gear[o.id] = makeItem(nextUid(), g.tpl, g.rarity, rnd);
  }
  return m;
}

export interface TradeCtx {
  g: GrowthData;
  m: MerchantState;
  id: MerchantId;
  inCombat: boolean;
  nextUid: () => string;
}

function qtyProblem(qty: number, stackable: boolean): string | null {
  if (!Number.isInteger(qty) || qty < 1) return 'Количество от 1';
  if (!stackable && qty !== 1) return 'Этот предмет — по одному';
  if (qty > TRADE_MAX) return `Не больше ${TRADE_MAX} за одну операцию`;
  return null;
}

// ------------------------------------------------------------------ buying from the assortment
export function offerPrice(o: OfferDef): number {
  return o.unitBuyPrice;
}
export function buyProblem(c: TradeCtx, offerId: string, qty: number): string | null {
  if (c.inCombat) return 'Торговля только вне боя';
  const o = OFFERS[c.id].find((x) => x.id === offerId);
  if (!o) return 'Нет такого товара';
  const p = qtyProblem(qty, 'stack' in offerGoods(o));
  if (p) return p;
  const left = c.m.stock[offerId] ?? 0;
  if (left <= 0) return 'Товар закончился';
  if (qty > left) return `В наличии только ${left}`;
  const total = o.unitBuyPrice * qty;
  if (c.g.gold < total) return `Нужно ${total} зол.`;
  return null;
}
export function buy(c: TradeCtx, offerId: string, qty: number): string | null {
  const p = buyProblem(c, offerId, qty);
  if (p) return p;
  const o = OFFERS[c.id].find((x) => x.id === offerId)!;
  const total = o.unitBuyPrice * qty;
  c.g.gold -= total;
  c.m.wallet += total; // D145
  c.m.stock[offerId] -= qty;
  const goods = offerGoods(o);
  if ('stack' in goods) addStack(c.g, goods.stack, qty);
  else {
    const it = c.m.gear[offerId] ?? makeItem(c.nextUid(), goods.tpl, goods.rarity);
    delete c.m.gear[offerId];
    c.g.items.push(it);
  }
  // D143 / D147: only a restockable offer starts the merchant's cycle; later purchases never move it
  if (o.replenishes && c.m.cycleLeft === null) c.m.cycleLeft = RESTOCK_SECONDS;
  return null;
}

// ------------------------------------------------------------------ selling
export interface SellTarget {
  stack?: string;
  uid?: string;
}
function sellItemOf(c: TradeCtx, t: SellTarget): Item | undefined {
  return t.uid ? c.g.items.find((i) => i.uid === t.uid) : undefined;
}
/** Unit buy price of what is sold (also the buyback price). */
export function targetBuyPrice(c: TradeCtx, t: SellTarget): number {
  if (t.stack) return stackBuyPrice(t.stack);
  const it = sellItemOf(c, t);
  return it ? itemBuyPrice(it) : 0;
}
/** Largest quantity this merchant can pay for now (D149). */
export function affordable(c: TradeCtx, t: SellTarget): number {
  return Math.floor(c.m.wallet / sellUnit(targetBuyPrice(c, t)));
}
export function sellProblem(c: TradeCtx, t: SellTarget, qty: number): string | null {
  if (c.inCombat) return 'Торговля только вне боя';
  if (t.stack) {
    if (!isStackKey(t.stack)) return 'Этот предмет не продаётся';
    const p = qtyProblem(qty, true);
    if (p) return p;
    const have = stackCount(c.g, t.stack);
    if (qty > have) return `У вас только ${have}`;
  } else {
    const it = sellItemOf(c, t);
    if (!it) return 'Предмета нет';
    const p = qtyProblem(qty, false);
    if (p) return p;
    if (isEquipped(c.g, it.uid)) return 'Надетый предмет продать нельзя — сначала снимите его'; // D136
    if (it.fav) return 'Избранный предмет продать нельзя — снимите отметку'; // D138
  }
  const total = sellUnit(targetBuyPrice(c, t)) * qty;
  if (c.m.wallet < total) return `У торговца только ${c.m.wallet} зол.: можно продать не больше ${affordable(c, t)}`; // D149
  return null;
}
export function sell(c: TradeCtx, t: SellTarget, qty: number): string | null {
  const p = sellProblem(c, t, qty);
  if (p) return p;
  const total = sellUnit(targetBuyPrice(c, t)) * qty;
  c.m.wallet -= total;
  c.g.gold += total;
  if (t.stack) {
    removeStack(c.g, t.stack, qty);
    const e = c.m.buyback.find((x) => x.kind === 'stack' && x.key === t.stack);
    if (e && e.kind === 'stack') e.qty += qty;
    else c.m.buyback.push({ kind: 'stack', key: t.stack, qty });
  } else {
    const k = c.g.items.findIndex((i) => i.uid === t.uid);
    const [it] = c.g.items.splice(k, 1);
    c.m.buyback.push({ kind: 'item', item: it });
  }
  return null;
}

// ------------------------------------------------------------------ buyback
export function buybackUnit(e: Entry): number {
  return e.kind === 'stack' ? stackBuyPrice(e.key) : itemBuyPrice(e.item);
}
export function buybackProblem(c: TradeCtx, idx: number, qty: number): string | null {
  if (c.inCombat) return 'Торговля только вне боя';
  const e = c.m.buyback[idx];
  if (!e) return 'Нет такой записи';
  const p = qtyProblem(qty, e.kind === 'stack');
  if (p) return p;
  if (e.kind === 'stack' && qty > e.qty) return `Продано только ${e.qty}`;
  const total = buybackUnit(e) * qty;
  if (c.g.gold < total) return `Нужно ${total} зол.`;
  return null;
}
/** D139 / D140: the full buy price; the purse gets the money (D145); the cycle is not started (D147). */
export function buyBack(c: TradeCtx, idx: number, qty: number): string | null {
  const p = buybackProblem(c, idx, qty);
  if (p) return p;
  const e = c.m.buyback[idx];
  const total = buybackUnit(e) * qty;
  c.g.gold -= total;
  c.m.wallet += total;
  if (e.kind === 'item') {
    c.m.buyback.splice(idx, 1);
    c.g.items.push(e.item);
  } else {
    addStack(c.g, e.key, qty);
    e.qty -= qty;
    if (e.qty <= 0) c.m.buyback.splice(idx, 1);
  }
  return null;
}

// ------------------------------------------------------------------ restock
/**
 * D142–D146: once started, every 120 active minutes the restockable offers return to their
 * initial stock (no excess) and the purse becomes max(current, initial). Equipment, tools and
 * runes never restock; the buyback list is untouched.
 */
export function tickMerchant(id: MerchantId, m: MerchantState, dt: number) {
  if (m.cycleLeft === null) return;
  m.cycleLeft -= dt;
  while (m.cycleLeft <= 0) {
    for (const o of OFFERS[id]) if (o.replenishes) m.stock[o.id] = Math.max(m.stock[o.id] ?? 0, o.stock);
    m.wallet = Math.max(m.wallet, WALLET[id]);
    m.cycleLeft += RESTOCK_SECONDS;
  }
}

export function offerName(c: { m: MerchantState }, o: OfferDef): string {
  const g = offerGoods(o);
  if ('stack' in g) return stackName(g.stack);
  const it = c.m.gear[o.id];
  return it ? itemName(it) : itemName({ uid: '', tpl: g.tpl, rarity: g.rarity, affixes: [], upgrade: null, fav: false });
}
export { STACK_MAX };

import LOOT from '../data/bestiaryLoot.json';
import type { GrowthData } from '../growth/growth';
import { AFFIXES, RARITIES, isItemTpl, makeItem, type Item, type Rarity } from '../growth/items';
import type { Container, Entry } from './bag';
import { isStackKey } from './goods';
import { SOURCE_BY_ID, newNode, type NodeState } from './gather';
import { MERCHANT_IDS, OFFERS, newMerchant, type MerchantId, type MerchantState } from './trade';

/**
 * The stage 4 part of the world snapshot (D040): corpses with their loot and active-time
 * timers, one-off chests (contents fixed when the playthrough is created, D096), resource points
 * and the merchants' stock, purses, cycles and buyback lists. Plus the test scene's layout.
 */
export interface CorpseState {
  id: string;
  enemy: string;
  name: string;
  rank: string;
  x: number;
  y: number;
  z: number;
  /** Active seconds until it disappears with whatever is left in it (D022 / D023). */
  left: number;
  box: Container;
}

export interface EconomyWorld {
  corpses: CorpseState[];
  chests: Record<string, Container>;
  nodes: Record<string, NodeState>;
  merchants: Record<MerchantId, MerchantState>;
  nextCorpse: number;
}

interface LootRow {
  kind: 'material' | 'gold' | 'gear' | 'consumable';
  key: string;
  min: number;
  max: number;
  chance: number;
  skill: string | null;
  tool: string | null;
  rarity: Rarity;
}
const LOOT_BY_ENEMY = LOOT.loot as Record<string, LootRow[]>;
export const RANKS = LOOT.ranks as Record<string, { name: string; respawn: number; corpse: number }>;
export const CHEST_SLOTS = 50;

// ------------------------------------------------------------------ layout of the test scene
export const CHEST_SPOTS = [
  { id: 'reward-chest-elder', name: 'Сундук Круга древних деревьев', x: 46, z: 78 },
  { id: 'reward-chest-tempest', name: 'Сундук Грозового хребта', x: 50, z: 78 },
  { id: 'reward-chest-warden', name: 'Сундук старых руин', x: 54, z: 78 },
  { id: 'chest-test', name: 'Сундук испытателя', x: 58, z: 78 },
];
export const NODE_SPOTS = [
  { id: 'n-red', src: 'node-red', x: 44, z: 83 },
  { id: 'n-blue', src: 'node-blue', x: 47, z: 83 },
  { id: 'n-yellow', src: 'node-yellow', x: 50, z: 83 },
  { id: 'n-ore', src: 'node-ore', x: 53, z: 83 },
  { id: 'n-wood', src: 'node-wood', x: 56, z: 83 },
  { id: 'n-moon', src: 'node-moon', x: 44, z: 87 },
  { id: 'n-blood', src: 'node-blood', x: 47, z: 87 },
  { id: 'n-starore', src: 'node-starore', x: 50, z: 87 },
  { id: 'n-crystal', src: 'node-crystal', x: 53, z: 87 },
  { id: 'n-oldwood', src: 'node-oldwood', x: 56, z: 87 },
];
/** Мира is the alchemist and the magic mentor at once (one NPC, D205). */
export const MERCHANT_SPOTS: { id: MerchantId; x: number; z: number }[] = [
  { id: 'smith', x: 48, z: 70 },
  { id: 'cook', x: 51, z: 70 },
  { id: 'hunter', x: 54, z: 70 },
  { id: 'supplier', x: 57, z: 70 },
];
export const STATION_SPOTS = [
  { id: 'forge' as const, x: 48, z: 74 },
  { id: 'alchemy' as const, x: 52, z: 74 },
  { id: 'stove' as const, x: 56, z: 74 },
];

// ------------------------------------------------------------------ creation
const chest = (entries: Entry[] = [], gold = 0): Container => ({ entries, gold, cap: CHEST_SLOTS });

function rollRows(rows: LootRow[], uid: () => string, rnd: () => number): Container {
  const box: Container = { entries: [], gold: 0, cap: null };
  for (const r of rows) {
    if (rnd() * 100 >= r.chance) continue;
    const q = r.min + Math.min(r.max - r.min, Math.floor(rnd() * (r.max - r.min + 1)));
    if (r.kind === 'gold') box.gold += q;
    else if (r.kind === 'gear') for (let i = 0; i < q; i++) box.entries.push({ kind: 'item', item: makeItem(uid(), r.key, r.rarity, rnd) });
    else box.entries.push({ kind: 'stack', key: r.key, qty: q, tool: r.tool, skill: r.skill });
  }
  return box;
}

/** D096: every chest and its items' random properties are decided now, once per playthrough. */
export function newEconomyWorld(g: GrowthData, rnd: () => number = Math.random): EconomyWorld {
  const uid = () => 'i' + g.nextUid++;
  const chests: Record<string, Container> = {};
  for (const c of LOOT.chests as { id: string; contents: LootRow[] }[]) {
    const box = rollRows(c.contents, uid, rnd);
    chests[c.id] = chest(box.entries, box.gold);
  }
  // a test chest with random goods: gold, a random-rarity weapon, materials (one stack above 99) and potions
  const tpls = ['sword1', 'bow1', 'staff1', 'sword2', 'greatsword1'];
  const rar: Rarity[] = ['uncommon', 'rare', 'epic'];
  chests['chest-test'] = chest(
    [
      { kind: 'item', item: makeItem(uid(), tpls[Math.floor(rnd() * tpls.length)], rar[Math.floor(rnd() * rar.length)], rnd) },
      { kind: 'stack', key: 'coal', qty: 99 },
      { kind: 'stack', key: 'coal', qty: 51 },
      { kind: 'stack', key: 'ore', qty: 6 + Math.floor(rnd() * 7) },
      { kind: 'stack', key: 'red', qty: 4 + Math.floor(rnd() * 5) },
      { kind: 'stack', key: 'water', qty: 3 },
      { kind: 'stack', key: 'bottle', qty: 3 },
      { kind: 'stack', key: 'potionHP1', qty: 2 },
    ],
    40 + Math.floor(rnd() * 81),
  );
  const nodes: Record<string, NodeState> = {};
  for (const n of NODE_SPOTS) nodes[n.id] = newNode(n.src, rnd);
  const merchants = {} as Record<MerchantId, MerchantState>;
  for (const id of MERCHANT_IDS) merchants[id] = newMerchant(id, uid, rnd);
  return { corpses: [], chests, nodes, merchants, nextCorpse: 1 };
}

/** D036 / D095: the corpse's loot is rolled once at death, trophies keep their knife / hunting needs. */
export function corpseFromKill(w: EconomyWorld, g: GrowthData, e: { uid: string; def: string; x: number; y: number; z: number }, name: string, rank: string, rnd: () => number = Math.random): CorpseState {
  const box = rollRows(LOOT_BY_ENEMY[e.def] ?? [], () => 'i' + g.nextUid++, rnd);
  const c: CorpseState = { id: `c${w.nextCorpse++}`, enemy: e.def, name, rank, x: e.x, y: e.y, z: e.z, left: (RANKS[rank]?.corpse ?? 5) * 60, box };
  w.corpses.push(c);
  return c;
}

export function lootTable(enemy: string): LootRow[] {
  return LOOT_BY_ENEMY[enemy] ?? [];
}

// ------------------------------------------------------------------ save check
function checkItem(it: any, f: string): Item {
  if (!it || typeof it.uid !== 'string' || !isItemTpl(it.tpl) || !RARITIES.includes(it.rarity) || !Array.isArray(it.affixes)) throw new Error(`поле «${f}»`);
  for (const a of it.affixes) if (!a || !AFFIXES[a.id as keyof typeof AFFIXES] || typeof a.value !== 'number') throw new Error(`поле «${f}.affixes»`);
  return { uid: it.uid, tpl: it.tpl, rarity: it.rarity, affixes: it.affixes.map((a: any) => ({ id: a.id, value: a.value })), upgrade: it.upgrade === 'sharp' || it.upgrade === 'tempered' ? it.upgrade : null, fav: it.fav === true };
}
function checkBox(b: any, f: string, cap: number | null): Container {
  const num = (v: unknown, ff: string) => {
    if (typeof v !== 'number' || !Number.isFinite(v) || v < 0) throw new Error(`поле «${ff}»`);
    return v;
  };
  if (!b || !Array.isArray(b.entries)) throw new Error(`поле «${f}»`);
  const entries: Entry[] = b.entries.map((e: any, i: number) => {
    if (e?.kind === 'item') return { kind: 'item', item: checkItem(e.item, `${f}.entries.${i}`) };
    if (e?.kind === 'stack' && isStackKey(e.key)) {
      const qty = num(e.qty, `${f}.entries.${i}.qty`);
      if (qty < 1 || qty !== Math.floor(qty) || (cap !== null && qty > 99)) throw new Error(`поле «${f}.entries.${i}.qty»`);
      const out: Entry = { kind: 'stack', key: e.key, qty };
      if ('tool' in e) out.tool = typeof e.tool === 'string' ? e.tool : null;
      if ('skill' in e) out.skill = typeof e.skill === 'string' ? e.skill : null;
      return out;
    }
    throw new Error(`поле «${f}.entries.${i}»`);
  });
  if (cap !== null && entries.length > cap) throw new Error(`поле «${f}»: больше ${cap} слотов`);
  return { entries, gold: num(b.gold, `${f}.gold`), cap };
}
/** Checks a saved world block (refused when broken, never partly loaded). */
export function checkWorld(raw: unknown): EconomyWorld {
  const r = raw as any;
  if (!r || typeof r !== 'object') throw new Error('поле «world»');
  const num = (v: unknown, f: string) => {
    if (typeof v !== 'number' || !Number.isFinite(v)) throw new Error(`поле «world.${f}»`);
    return v;
  };
  if (!Array.isArray(r.corpses)) throw new Error('поле «world.corpses»');
  const corpses: CorpseState[] = r.corpses.map((c: any, i: number) => ({
    id: String(c?.id), enemy: String(c?.enemy), name: String(c?.name), rank: RANKS[c?.rank] ? c.rank : 'normal',
    x: num(c?.x, `corpses.${i}.x`), y: num(c?.y, `corpses.${i}.y`), z: num(c?.z, `corpses.${i}.z`), left: num(c?.left, `corpses.${i}.left`),
    box: checkBox(c?.box, `world.corpses.${i}.box`, null),
  }));
  const chests: Record<string, Container> = {};
  for (const s of CHEST_SPOTS) chests[s.id] = checkBox(r.chests?.[s.id], `world.chests.${s.id}`, CHEST_SLOTS);
  const nodes: Record<string, NodeState> = {};
  for (const s of NODE_SPOTS) {
    const n = r.nodes?.[s.id];
    const stock = num(n?.stock, `nodes.${s.id}.stock`);
    const src = SOURCE_BY_ID[s.src];
    if (stock < 0 || stock > src.stock.max) throw new Error(`поле «world.nodes.${s.id}.stock»`);
    nodes[s.id] = { src: s.src, stock, respawnLeft: n.respawnLeft === null ? null : num(n.respawnLeft, `nodes.${s.id}.respawnLeft`) };
  }
  const merchants = {} as Record<MerchantId, MerchantState>;
  for (const id of MERCHANT_IDS) {
    const m = r.merchants?.[id];
    if (!m) throw new Error(`поле «world.merchants.${id}»`);
    const stock: Record<string, number> = {};
    for (const o of OFFERS[id]) {
      const v = num(m.stock?.[o.id], `merchants.${id}.stock.${o.id}`);
      if (v < 0 || v > o.stock) throw new Error(`поле «world.merchants.${id}.stock.${o.id}»`);
      stock[o.id] = v;
    }
    const gear: Record<string, Item> = {};
    for (const [k, v] of Object.entries(m.gear ?? {})) gear[k] = checkItem(v, `world.merchants.${id}.gear.${k}`);
    merchants[id] = {
      stock, gear, wallet: num(m.wallet, `merchants.${id}.wallet`),
      cycleLeft: m.cycleLeft === null ? null : num(m.cycleLeft, `merchants.${id}.cycleLeft`),
      buyback: checkBox({ entries: m.buyback, gold: 0 }, `world.merchants.${id}.buyback`, null).entries,
    };
  }
  return { corpses, chests, nodes, merchants, nextCorpse: num(r.nextCorpse, 'nextCorpse') };
}

/** Every item uid in the world (with the hero's) must be unique: a duplicate means a broken record. */
export function worldUids(w: EconomyWorld): string[] {
  const out: string[] = [];
  const box = (b: Container) => b.entries.forEach((e) => e.kind === 'item' && out.push(e.item.uid));
  w.corpses.forEach((c) => box(c.box));
  Object.values(w.chests).forEach(box);
  for (const m of Object.values(w.merchants)) {
    out.push(...Object.values(m.gear).map((i) => i.uid));
    m.buyback.forEach((e) => e.kind === 'item' && out.push(e.item.uid));
  }
  return out;
}

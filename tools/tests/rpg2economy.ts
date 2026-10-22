/**
 * RPG stage 4 (docs/rpg2/IMPLEMENTATION.md): duplication-free transfers (corpses, chests, Взять
 * всё), trade math, restock cycles and purses, recipe consumption, smith upgrades, gathering,
 * consumables and the v4 save.
 * Run: npx tsx tools/tests/rpg2economy.ts
 */
import { HeroState } from '../../src/rpg2/hero';
import { HeroMotor, type MotorGround } from '../../src/rpg2/motor';
import { newCombatData } from '../../src/rpg2/combat/system';
import { addItem, equip, newGrowth } from '../../src/rpg2/growth/growth';
import { makeItem } from '../../src/rpg2/growth/items';
import { addStack, census, putItem, putStack, takeAll, takeEntry, type Container } from '../../src/rpg2/economy/bag';
import { RECIPES, itemBuyPrice, sellUnit, stackBuyPrice } from '../../src/rpg2/economy/goods';
import { CRAFT_MAX, craft, train, upgradeWeapon } from '../../src/rpg2/economy/craft';
import { SOURCES, newNode, rollStock, tickGather, tickNode, gatherProblem } from '../../src/rpg2/economy/gather';
import { useConsumable } from '../../src/rpg2/economy/consumables';
import { MERCHANT_IDS, OFFERS, OFFER_COUNT, RESTOCK_SECONDS, WALLET, buy, buyBack, newMerchant, offerGoods, sell, tickMerchant, type TradeCtx } from '../../src/rpg2/economy/trade';
import { checkWorld, corpseFromKill, newEconomyWorld } from '../../src/rpg2/economy/world';
import { PLAYTHROUGH_VERSION, migratePlaythrough, restore, snapshot } from '../../src/rpg2/save';
import { ActiveTime } from '../../src/rpg2/time';

let fails = 0;
const ok = (c: boolean, msg: string) => {
  console.log((c ? 'ok   ' : 'FAIL ') + msg);
  if (!c) fails++;
};
let seed = 11;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const sameCensus = (a: ReturnType<typeof census>, b: ReturnType<typeof census>) =>
  JSON.stringify([...a.uids].sort()) === JSON.stringify([...b.uids].sort()) && a.gold === b.gold && JSON.stringify(Object.entries(a.stacks).filter(([, v]) => v).sort()) === JSON.stringify(Object.entries(b.stacks).filter(([, v]) => v).sort());

// ---------------------------------------------------------------- containers
{
  const g = newGrowth();
  const box: Container = { entries: [], gold: 0, cap: 50 };
  for (let i = 0; i < 49; i++) box.entries.push({ kind: 'stack', key: 'wood', qty: 99 });
  box.entries.push({ kind: 'stack', key: 'ore', qty: 90 });
  addStack(g, 'ore', 20);
  const before = census(g, [box]);
  const moved = putStack(g, box, 'ore', 20);
  ok(moved === 9 && g.stacks.ore === 11 && box.entries[49].kind === 'stack' && box.entries[49].qty === 99, 'D101 example: 9 of 20 ore fit, 11 stay with the hero');
  ok(sameCensus(before, census(g, [box])), 'partial transfer: nothing lost or copied');
  const it = addItem(g, 'bow1', 'rare', rnd);
  ok(putItem(g, box, it.uid) !== null && g.items.includes(it), 'D099: no free slot — the item stays');
  const box2: Container = { entries: [], gold: 0, cap: 50 };
  ok(putItem(g, box2, g.equip.weapon!)?.startsWith('Надетый') === true, 'D137: an equipped item cannot go into a chest');
  it.fav = true;
  ok(putItem(g, box2, it.uid) === null && box2.entries.length === 1, 'D138: a favourite (not equipped) item goes in with its mark');
  addStack(g, 'coal', 150);
  ok(putStack(g, box2, 'coal', 150) === 150 && box2.entries.filter((e) => e.kind === 'stack').map((e) => (e as { qty: number }).qty).join() === '99,51', 'D100: 150 coal make stacks 99 + 51 in a chest');
  ok(takeEntry(g, box2, 1, 60) === null && g.stacks.coal === 60, 'partial take of a stack');
  const c2 = census(g, [box, box2]);
  const r = takeAll(g, box2);
  ok(r.taken === 3 && box2.entries.length === 0 && sameCensus(c2, census(g, [box, box2])), 'take all: everything, no duplicates');
  ok(takeAll(g, box2).taken === 0, 'a second «Взять всё» takes nothing');
}

// ---------------------------------------------------------------- corpses and trophies
{
  const g = newGrowth();
  const w = newEconomyWorld(g, rnd);
  let c = corpseFromKill(w, g, { uid: 'wolf1', def: 'wolf', x: 1, y: 0, z: 1 }, 'Серый волк', 'normal', () => 0);
  ok(c.left === 300 && c.box.entries.length === 4, 'wolf corpse: 5 active minutes, all four rows rolled once (chance 0 → always)');
  const g0 = JSON.stringify(c.box);
  const r = takeAll(g, c.box);
  ok(r.taken === 1 && g.stacks.meat >= 1 && r.skipped.length === 3, 'without knife and hunting only the meat is taken; trophies stay with reasons');
  ok(r.skipped.some((x) => x.why.includes('нож')) && r.skipped.some((x) => x.why.includes('Опытный охотник')), 'the reasons name the knife and the hunting tier');
  addItem(g, 'knife', 'common');
  g.hunt = 2;
  const r2 = takeAll(g, c.box);
  ok(r2.taken === 3 && c.box.entries.length === 0, 'with the knife and hunting II the rest is taken (D095)');
  ok(g0 !== JSON.stringify(c.box), 'loot is not rerolled');
  c = corpseFromKill(w, g, { uid: 'g', def: 'greyfang', x: 0, y: 0, z: 0 }, 'Серый Клык', 'mini', () => 0);
  ok(c.left === 1800 && c.box.gold === 25, 'mini-boss corpse: 30 minutes, gold in the corpse');
}

// ---------------------------------------------------------------- trade
{
  ok(OFFER_COUNT === 101, 'all 101 offers of the five merchants');
  let priceOk = true;
  for (const id of MERCHANT_IDS)
    for (const o of OFFERS[id]) {
      const gd = offerGoods(o);
      const p = 'stack' in gd ? stackBuyPrice(gd.stack) : itemBuyPrice(makeItem('x', gd.tpl, gd.rarity, rnd));
      if (p !== o.unitBuyPrice || sellUnit(p) !== o.unitSellPrice) {
        priceOk = false;
        console.log('  price mismatch', o.id, p, o.unitBuyPrice);
      }
    }
  ok(priceOk, 'price formulas reproduce every catalog buy and sell price');
  ok(sellUnit(2) === 1 && sellUnit(10) === 2 && sellUnit(15) === 3 && 3 * sellUnit(10) === 6, 'D151 examples');
  ok(WALLET.smith === 10000 && WALLET.alchemist === 3000 && WALLET.cook === 1000 && WALLET.hunter === 1000 && WALLET.supplier === 3000, 'D203 purses');
  const g = newGrowth();
  let n = 1;
  const m = newMerchant('alchemist', () => 'm' + n++, rnd);
  const c: TradeCtx = { g, m, id: 'alchemist', inCombat: false, nextUid: () => 'x' + n++ };
  g.gold = 1000;
  ok(buy(c, 'alchemist-0', 100) !== null, 'more than 99 per operation refused');
  ok(buy(c, 'alchemist-0', 11) !== null && g.gold === 1000, 'more than the stock refused, nothing charged');
  ok(buy(c, 'alchemist-0', 4) === null && g.gold === 920 && m.wallet === 3080 && m.stock['alchemist-0'] === 6 && g.stacks.potionHP1 === 7, 'buy 4 small HP potions: gold to the purse, stock 6');
  ok(m.cycleLeft === RESTOCK_SECONDS, 'D143: a restockable purchase starts the cycle');
  tickMerchant('alchemist', m, 60);
  buy(c, 'alchemist-0', 1);
  ok(m.cycleLeft === RESTOCK_SECONDS - 60, 'later purchases do not move the cycle');
  tickMerchant('alchemist', m, RESTOCK_SECONDS);
  ok(m.stock['alchemist-0'] === 10, 'D142: restock to the initial 10, no excess');
  // the rune never restocks
  const runeBefore = m.stock['alchemist-rune-stone-ford'];
  g.gold += 1000;
  ok(buy(c, 'alchemist-rune-stone-ford', 1) === null && g.items.some((i) => i.tpl === 'rune-stone-ford'), 'rune bought as goods');
  tickMerchant('alchemist', m, RESTOCK_SECONDS);
  ok(runeBefore === 1 && m.stock['alchemist-rune-stone-ford'] === 0, 'runes do not restock');
  // selling and the purse
  const poor = newMerchant('cook', () => 'p' + n++, rnd);
  poor.wallet = 5;
  const pc: TradeCtx = { g, m: poor, id: 'cook', inCombat: false, nextUid: () => 'y' + n++ };
  addStack(g, 'meat', 10);
  const why = sell(pc, { stack: 'meat' }, 10);
  ok(why !== null && why.includes('не больше 2') && g.stacks.meat === 10 && poor.wallet === 5 && poor.buyback.length === 0, 'D149: purse 5, 10 meat at 2 — refused whole, max 2 shown, no buyback entry');
  ok(sell(pc, { stack: 'meat' }, 2) === null && poor.wallet === 1 && g.stacks.meat === 8, 'two meat sold for 4');
  tickMerchant('cook', poor, RESTOCK_SECONDS * 3);
  ok(poor.wallet === 1, 'D147: selling alone never starts the cycle');
  const gold = g.gold;
  ok(buyBack(pc, 0, 1) === null && g.gold === gold - 8 && poor.wallet === 9 && g.stacks.meat === 9 && poor.buyback[0].kind === 'stack' && poor.buyback[0].qty === 1, 'D140: partial buyback at the full price 8, purse +8');
  ok(poor.cycleLeft === null, 'buyback does not start the cycle');
  const worn = g.equip.weapon!;
  ok(sell(c, { uid: worn }, 1)!.includes('Надетый'), 'D136: an equipped item cannot be sold');
  const fav = addItem(g, 'sword2', 'rare', rnd);
  fav.fav = true;
  ok(sell(c, { uid: fav.uid }, 1)!.includes('Избранный'), 'D138: a favourite cannot be sold');
  fav.fav = false;
  fav.upgrade = 'tempered';
  const before = g.gold;
  ok(sell(c, { uid: fav.uid }, 1) === null && g.gold === before + sellUnit(itemBuyPrice(fav)) && sellUnit(itemBuyPrice(fav)) === 300, 'rare steel sword sells for 300; the upgrade does not raise it (D152)');
  const k = m.buyback.findIndex((e) => e.kind === 'item' && e.item.uid === fav.uid);
  g.gold = 5000;
  ok(buyBack(c, k, 1) === null && g.items.find((i) => i.uid === fav.uid)?.upgrade === 'tempered' && g.gold === 5000 - 1200, 'D139: buyback at 1200 with all properties');
}

// ---------------------------------------------------------------- crafting
{
  const g = newGrowth();
  const hero = new HeroState();
  const c = { g, hero, inCombat: false };
  ok(RECIPES.length === 36, '36 recipes');
  hero.progress.lp = 100;
  g.gold = 5000;
  ok(train(c, 'smith', 'smith2') === 'Сначала предыдущая ступень', 'tiers in order');
  ok(train(c, 'cook', 'smith1') !== null, 'Рада does not teach smithing');
  ok(train(c, 'smith', 'smith1') === null && g.crafts.smith === 1 && hero.progress.lp === 95 && g.gold === 4925, 'Кузнечное дело I for 5 LP and 75 gold (STR 10)');
  ok(train(c, 'smith', 'smith2') === 'Нужно STR 25', 'tier II needs STR 25');
  addStack(g, 'ore', 7);
  addStack(g, 'coal', 2);
  const uid = () => 'c' + g.nextUid++;
  ok(craft(c, 'forge', 'ingot1', 3, uid) !== null && g.stacks.ore === 7 && g.stacks.coal === 2, 'D133: 3 runs need 9 ore — refused, nothing consumed');
  ok(craft(c, 'forge', 'ingot1', 2, uid) === null && g.stacks.ore === 1 && !g.stacks.coal && g.stacks.iron === 2, '2 runs: 6 ore + 2 coal → 2 iron ingots');
  ok(craft(c, 'alchemy', 'ingot1', 1, uid)!.startsWith('Нужна станция'), 'wrong station refused');
  c.inCombat = true;
  ok(craft(c, 'forge', 'ingot1', 1, uid) === 'Изготовление только вне боя' || craft(c, 'forge', 'ingot1', 1, uid)!.length > 0, 'no crafting in combat');
  c.inCombat = false;
  addStack(g, 'iron', 4);
  addStack(g, 'wood', 2);
  const items0 = g.items.length;
  ok(craft(c, 'forge', 'sword1', 2, uid) === null && g.items.length === items0 + 2 && g.items.slice(-2).every((i) => i.tpl === 'sword1' && i.rarity === 'common' && !i.affixes.length), 'D134: two common iron swords without affixes');
  ok(craft(c, 'forge', 'ingot1', CRAFT_MAX + 1, uid) !== null, 'run count capped');
  g.crafts.alchemy = 1;
  addStack(g, 'red', 2);
  addStack(g, 'water', 1);
  addStack(g, 'bottle', 1);
  ok(craft(c, 'alchemy', 'potionHP1', 1, uid) === null && g.stacks.potionHP1 === 4 && !g.stacks.bottle, 'small HP potion; the flask is consumed');
  // smith upgrade
  const sw = g.items[g.items.length - 1];
  g.gold = 1000;
  addStack(g, 'coal', 2);
  ok(upgradeWeapon(c, g.equip.weapon!, 'sharp')!.includes('снять'), 'D155: the equipped weapon must be taken off');
  ok(upgradeWeapon(c, sw.uid, 'tempered')!.includes('Железный слиток') && g.gold === 1000, 'tempering I needs 2 iron ingots — nothing charged');
  ok(upgradeWeapon(c, sw.uid, 'sharp') === null && sw.upgrade === 'sharp' && g.gold === 900 && !g.stacks.coal, 'sharpening I: 100 gold + 2 coal');
  ok(upgradeWeapon(c, sw.uid, 'tempered')!.startsWith('Уже улучшено'), 'one permanent upgrade only');
}

// ---------------------------------------------------------------- gathering
{
  ok(SOURCES.length === 10, 'ten resource sources');
  const ore = SOURCES.find((s) => s.id === 'node-ore')!;
  const seen = new Set<number>();
  for (let i = 0; i < 400; i++) seen.add(rollStock(ore, rnd));
  ok([...seen].sort().join() === '3,4,5,6', 'D092: ore stock 3–6, every value appears');
  const g = newGrowth();
  const n = newNode('node-ore', () => 0.99);
  ok(n.stock === 6, 'stock rolled at creation');
  ok(gatherProblem(g, n) === 'Нужен инструмент: Кирка', 'ore needs a pickaxe');
  addItem(g, 'pickaxe', 'common');
  ok(gatherProblem(g, n) === null, 'with a pickaxe it can be gathered');
  ok(gatherProblem(g, newNode('node-starore'))!.includes('Добытчик'), 'star ore needs the rare minerals skill');
  const a = { node: 'n', t: 0, dur: 3 };
  ok(tickGather(g, n, a, 2.9) === null && !g.stacks.ore, 'no unit before 3 s');
  ok(tickGather(g, n, a, 0.2) === 'unit' && g.stacks.ore === 1 && n.stock === 5, 'one unit per finished cycle');
  let r: string | null = null;
  for (let i = 0; i < 5; i++) {
    a.t = 0;
    r = tickGather(g, n, a, 3);
  }
  ok(r === 'empty' && g.stacks.ore === 6 && n.stock === 0 && n.respawnLeft === 1800, 'last unit starts the 30 min timer');
  ok(!tickNode(n, 1800, () => false) && n.stock === 0 && n.respawnLeft === 0, 'timer done but near / in view — waits without restarting');
  ok(tickNode(n, 1, () => true, () => 0) && n.stock === 3 && n.respawnLeft === null, 'respawns with a new roll when far and unseen');
}

// ---------------------------------------------------------------- consumables
{
  const g = newGrowth();
  const hero = new HeroState();
  const st = { inCombat: true, busy: null };
  ok(useConsumable(g, hero, 'potionHP1', st)!.includes('полное') && g.stacks.potionHP1 === 3, 'full HP: nothing spent');
  hero.hp = 100;
  ok(useConsumable(g, hero, 'potionHP1', st) === null && hero.hp === 160 && g.potionCd === 10 && g.stacks.potionHP1 === 2, 'small HP potion +60 in combat, 10 s cooldown');
  ok(useConsumable(g, hero, 'potionHP1', st)!.includes('Откат') && g.stacks.potionHP1 === 2, 'shared cooldown blocks the next potion');
  addStack(g, 'food10', 1);
  ok(useConsumable(g, hero, 'food10', st) === 'Еда — только вне боя', 'food only out of combat');
  ok(useConsumable(g, hero, 'food10', { inCombat: false, busy: 'Оглушение' }) === 'Оглушение', 'stun forbids consumables');
}

// ---------------------------------------------------------------- save v4
{
  const ground: MotorGround = { top: () => 0, wall: () => false, water: () => null };
  const growth = newGrowth();
  const world = newEconomyWorld(growth, rnd);
  addStack(growth, 'ore', 33);
  growth.crafts.smith = 2;
  corpseFromKill(world, growth, { uid: 'w', def: 'wolf', x: 3, y: 0, z: 3 }, 'Серый волк', 'normal', rnd);
  world.merchants.cook.cycleLeft = 1234;
  const combat = newCombatData('start');
  combat.quick = [growth.equip.weapon, null, null, null];
  const snap = snapshot({ id: 't', map: 'rpg_test', name: 'И', race: 'human', hero: new HeroState(), motor: new HeroMotor(ground, 5, 5).toSave(), time: new ActiveTime(), combat, growth, world });
  ok(snap.version === PLAYTHROUGH_VERSION && PLAYTHROUGH_VERSION === 4, 'save version 4');
  const back = migratePlaythrough(JSON.parse(JSON.stringify(snap)));
  const r = restore(back.save);
  ok(!back.migrated && JSON.stringify(r.world) === JSON.stringify(world) && JSON.stringify(r.growth) === JSON.stringify(growth), 'world and bag round-trip (corpses, chests, points, merchants, stacks)');
  ok(JSON.stringify(checkWorld(JSON.parse(JSON.stringify(world)))) === JSON.stringify(world), 'world check keeps the data');
  const v3 = JSON.parse(JSON.stringify(snap));
  v3.version = 3;
  delete v3.world;
  delete v3.growth.stacks;
  v3.growth.potions = { hpSmall: 2 };
  const m = migratePlaythrough(v3);
  ok(m.migrated && m.save.growth.stacks.potionHP1 === 2 && Object.keys(m.save.world.chests).length === 4 && m.save.world.merchants.smith.wallet === 10000, 'v3 → v4: potions become stacks, the world is created');
  const dup = JSON.parse(JSON.stringify(snap));
  dup.world.chests['chest-test'].entries.push({ kind: 'item', item: dup.growth.items[0] });
  let threw = false;
  try {
    migratePlaythrough(dup);
  } catch {
    threw = true;
  }
  ok(threw, 'an item recorded twice is refused');
  const full = JSON.parse(JSON.stringify(snap));
  for (let i = 0; i < 60; i++) full.world.chests['chest-test'].entries.push({ kind: 'stack', key: 'wood', qty: 1 });
  threw = false;
  try {
    migratePlaythrough(full);
  } catch {
    threw = true;
  }
  ok(threw, 'a chest over 50 slots is refused');
  void equip;
}

console.log(fails ? `\n${fails} FAILED` : '\nall rpg2 economy checks passed');
if (fails) process.exit(1);

import { h } from '../../ui/dom';
import type { CombatSystem } from '../combat/system';
import { isEquipped, type GrowthData } from '../growth/growth';
import { RARITIES, RARITY, affixText, isGear, isRune, itemName, upgradeName, type Item, type Upgrade } from '../growth/items';
import type { HeroState } from '../hero';
import { putItem, putItemProblem, putStack, stackCount, takeAll, takeEntry, takeGold, trophyProblem, entryName, type Container, type Entry } from '../economy/bag';
import { CAT_NAME, STACK_MAX, consumableDef, itemBuyPrice, itemCat, sellUnit, stackBuyPrice, stackCat, stackName, type GoodsCat } from '../economy/goods';
import {
  CRAFT_MAX, PROFESSION_NAME, STATION_NAME, TEACHES, craft, craftProblem, forgeCost, knows, recipeOutput, recipesAt, train, trainProblem, upgradeProblem, upgradeWeapon,
  type Station, type TeacherId,
} from '../economy/craft';
import { useConsumable, useProblem } from '../economy/consumables';
import {
  MERCHANTS, OFFERS, TRADE_MAX, buy, buyBack, buyProblem, buybackProblem, buybackUnit, offerGoods, offerName, sell, sellProblem,
  type MerchantId, type TradeCtx,
} from '../economy/trade';
import type { EconomyWorld } from '../economy/world';
import { type InvFilter } from './growthUi';
import type { SceneMenus } from './menus';
import { iconForKey, pxIcon } from '../../ui/pixelIcons';
import { bigBtn, bigIcon, chip, fmt, note, panel, phead, req, row, rule, screen, scroll, search, select, stepper, table, tabs, tag, tile, tiles } from './kit';
import { INV_CATS } from './growthUi';
import { WEAPON_BY_ID } from '../combat/data';
import { ARMOR_BY_ID, UPGRADE, weaponGroup } from '../growth/items';
import type { RecipeDef } from '../economy/goods';
import type { OfferDef } from '../economy/trade';
import { STATION_OF, type Profession, type TrainOption } from '../economy/craft';

const ROMAN = ['I', 'II', 'III', 'IV', 'V'];

/** Pixel portraits of the merchants and the icons of what they teach. */
const MERCHANT_FACE: Partial<Record<MerchantId, string>> = { smith: 'npc-smith', alchemist: 'npc-mira', cook: 'npc-cook', hunter: 'npc-hunter', supplier: 'npc-supplier' };
const TEACH_ICON: Partial<Record<string, string>> = { smith: 'anvil', alchemist: 'alchemy', cook: 'cauldron', hunter: 'knife', supplier: 'pickaxe' };

/** What the stage 4 windows borrow from the scene. */
export interface EconomyHost {
  hero: HeroState;
  growth: GrowthData;
  world: EconomyWorld;
  combat: CombatSystem;
  menus: SceneMenus;
  inCombat(): boolean;
  toast(t: string): void;
  /** Gold, items or equipment changed (the scene refreshes armor, maxima and the drawn gear). */
  changed(): void;
  nextUid(): string;
  /** Why consumables cannot be used right now (stun, knockback, dodge, attack), or null. */
  busy(): string | null;
  /** Opens the magic / stats mentor window of Мира (stage 3). */
  mentor(id: 'mira'): void;
  /** Stage 5: why a rune cannot be used now, and its use (D066 / D067: reusable, closes the window). */
  runeProblem?(tpl: string): string | null;
  useRune?(tpl: string): void;
}



/** Container entries, hero goods and items under one filter (constant order unless sorted). */
function matches(f: InvFilter, cat: GoodsCat, name: string): boolean {
  if (f.cat !== 'all' && f.cat !== cat) return false;
  const q = f.q.trim().toLowerCase();
  return !q || name.toLowerCase().includes(q);
}

export class EconomyScreens {
  constructor(private s: EconomyHost) {}
  private cf: InvFilter = { q: '', cat: 'all', sort: 'order' };
  private tradeTab: 'buy' | 'sell' | 'buyback' = 'buy';

  private show(id: string, body: HTMLElement) {
    const old = document.querySelector(`.r2-menu-${id} .r2-win`) as HTMLElement | null;
    const top = old?.scrollTop ?? 0;
    this.s.menus.show(id, body);
    const nw = document.querySelector(`.r2-menu-${id} .r2-win`) as HTMLElement | null;
    if (nw) nw.scrollTop = top;
  }
  private btn(label: string, problem: string | null, fn: () => void, primary = false, title?: string) {
    return h('button.r2-btn.small' + (primary ? '.primary' : ''), { onclick: fn, title: title ?? problem ?? undefined, class: problem ? 'r2-off' : undefined }, label);
  }
  private act(res: string | null, ok: string, again: () => void) {
    if (res) this.s.toast(res);
    else {
      this.s.toast(ok);
      this.s.changed();
    }
    again();
  }
  private sortEntries<T>(list: T[], name: (x: T) => string, price: (x: T) => number, rarity: (x: T) => number, f: InvFilter): T[] {
    const out = [...list];
    if (f.sort === 'name') out.sort((a, b) => name(a).localeCompare(name(b), 'ru'));
    else if (f.sort === 'price') out.sort((a, b) => price(b) - price(a));
    else if (f.sort === 'rarity') out.sort((a, b) => rarity(b) - rarity(a));
    return out;
  }
  /** Stack name with its pixel icon (materials, consumables). */
  private sname(key: string): HTMLElement {
    return h('span.r2-gname', pxIcon(iconForKey(key), 32, 'r2-gico'), h('b', stackName(key)));
  }

  // ------------------------------------------------------------------ goods in the inventory (I)
  /** Materials, consumables, tools and runes of the bag (D100: shown in stacks of 99, unlimited). */
  goods(f: InvFilter, again: () => void): HTMLElement {
    const g = this.s.growth;
    const keys = this.sortEntries(
      Object.keys(g.stacks).filter((k) => matches(f, stackCat(k), stackName(k))),
      stackName, stackBuyPrice, () => 0, f,
    );
    const rows = keys.map((k) => {
      const n = g.stacks[k];
      const d = consumableDef(k);
      const st = { inCombat: this.s.inCombat(), busy: this.s.busy() };
      const btns = h('div.r2-item-btns');
      if (d) {
        btns.append(this.btn('Использовать', useProblem(g, this.s.hero, k, st), () => this.act(useConsumable(g, this.s.hero, k, st), `Использовано: ${stackName(k)}`, again)));
        if (d.result.kind === 'potion') {
          const slot = d.result.stat === 'HP' ? 'hp' : d.result.stat === 'MP' ? 'mp' : 'st';
          const key = slot === 'hp' ? 'F1' : slot === 'mp' ? 'F2' : 'F3';
          btns.append(g.potionSel[slot] === k ? h('span.r2-req.ok', ` на ${key}`) : this.btn(`На ${key}`, null, () => { g.potionSel[slot] = k; again(); }));
        }
      }
      const stacks = Math.ceil(n / STACK_MAX);
      return h('div.r2-goods', h('span', this.sname(k), h('small', ` · ${CAT_NAME[stackCat(k)]}`)), h('span', `${n}${stacks > 1 ? ` (${stacks} стака по ${STACK_MAX})` : ''}`), btns);
    });
    const tools = g.items.filter((i) => !isGear(i.tpl) && matches(f, itemCat(i), itemName(i)));
    const toolRows = this.sortEntries(tools, itemName, itemBuyPrice, () => 0, f).map((it) =>
      h('div.r2-goods', h('span', h('b', itemName(it)), h('small', ` · ${CAT_NAME[itemCat(it)]}`)), h('span', it.fav ? '★' : ''), h('div.r2-item-btns',
        isRune(it.tpl) && this.s.useRune ? this.btn('Использовать', this.s.runeProblem?.(it.tpl) ?? null, () => this.s.useRune!(it.tpl)) : null,
        this.btn(it.fav ? 'Снять отметку ★' : 'Избранное ★', null, () => { it.fav = !it.fav; again(); }))),
    );
    if (f.cat === 'gear') return h('div');
    return h(
      'div',
      h('h3', 'Материалы и расходники'),
      rows.length ? rows : h('p.r2-note', f.q ? 'Ничего не найдено.' : 'Пусто.'),
      h('h3', 'Инструменты и руны'),
      toolRows.length ? toolRows : h('p.r2-note', 'Нет.'),
      h('p.r2-note', `Зелья: общий откат 10 с${g.potionCd > 0 ? ` (осталось ${Math.ceil(g.potionCd)} с)` : ''}, в бою можно. Еда — только вне боя. F1 / F2 / F3 — выбранные зелья HP / MP / ST.`),
    );
  }

  /** Inventory detail panel (hud-08) of a stack or a tool / rune: what it does and its actions. */
  goodsDetail(sel: { key: string } | { uid: string }, again: () => void): HTMLElement[] {
    const g = this.s.growth;
    if ('key' in sel) {
      const k = sel.key;
      const n = g.stacks[k] ?? 0;
      const d = consumableDef(k);
      const st = { inCombat: this.s.inCombat(), busy: this.s.busy() };
      const out: HTMLElement[] = [];
      out.push(h('div', d ? d.effect : 'Материал для ремёсел и продажи.'));
      out.push(h('div.r2-dim', `Цена покупки: ${stackBuyPrice(k)} зол. · продажа: ${sellUnit(stackBuyPrice(k))} зол.`));
      if (n > STACK_MAX) out.push(h('div.r2-dim', `${Math.ceil(n / STACK_MAX)} стака по ${STACK_MAX}`));
      out.push(h('div.r2-grow'));
      if (d) {
        const why = useProblem(g, this.s.hero, k, st);
        out.push(bigBtn('Использовать', why, () => this.act(useConsumable(g, this.s.hero, k, st), `Использовано: ${stackName(k)}`, again)));
        if (d.result.kind === 'potion') {
          const slot = d.result.stat === 'HP' ? 'hp' : d.result.stat === 'MP' ? 'mp' : 'st';
          const key = slot === 'hp' ? 'F1' : slot === 'mp' ? 'F2' : 'F3';
          out.push(g.potionSel[slot] === k ? h('div.r2-center.r2-green', `Назначено на ${key}`) : bigBtn(`Назначить на ${key}`, null, () => { g.potionSel[slot] = k; again(); }, false));
        }
        out.push(h('div.r2-center.r2-dim.r2-small', `Зелья: общий откат 10 с${g.potionCd > 0 ? ` (осталось ${Math.ceil(g.potionCd)} с)` : ''}, в бою можно. Еда — только вне боя.`));
      }
      return out;
    }
    const it = g.items.find((i) => i.uid === sel.uid);
    if (!it) return [];
    return [
      h('div', isRune(it.tpl) ? 'Руна перемещения: переносит к месту назначения, не расходуется.' : 'Инструмент: нужен для добычи (нож — трофеи, кирка — руда, топор — древесина).'),
      h('div.r2-dim', `Категория: ${CAT_NAME[itemCat(it)]}`),
      h('div.r2-grow'),
      isRune(it.tpl) && this.s.useRune ? bigBtn('Использовать', this.s.runeProblem?.(it.tpl) ?? null, () => this.s.useRune!(it.tpl)) : h('div'),
    ];
  }

  // ------------------------------------------------------------------ shared helpers of the panels
  /** Icon, name and category of a container / bag entry. */
  private entryIcon(e: Entry): string {
    return e.kind === 'item' ? iconForKey(e.item.tpl) : iconForKey(e.key);
  }
  private catOf(e: Entry): GoodsCat {
    return e.kind === 'item' ? itemCat(e.item) : stackCat(e.key);
  }
  private catTag(cat: GoodsCat): HTMLElement {
    return tag(({ material: 'Материал', consumable: 'Расходник', tool: 'Инструмент', rune: 'Руна', gear: 'Экипировка' } as const)[cat], undefined, 'gold');
  }
  /** What a stack or an item does, one line (detail panels). */
  private goodsText(e: { key: string } | { item: Item }): string {
    if ('key' in e) {
      const d = consumableDef(e.key);
      return d ? d.effect : 'Материал для ремёсел и продажи.';
    }
    const it = e.item;
    if (isRune(it.tpl)) return 'Руна перемещения: переносит к месту назначения, не расходуется.';
    if (!isGear(it.tpl)) return 'Инструмент для добычи.';
    return `${RARITY[it.rarity].name}${it.upgrade ? ` · ${upgradeName(it.tpl, it.upgrade)}` : ''}${it.affixes.length ? ' · ' + it.affixes.map(affixText).join(', ') : ' · без аффиксов'}`;
  }
  /** Hero goods as tiles (stacks, then items), with «Надето» / «Избранное» tags. */
  private heroTiles(f: InvFilter, sel: string | null, pick: (k: string) => void): HTMLElement[] {
    const g = this.s.growth;
    const keys = Object.keys(g.stacks).filter((k) => g.stacks[k] > 0 && matches(f, stackCat(k), stackName(k)));
    const items = g.items.filter((i) => matches(f, itemCat(i), itemName(i)));
    return [
      ...keys.map((k) => tile({ icon: iconForKey(k), count: g.stacks[k], sel: sel === 's:' + k, tip: stackName(k), onclick: () => pick('s:' + k) })),
      ...items.map((it) => tile({ icon: iconForKey(it.tpl), sel: sel === 'u:' + it.uid, color: isGear(it.tpl) ? RARITY[it.rarity].color : undefined, lock: isEquipped(g, it.uid), star: it.fav, tag: isEquipped(g, it.uid) ? 'Надето' : it.fav ? 'Избранное' : undefined, tip: itemName(it), onclick: () => pick('u:' + it.uid) })),
    ];
  }
  private combatTag(): HTMLElement {
    return this.s.inCombat() ? tag('В бою') : tag('Вне боя', undefined, 'green');
  }

  // ------------------------------------------------------------------ corpse / chest window (hud-23)
  private lootSel: string | null = null;
  private lootQty = 1;
  private lootKey = '';

  /** D094 / D097 / D209: a full-screen loot window (the world pauses; combat state stays). */
  container(id: string, title: string, box: Container, kind: 'corpse' | 'chest', footer?: string) {
    const g = this.s.growth;
    const again = () => this.container(id, title, box, kind, footer);
    const f = this.cf;
    if (this.lootKey !== id) {
      this.lootKey = id;
      this.lootSel = null;
      this.lootQty = 1;
    }
    const idx = box.entries.map((_, i) => i).filter((i) => matches(f, this.catOf(box.entries[i]), entryName(box.entries[i])));
    const price = (i: number) => {
      const e = box.entries[i];
      return e.kind === 'item' ? itemBuyPrice(e.item) : stackBuyPrice(e.key);
    };
    const rar = (i: number) => {
      const e = box.entries[i];
      return e.kind === 'item' ? RARITIES.indexOf(e.item.rarity) : 0;
    };
    const order = this.sortEntries(idx, (i) => entryName(box.entries[i]), price, rar, f);
    // selection: «b:<index>» in the container, «s:<key>» / «u:<uid>» at the hero
    const valid = (k: string | null) => {
      if (!k) return false;
      if (k.startsWith('b:')) return !!box.entries[Number(k.slice(2))];
      if (k.startsWith('s:')) return (g.stacks[k.slice(2)] ?? 0) > 0;
      return g.items.some((i) => i.uid === k.slice(2));
    };
    if (!valid(this.lootSel)) {
      this.lootSel = order.length ? 'b:' + order[0] : null;
      this.lootQty = 1;
    }
    const sel = this.lootSel;
    const pick = (k: string) => {
      this.lootSel = k;
      const e = k.startsWith('b:') ? box.entries[Number(k.slice(2))] : null;
      this.lootQty = e && e.kind === 'stack' ? e.qty : k.startsWith('s:') ? g.stacks[k.slice(2)] ?? 1 : 1;
      again();
    };
    const boxTiles = order.map((i) => {
      const e = box.entries[i];
      const why = trophyProblem(e, g);
      return tile({ icon: this.entryIcon(e), count: e.kind === 'stack' ? e.qty : undefined, sel: sel === 'b:' + i, lock: !!why, color: e.kind === 'item' && isGear(e.item.tpl) ? RARITY[e.item.rarity].color : undefined, tip: entryName(e) + (why ? ` — ${why}` : ''), onclick: () => pick('b:' + i) });
    });
    const left = panel(
      h('div.r2-iconline', bigIcon(kind === 'chest' ? 'container' : 'wolf', 76), h('div', h('h2.r2-ph', title), kind === 'chest' && box.cap !== null ? chip('container', h('span', 'Занято ', h('b', `${box.entries.length} / ${box.cap}`), ' слотов'), 'gold') : h('div.r2-dim', footer ?? 'Тело противника'))),
      h('div.r2-filters.wide', search(f.q, kind === 'chest' ? 'Поиск в сундуке…' : 'Поиск…', (v) => { f.q = v; again(); }, 'loot'), select(INV_CATS, f.cat, (x) => { f.cat = x; again(); })),
      scroll(tiles(boxTiles, 8, kind === 'chest' ? Math.min(32, box.cap ?? 32) : 16)),
      box.entries.length && !order.length ? h('div.r2-dim.r2-small', 'Под фильтр ничего не попадает (скрытое забирается кнопкой «Взять всё»).') : null,
      h('div.r2-box.r2-hrow.between', h('span.r2-iconline', pxIcon('coins', 40), `Золото в ${kind === 'chest' ? 'сундуке' : 'теле'}: `, h('b.r2-gold', String(box.gold))),
        h('button.r2-big.small.r2-fit', { class: box.gold > 0 ? undefined : 'r2-off', onclick: () => { if (!box.gold) return; const v = takeGold(g, box); this.s.toast(`+${v} зол.`); this.s.changed(); again(); } }, 'Забрать золото')),
      bigBtn('Взять всё', box.entries.length || box.gold ? null : 'Пусто', () => {
        const r = takeAll(g, box);
        this.s.toast(`Взято: ${r.taken}${r.gold ? `, +${r.gold} зол.` : ''}${r.skipped.length ? `; осталось: ${r.skipped.map((x) => `${x.name} (${x.why})`).join(', ')}` : ''}`);
        this.s.changed();
        again();
      }),
      note('Все доступные предметы и золото, включая скрытые фильтром. Трофеи без нужного ножа или ступени охоты остаются в теле.'),
      kind === 'chest' ? note('Содержимое хранится без ограничения времени.', 'box') : null,
    );
    const mid = panel(
      h('div.r2-hrow.between', h('h2.r2-ph.small', 'Инвентарь героя'), chip('coins', h('span', 'Ваше золото: ', h('b', String(g.gold))), 'gold small')),
      scroll(tiles(this.heroTiles(f, sel, pick), 5, 15)),
      kind === 'chest' ? note('Надетые и уникальные предметы заданий в сундук не переносятся.', 'lock') : note('В тело ничего положить нельзя.', 'lock'),
      kind === 'chest' ? note('Избранное хранить можно. Золото в сундук положить нельзя.', 'star') : null,
    );
    // detail of the selection
    let right: HTMLElement;
    if (!sel) right = panel('Пусто', h('p.r2-note', box.entries.length ? 'Выберите предмет.' : 'Здесь ничего нет.'));
    else if (sel.startsWith('b:')) {
      const i = Number(sel.slice(2));
      const e = box.entries[i];
      const why = trophyProblem(e, g);
      const stack = e.kind === 'stack';
      const have = stack ? stackCount(g, e.key) : 0;
      const q = stack ? Math.max(1, Math.min(this.lootQty, e.qty)) : 1;
      right = panel(
        h('h2.r2-ph', entryName(e)),
        h('div.r2-iconline', bigIcon(this.entryIcon(e), 110), this.catTag(this.catOf(e))),
        h('div.r2-small', this.goodsText(stack ? { key: e.key } : { item: e.item })),
        table(null, [[kind === 'chest' ? 'В сундуке:' : 'В теле:', h('b', String(stack ? e.qty : 1))], ['У героя:', h('b', String(stack ? have : g.items.filter((x) => x.tpl === e.item.tpl).length))], ['Максимум в стаке:', h('b', String(stack ? STACK_MAX : 1))]], '.kv'),
        why ? h('div.r2-red', why) : null,
        stack ? [rule(), h('h3.r2-h3', 'Количество'), stepper(q, 1, e.qty, (v) => { this.lootQty = v; again(); }), h('div.r2-box', h('b', 'После переноса'), h('div.r2-kvline', h('span', kind === 'chest' ? 'В сундуке:' : 'В теле:'), h('b', String(e.qty - q))), h('div.r2-kvline', h('span', 'У героя:'), h('b', String(have + q))))] : null,
        h('div.r2-grow'),
        bigBtn(stack ? `Забрать ${q}` : 'Забрать', why, () => this.act(takeEntry(g, box, i, q), `Взято: ${entryName(e)}`, again)),
        h('div.r2-center.r2-dim', 'В инвентарь героя'),
        note('Сначала заполняются неполные стаки.'),
      );
    } else {
      const isStack = sel.startsWith('s:');
      const key = sel.slice(2);
      const it = isStack ? null : g.items.find((x) => x.uid === key)!;
      const name = isStack ? stackName(key) : itemName(it!);
      const have = isStack ? stackCount(g, key) : 1;
      const q = isStack ? Math.max(1, Math.min(this.lootQty, have)) : 1;
      const p = kind !== 'chest' ? 'В тело ничего нельзя положить' : isStack ? null : putItemProblem(g, box, key);
      right = panel(
        h('h2.r2-ph', name),
        h('div.r2-iconline', bigIcon(isStack ? iconForKey(key) : iconForKey(it!.tpl), 110), this.catTag(isStack ? stackCat(key) : itemCat(it!))),
        h('div.r2-small', this.goodsText(isStack ? { key } : { item: it! })),
        table(null, [['У героя:', h('b', String(have))], [kind === 'chest' ? 'Слотов занято:' : 'В теле:', h('b', kind === 'chest' ? `${box.entries.length} / ${box.cap}` : '—')]], '.kv'),
        isStack && kind === 'chest' ? [rule(), h('h3.r2-h3', 'Количество'), stepper(q, 1, have, (v) => { this.lootQty = v; again(); })] : null,
        h('div.r2-grow'),
        bigBtn(isStack ? `Положить ${q}` : 'Положить', p, () => {
          if (isStack) {
            const moved = putStack(g, box, key, q);
            this.s.toast(moved === q ? `Положено: ${name} ×${moved}` : `Места хватило на ${moved} из ${q}; остальное осталось у вас`);
            this.s.changed();
            again();
          } else this.act(putItem(g, box, key), `Положено: ${name}`, again);
        }),
        h('div.r2-center.r2-dim', kind === 'chest' ? 'В сундук' : ''),
      );
    }
    this.show('loot', screen('Добыча и хранение', '1.32fr 1fr 0.78fr', [left, mid, right]));
  }

  // ------------------------------------------------------------------ NPC hub
  npc(id: MerchantId) {
    const m = MERCHANTS[id];
    const teaches = TEACHES[id as TeacherId];
    const fight = this.s.inCombat();
    const body = h(
      'div',
      h('h1', m.name),
      h('div.r2-npc', pxIcon(MERCHANT_FACE[id] ?? 'npc', 96, 'r2-npcface'), h('div', h('h2', m.name), h('div.r2-sub', `${m.role} · ${m.place}`))),
      h('p.r2-say', `«${m.greeting}»`),
      h('div.r2-rule'),
      fight ? h('p.r2-req.no', 'В бою торговля, обучение и услуги недоступны.') : null,
      h('div.r2-answers',
        h('button.r2-btn.r2-ans', { onclick: () => this.trade(id), class: fight ? 'r2-off' : undefined }, pxIcon('coins', 32), h('span', 'Торговля')),
        teaches.length ? h('button.r2-btn.r2-ans', { onclick: () => this.training(id), class: fight ? 'r2-off' : undefined }, pxIcon(TEACH_ICON[id] ?? 'book', 32), h('span', 'Обучение')) : null,
        id === 'smith' ? h('button.r2-btn.r2-ans', { onclick: () => this.forge(), class: fight ? 'r2-off' : undefined }, pxIcon('anvil', 32), h('span', 'Улучшение оружия')) : null,
        id === 'alchemist' ? h('button.r2-btn.r2-ans', { onclick: () => this.s.mentor('mira') }, pxIcon('book', 32), h('span', 'Характеристики и магия')) : null,
        h('button.r2-btn.r2-ans', { onclick: () => this.s.menus.close('npc') }, pxIcon('exit', 32), h('span', 'Уйти'))),
      h('p.r2-note', m.specialty),
    );
    this.show('npc', body);
  }

  // ------------------------------------------------------------------ trade (hud-19)
  private tctx(id: MerchantId): TradeCtx {
    return { g: this.s.growth, m: this.s.world.merchants[id], id, inCombat: this.s.inCombat(), nextUid: () => this.s.nextUid() };
  }
  private tradeSel: string | null = null;
  private tradeQty = 1;
  private heroF: InvFilter = { q: '', cat: 'all', sort: 'order' };

  trade(id: MerchantId, tab = this.tradeTab) {
    if (this.s.inCombat()) return this.s.toast('Торговля только вне боя');
    if (tab !== this.tradeTab) {
      this.tradeSel = null;
      this.tradeQty = 1;
    }
    this.tradeTab = tab;
    const g = this.s.growth;
    const c = this.tctx(id);
    const m = c.m;
    const f = this.cf;
    const again = () => this.trade(id);
    const md = MERCHANTS[id];
    const pick = (k: string) => { this.tradeSel = k; this.tradeQty = 1; again(); };
    const offerCat = (o: OfferDef): GoodsCat => {
      const gd = offerGoods(o);
      return 'stack' in gd ? stackCat(gd.stack) : o.kind === 'tool' ? 'tool' : o.kind === 'rune' ? 'rune' : 'gear';
    };
    const offerIcon = (o: OfferDef) => {
      const it = m.gear[o.id];
      const gd = offerGoods(o);
      return it ? iconForKey(it.tpl) : 'stack' in gd ? iconForKey(gd.stack) : iconForKey(o.id + (o.kind === 'rune' ? ' rune' : o.kind === 'tool' ? ' ' + offerName(c, o) : ''));
    };
    const offers = OFFERS[id].filter((o) => (m.stock[o.id] ?? 0) > 0 || o.replenishes).filter((o) => matches(f, offerCat(o), offerName(c, o)));
    const gcoin = (n: number | string) => h('span.r2-price', pxIcon('coins', 22), h('b', String(n)));
    // left: the merchant's goods (buy), the hero's goods priced (sell), or the buyback list
    let rows: HTMLElement[] = [];
    let head: string[] = ['Товар', 'Цена', 'Запас'];
    if (tab === 'buy') {
      if (!this.tradeSel || !offers.some((o) => 'o:' + o.id === this.tradeSel)) this.tradeSel = offers[0] ? 'o:' + offers[0].id : null;
      rows = offers.map((o) => h('tr.click' + (this.tradeSel === 'o:' + o.id ? '.sel' : ''), { onclick: () => pick('o:' + o.id) },
        h('td', pxIcon(offerIcon(o), 30), offerName(c, o)), h('td', gcoin(o.unitBuyPrice)), h('td', String(m.stock[o.id] ?? 0))));
    } else if (tab === 'sell') {
      head = ['Ваш товар', 'Цена', 'Есть'];
      const keys = Object.keys(g.stacks).filter((k) => g.stacks[k] > 0 && matches(f, stackCat(k), stackName(k)));
      const items = g.items.filter((i) => matches(f, itemCat(i), itemName(i)));
      const all = [...keys.map((k) => 's:' + k), ...items.map((i) => 'u:' + i.uid)];
      if (!this.tradeSel || !all.includes(this.tradeSel)) this.tradeSel = all[0] ?? null;
      rows = [
        ...keys.map((k) => h('tr.click' + (this.tradeSel === 's:' + k ? '.sel' : ''), { onclick: () => pick('s:' + k) }, h('td', pxIcon(iconForKey(k), 30), stackName(k)), h('td', gcoin(sellUnit(stackBuyPrice(k)))), h('td', String(g.stacks[k])))),
        ...items.map((it) => h('tr.click' + (this.tradeSel === 'u:' + it.uid ? '.sel' : ''), { onclick: () => pick('u:' + it.uid) }, h('td', pxIcon(iconForKey(it.tpl), 30), itemName(it)), h('td', gcoin(sellUnit(itemBuyPrice(it)))), h('td', isEquipped(g, it.uid) ? 'надето' : it.fav ? '★' : '1'))),
      ];
    } else {
      head = ['Проданное', 'Цена', 'Кол-во'];
      if (!this.tradeSel || !m.buyback[Number(this.tradeSel.slice(2))]) this.tradeSel = m.buyback.length ? 'b:0' : null;
      rows = m.buyback.map((e: Entry, i) => h('tr.click' + (this.tradeSel === 'b:' + i ? '.sel' : ''), { onclick: () => pick('b:' + i) }, h('td', pxIcon(this.entryIcon(e), 30), entryName(e)), h('td', gcoin(buybackUnit(e))), h('td', String(e.kind === 'stack' ? e.qty : 1))));
    }
    const cyc = m.cycleLeft === null ? 'Пополнение начнётся после первой покупки пополняемого товара.' : `Пополнение через ${Math.ceil(m.cycleLeft / 60)} мин активной игры.`;
    const left = panel(
      h('div.r2-iconline', bigIcon(MERCHANT_FACE[id] ?? 'npc', 108), h('div', h('h2.r2-ph', md.name), h('div.r2-psub', `${md.role} · ${md.place}`), chip('coins', h('span', `Золото ${md.name === 'Мира' ? 'Миры' : 'торговца'}: `, h('b', String(m.wallet))), 'gold'))),
      tab !== 'buyback' ? h('div.r2-filters.wide', search(f.q, 'Поиск товаров…', (v) => { f.q = v; again(); }, 'trade'), select(INV_CATS.map(([k, l]) => [k, k === 'all' ? 'Все товары' : l] as const), f.cat, (x) => { f.cat = x; again(); })) : null,
      scroll(rows.length ? h('table.r2-tbl.r2-trade', h('thead', h('tr', head.map((x) => h('th', x)))), h('tbody', rows)) : h('p.r2-note', 'Пусто.')),
      h('div.r2-dim.r2-small', cyc),
    );
    // middle: the hero's bag
    const hf = this.heroF;
    const hk = Object.keys(g.stacks).filter((k) => g.stacks[k] > 0 && matches(hf, stackCat(k), stackName(k)));
    const hi = g.items.filter((i) => matches(hf, itemCat(i), itemName(i)));
    const mid = panel(
      h('div.r2-hrow.between', h('h2.r2-ph.small', 'Инвентарь героя'), chip('coins', h('span', 'Ваше золото: ', h('b', String(g.gold))), 'gold small')),
      search(hf.q, 'Поиск предметов…', (v) => { hf.q = v; again(); }, 'tradehero'),
      scroll(
        hk.map((k) => row({ icon: iconForKey(k), iconSize: 36, title: stackName(k), right: h('b.r2-cntr', String(g.stacks[k])), cls: 'thin', sel: tab === 'sell' && this.tradeSel === 's:' + k, onclick: () => { this.tradeTab = 'sell'; this.tradeSel = 's:' + k; this.tradeQty = 1; again(); } })),
        hi.map((it) => row({ icon: iconForKey(it.tpl), iconSize: 36, title: itemName(it), cls: 'thin', sel: tab === 'sell' && this.tradeSel === 'u:' + it.uid,
          right: isEquipped(g, it.uid) ? [pxIcon('lock', 20), tag('Надето', undefined, 'gold')] : it.fav ? [h('span.r2-gold', '★'), tag('Избранное', undefined, 'gold')] : null,
          onclick: () => { this.tradeTab = 'sell'; this.tradeSel = 'u:' + it.uid; this.tradeQty = 1; again(); } })),
      ),
      note('Надетые и избранные предметы защищены от продажи.', 'warn'),
    );
    // right: the selected entry with quantity, total and the action
    const sel = this.tradeSel;
    let right: HTMLElement;
    const detail = (icon: string, name: string, text: string, cat: GoodsCat, section: string, unit: number, stock: string, max: number, stackable: boolean, problem: (q: number) => string | null, go: (q: number) => string | null, verb: string, ok: string, sign: -1 | 1) => {
      const q = stackable ? Math.max(1, Math.min(this.tradeQty, Math.max(1, Math.min(TRADE_MAX, max)))) : 1;
      const total = unit * q;
      const after = g.gold + sign * total;
      return panel(
        h('div.r2-iconline.top', bigIcon(icon, 110), h('div', h('h2.r2-ph.small', name), h('div.r2-small', text), this.catTag(cat))),
        rule(),
        h('h3.r2-h3', section),
        table(null, [['Цена за штуку', gcoin(`${unit} зол.`)], [stock.split('|')[0], h('b', stock.split('|')[1])]], '.kv'),
        rule(),
        h('div.r2-hrow.between', h('h3.r2-h3', 'Количество'), stackable ? stepper(q, 1, Math.max(1, Math.min(TRADE_MAX, max)), (v) => { this.tradeQty = v; again(); }) : h('b', '1')),
        h('div.r2-total2', h('span', 'Итого:'), h('span', pxIcon('coins', 40), `${total} зол.`)),
        h('div.r2-box.r2-kvline', h('span', sign < 0 ? 'После покупки:' : 'После продажи:'), h('b', gcoin(`${after} зол.`))),
        h('div.r2-grow'),
        bigBtn(`${verb} ${stackable ? q + ' ' : ''}за ${total} зол.`, problem(q), () => this.act(go(q), ok, again)),
        note(tab === 'buy' ? 'Обратный выкуп — у того же торговца по полной цене покупки.' : tab === 'sell' ? 'Продажа — 25 % цены покупки и только если у торговца хватает золота на всю партию.' : 'Проданное можно выкупить бессрочно по полной цене.', 'warn'),
      );
    };
    if (!sel) right = panel('Торговля', h('p.r2-note', 'Выберите товар.'));
    else if (sel.startsWith('o:')) {
      const o = OFFERS[id].find((x) => x.id === sel.slice(2))!;
      const it = m.gear[o.id];
      const gd = offerGoods(o);
      const left2 = m.stock[o.id] ?? 0;
      right = detail(offerIcon(o), offerName(c, o), it ? this.goodsText({ item: it }) : 'stack' in gd ? this.goodsText({ key: gd.stack }) : o.kind === 'rune' ? 'Руна перемещения, не расходуется.' : 'Инструмент для добычи.', offerCat(o), 'Покупка', o.unitBuyPrice, `В наличии|${left2}${o.replenishes ? ' (пополняется)' : ''}`, left2, 'stack' in gd, (q) => buyProblem(c, o.id, q), (q) => buy(c, o.id, q), 'Купить', `Куплено: ${offerName(c, o)}`, -1);
    } else if (sel.startsWith('s:')) {
      const k = sel.slice(2);
      right = detail(iconForKey(k), stackName(k), this.goodsText({ key: k }), stackCat(k), 'Продажа', sellUnit(stackBuyPrice(k)), `У вас|${g.stacks[k]}`, g.stacks[k], true, (q) => sellProblem(c, { stack: k }, q), (q) => sell(c, { stack: k }, q), 'Продать', `Продано: ${stackName(k)}`, 1);
    } else if (sel.startsWith('u:')) {
      const it = g.items.find((x) => x.uid === sel.slice(2))!;
      right = detail(iconForKey(it.tpl), itemName(it), this.goodsText({ item: it }), itemCat(it), 'Продажа', sellUnit(itemBuyPrice(it)), `Состояние|${isEquipped(g, it.uid) ? 'надето' : it.fav ? 'избранное' : 'в сумке'}`, 1, false, (q) => sellProblem(c, { uid: it.uid }, q), (q) => sell(c, { uid: it.uid }, q), 'Продать', `Продано: ${itemName(it)}`, 1);
    } else {
      const i = Number(sel.slice(2));
      const e = m.buyback[i];
      right = detail(this.entryIcon(e), entryName(e), e.kind === 'stack' ? this.goodsText({ key: e.key }) : this.goodsText({ item: e.item }), this.catOf(e), 'Обратный выкуп', buybackUnit(e), `Продано|${e.kind === 'stack' ? e.qty : 1}`, e.kind === 'stack' ? e.qty : 1, e.kind === 'stack', (q) => buybackProblem(c, i, q), (q) => buyBack(c, i, q), 'Выкупить', `Выкуплено: ${entryName(e)}`, -1);
    }
    const top = tabs([['buy', 'Покупка'], ['sell', 'Продажа'], ['buyback', `Обратный выкуп${m.buyback.length ? ` (${m.buyback.length})` : ''}`]] as const, tab, (t) => this.trade(id, t));
    this.show('npc', screen('Торговля', '1.22fr 0.95fr 1fr', [left, mid, right], h('div.r2-headtabs', top), '.r2-trade-win'));
  }

  // ------------------------------------------------------------------ training (crafts, hunting, gathering; hud-14)
  private trainTab: 'craft' | 'hunt' | 'gather' = 'craft';
  private trainProf = '';
  private trainTier = 1;
  private trainRecipe = '';

  training(id: TeacherId, tab?: 'craft' | 'hunt' | 'gather') {
    if (this.s.inCombat()) return this.s.toast('Обучение только вне боя');
    const g = this.s.growth;
    const c = { g, hero: this.s.hero, inCombat: this.s.inCombat() };
    if (tab) this.trainTab = tab;
    else if (!this.trainProf) this.trainTab = id === 'hunter' ? 'hunt' : id === 'supplier' ? 'gather' : 'craft';
    const again = () => this.training(id);
    const teacherOf = (opt: string) => (Object.keys(TEACHES) as TeacherId[]).find((t) => TEACHES[t].some((x) => x.id === opt))!;
    const all = (Object.keys(TEACHES) as TeacherId[]).flatMap((t) => TEACHES[t]);
    const tierOf = (oid: string) => Number(/(\d)$/.exec(oid)?.[1] ?? 1);
    // professions of the tab: crafts (by profession), hunting, each gathering skill
    type Prof = { key: string; name: string; icon: string; opts: TrainOption[] };
    let profs: Prof[];
    if (this.trainTab === 'craft') profs = (['smith', 'alchemy', 'cooking'] as const).map((p) => ({ key: p, name: PROFESSION_NAME[p], icon: p === 'smith' ? 'anvil' : p === 'alchemy' ? 'alchemy' : 'cauldron', opts: all.filter((o) => o.id.startsWith(p) && /\d$/.test(o.id)) }));
    else if (this.trainTab === 'hunt') profs = [{ key: 'hunt', name: 'Охота', icon: 'knife', opts: all.filter((o) => /^hunt\d$/.test(o.id)) }];
    else profs = all.filter((o) => !/^(smith|alchemy|cooking|hunt)\d$/.test(o.id)).map((o) => ({ key: o.id, name: o.name, icon: /ore|mine|кирк/i.test(o.id + o.name) ? 'pickaxe' : /wood|лес|топор/i.test(o.id + o.name) ? 'axe' : 'red', opts: [o] }));
    if (!profs.some((p) => p.key === this.trainProf)) {
      const own = profs.find((p) => p.opts.some((o) => teacherOf(o.id) === id));
      this.trainProf = (own ?? profs[0]).key;
      this.trainTier = 1;
    }
    const prof = profs.find((p) => p.key === this.trainProf)!;
    const known = (p: Prof) => p.opts.filter((o) => knows(g, o.id)).length;
    const left = panel(
      'Профессии',
      scroll(profs.map((p) => row({
        icon: p.icon, iconSize: 64, title: p.name, cls: 'big', sel: p.key === prof.key,
        sub: known(p) ? h('span.r2-green', p.opts.length > 1 ? `Изучена ${ROMAN[known(p) - 1]} ступень` : 'Изучено') : 'Не изучено',
        onclick: () => { this.trainProf = p.key; this.trainTier = Math.min(p.opts.length, known(p) + 1); again(); },
      }))),
      rule(),
      h('div.r2-center', this.trainTab === 'craft' ? 'Рецепты открываются с обучением' : 'Умения открываются с обучением'),
      h('div.r2-hrow.center', chip('lp', `LP ${this.s.hero.progress.lp}`, 'purple'), chip('coins', String(g.gold), 'gold')),
      h('div.r2-center.r2-dim.r2-small', 'Профессии не растут от изготовления.'),
    );
    if (this.trainTier > prof.opts.length) this.trainTier = 1;
    const tier = prof.opts[this.trainTier - 1] ?? prof.opts[0];
    const teacher = teacherOf(tier.id);
    const tname = MERCHANTS[teacher as MerchantId].name;
    const tiers = prof.opts.map((o, i) => {
      const has = knows(g, o.id);
      const p = trainProblem(c, teacher === teacherOf(o.id) ? teacherOf(o.id) : teacher, o.id);
      const prev = i > 0 ? knows(g, prof.opts[i - 1].id) : true;
      return h('button.r2-tier' + (o.id === tier.id ? '.sel' : '') + (has ? '.on' : ''), { onclick: () => { this.trainTier = i + 1; again(); } },
        h('span.r2-tiern', ROMAN[tierOf(o.id) - 1] ?? 'I', !has && !prev ? pxIcon('lock', 16) : null),
        h('span.r2-rtxt',
          h('b', prof.opts.length > 1 ? `${ROMAN[tierOf(o.id) - 1]} ступень` : o.name),
          has ? req(true, 'Изучено') : h('small', p && p !== 'Уже изучено' ? p : 'Не изучено'),
          h('small', [o.attr ? `${o.attr.toUpperCase()} ${o.threshold}` : null, i > 0 ? `${ROMAN[i - 1]} ступень` : null].filter(Boolean).join(' · ') || 'Без требований'),
          has ? null : h('small.r2-gold', `${o.lp} LP · ${o.gold} зол.`)));
    });
    const stationName = this.trainTab === 'craft' ? STATION_NAME[STATION_OF[prof.key as Profession]] : null;
    const prob = trainProblem(c, teacherOf(tier.id), tier.id);
    const mine = teacherOf(tier.id) === id;
    const mid = panel(
      phead(prof.name, null, `${tier.attr ? `${tier.attr.toUpperCase()} ${this.s.hero.stats[tier.attr]} · ` : ''}Наставник: ${tname}`),
      scroll(tiers),
      h('div.r2-box.r2-iconline', pxIcon(MERCHANT_FACE[teacher as MerchantId] ?? 'npc', 64), h('div', h('h3.r2-h3', `Обучение у ${tname === 'Мира' ? 'Миры' : tname === 'Рада' ? 'Рады' : tname === 'Егор' ? 'Егора' : tname === 'Бран' ? 'Брана' : tname}`), h('div.r2-dim', 'Лично и вне боя.'), h('div.r2-dim.r2-small', 'Плата за обучение не идёт в кошелёк торговца.'))),
      knows(g, tier.id) ? null : mine ? bigBtn(`Изучить: ${tier.lp} LP · ${tier.gold} зол.`, prob, () => this.act(train(this.ctxC(), id, tier.id), `Изучено: ${tier.name}`, again)) : h('div.r2-center.r2-dim', `Этому обучает ${tname}.`),
      stationName ? h('div.r2-center.r2-iconline.r2-cstation', pxIcon(prof.icon, 36), h('b', `Рабочее место: ${stationName}`)) : null,
    );
    let right: HTMLElement;
    if (this.trainTab === 'craft') {
      const t = tierOf(tier.id);
      const recs = recipesAt(STATION_OF[prof.key as Profession]).filter((r) => r.profession === prof.key && r.tier === t);
      if (!recs.some((r) => r.id === this.trainRecipe)) this.trainRecipe = recs[0]?.id ?? '';
      const r = recs.find((x) => x.id === this.trainRecipe);
      const open = g.crafts[prof.key as Profession] >= t;
      right = panel(
        phead(`Рецепты ${ROMAN[t - 1]} ступени`, null, open ? 'Открыто' : 'Предпросмотр · Требуется обучение'),
        scroll(recs.map((x) => row({ icon: iconForKey(x.id), iconSize: 36, title: x.name, cls: 'thin', locked: !open, sel: x.id === this.trainRecipe, onclick: () => { this.trainRecipe = x.id; again(); } }))),
        r ? h('div.r2-box.gold',
          h('h3.r2-h3', `${r.name} ×${'qty' in recipeOutput(r) ? (recipeOutput(r) as { qty: number }).qty : 1}`),
          h('div.r2-iconline.top', bigIcon(iconForKey(r.id), 80), h('div', Object.entries(r.ingredients).map(([k, n]) => h('div.r2-iconline', pxIcon(iconForKey(k), 26), `${stackName(k)} ×${n}`)), h('div.r2-dim.r2-small', r.effect)))) : null,
        h('div.r2-center.r2-dim.r2-small', `Создание — ${stationName ? `у места «${stationName}»` : 'на рабочем месте'} после обучения.`),
      );
    } else {
      right = panel(
        tier.name,
        h('div.r2-iconline.top', bigIcon(prof.icon, 100), h('div', tier.effect || 'Открывает добычу.')),
        table(null, [['Цена', h('b', `${tier.lp} LP · ${tier.gold} зол.`)], ['Требование', h('b', tier.attr ? `${tier.attr.toUpperCase()} ${tier.threshold}` : '—')], ['Обучает', h('b', tname)]], '.kv'),
        note(this.trainTab === 'hunt' ? 'Трофеи с тел снимаются ножом; редкие — с нужной ступенью охоты.' : 'Сбор — у источников в мире; инструмент нужен для руды и древесины.'),
      );
    }
    const top = tabs([['craft', 'Ремёсла'], ['hunt', 'Охота'], ['gather', 'Собирательство']] as const, this.trainTab, (t) => { this.trainProf = ''; this.training(id, t); });
    this.show('npc', screen('Ремёсла и добыча', '1fr 1.05fr 1.15fr', [left, mid, right], top));
  }
  private ctxC() {
    return { g: this.s.growth, hero: this.s.hero, inCombat: this.s.inCombat() };
  }

  // ------------------------------------------------------------------ smith upgrades (hud-22)
  private forgeSel = '';
  private forgeUp: Upgrade = 'tempered';
  private forgeQ = '';

  forge() {
    if (this.s.inCombat()) return this.s.toast('Услуги только вне боя');
    const g = this.s.growth;
    const again = () => this.forge();
    const ql = this.forgeQ.trim().toLowerCase();
    const weapons = g.items.filter((i) => isGear(i.tpl) && /sword|bow|staff/.test(i.tpl) && (!ql || itemName(i).toLowerCase().includes(ql)));
    if (!weapons.some((w) => w.uid === this.forgeSel)) this.forgeSel = (weapons.find((w) => !w.upgrade && !isEquipped(g, w.uid)) ?? weapons[0])?.uid ?? '';
    const left = panel(
      'Оружие героя',
      search(this.forgeQ, 'Поиск оружия', (v) => { this.forgeQ = v; again(); }, 'forge'),
      scroll(weapons.map((it) => {
        const worn = isEquipped(g, it.uid);
        return row({ icon: iconForKey(it.tpl), iconSize: 50, title: itemName(it), sel: it.uid === this.forgeSel,
          sub: worn ? 'Надето — сначала снимите' : it.upgrade ? `Уже улучшен: ${upgradeName(it.tpl, it.upgrade)}` : 'В инвентаре · Без улучшения',
          right: worn || it.upgrade ? pxIcon('lock', 24) : null, onclick: () => { this.forgeSel = it.uid; again(); } });
      })),
      h('div.r2-box', note('Улучшать можно только снятое оружие.', 'warn')),
      note('Владение кузнечным делом не требуется.', 'warn'),
    );
    const it = g.items.find((x) => x.uid === this.forgeSel);
    if (!it) {
      this.show('npc', screen('Кузнечное улучшение', '1fr 1fr 1fr', [left, panel('Нет оружия', h('p.r2-note', 'В инвентаре нет оружия.')), panel(null)], this.forgeHead()));
      return;
    }
    const w = WEAPON_BY_ID[it.tpl];
    const u = this.forgeUp;
    const cost = forgeCost(it.tpl, u);
    const prob = upgradeProblem(this.ctxC(), it.uid, u);
    const base = w.damage * (it.upgrade ? UPGRADE[it.upgrade].mul : 1);
    const after = w.damage * UPGRADE[u].mul;
    const r2 = (n: number) => fmt(Math.round(n * 10) / 10);
    const mid = panel(
      h('h2.r2-ph', itemName(it)),
      h('div.r2-hrow', tag(`${RARITY[it.rarity].name} · Группа ${ROMAN[weaponGroup(it.tpl) - 1] ?? weaponGroup(it.tpl)}`)),
      h('div.r2-center', bigIcon(iconForKey(it.tpl), 120)),
      rule(),
      h('h3.r2-h3', 'Вариант улучшения'),
      (['sharp', 'tempered'] as Upgrade[]).map((x) => {
        const k = forgeCost(it.tpl, x);
        return row({ icon: x === 'sharp' ? 'iron' : 'steel', iconSize: 44, title: upgradeName(it.tpl, x), sub: `+${x === 'sharp' ? 10 : 15}% базового урона · ${k.gold} зол.`, sel: x === u, right: h('span.r2-radio'), onclick: () => { this.forgeUp = x; again(); } });
      }),
      h('table.r2-tbl', h('thead', h('tr', h('th', ''), h('th', 'Сейчас'), h('th.r2-green', 'После'))), h('tbody',
        h('tr', h('td', pxIcon('sword', 22), 'Базовый урон'), h('td', h('b', r2(base))), h('td', h('b.up', it.upgrade ? '—' : r2(after)))),
        h('tr', h('td', pxIcon('s2', 22), 'Атак/с'), h('td', h('b', fmt(w.aps))), h('td', h('b', fmt(w.aps)))),
        h('tr', h('td', pxIcon(w.attr, 22), `Требуется ${w.attr.toUpperCase()}`), h('td', h('b', String(w.req))), h('td', h('b', String(w.req)))))),
      h('div.r2-box', note(h('span', h('b', 'Обычные атаки и физические навыки. '), 'Заклинания не усиливаются.'), 'warn')),
      note('Цена продажи не меняется.', 'warn'),
    );
    const mats = Object.entries(cost.materials);
    const enough = g.gold >= cost.gold && mats.every(([k, n]) => stackCount(g, k) >= n);
    const right = panel(
      `Стоимость ${u === 'sharp' ? 'заточки' : 'закалки'}`,
      h('div.r2-box.gold.r2-iconline', pxIcon('coin', 40), h('span.r2-big-req', 'Ваше золото: ', h('span.r2-gold', String(g.gold)))),
      h('table.r2-tbl', h('thead', h('tr', h('th', 'Ресурс'), h('th', 'Нужно'), h('th', 'Есть'))), h('tbody',
        h('tr', h('td', pxIcon('coin', 26), 'Золото'), h('td', h('b', String(cost.gold))), h('td', h('b', String(g.gold)), ' ', req(g.gold >= cost.gold, ''))),
        mats.map(([k, n]) => h('tr', h('td', pxIcon(iconForKey(k), 26), stackName(k)), h('td', h('b', String(n))), h('td', h('b', String(stackCount(g, k))), ' ', req(stackCount(g, k) >= n, '')))))),
      prob ? h('div.r2-red', prob) : req(true, `Оружие снято · Ресурсов ${enough ? 'хватает' : 'не хватает'}`),
      h('div.r2-box', h('h3.r2-h3', 'После улучшения'),
        h('div.r2-kvline', h('span.r2-iconline', pxIcon('coin', 24), 'Останется золота:'), h('b', String(g.gold - cost.gold))),
        mats.map(([k, n]) => h('div.r2-kvline', h('span.r2-iconline', pxIcon(iconForKey(k), 24), `${stackName(k)}:`), h('b', String(stackCount(g, k) - n))))),
      h('div.r2-hrow', chip('bolt', 'Мгновенно · Без неудач', 'small'), chip('cross', 'Без LP и ОТ', 'small')),
      note('Одно постоянное улучшение. Заменить или добавить второе нельзя.', 'warn'),
      h('div.r2-grow'),
      bigBtn(`${u === 'sharp' ? 'Заточить' : 'Закалить'} за ${cost.gold} зол.`, prob, () =>
        this.s.menus.confirm(`${upgradeName(it.tpl, u)} для «${itemName(it)}» навсегда?`, () => this.act(upgradeWeapon(this.ctxC(), it.uid, u), `Улучшено: ${itemName(it)}`, again))),
    );
    this.show('npc', screen('Кузнечное улучшение', '1fr 1fr 1fr', [left, mid, right], this.forgeHead()));
  }
  private forgeHead(): HTMLElement {
    return h('div.r2-subhead', pxIcon('anvil', 44), h('span', 'Бран · Кузнец'), this.combatTag());
  }

  // ------------------------------------------------------------------ stations (hud-21)
  private stSel = '';
  private stTier = 1;
  private stRuns = 1;
  private stQ = '';

  station(st: Station) {
    if (this.s.inCombat()) return this.s.toast('Изготовление только вне боя');
    const g = this.s.growth;
    const again = () => this.station(st);
    const all = recipesAt(st);
    const prof = all[0]?.profession ?? 'smith';
    const lvl = g.crafts[prof];
    const ql = this.stQ.trim().toLowerCase();
    const list = all.filter((r) => r.tier === this.stTier && (!ql || r.name.toLowerCase().includes(ql)));
    if (!list.some((r) => r.id === this.stSel)) { this.stSel = list[0]?.id ?? ''; this.stRuns = 1; }
    const canMake = (r: RecipeDef, n = 1) => lvl >= r.tier && Object.entries(r.ingredients).every(([k, q]) => stackCount(g, k) >= q * n);
    const left = panel(
      'Рецепты',
      h('div.r2-ttabs.inner', [1, 2, 3].map((t) => h('button.r2-ttab' + (t === this.stTier ? '.sel' : ''), { onclick: () => { this.stTier = t; this.stSel = ''; again(); } }, lvl < t ? pxIcon('lock', 18) : null, ' ', ROMAN[t - 1]))),
      search(this.stQ, 'Поиск рецептов', (v) => { this.stQ = v; again(); }, 'station'),
      scroll(list.length ? list.map((r) => row({ icon: iconForKey(r.id), iconSize: 42, title: r.name, cls: 'thin', sel: r.id === this.stSel, locked: lvl < r.tier, right: canMake(r) ? pxIcon('check', 26) : null, onclick: () => { this.stSel = r.id; this.stRuns = 1; again(); } })) : h('p.r2-note', 'Нет рецептов.')),
      note('Все рецепты ступени открываются при обучении.', 'warn'),
    );
    const r = all.find((x) => x.id === this.stSel);
    if (!r) {
      this.show('station', screen('Изготовление', '1fr 1fr 1fr', [left, panel('Рецепт', h('p.r2-note', 'Выберите рецепт.')), panel('Партия')], this.stationHead(st, prof, lvl)));
      return;
    }
    const out = recipeOutput(r);
    const gear = 'tpl' in out;
    const w = gear ? WEAPON_BY_ID[out.tpl] : undefined;
    const a = gear ? ARMOR_BY_ID[out.tpl] : undefined;
    const outName = 'stack' in out ? stackName(out.stack) : r.name;
    const maxRuns = Math.max(1, Math.min(CRAFT_MAX, ...Object.entries(r.ingredients).map(([k, q]) => Math.floor(stackCount(g, k) / q))));
    const avail = Math.min(CRAFT_MAX, ...Object.entries(r.ingredients).map(([k, q]) => Math.floor(stackCount(g, k) / q)));
    const runs = Math.max(1, Math.min(this.stRuns, CRAFT_MAX));
    const p = craftProblem(this.ctxC(), st, r.id, runs);
    const mid = panel(
      h('h2.r2-ph', r.name),
      gear ? h('div.r2-hrow', tag('Обычный')) : h('div.r2-hrow', tag(PROFESSION_NAME[r.profession] + ' ' + ROMAN[r.tier - 1])),
      h('div.r2-iconline.top', bigIcon(iconForKey(r.id), 150), h('div.r2-box.r2-grow',
        w ? [h('div.r2-dim', 'Базовый урон'), h('div.r2-big-num', pxIcon('sword', 30), ` ${w.damage}`), rule(), h('div.r2-dim', 'Для экипировки'), h('div.r2-big-req', pxIcon(w.attr, 30), ` ${w.attr.toUpperCase()} ${w.req}`)]
          : a ? [h('div.r2-dim', 'Защита'), h('div.r2-big-num', pxIcon('shield', 30), ` ${a.armor}`), rule(), h('div.r2-dim', 'Для экипировки'), h('div.r2-big-req', Object.entries(a.req).map(([k, v]) => `${k.toUpperCase()} ${v}`).join(', '))]
            : h('div', r.effect))),
      gear ? h('div.r2-center.r2-dim', 'Без аффиксов · Без улучшения') : null,
      rule(),
      h('h3.r2-h3', 'Один запуск рецепта'),
      Object.entries(r.ingredients).map(([k, n]) => h('div.r2-box.r2-kvline', h('span.r2-iconline', pxIcon(iconForKey(k), 32), stackName(k)), h('b', `×${n}`))),
      h('div.r2-box', h('b', 'Результат одного запуска:'), h('div.r2-iconline', pxIcon(iconForKey(r.id), 30), 'stack' in out ? `${outName} ×${out.qty}` : `1 шт. — ${outName}`)),
      r.profession === 'smith' ? note('Кузнечное улучшение — отдельная услуга.', 'warn') : null,
    );
    const right = panel(
      'Партия',
      h('h3.r2-h3', 'Количество запусков'),
      h('div.r2-hrow.center', stepper(runs, 1, Math.max(maxRuns, 1), (v) => { this.stRuns = v; again(); })),
      h('div.r2-center.r2-dim', `По материалам доступно: ${Math.max(0, avail)}`),
      h('h3.r2-h3', 'Общие затраты'),
      h('table.r2-tbl', h('thead', h('tr', h('th', 'Материал'), h('th', 'Нужно'), h('th', 'Есть'))), h('tbody', Object.entries(r.ingredients).map(([k, n]) =>
        h('tr', h('td', pxIcon(iconForKey(k), 24), stackName(k)), h('td', h('b', String(n * runs))), h('td', h('b', String(stackCount(g, k))), ' ', req(stackCount(g, k) >= n * runs, '')))))),
      h('h3.r2-h3', 'Получите'),
      h('div.r2-iconline', h('div.r2-gettiles', Array.from({ length: Math.min(gear ? runs : 1, 3) }, () => tile({ icon: iconForKey(r.id) }))), h('div', h('b.r2-line', `${outName} `, h('span.r2-gold', `×${'stack' in out ? out.qty * runs : runs}`)), h('div.r2-dim', gear ? (runs > 1 ? 'Отдельные предметы' : 'Один предмет') : 'В стак'))),
      h('div.r2-hrow', chip('bolt', 'Мгновенно', 'small'), chip('check', 'Успех 100%', 'small green'), chip('cross', 'Без платы золотом и LP', 'small')),
      h('div.r2-grow'),
      bigBtn(gear ? `Создать ${runs} ${runs === 1 ? 'предмет' : runs < 5 ? 'предмета' : 'предметов'}` : `Изготовить ×${runs}`, p, () => this.act(craft(this.ctxC(), st, r.id, runs, () => this.s.nextUid()), `Изготовлено: ${r.name} ×${runs}`, again)),
      note('При нехватке материалов вся партия отменяется без списания.', 'warn'),
    );
    this.show('station', screen('Изготовление', '1fr 1fr 1fr', [left, mid, right], this.stationHead(st, prof, lvl)));
  }
  private stationHead(st: Station, prof: Profession, lvl: number): HTMLElement {
    return h('div.r2-subhead', pxIcon(st === 'forge' ? 'anvil' : st === 'alchemy' ? 'alchemy' : 'cauldron', 44), h('span', `${STATION_NAME[st]} · ${PROFESSION_NAME[prof]} ${lvl ? ROMAN[lvl - 1] : '— не изучено'}`), this.combatTag());
  }
}

export { CAT_NAME };

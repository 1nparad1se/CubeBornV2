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
import { filterBar, type InvFilter } from './growthUi';
import type { SceneMenus } from './menus';

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

const HINT_TAKE_ALL = 'Переносит в инвентарь все доступные предметы и золото, включая скрытые фильтром. Трофеи без нужного ножа или ступени охоты остаются в теле.';

function qtyInput(max: number, onChange?: (v: number) => void): { el: HTMLInputElement; get(): number } {
  const el = document.createElement('input');
  el.type = 'number';
  el.min = '1';
  el.max = String(Math.max(1, max));
  el.value = '1';
  el.className = 'r2-input r2-qty';
  el.oninput = () => onChange?.(Number(el.value));
  return { el, get: () => Math.floor(Number(el.value)) };
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
  private itemLine(it: Item): HTMLElement {
    const r = RARITY[it.rarity];
    return h(
      'div',
      h('b', { style: `color:${r.color}` }, itemName(it)),
      isGear(it.tpl) ? h('small', ` ${r.name}`) : null,
      it.upgrade ? h('small', ` · ${upgradeName(it.tpl, it.upgrade)}`) : null,
      it.fav ? h('span', ' ★') : null,
      it.affixes.map((a) => h('div.r2-affix', affixText(a))),
    );
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
      return h('div.r2-goods', h('span', h('b', stackName(k)), h('small', ` · ${CAT_NAME[stackCat(k)]}`)), h('span', `${n}${stacks > 1 ? ` (${stacks} стака по ${STACK_MAX})` : ''}`), btns);
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

  // ------------------------------------------------------------------ corpse / chest window
  /** D094 / D097 / D209: a full-screen loot window (the world pauses; combat state stays). */
  container(id: string, title: string, box: Container, kind: 'corpse' | 'chest', footer?: string) {
    const g = this.s.growth;
    const again = () => this.container(id, title, box, kind, footer);
    const f = this.cf;
    const idx = box.entries.map((_, i) => i).filter((i) => {
      const e = box.entries[i];
      return matches(f, e.kind === 'item' ? itemCat(e.item) : stackCat(e.key), entryName(e));
    });
    const price = (i: number) => {
      const e = box.entries[i];
      return e.kind === 'item' ? itemBuyPrice(e.item) : stackBuyPrice(e.key);
    };
    const rar = (i: number) => {
      const e = box.entries[i];
      return e.kind === 'item' ? RARITIES.indexOf(e.item.rarity) : 0;
    };
    const list = this.sortEntries(idx, (i) => entryName(box.entries[i]), price, rar, f).map((i) => {
      const e = box.entries[i];
      const why = trophyProblem(e, g);
      const take = (q: number) => this.act(takeEntry(g, box, i, q), `Взято: ${entryName(e)}`, again);
      if (e.kind === 'item') return h('div.r2-goods', this.itemLine(e.item), h('span'), h('div.r2-item-btns', this.btn('Взять', why, () => take(1), true)));
      const q = qtyInput(e.qty);
      q.el.value = String(e.qty);
      return h(
        'div.r2-goods',
        h('span', h('b', stackName(e.key)), why ? h('div.r2-req.no', why) : null),
        h('span', `×${e.qty}`),
        h('div.r2-item-btns', q.el, this.btn('Взять', why, () => take(q.get()), true)),
      );
    });
    let mine: HTMLElement | null = null;
    if (kind === 'chest') {
      const keys = Object.keys(g.stacks).filter((k) => matches(f, stackCat(k), stackName(k)));
      const items = g.items.filter((i) => matches(f, itemCat(i), itemName(i)));
      mine = h(
        'div',
        h('h3', 'Ваши вещи → в сундук'),
        keys.map((k) => {
          const q = qtyInput(g.stacks[k]);
          q.el.value = String(g.stacks[k]);
          return h('div.r2-goods', h('b', stackName(k)), h('span', `×${g.stacks[k]}`), h('div.r2-item-btns', q.el, this.btn('Положить', null, () => {
            const want = Math.min(q.get(), stackCount(g, k));
            const moved = putStack(g, box, k, want);
            this.s.toast(moved === want ? `Положено: ${stackName(k)} ×${moved}` : `Места хватило на ${moved} из ${want}; остальное осталось у вас`);
            this.s.changed();
            again();
          })));
        }),
        items.map((it) => {
          const p = putItemProblem(g, box, it.uid);
          return h('div.r2-goods', this.itemLine(it), h('span', isEquipped(g, it.uid) ? 'надето' : ''), h('div.r2-item-btns', this.btn('Положить', p, () => this.act(putItem(g, box, it.uid), `Положено: ${itemName(it)}`, again))));
        }),
        h('p.r2-note', 'Золото в сундук положить нельзя. Сундук не пополняется сам; оставленное хранится бессрочно.'),
      );
    }
    const body = h(
      'div',
      h('h1', title),
      h('div.r2-sub', kind === 'chest' ? `Слоты: ${box.entries.length} / ${box.cap} · стак до ${STACK_MAX}` : footer ?? ''),
      h('div.r2-rule'),
      filterBar(f, again),
      h('div.r2-row',
        box.gold > 0 ? this.btn(`Взять золото (${box.gold})`, null, () => { const v = takeGold(g, box); this.s.toast(`+${v} зол.`); this.s.changed(); again(); }) : null,
        this.btn('Взять всё', box.entries.length || box.gold ? null : 'Пусто', () => {
          const r = takeAll(g, box);
          this.s.toast(`Взято: ${r.taken}${r.gold ? `, +${r.gold} зол.` : ''}${r.skipped.length ? `; осталось: ${r.skipped.map((x) => `${x.name} (${x.why})`).join(', ')}` : ''}`);
          this.s.changed();
          again();
        }, true, HINT_TAKE_ALL),
      ),
      list.length ? list : h('p.r2-note', box.entries.length ? 'Под фильтр ничего не попадает (скрытое забирается кнопкой «Взять всё»).' : 'Пусто.'),
      mine,
      h('button.r2-btn.small', { onclick: () => this.s.menus.close('loot') }, 'Закрыть'),
    );
    this.show('loot', body);
  }

  // ------------------------------------------------------------------ NPC hub
  npc(id: MerchantId) {
    const m = MERCHANTS[id];
    const teaches = TEACHES[id as TeacherId];
    const fight = this.s.inCombat();
    const body = h(
      'div',
      h('h1', m.name),
      h('div.r2-sub', `${m.role} · ${m.place}`),
      h('div.r2-rule'),
      h('p', `«${m.greeting}»`),
      fight ? h('p.r2-req.no', 'В бою торговля, обучение и услуги недоступны.') : null,
      h('button.r2-btn', { onclick: () => this.trade(id), class: fight ? 'r2-off' : undefined }, 'Торговля'),
      teaches.length ? h('button.r2-btn', { onclick: () => this.training(id), class: fight ? 'r2-off' : undefined }, 'Обучение') : null,
      id === 'smith' ? h('button.r2-btn', { onclick: () => this.forge(), class: fight ? 'r2-off' : undefined }, 'Улучшение оружия') : null,
      id === 'alchemist' ? h('button.r2-btn', { onclick: () => this.s.mentor('mira') }, 'Характеристики и магия') : null,
      h('p.r2-note', `${m.specialty} Полные диалоги появятся на этапе 5.`),
      h('button.r2-btn.small', { onclick: () => this.s.menus.close('npc') }, 'Уйти'),
    );
    this.show('npc', body);
  }

  // ------------------------------------------------------------------ trade
  private tctx(id: MerchantId): TradeCtx {
    return { g: this.s.growth, m: this.s.world.merchants[id], id, inCombat: this.s.inCombat(), nextUid: () => this.s.nextUid() };
  }
  trade(id: MerchantId, tab = this.tradeTab) {
    if (this.s.inCombat()) return this.s.toast('Торговля только вне боя');
    this.tradeTab = tab;
    const g = this.s.growth;
    const c = this.tctx(id);
    const m = c.m;
    const f = this.cf;
    const again = () => this.trade(id);
    const row = (name: HTMLElement, info: string, unit: number, max: number, stackable: boolean, problem: (q: number) => string | null, go: (q: number) => string | null, label: string, ok: string) => {
      const total = h('span.r2-total', `итого ${unit} зол.`);
      const q = qtyInput(Math.min(TRADE_MAX, max), (v) => (total.textContent = `итого ${unit * Math.max(0, Math.floor(v || 0))} зол.`));
      if (!stackable) q.el.disabled = true;
      return h('div.r2-goods', h('span', name, h('small', ` ${info}`)), h('span', `${unit} зол./шт.`), h('div.r2-item-btns', q.el, total, this.btn(label, problem(1), () => this.act(go(q.get()), ok, again), true)));
    };
    let list: HTMLElement[] = [];
    if (tab === 'buy') {
      list = OFFERS[id]
        .filter((o) => (m.stock[o.id] ?? 0) > 0 || o.replenishes)
        .filter((o) => {
          const gd = offerGoods(o);
          const cat: GoodsCat = 'stack' in gd ? stackCat(gd.stack) : o.kind === 'tool' ? 'tool' : o.kind === 'rune' ? 'rune' : 'gear';
          return matches(f, cat, offerName(c, o));
        })
        .map((o) => {
          const it = m.gear[o.id];
          const name = it ? this.itemLine(it) : h('b', offerName(c, o));
          const left = m.stock[o.id] ?? 0;
          return row(name, `· в наличии ${left}${o.replenishes ? ' (пополняется)' : ''}`, o.unitBuyPrice, left, 'stack' in offerGoods(o), (q) => buyProblem(c, o.id, q), (q) => buy(c, o.id, q), 'Купить', `Куплено: ${offerName(c, o)}`);
        });
    } else if (tab === 'sell') {
      const keys = Object.keys(g.stacks).filter((k) => matches(f, stackCat(k), stackName(k)));
      list = [
        ...keys.map((k) => row(h('b', stackName(k)), `· у вас ${g.stacks[k]}`, sellUnit(stackBuyPrice(k)), g.stacks[k], true, (q) => sellProblem(c, { stack: k }, q), (q) => sell(c, { stack: k }, q), 'Продать', `Продано: ${stackName(k)}`)),
        ...g.items
          .filter((i) => matches(f, itemCat(i), itemName(i)))
          .map((it) => row(this.itemLine(it), isEquipped(g, it.uid) ? '· надето' : '', sellUnit(itemBuyPrice(it)), 1, false, (q) => sellProblem(c, { uid: it.uid }, q), (q) => sell(c, { uid: it.uid }, q), 'Продать', `Продано: ${itemName(it)}`)),
      ];
    } else {
      list = m.buyback.map((e: Entry, i) => {
        const name = e.kind === 'item' ? this.itemLine(e.item) : h('b', stackName(e.key));
        return row(name, e.kind === 'stack' ? `· продано ${e.qty}` : '', buybackUnit(e), e.kind === 'stack' ? e.qty : 1, e.kind === 'stack', (q) => buybackProblem(c, i, q), (q) => buyBack(c, i, q), 'Выкупить', `Выкуплено: ${entryName(e)}`);
      });
    }
    const cyc = m.cycleLeft === null ? 'пополнение начнётся после первой покупки пополняемого товара' : `пополнение через ${Math.ceil(m.cycleLeft / 60)} мин активной игры`;
    const body = h(
      'div',
      h('h1', `${MERCHANTS[id].name} · торговля`),
      h('div.r2-sub', `Ваше золото: ${g.gold} · у торговца: ${m.wallet} зол. · ${cyc}`),
      h('div.r2-rule'),
      h('div.r2-tabs', ([['buy', 'Купить'], ['sell', 'Продать'], ['buyback', `Выкуп (${m.buyback.length})`]] as const).map(([t, l]) => h('button.r2-btn.small' + (tab === t ? '.sel' : ''), { onclick: () => this.trade(id, t) }, l))),
      tab !== 'buyback' ? filterBar(f, again) : null,
      list.length ? list : h('p.r2-note', 'Пусто.'),
      h('p.r2-note', 'За одну операцию — от 1 до 99 штук складываемого товара, экипировка и инструменты по одному. Продажа — 25 % цены покупки (вниз, не меньше 1 за штуку) и только если у торговца хватает золота на всю партию. Проданное можно выкупить у этого торговца бессрочно по полной цене. Надетое и избранное не продаётся.'),
      h('button.r2-btn.small', { onclick: () => this.npc(id) }, 'Назад'),
    );
    this.show('npc', body);
  }

  // ------------------------------------------------------------------ training (crafts, hunting, gathering)
  training(id: TeacherId) {
    if (this.s.inCombat()) return this.s.toast('Обучение только вне боя');
    const g = this.s.growth;
    const c = { g, hero: this.s.hero, inCombat: this.s.inCombat() };
    const again = () => this.training(id);
    const body = h(
      'div',
      h('h1', `${MERCHANTS[id as MerchantId].name} · обучение`),
      h('div.r2-sub', `LP ${this.s.hero.progress.lp} · золото ${g.gold}`),
      h('div.r2-rule'),
      TEACHES[id].map((t) => {
        const p = trainProblem(c, id, t.id);
        return h(
          'div.r2-card',
          h('div.r2-card-h', h('span', t.name), knows(g, t.id) ? h('span.r2-req.ok', 'изучено') : h('small', `${t.lp} LP · ${t.gold} зол.${t.attr ? ` · ${t.attr.toUpperCase()} ${t.threshold}` : ''}`)),
          t.effect ? h('p', t.effect) : null,
          knows(g, t.id) ? null : this.btn('Изучить', p, () => this.act(train(this.ctxC(), id, t.id), `Изучено: ${t.name}`, again), true),
        );
      }),
      h('p.r2-note', 'Ступени изучаются по порядку, LP не возвращаются. Плата за обучение не идёт в кошелёк торговца.'),
      h('button.r2-btn.small', { onclick: () => this.npc(id as MerchantId) }, 'Назад'),
    );
    this.show('npc', body);
  }
  private ctxC() {
    return { g: this.s.growth, hero: this.s.hero, inCombat: this.s.inCombat() };
  }

  // ------------------------------------------------------------------ smith upgrades
  forge() {
    if (this.s.inCombat()) return this.s.toast('Услуги только вне боя');
    const g = this.s.growth;
    const again = () => this.forge();
    const weapons = g.items.filter((i) => isGear(i.tpl) && /sword|bow|staff/.test(i.tpl));
    const body = h(
      'div',
      h('h1', 'Бран · улучшение оружия'),
      h('div.r2-sub', `Золото ${g.gold} · уголь ${stackCount(g, 'coal')} · железо ${stackCount(g, 'iron')} · сталь ${stackCount(g, 'steel')} · укреплённые ${stackCount(g, 'alloy')}`),
      h('div.r2-rule'),
      weapons.length
        ? weapons.map((it) =>
            h('div.r2-card', this.itemLine(it), it.upgrade ? null : h('div.r2-item-btns', (['sharp', 'tempered'] as Upgrade[]).map((u) => {
              const k = forgeCost(it.tpl, u);
              const mats = Object.entries(k.materials).map(([m, n]) => `${stackName(m)} ×${n}`).join(', ');
              return this.btn(`${upgradeName(it.tpl, u)} (+${u === 'sharp' ? 10 : 15}%): ${k.gold} зол., ${mats}`, upgradeProblem(this.ctxC(), it.uid, u), () =>
                this.s.menus.confirm(`${upgradeName(it.tpl, u)} для «${itemName(it)}» навсегда?`, () => this.act(upgradeWeapon(this.ctxC(), it.uid, u), `Улучшено: ${itemName(it)}`, again)));
            }))),
          )
        : h('p.r2-note', 'Нет оружия.'),
      h('p.r2-note', 'Одно постоянное улучшение на экземпляр, без замены. Надетое оружие сначала нужно снять или заменить. Улучшение действует на обычные атаки и физические навыки, не меняет цену.'),
      h('button.r2-btn.small', { onclick: () => this.npc('smith') }, 'Назад'),
    );
    this.show('npc', body);
  }

  // ------------------------------------------------------------------ stations
  station(st: Station) {
    if (this.s.inCombat()) return this.s.toast('Изготовление только вне боя');
    const g = this.s.growth;
    const again = () => this.station(st);
    const list = recipesAt(st).map((r) => {
      const need = h('div.r2-note');
      const paint = (runs: number) => {
        need.textContent = Object.entries(r.ingredients).map(([k, n]) => `${stackName(k)} ${stackCount(g, k)}/${n * runs}`).join(' · ');
        const out = recipeOutput(r);
        res.textContent = 'stack' in out ? `Результат: ${stackName(out.stack)} ×${out.qty * runs}` : `Результат: ${runs} шт.`;
      };
      const res = h('div.r2-note');
      const q = qtyInput(CRAFT_MAX, (v) => paint(Math.max(1, Math.floor(v || 1))));
      paint(1);
      const p = craftProblem(this.ctxC(), st, r.id, 1);
      return h(
        'div.r2-card',
        h('div.r2-card-h', h('span', r.name), h('small', `${PROFESSION_NAME[r.profession]} ${'I'.repeat(r.tier)}`)),
        h('p', r.effect),
        need,
        res,
        h('div.r2-item-btns', q.el, this.btn('Изготовить', p, () => this.act(craft(this.ctxC(), st, r.id, q.get(), () => this.s.nextUid()), `Изготовлено: ${r.name} ×${q.get()}`, again), true)),
      );
    });
    const body = h(
      'div',
      h('h1', STATION_NAME[st]),
      h('div.r2-sub', `Ступени: кузнечное дело ${g.crafts.smith}, алхимия ${g.crafts.alchemy}, кулинария ${g.crafts.cooking}`),
      h('div.r2-rule'),
      list,
      h('p.r2-note', 'Выберите число запусков: при нехватке материалов на весь объём ничего не создаётся и не списывается. Без шанса неудачи. Ингредиенты берутся только из инвентаря героя.'),
      h('button.r2-btn.small', { onclick: () => this.s.menus.close('station') }, 'Закрыть'),
    );
    this.show('station', body);
  }
}

export { CAT_NAME };

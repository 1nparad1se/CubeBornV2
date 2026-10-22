import { h } from '../../ui/dom';
import { SKILLS, SPELLS, WEAPON_BY_ID, type WeaponFamily } from '../combat/data';
import { masteryOf, masteryThreshold } from '../combat/formulas';
import { FAMILY_NAME, type CombatSystem } from '../combat/system';
import {
  CIRCLES, MENTORS, MOD_TIERS, SKILL_MODS, SPELL_MODS, buyModTier, chooseMod, chooseModProblem, circleProblem, equip, isEquipped, itemOf,
  learnSkill, learnSpell, learnTalent, modResetCost, modState, modTierProblem, openCircle, resetMods, resetTalents, skillProblem, spellProblem,
  statCost, statProblem, totalArmor, trainStat, unequip, type GrowthData, type LearnCtx, type MentorId,
} from '../growth/growth';
import {
  AFFIXES, ARMOR_BY_ID, LEGENDARY, RARITY, SLOT_NAME, UPGRADE, affixText, itemArmor, itemName, itemSlot, reqProblem, type EquipSlot, type Item,
} from '../growth/items';
import { MAX_LEVEL, xpForLevel } from '../growth/levels';
import { TALENTS, TIER_REQ, TREE_NAME, talentProblem, talentResetCost, type TreeId } from '../growth/talents';
import { STAT_IDS, STAT_NAMES, type HeroState, type StatId } from '../hero';
import type { SceneMenus } from './menus';

/** What the stage 3 screens need from the scene. */
export interface GrowthHost {
  hero: HeroState;
  growth: GrowthData;
  combat: CombatSystem;
  menus: SceneMenus;
  name: string;
  inCombat(): boolean;
  toast(t: string): void;
  /** Equipment or talents changed: the scene updates the drawn gear, armor and maxima. */
  changed(): void;
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V'];
const RANKS: [number, string][] = [[100, 'Великий мастер'], [80, 'Мастер'], [60, 'Ветеран'], [40, 'Знаток'], [20, 'Ученик'], [1, 'Новичок']];
export const rankName = (m: number) => RANKS.find(([v]) => m >= v)![1];
const fmt = (n: number) => String(Math.round(n * 100) / 100).replace('.', ',');

/**
 * Stage 3 windows in the GDD style: the character sheet (C), development — skills, magic and
 * talents (K), inventory and equipment (I), and the mentor window (personal interaction, E).
 */
export class GrowthScreens {
  constructor(private s: GrowthHost) {}

  private ctx(): LearnCtx {
    const s = this.s;
    return { g: s.growth, hero: s.hero, learned: s.combat.data.learned, om: s.combat.data.om, inCombat: s.inCombat() };
  }

  /** Rebuilds a window keeping its scroll position. */
  private show(id: string, body: HTMLElement) {
    const old = document.querySelector(`.r2-menu-${id} .r2-win`) as HTMLElement | null;
    const top = old?.scrollTop ?? 0;
    this.s.menus.show(id, body);
    const nw = document.querySelector(`.r2-menu-${id} .r2-win`) as HTMLElement | null;
    if (nw) nw.scrollTop = top;
  }

  private act(res: string | null, ok: string, again: () => void) {
    if (res) this.s.toast(res);
    else {
      this.s.toast(ok);
      this.s.changed();
    }
    again();
  }

  private btn(label: string, problem: string | null, fn: () => void, primary = false) {
    return h('button.r2-btn.small' + (primary ? '.primary' : ''), { onclick: fn, title: problem ?? undefined, class: problem ? 'r2-off' : undefined }, label);
  }

  // ------------------------------------------------------------------ character (C)
  character() {
    const { hero, growth: g, combat: c } = this.s;
    const p = hero.progress;
    const kv = (k: string, v: string | number, title = '') => [h('span', { title }, k), h('b', String(v))];
    const next = p.level >= MAX_LEVEL ? '—' : `${p.xp - xpForLevel(p.level)} / ${xpForLevel(p.level + 1) - xpForLevel(p.level)}`;
    const w = c.weapon;
    const b = c.bonus;
    const body = h(
      'div',
      h('h1', this.s.name),
      h('div.r2-sub', `Человек · уровень ${p.level}`),
      h('div.r2-rule'),
      h(
        'div.r2-kv',
        h('h3', 'Развитие'),
        kv('Уровень', p.level),
        kv('Опыт до следующего', next),
        kv('Всего опыта', p.xp),
        kv('Очки обучения (LP)', p.lp),
        kv('Очки талантов (ОТ)', p.tp),
        kv('Золото', g.gold),
        h('h3', 'Характеристики (обучаются у наставников)'),
        STAT_IDS.map((s) => kv(STAT_NAMES[s], hero.stats[s], `Следующий пункт: ${statCost(hero.stats[s]).lp} LP + ${statCost(hero.stats[s]).gold} зол.`)),
        h('h3', 'Запасы'),
        kv('Здоровье (HP)', `${Math.floor(hero.hp)} / ${hero.maxHp}`),
        kv('Мана (MP)', `${Math.floor(hero.mp)} / ${hero.maxMp}`),
        kv('Выносливость (ST)', `${Math.floor(hero.st)} / ${hero.maxSt}`),
        h('h3', 'Бой'),
        kv('Оружие', `${w.name} (${w.damage} × ${fmt(b.baseMul)}, ${fmt(w.aps * b.atkSpeed)} атак/с)`),
        kv('Множитель характеристики', `×${fmt(1 + hero.stats[w.attr] / 100)} (${w.attr.toUpperCase()})`),
        kv('Физическая защита (броня)', totalArmor(g)),
        kv('Крит меча и лука', `${fmt(Math.min(50, 5 + b.physCrit * 100))}% · ×${fmt(Math.min(2.5, 1.5 + b.physCritPow))}`),
        kv('Крит магии', `${fmt(Math.min(50, 5 + b.magicCrit * 100))}% · ×${fmt(Math.min(2.5, 1.5 + b.magicCritPow))}`),
        kv('Снижение урона блоком', `${Math.round(b.blockReduce * 100)}%`),
        h('h3', 'Мастерство'),
        (['sword', 'bow', 'staff'] as WeaponFamily[]).map((f) => {
          const m = masteryOf(c.data.om[f]);
          const nx = m >= 100 ? '' : ` · до ${m + 1}: ${masteryThreshold(m + 1) - c.data.om[f]} ОМ`;
          return kv(FAMILY_NAME[f], `${m} — ${rankName(m)}${nx}`);
        }),
        h('h3', 'Прочее'),
        kv('Малые зелья HP', g.potions.hpSmall),
        kv('Побеждено противников', c.data.kills),
      ),
      h('div', { style: 'margin-top:14px' }, h('button.r2-btn.small', { onclick: () => this.s.menus.close('character') }, 'Закрыть')),
    );
    this.show('character', body);
  }

  // ------------------------------------------------------------------ development (K)
  private devTab: 'sword' | 'bow' | 'magic' | 'talents' = 'sword';

  development(tab = this.devTab) {
    this.devTab = tab;
    const c = this.ctx();
    const p = this.s.hero.progress;
    const tabs = h(
      'div.r2-tabs',
      ([['sword', 'Навыки меча'], ['bow', 'Навыки лука'], ['magic', 'Магия'], ['talents', 'Таланты']] as const).map(([id, label]) =>
        h('button.r2-btn.small' + (tab === id ? '.sel' : ''), { onclick: () => this.development(id) }, label),
      ),
    );
    let content: HTMLElement;
    if (tab === 'talents') content = this.talentsView(c);
    else if (tab === 'magic') content = this.magicView(c, null);
    else content = this.skillsView(c, tab, null);
    const body = h(
      'div',
      h('h1', 'Развитие'),
      h('div.r2-sub', `LP ${p.lp} · ОТ ${p.tp} · золото ${this.s.growth.gold}${c.inCombat ? ' · в бою: только просмотр' : ''}`),
      h('div.r2-rule'),
      tabs,
      content,
      h('p.r2-note', 'Обучение навыкам, кругам, заклинаниям и ступеням модификаций — у наставников (Арден — меч, Хира — лук, Мира — магия). Здесь: требования и цены, выбор оплаченных модификаций и таланты вне боя.'),
      h('button.r2-btn.small', { onclick: () => this.s.menus.close('development') }, 'Закрыть'),
    );
    this.show('development', body);
  }

  private req(okv: boolean, text: string) {
    return h('span.r2-req' + (okv ? '.ok' : '.no'), text);
  }

  /** Mods of one ability: paid tiers, choices (personal screen) or purchase (mentor). */
  private modsRow(c: LearnCtx, id: string, mentor: MentorId | null, again: () => void): HTMLElement {
    const st = modState(c.g, id);
    const names = SKILLS.some((x) => x.id === id) ? SKILL_MODS : SPELL_MODS;
    const row = h('div.r2-mods');
    for (let t = 1; t <= 3; t++) {
      const tier = MOD_TIERS[t - 1];
      const cell = h('div.r2-mod', h('b', `Ступень ${ROMAN[t - 1]}`), h('small', ` (мастерство ${tier.mastery}, ${tier.lp} LP + ${tier.gold} зол.)`));
      const chosen = st.chosen[t - 1];
      if (st.paid >= t) {
        if (chosen !== null) cell.append(h('div.r2-req.ok', `Выбрано: ${names[t - 1][chosen].name} — ${names[t - 1][chosen].text}`));
        else if (!mentor) {
          const prob = chooseModProblem(c.g, id, t, c.inCombat);
          for (const v of [0, 1] as const)
            cell.append(this.btn(`${v ? 'Б' : 'A'}: ${names[t - 1][v].name} (${names[t - 1][v].text})`, prob, () =>
              this.s.menus.confirm(`Закрепить «${names[t - 1][v].name}»? Смена — только платным сбросом у наставника.`, () => this.act(chooseMod(c.g, id, t, v, this.s.inCombat()), 'Модификация выбрана', again)),
            ));
        } else cell.append(h('div.r2-req.ok', 'Оплачено — выбор в личном экране (K)'));
      } else {
        cell.append(h('div.r2-note', `A: ${names[t - 1][0].name} (${names[t - 1][0].text}) · Б: ${names[t - 1][1].name} (${names[t - 1][1].text})`));
        if (mentor) {
          const prob = modTierProblem(c, mentor, id, t);
          cell.append(this.btn('Оплатить ступень', prob, () => this.act(buyModTier(this.ctx(), mentor, id, t), `Ступень ${ROMAN[t - 1]} оплачена`, again)));
        } else cell.append(h('div.r2-req.no', 'Не оплачено'));
      }
      row.append(cell);
    }
    if (mentor && st.chosen.some((x) => x !== null)) {
      const cost = modResetCost(this.s.hero.progress.level);
      row.append(this.btn(`Сбросить выбор (${cost} зол.)`, null, () => this.s.menus.confirm(`Сбросить выбранные модификации за ${cost} зол.? Оплаченные ступени сохранятся, LP не возвращаются.`, () => this.act(resetMods(this.ctx(), mentor, id), 'Выбор модификаций сброшен', again))));
    }
    return row;
  }

  skillsView(c: LearnCtx, fam: 'sword' | 'bow', mentor: MentorId | null): HTMLElement {
    const box = h('div');
    const m = masteryOf(c.om[fam]);
    const attr: StatId = fam === 'sword' ? 'str' : 'dex';
    const again = () => (mentor ? this.mentor(mentor) : this.development());
    for (const sk of SKILLS.filter((x) => x.family === fam)) {
      const learned = c.learned.includes(sk.id);
      const card = h(
        'div.r2-card',
        h('div.r2-card-h', h('b', sk.name), h('small', ` ${sk.st} ST · откат ${fmt(sk.cd)} с${sk.prep ? ` · подготовка ${fmt(sk.prep)} с` : ''}`), learned ? h('span.r2-req.ok', ' Изучено') : null),
        h('div', this.req(this.s.hero.stats[attr] >= sk.attr, `${attr.toUpperCase()} ${sk.attr}`), ' ', this.req(m >= sk.mastery, `мастерство ${sk.mastery}`), ' ', h('span.r2-req', `${sk.lp} LP + ${sk.gold} зол.`)),
      );
      if (!learned) {
        if (mentor) card.append(this.btn('Изучить', skillProblem(c, mentor, sk.id), () => this.act(learnSkill(this.ctx(), mentor, sk.id), `Изучено: ${sk.name}`, again), true));
        else card.append(h('div.r2-note', `Обучение: ${fam === 'sword' ? 'Арден' : 'Хира'}`));
      } else card.append(this.modsRow(c, sk.id, mentor, again));
      box.append(card);
    }
    return box;
  }

  magicView(c: LearnCtx, mentor: MentorId | null): HTMLElement {
    const box = h('div');
    const m = masteryOf(c.om.staff);
    const again = () => (mentor ? this.mentor(mentor) : this.development());
    const circles = h('div.r2-card', h('div.r2-card-h', h('b', 'Круги магии'), h('small', ` открыто: ${c.g.circles} из 5`)));
    CIRCLES.forEach((r, i) => {
      const open = c.g.circles > i;
      const line = h('div', h('b', `${ROMAN[i]} круг `), this.req(this.s.hero.stats.int >= r.int, `INT ${r.int}`), ' ', this.req(m >= r.mastery, `мастерство посоха ${r.mastery}`), ' ', h('span.r2-req', `${r.lp} LP + ${r.gold} зол.`), open ? h('span.r2-req.ok', ' Открыт') : null);
      if (!open && mentor) line.append(' ', this.btn('Открыть', circleProblem(c, mentor, i + 1), () => this.act(openCircle(this.ctx(), mentor, i + 1), `Открыт ${ROMAN[i]} круг`, again), true));
      circles.append(line);
    });
    box.append(circles);
    for (const school of ['fire', 'ice', 'lightning'] as const) {
      box.append(h('h3', { fire: 'Огонь', ice: 'Вода / Лёд', lightning: 'Молния' }[school]));
      for (const sp of SPELLS.filter((x) => x.school === school)) {
        const learned = c.learned.includes(sp.id);
        const card = h(
          'div.r2-card',
          h('div.r2-card-h', h('b', `${ROMAN[sp.tier - 1]}. ${sp.name}`), h('small', ` ${sp.hits.join(' + ')} урона · ${sp.mp} MP · откат ${fmt(sp.cd)} с · подготовка ${fmt(sp.cast)} с · ${sp.range} м`), learned ? h('span.r2-req.ok', ' Изучено') : null),
          h('div', this.req(c.g.circles >= sp.tier, `круг ${ROMAN[sp.tier - 1]}`), ' ', this.req(this.s.hero.stats.int >= CIRCLES[sp.tier - 1].int, `INT ${CIRCLES[sp.tier - 1].int}`), ' ', this.req(m >= CIRCLES[sp.tier - 1].mastery, `мастерство ${CIRCLES[sp.tier - 1].mastery}`), ' ', h('span.r2-req', `${sp.lp} LP + ${sp.gold} зол.`)),
        );
        if (!learned) {
          if (mentor) card.append(this.btn('Изучить', spellProblem(c, mentor, sp.id), () => this.act(learnSpell(this.ctx(), mentor, sp.id), `Изучено: ${sp.name}`, again), true));
        } else card.append(this.modsRow(c, sp.id, mentor, again));
        box.append(card);
      }
    }
    return box;
  }

  talentsView(c: LearnCtx): HTMLElement {
    const p = this.s.hero.progress;
    const grid = h('div.r2-trees');
    for (const tree of ['phys', 'magic', 'surv'] as TreeId[]) {
      const col = h('div.r2-tree', h('h3', TREE_NAME[tree]));
      const branches = [...new Set(TALENTS.filter((t) => t.tree === tree).map((t) => t.branch))];
      for (const br of branches) {
        col.append(h('div.r2-branch', br));
        for (const t of TALENTS.filter((x) => x.tree === tree && x.branch === br)) {
          const has = c.g.talents.includes(t.id);
          const prob = has ? null : talentProblem(t.id, c.g.talents, p.level, p.tp, c.inCombat);
          const node = h('div.r2-talent' + (has ? '.on' : prob ? '.off' : ''), h('b', `${ROMAN[t.tier - 1]}. ${t.name}`), h('div.r2-note', t.effect), h('small', `уровень ${TIER_REQ[t.tier].level}, в дереве ≥ ${TIER_REQ[t.tier].spent} ОТ · 1 ОТ`));
          if (!has) node.append(this.btn('Изучить', prob, () => this.s.menus.confirm(`Изучить «${t.name}» за 1 ОТ? Отменить можно только полным платным сбросом у наставника.`, () => this.act(learnTalent(this.ctx(), t.id), `Талант изучен: ${t.name}`, () => this.development('talents')))));
          col.append(node);
        }
      }
      grid.append(col);
    }
    return h('div', grid, h('p.r2-note', `Полный сброс — у Ардена, Хиры или Миры вне боя: ${talentResetCost(p.level)} зол. (100 + 25 × уровень).`));
  }

  // ------------------------------------------------------------------ mentor (E)
  private mentorTab: 'stats' | 'learn' | 'talents' = 'stats';

  mentor(id: MentorId, tab = this.mentorTab) {
    this.mentorTab = tab;
    const md = MENTORS[id];
    const c = this.ctx();
    const again = () => this.mentor(id);
    let content: HTMLElement;
    if (tab === 'stats') {
      content = h('div.r2-kv');
      for (const s of md.stats) {
        const k = statCost(this.s.hero.stats[s]);
        content.append(h('span', `${STAT_NAMES[s]}: ${this.s.hero.stats[s]}`), h('span', h('small', `+1 за ${k.lp} LP + ${k.gold} зол. `), this.btn('+1', statProblem(c, id, s), () => this.act(trainStat(this.ctx(), id, s), `${STAT_NAMES[s]}: ${this.s.hero.stats[s] + 1}`, again), true)));
      }
    } else if (tab === 'learn') content = md.teaches === 'magic' ? this.magicView(c, id) : this.skillsView(c, md.teaches, id);
    else {
      const cost = talentResetCost(this.s.hero.progress.level);
      content = h(
        'div',
        h('p', `Изучено талантов: ${this.s.growth.talents.length}. Полный сброс всех трёх деревьев возвращает все ОТ; LP не возвращаются.`),
        this.btn(`Сбросить все таланты (${cost} зол.)`, this.s.growth.talents.length ? null : 'Таланты не изучены', () => this.s.menus.confirm(`Сбросить все таланты за ${cost} зол.?`, () => this.act(resetTalents(this.ctx()), 'Таланты сброшены', again))),
      );
    }
    const learnName = md.teaches === 'magic' ? 'Круги и заклинания' : md.teaches === 'sword' ? 'Навыки меча' : 'Навыки лука';
    const body = h(
      'div',
      h('h1', md.name),
      h('div.r2-sub', `Наставник · ${md.place} · LP ${this.s.hero.progress.lp} · золото ${this.s.growth.gold}`),
      h('div.r2-rule'),
      c.inCombat ? h('p.r2-req.no', 'В бою обучение недоступно.') : null,
      h('div.r2-tabs', ([['stats', 'Характеристики'], ['learn', learnName], ['talents', 'Сброс талантов']] as const).map(([t, l]) => h('button.r2-btn.small' + (tab === t ? '.sel' : ''), { onclick: () => this.mentor(id, t) }, l))),
      content,
      h('p.r2-note', 'Обучение по одному пункту за действие, LP не возвращаются. Полные диалоги наставников появятся на этапе 5.'),
      h('button.r2-btn.small', { onclick: () => this.s.menus.close('mentor') }, 'Уйти'),
    );
    this.show('mentor', body);
  }

  // ------------------------------------------------------------------ inventory (I)
  inventory() {
    const g = this.s.growth;
    const c = this.s.combat;
    const again = () => this.inventory();
    const card = (it: Item, worn: boolean) => {
      const r = RARITY[it.rarity];
      const w = WEAPON_BY_ID[it.tpl];
      const a = ARMOR_BY_ID[it.tpl];
      const prob = reqProblem(it, this.s.hero.stats);
      const lines: (HTMLElement | string)[] = [];
      if (w) lines.push(`${FAMILY_NAME[w.family]}${w.kind === 'greatsword' ? ' (двуручный)' : ''} · ${w.damage}${it.upgrade ? ` × ${fmt(UPGRADE[it.upgrade].mul)} (${UPGRADE[it.upgrade].name})` : ''} ${w.family === 'staff' ? 'магического' : 'физического'} урона · ${fmt(w.aps)} атак/с`);
      if (a) lines.push(`${SLOT_NAME[a.slot]} · защита ${itemArmor(it)}${it.rarity !== 'common' ? ` (база ${a.armor} × ${fmt(r.armor)})` : ''}`);
      const req = Object.entries(w ? { [w.attr]: w.req } : a.req).map(([k, v]) => `${k.toUpperCase()} ${v}`).join(', ');
      const qi = c.data.quick.indexOf(it.uid);
      const el = h(
        'div.r2-item',
        { style: `border-color:${r.color}` },
        h('div.r2-card-h', h('b', { style: `color:${r.color}` }, itemName(it)), h('small', ` ${r.name}`), it.fav ? h('span', ' ★') : null, worn ? h('span.r2-req.ok', ' Надето') : null, qi >= 0 ? h('span.r2-req', ` Tab ${qi + 1}`) : null),
        h('div.r2-note', lines.join(' ')),
        it.affixes.map((x) => h('div.r2-affix', affixText(x))),
        w && it.rarity === 'legendary' ? h('div.r2-legend', `${LEGENDARY[w.kind].name}: ${LEGENDARY[w.kind].effect}`) : null,
        h('div', this.req(!prob, `Требуется: ${req}`)),
      );
      const row = h('div.r2-item-btns');
      if (!worn) row.append(this.btn('Надеть', prob, () => this.act(equip(g, it.uid, this.s.hero), `Надето: ${itemName(it)}`, again), true));
      else if (itemSlot(it) !== 'weapon') row.append(this.btn('Снять', null, () => this.act(unequip(g, itemSlot(it)), `Снято: ${itemName(it)}`, again)));
      row.append(this.btn(it.fav ? 'Снять отметку ★' : 'Избранное ★', null, () => { it.fav = !it.fav; again(); }));
      if (w) {
        if (qi >= 0) row.append(this.btn('Убрать из Tab', null, () => { c.setQuick(qi, null); this.s.changed(); again(); }));
        else {
          const free = c.data.quick.indexOf(null);
          row.append(this.btn('В список Tab', free < 0 ? 'Список Tab полон (4)' : null, () => { c.setQuick(free, it.uid); this.s.changed(); again(); }));
        }
      }
      el.append(row);
      return el;
    };
    const slots = h('div.r2-equip');
    for (const s of ['weapon', 'head', 'chest', 'legs'] as EquipSlot[]) {
      const it = itemOf(g, g.equip[s]);
      slots.append(h('div.r2-eslot', h('small', SLOT_NAME[s]), it ? card(it, true) : h('div.r2-note', 'пусто')));
    }
    const bag = g.items.filter((i) => !isEquipped(g, i.uid));
    const body = h(
      'div',
      h('h1', 'Инвентарь'),
      h('div.r2-sub', `Золото: ${g.gold} · броня: ${totalArmor(g)} · малые зелья HP: ${g.potions.hpSmall}`),
      h('div.r2-rule'),
      h('h3', 'Экипировка (шлем, нагрудник, штаны, оружие)'),
      slots,
      h('h3', `Сумка (${bag.length})`),
      bag.length ? h('div.r2-bag', bag.map((i) => card(i, false))) : h('p.r2-note', 'Пусто.'),
      h('p.r2-note', 'Требования проверяются по обученным характеристикам. Список Tab — до четырёх экземпляров оружия по кругу. Броня даёт только физическую защиту.'),
      h('button.r2-btn.small', { onclick: () => this.s.menus.close('inventory') }, 'Закрыть'),
    );
    this.show('inventory', body);
  }
}

export { AFFIXES };

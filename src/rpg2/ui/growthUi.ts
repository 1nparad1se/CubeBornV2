import { h } from '../../ui/dom';
import { SKILLS, SPELLS, WEAPON_BY_ID, type SkillDef, type SpellDef, type WeaponFamily } from '../combat/data';
import { MASTERY, combatAwardBase, masteryOf, masteryThreshold, trainingAward } from '../combat/formulas';
import { FAMILY_NAME, type CombatSystem } from '../combat/system';
import {
  CIRCLES, MENTORS, MOD_TIERS, SKILL_MODS, SPELL_MODS, abilityMods, buyModTier, chooseMod, chooseModProblem, circleProblem, equip, isEquipped, itemOf,
  learnSkill, learnSpell, learnTalent, modResetCost, modState, modTierProblem, openCircle, resetMods, resetTalents, skillProblem, spellProblem,
  statCost, statProblem, totalArmor, trainStat, unequip, type GrowthData, type LearnCtx, type MentorId,
} from '../growth/growth';
import {
  AFFIXES, ARMOR_BY_ID, LEGENDARY, RARITIES, RARITY, SLOT_NAME, UPGRADE, affixText, isGear, isRune, itemArmor, itemName, itemSlot, reqProblem, upgradeName, type EquipSlot, type Item,
} from '../growth/items';
import { LP_PER_LEVEL, MAX_LEVEL, xpForLevel, xpStep } from '../growth/levels';
import { TALENTS, TIER_REQ, TREE_NAME, talentProblem, talentResetCost, type TalentDef, type TreeId } from '../growth/talents';
import { STAT_IDS, STAT_NAMES, maxHpFor, maxMpFor, type HeroState, type StatId } from '../hero';
import { stackCat, stackName, itemCat, stackBuyPrice } from '../economy/goods';
import type { Slot } from '../../rpg/items';
import type { SceneMenus } from './menus';
import { iconForKey, pxIcon } from '../../ui/pixelIcons';
import { heroFigure } from './figure';
import { bar, bigBtn, bigIcon, chip, fmt, note, panel, phead, req, row, rule, screen, scroll, search, select, table, tabs, tag, tile, tiles } from './kit';

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
  /** Stage 4: the goods part of the inventory (materials, consumables, tools, runes) under the same filter. */
  extraInventory?(f: InvFilter, again: () => void): HTMLElement | null;
  /** Stage 4: description and actions of a selected stack or tool/rune in the inventory detail panel. */
  goodsDetail?(sel: { key: string } | { uid: string }, again: () => void): HTMLElement[];
  /** Stage 4: buy price of an item, for sorting by price. */
  itemPrice?(it: Item): number;
  /** Test scene: the training aid of the mentor window raises the hero's level / XP. */
  trainXp?(v: { levels?: number; xp?: number }): void;
}

/** Inventory search, category filter and sort (stage 4, kept while the window is rebuilt). */
export interface InvFilter {
  q: string;
  cat: 'all' | 'gear' | 'material' | 'consumable' | 'tool' | 'rune';
  sort: 'order' | 'name' | 'price' | 'rarity';
}
export const INV_CATS: [InvFilter['cat'], string][] = [['all', 'Все предметы'], ['gear', 'Экипировка'], ['material', 'Материалы'], ['consumable', 'Расходники'], ['tool', 'Инструменты'], ['rune', 'Руны']];
export const INV_SORTS: [InvFilter['sort'], string][] = [['order', 'По порядку'], ['name', 'По названию'], ['price', 'По цене'], ['rarity', 'По редкости']];

/** Search field with category and sort selectors (`on` rebuilds the window). */
export function filterBar(f: InvFilter, on: () => void, key = 'inv', placeholder = 'Поиск предметов'): HTMLElement {
  return h(
    'div.r2-filterbox',
    search(f.q, placeholder, (v) => { f.q = v; on(); }, key),
    h('div.r2-filters', select(INV_CATS, f.cat, (x) => { f.cat = x; on(); }), select(INV_SORTS, f.sort, (x) => { f.sort = x; on(); })),
  );
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V'];
const RANKS: [number, string][] = [[100, 'Великий мастер'], [80, 'Мастер'], [60, 'Ветеран'], [40, 'Знаток'], [20, 'Ученик'], [1, 'Новичок']];
export const rankName = (m: number) => RANKS.find(([v]) => m >= v)![1];
const STAT_SHORT: Record<StatId, string> = { str: 'Сила · STR', dex: 'Ловкость · DEX', int: 'Интеллект · INT', vit: 'Живучесть · VIT', spi: 'Дух · SPI', res: 'Стойкость · RES' };
const STAT_WORD: Record<StatId, string> = { str: 'Сила', dex: 'Ловкость', int: 'Интеллект', vit: 'Живучесть', spi: 'Дух', res: 'Стойкость' };
const STAT_GEN: Record<StatId, string> = { str: 'силы', dex: 'ловкости', int: 'интеллекта', vit: 'живучести', spi: 'духа', res: 'стойкости' };
const SCHOOL_NAME = { fire: 'Огонь', ice: 'Вода / Лёд', lightning: 'Молния' } as const;
const TALENT_ICON: Record<string, string> = {
  p_a1: 's1', p_a2: 'b1', p_a3: 's6', p_b1: 'boot', p_b2: 'clock', p_b3: 'shield-blue',
  m_a1: 'f2', m_a2: 'l1', m_a3: 'l5', m_b1: 'mp', m_b2: 'potion-mp', m_b3: 'hourglass',
  s_a1: 'heart', s_a2: 'st', s_a3: 'bolt', s_b1: 'boot', s_b2: 'refresh', s_b3: 'potion-hp',
};
const FAMILY_ICON: Record<WeaponFamily, string> = { sword: 'sword', bow: 'bow', staff: 'staff' };
const TEACHER: Record<WeaponFamily, string> = { sword: 'Арден', bow: 'Хира', staff: 'Мира' };
const TEACHER_GEN: Record<WeaponFamily, string> = { sword: 'Ардена', bow: 'Хиры', staff: 'Миры' };
const FAMILY_ATTR: Record<WeaponFamily, StatId> = { sword: 'str', bow: 'dex', staff: 'int' };

/** One line about what a skill does (from its shape and effects). */
function skillText(sk: SkillDef): string {
  const s = sk.shape;
  let t: string;
  if (s.type === 'melee') t = s.sector >= 360 ? 'Круговой удар по всем рядом.' : s.maxTargets === 1 ? 'Один удар по цели.' : `Удар по дуге ${s.sector}° перед собой.`;
  else t = s.count > 1 ? `${s.count} стрелы${'spreadDeg' in s && s.spreadDeg ? ` веером ${s.spreadDeg}°` : ''}, дальность ${s.range} м.` : `Выстрел на ${s.range} м${'pierce' in s && s.pierce ? ', пробивает до трёх целей' : ''}.`;
  if (sk.stun) t += ` Оглушение ${fmt(sk.stun)} с.`;
  if (sk.slow) t += ` Замедление ${Math.round(sk.slow.power * 100)}% на ${fmt(sk.slow.dur)} с.`;
  if (sk.knock) t += ` Отбрасывает на ${sk.knock} м.`;
  if (sk.executeCoef) t += ` По цели с HP ≤ 30%: ${Math.round(sk.executeCoef * 100)}%.`;
  return t;
}
function spellText(sp: SpellDef): string {
  const s = sp.shape;
  let t = s.type === 'bolt' ? ('explode' in s && s.explode ? 'Взрыв в точке попадания.' : 'Снаряд в цель.') : s.type === 'sector' ? `Волна перед собой, ${s.deg}°.` : s.type === 'zone' ? `Область радиусом ${s.radius} м, ${s.pulses.length} импульса.` : 'Цепь между целями.';
  if (sp.slow) t += ` Замедление ${Math.round(sp.slow.power * 100)}% на ${fmt(sp.slow.dur)} с.`;
  if (sp.stun) t += ` Оглушение ${fmt(sp.stun)} с.`;
  return t;
}

/**
 * Stage 3 windows in the layout of the owner's mockups (hud-08…13, hud-20): the character sheet
 * (C), inventory and equipment (I), weapon mastery, weapon skills, talents and magic (K), and the
 * mentor window (personal interaction, E). Each is a row of framed panels: the side list of the
 * hero windows, a list, and a detail panel of the selected entry.
 */
export class GrowthScreens {
  constructor(private s: GrowthHost) {}
  readonly inv: InvFilter = { q: '', cat: 'all', sort: 'order' };
  private invSel: string | null = null;
  private statSel: StatId = 'str';
  private masterySel: WeaponFamily = 'sword';
  private skillSel: Record<'sword' | 'bow', string> = { sword: 's1', bow: 'b1' };
  private school: 'fire' | 'ice' | 'lightning' = 'fire';
  private spellSel: string = 'f1';
  private circleSel: number | null = null;
  private tree: TreeId = 'phys';
  private talentSel: Partial<Record<TreeId, string>> = {};

  private ctx(): LearnCtx {
    const s = this.s;
    return { g: s.growth, hero: s.hero, learned: s.combat.data.learned, om: s.combat.data.om, inCombat: s.inCombat() };
  }

  /** Side list of the hero windows (mockups hud-08…13): switches between them in place. */
  private nav(cur: string): HTMLElement {
    const items: [string, string, string, () => void][] = [
      ['character', 'hero', 'Персонаж', () => this.character()],
      ['inventory', 'backpack', 'Инвентарь', () => this.inventory()],
      ['mastery', 'pickaxe', 'Мастерство', () => this.mastery()],
      ['dev-skills', 'book', 'Умения', () => this.development(this.devTab === 'bow' ? 'bow' : 'sword')],
      ['dev-talents', 'trophy', 'Таланты', () => this.development('talents')],
      ['dev-magic', 'mp', 'Магия', () => this.development('magic')],
    ];
    const winOf = (k: string) => (k.startsWith('dev-') ? 'development' : k);
    return withClass(panel(null, items.map(([key, ico, label, open]) =>
      h('button.r2-sidebtn' + (key === cur ? '.sel' : ''), {
        onclick: () => {
          if (key === cur) return;
          const from = winOf(cur);
          if (from !== winOf(key)) this.s.menus.close(from);
          open();
        },
      }, pxIcon(ico, 40), h('span', label)))), 'r2-navp');
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

  /** What the hero model wears now (for the figure picture). */
  private figureEquip(): Record<Slot, string | null> {
    const g = this.s.growth;
    const arm = (slot: 'head' | 'chest' | 'legs') => {
      const it = itemOf(g, g.equip[slot]);
      return it ? ARMOR_BY_ID[it.tpl]?.mesh ?? null : null;
    };
    return { main: this.s.combat.weapon.mesh, off: null, head: arm('head'), hands: null, body: arm('chest'), feet: arm('legs') };
  }

  // ------------------------------------------------------------------ character (C)
  character() {
    const { hero, growth: g, combat: c } = this.s;
    const p = hero.progress;
    const top = p.level >= MAX_LEVEL;
    const into = p.xp - xpForLevel(p.level);
    const need = top ? 1 : xpForLevel(p.level + 1) - xpForLevel(p.level);
    const res = (ico: string, name: string, v: number, max: number, cls: string) =>
      h('div.r2-crow', pxIcon(ico, 34), h('b', name), h('div.r2-resbar', h('small', `${Math.floor(v)} / ${max}`), bar(v / max, undefined, cls)));
    const left = panel(
      phead(this.s.name, null, `Человек · Уровень ${p.level}`),
      h('div.r2-figbox', heroFigure(this.figureEquip(), 260, 330)),
      h('div.r2-hrow.between', h('span', top ? 'XP — максимум' : `XP  ${into} / ${need}`), h('span.r2-dim', `${Math.floor((into / need) * 100)}%`)),
      bar(top ? 1 : into / need),
      res('hp', 'HP', hero.hp, hero.maxHp, 'hp'),
      res('potion-mp', 'MP', hero.mp, hero.maxMp, 'mp'),
      res('st', 'ST', hero.st, hero.maxSt, 'st'),
      bigBtn('Таблица опыта', null, () => this.xpTable(), false),
    );
    const s = this.statSel;
    const teachers = (Object.values(MENTORS).filter((m) => m.stats.includes(s)).map((m) => m.name)).join(', ');
    const statRows = STAT_IDS.map((id) => {
      const k = statCost(hero.stats[id]);
      const tr = h('tr.click' + (id === s ? '.sel' : ''), { onclick: () => { this.statSel = id; this.character(); } },
        h('td', pxIcon(id, 26), STAT_SHORT[id]), h('td', h('b', String(hero.stats[id]))), h('td', `${k.lp} LP · ${k.gold} зол.`));
      return tr;
    });
    const mid = panel(
      'Характеристики',
      h('div.r2-hrow', chip('lp', h('span', 'LP ', h('b', String(p.lp))), 'green'), chip('ot', h('span', 'ОТ ', h('b', String(p.tp))), 'purple'), chip('coins', h('b', String(g.gold)), 'gold')),
      h('table.r2-tbl', h('thead', h('tr', h('th', 'Параметр'), h('th', 'Значение'), h('th', 'Цена +1'))), h('tbody', statRows)),
      h('div.r2-box.r2-iconline', pxIcon('npc-arden', 64), h('div', h('h3.r2-h3', 'Повышение у наставника'), h('div.r2-dim', 'Обучение — лично и вне боя.'))),
      h('div.r2-box.r2-iconline', pxIcon(s, 64), h('div', h('h3.r2-h3', `${STAT_WORD[s]}  ${hero.stats[s]}`), h('div', this.statEffect(s, hero.stats[s])), h('div.r2-dim', `Наставник: ${teachers}`))),
    );
    const w = c.weapon;
    const b = c.bonus;
    const attr = hero.stats[w.attr];
    const normal = Math.round(w.damage * b.baseMul * (1 + attr / 100));
    const right = panel(
      'Итоговые показатели',
      h('div.r2-center', bigIcon(iconForKey(w.mesh) || FAMILY_ICON[c.family], 110), h('h3.r2-h3', w.name)),
      table(null, [
        ['Урон обычной атаки', h('b', String(normal))],
        ['Броня', h('b', String(totalArmor(g)))],
        ['Шанс крита (меч, лук)', h('b', `${fmt(Math.min(50, 5 + b.physCrit * 100))}%`)],
        ['Урон крита', h('b', `×${fmt(Math.min(2.5, 1.5 + b.physCritPow))}`)],
        ['Крит магии', h('b', `${fmt(Math.min(50, 5 + b.magicCrit * 100))}% · ×${fmt(Math.min(2.5, 1.5 + b.magicCritPow))}`)],
        ['Снижение блоком', h('b', `${Math.round(b.blockReduce * 100)}%`)],
      ], '.kv'),
      h('div.r2-center.r2-gold.r2-small', 'Урон до крита и защиты цели.'),
      rule(),
      h('h3.r2-h3', 'Развитие'),
      h('div', `+${LP_PER_LEVEL} LP за уровень`),
      h('div', '+1 ОТ каждые 5 уровней'),
      h('div', `Максимальный уровень: ${MAX_LEVEL}`),
      h('div.r2-dim', `Всего опыта: ${p.xp} · побеждено: ${c.data.kills}`),
      h('div.r2-gold.r2-small', 'Текущие ресурсы при повышении не восстанавливаются.'),
    );
    this.s.menus.show('character', screen('Персонаж', '236px 1fr 1.25fr 1.12fr', [this.nav('character'), left, mid, right]));
  }

  private statEffect(s: StatId, v: number): string {
    const lvl = this.s.hero.progress.level;
    if (s === 'str') return `Урон мечом: ×${fmt(1 + v / 100)}`;
    if (s === 'dex') return `Урон луком: ×${fmt(1 + v / 100)}`;
    if (s === 'int') return `Урон посохом и магией: ×${fmt(1 + v / 100)}`;
    if (s === 'vit') return `Максимальный HP: ${maxHpFor(v, lvl)} (без талантов)`;
    if (s === 'spi') return `Максимальный MP: ${maxMpFor(v)}`;
    return 'Снижает получаемый магический урон';
  }

  /** Levels 1–60 with the XP of each step (compact window). */
  private xpTable() {
    const p = this.s.hero.progress.level;
    const rows: HTMLElement[] = [];
    for (let l = 1; l <= MAX_LEVEL; l++) rows.push(h('tr' + (l === p ? '.sel' : ''), h('td', String(l)), h('td', l < MAX_LEVEL ? String(xpStep(l)) : '—'), h('td', String(xpForLevel(l))), h('td', l % 5 === 0 ? '+1 ОТ' : '')));
    this.s.menus.show('xptable', h('div', h('h1', 'Таблица опыта'), h('div.r2-xpt', h('table.r2-tbl', h('thead', h('tr', h('th', 'Уровень'), h('th', 'До следующего'), h('th', 'Всего XP'), h('th', 'Таланты'))), h('tbody', rows))),
      h('button.r2-btn.small', { onclick: () => this.s.menus.close('xptable') }, 'Закрыть')));
  }

  // ------------------------------------------------------------------ weapon mastery
  mastery() {
    const c = this.s.combat;
    const sel = this.masterySel;
    const fams: WeaponFamily[] = ['sword', 'bow', 'staff'];
    const rows = fams.map((f) => {
      const m = masteryOf(c.data.om[f]);
      const from = masteryThreshold(m);
      const to = masteryThreshold(m + 1);
      const done = m >= MASTERY.max;
      return h(
        'button.r2-mrow' + (f === sel ? '.sel' : ''),
        { onclick: () => { this.masterySel = f; this.mastery(); } },
        pxIcon(FAMILY_ICON[f], 110),
        h('div.r2-mtxt',
          h('b', FAMILY_NAME[f]),
          h('div.r2-hrow.between', h('span', `Уровень  ${m} / ${MASTERY.max}`), h('span', rankName(m))),
          h('small', done ? 'Максимум' : `${c.data.om[f] - from} / ${to - from} ОМ`),
          bar(done ? 1 : (c.data.om[f] - from) / (to - from)),
          h('small', done ? 'Достигнут предел' : `До следующего уровня: ${to - c.data.om[f]} ОМ`)),
      );
    });
    const left = panel('Три независимых направления', scroll(rows), h('div.r2-center.r2-dim', 'Растёт от применения, без LP и золота.'), bigBtn('Таблица роста', null, () => this.masteryTable(), false));
    const m = masteryOf(c.data.om[sel]);
    const lvl = this.s.hero.progress.level;
    const dummyLeft = trainingAward(c.data.om[sel]);
    const next = sel === 'staff'
      ? CIRCLES.map((r, i) => ({ r, i })).find(({ r, i }) => this.s.growth.circles <= i && r.mastery > 0)
      : null;
    const nextSkill = sel !== 'staff' ? SKILLS.filter((x) => x.family === sel).find((x) => !c.data.learned.includes(x.id)) : null;
    const opens = nextSkill
      ? h('div.r2-box.r2-iconline', bigIcon(nextSkill.id, 72), h('div', h('h3.r2-h3', nextSkill.name), h('div', `Мастерство ${nextSkill.mastery} · ${FAMILY_ATTR[sel].toUpperCase()} ${nextSkill.attr}`), h('div.r2-dim', `Изучение у ${TEACHER_GEN[sel]}: ${nextSkill.lp} LP · ${nextSkill.gold} зол.`)))
      : next
        ? h('div.r2-box.r2-iconline', bigIcon('mp', 72), h('div', h('h3.r2-h3', `${ROMAN[next.i]} круг магии`), h('div', `Мастерство посоха ${next.r.mastery} · INT ${next.r.int}`), h('div.r2-dim', `Открытие у Миры: ${next.r.lp} LP · ${next.r.gold} зол.`)))
        : h('div.r2-dim', 'Всё обучение этого направления открыто.');
    const right = panel(
      h('div.r2-phead', h('div', h('h2.r2-ph', `Мастерство ${sel === 'sword' ? 'меча' : sel === 'bow' ? 'лука' : 'посоха'}`), h('div.r2-psub', sel === 'sword' ? 'Одноручные и двуручные мечи' : sel === 'bow' ? 'Луки' : 'Посохи и заклинания')), pxIcon(FAMILY_ICON[sel], 64)),
      rule(),
      h('h3.r2-h3', 'Боевая практика'),
      table(null, [
        ['Подходящий противник:', h('b', `+${combatAwardBase(lvl, lvl)} ОМ`)],
        ['Слабее на 5–9 уровней:', h('b', `+${combatAwardBase(lvl, lvl - 5)} ОМ`)],
        ['Слабее на 10+ уровней:', h('b', `${combatAwardBase(lvl, lvl - 10)} ОМ`)],
      ], '.kv'),
      h('div.r2-dim.r2-small', `Один зачёт за применение. Нужно нанести минимум 1 урон. Лимит: ${MASTERY.perEnemyLife} ОМ с одной жизни врага на вид оружия.`),
      rule(),
      h('h3.r2-h3', 'Манекены'),
      h('div.r2-iconline', pxIcon('dummy', 72), h('div', h('div', `+${MASTERY.training} ОМ за применение — только до мастерства ${MASTERY.trainingCap}.`), h('div.r2-gold', dummyLeft > 0 ? `До учебного предела: ${masteryThreshold(MASTERY.trainingCap) - c.data.om[sel]} ОМ.` : `Для ${sel === 'sword' ? 'меча' : sel === 'bow' ? 'лука' : 'посоха'} учебный предел достигнут.`))),
      rule(),
      h('h3.r2-h3', 'Открывает обучение'),
      opens,
      h('div.r2-gold.r2-small', `Сейчас: ${m} — ${rankName(m)}. Мастерство само по себе не усиливает урон.`),
      bigBtn(sel === 'staff' ? 'К магии' : `К навыкам ${sel === 'sword' ? 'меча' : 'лука'}`, null, () => { this.s.menus.close('mastery'); this.development(sel === 'staff' ? 'magic' : sel); }, false),
    );
    this.s.menus.show('mastery', screen('Мастерство оружия', '236px 1.05fr 1fr', [this.nav('mastery'), left, right]));
  }

  private masteryTable() {
    const rows: HTMLElement[] = [];
    for (const m of [1, 5, 10, 20, 25, 30, 40, 45, 50, 60, 70, 75, 80, 90, 100]) rows.push(h('tr', h('td', String(m)), h('td', rankName(m)), h('td', String(masteryThreshold(m)))));
    this.s.menus.show('xptable', h('div', h('h1', 'Таблица роста'), h('div.r2-xpt', h('table.r2-tbl', h('thead', h('tr', h('th', 'Мастерство'), h('th', 'Звание'), h('th', 'Всего ОМ'))), h('tbody', rows))),
      h('p.r2-note', 'Шаг M → M+1 стоит 20 + 5 × M ОМ.'), h('button.r2-btn.small', { onclick: () => this.s.menus.close('xptable') }, 'Закрыть')));
  }

  // ------------------------------------------------------------------ development (K): skills, talents, magic
  private devTab: 'sword' | 'bow' | 'magic' | 'talents' = 'sword';

  development(tab = this.devTab) {
    this.devTab = tab;
    const c = this.ctx();
    if (tab === 'talents') {
      const [l, r] = this.talentPanels(c);
      this.s.menus.show('development', screen('Таланты', '236px 1.05fr 1fr', [this.nav('dev-talents'), l, r]));
    } else if (tab === 'magic') {
      const [l, r] = this.magicPanels(c, null);
      this.s.menus.show('development', screen('Магия', '236px 1.05fr 1fr', [this.nav('dev-magic'), l, r]));
    } else {
      const [l, r] = this.skillPanels(c, tab, null);
      this.s.menus.show('development', screen('Оружейные умения', '236px 1.05fr 1fr', [this.nav('dev-skills'), l, r]));
    }
  }

  /** The 1–6 panel of a weapon family; with a selected learned ability a click puts it in a slot. */
  private panelSlots(fam: WeaponFamily, selId: string | null, again: () => void): HTMLElement {
    const d = this.s.combat.data;
    const put = (i: number) => {
      if (!selId || !d.learned.includes(selId)) return;
      const p = d.panels[fam];
      if (p[i] === selId) p[i] = null;
      else {
        const k = p.indexOf(selId);
        if (k >= 0) p[k] = null;
        p[i] = selId;
      }
      again();
    };
    return h('div.r2-slots6', d.panels[fam].map((id, i) => {
      const t = id ? tile({ icon: id, sel: id === selId, tip: 'Щелчок — поставить выбранное умение сюда или убрать', onclick: () => put(i) }) : h('button.r2-tile', { onclick: () => put(i), title: 'Поставить выбранное умение сюда' }, h('span.r2-dash', '—'));
      t.prepend(h('span.r2-sn', String(i + 1)));
      return t;
    }));
  }
  /** «Изменить слот»: moves the ability to the next panel slot (first free, then around). */
  private cycleSlot(fam: WeaponFamily, id: string, again: () => void) {
    const p = this.s.combat.data.panels[fam];
    const k = p.indexOf(id);
    if (k >= 0) p[k] = null;
    let n = k < 0 ? p.indexOf(null) : (k + 1) % 6;
    if (n < 0) n = 0;
    p[n] = id;
    this.s.toast(`Слот ${n + 1}`);
    again();
  }

  /** Paid tiers, choices (personal screen) or purchase (mentor) of one ability (mockups hud-11, hud-13). */
  private modsBox(c: LearnCtx, id: string, mentor: MentorId | null, again: () => void): HTMLElement[] {
    const st = modState(c.g, id);
    const names = SKILLS.some((x) => x.id === id) ? SKILL_MODS : SPELL_MODS;
    const out: HTMLElement[] = [];
    for (let t = 1; t <= 3; t++) {
      const tier = MOD_TIERS[t - 1];
      const paid = st.paid >= t;
      const chosen = st.chosen[t - 1];
      const head = h('div.r2-hrow.between', h('b.r2-modh', paid ? '' : pxIcon('lock', 20), `${ROMAN[t - 1]} · Мастерство ${tier.mastery}`), paid ? tag('Оплачено', undefined, 'green') : h('span.r2-gold', `${tier.lp} LP · ${tier.gold} зол.`));
      const prob = paid && chosen === null && !mentor ? chooseModProblem(c.g, id, t, c.inCombat) : 'x';
      const opts = h('div.r2-modc', ([0, 1] as const).map((v) => h('button.r2-modopt' + (chosen === v ? '.sel' : '') + (prob ? '.off' : ''), {
        onclick: () => {
          if (prob) return;
          this.s.menus.confirm(`Закрепить «${names[t - 1][v].name}»? Смена — только платным сбросом у наставника.`, () => this.act(chooseMod(c.g, id, t, v, this.s.inCombat()), 'Модификация выбрана', again));
        },
        title: prob && prob !== 'x' ? prob : undefined,
      }, h('b', names[t - 1][v].name), names[t - 1][v].text)));
      const box = h('div.r2-box', head, opts);
      if (paid && chosen !== null) box.append(h('div.r2-gold.r2-small', `Выбрано: ${names[t - 1][chosen].name}. Смена — через сброс у наставника.`));
      else if (paid && mentor) box.append(h('div.r2-dim.r2-small', 'Оплачено — выбор в личном экране (K).'));
      else if (paid) box.append(h('div.r2-green.r2-small', 'Выберите один вариант (A или Б).'));
      if (!paid && mentor) box.append(this.btn('Оплатить ступень', modTierProblem(c, mentor, id, t), () => this.act(buyModTier(this.ctx(), mentor, id, t), `Ступень ${ROMAN[t - 1]} оплачена`, again), true));
      out.push(box);
    }
    if (mentor && st.chosen.some((x) => x !== null)) {
      const cost = modResetCost(this.s.hero.progress.level);
      out.push(this.btn(`Сбросить выбор (${cost} зол.)`, null, () => this.s.menus.confirm(`Сбросить выбранные модификации за ${cost} зол.? Оплаченные ступени сохранятся, LP не возвращаются.`, () => this.act(resetMods(this.ctx(), mentor, id), 'Выбор модификаций сброшен', again))));
    }
    return out;
  }

  /** Weapon skills of a family: list with the panel, and the selected skill (hud-11). */
  skillPanels(c: LearnCtx, fam: 'sword' | 'bow', mentor: MentorId | null, onlyLearned = false): [HTMLElement, HTMLElement] {
    const again = () => (mentor ? this.mentor(mentor) : this.development(fam));
    const m = masteryOf(c.om[fam]);
    const attr: StatId = fam === 'sword' ? 'str' : 'dex';
    const hero = this.s.hero;
    const d = this.s.combat.data;
    const list = SKILLS.filter((x) => x.family === fam && (!onlyLearned || c.learned.includes(x.id)));
    if (!list.some((x) => x.id === this.skillSel[fam]) && list[0]) this.skillSel[fam] = list[0].id;
    const selId = this.skillSel[fam];
    const rows = list.map((sk) => {
      const learned = c.learned.includes(sk.id);
      const slot = d.panels[fam].indexOf(sk.id);
      const ok = hero.stats[attr] >= sk.attr && m >= sk.mastery;
      return row({
        icon: sk.id,
        title: sk.name,
        sub: learned ? `Изучено${slot >= 0 ? ` · Слот ${slot + 1}` : ''}` : `${ok ? 'Не изучено · ' : ''}${attr.toUpperCase()} ${sk.attr} · Мастерство ${sk.mastery}`,
        sel: sk.id === selId,
        locked: !learned && !ok,
        onclick: () => { this.skillSel[fam] = sk.id; again(); },
      });
    });
    const left = panel(
      null,
      mentor ? null : tabs([['sword', 'Меч'], ['bow', 'Лук']] as const, fam, (t) => this.development(t)),
      h('div.r2-hrow.between', h('b.r2-line', `${attr.toUpperCase()} ${hero.stats[attr]} · Мастерство ${fam === 'sword' ? 'меча' : 'лука'} ${m}`), h('div.r2-hrow', chip('lp', `LP ${hero.progress.lp}`, 'blue'), chip('coins', String(c.g.gold), 'gold'))),
      scroll(rows.length ? rows : h('p.r2-note', 'Нет изученных навыков.')),
      h('div.r2-hrow.between', h('h3.r2-h3', `Панель ${fam === 'sword' ? 'меча' : 'лука'}`), h('span.r2-gold.r2-small', 'Один навык — один слот')),
      this.panelSlots(fam, selId, again),
    );
    const sk = SKILLS.find((x) => x.id === selId);
    if (!sk) return [left, panel('Навык', h('p.r2-note', 'Выберите навык.'))];
    const learned = c.learned.includes(sk.id);
    const mods = abilityMods(c.g, sk.id);
    const right = panel(
      h('div.r2-phead', h('h2.r2-ph', sk.name), learned ? tag('Изучено', undefined, 'green') : null),
      h('div.r2-iconline.top', bigIcon(sk.id, 120),
        h('div.r2-grow',
          h('div', skillText(sk)),
          h('div.r2-dmg', 'Урон: ', h('b', `${Math.round(sk.coef * mods.dmg * 100)}%`), ' оружия'),
          mods.dmg !== 1 ? h('div.r2-dim', `База ${Math.round(sk.coef * 100)}% × модификации ${fmt(mods.dmg)}`) : null,
          h('div.r2-hrow', chip('sword', `${Math.round(sk.st * mods.cost)} ST`, 'small'), chip('clock', `Откат ${fmt(sk.cd * mods.cd)} с`, 'small'), sk.prep ? chip('hourglass', `Подготовка ${fmt(sk.prep)} с`, 'small') : null))),
      h('div.r2-hrow', h('span.r2-gold', 'Требования:'), req(hero.stats[attr] >= sk.attr, `${attr.toUpperCase()} ${sk.attr}`), req(m >= sk.mastery, `Мастерство ${sk.mastery}`)),
      h('div.r2-hrow', h('span.r2-gold', 'Базовое изучение:'), h('span', `${sk.lp} LP · ${sk.gold} зол. · ${TEACHER[fam]}`)),
      rule(),
      learned
        ? [h('h3.r2-h3', 'Модификации'), ...this.modsBox(c, sk.id, mentor, again)]
        : mentor
          ? bigBtn(`Изучить за ${sk.lp} LP и ${sk.gold} зол.`, skillProblem(c, mentor, sk.id), () => this.act(learnSkill(this.ctx(), mentor, sk.id), `Изучено: ${sk.name}`, again))
          : note(`Обучение — лично у наставника вне боя (${TEACHER[fam]}).`),
      h('div.r2-center.r2-gold.r2-small', 'Обучение и сброс — лично у наставника вне боя.'),
      learned && !mentor ? bigBtn('Изменить слот', null, () => this.cycleSlot(fam, sk.id, again), false) : null,
    );
    return [left, right];
  }

  /** Circles, spells of a school with the staff panel, and the selected spell or circle (hud-13). */
  magicPanels(c: LearnCtx, mentor: MentorId | null, onlyLearned = false): [HTMLElement, HTMLElement] {
    const again = () => (mentor ? this.mentor(mentor) : this.development('magic'));
    const m = masteryOf(c.om.staff);
    const hero = this.s.hero;
    const d = this.s.combat.data;
    const school = this.school;
    const circles = h('div.r2-circles', CIRCLES.map((_, i) => h('button.r2-circle' + (c.g.circles > i ? '.open' : '') + (this.circleSel === i ? '.sel' : ''), { onclick: () => { this.circleSel = i; again(); } },
      h('span', ROMAN[i]), c.g.circles > i ? null : pxIcon('lock', 16))));
    const list = SPELLS.filter((x) => x.school === school && (!onlyLearned || c.learned.includes(x.id)));
    if (!list.some((x) => x.id === this.spellSel) && list[0]) this.spellSel = list[0].id;
    const rows = list.map((sp) => {
      const learned = c.learned.includes(sp.id);
      const slot = d.panels.staff.indexOf(sp.id);
      const ok = c.g.circles >= sp.tier;
      return row({
        icon: sp.id,
        title: sp.name,
        sub: learned ? h('span', `${ROMAN[sp.tier - 1]} круг · `, h('span.r2-green', 'Изучено'), slot >= 0 ? ` · Слот ${slot + 1}` : '') : `${ROMAN[sp.tier - 1]} круг · INT ${CIRCLES[sp.tier - 1].int} · Мастерство ${CIRCLES[sp.tier - 1].mastery}`,
        sel: this.circleSel === null && sp.id === this.spellSel,
        locked: !learned && !ok,
        onclick: () => { this.spellSel = sp.id; this.circleSel = null; again(); },
      });
    });
    const left = panel(
      null,
      tabs([['fire', 'Огонь'], ['ice', 'Вода / Лёд'], ['lightning', 'Молния']] as const, school, (t) => { this.school = t; this.circleSel = null; again(); }),
      h('div.r2-hrow.between', h('b.r2-line', 'INT ', h('span.r2-gold', String(hero.stats.int)), ' · Мастерство посоха ', h('span.r2-gold', String(m))), h('div.r2-hrow', chip('lp', `LP ${hero.progress.lp}`, 'purple'), chip('coins', String(c.g.gold), 'gold'))),
      h('h3.r2-h3.gold', 'Общие круги'),
      circles,
      h('div.r2-center.r2-dim', c.g.circles ? `Круг ${ROMAN[c.g.circles - 1]} открыт · общий для трёх школ` : 'Круги не открыты · обучение у Миры'),
      scroll(rows.length ? rows : h('p.r2-note', 'Нет изученных заклинаний.')),
      h('h3.r2-h3.gold', 'Панель посоха'),
      this.panelSlots('staff', this.circleSel === null ? this.spellSel : null, again),
      h('div.r2-center.r2-dim.r2-small', 'Для применения нужен посох.'),
    );
    let right: HTMLElement;
    if (this.circleSel !== null) {
      const i = this.circleSel;
      const r = CIRCLES[i];
      const open = c.g.circles > i;
      right = panel(
        h('div.r2-phead', h('h2.r2-ph', `${ROMAN[i]} круг магии`), open ? tag('Открыт', undefined, 'green') : null),
        h('div.r2-iconline.top', bigIcon('mp', 110), h('div', h('div', 'Общий для трёх школ: открывает заклинания своей ступени в огне, воде и молнии.'), h('div.r2-dim', `Заклинания: ${SPELLS.filter((x) => x.tier === i + 1).map((x) => x.name).join(', ')}`))),
        h('div.r2-hrow', h('span.r2-gold', 'Требования:'), req(hero.stats.int >= r.int, `INT ${r.int}`), req(m >= r.mastery, `Мастерство ${r.mastery}`), i > 0 ? req(c.g.circles >= i, `${ROMAN[i - 1]} круг`) : null),
        h('div.r2-hrow', h('span.r2-gold', 'Открытие у Миры:'), h('b', `${r.lp} LP · ${r.gold} зол.`)),
        rule(),
        !open && mentor ? bigBtn(`Открыть ${ROMAN[i]} круг`, circleProblem(c, mentor, i + 1), () => this.act(openCircle(this.ctx(), mentor, i + 1), `Открыт ${ROMAN[i]} круг`, again)) : null,
        note('Круги открываются по порядку, лично у Миры вне боя.'),
      );
    } else {
      const sp = SPELLS.find((x) => x.id === this.spellSel)!;
      const learned = c.learned.includes(sp.id);
      const mods = abilityMods(c.g, sp.id);
      const cr = CIRCLES[sp.tier - 1];
      right = panel(
        h('div.r2-phead', h('h2.r2-ph', sp.name), learned ? tag('Изучено', undefined, 'green') : null),
        h('div.r2-iconline.top', bigIcon(sp.id, 120),
          h('div.r2-grow',
            h('div.r2-dim', `${SCHOOL_NAME[sp.school]} · ${ROMAN[sp.tier - 1]} круг`),
            h('div', spellText(sp)),
            h('div.r2-hrow', chip('potion-mp', `${Math.round(sp.mp * mods.cost)} MP`, 'small blue'), chip('clock', `Откат ${fmt(sp.cd * mods.cd)} с`, 'small'), chip('hourglass', `Подготовка ${fmt(sp.cast)} с`, 'small')),
            h('div', 'Базовый урон: ', h('b.r2-gold', sp.hits.map((x) => Math.round(x * mods.dmg)).join(' + '))),
            h('div', `Дальность: ${sp.range} м`))),
        h('div.r2-hrow', h('span.r2-gold', 'Требования:'), req(c.g.circles >= sp.tier, `Круг ${ROMAN[sp.tier - 1]}`), req(hero.stats.int >= cr.int, `INT ${cr.int}`), req(m >= cr.mastery, `Мастерство ${cr.mastery}`)),
        h('div.r2-hrow', h('span.r2-gold', 'Изучение у Миры:'), h('b', `${sp.lp} LP · ${sp.gold} зол.`)),
        rule(),
        learned
          ? [h('h3.r2-h3.gold', 'Модификации'), ...this.modsBox(c, sp.id, mentor, again)]
          : mentor
            ? bigBtn(`Изучить за ${sp.lp} LP и ${sp.gold} зол.`, spellProblem(c, mentor, sp.id), () => this.act(learnSpell(this.ctx(), mentor, sp.id), `Изучено: ${sp.name}`, again))
            : note('Обучение — лично у Миры вне боя.'),
        h('div.r2-hrow.between', h('span.r2-dim.r2-small', 'Обучение и сброс — у Миры вне боя.'), learned && !mentor ? h('button.r2-big.small.r2-fit', { onclick: () => this.cycleSlot('staff', sp.id, again) }, 'Изменить слот') : null),
      );
    }
    return [left, right];
  }

  /** Talent trees: two branches of the chosen tree and the selected talent (hud-12). */
  talentPanels(c: LearnCtx): [HTMLElement, HTMLElement] {
    const p = this.s.hero.progress;
    const tree = this.tree;
    const again = () => this.development('talents');
    const spent = (t: TreeId) => c.g.talents.filter((id) => TALENTS.find((x) => x.id === id)?.tree === t).length;
    const total = (t: TreeId) => TALENTS.filter((x) => x.tree === t).length;
    const inTree = TALENTS.filter((x) => x.tree === tree);
    const selId = this.talentSel[tree] ?? inTree[0].id;
    const branches = [...new Set(inTree.map((t) => t.branch))];
    const cols = branches.map((br) =>
      h('div.r2-tcol', h('h3', br), inTree.filter((x) => x.branch === br).map((t) => {
        const has = c.g.talents.includes(t.id);
        const prob = has ? null : talentProblem(t.id, c.g.talents, p.level, p.tp, c.inCombat);
        return h('button.r2-tnode' + (has ? '.on' : prob ? '.off' : '') + (t.id === selId ? '.sel' : ''), { onclick: () => { this.talentSel[tree] = t.id; again(); } },
          h('span.r2-tic', pxIcon(TALENT_ICON[t.id] ?? 'star', 56), !has && prob ? pxIcon('lock', 18, 'r2-tlock') : null),
          h('span', h('b', t.name), h('small', t.effect), has ? h('span.r2-rq.ok', pxIcon('check', 16), 'Изучено') : h('span.r2-tcost', chip('ot', '1 ОТ', 'small purple'))));
      })),
    );
    const t3 = TIER_REQ[3];
    const left = panel(
      null,
      tabs([['phys', 'Физическое'], ['magic', 'Магическое'], ['surv', 'Выживание']] as const, tree, (t) => { this.tree = t; again(); }),
      h('div.r2-hrow.between', h('h2.r2-ph', `Уровень ${p.level}`), chip('ot', h('span', 'Свободно: ', h('b', `${p.tp} ОТ`)), 'purple')),
      h('div.r2-center.r2-dim', (['phys', 'magic', 'surv'] as TreeId[]).map((t) => `${TREE_NAME[t]}: ${spent(t)}/${total(t)}`).join(' · ')),
      scroll(h('div.r2-ttree', cols)),
      h('div.r2-center.r2-dim.r2-small', `II ступень: уровень ${TIER_REQ[2].level} · вложено ${TIER_REQ[2].spent} ОТ · III ступень: уровень ${t3.level} · вложено ${t3.spent} ОТ`),
      h('div.r2-center.r2-dim.r2-small', 'Каждый талант стоит 1 ОТ. Требования считаются внутри дерева.'),
    );
    const t = TALENTS.find((x) => x.id === selId) as TalentDef;
    const has = c.g.talents.includes(t.id);
    const prob = has ? null : talentProblem(t.id, c.g.talents, p.level, p.tp, c.inCombat);
    const prev = TALENTS.find((x) => x.tree === t.tree && x.branch === t.branch && x.tier === t.tier - 1);
    const need = TIER_REQ[t.tier];
    const cost = talentResetCost(p.level);
    const right = panel(
      h('h2.r2-ph', t.name),
      h('div.r2-iconline.top', bigIcon(TALENT_ICON[t.id] ?? 'star', 130), h('div', h('div.r2-dim', `${TREE_NAME[t.tree]} · ${t.branch} · ${ROMAN[t.tier - 1]} ступень`), h('div.r2-teff', t.effect), has ? h('div.r2-green', 'Изучено') : null)),
      rule(),
      h('div.r2-phead', h('h3.r2-h3', 'Требования'), tag(c.inCombat ? 'В бою' : 'Вне боя', undefined, c.inCombat ? '' : 'green')),
      req(p.level >= need.level, `Уровень ${Math.min(p.level, need.level)} / ${need.level}`),
      req(spent(t.tree) >= need.spent, `Вложено в дерево: ${Math.min(spent(t.tree), need.spent)} / ${need.spent} ОТ`),
      prev ? req(c.g.talents.includes(prev.id), `${prev.name} изучен${prev.name.endsWith('а') ? 'а' : ''}`) : null,
      rule(),
      has ? h('div.r2-center.r2-green', 'Талант изучен.') : bigBtn('Изучить за 1 ОТ', prob, () => this.s.menus.confirm(`Изучить «${t.name}» за 1 ОТ? Отменить можно только полным платным сбросом у наставника.`, () => this.act(learnTalent(this.ctx(), t.id), `Талант изучен: ${t.name}`, again))),
      prob ? h('div.r2-center.r2-red.r2-small', prob) : h('div.r2-center.r2-dim', 'Без LP и платы золотом.'),
      h('div.r2-box.r2-iconline', pxIcon('coins', 72), h('div', h('h3.r2-h3', 'Сброс у наставника'), h('div', 'Все таланты: ', h('b', `${cost} зол.`)), h('div.r2-dim', 'Потраченные ОТ возвращаются.'))),
    );
    return [left, right];
  }

  // ------------------------------------------------------------------ mentor (E)
  private mentorTab: 'stats' | 'learn' | 'mods' | 'reset' = 'stats';

  mentor(id: MentorId, tab = this.mentorTab) {
    this.mentorTab = tab;
    const md = MENTORS[id];
    const c = this.ctx();
    const hero = this.s.hero;
    const again = () => this.mentor(id);
    const learnName = md.teaches === 'magic' ? 'Круги и заклинания' : md.teaches === 'sword' ? 'Навыки меча' : 'Навыки лука';
    const greet: Record<MentorId, string> = {
      arden: '«Оружие выбирает рука, а путь выбираешь ты. С чего начнём?»',
      hira: '«Лук не прощает спешки. Покажи, чему ты научился.»',
      mira: '«Сила плетения — в терпении. Чему хочешь научиться?»',
    };
    const teachesLine = md.teaches === 'magic' ? 'Круги и заклинания, модификации' : `Навыки ${md.teaches === 'sword' ? 'меча' : 'лука'} и модификации`;
    const left = panel(
      phead(md.name, null, `Наставник · ${md.place}`),
      h('div.r2-mentorpic', pxIcon(id === 'mira' ? 'npc-mira' : 'npc-' + id, 200), tag(c.inCombat ? 'В бою' : 'Вне боя', undefined, c.inCombat ? '' : 'green')),
      h('div.r2-say2', greet[id]),
      rule(),
      h('h3.r2-h3', 'Обучает'),
      h('div.r2-iconline', pxIcon(md.stats[0], 30), md.stats.map((s) => s.toUpperCase()).join(' · ')),
      h('div.r2-iconline', pxIcon(md.teaches === 'magic' ? 'staff' : md.teaches, 30), teachesLine),
      h('div.r2-iconline', pxIcon('refresh', 30), 'Сброс талантов'),
      note('Требуется личное взаимодействие.'),
      this.s.trainXp ? h('div.r2-box', h('h3.r2-h3', 'Тренировка (тестовая площадка)'),
        h('div.r2-dim.r2-small', `Уровень ${hero.progress.level} · XP ${hero.progress.xp}`),
        h('div.r2-hrow',
          this.btn('+1 уровень', null, () => { this.s.trainXp!({ levels: 1 }); again(); }, true),
          this.btn('+1000 XP', null, () => { this.s.trainXp!({ xp: 1000 }); again(); }),
          this.btn('+10 000 XP', null, () => { this.s.trainXp!({ xp: 10000 }); again(); }))) : null,
    );
    let mid: HTMLElement;
    let right: HTMLElement;
    if (tab === 'stats') {
      if (!md.stats.includes(this.statSel)) this.statSel = md.stats[0];
      const s = this.statSel;
      mid = panel(
        'Характеристики',
        h('div.r2-hrow', chip('lp', h('span', 'Доступно: ', h('b.r2-gold', `${hero.progress.lp} LP`)), 'purple'), chip('coins', h('b', `${c.g.gold} зол.`), 'gold')),
        h('table.r2-tbl', h('thead', h('tr', h('th', 'Параметр'), h('th', 'Сейчас'), h('th', 'Цена +1'))), h('tbody', md.stats.map((st) => {
          const k = statCost(hero.stats[st]);
          return h('tr.click' + (st === s ? '.sel' : ''), { onclick: () => { this.statSel = st; again(); } }, h('td', pxIcon(st, 26), STAT_SHORT[st]), h('td', h('b', String(hero.stats[st]))), h('td', `${k.lp} LP · ${k.gold} зол.`));
        }))),
        h('div.r2-box.r2-iconline.top', pxIcon('info', 30), h('div', h('h3.r2-h3', 'По одному пункту'), h('div.r2-dim', 'Каждое обучение повышает характеристику на 1. Цена следующего пункта пересчитывается.'))),
        h('div.r2-box', note('Потраченные LP не возвращаются.')),
      );
      const v = hero.stats[s];
      const k = statCost(v);
      const prob = statProblem(c, id, s);
      const fam = s === 'str' ? 'меча' : s === 'dex' ? 'лука' : s === 'int' ? 'посоха и магии' : '';
      right = panel(
        `Повышение ${STAT_GEN[s]}`,
        h('div.r2-iconline', bigIcon(s, 110), h('div', h('div.r2-h3', s.toUpperCase()), h('div.r2-big-num', `${v} `, h('span.r2-gold', '→'), h('span.r2-green', ` ${v + 1}`)))),
        h('div.r2-box.r2-kvline', h('span', fam ? `Множитель урона ${fam}` : this.statEffect(s, v)), fam ? h('b', `×${fmt(1 + v / 100)} → `, h('span.r2-green', `×${fmt(1 + (v + 1) / 100)}`)) : h('b.r2-green', this.statEffect(s, v + 1).replace(/^[^:]*: ?/, '→ '))),
        rule(),
        h('h3.r2-h3', 'Стоимость'),
        h('div.r2-hrow', chip('lp', `${k.lp} LP`, 'purple'), chip('coins', `${k.gold} зол.`, 'gold')),
        h('div.r2-hrow', req(hero.progress.lp >= k.lp, hero.progress.lp >= k.lp ? 'LP хватает' : 'LP не хватает'), req(c.g.gold >= k.gold, c.g.gold >= k.gold ? 'Золота хватает' : 'Золота не хватает')),
        rule(),
        h('h3.r2-h3', 'После обучения ', h('small.r2-dim', '(предпросмотр)')),
        table(null, [['Останется LP', h('b', String(Math.max(0, hero.progress.lp - k.lp)))], ['Останется золота', h('b', String(Math.max(0, c.g.gold - k.gold)))]], '.kv'),
        bigBtn(`Повысить ${s.toUpperCase()} на 1`, prob, () => this.act(trainStat(this.ctx(), id, s), `${STAT_NAMES[s]}: ${hero.stats[s] + 1}`, again)),
        prob ? h('div.r2-center.r2-red.r2-small', prob) : note(`Обучение вне боя у ${md.name === 'Мира' ? 'Миры' : md.name === 'Хира' ? 'Хиры' : 'Ардена'}.`),
      );
    } else if (tab === 'learn' || tab === 'mods') {
      [mid, right] = md.teaches === 'magic' ? this.magicPanels(c, id, tab === 'mods') : this.skillPanels(c, md.teaches, id, tab === 'mods');
    } else {
      const cost = talentResetCost(hero.progress.level);
      mid = panel(
        'Сброс талантов',
        h('div.r2-box.r2-iconline', pxIcon('trophy', 64), h('div', h('h3.r2-h3', `Изучено талантов: ${c.g.talents.length}`), h('div.r2-dim', `Свободно ОТ: ${hero.progress.tp}`))),
        h('div', 'Полный сброс всех трёх деревьев возвращает все ОТ; LP не возвращаются.'),
        table(null, [['Цена сброса', h('b', `${cost} зол.`)], ['Формула', '100 + 25 × уровень'], ['Ваше золото', h('b', String(c.g.gold))]], '.kv'),
        bigBtn(`Сбросить все таланты (${cost} зол.)`, c.g.talents.length ? null : 'Таланты не изучены', () => this.s.menus.confirm(`Сбросить все таланты за ${cost} зол.?`, () => this.act(resetTalents(this.ctx()), 'Таланты сброшены', again))),
      );
      right = panel(
        'Сброс модификаций',
        h('div', 'Выбранные модификации умения сбрасываются по одному умению: оплаченные ступени сохраняются, выбор можно сделать заново.'),
        table(null, [['Цена сброса', h('b', `${modResetCost(hero.progress.level)} зол.`)]], '.kv'),
        note(`Откройте вкладку «Модификации» и выберите умение.`),
      );
    }
    const top = tabs([['stats', 'Характеристики'], ['learn', learnName], ['mods', 'Модификации'], ['reset', 'Сброс']] as const, tab, (t) => this.mentor(id, t));
    const body = screen('Обучение у наставника', '1fr 1.05fr 1fr', [left, mid, right], top, '.r2-wide');
    if (c.inCombat) body.append(h('p.r2-req.no', 'В бою обучение недоступно.'));
    this.s.menus.show('mentor', body);
  }

  // ------------------------------------------------------------------ inventory (I)
  inventory() {
    const g = this.s.growth;
    const c = this.s.combat;
    const hero = this.s.hero;
    const again = () => this.inventory();
    const f = this.inv;
    const ql = f.q.trim().toLowerCase();
    const okName = (n: string) => !ql || n.toLowerCase().includes(ql);
    const rk = (i: Item) => RARITIES.indexOf(i.rarity);
    // gear in the bag, tools and runes, then stacks
    let items = g.items.filter((i) => !isEquipped(g, i.uid) && (f.cat === 'all' || f.cat === itemCat(i)) && okName(itemName(i)));
    if (f.sort === 'name') items.sort((a, b) => itemName(a).localeCompare(itemName(b), 'ru'));
    else if (f.sort === 'price') items.sort((a, b) => (this.s.itemPrice?.(b) ?? 0) - (this.s.itemPrice?.(a) ?? 0));
    else if (f.sort === 'rarity') items.sort((a, b) => rk(b) - rk(a));
    else items = [...items.filter((i) => isGear(i.tpl)), ...items.filter((i) => !isGear(i.tpl))];
    let keys = Object.keys(g.stacks).filter((k) => g.stacks[k] > 0 && (f.cat === 'all' || f.cat === stackCat(k)) && okName(stackName(k)));
    if (f.sort === 'name') keys.sort((a, b) => stackName(a).localeCompare(stackName(b), 'ru'));
    else if (f.sort === 'price') keys.sort((a, b) => stackBuyPrice(b) - stackBuyPrice(a));
    const all = [...items.map((i) => 'u:' + i.uid), ...keys.map((k) => 's:' + k)];
    const worn = (['weapon', 'head', 'chest', 'legs'] as EquipSlot[]).map((s) => g.equip[s]).filter((x): x is string => !!x).map((u) => 'u:' + u);
    if (!this.invSel || (!all.includes(this.invSel) && !worn.includes(this.invSel) && !(this.invSel.startsWith('u:') && itemOf(g, this.invSel.slice(2))))) this.invSel = all[0] ?? worn[0] ?? null;
    const sel = this.invSel;
    const pick = (k: string) => { this.invSel = k; again(); };
    const grid = [
      ...items.map((it) => tile({ icon: iconForKey(it.tpl), sel: sel === 'u:' + it.uid, color: isGear(it.tpl) ? RARITY[it.rarity].color : undefined, star: it.fav, tip: itemName(it), onclick: () => pick('u:' + it.uid) })),
      ...keys.map((k) => tile({ icon: iconForKey(k), count: g.stacks[k], sel: sel === 's:' + k, tip: stackName(k), onclick: () => pick('s:' + k) })),
    ];
    // equipment panel: hero figure, four slots, quick weapons
    const slot = (s: EquipSlot) => {
      const it = itemOf(g, g.equip[s]);
      return h('button.r2-eslot2' + (it && sel === 'u:' + it.uid ? '.sel' : ''), { onclick: () => it && pick('u:' + it.uid), title: it ? itemName(it) : 'пусто' },
        pxIcon(it ? iconForKey(it.tpl) : s === 'weapon' ? 'sword' : s === 'chest' ? 'chest' : s, 46, it ? '' : 'r2-ghost'), h('small', SLOT_NAME[s]));
    };
    const quick = h('div.r2-quick', c.data.quick.map((u, i) => {
      const it = u ? itemOf(g, u) : undefined;
      const t = it ? tile({ icon: iconForKey(it.tpl), sel: i === c.data.cur, tip: itemName(it), onclick: () => pick('u:' + it.uid) }) : h('div.r2-tile.empty', h('span.r2-dash', '—'));
      return h('div', h('span.r2-qn', String(i + 1)), t);
    }));
    const equipP = panel(
      phead('Экипировка', null, `${this.s.name} · Уровень ${hero.progress.level}`),
      h('div.r2-equipwrap', heroFigure(this.figureEquip(), 270, 380), h('div.r2-eslots', (['head', 'chest', 'legs', 'weapon'] as EquipSlot[]).map(slot))),
      h('div.r2-box', h('h3.r2-h3', 'Быстрое оружие'), quick, h('div.r2-center.r2-dim.r2-small', 'Tab — переключить')),
    );
    const itemsP = panel(
      h('div.r2-hrow.between', h('div.r2-gold-big', pxIcon('coin', 40), String(g.gold)), h('span.r2-dim', `Броня: ${totalArmor(g)}`)),
      filterBar(f, again),
      scroll(grid.length ? tiles(grid, 5, 25) : h('p.r2-note', ql ? 'Ничего не найдено.' : 'Пусто.')),
      h('div.r2-center.r2-dim.r2-small', 'Вес и число предметов не ограничены.'),
    );
    this.s.menus.show('inventory', screen('Инвентарь', '236px 1fr 1.08fr 1.08fr', [this.nav('inventory'), equipP, itemsP, this.invDetail(sel, again)]));
  }

  /** Detail panel of the selected inventory entry (hud-08): big icon, comparison and actions. */
  private invDetail(sel: string | null, again: () => void): HTMLElement {
    const g = this.s.growth;
    const c = this.s.combat;
    if (!sel) return panel('Предмет', h('p.r2-note', 'Пусто.'));
    if (sel.startsWith('s:')) {
      const k = sel.slice(2);
      return panel(
        h('h2.r2-ph', stackName(k)),
        h('div.r2-hrow', tag(({ material: 'Материал', consumable: 'Расходник', tool: 'Инструмент', rune: 'Руна', gear: 'Экипировка' } as const)[stackCat(k)])),
        h('div.r2-center', bigIcon(iconForKey(k), 150)),
        table(null, [['В инвентаре', h('b', String(g.stacks[k] ?? 0))]], '.kv'),
        this.s.goodsDetail?.({ key: k }, again) ?? [],
      );
    }
    const it = itemOf(g, sel.slice(2));
    if (!it) return panel('Предмет', h('p.r2-note', 'Пусто.'));
    const r = RARITY[it.rarity];
    const head = h('div.r2-detail-head', h('h2.r2-ph', { style: isGear(it.tpl) && it.rarity !== 'common' ? `color:${r.color}` : undefined }, itemName(it)), h('button.r2-favbtn' + (it.fav ? '.on' : ''), { title: it.fav ? 'Снять отметку «Избранное»' : 'Избранное: защищает от продажи', onclick: () => { it.fav = !it.fav; again(); } }, it.fav ? '★' : '☆'));
    if (!isGear(it.tpl)) {
      return panel(head, h('div.r2-hrow', tag(isRune(it.tpl) ? 'Руна' : 'Инструмент')), h('div.r2-center', bigIcon(iconForKey(it.tpl), 150)), this.s.goodsDetail?.({ uid: it.uid }, again) ?? []);
    }
    const wearing = isEquipped(g, it.uid);
    const slotName = itemSlot(it);
    const cur = itemOf(g, g.equip[slotName]);
    const w = WEAPON_BY_ID[it.tpl];
    const a = ARMOR_BY_ID[it.tpl];
    const prob = reqProblem(it, this.s.hero.stats);
    const dmg = (x: Item) => {
      const wd = WEAPON_BY_ID[x.tpl];
      return wd ? Math.round(wd.damage * (x.upgrade ? UPGRADE[x.upgrade].mul : 1) * 100) / 100 : 0;
    };
    const reqOf = (x: Item) => {
      const wd = WEAPON_BY_ID[x.tpl];
      const ad = ARMOR_BY_ID[x.tpl];
      return Object.entries(wd ? { [wd.attr]: wd.req } : ad?.req ?? {}).map(([k2, v]) => `${v}`).join(', ');
    };
    const cmp = (va: number, vb: number | null, more = true) => h('b' + (vb !== null && (more ? va > vb : va < vb) ? '.up' : ''), fmt(va));
    const other = cur && cur.uid !== it.uid ? cur : null;
    const rows: (HTMLElement | string)[][] = [];
    if (w) {
      const ow = other ? WEAPON_BY_ID[other.tpl] : null;
      rows.push(['Базовый урон', cmp(dmg(it), other ? dmg(other) : null), other ? fmt(dmg(other)) : '—']);
      rows.push(['Атак/с', cmp(w.aps, ow ? ow.aps : null), ow ? fmt(ow.aps) : '—']);
      rows.push([`Требуется ${w.attr.toUpperCase()}`, h('b', String(w.req)), other ? reqOf(other) : '—']);
    } else if (a) {
      rows.push(['Защита', cmp(itemArmor(it), other ? itemArmor(other) : null), other ? String(itemArmor(other)) : '—']);
      rows.push([`Требуется ${Object.keys(a.req).map((x) => x.toUpperCase()).join(', ')}`, h('b', reqOf(it)), other ? reqOf(other) : '—']);
    }
    const qi = c.data.quick.indexOf(it.uid);
    const reqTxt = Object.entries(w ? { [w.attr]: w.req } : a.req).map(([k2, v]) => `${k2.toUpperCase()} ${Math.min(this.s.hero.stats[k2 as StatId], v as number)} / ${v}`).join(', ');
    const free = c.data.quick.indexOf(null);
    return panel(
      head,
      h('div.r2-hrow', tag(r.name, it.rarity === 'common' ? undefined : r.color), wearing ? tag('Надето', undefined, 'green') : null, qi >= 0 ? tag(`Быстрое ${qi + 1}`, undefined, 'gold') : null),
      h('div.r2-center', bigIcon(iconForKey(it.tpl), 140)),
      table(['', 'Выбран', 'Надет'], rows),
      h('div', wearing ? 'Надето сейчас' : `Надет: ${cur ? itemName(cur) : 'ничего'}`),
      h('div.r2-big-req' + (prob ? '.r2-red' : '.r2-green'), reqTxt),
      h('div.r2-dim', `${w ? `${FAMILY_NAME[w.family]}${w.kind === 'greatsword' ? ' (двуручный)' : ''} · ${w.family === 'staff' ? 'магический' : 'физический'} урон` : a ? `${SLOT_NAME[a.slot]} · только физическая защита` : ''}`),
      h('div.r2-dim', `${it.affixes.length ? '' : 'Без аффиксов · '}${it.upgrade ? upgradeName(it.tpl, it.upgrade) : 'Без улучшения'}`),
      h('div.r2-affixes', it.affixes.map((x) => h('div.r2-affix', affixText(x)))),
      w && it.rarity === 'legendary' ? h('div.r2-legend', `${LEGENDARY[w.kind].name}: ${LEGENDARY[w.kind].effect}`) : null,
      h('div.r2-grow'),
      !wearing
        ? bigBtn('Надеть', prob, () => this.act(equip(g, it.uid, this.s.hero), `Надето: ${itemName(it)}`, again))
        : slotName !== 'weapon'
          ? bigBtn('Снять', null, () => this.act(unequip(g, slotName), `Снято: ${itemName(it)}`, again), false)
          : h('div.r2-center.r2-dim.r2-small', 'Оружие можно только заменить.'),
      w
        ? qi >= 0
          ? bigBtn('Убрать из быстрого оружия', null, () => { c.setQuick(qi, null); this.s.changed(); again(); }, false)
          : bigBtn('В быстрое оружие', free < 0 ? 'Быстрое оружие заполнено (4)' : null, () => { c.setQuick(free, it.uid); this.s.changed(); again(); }, false)
        : null,
      h('div.r2-center.r2-dim.r2-small', 'Выбрасывать предметы нельзя: ненужное можно продать или оставить в сундуке.'),
    );
  }
}

function withClass(el: HTMLElement, cls: string): HTMLElement {
  el.classList.add(cls);
  return el;
}

export { AFFIXES };

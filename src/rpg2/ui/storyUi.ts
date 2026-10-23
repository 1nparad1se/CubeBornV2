import { h } from '../../ui/dom';
import { formatClock } from '../../game/GameClock';
import type { GrowthData } from '../growth/growth';
import type { HeroState } from '../hero';
import { RANKS, lootTable } from '../economy/world';
import { stackName } from '../economy/goods';
import { TEACHES, type TeacherId } from '../economy/craft';
import type { MerchantId } from '../economy/trade';
import {
  NPC_BY_ID, QUEST_BY_ID, QUEST_DEFS, QUEST_TYPE, TOKEN_NAMES, accept, cancel, deliver, deliveries, isReady, npcName, objectiveCount, offersOf, talk, talkTopics,
  turnIn, turnInProblem, turnInsAt, type QuestCtx, type QuestDef,
} from '../story/quests';
import { BESTIARY, BESTIARY_BY_ID, DESTINATIONS, POIS, SLEEP_HOURS, WAYSTONES, wakeAt, type StoryData } from '../story/world';
import type { SceneMenus } from './menus';
import { hasIcon, iconForKey, pxIcon } from '../../ui/pixelIcons';
import { bar, bigBtn, bigIcon, chip, fmt, note, panel, phead, req, row, rule, screen, scroll, search, select, table, tag } from './kit';
import { creatureFigure, heroFigure } from './figure';
import { itemOf } from '../growth/growth';
import { ARMOR_BY_ID } from '../growth/items';
import { WEAPON_BY_ID } from '../combat/data';

/** Pixel portrait of an NPC (generic face when it has none of its own). */
const npcIcon = (id: string) => (hasIcon('npc-' + id) ? 'npc-' + id : 'npc');
/** A dialogue answer row (mockup hud-18): icon, text, a count on the right; gold when it is a quest step. */
function ansRow(ico: string, label: string, fn: () => void, problem: string | null = null, right?: string, gold = false): HTMLElement {
  return h('button.r2-ansrow' + (gold ? '.gold' : '') + (problem ? '.r2-off' : ''), { onclick: () => (problem ? undefined : fn()), title: problem ?? undefined }, pxIcon(ico, 34), h('span', label), right ? h('b.r2-gold', right) : null);
}

/** A small pixel sky for an hour: sunrise, noon, sunset or night with the moon (sleep window). */
function skyCanvas(hour: number, w: number, hgt: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  const P = 4;
  c.width = Math.ceil(w / P);
  c.height = Math.ceil(hgt / P);
  c.className = 'r2-sky';
  c.style.width = `${w}px`;
  c.style.height = `${hgt}px`;
  const g = c.getContext('2d')!;
  const W = c.width;
  const H = c.height;
  const night = hour < 5 || hour >= 21;
  const dusk = !night && (hour < 8 || hour >= 17);
  const top = night ? [14, 20, 52] : dusk ? (hour < 12 ? [90, 110, 170] : [70, 60, 130]) : [70, 150, 230];
  const bot = night ? [30, 40, 90] : dusk ? (hour < 12 ? [250, 190, 110] : [250, 120, 70]) : [170, 215, 250];
  for (let y = 0; y < H; y++) {
    const k = y / H;
    g.fillStyle = `rgb(${top.map((v, i) => Math.round(v + (bot[i] - v) * k)).join(',')})`;
    g.fillRect(0, y, W, 1);
  }
  if (night) {
    g.fillStyle = '#fff';
    for (let i = 0; i < 12; i++) g.fillRect((i * 37) % W, (i * 17) % Math.max(1, Math.floor(H * 0.6)), 1, 1);
    g.fillStyle = '#f4f0d0';
    g.fillRect(Math.floor(W * 0.38), Math.floor(H * 0.2), 5, 5);
    g.fillStyle = top.length ? `rgb(${top.join(',')})` : '#000';
    g.fillRect(Math.floor(W * 0.38) + 2, Math.floor(H * 0.2) - 1, 4, 4);
  } else {
    const sy = dusk ? Math.floor(H * 0.55) : Math.floor(H * 0.2);
    g.fillStyle = dusk ? '#ffd27a' : '#fff4b0';
    g.fillRect(Math.floor(W / 2) - 3, sy, 6, 6);
  }
  // hills and trees along the bottom
  g.fillStyle = night ? '#16301c' : dusk ? '#2c4a24' : '#3f8a34';
  for (let x = 0; x < W; x++) {
    const hh = Math.floor(H * 0.22 + Math.sin(x * 0.35) * 2 + ((x * 7) % 5 === 0 ? 3 : 0));
    g.fillRect(x, H - hh, 1, hh);
  }
  return c;
}

/** The hero's model in the current gear (bed window). */
function heroFigureFor(s: StoryHost): HTMLElement {
  const g = s.growth;
  const arm = (slot: 'head' | 'chest' | 'legs') => {
    const it = itemOf(g, g.equip[slot]);
    return it ? ARMOR_BY_ID[it.tpl]?.mesh ?? null : null;
  };
  const w = itemOf(g, g.equip.weapon);
  return heroFigure({ main: w ? WEAPON_BY_ID[w.tpl]?.mesh ?? null : null, off: null, head: arm('head'), hands: null, body: arm('chest'), feet: arm('legs') }, 220, 300);
}

/** What the stage 5 windows borrow from the scene. */
export interface StoryHost {
  hero: HeroState;
  growth: GrowthData;
  story: StoryData;
  menus: SceneMenus;
  inCombat(): boolean;
  toast(t: string): void;
  changed(): void;
  nextUid(): string;
  clock(): { day: number; minutes: number };
  /** Opens a service of an NPC: mentor training, trade, craft training, smith upgrades. */
  service(npc: string, svc: 'mentor' | 'trade' | 'training' | 'forge'): void;
  /** A quest was completed: the scene makes the event autosave (D042). */
  questDone(id: string): void;
  sleep(hour: number): string | null;
  activateStone(id: string): string | null;
  travel(kind: 'stone' | 'rune', dest: string): string | null;
  /** Hero position and camera yaw for the map; the map's ground colour; the site size. */
  heroPos(): { x: number; z: number; yaw: number };
  ground(x: number, z: number): number;
  size: number;
}

const WEAPON_NAMES: Record<string, string> = { sword2: 'Стальной меч', bow2: 'Составной лук', staff2: 'Посох кристалла' };

export class StoryScreens {
  constructor(private s: StoryHost) {}
  private answer = '';
  private journalTab: 'active' | 'done' | 'failed' = 'active';

  private ctx(): QuestCtx {
    const c = this.s.clock();
    return { q: this.s.story.q, g: this.s.growth, hero: this.s.hero, day: c.day, minutes: c.minutes };
  }
  private show(id: string, body: HTMLElement) {
    const old = document.querySelector(`.r2-menu-${id} .r2-win`) as HTMLElement | null;
    const top = old?.scrollTop ?? 0;
    this.s.menus.show(id, body);
    const nw = document.querySelector(`.r2-menu-${id} .r2-win`) as HTMLElement | null;
    if (nw) nw.scrollTop = top;
  }
  private btn(label: string, problem: string | null, fn: () => void, primary = false) {
    return h('button.r2-btn' + (primary ? '.primary' : ''), { onclick: fn, title: problem ?? undefined, class: problem ? 'r2-off' : undefined }, label);
  }

  // ------------------------------------------------------------------ dialogue (hud-18)
  /** D128 / D110–D114: a full-screen dialogue; quest lines appear only when their step allows. */
  dialog(npc: string, answer = '') {
    const n = NPC_BY_ID[npc];
    this.answer = answer;
    const c = this.ctx();
    const again = (a = '') => this.dialog(npc, a);
    const rowsQ: HTMLElement[] = [];
    const cards: HTMLElement[] = [];
    // final turn-ins (the «?» lines) and their states
    for (const d of turnInsAt(c, npc)) {
      if (!isReady(c, d.id)) {
        cards.push(this.questCard(d, h('div.r2-gold.r2-small', 'В процессе')));
        continue;
      }
      const go = (choice?: string) => {
        const r = turnIn(this.ctx(), d.id, npc, () => this.s.nextUid(), choice);
        if ('error' in r) return this.s.toast(r.error);
        this.s.toast(`Задание выполнено: ${d.name} (+${d.reward.xp} XP, +${d.reward.gold} зол.)${r.levels ? ` · новый уровень ${this.s.hero.progress.level}` : ''}`);
        this.s.changed();
        this.s.questDone(d.id);
        again(d.thanks);
      };
      const prog = d.objectives.map((o, i) => `${Math.min(objectiveCount(c, d.id, i), o.count)} / ${o.count}`).join(' · ');
      if (d.reward.choice) {
        for (const w of d.reward.choice) rowsQ.push(ansRow('mark-turnin', `Сдать «${d.name}»: взять ${WEAPON_NAMES[w] ?? w}`, () => go(w), turnInProblem(c, d.id, npc, w), prog, true));
      } else rowsQ.push(ansRow(this.questIcon(d), `Сдать задание «${d.name}»`, () => go(), turnInProblem(c, d.id, npc), prog, true));
      cards.push(this.questCard(d, null));
    }
    // intermediate steps (D114: no sign over the NPC, the line appears in the dialogue)
    for (const t of deliveries(c, npc))
      rowsQ.push(ansRow('scroll', `Передать: ${TOKEN_NAMES[t.token]} (задание «${QUEST_BY_ID[t.quest].name}»)`, () => {
        const r = deliver(this.ctx(), t.quest, t.i, npc);
        if (r) return this.s.toast(r);
        this.s.toast(`Передано: ${TOKEN_NAMES[t.token]}`);
        again('Письмо у меня. Передай, что я всё прочитал.');
      }));
    for (const t of talkTopics(c, npc))
      rowsQ.push(ansRow('chat', `Расспросить по заданию: ${t.text}`, () => {
        const r = talk(this.ctx(), t.quest, t.i, npc);
        if (r) return this.s.toast(r);
        this.s.toast(`Задание «${QUEST_BY_ID[t.quest].name}»: цель выполнена`);
        again(n.topics[0]?.[1] ?? n.greeting);
      }));
    // new quests (the «!» lines)
    for (const d of offersOf(c, npc))
      cards.push(this.questCard(d, h('div.r2-hrow.between', h('span.r2-small', `«${d.intro}»`), h('button.r2-big.small.primary.r2-fit', {
        onclick: () => {
          const r = accept(this.ctx(), d.id);
          if (r) return this.s.toast(r);
          this.s.toast(`Принято задание: ${d.name}`);
          this.s.changed();
          again(d.text);
        },
      }, 'Принять'))));
    const svc: HTMLElement[] = [];
    if (npc === 'arden' || npc === 'hira' || npc === 'alchemist') svc.push(ansRow('book', npc === 'alchemist' ? 'Хочу обучиться (характеристики и магия).' : 'Хочу обучиться.', () => this.s.service(npc, 'mentor')));
    if (n.merchant) svc.push(ansRow('coins', 'Покажи свои товары.', () => this.s.service(npc, 'trade')));
    if (TEACHES[npc as TeacherId]?.length) svc.push(ansRow(npc === 'alchemist' ? 'alchemy' : 'anvil', npc === 'alchemist' ? 'Алхимия и редкие травы.' : 'Обучи меня ремеслу.', () => this.s.service(npc, 'training')));
    if (npc === 'smith') svc.push(ansRow('sword', 'Улучши моё оружие.', () => this.s.service(npc, 'forge')));
    const left = h('div.r2-dlg-left', h('div.r2-dlgpic', pxIcon(npcIcon(npc), 320)), h('div.r2-namecard', h('b', n.name), h('span', `${n.role} · ${n.place}`)));
    const right = panel(
      h('div.r2-iconline', bigIcon(npcIcon(npc), 104), h('div', h('h2.r2-ph.r2-dlgname', n.name), h('div.r2-psub', n.role))),
      h('div.r2-say2', this.answer || n.greeting),
      rule(),
      h('h3.r2-h3', 'Ваш ответ'),
      scroll(rowsQ, svc, n.topics.map(([q, a]) => ansRow('chat', q, () => again(a))), ansRow('exit', 'До встречи.', () => this.s.menus.close('dialog')), cards),
      h('div.r2-hrow.between.r2-dlgfoot', h('span.cb-paused', 'Мир на паузе'), h('span', 'Esc — завершить разговор')),
    );
    this.show('dialog', screen('Диалог', '1fr 1fr', [left, right]));
  }

  private questIcon(d: QuestDef): string {
    return ({ collect: 'red', kill: 'wolf', deliver: 'scroll', talk: 'chat', explore: 'map' } as Record<string, string>)[d.type] ?? 'quest';
  }

  /** A quest card: icon, name, objectives with counts, reward chips. */
  private questCard(d: QuestDef, extra: HTMLElement | null): HTMLElement {
    const c = this.ctx();
    return h(
      'div.r2-box.gold.r2-qcard',
      h('div.r2-iconline.top', pxIcon(this.questIcon(d), 72),
        h('div.r2-grow',
          h('h3.r2-h3', d.name),
          d.objectives.map((o, i) => h('div.r2-dim', `${o.text}: ${Math.min(objectiveCount(c, d.id, i), o.count)} / ${o.count}${o.kind === 'deliver' && o.token ? ` (${TOKEN_NAMES[o.token]})` : ''}`)),
          h('div.r2-hrow', h('span', 'Награда:'), this.rewardChips(d)))),
      extra,
    );
  }
  private rewardChips(d: QuestDef): HTMLElement[] {
    const r = d.reward;
    const out = [chip('xp', `${r.xp} XP`, 'purple small'), chip('coins', `${r.gold} зол.`, 'gold small')];
    for (const [k, v] of Object.entries({ ...(r.consumables ?? {}), ...(r.materials ?? {}) })) out.push(chip(iconForKey(k), `${stackName(k)} ×${v}`, 'small'));
    if (r.gear) out.push(chip('helm', 'Лёгкий шлем I', 'small'));
    if (r.choice) out.push(chip('sword', `на выбор: ${r.choice.map((w) => WEAPON_NAMES[w] ?? w).join(' / ')}`, 'small'));
    return out;
  }


  // ------------------------------------------------------------------ journal (J, hud-16)
  private journalSel: Partial<Record<'active' | 'done' | 'failed', string>> = {};
  private journalType = 'all';

  journal(tab = this.journalTab) {
    this.journalTab = tab;
    const q = this.s.story.q;
    const c = this.ctx();
    const again = () => this.journal();
    const count = (st: string) => QUEST_DEFS.filter((d) => q.quests[d.id]?.status === st).length;
    const tracked = q.tracked ? QUEST_BY_ID[q.tracked] : null;
    const ev = { accepted: 'принято', cancelled: 'отменено', completed: 'выполнено' } as const;
    const left = panel(
      'Записи',
      ([['active', 'Активные', 'quest-active'], ['done', 'Выполненные', 'quest-done'], ['failed', 'Проваленные', 'quest-failed']] as const).map(([t, l, ico]) =>
        row({ icon: ico, iconSize: 56, title: l, cls: 'big', sel: tab === t, right: h('b.r2-jcount' + (count(t) ? '' : '.zero'), String(count(t))), onclick: () => this.journal(t) })),
      rule(),
      h('div.r2-h3.small', 'Отслеживается одно задание'),
      tracked ? h('div.r2-box.r2-iconline', pxIcon('eye', 34), pxIcon(this.questIcon(tracked), 48), h('b', tracked.name)) : h('div.r2-dim', 'Ничего не отслеживается.'),
      q.tokens.length ? h('div', h('div.r2-h3.small', 'Предметы заданий'), q.tokens.map((t) => h('div.r2-iconline', pxIcon('scroll', 24), TOKEN_NAMES[t]))) : null,
      h('div.r2-h3.small', 'История'),
      scroll(q.history.length ? [...q.history].reverse().slice(0, 60).map((r) => h('div.r2-dim.r2-small', `День ${r.day + 1}, ${formatClock(r.minutes)} — «${QUEST_BY_ID[r.quest].name}»: ${ev[r.event]}`)) : h('div.r2-dim.r2-small', 'Пока пусто.')),
    );
    const types: [string, string][] = [['all', 'Все типы'], ...Object.entries(QUEST_TYPE)];
    const list = QUEST_DEFS.filter((d) => q.quests[d.id]?.status === tab && (this.journalType === 'all' || d.type === this.journalType));
    if (!list.some((d) => d.id === this.journalSel[tab])) this.journalSel[tab] = list[0]?.id;
    const selId = this.journalSel[tab];
    const progressLine = (d: QuestDef) => {
      if (tab !== 'active') return h('span', tab === 'done' ? 'Выполнено' : 'Провалено');
      const o = d.objectives[0];
      if (!o) return h('span', 'В процессе');
      if ((o.kind === 'material' || o.kind === 'consumable') || o.kind === 'kill') return h('span', `${o.text}: `, h('b.r2-gold', `${Math.min(objectiveCount(c, d.id, 0), o.count)} / ${o.count}`));
      return h('b.r2-blue', isReady(c, d.id) ? 'Готово к сдаче' : 'В процессе');
    };
    const mid = panel(
      h('div.r2-hrow.between', h('h2.r2-ph', tab === 'active' ? 'Активные задания' : tab === 'done' ? 'Выполненные' : 'Проваленные'), select(types, this.journalType, (x) => { this.journalType = x; again(); })),
      scroll(list.length ? list.map((d) => h('button.r2-qrow' + (d.id === selId ? '.sel' : ''), { onclick: () => { this.journalSel[tab] = d.id; again(); } },
        pxIcon(this.questIcon(d), 76),
        h('span.r2-rtxt', h('b', d.name), h('small', `${d.main ? 'Основное' : 'Побочное'} · ${QUEST_TYPE[d.type]}`), progressLine(d)),
        q.tracked === d.id ? h('span.r2-onhud', pxIcon('eye', 34), h('small', 'На HUD')) : null)) : h('p.r2-note', 'Пусто.')),
      rule(),
      h('div.r2-center.r2-dim', 'Новые задания — в разговорах с NPC'),
    );
    const d = selId ? QUEST_BY_ID[selId] : null;
    let right: HTMLElement;
    if (!d) right = panel('Задание', h('p.r2-note', 'Выберите задание.'));
    else {
      const giver = NPC_BY_ID[d.npc];
      right = panel(
        phead(d.name, null, `${d.main ? 'Основное' : 'Побочное'} · ${QUEST_TYPE[d.type]}`),
        h('div.r2-iconline', bigIcon(npcIcon(d.npc), 96), h('div', h('h3.r2-h3', npcName(d.npc)), h('div.r2-dim', giver?.place ?? ''))),
        scroll(
          h('div.r2-sec', 'Описание'), h('div', d.text),
          h('div.r2-sec', 'Цель'),
          d.objectives.map((o, i) => {
            const k = Math.min(objectiveCount(c, d.id, i), o.count);
            return h('div.r2-box.r2-iconline', pxIcon((o.kind === 'material' || o.kind === 'consumable') ? this.questIcon(d) : o.kind === 'kill' ? 'wolf' : o.kind === 'deliver' ? 'scroll' : 'chat', 56),
              h('div.r2-grow', h('div', `${o.text}${o.kind === 'deliver' && o.token ? ` (${TOKEN_NAMES[o.token]})` : ''}`), h('b.r2-gold', `${k} / ${o.count}`), bar(k / o.count), (o.kind === 'material' || o.kind === 'consumable') ? h('div.r2-dim.r2-small', 'Учитываются предметы в инвентаре героя') : null));
          }),
          h('div.r2-sec', 'Ориентир'), h('div', d.direction),
          h('div.r2-sec', 'Награда'), h('div.r2-hrow', this.rewardChips(d)),
          tab === 'active' && isReady(c, d.id) ? h('div.r2-green', `Готово к сдаче: ${npcName(d.npc)}`) : null,
        ),
        tab === 'active'
          ? h('div.r2-btn2',
              bigBtn(q.tracked === d.id ? 'Не отслеживать' : 'Отслеживать', null, () => { q.tracked = q.tracked === d.id ? null : d.id; again(); }, false),
              d.main ? null : bigBtn('Отменить задание', null, () => this.s.menus.confirm(`Отменить «${d.name}»? Прогресс событий пропадёт, задание можно будет взять снова.`, () => { const r = cancel(this.ctx(), d.id); this.s.toast(r ?? `Отменено: ${d.name}`); again(); }), false))
          : null,
      );
    }
    this.show('journal', screen('Журнал заданий', '0.82fr 1.25fr 1.2fr', [left, mid, right]));
  }

  // ------------------------------------------------------------------ map (M, hud-15)
  private mapZoom = 1.25;
  private mapPan = { x: 0, y: 0 };
  private mapSel: string | null = null;
  private mapPlacing = false;

  /** Turned like the camera; discovered places, the hero, personal marks; no quest objectives. */
  map() {
    const st = this.s.story;
    const size = this.s.size;
    const px = Math.max(2, Math.floor(780 / size));
    const W = size * px;
    const cv = document.createElement('canvas');
    cv.width = W;
    cv.height = W;
    const g = cv.getContext('2d')!;
    const { x: hx, z: hz, yaw } = this.s.heroPos();
    // rotate so that the camera's forward is up: forward = (-sin yaw, -cos yaw)
    const ang = -yaw;
    const toScreen = (x: number, z: number): [number, number] => {
      const dx = (x - size / 2) * px;
      const dz = (z - size / 2) * px;
      const c = Math.cos(ang);
      const s = Math.sin(ang);
      return [W / 2 + dx * c - dz * s, W / 2 + dx * s + dz * c];
    };
    const toWorld = (sx: number, sy: number): [number, number] => {
      const dx = sx - W / 2;
      const dy = sy - W / 2;
      const c = Math.cos(-ang);
      const s = Math.sin(-ang);
      return [size / 2 + (dx * c - dy * s) / px, size / 2 + (dx * s + dy * c) / px];
    };
    // the ground is painted unrotated once, then drawn turned (no seams between cells)
    const base = this.groundCanvas();
    g.imageSmoothingEnabled = false;
    g.save();
    g.translate(W / 2, W / 2);
    g.rotate(ang);
    g.translate(-W / 2, -W / 2);
    g.drawImage(base, 0, 0, W, W);
    g.restore();
    // markers as HTML over the canvas (they keep their size and stay upright)
    const inner = h('div.r2-mapinner', { style: `width:${W}px;height:${W}px` }, cv);
    const pin = (x: number, z: number, el: HTMLElement) => {
      const [sx, sy] = toScreen(x, z);
      el.style.left = `${sx}px`;
      el.style.top = `${sy}px`;
      inner.append(el);
    };
    const near = (x: number, z: number) => WAYSTONES.find((w) => Math.hypot(w.x - x, w.z - z) < 12);
    for (const p of POIS) {
      if (!st.pois.includes(p.id)) continue;
      const settle = /долин|брод/i.test(p.name);
      pin(p.x, p.z, h('button.r2-mapmark' + (this.mapSel === p.id ? '.sel' : ''), { onclick: (e: MouseEvent) => { e.stopPropagation(); this.mapSel = p.id; this.map(); } }, pxIcon(settle ? 'house' : 'flag', 26), h('span', p.name.split(' · ')[0])));
    }
    for (const w of WAYSTONES) {
      const on = st.waystones.includes(w.id);
      if (!on && !st.pois.some((p) => Math.hypot(POIS.find((x) => x.id === p)!.x - w.x, POIS.find((x) => x.id === p)!.z - w.z) < 12)) continue;
      pin(w.x, w.z, h('span.r2-mapicon', pxIcon(on ? 'waystone' : 'waystone-off', 30)));
    }
    st.marks.forEach((m, i) => pin(m.x, m.z, h('button.r2-mapmark.mark' + (this.mapSel === 'mark:' + i ? '.sel' : ''), { onclick: (e: MouseEvent) => { e.stopPropagation(); this.mapSel = 'mark:' + i; this.map(); } }, pxIcon('flag', 26), h('span', m.label || `Метка ${i + 1}`))));
    pin(hx, hz, h('span.r2-mapme', h('i'), h('small', 'Вы здесь')));
    const wrap = h('div.r2-mapwrap' + (this.mapPlacing ? '.placing' : ''), inner);
    const apply = () => (inner.style.transform = `translate(-50%, -50%) translate(${this.mapPan.x}px, ${this.mapPan.y}px) scale(${this.mapZoom})`);
    apply();
    let drag: { x: number; y: number; moved: boolean } | null = null;
    wrap.onpointerdown = (e) => { drag = { x: e.clientX, y: e.clientY, moved: false }; };
    wrap.onpointermove = (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
      if (!drag.moved) return;
      this.mapPan.x += dx;
      this.mapPan.y += dy;
      drag.x = e.clientX;
      drag.y = e.clientY;
      apply();
    };
    wrap.onpointerup = (e) => {
      const d = drag;
      drag = null;
      if (!d || d.moved) return;
      if (!this.mapPlacing) return;
      const r = cv.getBoundingClientRect();
      const [wx, wz] = toWorld(((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * W);
      if (st.marks.length < 50) st.marks.push({ x: wx, z: wz, label: `Метка ${st.marks.length + 1}` });
      this.mapSel = 'mark:' + (st.marks.length - 1);
      this.mapPlacing = false;
      this.map();
    };
    // the wheel zooms around the point under the cursor (that point stays where it is)
    wrap.onwheel = (e) => {
      e.preventDefault();
      const r = wrap.getBoundingClientRect();
      const px = e.clientX - (r.left + r.width / 2);
      const py = e.clientY - (r.top + r.height / 2);
      const z0 = this.mapZoom;
      const z1 = Math.max(1, Math.min(6, z0 * (e.deltaY < 0 ? 1.2 : 1 / 1.2)));
      this.mapPan.x = px - ((px - this.mapPan.x) / z0) * z1;
      this.mapPan.y = py - ((py - this.mapPan.y) / z0) * z1;
      this.mapZoom = z1;
      apply();
    };
    const zoom = (k: number) => { this.mapZoom = Math.max(1, Math.min(6, this.mapZoom * k)); apply(); };
    const north = toScreen(size / 2, 0);
    const nAng = Math.atan2(north[0] - W / 2, -(north[1] - W / 2));
    const mapP = panel(null,
      wrap,
      h('div.r2-mapctl.top', h('div.r2-mapbtn.r2-north', { title: 'Север' }, h('span', { style: `transform:rotate(${nAng}rad)` }, '▲'), h('b', 'С'))),
      h('div.r2-mapctl.bottom', h('button.r2-mapbtn', { onclick: () => zoom(1.25), title: 'Приблизить' }, '+'), h('button.r2-mapbtn', { onclick: () => zoom(1 / 1.25), title: 'Отдалить' }, '−')),
      h('div.r2-maplegend', h('span', pxIcon('house', 22), 'Поселение'), h('span', pxIcon('waystone', 22), 'Камень активен'), h('span', pxIcon('waystone-off', 22), 'Камень неактивен'), h('span', pxIcon('flag', 22), 'Личная метка')),
    );
    mapP.classList.add('r2-mappnl');
    // side panel: the selected place, waystone, personal marks
    const sel = this.mapSel;
    const poi = sel && !sel.startsWith('mark:') ? POIS.find((p) => p.id === sel) : null;
    const mk = sel && sel.startsWith('mark:') ? st.marks[Number(sel.slice(5))] : null;
    const ws = poi ? near(poi.x, poi.z) : null;
    const side = panel(
      poi ? phead(poi.name.split(' · ')[0], null, 'Посещено') : mk ? phead(mk.label || 'Метка', null, 'Личная метка') : phead('Карта', null, 'Выберите место на карте'),
      poi ? h('div.r2-pic.r2-placepic', this.placeCanvas(poi.x, poi.z)) : null,
      poi && poi.name.includes(' · ') ? h('div.r2-dim', poi.name.split(' · ').slice(1).join(' · ')) : null,
      ws ? h('div.r2-iconline', pxIcon(st.waystones.includes(ws.id) ? 'waystone' : 'waystone-off', 44), h('b', st.waystones.includes(ws.id) ? 'Путевой камень активирован' : 'Путевой камень не активирован')) : null,
      ws ? h('div.r2-dim', 'Перемещение доступно у активированного путевого камня.') : null,
      !poi && !mk ? h('div.r2-dim', 'Верх карты — направление камеры. Целей заданий на карте нет.') : null,
      rule(),
      h('h3.r2-h3', 'Личные метки'),
      scroll(st.marks.length ? st.marks.map((m, i) => h('div.r2-box.r2-hrow.between', h('span.r2-iconline', pxIcon('flag', 26), m.label || `Метка ${i + 1}`), h('button.r2-big.small.r2-fit', { onclick: () => { st.marks.splice(i, 1); this.mapSel = null; this.map(); } }, 'Удалить метку'))) : h('div.r2-dim', 'Меток нет.')),
      bigBtn(this.mapPlacing ? 'Щёлкните по карте…' : 'Поставить метку', st.marks.length >= 50 ? 'Не больше 50 меток' : null, () => { this.mapPlacing = !this.mapPlacing; this.map(); }),
    );
    const body = screen('Карта мира', '2.55fr 1fr', [mapP, side]);
    body.append(h('div.r2-mapfoot', h('span', 'M / Esc — Закрыть карту'), h('span', 'Колесо — масштаб · Перетаскивание — обзор')));
    this.show('map2', body);
  }

  private ground: HTMLCanvasElement | null = null;
  /** The site ground painted once (1 px per cell). */
  private groundCanvas(): HTMLCanvasElement {
    if (this.ground) return this.ground;
    const size = this.s.size;
    const base = document.createElement('canvas');
    base.width = base.height = size;
    const bg = base.getContext('2d')!;
    for (let z = 0; z < size; z++)
      for (let x = 0; x < size; x++) {
        const y = this.s.ground(x + 0.5, z + 0.5);
        const k = Math.max(0, Math.min(1, (y - 1) / 12));
        const n = ((x * 73856093) ^ (z * 19349663)) & 7;
        bg.fillStyle = y < 2.2 ? `rgb(${50 + n},${100 + n * 2},${170 + n * 3})` : `rgb(${Math.round(60 + 80 * k + n * 2)},${Math.round(118 + 55 * k + n * 3)},${Math.round(50 + 50 * k)})`;
        bg.fillRect(x, z, 1, 1);
      }
    this.ground = base;
    return base;
  }
  /** A close, unrotated pixel view of the ground around a place (map side panel). */
  private placeCanvas(x: number, z: number): HTMLCanvasElement {
    const base = this.groundCanvas();
    const r = 14;
    const c = document.createElement('canvas');
    c.width = 360;
    c.height = 200;
    const g = c.getContext('2d')!;
    g.imageSmoothingEnabled = false;
    g.drawImage(base, x - r * 1.8, z - r, r * 3.6, r * 2, 0, 0, 360, 200);
    g.fillStyle = '#f6dfa4';
    g.fillRect(176, 96, 8, 8);
    return c;
  }

  // ------------------------------------------------------------------ bestiary (B, hud-17)
  private bestSel = '';
  private bestQ = '';
  private bestF: 'all' | 'full' | 'seen' = 'all';

  bestiary() {
    const st = this.s.story;
    const again = () => this.bestiary();
    const known = BESTIARY.filter((b) => st.bestiary[b.id]);
    const ql = this.bestQ.trim().toLowerCase();
    const list = known.filter((b) => (!ql || b.name.toLowerCase().includes(ql)) && (this.bestF === 'all' || (this.bestF === 'full') === (st.bestiary[b.id] === 2)));
    if (!list.some((b) => b.id === this.bestSel)) this.bestSel = list[0]?.id ?? '';
    const face = (b: { id: string; name: string }) => (/bandit|разбой/i.test(b.id + b.name) ? 'bandit' : /greyfang|клык/i.test(b.id + b.name) ? 'greyfang' : /wolf|волк/i.test(b.id + b.name) ? 'wolf' : 'enemy');
    const full = known.filter((b) => st.bestiary[b.id] === 2).length;
    const left = panel(
      'Обнаруженные существа',
      h('div.r2-filters.wide', search(this.bestQ, 'Поиск', (v) => { this.bestQ = v; again(); }, 'best'), select([['all', 'Все виды'], ['full', 'Полные записи'], ['seen', 'Только обнаружены']] as const, this.bestF, (x) => { this.bestF = x; again(); })),
      scroll(list.length ? list.map((b) => {
        const isFull = st.bestiary[b.id] === 2;
        return row({ icon: face(b), iconSize: 76, title: b.name, cls: 'big', sel: b.id === this.bestSel, sub: isFull ? h('span', 'Уровень ', h('b.r2-gold', String(b.level)), ' · Запись открыта') : 'Только обнаружен', right: pxIcon(isFull ? 'check' : 'eye', 34), onclick: () => { this.bestSel = b.id; again(); } });
      }) : h('p.r2-note', known.length ? 'Ничего не найдено.' : 'Пока никто не встречен.')),
      rule(),
      h('div.r2-center', `Обнаружено: ${known.length} · Полных записей: `, h('b.r2-gold', String(full))),
      h('div.r2-box.gold', note('Обнаружение открывает имя и облик. Первое засчитанное убийство — полную запись.')),
    );
    const b = BESTIARY_BY_ID[this.bestSel];
    let right: HTMLElement;
    if (!b) right = panel('Бестиарий', h('p.r2-note', 'Пока никто не встречен.'));
    else {
      const isFull = st.bestiary[b.id] === 2;
      const rank = RANKS[b.rank];
      const stats = isFull
        ? table(null, [
            [h('span', pxIcon('hp', 26), 'HP'), h('b', String(b.hp))],
            [h('span', pxIcon('sword', 26), b.damageType === 'магический' || /маг/i.test(b.damageType) ? 'Магический урон' : 'Физический урон'), h('b', `${b.damage} / ${fmt(b.interval)} с`)],
            [h('span', pxIcon('shield', 26), 'Броня'), h('b', String(b.armor))],
            [h('span', pxIcon('shield-blue', 26), 'RES'), h('b', String(b.res))],
            [h('span', pxIcon('boot', 26), 'Скорость'), h('b', `${fmt(b.speed)} м/с`)],
            [h('span', pxIcon('star', 26), 'Базовая награда'), h('b.r2-gold', `${b.xp} XP`)],
          ], '.kv')
        : h('div.r2-box', h('p.r2-note', 'Подробности откроются после первой засчитанной победы.'));
      const loot = lootTable(b.id);
      const lootRows = loot.map((l) => {
        const need = l.tool || l.skill ? [l.tool ? 'Охотничий нож' : '', l.skill ? `Охота ${l.skill.slice(-1)}` : ''].filter(Boolean).join(' + ') : 'Без требований';
        const name = l.kind === 'gold' ? 'Золото' : l.kind === 'gear' ? l.key : stackName(l.key);
        const cell = h('span.r2-iconline', pxIcon(l.kind === 'gold' ? 'coins' : iconForKey(l.key), 32), h('span', h('b', name), h('div.r2-dim.r2-small', need)));
        return h('tr', h('td', cell), h('td', `${l.chance}%`), h('td', l.min === l.max ? String(l.min) : `${l.min}–${l.max}`));
      });
      const lootTbl = h('table.r2-tbl', h('thead', h('tr', h('th', 'Предмет'), h('th', 'Шанс'), h('th', 'Кол-во'))), h('tbody', lootRows));
      const lootBox = h('div', h('h3.r2-h3', 'Возможная добыча'), h('div.r2-lootscroll', lootTbl));
      const behav = h('div', h('h3.r2-h3', 'Поведение'), h('div.r2-iconline.top', pxIcon('group', 40), h('div', b.behavior)), rule(), h('h3.r2-h3', 'Место обитания'), h('div.r2-iconline', pxIcon('tree', 40), b.habitat));
      right = panel(
        h('div.r2-phead', h('h2.r2-ph.r2-bigname', b.name), h('div.r2-hrow', isFull ? tag(`Уровень ${b.level}`, undefined, 'gold') : null, isFull ? tag(rank?.name ?? b.rank) : null, tag(isFull ? 'Полная запись' : 'Только обнаружен', undefined, isFull ? 'green' : ''))),
        h('div.r2-bestgrid',
          h('div.r2-pic.r2-bestpic', creatureFigure(b.id)),
          h('div.r2-beststats', stats, isFull ? h('div.r2-box.r2-iconline', pxIcon('clock', 44), h('div', h('div', 'Возрождение: ', h('b', `${rank?.respawn ?? '?'} мин`)), h('div', 'Тело исчезает: ', h('b', `${rank?.corpse ?? '?'} мин`)), h('div.r2-dim.r2-small', 'По времени активной игры'))) : null)),
        isFull ? h('div.r2-bestgrid.low', behav, lootBox) : null,
      );
    }
    this.show('bestiary', screen('Бестиарий', '0.92fr 1.85fr', [left, right]));
  }

  // ------------------------------------------------------------------ bed (hud-24)
  private sleepHour = 6;

  /** D083: sleep until the next occurrence of the chosen hour; the wake moment is shown first. */
  bed() {
    const { day, minutes } = this.s.clock();
    const hero = this.s.hero;
    const again = () => this.bed();
    const fight = this.s.inCombat();
    const label: Record<number, string> = { 6: 'Утро', 12: 'Полдень', 18: 'Вечер', 0: 'Полночь' };
    const hh = (hr: number) => `${String(hr).padStart(2, '0')}:00`;
    const night = minutes >= 21 * 60 || minutes < 5 * 60;
    const left = panel(
      'Кровать героя',
      h('div.r2-hrow', bigIcon('bed', 56), tag(fight ? 'Недоступна в бою' : 'Доступна', undefined, fight ? '' : 'green')),
      h('div.r2-pic.r2-bedpic', heroFigureFor(this.s), pxIcon('bed', 150, 'r2-bedico'), tag(fight ? 'В бою' : 'Вне боя', undefined, fight ? '' : 'green')),
      h('div.r2-center.r2-dim', 'Сон бесплатный'),
      rule(),
      h('h3.r2-h3', 'Сейчас'),
      h('div.r2-iconline', h('span.r2-skybox', skyCanvas(night ? 0 : minutes / 60, 96, 60)), h('b.r2-big-req', `День ${day + 1} · ${formatClock(minutes)}`)),
      h('div.r2-center.r2-dim', 'Выберите время пробуждения.'),
    );
    const mid = panel(
      'Спать до',
      SLEEP_HOURS.map((hr) => row({ title: h('span', h('small.r2-dimtop', label[hr] ?? ''), h('span.r2-bigtime', hh(hr))), sel: hr === this.sleepHour, cls: 'r2-sleeprow', right: h('span.r2-radio'), onclick: () => { this.sleepHour = hr; again(); } }))
        .map((r, i) => { r.prepend(skyCanvas(SLEEP_HOURS[i], 132, 78)); return r; }),
      rule(),
      note('До следующего наступления выбранного часа.', 'warn'),
      note('При совпадении времени — на следующие сутки.', 'warn'),
    );
    const w = wakeAt(day, minutes, this.sleepHour);
    const mins = Math.round((w.day - day) * 1440 + (w.minutes - minutes));
    const recRow = (ico: string, name: string, v: number, max: number) => h('tr', h('td', pxIcon(ico, 26), name), h('td', `${Math.floor(v)} / ${max}`), h('td', '→'), h('td', h('b.up', `${max} / ${max}`)));
    const right = panel(
      phead('После сна', tag('Предпросмотр')),
      h('div.r2-pic.r2-wakepic', skyCanvas(this.sleepHour, 460, 120)),
      h('div.r2-center.r2-wake', `День ${w.day + 1} · ${formatClock(w.minutes)}`),
      h('div.r2-center', `Пройдёт ${Math.floor(mins / 60)} ч ${mins % 60} мин.`),
      rule(),
      h('h3.r2-h3', 'Восстановление'),
      h('table.r2-tbl', h('tbody', recRow('hp', 'HP', hero.hp, hero.maxHp), recRow('potion-mp', 'MP', hero.mp, hero.maxMp), recRow('st', 'ST', hero.st, hero.maxSt))),
      req(true, 'Перезарядки завершатся.'),
      req(true, 'Временный контроль снимется.'),
      note('Таймеры возрождения, тел, ресурсов и автосохранения не продвигаются.', 'warn'),
      h('div.r2-grow'),
      bigBtn(`Спать до ${hh(this.sleepHour)}`, fight ? 'Спать можно только вне боя' : null, () => {
        const r = this.s.sleep(this.sleepHour);
        if (r) return this.s.toast(r);
        this.s.menus.close('bed');
      }),
    );
    this.show('bed', screen('Сон', '1fr 1fr 1fr', [left, mid, right]));
  }

  waystone(id: string) {
    const st = this.s.story;
    const w = WAYSTONES.find((x) => x.id === id)!;
    const active = st.waystones.includes(id);
    const others = WAYSTONES.filter((x) => x.id !== id && st.waystones.includes(x.id));
    const body = h(
      'div',
      h('h1', w.name),
      h('div.r2-npc', pxIcon(active ? 'waystone' : 'waystone-off', 96, 'r2-npcface'), h('div', h('h2', 'Путевой камень'), h('div.r2-sub', active ? 'Камень активирован.' : 'Камень не активирован.'))),
      h('div.r2-rule'),
      active
        ? others.length
          ? others.map((o) => this.btn(`Переместиться: ${DESTINATIONS[o.dest].name}`, this.s.inCombat() ? 'Только вне боя' : null, () => {
              const r = this.s.travel('stone', o.id);
              if (r) this.s.toast(r);
            }, true))
          : h('p.r2-note', 'Других активированных камней пока нет.')
        : this.btn('Активировать', this.s.inCombat() ? 'Только вне боя' : null, () => {
            const r = this.s.activateStone(id);
            if (r) return this.s.toast(r);
            this.waystone(id);
          }, true),
      h('p.r2-note', 'Перемещение бесплатно. Подготовка — 5 секунд на месте: движение, прыжок, уклонение, атака, оглушение, урон или начало боя её отменяют.'),
      h('button.r2-btn.small', { onclick: () => this.s.menus.close('waystone') }, 'Закрыть'),
    );
    this.show('waystone', body);
  }
}

export { BESTIARY_BY_ID };
export type { MerchantId };

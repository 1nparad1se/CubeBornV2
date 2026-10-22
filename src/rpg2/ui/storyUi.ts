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
import { hasIcon, pxIcon } from '../../ui/pixelIcons';

/** Pixel portrait of an NPC (generic face when it has none of its own). */
const npcIcon = (id: string) => (hasIcon('npc-' + id) ? 'npc-' + id : 'npc');
/** A dialogue answer line with its icon (mockup hud-18). */
const ans = (ico: string, label: string, fn: () => void, title?: string) => h('button.r2-btn.r2-ans', { onclick: fn, title }, pxIcon(ico, 32), h('span', label));

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
  private objectives(d: QuestDef): HTMLElement {
    const c = this.ctx();
    return h(
      'div',
      d.objectives.map((o, i) => {
        const n = Math.min(objectiveCount(c, d.id, i), o.count);
        const done = objectiveCount(c, d.id, i) >= o.count;
        return h('div.r2-req' + (done ? '.ok' : ''), `${done ? '✓' : '·'} ${o.text}: ${n} / ${o.count}${o.kind === 'deliver' && !done ? ` (${TOKEN_NAMES[o.token!]})` : ''}`);
      }),
    );
  }

  // ------------------------------------------------------------------ dialogue
  /** D128 / D110–D114: a full-screen dialogue; quest lines appear only when their step allows. */
  dialog(npc: string, answer = '') {
    const n = NPC_BY_ID[npc];
    this.answer = answer;
    const c = this.ctx();
    const again = (a = '') => this.dialog(npc, a);
    const lines: HTMLElement[] = [];
    // final turn-ins (the «?» lines) and their states
    for (const d of turnInsAt(c, npc)) {
      if (!isReady(c, d.id)) {
        lines.push(h('div.r2-card', h('div.r2-card-h', pxIcon('quest-active', 40, 'r2-cico'), h('span', `«${d.name}»`), h('small', 'в процессе')), this.objectives(d)));
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
      const reward = this.rewardText(d);
      lines.push(
        h('div.r2-card',
          h('div.r2-card-h', pxIcon('mark-turnin', 40, 'r2-cico'), h('span', `Сдать задание «${d.name}»`), h('small', reward)),
          d.reward.choice
            ? h('div.r2-row', d.reward.choice.map((w) => this.btn(`Взять: ${WEAPON_NAMES[w] ?? w}`, turnInProblem(c, d.id, npc, w), () => go(w), true)))
            : this.btn('Сдать задание', turnInProblem(c, d.id, npc), () => go(), true),
        ),
      );
    }
    // intermediate steps (D114: no sign over the NPC, the line appears in the dialogue)
    for (const t of deliveries(c, npc))
      lines.push(this.btn(`Передать: ${TOKEN_NAMES[t.token]} (задание «${QUEST_BY_ID[t.quest].name}»)`, null, () => {
        const r = deliver(this.ctx(), t.quest, t.i, npc);
        if (r) return this.s.toast(r);
        this.s.toast(`Передано: ${TOKEN_NAMES[t.token]}`);
        again('Письмо у меня. Передай, что я всё прочитал.');
      }));
    for (const t of talkTopics(c, npc))
      lines.push(this.btn(`Расспросить по заданию: ${t.text}`, null, () => {
        const r = talk(this.ctx(), t.quest, t.i, npc);
        if (r) return this.s.toast(r);
        this.s.toast(`Задание «${QUEST_BY_ID[t.quest].name}»: цель выполнена`);
        again(n.topics[0]?.[1] ?? n.greeting);
      }));
    // new quests (the «!» lines)
    for (const d of offersOf(c, npc))
      lines.push(
        h('div.r2-card',
          h('div.r2-card-h', pxIcon('mark-quest', 40, 'r2-cico'), h('span', `Задание: ${d.name}`), h('small', `${QUEST_TYPE[d.type]} · ${d.main ? 'основное' : 'побочное'}`)),
          h('p', `«${d.intro}»`),
          h('p.r2-note', `${this.rewardText(d)}`),
          this.btn('Принять', null, () => {
            const r = accept(this.ctx(), d.id);
            if (r) return this.s.toast(r);
            this.s.toast(`Принято задание: ${d.name}`);
            this.s.changed();
            again(d.text);
          }, true),
        ),
      );
    const svc: HTMLElement[] = [];
    if (npc === 'arden' || npc === 'hira' || npc === 'alchemist') svc.push(ans('book', npc === 'alchemist' ? 'Характеристики и магия' : 'Обучение', () => this.s.service(npc, 'mentor')));
    if (n.merchant) svc.push(ans('coins', 'Торговля', () => this.s.service(npc, 'trade')));
    if (TEACHES[npc as TeacherId]?.length) svc.push(ans(npc === 'alchemist' ? 'alchemy' : 'anvil', npc === 'alchemist' ? 'Алхимия и редкие травы' : 'Обучение ремеслу', () => this.s.service(npc, 'training')));
    if (npc === 'smith') svc.push(ans('sword', 'Улучшение оружия', () => this.s.service(npc, 'forge')));
    const body = h(
      'div',
      h('h1', 'Диалог'),
      h('div.r2-npc', pxIcon(npcIcon(npc), 112, 'r2-npcface'), h('div', h('h2', n.name), h('div.r2-sub', `${n.role} · ${n.place}`))),
      h('p.r2-say', `«${this.answer || n.greeting}»`),
      h('div.r2-rule'),
      h('h3', 'Ваш ответ'),
      h('div.r2-answers', n.topics.map(([q, a]) => ans('chat', q, () => again(a))), svc, ans('exit', 'До встречи', () => this.s.menus.close('dialog'))),
      lines.length ? h('div', h('h3', 'Задания'), lines) : null,
    );
    this.show('dialog', body);
  }

  private rewardText(d: QuestDef): string {
    const r = d.reward;
    const parts = [`${r.xp} XP`, `${r.gold} зол.`];
    for (const [k, v] of Object.entries({ ...(r.consumables ?? {}), ...(r.materials ?? {}) })) parts.push(`${stackName(k)} ×${v}`);
    if (r.gear) parts.push('Лёгкий шлем I');
    if (r.choice) parts.push(`на выбор: ${r.choice.map((w) => WEAPON_NAMES[w] ?? w).join(' / ')}`);
    return 'Награда: ' + parts.join(', ');
  }

  // ------------------------------------------------------------------ journal (J)
  journal(tab = this.journalTab) {
    this.journalTab = tab;
    const q = this.s.story.q;
    const c = this.ctx();
    const again = () => this.journal();
    const status = tab;
    const list = QUEST_DEFS.filter((d) => q.quests[d.id]?.status === status).map((d) => {
      const ready = isReady(c, d.id);
      return h(
        'div.r2-card',
        h('div.r2-card-h', pxIcon(status === 'active' ? 'quest-active' : status === 'done' ? 'quest-done' : 'quest-failed', 44, 'r2-cico'), h('span', d.name), h('small', `${QUEST_TYPE[d.type]} · ${d.main ? 'основное' : 'побочное'} · ${npcName(d.npc)}`)),
        h('p', d.text),
        h('p.r2-note', d.direction),
        status === 'active' ? this.objectives(d) : null,
        status === 'active' && ready ? h('div.r2-req.ok', `Готово к сдаче: ${npcName(d.npc)}`) : null,
        status === 'active'
          ? h('div.r2-row',
              this.btn(q.tracked === d.id ? 'Не отслеживать' : 'Отслеживать', null, () => { q.tracked = q.tracked === d.id ? null : d.id; again(); }),
              d.main ? null : this.btn('Отменить', null, () => this.s.menus.confirm(`Отменить «${d.name}»? Прогресс событий пропадёт, задание можно будет взять снова.`, () => { const r = cancel(this.ctx(), d.id); this.s.toast(r ?? `Отменено: ${d.name}`); again(); })),
            )
          : null,
      );
    });
    const ev = { accepted: 'принято', cancelled: 'отменено', completed: 'выполнено' } as const;
    const body = h(
      'div',
      h('h1', 'Журнал'),
      h('div.r2-rule'),
      h('div.r2-tabs', ([['active', 'Активные', 'quest-active'], ['done', 'Выполненные', 'quest-done'], ['failed', 'Проваленные', 'quest-failed']] as const).map(([t, l, ico]) => h('button.r2-btn.small' + (tab === t ? '.sel' : ''), { onclick: () => this.journal(t) }, pxIcon(ico, 28, 'r2-tabico'), l))),
      list.length ? list : h('p.r2-note', 'Пусто.'),
      q.tokens.length ? h('div', h('h3', 'Предметы заданий'), q.tokens.map((t) => h('div', TOKEN_NAMES[t]))) : null,
      h('h3', 'История'),
      q.history.length ? h('div.r2-note', [...q.history].reverse().slice(0, 60).map((r) => h('div', `День ${r.day + 1}, ${formatClock(r.minutes)} — «${QUEST_BY_ID[r.quest].name}»: ${ev[r.event]}`))) : h('p.r2-note', 'Пока пусто.'),
      h('p.r2-note', 'Будущие задания заранее не показываются. Таймеров провала нет; побочное задание можно отменить и взять снова, награда выдаётся один раз.'),
      h('button.r2-btn.small', { onclick: () => this.s.menus.close('journal') }, 'Закрыть'),
    );
    this.show('journal', body);
  }

  // ------------------------------------------------------------------ map (M)
  /** Turned like the camera; discovered places, the hero, personal marks; no quest objectives. */
  map() {
    const st = this.s.story;
    const size = this.s.size;
    const px = 5;
    const W = size * px;
    const cv = document.createElement('canvas');
    cv.width = W;
    cv.height = W;
    cv.className = 'r2-map';
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
    const base = document.createElement('canvas');
    base.width = base.height = size;
    const bg = base.getContext('2d')!;
    for (let z = 0; z < size; z++)
      for (let x = 0; x < size; x++) {
        const y = this.s.ground(x + 0.5, z + 0.5);
        const k = Math.max(0, Math.min(1, (y - 1) / 12));
        bg.fillStyle = y < 2.2 ? '#3a6ab0' : `rgb(${Math.round(70 + 80 * k)},${Math.round(120 + 60 * k)},${Math.round(60 + 60 * k)})`;
        bg.fillRect(x, z, 1, 1);
      }
    g.imageSmoothingEnabled = false;
    g.save();
    g.translate(W / 2, W / 2);
    g.rotate(ang);
    g.translate(-W / 2, -W / 2);
    g.drawImage(base, 0, 0, W, W);
    g.restore();
    g.font = 'bold 12px Rubik, sans-serif';
    for (const p of POIS) {
      if (!st.pois.includes(p.id)) continue;
      const [sx, sy] = toScreen(p.x, p.z);
      g.fillStyle = '#f6dfa4';
      g.fillRect(sx - 4, sy - 4, 8, 8);
      g.fillStyle = '#000';
      g.fillText(p.name, sx + 7, sy + 4);
      g.fillStyle = '#fff';
      g.fillText(p.name, sx + 6, sy + 3);
    }
    for (const w of WAYSTONES) {
      if (!st.waystones.includes(w.id)) continue;
      const [sx, sy] = toScreen(w.x, w.z);
      g.fillStyle = '#7ad0ff';
      g.fillRect(sx - 3, sy - 6, 6, 12);
    }
    st.marks.forEach((m, i) => {
      const [sx, sy] = toScreen(m.x, m.z);
      g.fillStyle = '#e04040';
      g.fillRect(sx - 5, sy - 5, 10, 10);
      g.fillStyle = '#fff';
      g.fillText(m.label || String(i + 1), sx + 7, sy + 4);
    });
    const [ax, ay] = toScreen(hx, hz);
    g.fillStyle = '#ffe060';
    g.beginPath();
    g.moveTo(ax, ay - 8);
    g.lineTo(ax - 5, ay + 6);
    g.lineTo(ax + 5, ay + 6);
    g.closePath();
    g.fill();
    cv.onclick = (e) => {
      const r = cv.getBoundingClientRect();
      const sx = ((e.clientX - r.left) / r.width) * W;
      const sy = ((e.clientY - r.top) / r.height) * W;
      const [wx, wz] = toWorld(sx, sy);
      const near = st.marks.findIndex((m) => Math.hypot(m.x - wx, m.z - wz) < 2);
      if (near >= 0) st.marks.splice(near, 1);
      else if (st.marks.length < 50) st.marks.push({ x: wx, z: wz, label: `Метка ${st.marks.length + 1}` });
      this.map();
    };
    const body = h(
      'div',
      h('h1', 'Карта'),
      h('div.r2-sub', 'Верх карты — направление камеры. Щелчок ставит личную метку, щелчок по метке убирает её. Целей заданий на карте нет.'),
      h('div.r2-rule'),
      cv,
      st.marks.length ? h('div.r2-row', st.marks.map((m, i) => this.btn(`✕ ${m.label || i + 1}`, null, () => { st.marks.splice(i, 1); this.map(); }))) : null,
      h('button.r2-btn.small', { onclick: () => this.s.menus.close('map2') }, 'Закрыть'),
    );
    this.show('map2', body);
  }

  // ------------------------------------------------------------------ bestiary (B)
  bestiary() {
    const st = this.s.story;
    const known = BESTIARY.filter((b) => st.bestiary[b.id]);
    const body = h(
      'div',
      h('h1', 'Бестиарий'),
      h('div.r2-sub', `Открыто записей: ${known.length} из ${BESTIARY.length}. Встреча открывает имя и облик, засчитанное убийство — полную запись.`),
      h('div.r2-rule'),
      known.length
        ? known.map((b) => {
            const full = st.bestiary[b.id] === 2;
            const rank = RANKS[b.rank];
            return h(
              'div.r2-card',
              h('div.r2-card-h', pxIcon(/bandit|разбой/i.test(b.id + b.name) ? 'bandit' : /wolf|fang|волк|клык/i.test(b.id + b.name) ? 'wolf' : 'enemy', 52, 'r2-cico'), h('span', b.name), h('small', full ? `уровень ${b.level} · ${rank?.name ?? b.rank}` : 'встречен'), full ? pxIcon('check', 24) : pxIcon('eye', 24)),
              full
                ? h('div',
                    h('div.r2-note', `HP ${b.hp} · броня ${b.armor} · RES ${b.res} · урон ${b.damage} (${b.damageType}) раз в ${String(b.interval).replace('.', ',')} с · ${b.xp} XP`),
                    h('div.r2-note', `Поведение: ${b.behavior}. Где водится: ${b.habitat}.`),
                    h('div.r2-note', `Возрождение: ${rank?.respawn ?? '?'} мин активной игры; тело исчезает через ${rank?.corpse ?? '?'} мин.`),
                    h('div.r2-note', 'Добыча: ' + lootTable(b.id).map((l) => `${l.kind === 'gold' ? 'золото' : l.kind === 'gear' ? l.key : stackName(l.key)} ${l.min}–${l.max} (${l.chance}%)${l.tool ? ', нужен нож' : ''}${l.skill ? `, нужна охота ${l.skill.slice(-1)}` : ''}`).join('; ')),
                  )
                : h('p.r2-note', 'Подробности откроются после первой засчитанной победы.'),
            );
          })
        : h('p.r2-note', 'Пока никто не встречен.'),
      h('button.r2-btn.small', { onclick: () => this.s.menus.close('bestiary') }, 'Закрыть'),
    );
    this.show('bestiary', body);
  }

  // ------------------------------------------------------------------ bed, waystones
  /** D083: sleep until the next occurrence of the chosen hour; the wake moment is shown first. */
  bed() {
    const { day, minutes } = this.s.clock();
    const body = h(
      'div',
      h('h1', 'Сон'),
      h('div.r2-npc', pxIcon('bed', 96, 'r2-npcface'), h('div', h('h2', 'Кровать героя'), h('div.r2-sub', 'Сон бесплатный'))),
      h('div.r2-sub', `Сейчас: день ${day + 1}, ${formatClock(minutes)}`),
      h('div.r2-rule'),
      SLEEP_HOURS.map((hr) => {
        const w = wakeAt(day, minutes, hr);
        const b = this.btn(`Спать до ${String(hr).padStart(2, '0')}:00 — проснуться: день ${w.day + 1}, ${formatClock(w.minutes)}`, this.s.inCombat() ? 'Спать можно только вне боя' : null, () => {
          const r = this.s.sleep(hr);
          if (r) return this.s.toast(r);
          this.s.menus.close('bed');
        });
        b.classList.add('r2-ans');
        b.prepend(pxIcon(hr >= 21 || hr < 5 ? 'moon-night' : 'sun', 32));
        return b;
      }),
      h('p.r2-note', 'Сон полностью восстанавливает HP, MP и ST, завершает все перезарядки и снимает контроль. Таймеры возрождения, тел и автосохранения во сне не идут.'),
      h('button.r2-btn.small', { onclick: () => this.s.menus.close('bed') }, 'Отмена'),
    );
    this.show('bed', body);
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

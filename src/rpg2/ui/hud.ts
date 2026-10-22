import './rpg2.css';
import { h } from '../../ui/dom';
import { Minimap } from '../../ui/Minimap';
import type { World } from '../../rpg/World';
import type { HeroState } from '../hero';
import type { HeroMotor } from '../motor';
import type { ActiveTime } from '../time';
import { DODGE } from '../config';
import { codeName, type ControlBinds } from '../controls';

/**
 * HUD of the RPG test scene («Экраны и визуальный стиль»): HP / MP / ST, XP and level, combat
 * indicator and movement state (top left), the round minimap and the game time (top right), six
 * empty skill slots and the F1–F3 potion slots (bottom). Writes to the DOM only on change.
 */
export class SceneHud {
  readonly root: HTMLElement;
  readonly minimap = new Minimap();
  private name = h('span');
  private lvl = h('small');
  private bars: Record<'hp' | 'mp' | 'st' | 'xp', { el: HTMLElement; fill: HTMLElement; text: HTMLElement }>;
  private tags: Record<string, HTMLElement> = {};
  private time = h('div.r2-time.r2-panel');
  private dodgeBar = h('i.r2-dodge');
  private help = h('div.r2-help.r2-panel');
  private toastEl = h('div.r2-toast.r2-panel');
  private toastT = 0;
  private last: Record<string, string> = {};
  private skillKeys: HTMLElement[] = [];
  private potKeys: HTMLElement[] = [];

  constructor(parent: HTMLElement) {
    const bar = (cls: string, label: string) => {
      const fill = h('i');
      const text = h('em');
      return { el: h('div.r2-bar.' + cls, fill, label ? h('b', label) : null, text), fill, text };
    };
    const hp = bar('hp', 'HP');
    const mp = bar('mp', 'MP');
    const st = bar('st', 'ST');
    const xp = bar('xp', '');
    this.bars = { hp, mp, st, xp };
    const tag = (id: string, text: string) => (this.tags[id] = h('span.r2-tag', text));
    const skills = h('div.r2-slots.r2-panel');
    for (let i = 0; i < 6; i++) {
      const k = h('kbd', String(i + 1));
      this.skillKeys.push(k);
      skills.append(h('div.r2-slot', { title: 'Пустая ячейка умения' }, k));
    }
    const pots = h('div.r2-slots.r2-panel');
    const potColors = ['#d23a2a', '#3a6ad2', '#d2a82a'];
    const potNames = ['Зелье HP (пусто)', 'Зелье MP (пусто)', 'Зелье ST (пусто)'];
    for (let i = 0; i < 3; i++) {
      const k = h('kbd', 'F' + (i + 1));
      this.potKeys.push(k);
      pots.append(h('div.r2-slot.pot', { title: potNames[i], style: `--pc:${potColors[i]}` }, k));
    }
    this.root = h(
      'div.r2.r2-hud.hidden',
      h('div.r2-res.r2-panel', h('div.r2-name', this.name, this.lvl), hp.el, mp.el, st.el, xp.el, h('div.r2-state', tag('fight', 'Вне боя'), tag('move', 'Бег'), tag('sprint', 'Спринт'), tag('air', 'На земле'), tag('dodge', 'Уклонение'))),
      h('div.r2-tr', this.minimap.root, this.time),
      h('div.r2-bottom', skills, pots),
      this.help,
      h('div.r2-cross'),
      this.toastEl,
    );
    this.tags.dodge.append(this.dodgeBar);
    this.tags.dodge.title = 'Полоса — откат уклонения';
    parent.appendChild(this.root);
  }

  setVisible(v: boolean) {
    this.root.classList.toggle('hidden', !v);
    if (v) this.last = {};
  }

  /** Key hints follow the current bindings. */
  setBinds(b: ControlBinds) {
    for (let i = 0; i < 6; i++) this.skillKeys[i].textContent = codeName(b[`skill${i + 1}` as 'skill1'][0]);
    this.potKeys[0].textContent = codeName(b.potionHp[0]);
    this.potKeys[1].textContent = codeName(b.potionMp[0]);
    this.potKeys[2].textContent = codeName(b.potionSt[0]);
    const k = (a: keyof ControlBinds) => h('kbd', codeName(b[a][0]));
    this.help.replaceChildren(
      h('div', k('moveF'), k('moveL'), k('moveB'), k('moveR'), ' — движение, мышь — обзор, ', k('attack'), ' — атака'),
      h('div', k('jump'), ' — прыжок (ещё раз в воздухе), ', k('dodge'), ' — уклонение'),
      h('div', k('sprint'), ' — спринт, ', k('walkToggle'), ' — ходьба/бег'),
      h('div', k('inventory'), ' инвентарь · ', k('map'), ' карта · ', k('character'), ' персонаж · ', h('kbd', 'Esc'), ' пауза'),
    );
  }

  toast(text: string) {
    this.toastEl.textContent = text;
    this.toastEl.classList.add('show');
    this.toastT = 2.2;
  }

  private set(key: string, v: string, fn: () => void) {
    if (this.last[key] === v) return;
    this.last[key] = v;
    fn();
  }

  update(w: World, hero: HeroState, m: HeroMotor, time: ActiveTime, name: string, yaw: number, realDt: number) {
    this.set('name', name, () => (this.name.textContent = name));
    const lv = `Уровень ${hero.progress.level}`;
    this.set('lvl', lv, () => (this.lvl.textContent = lv));
    const res = (id: 'hp' | 'mp' | 'st', v: number, max: number) => {
      const s = `${Math.floor(v)} / ${max}`;
      const pct = max > 0 ? Math.max(0, Math.min(100, (v / max) * 100)) : 0;
      this.set(id, s + '|' + pct.toFixed(1), () => {
        this.bars[id].fill.style.width = `${pct}%`;
        this.bars[id].text.textContent = s;
      });
    };
    res('hp', hero.hp, hero.maxHp);
    res('mp', hero.mp, hero.maxMp);
    res('st', hero.st, hero.maxSt);
    // XP: the level table arrives in stage 3; the bar shows the stored value only
    const xs = `XP ${hero.progress.xp}`;
    this.set('xp', xs, () => {
      this.bars.xp.fill.style.width = '0%';
      this.bars.xp.el.title = xs;
    });
    const fight = hero.inCombat ? `В бою ${Math.ceil(hero.combatLeft)} с` : 'Вне боя';
    this.set('fight', fight, () => {
      this.tags.fight.textContent = fight;
      this.tags.fight.classList.toggle('fight', hero.inCombat);
    });
    const mv = m.mode === 'swim' ? 'Плавание' : m.walk ? 'Ходьба' : 'Бег';
    this.set('move', mv, () => (this.tags.move.textContent = mv));
    this.set('sprint', String(m.sprinting), () => this.tags.sprint.classList.toggle('on', m.sprinting));
    const air = m.mode === 'air' ? (m.airJumpReady ? 'В воздухе (есть прыжок)' : 'В воздухе') : m.mode === 'swim' ? 'В воде' : 'На земле';
    this.set('air', air, () => (this.tags.air.textContent = air));
    const dg = m.dodging ? (m.invulnerable ? 'Уклонение: неуязвим' : 'Уклонение') : m.stunned ? 'Оглушён' : 'Уклонение';
    this.set('dodge', dg + m.dodging + m.stunned, () => {
      this.tags.dodge.firstChild!.textContent = dg;
      this.tags.dodge.classList.toggle('on', m.dodging || m.stunned);
    });
    this.dodgeBar.style.width = `${Math.round((1 - m.dodgeCd / DODGE.cooldown) * 100)}%`;
    const tl = time.label;
    this.set('time', tl, () => (this.time.textContent = tl));
    this.minimap.yaw = yaw;
    this.minimap.draw(w);
    if (this.toastT > 0) {
      this.toastT -= realDt;
      if (this.toastT <= 0) this.toastEl.classList.remove('show');
    }
  }

  dispose() {
    this.root.remove();
  }
}

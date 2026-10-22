import '../../ui/theme.css';
import './rpg2.css';
import { pxIcon, pxIconUrl } from '../../ui/pixelIcons';
import { MAX_LEVEL, xpForLevel } from '../growth/levels';
import { h } from '../../ui/dom';
import { Minimap } from '../../ui/Minimap';
import type { World } from '../../rpg/World';
import type { HeroState } from '../hero';
import type { HeroMotor } from '../motor';
import type { ActiveTime } from '../time';
import { DODGE } from '../config';
import { codeName, type ControlBinds } from '../controls';
import { SKILL_BY_ID, SPELL_BY_ID, abilityName } from '../combat/data';
import { enemyDef } from '../combat/enemy';
import { FAMILY_NAME, type Aim, type CombatSystem } from '../combat/system';

/** Short slot caption: the first letters of the ability name. */
function shortName(id: string): string {
  const w = abilityName(id).split(' ');
  return w.length > 1 ? (w[0].slice(0, 3) + '.' + w[1].slice(0, 3)).toLowerCase() : w[0].slice(0, 6).toLowerCase();
}

/**
 * HUD of the RPG test scene, laid out as the owner's mockup hud-07: portrait, name, level and the
 * HP / MP / ST bars with combat and movement state (top left); the round minimap and the game time
 * with a sun or moon (top right); the weapon card with the swap key (bottom left); six skill slots
 * with pixel icons over the XP bar and the F1–F3 potions (bottom centre); short key hints (bottom
 * right). Writes to the DOM only on change.
 */
export class SceneHud {
  readonly root: HTMLElement;
  readonly minimap = new Minimap(184);
  private name = h('span');
  private lvl = h('small');
  private bars: Record<'hp' | 'mp' | 'st' | 'xp', { el: HTMLElement; fill: HTMLElement; text: HTMLElement }>;
  private tags: Record<string, HTMLElement> = {};
  private timeText = h('span');
  private timeIco = pxIcon('sun', 28);
  private time = h('div.r2-time.r2-panel', this.timeIco, this.timeText);
  private xpText = h('em');
  private weaponIco = pxIcon('sword', 44);
  private weaponName = h('b');
  private weaponKey = h('small');
  private dodgeBar = h('i.r2-dodge');
  private help = h('div.r2-help.r2-panel');
  private helpFull = h('div.r2-help-full');
  private toastEl = h('div.r2-toast.r2-panel');
  private toastT = 0;
  private last: Record<string, string> = {};
  private skillKeys: HTMLElement[] = [];
  private skillSlots: { el: HTMLElement; name: HTMLElement; ico: HTMLElement; cd: HTMLElement; cdText: HTMLElement }[] = [];
  private weaponEl = h('div.r2-weapon.r2-panel', this.weaponIco, h('div', this.weaponName, this.weaponKey));
  private chargeEl = h('div.r2-charge', h('i'));
  private targetEl = h('div.r2-target.r2-panel.hidden');
  /** Stage 4/5: counts and names of the potions chosen for F1–F3 (D199: no automatic size swap). */
  setPotions(list: { name: string; count: number; cd: number }[]) {
    list.forEach((p, i) => {
      const t = String(p.count);
      if (this.potCounts[i].textContent !== t) this.potCounts[i].textContent = t;
      const title = `${p.name}: ${p.count}${p.cd > 0 ? ` · откат ${Math.ceil(p.cd)} с` : ''}`;
      if (this.potSlots[i].title !== title) this.potSlots[i].title = title;
      this.potSlots[i].classList.toggle('empty', p.count === 0);
      this.potSlots[i].classList.toggle('cd', p.cd > 0);
    });
  }
  private potKeys: HTMLElement[] = [];
  private potSlots: HTMLElement[] = [];
  private potCounts: HTMLElement[] = [];

  constructor(parent: HTMLElement) {
    const bar = (cls: string, label: string) => {
      const fill = h('i');
      const text = h('em');
      const el = h('div.r2-bar.' + cls, fill);
      const row = label ? h('div.r2-resrow.rr-' + cls, pxIcon(cls, 24), h('div.r2-rescol', h('div.r2-reslab', h('b', label), text), el)) : el;
      return { el, row, fill, text };
    };
    const hp = bar('hp', 'HP');
    const mp = bar('mp', 'MP');
    const st = bar('st', 'ST');
    const xp = bar('xp', '');
    xp.el.append(h('b', 'XP'), this.xpText);
    this.bars = { hp, mp, st, xp };
    const tag = (id: string, text: string) => (this.tags[id] = h('span.r2-tag', text));
    const skills = h('div.r2-slots');
    for (let i = 0; i < 6; i++) {
      const k = h('kbd', String(i + 1));
      this.skillKeys.push(k);
      const name = h('span.r2-sname');
      const ico = h('i.r2-sico.px-ico');
      const cd = h('i.r2-cd');
      const cdText = h('b.r2-cdt');
      const el = h('div.r2-slot', { title: 'Пустая ячейка умения' }, ico, name, cd, cdText, k);
      this.skillSlots.push({ el, name, ico, cd, cdText });
      skills.append(el);
    }
    const pots = h('div.r2-slots.r2-panel');
    const potColors = ['#d23a2a', '#3a6ad2', '#d2a82a'];
    const potIcons = ['potion-hp', 'potion-mp', 'potion-st'];
    const potNames = ['Зелье HP (пусто)', 'Зелье MP (пусто)', 'Зелье ST (пусто)'];
    for (let i = 0; i < 3; i++) {
      const k = h('kbd', 'F' + (i + 1));
      this.potKeys.push(k);
      const n = h('span.r2-potn', '0');
      this.potCounts.push(n);
      const slot = h('div.r2-slot.pot', { title: potNames[i], style: `--pc:${potColors[i]}` }, pxIcon(potIcons[i], 40, 'r2-potico'), k, n);
      this.potSlots.push(slot);
      pots.append(slot);
    }
    this.root = h(
      'div.r2.r2-hud.hidden',
      h(
        'div.r2-res.r2-panel',
        h('div.r2-portrait', pxIcon('hero', 72)),
        h('div.r2-resmain', h('div.r2-name', this.name, this.lvl), hp.row, mp.row, st.row),
      ),
      h('div.r2-state', tag('fight', 'Вне боя'), tag('move', 'Бег'), tag('sprint', 'Спринт'), tag('air', 'На земле'), tag('dodge', 'Уклонение')),
      h('div.r2-tr', this.minimap.root, this.time),
      h('div.r2-bottom', h('div.r2-col', this.chargeEl, h('div.r2-skillbar.r2-panel', skills, xp.el)), pots),
      this.weaponEl,
      this.targetEl,
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
    const key = (a: keyof ControlBinds, label: string) => h('div', h('kbd', codeName(b[a][0])), ` — ${label}`);
    this.weaponKey.replaceChildren(h('kbd', codeName(b.weaponSwap[0])), ' — сменить оружие');
    this.help.replaceChildren(key('inventory', 'Инвентарь'), key('map', 'Карта'), h('div', h('kbd', 'Esc'), ' — Пауза'), this.helpFull);
    this.helpFull.replaceChildren(
      h('div', k('moveF'), k('moveL'), k('moveB'), k('moveR'), ' — движение, мышь — обзор, ', k('attack'), ' — атака'),
      h('div', k('jump'), ' — прыжок (ещё раз в воздухе), ', k('dodge'), ' — уклонение'),
      h('div', k('block'), ' — блок (меч) / прицел (лук) / заряд (посох), ', k('weaponSwap'), ' — смена оружия, ', k('skill1'), '–', k('skill6'), ' — умения'),
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
    // XP inside the current level (the level table of stage 3)
    const lvl = hero.progress.level;
    const x0 = xpForLevel(lvl);
    const x1 = lvl >= MAX_LEVEL ? x0 : xpForLevel(lvl + 1);
    const into = Math.max(0, hero.progress.xp - x0);
    const xs = lvl >= MAX_LEVEL ? `${hero.progress.xp}` : `${into} / ${x1 - x0}`;
    this.set('xp', xs, () => {
      this.bars.xp.fill.style.width = lvl >= MAX_LEVEL ? '100%' : `${Math.min(100, (into / Math.max(1, x1 - x0)) * 100)}%`;
      this.xpText.textContent = xs;
      this.bars.xp.el.title = `Опыт: ${hero.progress.xp}`;
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
    this.set('time', tl, () => {
      this.timeText.textContent = tl;
      const hh = Number((/(\d+):\d+$/.exec(tl) ?? ['', '12'])[1]);
      const night = hh < 5 || hh >= 21;
      this.timeIco.style.backgroundImage = `url(${pxIconUrl(night ? 'moon-night' : 'sun')})`;
    });
    this.minimap.yaw = yaw;
    this.minimap.draw(w);
    if (this.toastT > 0) {
      this.toastT -= realDt;
      if (this.toastT <= 0) this.toastEl.classList.remove('show');
    }
  }

  /** Stage 2: weapon, panel slots with cooldowns, the staff charge and the aimed target. */
  updateCombat(c: CombatSystem, aim: Aim) {
    const w = c.weapon;
    const mode = c.blocking ? ' · блок' : c.aiming ? ' · прицел' : c.charge !== null ? ' · заряд' : '';
    const ws = `${w.name}${mode}`;
    this.set('weapon', ws, () => {
      this.weaponName.textContent = ws;
      this.weaponEl.title = `${FAMILY_NAME[c.family]}: ${w.name}`;
      this.weaponIco.style.backgroundImage = `url(${pxIconUrl(c.family)})`;
    });
    const ch = c.charge === null ? -1 : Math.round(c.charge * 100);
    this.set('charge', String(ch), () => {
      this.chargeEl.classList.toggle('on', ch >= 0);
      (this.chargeEl.firstChild as HTMLElement).style.width = `${Math.max(0, ch)}%`;
      this.chargeEl.title = ch >= 0 ? `Заряд: ×${(1 + ch / 100).toFixed(2)}, ${(3 + (3 * ch) / 100).toFixed(1)} MP` : '';
    });
    const panel = c.panel;
    for (let i = 0; i < 6; i++) {
      const id = panel[i];
      const sl = this.skillSlots[i];
      const prob = c.slotProblem(id);
      const cd = id ? c.cooldown(id) : 0;
      const full = id ? (SKILL_BY_ID[id]?.cd ?? SPELL_BY_ID[id]?.cd ?? 1) : 1;
      const key = `${id}|${prob}|${cd > 0 ? cd.toFixed(1) : ''}`;
      this.set('slot' + i, key, () => {
        sl.name.textContent = id ? shortName(id) : '';
        sl.ico.style.backgroundImage = id ? `url(${pxIconUrl(id)})` : '';
        sl.el.classList.toggle('dim', !!id && !!prob);
        sl.el.classList.toggle('filled', !!id);
        const sk = id ? SKILL_BY_ID[id] : undefined;
        const sp = id ? SPELL_BY_ID[id] : undefined;
        sl.el.title = !id ? 'Пустая ячейка умения' : `${abilityName(id)} — ${sk ? `${sk.st} ST` : `${sp!.mp} MP`}, откат ${sk?.cd ?? sp!.cd} с${prob ? ` (${prob.toLowerCase()})` : ''}`;
        sl.cd.style.height = cd > 0 ? `${Math.min(100, (cd / full) * 100)}%` : '0';
        sl.cdText.textContent = cd > 0 ? (cd >= 10 ? String(Math.ceil(cd)) : cd.toFixed(1).replace('.', ',')) + ' с' : '';
      });
    }
    const t = c.target(aim.target);
    const tk = t ? `${t.uid}|${t.enemy ? Math.ceil(t.enemy.hp) : ''}` : '';
    this.set('target', tk, () => {
      this.targetEl.classList.toggle('hidden', !t);
      if (!t) return;
      if (t.enemy) {
        const d = enemyDef(t.enemy);
        const pct = Math.max(0, (t.enemy.hp / d.hp) * 100);
        this.targetEl.replaceChildren(
          h('div.r2-tname', pxIcon(d.model === 'human' ? 'bandit' : 'wolf', 28), `${d.name}`, h('small', ` ур. ${d.level}${d.rank === 'mini' ? ' · мини-босс' : ''}`)),
          h('div.r2-bar.hp', h('i', { style: `width:${pct}%` }), h('em', `${Math.ceil(t.enemy.hp)} / ${d.hp}`)),
        );
      } else this.targetEl.replaceChildren(h('div.r2-tname', pxIcon('dummy', 28), t.name, h('small', ' учебная цель')));
    });
  }

  dispose() {
    this.root.remove();
  }
}

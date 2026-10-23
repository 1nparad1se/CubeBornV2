import * as THREE from 'three';
import { h, clear } from './dom';
import { HumanModel } from '../render/human/HumanModel';
import { itemIcon } from './itemIcons';
import { SLOT_NAME, item, type ItemDef, type Slot } from '../rpg/items';
import { computeStats, equipFromBag, equipToSlot, moveInBag, unequip, type EquipResult, type Gear } from '../rpg/equipment';
import { RACE_BY_ID } from '../rpg/races';
import { weaponType } from '../rpg/weapons';

const pct = (v: number) => `${v > 0 ? '+' : ''}${Math.round(v * 100)}%`;

/** Stat lines of an item for its tooltip. */
function itemLines(def: ItemDef): string[] {
  const out: string[] = [];
  const w = def.weapon;
  if (w) {
    const type = weaponType(w.kind);
    if (type) out.push(`Атака: ${type.attackLabel}`);
    out.push(`${w.dmgType === 'magic' ? 'Магический' : 'Физический'} урон: ${w.damage}`);
    out.push(`Скорость: удар раз в ${w.interval.toFixed(2)} с (${(1 / w.interval).toFixed(2)}/с)`);
    out.push(`Урон в секунду: ${(w.damage / w.interval).toFixed(1)}`);
    out.push(w.shape === 'projectile' ? `Дальность выстрела: ${w.range}` : `Досягаемость: ${w.range}`);
    if (w.shape === 'sweep') out.push(`Бьёт все цели в полосе шириной ${(w.halfWidth ?? 0.9) * 2}`);
    out.push(def.twoHanded ? 'Двуручное — занимает обе руки' : 'Одноручное — можно взять щит');
  }
  const s = def.stats;
  if (s.physDef) out.push(`Физическая защита: +${s.physDef}`);
  if (s.magicDmg) out.push(`Магический урон: ${pct(s.magicDmg)}`);
  if (s.castSpeed) out.push(`Скорость заклинаний: ${pct(s.castSpeed)}`);
  if (s.atkSpeed) out.push(`Скорость физических атак: ${pct(s.atkSpeed)}`);
  if (s.moveSpeed) out.push(`Скорость передвижения: ${pct(s.moveSpeed)}`);
  return out;
}

type Tab = 'all' | 'weapon' | 'armor' | 'off';
const TABS: { id: Tab; name: string }[] = [
  { id: 'all', name: 'Все' },
  { id: 'weapon', name: 'Оружие' },
  { id: 'armor', name: 'Броня' },
  { id: 'off', name: 'Щиты' },
];
const tabOf = (d: ItemDef): Tab => (d.weapon ? 'weapon' : d.slot === 'off' ? 'off' : 'armor');
/** Slots around the hero preview: left column, right column. */
const LEFT: Slot[] = ['head', 'body', 'hands'];
const RIGHT: Slot[] = ['main', 'off', 'feet'];

/** Compare lines: the selected item against what is worn in its slot. */
function compareLines(def: ItemDef, worn: ItemDef | null): { t: string; d: number }[] {
  if (!worn || worn.id === def.id) return [];
  const out: { t: string; d: number }[] = [];
  const add = (t: string, a: number, b: number, fmt: (v: number) => string) => {
    if (Math.abs(a - b) > 1e-6) out.push({ t: `${t}: ${a > b ? '+' : '−'}${fmt(Math.abs(a - b))}`, d: a - b });
  };
  if (def.weapon && worn.weapon) {
    add('Урон в секунду', def.weapon.damage / def.weapon.interval, worn.weapon.damage / worn.weapon.interval, (v) => v.toFixed(1));
    add('Урон за удар', def.weapon.damage, worn.weapon.damage, (v) => v.toFixed(0));
    add('Дальность', def.weapon.range, worn.weapon.range, (v) => v.toFixed(1));
  }
  const a = def.stats, b = worn.stats;
  add('Физическая защита', a.physDef ?? 0, b.physDef ?? 0, (v) => v.toFixed(0));
  add('Магический урон', a.magicDmg ?? 0, b.magicDmg ?? 0, (v) => Math.round(v * 100) + '%');
  add('Скорость заклинаний', a.castSpeed ?? 0, b.castSpeed ?? 0, (v) => Math.round(v * 100) + '%');
  add('Скорость атаки', a.atkSpeed ?? 0, b.atkSpeed ?? 0, (v) => Math.round(v * 100) + '%');
  add('Скорость передвижения', a.moveSpeed ?? 0, b.moveSpeed ?? 0, (v) => Math.round(v * 100) + '%');
  return out;
}

/** A small live 3D view of the hero in the current gear (drag to turn). */
class HeroPreview {
  readonly canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer | null = null;
  private scene = new THREE.Scene();
  private cam = new THREE.PerspectiveCamera(26, 0.7, 0.1, 20);
  private hero: HumanModel | null = null;
  private yaw = 0.45;
  private raf = 0;
  private t0 = performance.now();

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'inv-hero-cv';
    this.scene.add(new THREE.HemisphereLight(0xfff0dc, 0x3a3028, 1.5));
    const key = new THREE.DirectionalLight(0xfff2e0, 2.4);
    key.position.set(2, 3, 3);
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0xe8b45a, 1.2);
    rim.position.set(-3, 2, -2);
    this.scene.add(rim);
    this.cam.position.set(0, 1.05, 5.2);
    this.cam.lookAt(0, 0.92, 0);
    let drag: number | null = null;
    this.canvas.addEventListener('pointerdown', (e) => {
      drag = e.clientX;
      this.canvas.setPointerCapture(e.pointerId);
    });
    this.canvas.addEventListener('pointermove', (e) => {
      if (drag === null) return;
      this.yaw += (e.clientX - drag) * 0.012;
      drag = e.clientX;
    });
    this.canvas.addEventListener('pointerup', () => (drag = null));
  }

  show(equip: Record<Slot, string | null>) {
    try {
      if (!this.renderer) {
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
        this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.setClearColor(0x000000, 0);
      }
      if (!this.hero) {
        this.hero = new HumanModel('human', false);
        this.scene.add(this.hero.root);
      }
    } catch {
      return;
    }
    this.hero.setEquip(equip);
    if (!this.raf) this.loop();
  }

  stop() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop);
    const r = this.renderer;
    const hero = this.hero;
    if (!r || !hero) return;
    const w = this.canvas.clientWidth, hh = this.canvas.clientHeight;
    if (!w || !hh) return;
    if (this.canvas.width !== Math.round(w * r.getPixelRatio())) r.setSize(w, hh, false);
    this.cam.aspect = w / hh;
    this.cam.updateProjectionMatrix();
    const time = (performance.now() - this.t0) / 1000;
    hero.root.rotation.y = this.yaw;
    hero.pose({ walk: 0, moving: 0, airborne: false, vy: 0, attack: null, time });
    r.render(this.scene, this.cam);
  };
}

/**
 * Inventory and equipment window (Tab or I), in the dark-gold frame of the menus. Left: the hero
 * in his gear with the six equipment slots around him and the main stats. Right: the bag as an
 * item grid with category tabs, the gold purse, and a detail card of the selected item with its
 * stats, a comparison with what is worn and buttons. Click selects, double click (or the button)
 * puts on / takes off; items can also be dragged between the bag and the slots. Every change
 * goes through the equipment rules (rpg/equipment).
 */
export class Inventory {
  readonly root: HTMLElement;
  private slotsL = h('div.inv-slotcol');
  private slotsR = h('div.inv-slotcol');
  private preview = new HeroPreview();
  private bag = h('div.inv-bag');
  private tabs = h('div.inv-tabs');
  private stats = h('div.inv-stats');
  private card = h('div.inv-card');
  private count = h('span.inv-count');
  private msg = h('div.inv-msg');
  private tip = h('div.inv-tip.hidden');
  private gear: Gear | null = null;
  private race = 'human';
  private name = '';
  private tab: Tab = 'all';
  /** Selected item: a bag index or an equipment slot. */
  private sel: { bag: number } | { slot: Slot } | null = null;
  onChange: ((g: Gear) => void) | null = null;
  onSfx: ((id: string) => void) | null = null;
  onClose: (() => void) | null = null;

  constructor(parent: HTMLElement) {
    this.root = h(
      'div.inv.hidden',
      h(
        'div.inv-win',
        h('div.inv-head', h('h2', 'Инвентарь'), h('button.inv-x', { title: 'Закрыть (Tab / I / Esc)', onclick: () => this.onClose?.() }, '×')),
        h(
          'div.inv-body',
          h(
            'section.inv-left',
            h('h3', 'Снаряжение'),
            h('div.inv-doll', this.slotsL, h('div.inv-hero', this.preview.canvas, h('span.inv-hero-hint', 'потяните, чтобы повернуть')), this.slotsR),
            this.stats,
          ),
          h(
            'section.inv-right',
            h('div.inv-bar', this.tabs, h('div.inv-gold', h('i.inv-coin'), h('b', '0'), h('span', 'золота'))),
            this.bag,
            h('div.inv-foot', this.count, h('span.inv-help', 'Щелчок — выбрать, двойной щелчок — надеть / снять, можно перетаскивать')),
            this.msg,
            this.card,
          ),
        ),
      ),
      this.tip,
    );
    parent.appendChild(this.root);
  }

  get isOpen(): boolean {
    return !this.root.classList.contains('hidden');
  }

  open(gear: Gear, race: string, name: string) {
    this.gear = gear;
    this.race = race;
    this.name = name;
    this.msg.textContent = '';
    this.root.classList.remove('hidden');
    this.render();
  }

  close() {
    this.root.classList.add('hidden');
    this.tip.classList.add('hidden');
    this.preview.stop();
  }

  /** Applies a rule result: new gear on success, the reason on failure. */
  private apply(r: EquipResult) {
    if (!r.ok) {
      this.msg.textContent = r.error;
      this.onSfx?.('denied');
      return;
    }
    this.gear = r.gear;
    this.msg.textContent = '';
    this.sel = null;
    this.onSfx?.('select');
    this.onChange?.(r.gear);
    this.render();
  }

  private showTip(def: ItemDef, el: HTMLElement) {
    clear(this.tip);
    this.tip.append(h('b', def.name), h('div.inv-tip-type', typeLine(def)), ...itemLines(def).map((l) => h('div', l)));
    this.tip.classList.remove('hidden');
    const r = el.getBoundingClientRect();
    const host = this.root.getBoundingClientRect();
    const left = r.right - host.left + 10;
    const tw = this.tip.offsetWidth;
    this.tip.style.left = `${Math.round(left + tw > host.width - 8 ? r.left - host.left - tw - 10 : left)}px`;
    this.tip.style.top = `${Math.round(Math.min(r.top - host.top, host.height - this.tip.offsetHeight - 8))}px`;
  }

  private cell(id: string | null, cls: string, label: string, data: Record<string, string>, selected: boolean, onClick: () => void, onUse: () => void): HTMLElement {
    const def = item(id);
    const el = h('div.inv-cell' + cls + (def ? '.full.r-' + rarity(def) : '') + (selected ? '.sel' : ''), { ...data, title: '' }, def ? itemIcon(def.id, 3, 44) : h('span.inv-ph', label));
    el.addEventListener('click', onClick);
    el.addEventListener('dblclick', onUse);
    if (def) {
      el.draggable = true;
      el.addEventListener('dragstart', (e) => {
        e.dataTransfer?.setData('text/plain', JSON.stringify(data));
        this.tip.classList.add('hidden');
      });
      el.addEventListener('mouseenter', () => this.showTip(def, el));
      el.addEventListener('mouseleave', () => this.tip.classList.add('hidden'));
    }
    el.addEventListener('dragover', (e) => e.preventDefault());
    el.addEventListener('drop', (e) => {
      e.preventDefault();
      const raw = e.dataTransfer?.getData('text/plain');
      if (!raw) return;
      this.drop(JSON.parse(raw), data);
    });
    return el;
  }

  private drop(from: Record<string, string>, to: Record<string, string>) {
    const g = this.gear!;
    if (from['data-bag'] !== undefined && to['data-slot'] !== undefined) this.apply(equipToSlot(g, +from['data-bag'], to['data-slot'] as Slot));
    else if (from['data-bag'] !== undefined && to['data-bag'] !== undefined) this.apply({ ok: true, gear: moveInBag(g, +from['data-bag'], +to['data-bag']) });
    else if (from['data-slot'] !== undefined && to['data-bag'] !== undefined) this.apply(unequip(g, from['data-slot'] as Slot, +to['data-bag']));
  }

  private select(s: { bag: number } | { slot: Slot } | null) {
    this.sel = s;
    this.onSfx?.('select');
    this.render();
  }

  render() {
    const g = this.gear;
    if (!g) return;
    const isSel = (k: 'bag' | 'slot', v: number | Slot) => !!this.sel && (this.sel as any)[k] === v;
    for (const [col, list] of [[this.slotsL, LEFT], [this.slotsR, RIGHT]] as [HTMLElement, Slot[]][]) {
      clear(col);
      for (const s of list) {
        const id = g.equip[s];
        const twoH = s === 'off' && !!item(g.equip.main)?.twoHanded;
        const c = this.cell(id, '.slot.s-' + s + (twoH ? '.blocked' : ''), twoH ? '2H' : '', { 'data-slot': s }, isSel('slot', s), () => id && this.select({ slot: s }), () => id && this.apply(unequip(g, s)));
        col.append(h('div.inv-slot', c, h('label', SLOT_NAME[s])));
      }
    }
    this.preview.show(g.equip);
    clear(this.tabs);
    for (const t of TABS) {
      const n = g.bag.filter((id) => item(id) && (t.id === 'all' || tabOf(item(id)!) === t.id)).length;
      this.tabs.append(h('button.inv-tab' + (t.id === this.tab ? '.on' : ''), { onclick: () => { this.tab = t.id; this.render(); } }, t.name, h('small', String(n))));
    }
    clear(this.bag);
    const shown = g.bag.map((id, i) => ({ id, i })).filter(({ id }) => this.tab === 'all' || (item(id) && tabOf(item(id)!) === this.tab));
    // keep the grid full: pad a filtered view with the bag's empty cells
    const empties = g.bag.map((id, i) => ({ id, i })).filter(({ id }) => !id);
    const cells = this.tab === 'all' ? shown : [...shown, ...empties].slice(0, Math.max(shown.length, 24));
    for (const { id, i } of cells)
      this.bag.append(this.cell(id, '', '', { 'data-bag': String(i) }, isSel('bag', i), () => id && this.select({ bag: i }), () => id && this.apply(equipFromBag(g, i))));
    this.count.textContent = `Сумка: ${g.bag.filter(Boolean).length} / ${g.bag.length}`;
    this.renderCard();
    this.renderStats();
  }

  /** The detail card of the selected item: stats, comparison, buttons. */
  private renderCard() {
    const g = this.gear!;
    clear(this.card);
    const s = this.sel;
    const id = s ? ('bag' in s ? g.bag[s.bag] : g.equip[s.slot]) : null;
    const def = item(id);
    if (!s || !def) {
      this.card.append(h('div.inv-card-empty', 'Выберите предмет, чтобы увидеть его свойства'));
      return;
    }
    const worn = 'bag' in s ? item(g.equip[def.slot]) : null;
    const cmp = compareLines(def, worn);
    const btns = h('div.inv-card-btns');
    if ('bag' in s) {
      btns.append(h('button.inv-btn.main', { onclick: () => this.apply(equipFromBag(g, s.bag)) }, 'Надеть'));
    } else {
      btns.append(h('button.inv-btn.main', { onclick: () => this.apply(unequip(g, s.slot)) }, 'Снять'));
    }
    btns.append(h('button.inv-btn', { onclick: () => this.select(null) }, 'Закрыть'));
    this.card.append(
      h('div.inv-card-top', h('div.inv-card-icon.r-' + rarity(def), itemIcon(def.id, 4, 64)), h('div', h('b.inv-card-name', def.name), h('div.inv-card-type', typeLine(def)), h('div.inv-card-slot', `Слот: ${SLOT_NAME[def.slot]}${'slot' in s ? ' · надето' : ''}`))),
      h('div.inv-card-lines', ...itemLines(def).map((l) => h('div', l))),
      cmp.length ? h('div.inv-card-cmp', h('div.inv-card-cmp-h', `Сравнение с «${worn!.name}»`), ...cmp.map((c) => h('div' + (c.d > 0 ? '.up' : '.down'), c.t))) : worn ? '' : 'bag' in s ? h('div.inv-card-cmp', h('div.inv-card-cmp-h', 'Слот сейчас пуст')) : '',
      h('p.inv-card-desc', def.desc),
      btns,
    );
  }

  private renderStats() {
    const st = computeStats(this.race, this.gear!);
    const row = (k: string, v: string) => h('div.inv-stat', h('span', k), h('b', v));
    clear(this.stats);
    this.stats.append(
      h('div.inv-who', h('b', this.name), h('span', `${RACE_BY_ID[this.race]?.name ?? ''} · Уровень 1`)),
      h(
        'div.inv-stat-grid',
        row('Здоровье', String(st.maxHp)),
        row('Защита', `${st.physDef} (−${Math.round(st.physReduce * 100)}%)`),
        row('Оружие', st.weaponName),
        row('Урон за удар', `${st.hitDamage.toFixed(1)} ${st.weapon?.dmgType === 'magic' ? 'маг.' : 'физ.'}`),
        row('Атак в секунду', st.attacksPerSec.toFixed(2)),
        row('Урон в секунду', st.dps.toFixed(1)),
        row('Дальность', String(st.range)),
        row('Магический урон', pct(st.magicDmg)),
        row('Скорость заклинаний', pct(st.castSpeed)),
        row('Скорость атаки', pct(st.atkSpeed)),
        row('Передвижение', `${st.moveSpeed.toFixed(2)} бл/с (${pct(st.moveBonus)})`),
      ),
    );
  }
}

function typeLine(def: ItemDef): string {
  return def.armorClass ? `${def.type} · ${def.armorClass.toLowerCase()} броня` : def.type;
}
/** Frame colour of an item cell: weapons gold, armour by weight class, shields steel. */
function rarity(def: ItemDef): string {
  if (def.weapon) return 'w';
  if (def.slot === 'off') return 's';
  return def.armorClass === 'Магическая' ? 'm' : def.armorClass === 'Тяжёлая' ? 'h' : 'l';
}

import { addXp } from '../growth/levels';
import type { HeroState } from '../hero';
import type { HeroMotor, MotorGround } from '../motor';
import { applyKnock, applySlow, applyStun } from './control';
import {
  ENEMY_BY_ID, NORMAL, SKILL_BY_ID, SPELL_BY_ID, WEAPON_BY_ID, abilityName, isBoss,
  type SkillDef, type SpellDef, type WeaponDef, type WeaponFamily,
} from './data';
import {
  ENEMY_HEIGHT, ENEMY_RADIUS, aggro, enemyDef, killEnemy, newEnemy, onDamaged, separate, updateEnemy,
  type EnemyCtx, type EnemyState,
} from './enemy';
import type { CombatBonuses } from '../growth/growth';
import {
  BLOCK, Rng, combatAward, critParams, hitDamage, inFront, killXp, masteryOf, participationEnough, statMul, trainingAward,
} from './formulas';

/**
 * Hero combat of the test scene (stage 2): normal attacks with their costs (D008–D011), the sword
 * block (D161–D166), bow aim (D195), the 12 weapon skills and 15 spells (payment and cooldown at
 * the start of the preparation, D194), projectiles, zones and chain lightning («Магические
 * попадания и зоны»), the damage pipeline (D004–D007, D158, D160), control (D017–D020, D195),
 * mastery (D029–D034, D198), kill participation and XP (D035–D039), and the two enemies.
 * Everything that must survive a save lives in `data` (plain JSON).
 */
export type Profile = 'start' | 'test';

export interface ActionRec {
  id: number;
  family: WeaponFamily;
  /** Fixed at launch (D194 / D198). */
  heroLevel: number;
  stat: number;
  base: number;
  critChance: number;
  critMult: number;
  /** One mastery credit per source action (D030 / D198). */
  credited: boolean;
  /** Hits per target uid (b5: at most 2 per target). */
  perTarget: Record<string, number>;
  /** Stage 3: frozen bonus multiplier (talents, affixes, modifications) and the legendary effect of a normal attack. */
  mul: number;
  legend: string | null;
  normal: boolean;
}

/** Stage 3 link to the inventory: the quick list holds item ids, the weapon is the equipped item. */
export interface GearLink {
  weaponTpl(): string;
  itemTpl(uid: string): string | undefined;
  equipWeapon(uid: string): string | null;
  bonuses(): CombatBonuses;
}

const NEUTRAL: CombatBonuses = {
  physDmg: 1, magicDmg: 1, physCrit: 0, physCritPow: 0, magicCrit: 0, magicCritPow: 0, skillSt: 1, skillCd: 1, spellMp: 1, spellCd: 1,
  atkSpeed: 1, blockReduce: 0.5, baseMul: 1, legendary: null, ability: () => ({ dmg: 1, cost: 1, cd: 1 }),
};

export interface ActionState {
  rec: number;
  kind: 'normal' | 'skill' | 'spell';
  ability: string | null;
  wid: string;
  t: number;
  dur: number;
  /** Release moment (end of the preparation, or the hit moment of a swing). */
  hitAt: number;
  /** True while the preparation runs (70 % speed, D194). */
  prep: boolean;
  fired: number;
  dirX: number;
  dirZ: number;
  aimX: number;
  aimZ: number;
  target: string | null;
  /** Charged staff shot: damage factor 1 + t (D010). */
  charge: number;
}

export interface ProjState {
  rec: number;
  kind: 'arrow' | 'bolt' | 'spell';
  ability: string | null;
  school: string | null;
  x: number;
  y: number;
  z: number;
  dx: number;
  dy: number;
  dz: number;
  speed: number;
  left: number;
  /** Coefficient of each successive hit (pierce: several; a normal shot: one). */
  coefs: number[];
  /** Spell hit base (magic) instead of the weapon base. */
  spellBase: number;
  magic: boolean;
  hitIds: string[];
  explode: number;
  maxPerTarget: number;
  dead: boolean;
}

export interface ZoneState {
  rec: number;
  ability: string;
  x: number;
  y: number;
  z: number;
  radius: number;
  t: number;
  next: number;
  /** Pause after the last pulse for the visual. */
  end: number;
}

export interface CombatData {
  profile: Profile;
  quick: (string | null)[];
  cur: number;
  learned: string[];
  panels: Record<WeaponFamily, (string | null)[]>;
  cds: Record<string, number>;
  /** Accumulated ОМ per family (mastery follows from it, D033). */
  om: Record<WeaponFamily, number>;
  normalCd: number;
  rng: number;
  nextId: number;
  action: ActionState | null;
  actions: ActionRec[];
  projectiles: ProjState[];
  zones: ZoneState[];
  enemies: EnemyState[];
  kills: number;
  blockNeedsRelease: boolean;
}

/** Armor of the approved start: light armor I (D099). */
export const START_ARMOR = 17;

export function newCombatData(profile: Profile = 'start'): CombatData {
  const d: CombatData = {
    profile,
    quick: ['sword1', null, null, null],
    cur: 0,
    learned: [],
    panels: { sword: [null, null, null, null, null, null], bow: [null, null, null, null, null, null], staff: [null, null, null, null, null, null] },
    cds: {},
    om: { sword: 0, bow: 0, staff: 0 },
    normalCd: 0,
    rng: 0x2545f491,
    nextId: 1,
    action: null,
    actions: [],
    projectiles: [],
    zones: [],
    enemies: [],
    kills: 0,
    blockNeedsRelease: false,
  };
  if (profile === 'test') applyTestProfile(d);
  return d;
}

/** Dev «Тестовый профиль»: four weapons, every skill and spell learned, filled panels. */
export function applyTestProfile(d: CombatData) {
  d.profile = 'test';
  d.quick = ['sword1', 'greatsword1', 'bow1', 'staff1'];
  d.cur = 0;
  d.learned = [...Object.keys(SKILL_BY_ID), ...Object.keys(SPELL_BY_ID)];
  d.panels = {
    sword: ['s1', 's2', 's3', 's4', 's5', 's6'],
    bow: ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'],
    staff: ['f1', 'f2', 'i1', 'i4', 'l2', 'l3'],
  };
}

/** Enemies of the test arena (homes next to the flattened arena pad). */
export function arenaEnemies(g: MotorGround): EnemyState[] {
  return [
    newEnemy('wolf1', 'wolf', 30, 64, g.top(30, 64)),
    newEnemy('wolf2', 'wolf', 33.5, 66.5, g.top(33.5, 66.5)),
    newEnemy('greyfang1', 'greyfang', 30, 49, g.top(30, 49), 8),
    // stage 5: four bandits of the old crossing («Разбойники у переправы»)
    newEnemy('bandit1', 'bandit', 24, 55, g.top(24, 55)),
    newEnemy('bandit2', 'bandit', 26, 56.5, g.top(26, 56.5)),
    newEnemy('bandit3', 'bandit', 23.5, 58.5, g.top(23.5, 58.5)),
    newEnemy('bandit4', 'bandit', 26, 59.5, g.top(26, 59.5)),
  ];
}

export interface DummyRef {
  id: string;
  name: string;
  x: number;
  z: number;
  radius: number;
  height: number;
}

export interface Target {
  uid: string;
  name: string;
  x: number;
  y: number;
  z: number;
  radius: number;
  height: number;
  dummy: DummyRef | null;
  enemy: EnemyState | null;
}

export interface CombatFx {
  number(x: number, z: number, v: number, crit: boolean, color: number): void;
  burst(x: number, y: number, z: number, color: number, n: number): void;
  sound(id: string, vol: number): void;
  toast(text: string): void;
  dummyHit(id: string, v: number, magic: boolean, fromX: number, fromZ: number): void;
}

export interface CombatInput {
  attackHeld: boolean;
  rmbHeld: boolean;
  rmbPressed: boolean;
  skill: number | null;
  swap: boolean;
}
export const NO_COMBAT_INPUT: CombatInput = { attackHeld: false, rmbHeld: false, rmbPressed: false, skill: null, swap: false };

/** Aim from the camera: the point under the crosshair and the target it points at. */
export interface Aim {
  x: number;
  z: number;
  target: string | null;
}

export interface HitLog {
  rec: number;
  ability: string | null;
  target: string;
  damage: number;
  crit: boolean;
  blocked?: boolean;
}

const SWING = { dur: 0.3, hit: 0.15 };
const ENEMY_IDS = new Set(Object.keys(ENEMY_BY_ID));
const MELEE_SLACK = 0.1;
const ZONE_HEIGHT = 1;

const SCHOOL_COLOR: Record<string, number> = { fire: 0xff7a2a, ice: 0x7ac8ff, lightning: 0xf0e060 };

export class CombatSystem {
  data: CombatData;
  rng: Rng;
  /** Set while RMB was pressed on a staff (charge time, s). Not saved: a menu cancels it (D208). */
  charge: number | null = null;
  blocking = false;
  aiming = false;
  /** Last hits (tests and the dev panel). */
  log: HitLog[] = [];
  /** Counters for checks. */
  counters = { attacks: 0, skills: 0, spells: 0, refused: 0, blocks: 0, kills: 0, heroHits: 0 };
  /** Chain lightning links of the last cast (renderer). */
  lastChain: { pts: [number, number, number][]; t: number } | null = null;
  heroArmor = START_ARMOR;
  private msgCd = 0;
  canRespawn: (e: EnemyState) => boolean = () => false;
  /** Stage 3: inventory link (null in the stage 2 tests: the quick list then holds template ids). */
  gear: GearLink | null = null;
  get bonus(): CombatBonuses {
    return this.gear?.bonuses() ?? NEUTRAL;
  }

  constructor(
    private ground: MotorGround,
    private hero: HeroState,
    private motor: HeroMotor,
    private dummies: () => DummyRef[],
    public fx: CombatFx,
    data?: CombatData,
  ) {
    this.data = data ?? newCombatData('start');
    this.rng = new Rng(this.data.rng);
    this.syncMastery();
  }

  // ------------------------------------------------------------------ weapon and panels
  get weapon(): WeaponDef {
    if (this.gear) return WEAPON_BY_ID[this.gear.weaponTpl()] ?? WEAPON_BY_ID.sword1;
    const id = this.data.quick[this.data.cur] ?? this.data.quick.find((q) => q) ?? 'sword1';
    return WEAPON_BY_ID[id] ?? WEAPON_BY_ID.sword1;
  }
  get family(): WeaponFamily {
    return this.weapon.family;
  }
  get panel(): (string | null)[] {
    return this.data.panels[this.family];
  }

  /** D207: does the hero meet the weapon's requirement (equipment rules come in stage 3)? */
  meetsReq(w: WeaponDef): boolean {
    return this.hero.stats[w.attr] >= w.req;
  }

  /** D207: Tab cycles the quick list, skipping empty slots and weapons whose requirement is not met. */
  swapWeapon(): boolean {
    const q = this.data.quick;
    for (let i = 1; i <= q.length; i++) {
      const k = (this.data.cur + i) % q.length;
      const id = q[k];
      if (!id || k === this.data.cur) continue;
      const w = WEAPON_BY_ID[this.gear ? this.gear.itemTpl(id) ?? '' : id];
      if (!w || !this.meetsReq(w)) continue;
      if (this.gear && this.gear.equipWeapon(id)) continue;
      this.data.cur = k;
      // D011 / D194: switching cancels the unfinished action and the charge; projectiles and zones stay
      this.cancelAction();
      this.charge = null;
      this.blocking = false;
      this.aiming = false;
      return true;
    }
    return false;
  }

  /** Puts a weapon in the quick list (`null` clears); the current index stays on a filled slot. */
  setQuick(i: number, id: string | null) {
    this.data.quick[i] = id;
    if (!this.data.quick[this.data.cur]) {
      const k = this.data.quick.findIndex((q) => q);
      this.data.cur = k < 0 ? 0 : k;
      if (k < 0) this.data.quick[0] = 'sword1';
    }
  }

  /** Why a panel entry cannot be used now (or null). */
  slotProblem(id: string | null): string | null {
    if (!id) return 'Пустая ячейка';
    if (!this.data.learned.includes(id)) return 'Не изучено';
    const sk = SKILL_BY_ID[id];
    const sp = SPELL_BY_ID[id];
    if (sk && sk.family !== this.family) return sk.family === 'sword' ? 'Нужен меч' : 'Нужен лук';
    if (sp && this.family !== 'staff') return 'Нужен посох';
    return null;
  }

  cooldown(id: string): number {
    return this.data.cds[id] ?? 0;
  }

  // ------------------------------------------------------------------ movement limits
  /** D166 / D194 / D195: speed factor and sprint permission for the motor this tick. */
  moveLimits(): { mul: number; noSprint: boolean } {
    if (this.blocking) return { mul: 0.5, noSprint: true };
    const a = this.data.action;
    if (a && a.prep) return { mul: 0.7, noSprint: true };
    if (this.aiming) return { mul: 0.7, noSprint: true };
    return { mul: 1, noSprint: false };
  }

  // ------------------------------------------------------------------ cancels
  cancelAction() {
    this.data.action = null;
  }
  /** D166 / D194 / D011: a jump ends block, preparation and the (unpaid) charge. */
  onJump() {
    this.cancelAction();
    this.charge = null;
    if (this.blocking) this.data.blockNeedsRelease = true;
    this.blocking = false;
  }
  onDodge() {
    this.onJump();
  }
  onStun() {
    this.onJump();
  }
  /** D208: a menu cancels the charge and ends the block; the action itself is frozen, not cancelled. */
  onMenu() {
    this.charge = null;
    if (this.blocking) this.data.blockNeedsRelease = true;
    this.blocking = false;
    this.aiming = false;
  }

  // ------------------------------------------------------------------ targets and geometry
  targets(): Target[] {
    const out: Target[] = [];
    for (const d of this.dummies()) out.push({ uid: 'dummy:' + d.id, name: d.name, x: d.x, y: this.ground.top(d.x, d.z), z: d.z, radius: d.radius, height: d.height, dummy: d, enemy: null });
    for (const e of this.data.enemies) {
      if (e.mode === 'dead') continue;
      const s = enemyDef(e).scale;
      out.push({ uid: e.uid, name: enemyDef(e).name, x: e.x, y: e.y, z: e.z, radius: ENEMY_RADIUS * s, height: ENEMY_HEIGHT * s, dummy: null, enemy: e });
    }
    return out;
  }
  target(uid: string | null): Target | null {
    if (!uid) return null;
    return this.targets().find((t) => t.uid === uid) ?? null;
  }
  enemy(uid: string): EnemyState | undefined {
    return this.data.enemies.find((e) => e.uid === uid);
  }

  /** Line of sight over the relief (opaque ground and walls block; D195 / D196). */
  los(ax: number, ay: number, az: number, bx: number, by: number, bz: number): boolean {
    const l = Math.hypot(bx - ax, by - ay, bz - az);
    const n = Math.max(1, Math.ceil(l / 0.25));
    for (let i = 1; i < n; i++) {
      const k = i / n;
      const x = ax + (bx - ax) * k;
      const y = ay + (by - ay) * k;
      const z = az + (bz - az) * k;
      if (this.ground.wall(x, z) || this.ground.top(x, z) > y + 0.02) return false;
    }
    return true;
  }
  private heroChest(): [number, number, number] {
    const m = this.motor;
    return [m.x, m.y + 1.2, m.z];
  }
  private losTo(t: Target, from: [number, number, number]): boolean {
    return this.los(from[0], from[1], from[2], t.x, t.y + t.height * 0.6, t.z);
  }

  /** Melee hit area: within reach (to the target's edge), inside the sector, not behind a wall. */
  meleeTargets(reach: number, sectorDeg: number, max = Infinity): Target[] {
    const m = this.motor;
    const chest = this.heroChest();
    const res: { t: Target; d: number }[] = [];
    for (const t of this.targets()) {
      const dx = t.x - m.x;
      const dz = t.z - m.z;
      const d = Math.hypot(dx, dz);
      if (d - t.radius > reach + MELEE_SLACK) continue;
      if (Math.abs(t.y - m.y) > 2) continue;
      if (sectorDeg < 360 && d > 1e-6) {
        const ang = Math.acos(Math.max(-1, Math.min(1, (dx * m.fx + dz * m.fz) / d)));
        const half = (sectorDeg / 2) * (Math.PI / 180) + Math.atan2(t.radius, d);
        if (ang > half) continue;
      }
      if (!this.losTo(t, chest)) continue;
      res.push({ t, d });
    }
    res.sort((a, b) => a.d - b.d || (a.t.uid < b.t.uid ? -1 : 1));
    return res.slice(0, max).map((r) => r.t);
  }

  /** «Магические попадания и зоны»: chain from `first`, ≤ `jump` m, line of sight, nearest, ties → lower id. */
  chainTargets(first: Target, count: number, jump: number): Target[] {
    const chain = [first];
    const all = this.targets().filter((t) => t.enemy || t.dummy);
    while (chain.length < count) {
      const prev = chain[chain.length - 1];
      let best: Target | null = null;
      let bd = Infinity;
      for (const t of all) {
        if (chain.some((c) => c.uid === t.uid)) continue;
        const d = Math.hypot(t.x - prev.x, t.y - prev.y, t.z - prev.z);
        if (d > jump + 1e-9) continue;
        if (!this.los(prev.x, prev.y + prev.height * 0.6, prev.z, t.x, t.y + t.height * 0.6, t.z)) continue;
        if (d < bd - 1e-9 || (Math.abs(d - bd) <= 1e-9 && best && t.uid < best.uid)) {
          best = t;
          bd = d;
        }
      }
      if (!best) break;
      chain.push(best);
    }
    return chain;
  }

  private areaTargets(x: number, y: number, z: number, radius: number): Target[] {
    return this.targets()
      .filter((t) => Math.hypot(t.x - x, t.z - z) - t.radius <= radius && t.y + t.height >= y - 1.5 && t.y <= y + 2.5 && this.los(x, y + ZONE_HEIGHT, z, t.x, t.y + t.height * 0.6, t.z))
      .sort((a, b) => (a.uid < b.uid ? -1 : 1));
  }

  groundTop(x: number, z: number): number {
    return this.ground.top(x, z);
  }

  /**
   * Aim without a selected target (owner: no auto-targeting): the point 8 m ahead of the body's
   * facing, never an enemy picked by itself.
   */
  aimAhead(): Aim {
    const m = this.motor;
    return { x: m.x + m.fx * 8, z: m.z + m.fz * 8, target: null };
  }

  // ------------------------------------------------------------------ messages
  private refuse(text: string) {
    this.counters.refused++;
    if (this.msgCd <= 0) {
      this.fx.toast(text);
      this.msgCd = 0.6;
    }
    return false;
  }

  /** Common D194 state check before anything starts. */
  private stateProblem(): string | null {
    const m = this.motor;
    if (this.hero.dead) return 'Герой мёртв';
    if (m.stunned) return 'Оглушён';
    if (m.dodging) return 'Во время уклонения нельзя';
    if (m.mode === 'air') return 'В воздухе нельзя';
    if (m.mode === 'swim') return 'В воде нельзя';
    return null;
  }

  private newRec(family: WeaponFamily, stat: number, base: number, magic = family === 'staff', mul = 1, normal = false): ActionRec {
    const b = this.bonus;
    const c = magic ? critParams(b.magicCrit, b.magicCritPow) : critParams(b.physCrit, b.physCritPow);
    const r: ActionRec = { id: this.data.nextId++, family, heroLevel: this.hero.progress.level, stat, base, critChance: c.chance, critMult: c.mult, credited: false, perTarget: {}, mul, legend: normal ? b.legendary : null, normal };
    this.data.actions.push(r);
    return r;
  }
  private rec(id: number): ActionRec | undefined {
    return this.data.actions.find((r) => r.id === id);
  }

  private statFor(w: WeaponDef): number {
    return this.hero.stats[w.attr];
  }

  // ------------------------------------------------------------------ starting actions
  /** Normal attack (D008 / D009): pays at the start; nothing is spent when it cannot start. */
  startNormal(aim: Aim, charge = 1, paidMp = 0): boolean {
    const d = this.data;
    if (d.action || d.normalCd > 0) return false;
    const p = this.stateProblem();
    if (p) return this.refuse(p);
    const w = this.weapon;
    if (w.kind === 'sword' || w.kind === 'greatsword') {
      if (!this.hero.trySpendSt(NORMAL.stCost[w.kind])) return this.refuse('Недостаточно выносливости');
    } else if (w.kind === 'staff' && paidMp === 0) {
      if (this.hero.mp < NORMAL.staffMp) return this.refuse('Недостаточно маны');
      this.hero.mp -= NORMAL.staffMp;
    }
    this.endBlockForAttack();
    const b = this.bonus;
    const rec = this.newRec(w.family, this.statFor(w), w.damage * b.baseMul, w.family === 'staff', w.family === 'staff' ? b.magicDmg : b.physDmg, true);
    const dur = 1 / (w.aps * b.atkSpeed);
    const [dx, dz] = this.aimDir(aim);
    d.action = { rec: rec.id, kind: 'normal', ability: null, wid: w.id, t: 0, dur, hitAt: dur * NORMAL.hitAt[w.kind], prep: false, fired: 0, dirX: dx, dirZ: dz, aimX: aim.x, aimZ: aim.z, target: aim.target, charge };
    d.normalCd = dur;
    // D012 / D016: the start of the attack (dummies too) starts or extends combat
    this.hero.combatEvent();
    this.counters.attacks++;
    return true;
  }

  /** D010 / D011: release of the charged staff shot: 3 + 3t MP, ×(1 + t), paid only now. */
  releaseCharge(aim: Aim): boolean {
    const t = Math.max(0, Math.min(1, this.charge ?? 0));
    this.charge = null;
    const cost = 3 + 3 * t;
    if (this.data.action || this.data.normalCd > 0) return false;
    const p = this.stateProblem();
    if (p) return this.refuse(p);
    if (this.hero.mp + 1e-9 < cost) return this.refuse('Недостаточно маны для заряженного выстрела');
    this.hero.mp = Math.max(0, this.hero.mp - cost);
    return this.startNormal(aim, 1 + t, cost);
  }

  /** Skill or spell from panel slot `i` (D194): every check first, then full payment and the cooldown. */
  useSlot(i: number, aim: Aim): boolean {
    const id = this.panel[i] ?? null;
    const prob = this.slotProblem(id);
    if (prob) return this.refuse(id ? `${abilityName(id)}: ${prob.toLowerCase()}` : prob);
    return this.startAbility(id!, aim);
  }

  startAbility(id: string, aim: Aim): boolean {
    const d = this.data;
    const p = this.stateProblem();
    if (p) return this.refuse(p);
    if (d.action) return this.refuse('Действие ещё не закончено');
    const cd = this.cooldown(id);
    if (cd > 0) return this.refuse(`${abilityName(id)}: перезарядка ${cd.toFixed(1).replace('.', ',')} с`);
    const w = this.weapon;
    const sk = SKILL_BY_ID[id];
    const sp = SPELL_BY_ID[id];
    let target: string | null = aim.target;
    if (sp) {
      // spells that hit a target need one in reach and in sight at the start
      if (sp.shape.type === 'target' || sp.shape.type === 'chain') {
        const t = this.target(aim.target);
        if (!t || Math.hypot(t.x - this.motor.x, t.z - this.motor.z) - t.radius > sp.range || !this.losTo(t, this.heroChest())) return this.refuse(`${sp.name}: нет цели в пределах ${sp.range} м`);
      } else target = null;
      const mp = this.spellCost(sp);
      if (this.hero.mp + 1e-9 < mp) return this.refuse(`${sp.name}: недостаточно маны`);
      this.hero.mp -= mp;
    } else if (sk) {
      if (!this.hero.trySpendSt(this.skillCost(sk))) return this.refuse(`${sk.name}: недостаточно выносливости`);
    } else return false;
    this.endBlockForAttack();
    d.cds[id] = this.abilityCd(id);
    const b = this.bonus;
    const am = b.ability(id);
    const rec = sp ? this.newRec('staff', this.hero.stats.int, 0, true, b.magicDmg * am.dmg) : this.newRec(w.family, this.statFor(w), w.damage * b.baseMul, false, b.physDmg * am.dmg);
    const prep = sk ? sk.prep : sp!.cast;
    const [dx, dz] = this.aimDir(aim);
    let ax = aim.x;
    let az = aim.z;
    if (sp) {
      // zones and bursts: the aim point within the spell range
      const m = this.motor;
      const l = Math.hypot(ax - m.x, az - m.z);
      if (l > sp.range) {
        ax = m.x + ((ax - m.x) / l) * sp.range;
        az = m.z + ((az - m.z) / l) * sp.range;
      }
      const t = this.target(aim.target);
      if (t && (sp.shape.type === 'zone' || sp.shape.type === 'burst')) {
        ax = t.x;
        az = t.z;
      }
    }
    const extra = sk && sk.shape.type === 'arrow' && sk.shape.count > 1 && sk.shape.interval ? sk.shape.interval * (sk.shape.count - 1) : 0;
    const hitAt = prep > 0 ? prep : SWING.hit;
    d.action = { rec: rec.id, kind: sp ? 'spell' : 'skill', ability: id, wid: w.id, t: 0, dur: Math.max(hitAt + extra + 0.12, prep > 0 ? prep + 0.15 : SWING.dur), hitAt, prep: prep > 0, fired: 0, dirX: dx, dirZ: dz, aimX: ax, aimZ: az, target, charge: 1 };
    this.hero.combatEvent();
    if (sp) this.counters.spells++;
    else this.counters.skills++;
    if (sp) this.fx.sound('magic', 0.35);
    return true;
  }

  /** Costs and cooldowns after modifications, talents and affixes (multiplied, «Расчёт действия и ресурсов»). */
  skillCost(sk: SkillDef): number {
    const b = this.bonus;
    return sk.st * b.ability(sk.id).cost * b.skillSt;
  }
  spellCost(sp: SpellDef): number {
    const b = this.bonus;
    // «Первая формула»: I circle spells −10 % MP with this staff, checked at the start (D210)
    return sp.mp * b.ability(sp.id).cost * b.spellMp * (b.legendary === 'firstFormula' && sp.tier === 1 ? 0.9 : 1);
  }
  abilityCd(id: string): number {
    const b = this.bonus;
    const sk = SKILL_BY_ID[id];
    const sp = SPELL_BY_ID[id];
    return sk ? sk.cd * b.ability(id).cd * b.skillCd : sp.cd * b.ability(id).cd * b.spellCd;
  }

  private endBlockForAttack() {
    // D166: starting an attack ends the block; it needs a new RMB press
    if (this.blocking) this.data.blockNeedsRelease = true;
    this.blocking = false;
  }

  private aimDir(aim: Aim): [number, number] {
    const m = this.motor;
    const t = this.target(aim.target);
    const tx = t ? t.x : aim.x;
    const tz = t ? t.z : aim.z;
    let dx = tx - m.x;
    let dz = tz - m.z;
    const l = Math.hypot(dx, dz);
    if (l < 0.3) return [m.fx, m.fz];
    dx /= l;
    dz /= l;
    return [dx, dz];
  }

  // ------------------------------------------------------------------ the step
  update(dt: number, inp: CombatInput, aim: Aim) {
    const d = this.data;
    this.msgCd = Math.max(0, this.msgCd - dt);
    d.normalCd = Math.max(0, d.normalCd - dt);
    for (const k of Object.keys(d.cds)) {
      d.cds[k] = Math.max(0, d.cds[k] - dt);
      if (d.cds[k] <= 0) delete d.cds[k];
    }
    if (this.lastChain) {
      this.lastChain.t -= dt;
      if (this.lastChain.t <= 0) this.lastChain = null;
    }
    const m = this.motor;
    // stun or knockback cancels the unfinished action, the charge and the block (D011 / D194)
    if (m.stunned || this.hero.dead) {
      if (d.action || this.charge !== null || this.blocking) this.onStun();
    }
    if (inp.swap) {
      if (this.swapWeapon()) this.fx.toast(`Оружие: ${this.weapon.name}`);
      else if (!d.quick.some((q, i) => q && i !== d.cur)) this.refuse('Быстрые назначения: другого оружия нет');
    }
    const fam = this.weapon.kind;
    // RMB: sword block, bow aim, staff charge
    if (!inp.rmbHeld) d.blockNeedsRelease = false;
    const free = !this.stateProblem();
    if (fam === 'sword' || fam === 'greatsword') {
      this.aiming = false;
      this.charge = null;
      const want = inp.rmbHeld && !d.blockNeedsRelease && !d.action && free;
      this.blocking = want;
    } else {
      if (this.blocking) this.blocking = false;
      if (fam === 'bow') {
        this.charge = null;
        this.aiming = inp.rmbHeld && free;
      } else {
        this.aiming = false;
        if (this.charge === null) {
          if (inp.rmbPressed && free && !d.action) this.charge = 0;
        } else if (!free) this.charge = null;
        else if (inp.rmbHeld) this.charge = Math.min(1, this.charge + dt);
        else this.releaseCharge(aim);
      }
    }
    if (inp.skill !== null) this.useSlot(inp.skill, aim);
    if (inp.attackHeld && !d.action && this.charge === null && free) this.startNormal(aim);
    this.stepAction(dt);
    this.stepProjectiles(dt);
    this.stepZones(dt);
    this.stepEnemies(dt);
    this.prune();
    d.rng = this.rng.state;
  }

  private stepAction(dt: number) {
    const a = this.data.action;
    if (!a) return;
    const before = a.t;
    a.t += dt;
    if (a.prep && a.t >= a.hitAt) a.prep = false;
    if (before < a.hitAt && a.t >= a.hitAt) this.release(a);
    // b2: the second arrow 0.25 s after the first
    const sk = a.ability ? SKILL_BY_ID[a.ability] : undefined;
    if (sk && sk.shape.type === 'arrow' && sk.shape.interval && a.fired > 0 && a.fired < sk.shape.count) {
      const due = a.hitAt + sk.shape.interval * a.fired;
      if (a.t >= due) this.fireSkillArrows(a, sk, 1);
    }
    if (this.data.action === a && a.t >= a.dur) this.data.action = null;
  }

  /** The release moment of the current action. */
  private release(a: ActionState) {
    const rec = this.rec(a.rec);
    if (!rec) return;
    const m = this.motor;
    // the body turns to where the action goes
    if (a.kind === 'normal') {
      const w = WEAPON_BY_ID[a.wid];
      if (w.kind === 'sword' || w.kind === 'greatsword') {
        const hits = this.meleeTargets(NORMAL.reach[w.kind], NORMAL.sector);
        for (const t of hits) this.applyHit(rec, t, rec.base, [statMul(rec.stat)], false, m.x, m.z, null);
        this.fx.sound(hits.length ? 'hit' : 'slash', 0.45);
      } else if (w.kind === 'bow') {
        // «Дальний рубеж»: more than 15 m to the target at the release (D210)
        const t = this.target(a.target);
        const far = rec.legend === 'farLine' && !!t && Math.hypot(t.x - m.x, t.z - m.z) > 15;
        this.spawnShot(rec, a, 'arrow', null, 0, [far ? 1.15 : 1], NORMAL.arrow.speed, NORMAL.arrow.range, 0);
      }
      else this.spawnShot(rec, a, 'bolt', null, 0, [a.charge], NORMAL.bolt.speed, NORMAL.bolt.range, 0);
      return;
    }
    const sk = a.ability ? SKILL_BY_ID[a.ability] : undefined;
    if (sk) {
      if (sk.shape.type === 'melee') {
        const w = WEAPON_BY_ID[a.wid];
        const reach = sk.shape.reach === 'weapon' ? NORMAL.reach[w.kind] ?? 2 : sk.shape.reach;
        const hits = this.meleeTargets(reach, sk.shape.sector, sk.shape.maxTargets ?? Infinity);
        for (const t of hits) {
          // s6: the stronger coefficient when the target has ≤ 30 % HP before this hit (D210)
          let coef = sk.coef;
          if (sk.executeCoef && t.enemy && t.enemy.hp <= 0.3 * enemyDef(t.enemy).hp) coef = sk.executeCoef;
          this.applyHit(rec, t, rec.base, [statMul(rec.stat), coef], false, m.x, m.z, sk);
        }
        this.fx.sound(hits.length ? 'hit' : 'slash', 0.55);
        this.fx.burst(m.x + m.fx * 1.2, m.y + 1.1, m.z + m.fz * 1.2, 0xf0f0ff, sk.shape.sector >= 360 ? 14 : 8);
      } else this.fireSkillArrows(a, sk, 1);
      return;
    }
    const sp = a.ability ? SPELL_BY_ID[a.ability] : undefined;
    if (sp) this.castSpell(rec, a, sp);
  }

  private fireSkillArrows(a: ActionState, sk: SkillDef, n: number) {
    const rec = this.rec(a.rec);
    if (!rec || sk.shape.type !== 'arrow') return;
    const sh = sk.shape;
    if (sh.spreadDeg && sh.count > 1) {
      // b5: the whole fan at once
      for (let i = 0; i < sh.count; i++) {
        const ang = ((-sh.spreadDeg / 2 + (sh.spreadDeg * i) / (sh.count - 1)) * Math.PI) / 180;
        this.spawnShot(rec, a, 'arrow', sk.id, 0, [sk.coef], NORMAL.arrow.speed, sh.range, 0, ang, sh.maxPerTarget ?? 0);
      }
      a.fired = sh.count;
      return;
    }
    for (let i = 0; i < n && a.fired < sh.count; i++) {
      this.spawnShot(rec, a, 'arrow', sk.id, 0, sh.pierce ?? [sk.coef], NORMAL.arrow.speed, sh.range, 0);
      a.fired++;
    }
  }

  private spawnShot(rec: ActionRec, a: ActionState, kind: ProjState['kind'], ability: string | null, spellBase: number, coefs: number[], speed: number, range: number, explode: number, turn = 0, maxPerTarget = 0) {
    const m = this.motor;
    const bow = kind === 'arrow';
    const y = m.y + (bow ? 1.28 : 1.25);
    // the direction toward the aim (fixed at the start), toward the target if it still lives
    let [dx, dz] = [a.dirX, a.dirZ];
    const t = this.target(a.target);
    let dy = 0;
    if (t) {
      const l = Math.hypot(t.x - m.x, t.z - m.z) || 1;
      dx = (t.x - m.x) / l;
      dz = (t.z - m.z) / l;
      dy = (t.y + t.height * 0.6 - y) / l;
    }
    if (turn) {
      const c = Math.cos(turn);
      const s = Math.sin(turn);
      [dx, dz] = [dx * c - dz * s, dx * s + dz * c];
    }
    const n = Math.hypot(dx, dy, dz) || 1;
    const sp = ability ? SPELL_BY_ID[ability] : undefined;
    this.data.projectiles.push({
      rec: rec.id, kind, ability, school: sp?.school ?? null,
      x: m.x + (dx / n) * 0.6, y, z: m.z + (dz / n) * 0.6, dx: dx / n, dy: dy / n, dz: dz / n,
      speed, left: range, coefs, spellBase, magic: kind !== 'arrow', hitIds: [], explode, maxPerTarget, dead: false,
    });
    this.fx.sound(bow ? 'bow' : 'magic', 0.5);
  }

  private castSpell(rec: ActionRec, a: ActionState, sp: SpellDef) {
    const m = this.motor;
    const intMul = statMul(rec.stat);
    const sh = sp.shape;
    const col = SCHOOL_COLOR[sp.school];
    switch (sh.type) {
      case 'bolt':
        this.spawnShot(rec, a, 'spell', sp.id, sp.hits[0], [1], 25, sp.range, sh.explode ?? 0);
        break;
      case 'target': {
        const t = this.target(a.target);
        if (!t || Math.hypot(t.x - m.x, t.z - m.z) - t.radius > sp.range + 0.5 || !this.losTo(t, this.heroChest())) {
          this.fx.toast(`${sp.name}: промах`);
          break;
        }
        this.applyHit(rec, t, sp.hits[0], [intMul], true, m.x, m.z, sp);
        this.fx.burst(t.x, t.y + t.height * 0.7, t.z, col, 14);
        break;
      }
      case 'sector': {
        const hits = this.meleeTargets(sp.range, sh.deg);
        for (const t of hits) this.applyHit(rec, t, sp.hits[0], [intMul], true, m.x, m.z, sp);
        for (let i = 1; i <= 5; i++) this.fx.burst(m.x + m.fx * i, m.y + 0.6, m.z + m.fz * i, col, 5);
        break;
      }
      case 'zone':
        this.data.zones.push({ rec: rec.id, ability: sp.id, x: a.aimX, y: this.ground.top(a.aimX, a.aimZ), z: a.aimZ, radius: sh.radius, t: 0, next: 0, end: sh.pulses[sh.pulses.length - 1] + 0.4 });
        // the first pulse at 0 s happens right away (after the preparation)
        this.stepZones(0);
        break;
      case 'burst': {
        const y = this.ground.top(a.aimX, a.aimZ);
        for (const t of this.areaTargets(a.aimX, y, a.aimZ, sh.radius)) this.applyHit(rec, t, sp.hits[0], [intMul], true, a.aimX, a.aimZ, sp);
        this.fx.burst(a.aimX, y + 0.5, a.aimZ, col, 30);
        break;
      }
      case 'chain': {
        const first = this.target(a.target);
        if (!first || Math.hypot(first.x - m.x, first.z - m.z) - first.radius > sp.range + 0.5 || !this.losTo(first, this.heroChest())) {
          this.fx.toast(`${sp.name}: промах`);
          break;
        }
        const chain = this.chainTargets(first, sp.hits.length, sh.jump);
        const pts: [number, number, number][] = [[m.x, m.y + 1.3, m.z]];
        chain.forEach((t, i) => {
          const prev = i === 0 ? { x: m.x, z: m.z } : chain[i - 1];
          this.applyHit(rec, t, sp.hits[i], [intMul], true, prev.x, prev.z, sp);
          pts.push([t.x, t.y + t.height * 0.6, t.z]);
        });
        this.lastChain = { pts, t: 0.35 };
        break;
      }
    }
  }

  private stepProjectiles(dt: number) {
    for (const p of this.data.projectiles) {
      if (p.dead) continue;
      const rec = this.rec(p.rec);
      const step = p.speed * dt;
      const subs = Math.max(1, Math.ceil(step / 0.25));
      for (let s = 0; s < subs && !p.dead; s++) {
        const k = Math.min(step / subs, p.left);
        p.x += p.dx * k;
        p.y += p.dy * k;
        p.z += p.dz * k;
        p.left -= k;
        for (const t of this.targets()) {
          if (p.hitIds.includes(t.uid)) continue;
          if (Math.hypot(p.x - t.x, p.z - t.z) > t.radius + 0.12 || p.y < t.y - 0.1 || p.y > t.y + t.height + 0.2) continue;
          if (p.explode > 0) {
            this.explode(p, rec);
            break;
          }
          if (p.maxPerTarget && rec && (rec.perTarget[t.uid] ?? 0) >= p.maxPerTarget) {
            p.hitIds.push(t.uid);
            continue;
          }
          const i = p.hitIds.length;
          p.hitIds.push(t.uid);
          if (rec) {
            const sp = p.ability ? SPELL_BY_ID[p.ability] : undefined;
            const sk = p.ability ? SKILL_BY_ID[p.ability] : undefined;
            const base = sp ? p.spellBase : rec.base;
            const mults = sp ? [statMul(rec.stat)] : [statMul(rec.stat), p.coefs[Math.min(i, p.coefs.length - 1)]];
            if (!sp && p.kind === 'bolt') mults[1] = p.coefs[0];
            rec.perTarget[t.uid] = (rec.perTarget[t.uid] ?? 0) + 1;
            this.applyHit(rec, t, base, mults, p.magic, p.x - p.dx, p.z - p.dz, sp ?? sk ?? null);
          }
          // a normal shot stops on the first target; pierce continues for its listed hits
          if (p.hitIds.length >= p.coefs.length) {
            p.dead = true;
            break;
          }
        }
        if (p.dead) break;
        if (p.left <= 1e-6 || p.y < this.ground.top(p.x, p.z) || this.ground.wall(p.x, p.z)) {
          if (p.explode > 0) this.explode(p, rec);
          p.dead = true;
        }
      }
    }
  }

  /** f2: the burst where the fireball stops; no separate direct hit. */
  private explode(p: ProjState, rec: ActionRec | undefined) {
    p.dead = true;
    const sp = p.ability ? SPELL_BY_ID[p.ability] : undefined;
    const y = Math.max(this.ground.top(p.x, p.z), p.y - 1);
    if (rec && sp) for (const t of this.areaTargets(p.x, y, p.z, p.explode)) this.applyHit(rec, t, p.spellBase, [statMul(rec.stat)], true, p.x, p.z, sp);
    this.fx.burst(p.x, p.y, p.z, SCHOOL_COLOR[sp?.school ?? 'fire'], 24);
    this.fx.sound('magic', 0.6);
  }

  private stepZones(dt: number) {
    for (const z of this.data.zones) {
      const sp = SPELL_BY_ID[z.ability];
      const rec = this.rec(z.rec);
      if (sp.shape.type !== 'zone') continue;
      const pulses = sp.shape.pulses;
      z.t += dt;
      while (z.next < pulses.length && z.t + 1e-9 >= pulses[z.next]) {
        const i = z.next++;
        if (rec) {
          for (const t of this.areaTargets(z.x, z.y, z.z, z.radius)) {
            const fx = sp.stunFirstOnly && i > 0 ? { ...sp, stun: undefined } : sp;
            this.applyHit(rec, t, sp.hits[i], [statMul(rec.stat)], true, z.x, z.z, fx);
          }
        }
        this.fx.burst(z.x, z.y + 0.6, z.z, SCHOOL_COLOR[sp.school], 18);
      }
    }
    this.data.zones = this.data.zones.filter((z) => z.t < z.end);
  }

  // ------------------------------------------------------------------ hits
  /**
   * One hit of the hero on one target: crit roll (D007), damage (D004 → D006), participation
   * (D039), mastery (D030 / D031 / D198), control (D017–D020) and death (D213 order).
   */
  applyHit(rec: ActionRec, t: Target, base: number, mults: number[], magic: boolean, fromX: number, fromZ: number, eff: { stun?: number; slow?: { power: number; dur: number }; knock?: number } | null) {
    const crit = this.rng.next() < rec.critChance;
    const e = t.enemy;
    const def = e ? enemyDef(e) : null;
    const all = [...mults, rec.mul];
    // D210: conditional legendary bonuses of normal hits, checked before each hit on each target
    if (rec.normal && rec.legend === 'firstStrike' && (!e || (def && e.hp >= def.hp))) all.push(1.2);
    if (rec.normal && rec.legend === 'lastArgument' && e && def && e.hp <= 0.3 * def.hp) all.push(1.15);
    const dmg = hitDamage({ base, mults: all, magic, armor: def?.armor ?? 0, res: def?.res ?? 0, crit, critMult: rec.critMult });
    this.log.push({ rec: rec.id, ability: (eff as { id?: string } | null)?.id ?? null, target: t.uid, damage: dmg, crit });
    if (this.log.length > 200) this.log.shift();
    // D016: every hit of the attack refreshes the combat timer (dummies too)
    this.hero.combatEvent();
    if (t.dummy) {
      this.fx.dummyHit(t.dummy.id, dmg, magic, fromX, fromZ);
      if (crit) this.fx.number(t.x, t.z, dmg, true, 0xffd040);
      this.creditTraining(rec);
      return;
    }
    if (!e || e.mode === 'dead' || !def) return;
    const before = e.hp;
    e.hp = Math.max(0, e.hp - dmg);
    const removed = before - e.hp;
    e.part += removed;
    this.fx.number(e.x, e.z, dmg, crit, crit ? 0xffd040 : magic ? 0xc88cff : 0xffffff);
    this.fx.burst(e.x, e.y + 0.7, e.z, magic ? 0xb070ff : 0xc04030, crit ? 12 : 7);
    if (removed >= 1) this.creditCombat(rec, e);
    if (e.hp > 0 && eff) {
      if (eff.stun && applyStun(e.ctl, eff.stun) > 0) e.windup = null;
      if (eff.slow) applySlow(e.ctl, eff.slow.power, eff.slow.dur);
      if (eff.knock) applyKnock(e.ctl, e.x, e.z, this.motor.x, this.motor.z, eff.knock);
    }
    onDamaged(e, this.data.enemies, this.motor.x, this.motor.z);
    if (e.hp <= 0) this.onKill(e);
  }

  private creditTraining(rec: ActionRec) {
    if (rec.credited) return;
    const a = trainingAward(this.data.om[rec.family]);
    if (a <= 0) return;
    rec.credited = true;
    this.addOm(rec.family, a);
  }

  private creditCombat(rec: ActionRec, e: EnemyState) {
    if (rec.credited) return;
    const f = rec.family;
    const a = combatAward(rec.heroLevel, enemyDef(e).level, e.omUsed[f], this.data.om[f]);
    if (a <= 0) return;
    rec.credited = true;
    e.omUsed[f] += a;
    this.addOm(f, a);
  }

  private addOm(f: WeaponFamily, a: number) {
    const before = masteryOf(this.data.om[f]);
    this.data.om[f] += a;
    this.syncMastery();
    const after = masteryOf(this.data.om[f]);
    if (after > before) this.fx.toast(`Мастерство «${FAMILY_NAME[f]}»: ${after}`);
  }

  syncMastery() {
    for (const f of ['sword', 'bow', 'staff'] as WeaponFamily[]) this.hero.progress.mastery[f] = masteryOf(this.data.om[f]);
  }

  /** D035–D039 / D198: death after the damage; XP only with ≥ 25 % participation. One life rewards once. */
  /** Stage 4: the scene turns a death into a lootable corpse (called before the enemy is reset). */
  onKilled: ((e: EnemyState) => void) | null = null;
  /** Stage 5: a kill credited to the hero (D035–D039) — quests (D107) and the bestiary (D061). */
  onCredited: ((e: EnemyState) => void) | null = null;

  private onKill(e: EnemyState) {
    this.onKilled?.(e);
    const def = enemyDef(e);
    const enough = participationEnough(e.part, def.hp);
    killEnemy(e);
    this.data.kills++;
    this.counters.kills++;
    this.fx.burst(e.x, e.y + 0.6, e.z, 0x8a8478, 20);
    if (enough) {
      const xp = killXp(def.xp, def.level, this.hero.progress.level);
      const up = addXp(this.hero.progress, xp);
      this.onCredited?.(e);
      this.fx.toast(`${def.name} повержен: +${xp} XP`);
      if (up) this.fx.toast(`Новый уровень: ${this.hero.progress.level}`);
    } else this.fx.toast(`${def.name} повержен: участие меньше 25 % — без опыта`);
  }

  /** An enemy's hit on the hero: dodge invulnerability, block (D161–D165), armor and RES (D160). */
  enemyHitsHero(e: EnemyState, damage: number, phys: boolean) {
    const hero = this.hero;
    const m = this.motor;
    if (hero.dead) return;
    // D016: an enemy attack's hit refreshes combat even when it deals nothing
    hero.combatEvent();
    if (m.invulnerable) {
      this.fx.number(m.x, m.z, 0, false, 0x9cc8ff);
      this.fx.toast('Уклонение: без урона');
      return;
    }
    let blocked = false;
    if (this.blocking && phys && inFront(m.x, m.z, m.fx, m.fz, e.x, e.z)) {
      if (hero.st >= BLOCK.cost) {
        hero.spendSt(BLOCK.cost);
        blocked = true;
        this.counters.blocks++;
      }
    }
    const dmg = hitDamage({ base: damage, mults: [], magic: !phys, armor: this.heroArmor, res: hero.stats.res, crit: false, critMult: 1, blocked, blockReduce: this.bonus.blockReduce });
    hero.takeDamage(dmg);
    this.counters.heroHits++;
    this.log.push({ rec: 0, ability: null, target: 'hero', damage: dmg, crit: false, blocked });
    this.fx.number(m.x, m.z, dmg, false, blocked ? 0x9ab0c8 : 0xff5040);
    this.fx.sound(blocked ? 'thrust' : 'hit', 0.6);
    if (blocked) this.fx.burst(m.x + m.fx * 0.6, m.y + 1.2, m.z + m.fz * 0.6, 0xe0e8ff, 8);
  }

  // ------------------------------------------------------------------ enemies
  private enemyCtx(): EnemyCtx {
    const m = this.motor;
    return {
      ground: this.ground,
      hero: { x: m.x, y: m.y, z: m.z, alive: !this.hero.dead },
      los: (ax, ay, az, bx, by, bz) => this.los(ax, ay, az, bx, by, bz),
      attackStart: () => this.hero.combatEvent(),
      attackHit: (e, kind) => {
        const d = enemyDef(e);
        if (kind === 'special' && d.special) {
          const w = { x: e.x, z: e.z };
          this.fx.burst(w.x, e.y + 0.2, w.z, 0xb0a080, 16);
          if (Math.hypot(m.x - w.x, m.z - w.z) <= d.special.radius + 0.32 && Math.abs(m.y - e.y) < 1.6) this.enemyHitsHero(e, d.special.damage, d.special.phys);
          return;
        }
        const dist = Math.hypot(m.x - e.x, m.z - e.z);
        const reach = d.range + ENEMY_RADIUS * d.scale + 0.3;
        if (dist <= reach && Math.abs(m.y - e.y) < 1.6 && inFront(e.x, e.z, e.fx, e.fz, m.x, m.z, 140)) this.enemyHitsHero(e, d.damage, d.phys);
        else this.fx.sound('slash', 0.3);
      },
      canRespawn: (e) => this.canRespawn(e),
      onRespawn: (e) => this.fx.toast(`${enemyDef(e).name} снова появился`),
    };
  }

  private stepEnemies(dt: number) {
    const ctx = this.enemyCtx();
    for (const e of this.data.enemies) updateEnemy(e, this.data.enemies, ctx, dt);
    separate(this.data.enemies, this.ground);
  }

  /** Dev: brings every dead enemy back at once (a new life each). */
  respawnAll() {
    for (const e of this.data.enemies) if (e.mode === 'dead') e.respawnLeft = 0;
    const keep = this.canRespawn;
    this.canRespawn = () => true;
    this.stepEnemies(0);
    this.canRespawn = keep;
  }

  /** Dev: provoke an enemy. */
  provoke(uid: string) {
    const e = this.enemy(uid);
    if (e) aggro(e, this.data.enemies);
  }

  /** Drops credit records nothing refers to any more. */
  private prune() {
    const d = this.data;
    d.projectiles = d.projectiles.filter((p) => !p.dead);
    const live = new Set<number>();
    if (d.action) live.add(d.action.rec);
    for (const p of d.projectiles) live.add(p.rec);
    for (const z of d.zones) live.add(z.rec);
    d.actions = d.actions.filter((r) => live.has(r.id));
  }

  /** Is this enemy a boss (D020)? */
  static boss(e: EnemyState): boolean {
    return isBoss(enemyDef(e).rank);
  }
}

export const FAMILY_NAME: Record<WeaponFamily, string> = { sword: 'Меч', bow: 'Лук', staff: 'Посох' };

// ------------------------------------------------------------------ save check
const fin = (v: unknown, path: string): number => {
  if (typeof v !== 'number' || !Number.isFinite(v)) throw new Error(`поле «${path}»`);
  return v;
};
const arr = (v: unknown, path: string): unknown[] => {
  if (!Array.isArray(v)) throw new Error(`поле «${path}»`);
  return v;
};
const obj = (v: unknown, path: string): Record<string, any> => {
  if (!v || typeof v !== 'object' || Array.isArray(v)) throw new Error(`поле «${path}»`);
  return v as Record<string, any>;
};
const strOrNull = (v: unknown, path: string): string | null => {
  if (v !== null && typeof v !== 'string') throw new Error(`поле «${path}»`);
  return v as string | null;
};

/**
 * Checks a saved combat block (D202: a broken record is refused, never partly loaded) and returns
 * a clean copy. Unknown ids are refused too.
 */
export function checkCombat(raw: unknown, isItem?: (id: string) => boolean): CombatData {
  const c = obj(raw, 'combat');
  const d = newCombatData('start');
  d.profile = c.profile === 'test' ? 'test' : 'start';
  const quick = arr(c.quick, 'combat.quick');
  if (quick.length !== 4) throw new Error('поле «combat.quick»');
  d.quick = quick.map((q, i) => {
    const id = strOrNull(q, `combat.quick.${i}`);
    if (id && !(isItem ? isItem(id) : WEAPON_BY_ID[id])) throw new Error(`неизвестное оружие «${id}»`);
    return id;
  });
  if (!d.quick.some(Boolean)) throw new Error('поле «combat.quick»');
  d.cur = fin(c.cur, 'combat.cur');
  if (d.cur < 0 || d.cur > 3 || !d.quick[d.cur]) throw new Error('поле «combat.cur»');
  d.learned = arr(c.learned, 'combat.learned').map((id, i) => {
    if (typeof id !== 'string' || (!SKILL_BY_ID[id] && !SPELL_BY_ID[id])) throw new Error(`поле «combat.learned.${i}»`);
    return id;
  });
  const panels = obj(c.panels, 'combat.panels');
  for (const f of ['sword', 'bow', 'staff'] as WeaponFamily[]) {
    const p = arr(panels[f], `combat.panels.${f}`);
    if (p.length !== 6) throw new Error(`поле «combat.panels.${f}»`);
    d.panels[f] = p.map((id, i) => {
      const s = strOrNull(id, `combat.panels.${f}.${i}`);
      if (s && !SKILL_BY_ID[s] && !SPELL_BY_ID[s]) throw new Error(`поле «combat.panels.${f}.${i}»`);
      return s;
    });
  }
  const cds = obj(c.cds, 'combat.cds');
  d.cds = {};
  for (const [k, v] of Object.entries(cds)) d.cds[k] = fin(v, `combat.cds.${k}`);
  const om = obj(c.om, 'combat.om');
  for (const f of ['sword', 'bow', 'staff'] as WeaponFamily[]) d.om[f] = fin(om[f], `combat.om.${f}`);
  d.normalCd = fin(c.normalCd, 'combat.normalCd');
  d.rng = fin(c.rng, 'combat.rng') | 0;
  d.nextId = fin(c.nextId, 'combat.nextId');
  d.kills = fin(c.kills ?? 0, 'combat.kills');
  d.blockNeedsRelease = c.blockNeedsRelease === true;
  d.actions = arr(c.actions, 'combat.actions').map((r0, i) => {
    const r = obj(r0, `combat.actions.${i}`);
    const p = `combat.actions.${i}`;
    if (!['sword', 'bow', 'staff'].includes(r.family)) throw new Error(`поле «${p}.family»`);
    const per: Record<string, number> = {};
    for (const [k, v] of Object.entries(obj(r.perTarget, `${p}.perTarget`))) per[k] = fin(v, `${p}.perTarget.${k}`);
    return { id: fin(r.id, `${p}.id`), family: r.family, heroLevel: fin(r.heroLevel, `${p}.heroLevel`), stat: fin(r.stat, `${p}.stat`), base: fin(r.base, `${p}.base`), critChance: fin(r.critChance, `${p}.critChance`), critMult: fin(r.critMult, `${p}.critMult`), credited: r.credited === true, perTarget: per, mul: fin(r.mul ?? 1, `${p}.mul`), legend: typeof r.legend === 'string' ? r.legend : null, normal: r.normal === true };
  });
  if (c.action !== null && c.action !== undefined) {
    const a = obj(c.action, 'combat.action');
    const n = (k: string) => fin(a[k], `combat.action.${k}`);
    if (!['normal', 'skill', 'spell'].includes(a.kind) || !WEAPON_BY_ID[a.wid]) throw new Error('поле «combat.action»');
    d.action = { rec: n('rec'), kind: a.kind, ability: strOrNull(a.ability, 'combat.action.ability'), wid: a.wid, t: n('t'), dur: n('dur'), hitAt: n('hitAt'), prep: a.prep === true, fired: n('fired'), dirX: n('dirX'), dirZ: n('dirZ'), aimX: n('aimX'), aimZ: n('aimZ'), target: strOrNull(a.target, 'combat.action.target'), charge: n('charge') };
  } else d.action = null;
  d.projectiles = arr(c.projectiles, 'combat.projectiles').map((p0, i) => {
    const p = obj(p0, `combat.projectiles.${i}`);
    const path = `combat.projectiles.${i}`;
    const n = (k: string) => fin(p[k], `${path}.${k}`);
    if (!['arrow', 'bolt', 'spell'].includes(p.kind)) throw new Error(`поле «${path}.kind»`);
    return {
      rec: n('rec'), kind: p.kind, ability: strOrNull(p.ability, `${path}.ability`), school: strOrNull(p.school, `${path}.school`),
      x: n('x'), y: n('y'), z: n('z'), dx: n('dx'), dy: n('dy'), dz: n('dz'), speed: n('speed'), left: n('left'),
      coefs: arr(p.coefs, `${path}.coefs`).map((v, j) => fin(v, `${path}.coefs.${j}`)), spellBase: n('spellBase'), magic: p.magic === true,
      hitIds: arr(p.hitIds, `${path}.hitIds`).map((v) => String(v)), explode: n('explode'), maxPerTarget: n('maxPerTarget'), dead: false,
    };
  });
  d.zones = arr(c.zones, 'combat.zones').map((z0, i) => {
    const z = obj(z0, `combat.zones.${i}`);
    const path = `combat.zones.${i}`;
    const n = (k: string) => fin(z[k], `${path}.${k}`);
    if (!SPELL_BY_ID[z.ability]) throw new Error(`поле «${path}.ability»`);
    return { rec: n('rec'), ability: z.ability, x: n('x'), y: n('y'), z: n('z'), radius: n('radius'), t: n('t'), next: n('next'), end: n('end') };
  });
  d.enemies = arr(c.enemies, 'combat.enemies').map((e0, i) => {
    const e = obj(e0, `combat.enemies.${i}`);
    const path = `combat.enemies.${i}`;
    const n = (k: string) => fin(e[k], `${path}.${k}`);
    if (typeof e.uid !== 'string' || !ENEMY_IDS.has(e.def)) throw new Error(`поле «${path}.def»`);
    if (!['idle', 'chase', 'return', 'dead'].includes(e.mode)) throw new Error(`поле «${path}.mode»`);
    const ctl = obj(e.ctl, `${path}.ctl`);
    const cn = (k: string) => fin(ctl[k], `${path}.ctl.${k}`);
    const kn = ctl.knock ? obj(ctl.knock, `${path}.ctl.knock`) : null;
    const w = e.windup ? obj(e.windup, `${path}.windup`) : null;
    const omU = obj(e.omUsed, `${path}.omUsed`);
    return {
      uid: e.uid, def: e.def, homeX: n('homeX'), homeZ: n('homeZ'), territory: n('territory'), x: n('x'), y: n('y'), z: n('z'), fx: n('fx'), fz: n('fz'),
      hp: n('hp'), mode: e.mode,
      ctl: { boss: ctl.boss === true, stunLeft: cn('stunLeft'), stunSteps: cn('stunSteps'), sinceStun: cn('sinceStun'), slowPower: cn('slowPower'), slowLeft: cn('slowLeft'), knock: kn ? { vx: fin(kn.vx, 'knock.vx'), vz: fin(kn.vz, 'knock.vz'), left: fin(kn.left, 'knock.left') } : null },
      atkCd: n('atkCd'), specialCd: n('specialCd'), pause: n('pause'),
      windup: w ? { kind: w.kind === 'special' ? 'special' : 'normal', t: fin(w.t, 'windup.t'), dur: fin(w.dur, 'windup.dur'), sx: fin(w.sx, 'windup.sx'), sz: fin(w.sz, 'windup.sz') } : null,
      outLeash: n('outLeash'), noPath: n('noPath'), atHome: e.atHome === true, part: n('part'),
      omUsed: { sword: fin(omU.sword, 'omUsed.sword'), bow: fin(omU.bow, 'omUsed.bow'), staff: fin(omU.staff, 'omUsed.staff') },
      life: n('life'), respawnLeft: n('respawnLeft'), anim: 0, moving: false,
    } as EnemyState;
  });
  return d;
}

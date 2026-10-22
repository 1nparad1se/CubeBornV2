import { BASE, COMBAT_SECONDS, LEVELS, REGEN } from './config';

/** The six base stats (GDD «Общие основы»): all 10 at level 1. */
export type StatId = 'str' | 'dex' | 'int' | 'vit' | 'spi' | 'res';
export const STAT_IDS: StatId[] = ['str', 'dex', 'int', 'vit', 'spi', 'res'];
export const STAT_NAMES: Record<StatId, string> = {
  str: 'Сила (STR)',
  dex: 'Ловкость (DEX)',
  int: 'Интеллект (INT)',
  vit: 'Выносливость (VIT)',
  spi: 'Дух (SPI)',
  res: 'Стойкость (RES)',
};
export type Stats = Record<StatId, number>;

export function baseStats(): Stats {
  return { str: BASE.stat, dex: BASE.stat, int: BASE.stat, vit: BASE.stat, spi: BASE.stat, res: BASE.stat };
}

/** D159: max HP before talent bonuses. */
export function maxHpFor(vit: number, level: number): number {
  return BASE.hp + BASE.hpPerVit * vit + BASE.hpPerLevel * (level - 1);
}
/** D159: max MP before talent bonuses. */
export function maxMpFor(spi: number): number {
  return BASE.mp + BASE.mpPerSpi * spi;
}
/** D159: base max ST (no growth from level or stats). */
export function maxStFor(): number {
  return BASE.st;
}

/** Progress data (XP and levels come in stage 3; stored now so saves keep them). */
export interface Progress {
  level: number;
  xp: number;
  /** Learning points (LP) and talent points (ОТ). */
  lp: number;
  tp: number;
  /** Weapon masteries 1..100. */
  mastery: { sword: number; bow: number; staff: number };
}

export function newProgress(): Progress {
  return { level: LEVELS.min, xp: 0, lp: 0, tp: 0, mastery: { sword: 1, bow: 1, staff: 1 } };
}

/** What the world around the hero adds to regeneration this tick. */
export interface RegenContext {
  /** Within the radius of a burning campfire (D028). */
  campfire?: boolean;
}

/**
 * The hero's state of stage 1: stats, maxima, current HP / MP / ST, the regeneration timers and
 * the combat state. Only advanced with active (unpaused) time; every value is fractional
 * (D006 rounding is not applied to regeneration or resource costs).
 */
export class HeroState {
  stats: Stats = baseStats();
  progress: Progress = newProgress();
  hp: number;
  mp: number;
  st: number;
  /** Seconds since ST was last spent (D015); regeneration runs once this reaches REGEN.stDelay. */
  stIdle = REGEN.stDelay;
  /** Seconds left of the combat state (D012); 0 = out of combat. */
  combatLeft = 0;
  /** Set when HP reached 0. A dead hero starts no new actions and is never saved (D047, D213). */
  dead = false;

  constructor() {
    this.hp = this.maxHp;
    this.mp = this.maxMp;
    this.st = this.maxSt;
  }

  get maxHp(): number {
    return maxHpFor(this.stats.vit, this.progress.level);
  }
  get maxMp(): number {
    return maxMpFor(this.stats.spi);
  }
  get maxSt(): number {
    return maxStFor();
  }
  get inCombat(): boolean {
    return this.combatLeft > 0;
  }

  /**
   * D012 / D016: the start of an attack by the hero (dummies included) or by an enemy against the
   * hero, and every later hit of that attack, (re)starts the 10 s combat countdown.
   */
  combatEvent() {
    if (this.dead) return;
    this.combatLeft = COMBAT_SECONDS;
  }

  /** Spends ST if there is enough; returns false (nothing spent) otherwise. Restarts the D015 delay. */
  trySpendSt(cost: number): boolean {
    if (this.dead || this.st < cost) return false;
    this.spendSt(cost);
    return true;
  }

  /** Spends ST (never below 0) and restarts the 1 s regeneration delay. */
  spendSt(amount: number) {
    this.st = Math.max(0, this.st - amount);
    this.stIdle = 0;
  }

  /** Damage that ignores armor (falls). Returns true when it killed the hero. */
  takeDamage(amount: number): boolean {
    if (this.dead || amount <= 0) return false;
    this.hp = Math.max(0, this.hp - amount);
    if (this.hp <= 0) this.dead = true;
    return this.dead;
  }

  kill() {
    this.hp = 0;
    this.dead = true;
  }

  /**
   * Advances regeneration and the combat timer by `dt` seconds of active play. The tick is split
   * exactly at the moment combat ends and at the moment the ST delay elapses, so the result does
   * not depend on the frame rate. `stSpentThisTick` keeps ST from regenerating while it is being
   * spent continuously (sprint, D015).
   */
  tick(dt: number, ctx: RegenContext = {}, stSpentThisTick = false) {
    if (!(dt > 0) || this.dead) return;
    const combatBefore = this.combatLeft;
    this.combatLeft = Math.max(0, this.combatLeft - dt);
    const inTime = Math.min(dt, combatBefore);
    const outTime = dt - inTime;
    const fire = ctx.campfire ? REGEN.campfire : 1;
    // HP: out of combat only (D013), x5 at a campfire (D028)
    this.hp = Math.min(this.maxHp, this.hp + REGEN.hpOut * fire * this.maxHp * outTime);
    // MP: 0.5 % in combat, 2 % out of combat (x5 out of combat at a campfire)
    this.mp = Math.min(this.maxMp, this.mp + this.maxMp * (REGEN.mpIn * inTime + REGEN.mpOut * fire * outTime));
    // ST: 15/s after one second without spending (same in and out of combat, no campfire bonus)
    if (stSpentThisTick) this.stIdle = 0;
    else {
      const before = this.stIdle;
      this.stIdle += dt;
      const regenTime = Math.max(0, this.stIdle - Math.max(before, REGEN.stDelay));
      this.st = Math.min(this.maxSt, this.st + REGEN.st * regenTime);
    }
  }

  /** Clamps current values into 0..max (after loading or stat changes; growth does not refill, D159). */
  clamp() {
    this.hp = Math.min(Math.max(0, this.hp), this.maxHp);
    this.mp = Math.min(Math.max(0, this.mp), this.maxMp);
    this.st = Math.min(Math.max(0, this.st), this.maxSt);
  }
}

import { roundDamage } from '../config';

/**
 * Combat formulas of GDD v1.2 (D004–D007, D158, D160–D162, D030–D034, «Мастерство и обучение»).
 * Pure functions; the combat system feeds them the numbers fixed at the launch of an action.
 */

/** D005: hero crit before bonuses and the hero's caps. */
export const CRIT = { chance: 0.05, mult: 1.5, maxChance: 0.5, maxMult: 2.5 };

/** D161–D163: sword block. */
export const BLOCK = { reduce: 0.5, cost: 15, sectorDeg: 120 };

/** D033: mastery 1..100. */
export const MASTERY = { max: 100, trainingCap: 20, perEnemyLife: 100, training: 2 };

/**
 * Small deterministic random generator (mulberry32). Its state is saved with the playthrough so
 * a loaded game rolls the same crits (D213: stable order after loading).
 */
export class Rng {
  constructor(public state = 0x9e3779b9) {}
  next(): number {
    let t = (this.state = (this.state + 0x6d2b79f5) | 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

/** D158: damage multiplier of STR / DEX / INT (all points count, the starting 10 included). */
export function statMul(stat: number): number {
  return 1 + stat / 100;
}

/** D160: share of physical damage that passes armor and RES (magic ignores both). */
export function physMul(armor: number, res: number): number {
  return (100 / (100 + Math.max(0, armor))) * (100 / (100 + Math.max(0, res)));
}

/** D005: crit parameters with bonuses (chance in percentage points, power added to the factor), capped. */
export function critParams(bonusChance = 0, bonusMult = 0): { chance: number; mult: number } {
  return { chance: Math.min(CRIT.maxChance, CRIT.chance + bonusChance), mult: Math.min(CRIT.maxMult, CRIT.mult + bonusMult) };
}

export interface HitInput {
  /** Base of this hit: weapon base (× smithing) for weapon actions, the spell's own base for spells. */
  base: number;
  /** Separate multipliers applied once each (stat, skill coefficient, charge, talents...), D004. */
  mults: number[];
  magic: boolean;
  /** Target defence (physical only). */
  armor: number;
  res: number;
  crit: boolean;
  critMult: number;
  /** A successful block (physical only, D161). */
  blocked?: boolean;
  /** Block reduction (0.5; 0.6 with «Крепкий блок»). */
  blockReduce?: number;
}

/** D004 → D005/D007 → D160 → D161 → D006: the damage of one hit on one target. */
export function hitDamage(h: HitInput): number {
  let v = h.base;
  for (const m of h.mults) v *= m;
  if (h.crit) v *= h.critMult;
  if (!h.magic) {
    v *= physMul(h.armor, h.res);
    if (h.blocked) v *= 1 - (h.blockReduce ?? BLOCK.reduce);
  }
  return roundDamage(v);
}

/** D163: is the direction toward `fromX/fromZ` inside the 120° block sector in front of the body? */
export function inFront(px: number, pz: number, fx: number, fz: number, fromX: number, fromZ: number, deg = BLOCK.sectorDeg): boolean {
  const dx = fromX - px;
  const dz = fromZ - pz;
  const l = Math.hypot(dx, dz);
  if (l < 1e-6) return true;
  const fl = Math.hypot(fx, fz) || 1;
  return (dx * fx + dz * fz) / (l * fl) >= Math.cos(((deg / 2) * Math.PI) / 180) - 1e-9;
}

/** «Мастерство и обучение»: cumulative ОМ needed for mastery M (1 → 0, 20 → 1330, 100 → 26730). */
export function masteryThreshold(m: number): number {
  const k = Math.max(1, Math.min(MASTERY.max, Math.floor(m)));
  return 20 * (k - 1) + (5 * (k - 1) * k) / 2;
}

/** D033: cost of the step M → M+1. */
export function masteryStepCost(m: number): number {
  return 20 + 5 * m;
}

export const MASTERY_TOTAL_MAX = masteryThreshold(MASTERY.max);
export const TRAINING_TOTAL_CAP = masteryThreshold(MASTERY.trainingCap);

/** Mastery reached with `total` ОМ (inclusive thresholds, D033). */
export function masteryOf(total: number): number {
  let m = 1;
  while (m < MASTERY.max && total >= masteryThreshold(m + 1)) m++;
  return m;
}

/** D030 / D033: ОМ a dummy gives now (+2, only what is missing to mastery 20). */
export function trainingAward(total: number): number {
  return Math.max(0, Math.min(MASTERY.training, TRAINING_TOTAL_CAP - total));
}

/** D031 / D034 / D198: base combat ОМ by how many levels the enemy is below the hero. */
export function combatAwardBase(heroLevel: number, enemyLevel: number): number {
  const below = heroLevel - enemyLevel;
  if (below >= 10) return 0;
  if (below >= 5) return 5;
  return 10;
}

/** D032 / D198: the combat award after the per-life limit and the mastery cap (only what is given counts). */
export function combatAward(heroLevel: number, enemyLevel: number, usedOnLife: number, total: number): number {
  const base = combatAwardBase(heroLevel, enemyLevel);
  return Math.max(0, Math.min(base, MASTERY.perEnemyLife - usedOnLife, MASTERY_TOTAL_MAX - total));
}

/** «Мастерство и обучение»: XP coefficient by level difference (enemy − hero). */
export function xpCoef(diff: number): number {
  if (diff <= -10) return 0.5;
  if (diff <= -5) return 0.75;
  if (diff <= 4) return 1;
  if (diff <= 9) return 1.15;
  return 1.25;
}

/** XP for a credited kill: floor(base × coefficient). */
export function killXp(base: number, enemyLevel: number, heroLevel: number): number {
  return Math.floor(base * xpCoef(enemyLevel - heroLevel));
}

/** D035 / D037 / D039: is the participation enough for the kill credit (≥ 25 % of max HP)? */
export function participationEnough(part: number, maxHp: number): boolean {
  return part >= 0.25 * maxHp - 1e-9;
}

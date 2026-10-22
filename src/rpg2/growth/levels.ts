/**
 * Levels 1–60 (D118, D119, D198, Leveling tables): the step L → L+1 costs 200 + 100L + 20L² XP,
 * 1 593 000 XP in all; every level gives 10 LP, levels 5, 10, …, 60 give one talent point.
 * Levels never refill HP / MP / ST (D119).
 */
export const MAX_LEVEL = 60;
export const LP_PER_LEVEL = 10;

export function xpStep(level: number): number {
  return 200 + 100 * level + 20 * level * level;
}

/** Total XP needed to stand at `level` (1 → 0, 2 → 320, 60 → 1 593 000). */
export function xpForLevel(level: number): number {
  let s = 0;
  for (let l = 1; l < Math.min(level, MAX_LEVEL); l++) s += xpStep(l);
  return s;
}

export const XP_CAP = xpForLevel(MAX_LEVEL);

/** Level reached with `xp` total XP. */
export function levelForXp(xp: number): number {
  let l = 1;
  while (l < MAX_LEVEL && xp >= xpForLevel(l + 1)) l++;
  return l;
}

/** Talent points for reaching `level` from level 1 (one at 5, 10, …, 60). */
export function tpForLevel(level: number): number {
  return Math.floor(Math.min(level, MAX_LEVEL) / 5);
}

export interface LevelProgress {
  level: number;
  xp: number;
  lp: number;
  tp: number;
}

/**
 * D198: adds XP (capped at 1 593 000), raises every crossed level at once with its LP and talent
 * points. Returns the levels gained. The caller keeps HP / MP / ST as they are (D119).
 */
export function addXp(p: LevelProgress, amount: number): number {
  if (!(amount > 0) || p.level >= MAX_LEVEL) return 0;
  p.xp = Math.min(XP_CAP, p.xp + Math.floor(amount));
  const before = p.level;
  const after = levelForXp(p.xp);
  if (after > before) {
    p.lp += LP_PER_LEVEL * (after - before);
    p.tp += tpForLevel(after) - tpForLevel(before);
    p.level = after;
  }
  return after - before;
}

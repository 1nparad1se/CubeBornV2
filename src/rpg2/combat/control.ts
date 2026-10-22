/**
 * Control effects on one target (plain data, saved as is): stun with diminishing durations
 * (D017 / D018), one movement slow (D019), knockback (D195) and the boss limits (D020).
 */
export interface ControlState {
  boss: boolean;
  stunLeft: number;
  /** Successful stuns in the current series (0..3); the 4th attempt meets the temporary immunity. */
  stunSteps: number;
  /** Seconds since the last successful stun ended (the series resets at 10 s). */
  sinceStun: number;
  slowPower: number;
  slowLeft: number;
  /** Forced movement: velocity and time left (0.25 s in all). */
  knock: { vx: number; vz: number; left: number } | null;
}

export const STUN_STEPS = [1, 0.5, 0.25];
export const STUN_RESET = 10;
export const KNOCK_TIME = 0.25;
export const BOSS_SLOW = { power: 0.2, dur: 2 };

export function newControl(boss = false): ControlState {
  return { boss, stunLeft: 0, stunSteps: 0, sinceStun: 0, slowPower: 0, slowLeft: 0, knock: null };
}

/**
 * D017 / D018 / D020: tries to stun for `base` seconds. Returns the applied duration (0 when it
 * was ignored: boss, already stunned, or the temporary immunity after three stuns).
 */
export function applyStun(c: ControlState, base: number): number {
  if (c.boss || base <= 0) return 0;
  if (c.stunLeft > 0) return 0;
  if (c.stunSteps >= STUN_STEPS.length) return 0;
  const d = base * STUN_STEPS[c.stunSteps];
  c.stunSteps++;
  c.stunLeft = d;
  c.sinceStun = 0;
  return d;
}

/** D019 / D020: one slow; stronger replaces, equal refreshes, weaker is ignored. Returns true when taken. */
export function applySlow(c: ControlState, power: number, dur: number): boolean {
  let p = power;
  let d = dur;
  if (c.boss) {
    p = Math.min(p, BOSS_SLOW.power);
    d = Math.min(d, BOSS_SLOW.dur);
  }
  if (p <= 0 || d <= 0) return false;
  const active = c.slowLeft > 0 ? c.slowPower : 0;
  if (p + 1e-9 < active) return false;
  c.slowPower = p;
  c.slowLeft = d;
  return true;
}

/** D195 / D020: knockback over 0.25 s away from (fromX, fromZ); a running one ignores a new one. */
export function applyKnock(c: ControlState, x: number, z: number, fromX: number, fromZ: number, dist: number): boolean {
  if (c.boss || dist <= 0 || c.knock) return false;
  let dx = x - fromX;
  let dz = z - fromZ;
  const l = Math.hypot(dx, dz);
  if (l < 1e-6) {
    dx = 0;
    dz = 1;
  } else {
    dx /= l;
    dz /= l;
  }
  const v = dist / KNOCK_TIME;
  c.knock = { vx: dx * v, vz: dz * v, left: KNOCK_TIME };
  return true;
}

/** Advances the timers. Returns the knockback displacement of this tick (the caller moves the body). */
export function tickControl(c: ControlState, dt: number): { dx: number; dz: number } {
  if (c.stunLeft > 0) {
    const used = Math.min(dt, c.stunLeft);
    c.stunLeft -= used;
    if (c.stunLeft <= 1e-9) {
      c.stunLeft = 0;
      c.sinceStun = dt - used;
    }
  } else if (c.stunSteps > 0) {
    c.sinceStun += dt;
    if (c.sinceStun >= STUN_RESET) {
      c.stunSteps = 0;
      c.sinceStun = 0;
    }
  }
  if (c.slowLeft > 0) {
    c.slowLeft = Math.max(0, c.slowLeft - dt);
    if (c.slowLeft === 0) c.slowPower = 0;
  }
  let dx = 0;
  let dz = 0;
  if (c.knock) {
    const t = Math.min(dt, c.knock.left);
    dx = c.knock.vx * t;
    dz = c.knock.vz * t;
    c.knock.left -= t;
    if (c.knock.left <= 1e-9) c.knock = null;
  }
  return { dx, dz };
}

export function currentSlow(c: ControlState): number {
  return c.slowLeft > 0 ? c.slowPower : 0;
}

/** Stunned or knocked back: no own movement or actions. */
export function controlled(c: ControlState): boolean {
  return c.stunLeft > 0 || !!c.knock;
}

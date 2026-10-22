import type { MotorGround } from '../motor';
import { applyKnock, controlled, currentSlow, newControl, tickControl, type ControlState } from './control';
import { ENEMY_BY_ID, isBoss, type EnemyDef } from './data';
import type { WeaponFamily } from './data';

/**
 * Enemies of the test scene (Bestiary: Серый волк, Серый Клык) with the D196 / D197 behaviour:
 * detection with line of sight, aggressive / territorial start, same-species help within 10 m,
 * chase limited by the 35 m leash (3 s outside → return), return after 5 s without a path,
 * healing 10 % / s at home, participation reset after return AND full health (D038), one
 * attack at a time, the special attack first when ready, a 1 s pause after it. Plain data.
 */
export type EnemyMode = 'idle' | 'chase' | 'return' | 'dead';

export interface EnemyWindup {
  kind: 'normal' | 'special';
  t: number;
  dur: number;
  /** Special: the spot fixed at the start of the windup (D197). */
  sx: number;
  sz: number;
}

export interface EnemyState {
  uid: string;
  def: string;
  homeX: number;
  homeZ: number;
  /** Territorial enemies: radius of the guarded area around home. */
  territory: number;
  x: number;
  y: number;
  z: number;
  fx: number;
  fz: number;
  hp: number;
  mode: EnemyMode;
  ctl: ControlState;
  atkCd: number;
  specialCd: number;
  pause: number;
  windup: EnemyWindup | null;
  outLeash: number;
  noPath: number;
  /** True once the enemy has reached home after a return (with full HP the participation resets). */
  atHome: boolean;
  /** D035–D039: HP actually removed by the hero in the current participation period. */
  part: number;
  /** D032: ОМ already given per weapon family by this life. */
  omUsed: Record<WeaponFamily, number>;
  /** Life counter (a respawn starts a new life). */
  life: number;
  /** Active seconds until the respawn may happen (dead only). */
  respawnLeft: number;
  /** Walk cycle for the renderer. */
  anim: number;
  moving: boolean;
}

export const ENEMY_RADIUS = 0.55;
export const ENEMY_HEIGHT = 1.1;
/** D196: same-species help radius. */
export const HELP_RADIUS = 10;
export const LEASH_GRACE = 3;
export const NO_PATH_GIVE_UP = 5;
export const HOME_HEAL = 0.1;
export const SPECIAL_PAUSE = 1;
/** Animals step up this much while walking (technical). */
const ENEMY_STEP = 0.55;

export function enemyDef(e: EnemyState): EnemyDef {
  return ENEMY_BY_ID[e.def];
}

export function newEnemy(uid: string, def: string, x: number, z: number, y: number, territory = 0): EnemyState {
  const d = ENEMY_BY_ID[def];
  return {
    uid, def, homeX: x, homeZ: z, territory, x, y, z, fx: 0, fz: 1, hp: d.hp, mode: 'idle', ctl: newControl(isBoss(d.rank)),
    atkCd: 0, specialCd: 0, pause: 0, windup: null, outLeash: 0, noPath: 0, atHome: true, part: 0,
    omUsed: { sword: 0, bow: 0, staff: 0 }, life: 1, respawnLeft: 0, anim: 0, moving: false,
  };
}

export interface EnemyCtx {
  ground: MotorGround;
  hero: { x: number; y: number; z: number; alive: boolean };
  los(ax: number, ay: number, az: number, bx: number, by: number, bz: number): boolean;
  /** A normal attack or a special resolves: the system applies it to the hero if he is hit. */
  attackStart(e: EnemyState, kind: 'normal' | 'special'): void;
  attackHit(e: EnemyState, kind: 'normal' | 'special'): void;
  /** May a dead enemy come back now (hero ≥ 80 m away and the spot out of view)? */
  canRespawn(e: EnemyState): boolean;
  onRespawn?(e: EnemyState): void;
}

/** Moves toward (tx, tz) by `step` metres; returns false when the way is blocked. */
function walk(e: EnemyState, g: MotorGround, tx: number, tz: number, step: number): boolean {
  const dx = tx - e.x;
  const dz = tz - e.z;
  const l = Math.hypot(dx, dz);
  if (l < 1e-6) return true;
  const s = Math.min(step, l);
  const ux = dx / l;
  const uz = dz / l;
  e.fx = ux;
  e.fz = uz;
  const ok = (x: number, z: number) => !g.wall(x, z) && g.top(x, z) - e.y <= ENEMY_STEP;
  const tries: [number, number][] = [
    [e.x + ux * s, e.z + uz * s],
    [e.x + ux * s, e.z],
    [e.x, e.z + uz * s],
  ];
  for (const [nx, nz] of tries) {
    if ((nx !== e.x || nz !== e.z) && ok(nx, nz)) {
      e.x = nx;
      e.z = nz;
      e.y = g.top(nx, nz);
      return true;
    }
  }
  return false;
}

/** Forced movement (knockback): walls and high steps shorten it; edges may drop the body. */
function shove(e: EnemyState, g: MotorGround, dx: number, dz: number) {
  const nx = e.x + dx;
  const nz = e.z + dz;
  if (g.wall(nx, nz) || g.top(nx, nz) - e.y > ENEMY_STEP) return;
  e.x = nx;
  e.z = nz;
  e.y = g.top(nx, nz);
}

/** D196: the enemy takes up the fight; idle enemies of the same species within 10 m join. */
export function aggro(e: EnemyState, all: EnemyState[]) {
  if (e.mode === 'dead') return;
  const was = e.mode;
  e.mode = 'chase';
  e.outLeash = 0;
  e.noPath = 0;
  e.atHome = false;
  if (was === 'chase') return;
  for (const o of all)
    if (o !== e && o.def === e.def && o.mode === 'idle' && Math.hypot(o.x - e.x, o.z - e.z) <= HELP_RADIUS) {
      o.mode = 'chase';
      o.outLeash = 0;
      o.noPath = 0;
      o.atHome = false;
    }
}

/** D196: damage makes an idle enemy answer; a returning one answers only if the hero is inside its leash. */
export function onDamaged(e: EnemyState, all: EnemyState[], heroX: number, heroZ: number) {
  if (e.mode === 'idle') aggro(e, all);
  else if (e.mode === 'return' && Math.hypot(heroX - e.homeX, heroZ - e.homeZ) <= enemyDef(e).leash) aggro(e, all);
}

function startReturn(e: EnemyState) {
  e.mode = 'return';
  e.windup = null;
  e.outLeash = 0;
  e.noPath = 0;
}

export function respawn(e: EnemyState, g: MotorGround) {
  const d = enemyDef(e);
  e.x = e.homeX;
  e.z = e.homeZ;
  e.y = g.top(e.x, e.z);
  e.hp = d.hp;
  e.mode = 'idle';
  e.ctl = newControl(isBoss(d.rank));
  e.atkCd = e.specialCd = e.pause = 0;
  e.windup = null;
  e.outLeash = e.noPath = 0;
  e.atHome = true;
  e.part = 0;
  e.omUsed = { sword: 0, bow: 0, staff: 0 };
  e.life++;
  e.respawnLeft = 0;
}

export function killEnemy(e: EnemyState) {
  e.hp = 0;
  e.mode = 'dead';
  e.windup = null;
  e.ctl.knock = null;
  e.respawnLeft = enemyDef(e).respawnMin * 60;
}

/** One AI step of `dt` active seconds. */
export function updateEnemy(e: EnemyState, all: EnemyState[], ctx: EnemyCtx, dt: number) {
  const d = enemyDef(e);
  const g = ctx.ground;
  e.moving = false;
  if (e.mode === 'dead') {
    e.respawnLeft = Math.max(0, e.respawnLeft - dt);
    if (e.respawnLeft <= 0 && ctx.canRespawn(e)) {
      respawn(e, g);
      ctx.onRespawn?.(e);
    }
    return;
  }
  const kn = tickControl(e.ctl, dt);
  if (kn.dx || kn.dz) shove(e, g, kn.dx, kn.dz);
  e.atkCd = Math.max(0, e.atkCd - dt);
  e.specialCd = Math.max(0, e.specialCd - dt);
  e.pause = Math.max(0, e.pause - dt);
  // D194 / D195: stun and knockback cancel an unfinished attack and stop own movement
  if (controlled(e.ctl)) {
    e.windup = null;
    return;
  }
  const h = ctx.hero;
  const speed = d.speed * (1 - currentSlow(e.ctl));
  const dist = Math.hypot(h.x - e.x, h.z - e.z);
  const heroFromHome = Math.hypot(h.x - e.homeX, h.z - e.homeZ);
  const eye = (y: number) => y + ENEMY_HEIGHT * 0.8;
  const sees = () => h.alive && ctx.los(e.x, eye(e.y), e.z, h.x, h.y + 1.2, h.z);
  if (e.mode === 'idle') {
    const atHome = Math.hypot(e.x - e.homeX, e.z - e.homeZ) <= 0.6;
    if (atHome && e.hp < d.hp) e.hp = Math.min(d.hp, e.hp + HOME_HEAL * d.hp * dt);
    // D038: both conditions — back home after a return and fully healed
    if (atHome && e.hp >= d.hp && e.atHome) e.part = 0;
    const inArea = d.behavior === 'aggressive' || heroFromHome <= e.territory;
    if (h.alive && dist <= d.detect && inArea && sees()) aggro(e, all);
    return;
  }
  if (e.mode === 'return') {
    e.windup = null;
    const hd = Math.hypot(e.homeX - e.x, e.homeZ - e.z);
    if (hd <= 0.5) {
      e.mode = 'idle';
      e.atHome = true;
      return;
    }
    // returning enemies are not stopped by terrain: they walk, and slide home if stuck (no teleport to the hero)
    if (!walk(e, g, e.homeX, e.homeZ, speed * dt)) {
      e.noPath += dt;
      if (e.noPath > NO_PATH_GIVE_UP) {
        e.x = e.homeX;
        e.z = e.homeZ;
        e.y = g.top(e.x, e.z);
      }
    } else e.noPath = 0;
    e.moving = true;
    e.anim += dt * speed * 2.4;
    return;
  }
  // chase
  if (!h.alive) return startReturn(e);
  if (heroFromHome > d.leash) {
    e.outLeash += dt;
    if (e.outLeash >= LEASH_GRACE) return startReturn(e);
  } else e.outLeash = 0;
  if (e.windup) {
    const w = e.windup;
    w.t += dt;
    if (w.kind === 'normal') {
      const l = Math.hypot(h.x - e.x, h.z - e.z) || 1;
      e.fx = (h.x - e.x) / l;
      e.fz = (h.z - e.z) / l;
    }
    if (w.t >= w.dur) {
      e.windup = null;
      if (w.kind === 'special') {
        // the leap lands on the spot fixed at the start
        const l = Math.hypot(w.sx - e.x, w.sz - e.z);
        if (l > 0.01) {
          e.fx = (w.sx - e.x) / l;
          e.fz = (w.sz - e.z) / l;
        }
        if (!g.wall(w.sx, w.sz) && Math.abs(g.top(w.sx, w.sz) - e.y) <= 2) {
          e.x = w.sx;
          e.z = w.sz;
          e.y = g.top(w.sx, w.sz);
        }
        ctx.attackHit(e, 'special');
        e.pause = SPECIAL_PAUSE;
      } else ctx.attackHit(e, 'normal');
    }
    return;
  }
  const canSee = sees();
  // D197: the special attack first when it is ready and in reach
  const sp = d.special;
  if (sp && e.specialCd <= 0 && e.pause <= 0 && dist <= sp.range && canSee) {
    const l = dist || 1;
    const k = Math.min(1, sp.range / l);
    e.windup = { kind: 'special', t: 0, dur: sp.windup, sx: e.x + (h.x - e.x) * k, sz: e.z + (h.z - e.z) * k };
    e.specialCd = sp.cd;
    ctx.attackStart(e, 'special');
    return;
  }
  const reach = d.range + ENEMY_RADIUS * 0.5;
  if (dist <= reach && canSee) {
    e.noPath = 0;
    const l = dist || 1;
    e.fx = (h.x - e.x) / l;
    e.fz = (h.z - e.z) / l;
    if (e.atkCd <= 0 && e.pause <= 0) {
      e.windup = { kind: 'normal', t: 0, dur: d.windup, sx: h.x, sz: h.z };
      e.atkCd = d.interval;
      ctx.attackStart(e, 'normal');
    }
    return;
  }
  // close in (stop a little inside the reach)
  const moved = walk(e, g, h.x, h.z, Math.min(speed * dt, Math.max(0, dist - d.range * 0.8)));
  if (!moved) {
    e.noPath += dt;
    if (e.noPath >= NO_PATH_GIVE_UP) return startReturn(e);
  } else {
    e.noPath = 0;
    e.moving = true;
    e.anim += dt * speed * 2.4;
  }
}

/** Keeps enemies from standing inside each other (technical). */
export function separate(all: EnemyState[], g: MotorGround) {
  for (let i = 0; i < all.length; i++)
    for (let j = i + 1; j < all.length; j++) {
      const a = all[i];
      const b = all[j];
      if (a.mode === 'dead' || b.mode === 'dead') continue;
      const ra = ENEMY_RADIUS * enemyDef(a).scale;
      const rb = ENEMY_RADIUS * enemyDef(b).scale;
      const dx = b.x - a.x;
      const dz = b.z - a.z;
      const l = Math.hypot(dx, dz);
      const min = ra + rb;
      if (l >= min || l < 1e-6) continue;
      const push = (min - l) / 2;
      const ux = dx / l;
      const uz = dz / l;
      for (const [e, s] of [[a, -1], [b, 1]] as [EnemyState, number][]) {
        const nx = e.x + ux * push * s;
        const nz = e.z + uz * push * s;
        if (!g.wall(nx, nz) && Math.abs(g.top(nx, nz) - e.y) <= ENEMY_STEP) {
          e.x = nx;
          e.z = nz;
          e.y = g.top(nx, nz);
        }
      }
    }
}

export { applyKnock };

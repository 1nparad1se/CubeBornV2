import { DODGE, FALL_TABLE, GRAVITY, HERO_BODY, JUMP2, JUMP_V0, SPEED, SPRINT, SUPPORT, WATER, roundDamage } from './config';
import type { HeroState } from './hero';

/** What the motor needs to know about the ground (1 unit = 1 m = 1 block). */
export interface MotorGround {
  /** Top of the ground under (x, z): the walking surface, or the bed under water. Flat block tops. */
  top(x: number, z: number): number;
  /** Impassable at any height (map border, solid cells). */
  wall(x: number, z: number): boolean;
  /** Water surface height over (x, z), or null on dry land. */
  water(x: number, z: number): number | null;
}

/** One tick of player intentions (filled from keyboard and mouse by the scene). */
export interface MotorIntent {
  /** Wanted movement in world x / z (camera relative, length ≤ 1). */
  moveX: number;
  moveZ: number;
  /** Wanted body facing (world x / z); ignored during a dodge. */
  faceX: number;
  faceZ: number;
  sprintHeld: boolean;
  /** Edge presses (one tick each). */
  sprintPressed: boolean;
  jumpPressed: boolean;
  dodgePressed: boolean;
}

export const NO_INTENT: MotorIntent = { moveX: 0, moveZ: 0, faceX: 0, faceZ: 0, sprintHeld: false, sprintPressed: false, jumpPressed: false, dodgePressed: false };

export type MotorMode = 'ground' | 'air' | 'swim';

export type MotorEvent =
  | { type: 'jump'; air: boolean }
  | { type: 'jumpDenied'; reason: 'stun' | 'dodge' | 'used' }
  | { type: 'land'; height: number; damage: number; death: boolean }
  | { type: 'water'; height: number; damage: number; death: boolean }
  | { type: 'dodge' }
  | { type: 'dodgeDenied'; reason: 'air' | 'stun' | 'cooldown' | 'st' | 'busy' | 'swim' }
  | { type: 'dodgeEnd'; buffered: string | null }
  | { type: 'sprintEmpty' };

export interface DodgeState {
  /** Seconds since the dodge started. */
  t: number;
  dirX: number;
  dirZ: number;
  /** Horizontal speed (m/s): distance / duration, shortened by the slow fixed at the start (D171, D179). */
  speed: number;
}

/** D191: the fall table; returns the damage share of max HP, or 'death' above 20 m. */
export function fallShare(height: number): number | 'death' {
  for (const row of FALL_TABLE) if (height <= row.upTo + 1e-9) return row.share;
  return 'death';
}

/** D191 / D006: fall damage in HP for a fall of `height` metres (Infinity = death). */
export function fallDamage(height: number, maxHp: number): number {
  const s = fallShare(height);
  if (s === 'death') return Infinity;
  return s > 0 ? roundDamage(s * maxHp) : 0;
}

/**
 * Hero movement of the RPG test scene: walk / run / sprint (D180–D183), both jumps (D184–D190,
 * D193), falls and fall damage (D190–D192), surface swimming (D193), the dodge (D167–D179) and
 * support / steps / air control (D212). Pure logic over a MotorGround; no rendering.
 */
export class HeroMotor {
  x: number;
  y: number;
  z: number;
  vx = 0;
  vy = 0;
  vz = 0;
  /** Body facing (unit vector). */
  fx = 0;
  fz = -1;
  mode: MotorMode = 'ground';
  /** D188 / D189: the one extra air jump is still available. */
  airJumpReady = true;
  /** D190: the highest point since the hero left support (fall height is measured from it). */
  fallTop = 0;
  /** Horizontal speed at take-off (D193 / D212 air-control limit). */
  launchSpeed = 0;
  /** Caps Lock: walking instead of running. */
  walk = false;
  /** Sprint button pressed with ≥ 10 ST and still held (D182, D210). */
  sprintArmed = false;
  /** Actually sprinting this tick (forward, on the ground, with ST). */
  sprinting = false;
  dodge: DodgeState | null = null;
  dodgeCd = 0;
  /** D178: the latest attack / skill press of the last 0.15 s of a dodge. */
  buffered: string | null = null;
  stunLeft = 0;
  /** Movement slow 0..1 (one effect, D019); set by effects. */
  slow = 0;
  /** Speed factor of the current combat state (block 50 %, aim / preparation 70 %; D166, D194, D195). */
  moveMul = 1;
  /** Sprint is not allowed now (block, aim, preparation). */
  noSprint = false;
  /** Visual easing of steps (renderer adds it to y). */
  stepY = 0;

  constructor(private g: MotorGround, x: number, z: number) {
    this.x = x;
    this.z = z;
    this.y = g.top(x, z);
    this.fallTop = this.y;
  }

  get stunned(): boolean {
    return this.stunLeft > 0;
  }
  get dodging(): boolean {
    return this.dodge !== null;
  }
  /** D168: invulnerable during the first 0.2 s of a dodge. */
  get invulnerable(): boolean {
    return !!this.dodge && this.dodge.t < DODGE.iframes;
  }
  get onGround(): boolean {
    return this.mode === 'ground';
  }
  get speed(): number {
    return Math.hypot(this.vx, this.vz);
  }

  /** Stops sprint and anything held (a full-screen menu opened, D208). */
  releaseHeld() {
    this.sprintArmed = false;
    this.sprinting = false;
  }

  /**
   * An attack or skill press. Returns true when it may start now; during a dodge it is refused
   * (D176) and kept only within the last 0.15 s (D178, the latest press replaces an older one).
   */
  pressAction(id: string): boolean {
    const d = this.dodge;
    if (!d) return !this.stunned;
    if (d.t >= DODGE.duration - DODGE.buffer - 1e-9) this.buffered = id;
    return false;
  }

  /**
   * External stun (or knockback). Prevented inside the dodge's invulnerability window (D169);
   * after it, it interrupts the dodge and clears the buffered press (D177). Returns false when
   * prevented.
   */
  applyStun(seconds: number): boolean {
    if (this.invulnerable) return false;
    if (this.dodge) {
      this.dodge = null;
      this.buffered = null;
    }
    if (this.stunLeft > 0) return true; // D018: a stun on a stunned target is ignored
    this.stunLeft = seconds;
    this.releaseHeld();
    return true;
  }

  update(dt: number, it: MotorIntent, hero: HeroState): MotorEvent[] {
    const ev: MotorEvent[] = [];
    if (!(dt > 0)) return ev;
    if (this.dodgeCd > 0) this.dodgeCd = Math.max(0, this.dodgeCd - dt);
    if (this.stunLeft > 0) this.stunLeft = Math.max(0, this.stunLeft - dt);
    const dead = hero.dead;
    // ------------------------------------------------ facing
    if (!this.dodge && !dead) {
      const fl = Math.hypot(it.faceX, it.faceZ);
      if (fl > 1e-6) {
        this.fx = it.faceX / fl;
        this.fz = it.faceZ / fl;
      }
    }
    // ------------------------------------------------ sprint button (D181, D182, D193, D210)
    if (!it.sprintHeld) this.sprintArmed = false;
    else if (it.sprintPressed && this.mode === 'ground' && hero.st >= SPRINT.minToStart) this.sprintArmed = true;
    // ------------------------------------------------ jump (D184–D189, D193)
    if (it.jumpPressed && !dead) {
      if (this.stunned) ev.push({ type: 'jumpDenied', reason: 'stun' });
      else if (this.dodge) ev.push({ type: 'jumpDenied', reason: 'dodge' });
      else if (this.mode === 'ground' || this.mode === 'swim') {
        if (this.mode === 'swim') {
          const s = this.g.water(this.x, this.z);
          if (s !== null) this.y = Math.max(this.y, s);
        }
        this.takeOff(JUMP_V0);
        ev.push({ type: 'jump', air: false });
      } else if (this.airJumpReady) {
        // D187: the vertical speed is replaced by the jump impulse; D190: the fall top stays
        this.airJumpReady = false;
        this.vy = JUMP_V0;
        ev.push({ type: 'jump', air: true });
      } else ev.push({ type: 'jumpDenied', reason: 'used' });
    }
    // ------------------------------------------------ dodge (D167, D170, D171, D173, D174, D179)
    if (it.dodgePressed && !dead) {
      const deny = this.dodge ? 'busy' : this.mode === 'swim' ? 'swim' : this.mode !== 'ground' ? 'air' : this.stunned ? 'stun' : this.dodgeCd > 0 ? 'cooldown' : hero.st < hero.mods.dodgeCost ? 'st' : null;
      if (deny) ev.push({ type: 'dodgeDenied', reason: deny });
      else {
        hero.spendSt(hero.mods.dodgeCost);
        this.dodgeCd = DODGE.cooldown;
        let dx = it.moveX;
        let dz = it.moveZ;
        const l = Math.hypot(dx, dz);
        if (l > 0.08) {
          dx /= l;
          dz /= l;
        } else {
          // no direction: backwards relative to the body (D170)
          dx = -this.fx;
          dz = -this.fz;
        }
        const slow = Math.min(1, Math.max(0, this.slow));
        this.dodge = { t: 0, dirX: dx, dirZ: dz, speed: (DODGE.distance * (1 - slow)) / DODGE.duration };
        this.buffered = null;
        this.sprinting = false;
        ev.push({ type: 'dodge' });
      }
    }
    // ------------------------------------------------ horizontal velocity
    let ix = dead || this.stunned ? 0 : it.moveX;
    let iz = dead || this.stunned ? 0 : it.moveZ;
    const il = Math.hypot(ix, iz);
    if (il > 1) {
      ix /= il;
      iz /= il;
    }
    const moving = il > 0.08;
    const slowMul = 1 - Math.min(1, Math.max(0, this.slow));
    let sprintNow = false;
    if (this.dodge) {
      this.vx = this.dodge.dirX * this.dodge.speed;
      this.vz = this.dodge.dirZ * this.dodge.speed;
    } else if (this.mode === 'air') {
      // D193 / D212: steer freely, never faster than at take-off (2.5 m/s after a standing start)
      const cap = Math.max(this.launchSpeed, JUMP2.airMin * slowMul);
      const k = 1 - Math.exp(-JUMP2.airAccel * dt);
      this.vx += (ix * cap - this.vx) * k;
      this.vz += (iz * cap - this.vz) * k;
      const s = Math.hypot(this.vx, this.vz);
      if (s > cap) {
        this.vx *= cap / s;
        this.vz *= cap / s;
      }
    } else {
      let speed = this.mode === 'swim' ? SPEED.swim : this.walk ? SPEED.walk : SPEED.run;
      if (this.mode === 'ground' && this.sprintArmed && !this.noSprint && moving && hero.st > 0) {
        // D183: forward and front diagonals relative to the body only
        const cos = (ix * this.fx + iz * this.fz) / Math.max(1e-6, Math.hypot(ix, iz));
        const forward = cos >= Math.cos((SPRINT.maxAngleDeg * Math.PI) / 180);
        // D182 / D210: every start (also after a stop) needs ≥ 10 ST; a started sprint runs to 0
        if (forward && (this.sprinting || hero.st >= SPRINT.minToStart)) sprintNow = true;
      }
      if (sprintNow) speed = SPEED.sprint;
      speed *= slowMul * this.moveMul;
      const k = 1 - Math.exp(-30 * dt);
      this.vx += (ix * speed - this.vx) * k;
      this.vz += (iz * speed - this.vz) * k;
    }
    this.sprinting = sprintNow;
    if (sprintNow) {
      hero.spendSt(hero.mods.sprintCost * dt);
      if (hero.st <= 0) {
        // D181 / D182: back to running; a new press (with ≥ 10 ST) is needed
        this.sprinting = false;
        this.sprintArmed = false;
        ev.push({ type: 'sprintEmpty' });
      }
    }
    // ------------------------------------------------ move with collision
    const mx = this.vx * dt;
    const mz = this.vz * dt;
    const subs = Math.max(1, Math.ceil(Math.max(Math.abs(mx), Math.abs(mz)) / 0.2));
    for (let s = 0; s < subs; s++) this.moveAxis(mx / subs, mz / subs);
    // ------------------------------------------------ vertical
    if (this.mode === 'air') this.updateAir(dt, hero, ev);
    else if (this.mode === 'ground') this.followGround(hero, ev);
    else this.updateSwim();
    // ------------------------------------------------ dodge timer (D167, D178)
    if (this.dodge) {
      this.dodge.t += dt;
      if (this.dodge.t >= DODGE.duration) {
        this.dodge = null;
        // the dodge covers its distance and stops (no slide past 3 m)
        if (this.mode === 'ground') this.vx = this.vz = 0;
        const b = this.buffered;
        this.buffered = null;
        ev.push({ type: 'dodgeEnd', buffered: b });
      }
    }
    this.stepY *= Math.exp(-30 * dt);
    if (Math.abs(this.stepY) < 1e-3) this.stepY = 0;
    return ev;
  }

  private takeOff(v0: number) {
    this.mode = 'air';
    this.vy = v0;
    this.fallTop = this.y;
    this.launchSpeed = Math.hypot(this.vx, this.vz);
    // D193: sprint ends at take-off; a new press is needed after landing
    this.sprinting = false;
    this.sprintArmed = false;
  }

  /** Height the feet may move into horizontally (block tops above it are walls). */
  private reach(): number {
    if (this.mode === 'air') return this.y + SUPPORT.airTol;
    if (this.mode === 'swim') {
      const s = this.g.water(this.x, this.z);
      return (s ?? this.y) + SUPPORT.step;
    }
    return this.y + SUPPORT.step + 1e-6;
  }

  private free(x: number, z: number, limit: number): boolean {
    return !this.g.wall(x, z) && this.g.top(x, z) <= limit;
  }

  private moveAxis(mx: number, mz: number) {
    const r = HERO_BODY.radius;
    const lim = this.reach();
    if (mx !== 0) {
      const nx = this.x + mx;
      const ex = nx + (mx > 0 ? r : -r);
      if (this.free(ex, this.z - r * 0.9, lim) && this.free(ex, this.z, lim) && this.free(ex, this.z + r * 0.9, lim)) this.x = nx;
      else this.vx = 0;
    }
    if (mz !== 0) {
      const nz = this.z + mz;
      const ez = nz + (mz > 0 ? r : -r);
      if (this.free(this.x - r * 0.9, ez, lim) && this.free(this.x, ez, lim) && this.free(this.x + r * 0.9, ez, lim)) this.z = nz;
      else this.vz = 0;
    }
  }

  /** The highest block top under the footprint that is not above `limit` (what the feet rest on). */
  private support(limit: number): number {
    const r = HERO_BODY.radius * 0.7;
    let best = -Infinity;
    for (const [dx, dz] of [[0, 0], [r, r], [-r, r], [r, -r], [-r, -r]]) {
      const t = this.g.top(this.x + dx, this.z + dz);
      if (t <= limit && t > best) best = t;
    }
    return best === -Infinity ? this.g.top(this.x, this.z) : best;
  }

  /** Water under the centre deep enough to swim: its surface, else null. */
  private swimSurface(): number | null {
    const s = this.g.water(this.x, this.z);
    if (s === null) return null;
    return s - this.g.top(this.x, this.z) >= WATER.swimDepth ? s : null;
  }

  private followGround(hero: HeroState, ev: MotorEvent[]) {
    const s = this.support(this.y + SUPPORT.step + 1e-6);
    if (s >= this.y) {
      this.stepY -= s - this.y;
      this.y = s;
    } else if (this.y - s <= SUPPORT.step + 1e-6) {
      this.stepY += this.y - s;
      this.y = s;
    } else {
      // D189: walking off an edge is a fall; the air jump stays available
      this.mode = 'air';
      this.vy = 0;
      this.fallTop = this.y;
      this.launchSpeed = this.dodge ? 0 : Math.hypot(this.vx, this.vz);
      this.sprinting = false;
      this.sprintArmed = false;
      this.updateAir(0, hero, ev);
      return;
    }
    // wading into water that is deep enough to swim
    const sw = this.swimSurface();
    if (sw !== null && this.y < sw - WATER.sink + 1e-6) this.enterSwim(sw);
  }

  private updateAir(dt: number, hero: HeroState, ev: MotorEvent[]) {
    const y0 = this.y;
    this.y += this.vy * dt - 0.5 * GRAVITY * dt * dt;
    this.vy -= GRAVITY * dt;
    if (this.y > this.fallTop) this.fallTop = this.y;
    // D192: entering water; the depth is taken at the entry point
    const surf = this.g.water(this.x, this.z);
    if (surf !== null && this.vy <= 0 && this.y <= surf) {
      const bed = this.g.top(this.x, this.z);
      const depth = surf - bed;
      if (depth >= WATER.swimDepth) {
        // deep enough to swim: no damage at ≥ 2 m, otherwise the fall counts to the bed
        const h = depth >= WATER.safeDepth ? 0 : this.fallTop - bed;
        const dmg = depth >= WATER.safeDepth ? 0 : fallDamage(h, hero.maxHp);
        const death = !Number.isFinite(dmg);
        if (death) hero.kill();
        else if (dmg > 0) hero.takeDamage(dmg);
        ev.push({ type: 'water', height: this.fallTop - surf, damage: Number.isFinite(dmg) ? dmg : hero.maxHp, death });
        this.enterSwim(surf);
        return;
      }
    }
    const s = this.support(Math.max(y0, this.y) + SUPPORT.airTol);
    if (this.vy <= 0 && this.y <= s) {
      this.y = s;
      this.land(hero, ev);
    }
  }

  private land(hero: HeroState, ev: MotorEvent[]) {
    const h = Math.max(0, this.fallTop - this.y);
    const dmg = fallDamage(h, hero.maxHp);
    const death = !Number.isFinite(dmg);
    if (death) hero.kill();
    else if (dmg > 0) hero.takeDamage(dmg);
    this.mode = 'ground';
    this.vy = 0;
    this.airJumpReady = true;
    this.fallTop = this.y;
    ev.push({ type: 'land', height: h, damage: Number.isFinite(dmg) ? dmg : hero.maxHp, death });
  }

  private enterSwim(surface: number) {
    this.mode = 'swim';
    this.vy = 0;
    this.y = surface - WATER.sink;
    this.fallTop = this.y;
    // D193: swimming restores the air jump; no sprint in water
    this.airJumpReady = true;
    this.sprinting = false;
    this.sprintArmed = false;
  }

  private updateSwim() {
    const sw = this.swimSurface();
    if (sw !== null) {
      this.y = sw - WATER.sink;
      return;
    }
    // out on a bank or into shallow water: stand on the ground there
    const t = this.support(Infinity);
    this.stepY += this.y - t;
    this.y = t;
    this.mode = 'ground';
    this.fallTop = this.y;
  }

  /** State for the save (D040: air jump use and fall top belong to the full snapshot, D188 / D190). */
  toSave(): MotorSave {
    return {
      x: this.x, y: this.y, z: this.z, vx: this.vx, vy: this.vy, vz: this.vz, fx: this.fx, fz: this.fz,
      mode: this.mode, airJumpReady: this.airJumpReady, fallTop: this.fallTop, launchSpeed: this.launchSpeed, walk: this.walk,
      dodge: this.dodge ? { ...this.dodge } : null, dodgeCd: this.dodgeCd, buffered: this.buffered, stunLeft: this.stunLeft, slow: this.slow,
    };
  }

  loadSave(s: MotorSave) {
    Object.assign(this, { ...s, dodge: s.dodge ? { ...s.dodge } : null });
    // a load is a menu operation: held buttons need a new press (D208)
    this.releaseHeld();
    this.stepY = 0;
  }
}

export interface MotorSave {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  fx: number;
  fz: number;
  mode: MotorMode;
  airJumpReady: boolean;
  fallTop: number;
  launchSpeed: number;
  walk: boolean;
  dodge: DodgeState | null;
  dodgeCd: number;
  buffered: string | null;
  stunLeft: number;
  slow: number;
}

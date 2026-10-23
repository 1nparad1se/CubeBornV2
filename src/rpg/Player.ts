import { clamp } from '../core/math';
import { clearLine, findPath } from '../game/arpg/Path';
import { SLOPE } from '../game/Terrain';
import type { WeaponStats } from './items';
import { weaponType } from './weapons';
import type { World } from './World';

/**
 * Minecraft-like jump from the ground (standing or moving), plus one more jump in the air (a
 * double jump; a third press in the air does nothing until the hero lands). No dash and no
 * invulnerability. The apex (1.35 blocks) clears 1-block obstacles; walls and the map border
 * still block horizontal movement in the air.
 */
export const JUMP = {
  height: 1.35,
  airTime: 0.56,
  /** The second jump rises this far above the point where it is taken. */
  airHeight: 1.1,
  /** Jumps allowed in the air before landing. */
  airJumps: 1,
  /** Duration of the somersault of the second jump (renderer). */
  flipTime: 0.46,
  /** Presses this early still count once the hero lands (s). */
  buffer: 0.14,
  /** Landing recovery (s) before the next jump. */
  landLag: 0.08,
};

/** Gravity of the jump arc: the ground jump peaks at JUMP.height after half of JUMP.airTime. */
const GRAVITY = (8 * JUMP.height) / (JUMP.airTime * JUMP.airTime);

interface AttackState {
  weapon: WeaponStats | null;
  /** Seconds since the attack started. */
  t: number;
  dur: number;
  hitAt: number;
  done: boolean;
  dirX: number;
  dirZ: number;
  /** Counter for the renderer (one per attack). */
  seq: number;
}

/** The hero on the training ground: walking, jumping, facing and basic attacks. */
export class RpgPlayer {
  x: number;
  z: number;
  y: number;
  vx = 0;
  vz = 0;
  fx = 0;
  fz = -1;
  radius = 0.32;
  moving = false;
  /** Walk cycle phase (renderer). */
  anim = 0;
  jumpPhase: 'ground' | 'air' | 'land' = 'ground';
  jumpT = 0;
  jumpV = 0;
  private jumpBuf = 0;
  private airY0 = 0;
  private airV0 = 0;
  /** Jumps taken in the air since leaving the ground. */
  airJumps = 0;
  /** Seconds since the double jump started (renderer: somersault), -1 when none is playing. */
  airJumpT = -1;
  /** Seconds since the hero was last hit (the model plays a flinch); large when not hit lately. */
  hurtT = 99;
  /** Visual offset easing a step up or down (renderer draws the body at y + stepY). */
  stepY = 0;
  /** Walking a path without getting anywhere: time and the spot it was measured from. */
  private stuckT = 0;
  private stuckX = 0;
  private stuckZ = 0;
  private stuckRetry = false;
  path: number[] = [];
  pathI = 0;
  attack: AttackState | null = null;
  /** RPG test scene: a held action pose (sword block, bow aim, staff charge) with its progress 0..1. */
  hold: { kind: 'block' | 'aim' | 'charge'; k: number } | null = null;
  /** A driver (the RPG test scene) says the hero is in a fight: the model keeps the weapon ready. */
  inCombat = false;
  private seq = 0;
  /** Time until the next attack may start. */
  cooldown = 0;

  constructor(private w: World, x: number, z: number) {
    this.x = x;
    this.z = z;
    this.y = w.terrain.groundY(x, z);
  }

  get ground(): number {
    return this.w.terrain.groundY(this.x, this.z);
  }

  /**
   * What the feet stand on: the highest block top under any part of the body's footprint that is
   * not above the feet by more than `tol` (so the hero stands on the edge of a block instead of
   * sliding off it, and never snaps onto a block it is only touching from the side).
   */
  support(tol: number): number {
    const t = this.w.terrain;
    const r = this.radius * 0.7;
    let best = -Infinity;
    for (const [dx, dz] of [[0, 0], [r, r], [-r, r], [r, -r], [-r, -r]]) {
      const g = t.groundY(this.x + dx, this.z + dz);
      if (g <= this.y + tol && g > best) best = g;
    }
    return best === -Infinity ? this.ground : best;
  }

  get airborne(): boolean {
    return this.jumpPhase === 'air';
  }

  /** Height of the feet above the ground under them. */
  get jumpY(): number {
    return Math.max(0, this.y - this.ground);
  }

  requestJump() {
    this.jumpBuf = JUMP.buffer;
  }

  cancelAttack() {
    this.attack = null;
    this.cooldown = 0;
  }

  update(dt: number) {
    const w = this.w;
    const c = w.ctl;
    this.updateJump(dt);
    // ---------------------------------------------------------- intentions
    let ix = c.moveX;
    let iz = c.moveZ;
    const keyMove = Math.hypot(ix, iz) > 0.08;
    if (keyMove || c.clickMove) {
      // walking by hand drops the automatic attack; a swing in progress before its hit is cancelled
      w.autoAttack = false;
      if (this.attack && !this.attack.done) this.attack = null;
    }
    if (c.clickMove) {
      this.setPath(c.clickMove.x, c.clickMove.z);
      c.clickMove = null;
    }
    if (keyMove) this.path.length = 0;
    const t = w.target;
    let wantAttack = false;
    let aimX = this.fx;
    let aimZ = this.fz;
    if (t && (w.autoAttack || c.attackHeld)) {
      const reach = w.stats.range + t.radius - 0.1;
      const d = Math.hypot(t.x - this.x, t.z - this.z);
      aimX = (t.x - this.x) / (d || 1);
      aimZ = (t.z - this.z) / (d || 1);
      if (d > reach) {
        // walk into reach (melee) or into range (ranged weapons)
        if (!keyMove && !this.attack) {
          if (!this.path.length || this.repath <= 0) {
            this.setPath(t.x - aimX * (reach - 0.3), t.z - aimZ * (reach - 0.3));
            this.repath = 0.3;
          }
        }
      } else {
        this.path.length = 0;
        wantAttack = !keyMove;
      }
    } else if (c.attackHeld && !keyMove) {
      // no target: attack toward the cursor
      const dx = c.aimX - this.x;
      const dz = c.aimZ - this.z;
      const d = Math.hypot(dx, dz);
      if (d > 0.05) {
        aimX = dx / d;
        aimZ = dz / d;
      }
      this.path.length = 0;
      wantAttack = true;
    }
    this.repath -= dt;
    if (!keyMove && this.path.length) {
      [ix, iz] = this.steer();
      this.checkStuck(dt);
      this.autoJump(ix, iz);
    } else this.stuckT = 0;
    // ---------------------------------------------------------- attacks
    this.attackStep(dt, wantAttack, aimX, aimZ);
    // feet stay planted until the hit lands
    if (this.attack && !this.attack.done) ix = iz = 0;
    // ---------------------------------------------------------- movement
    const len = Math.hypot(ix, iz);
    if (len > 1) {
      ix /= len;
      iz /= len;
    }
    this.moving = len > 0.08;
    if (this.moving && !this.attack) {
      this.fx = ix / Math.max(len, 1e-6);
      this.fz = iz / Math.max(len, 1e-6);
    }
    const speed = w.stats.moveSpeed;
    const k = 1 - Math.exp(-30 * dt);
    this.vx += (ix * speed - this.vx) * k;
    this.vz += (iz * speed - this.vz) * k;
    this.moveWithTerrain(this.vx * dt, this.vz * dt);
    this.followGround(dt);
    if (this.moving || Math.hypot(this.vx, this.vz) > 0.3) this.anim += dt * speed * 2.2;
  }

  /**
   * Basic attacks: starts one toward (aimX, aimZ) when wanted and ready, advances the one in
   * progress and resolves its hit. Also used alone by the RPG test scene (which moves the hero
   * itself). Returns true when an attack started this tick.
   */
  attackStep(dt: number, want: boolean, aimX: number, aimZ: number): boolean {
    if (this.cooldown > 0) this.cooldown -= dt;
    let started = false;
    if (want && !this.attack && this.cooldown <= 0) {
      this.startAttack(aimX, aimZ);
      started = true;
    }
    const a = this.attack;
    if (a) {
      a.t += dt;
      this.fx = a.dirX;
      this.fz = a.dirZ;
      if (!a.done && a.t >= a.dur * a.hitAt) {
        a.done = true;
        this.w.resolveAttack(a.weapon, this.w.stats.hitDamage, a.dirX, a.dirZ);
      }
      if (a.t >= a.dur) this.attack = null;
    }
    return started;
  }

  private repath = 0;
  /** The block ahead needs a double jump: jump again near the top of the first one. */
  private climbTo = -Infinity;

  /**
   * Walking a path onto a higher block: at its foot the hero jumps by itself (twice for a block
   * the first jump does not reach), then moves on over the edge once the feet are above it.
   */
  private autoJump(ix: number, iz: number) {
    const len = Math.hypot(ix, iz);
    if (len < 0.1) return;
    // the ground just ahead across the body's width (where its sides would bump into a block)
    const fx = ix / len;
    const fz = iz / len;
    const ahead = this.radius + 0.3;
    let top = -Infinity;
    for (const side of [0, -0.8, 0.8]) {
      const sx = this.x + fx * ahead - fz * this.radius * side;
      const sz = this.z + fz * ahead + fx * this.radius * side;
      top = Math.max(top, this.w.terrain.groundY(sx, sz));
    }
    // smooth slopes are walked, never hopped: only a sheer step ahead takes a jump
    const ledge = this.w.terrain.ledgeAhead(this.x, this.z, fx, fz, ahead, this.y);
    const rise = ledge > 0 ? top - this.y : 0;
    if (this.jumpPhase === 'ground' && rise > SLOPE.lip + 0.01 && rise <= SLOPE.doubleJump) {
      this.requestJump();
      this.climbTo = rise > SLOPE.jump ? top : -Infinity;
    } else if (this.airborne && this.airJumps === 0 && this.climbTo > this.y && this.jumpV < 1.2) {
      this.requestJump();
      this.climbTo = -Infinity;
    }
  }

  /**
   * A path leg that cannot be walked (a corner of a ledge the straight line clipped): after a
   * moment without progress the path is searched again once, then the order is dropped.
   */
  private checkStuck(dt: number) {
    this.stuckT += dt;
    if (this.stuckT < 0.6) return;
    const moved = Math.hypot(this.x - this.stuckX, this.z - this.stuckZ);
    this.stuckX = this.x;
    this.stuckZ = this.z;
    this.stuckT = 0;
    if (moved > 0.25) {
      this.stuckRetry = false;
      return;
    }
    if (this.stuckRetry) {
      this.path.length = 0;
      this.stuckRetry = false;
      return;
    }
    this.stuckRetry = true;
    const tx = this.path[this.path.length - 2];
    const tz = this.path[this.path.length - 1];
    this.path = findPath(this.w.terrain, this.x, this.z, tx, tz);
    this.pathI = 0;
  }

  private startAttack(dx: number, dz: number) {
    const w = this.w;
    const st = w.stats;
    const wpn = st.weapon;
    this.attack = { weapon: wpn, t: 0, dur: st.interval, hitAt: wpn?.hitAt ?? 0.45, done: false, dirX: dx, dirZ: dz, seq: ++this.seq };
    this.cooldown = st.interval;
    this.fx = dx;
    this.fz = dz;
    // fists swing like a sword; shots and spells sound when they leave
    const snd = wpn ? weaponType(wpn.kind)?.swingSound : 'slash';
    if (snd) w.fx.sound(snd, snd === 'thrust' ? 0.5 : 0.45);
  }

  private setPath(tx: number, tz: number) {
    const t = this.w.terrain;
    if (Math.hypot(tx - this.x, tz - this.z) < 0.2) {
      this.path.length = 0;
      return;
    }
    this.path = clearLine(t, this.x, this.z, tx, tz) ? [tx, tz] : findPath(t, this.x, this.z, tx, tz);
    this.pathI = 0;
    this.stuckT = 0;
    this.stuckRetry = false;
    this.stuckX = this.x;
    this.stuckZ = this.z;
  }

  private steer(): [number, number] {
    while (this.pathI < this.path.length) {
      const tx = this.path[this.pathI];
      const tz = this.path[this.pathI + 1];
      const dx = tx - this.x;
      const dz = tz - this.z;
      const d = Math.hypot(dx, dz);
      const last = this.pathI + 2 >= this.path.length;
      if (d < (last ? 0.12 : 0.35)) {
        this.pathI += 2;
        continue;
      }
      const k = last ? Math.min(1, d / 0.6 + 0.25) : 1;
      return [(dx / d) * k, (dz / d) * k];
    }
    this.path.length = 0;
    return [0, 0];
  }

  private updateJump(dt: number) {
    if (this.jumpBuf > 0 && this.jumpPhase !== 'land') this.jumpBuf -= dt;
    this.jumpT += dt;
    if (this.airJumpT >= 0) {
      this.airJumpT += dt;
      if (this.airJumpT > JUMP.flipTime) this.airJumpT = -1;
    }
    const g = this.ground;
    switch (this.jumpPhase) {
      case 'ground':
        if (this.jumpBuf > 0) {
          this.jumpBuf = 0;
          this.w.jumps++;
          this.takeOff((4 * JUMP.height) / JUMP.airTime);
          this.w.fx.sound('jump', 0.5);
        }
        break;
      case 'air': {
        if (this.jumpBuf > 0 && this.airJumps < JUMP.airJumps) {
          // double jump: a fresh arc from where the hero is, with a somersault
          this.jumpBuf = 0;
          this.airJumps++;
          this.w.jumps++;
          this.takeOff(Math.sqrt(2 * GRAVITY * JUMP.airHeight));
          this.airJumpT = 0;
          this.w.fx.burst(this.x, this.y - g + 0.1, this.z, 0xe8f0f8, 6, 1.6, 0.1, 0.3, 'smoke');
          this.w.fx.sound('jump', 0.42);
        }
        const t = this.jumpT;
        this.y = this.airY0 + this.airV0 * t - 0.5 * GRAVITY * t * t;
        this.jumpV = this.airV0 - GRAVITY * t;
        const s = this.support(0.02);
        if (this.jumpV <= 0 && this.y <= s) {
          this.y = s;
          this.land();
        }
        break;
      }
      case 'land':
        if (this.jumpT >= JUMP.landLag) this.jumpPhase = 'ground';
        break;
    }
  }

  /**
   * After moving: the feet stand exactly on the block top under them (a ledge too high to step
   * down starts a fall).
   */
  private followGround(dt: number) {
    const g = this.support(SLOPE.lip);
    if (this.jumpPhase !== 'air') {
      // the feet always stand exactly on the block top; a quarter or half block step is eased
      // for the eye only (stepY), so the body glides up and down the terraces
      if (g > this.y) {
        this.stepY -= g - this.y;
        this.y = g;
      } else if (this.y > g) {
        // walking off a ledge is a fall
        if (this.y - g > SLOPE.fall) this.takeOff(0);
        else {
          this.stepY += this.y - g;
          this.y = g;
        }
      }
    } else this.stepY = 0;
    this.stepY *= Math.exp(-30 * dt);
    if (Math.abs(this.stepY) < 1e-3) this.stepY = 0;
  }

  private takeOff(v0: number) {
    this.jumpPhase = 'air';
    this.jumpT = 0;
    this.airY0 = this.y;
    this.airV0 = v0;
    this.jumpV = v0;
  }

  private land() {
    this.jumpV = 0;
    this.airJumps = 0;
    this.jumpPhase = 'land';
    this.jumpT = 0;
    this.w.fx.burst(this.x, 0.1, this.z, 0xb8a888, 8, 2.2, 0.14, 0.4, 'smoke');
    this.w.fx.sound('land', 0.5);
  }

  private moveWithTerrain(mx: number, mz: number) {
    const t = this.w.terrain;
    const r = this.radius;
    const air = this.jumpPhase === 'air';
    const feet = this.y;
    // in the air the body may only enter ground at or below the feet: a 1-block ledge is cleared
    // once the jump lifts the feet above it (no clipping into the side of an obstacle)
    const okAir = (x: number, z: number) => {
      if (!air) return t.canWalk(this.x, this.z, x, z, feet, false);
      if (t.blocksLocal(Math.floor(x - t.ox), Math.floor(z - t.oz))) return false;
      return t.groundY(x, z) <= feet + 0.02;
    };
    const nx = this.x + mx;
    const sx = mx > 0 ? r : -r;
    if (mx === 0 || (okAir(nx + sx, this.z - r * 0.8) && okAir(nx + sx, this.z + r * 0.8))) this.x = nx;
    else this.vx = 0;
    const nz = this.z + mz;
    const sz = mz > 0 ? r : -r;
    if (mz === 0 || (okAir(this.x - r * 0.8, nz + sz) && okAir(this.x + r * 0.8, nz + sz))) this.z = nz;
    else this.vz = 0;
    this.x = clamp(this.x, t.ox + 1, t.ox + t.size - 1);
    this.z = clamp(this.z, t.oz + 1, t.oz + t.size - 1);
  }
}

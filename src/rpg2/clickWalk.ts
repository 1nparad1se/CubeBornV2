import { clearLine, findPath } from '../game/arpg/Path';
import type { Terrain } from '../game/Terrain';
import type { HeroMotor, MotorGround } from './motor';
import { SUPPORT } from './config';

/**
 * Mouse walking of the test scene, the same as the main game (owner's decision): a left click on the
 * ground orders a walk there along the main game's path search (`src/game/arpg/Path.ts`, the same
 * straight-line test and search the main hero uses); the hero follows the waypoints and jumps by
 * itself at the foot of a higher step (twice for a step above one jump). A path that makes no
 * progress is searched again once, then dropped.
 */
export class ClickWalk {
  path: number[] = [];
  private i = 0;
  private stuckT = 0;
  private best = Infinity;
  private replanned = false;

  constructor(private terrain: Terrain, private ground: MotorGround) {}

  get walking(): boolean {
    return this.i < this.path.length;
  }

  /** The current goal (last waypoint) or null. */
  get goal(): [number, number] | null {
    return this.walking ? [this.path[this.path.length - 2], this.path[this.path.length - 1]] : null;
  }

  order(fromX: number, fromZ: number, x: number, z: number) {
    const t = this.terrain;
    this.path = clearLine(t, fromX, fromZ, x, z) ? [x, z] : findPath(t, fromX, fromZ, x, z);
    this.i = 0;
    this.stuckT = 0;
    this.best = Infinity;
    this.replanned = false;
  }

  stop() {
    this.path = [];
    this.i = 0;
  }

  /**
   * The unit walking direction for this step (or null when there is nothing to walk), and whether
   * to press jump: on the ground before a step the motor cannot walk (> SUPPORT.step, 0.5 m), and once more in
   * the air near the top of the jump while the step is still higher than the feet.
   */
  steer(m: HeroMotor, dt: number): { dx: number; dz: number; jump: boolean } | null {
    while (this.i < this.path.length) {
      const last = this.i + 2 >= this.path.length;
      const d = Math.hypot(this.path[this.i] - m.x, this.path[this.i + 1] - m.z);
      if (d < (last ? 0.2 : 0.45)) {
        this.i += 2;
        this.best = Infinity;
        this.stuckT = 0;
      } else break;
    }
    if (!this.walking) {
      this.stop();
      return null;
    }
    const tx = this.path[this.i];
    const tz = this.path[this.i + 1];
    const d = Math.hypot(tx - m.x, tz - m.z);
    // no progress for a while: search once more from here, then give up the order
    if (d < this.best - 0.05) {
      this.best = d;
      this.stuckT = 0;
    } else if ((this.stuckT += dt) > 1.4) {
      if (this.replanned) {
        this.stop();
        return null;
      }
      const [gx, gz] = this.goal!;
      this.order(m.x, m.z, gx, gz);
      this.replanned = true;
      if (!this.walking) return null;
    }
    const dx = (tx - m.x) / d;
    const dz = (tz - m.z) / d;
    const ahead = this.ground.top(m.x + dx * 0.6, m.z + dz * 0.6);
    let jump = false;
    // owner (update 7): steps up to SUPPORT.step (0.5 m) are walked, never hopped; only a whole-block
    // rise that the path planned as a climb takes a jump (otherwise the hero would stand stuck)
    // (update 8: smooth slopes never take a jump, only a sheer step ahead does)
    if (m.mode === 'ground') jump = ahead - m.y > SUPPORT.step + 0.05 && this.terrain.ledgeAhead(m.x, m.z, dx, dz, 0.6, m.y) > 0;
    else if (m.mode === 'air') jump = m.airJumpReady && m.vy < 0.8 && ahead > m.y + 0.05;
    return { dx, dz, jump };
  }
}

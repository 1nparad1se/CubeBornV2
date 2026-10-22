import { GameClock, formatClock } from '../game/GameClock';
import { AUTOSAVE_SECONDS, CLOCK } from './config';

/**
 * Active play time (D021, D041, D079): one counter of seconds of unpaused play that respawns,
 * corpses, restocks and the periodic autosave count down against, plus the world clock running
 * at one game day per 60 minutes of active play (D079), starting day 1 at 08:00 (D080).
 * Sleep (stage 5) moves the clock only, never the active time.
 */
export class ActiveTime {
  /** Total seconds of active play in this playthrough. */
  seconds = 0;
  /** Seconds of active play left until the next periodic autosave (D041, D202). */
  autosaveLeft = AUTOSAVE_SECONDS;
  readonly clock: GameClock;

  constructor(clock?: GameClock) {
    this.clock = clock ?? newPlaythroughClock();
  }

  /**
   * Advances by `dt` seconds of active play (the caller passes 0 while paused). Returns true
   * when the periodic autosave falls due (the interval then starts over).
   */
  advance(dt: number): boolean {
    if (!(dt > 0)) return false;
    this.seconds += dt;
    this.clock.advance(dt);
    this.autosaveLeft -= dt;
    if (this.autosaveLeft <= 0) {
      // a long step (never in play: frames are ≤ 0.1 s) still leaves one interval running
      this.autosaveLeft = (((this.autosaveLeft % AUTOSAVE_SECONDS) + AUTOSAVE_SECONDS) % AUTOSAVE_SECONDS) || AUTOSAVE_SECONDS;
      return true;
    }
    return false;
  }

  /** Game day number, starting at 1 (D080). */
  get day(): number {
    return this.clock.days + 1;
  }

  /** "День 1 · 08:00". */
  get label(): string {
    return `День ${this.day} · ${formatClock(this.clock.minutes)}`;
  }
}

/** A clock for a new playthrough: day 1, 08:00, at the D079 rate. */
export function newPlaythroughClock(): GameClock {
  return new GameClock(CLOCK.startMinutes, 0, CLOCK.rate);
}

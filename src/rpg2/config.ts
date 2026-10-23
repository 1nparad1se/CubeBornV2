/**
 * Numbers of the RPG systems (GDD v1.2, docs/gdd/RPG_AI_Implementation_Package.md) and the
 * technical parameters chosen for this project (docs/rpg2/IMPLEMENTATION.md).
 *
 * Scale: 1 block = 1 metre (the existing game already treats one cell as one world unit).
 */

/** D012 / D016: seconds of combat state after the last attack event. */
export const COMBAT_SECONDS = 10;

/** D013 / D014 / D015 / D028: regeneration. */
export const REGEN = {
  /** HP per second as a share of max HP, out of combat only (D013). */
  hpOut: 0.002,
  /** MP per second as a share of max MP (D014). */
  mpIn: 0.005,
  mpOut: 0.02,
  /** ST per second after `stDelay` seconds without spending ST (D015). */
  st: 15,
  stDelay: 1,
  /** Campfire multiplier for HP and MP out of combat (D028), within `campfireRadius` metres. */
  campfire: 5,
  campfireRadius: 5,
};

/** D159: maxima before talents. */
export const BASE = {
  stat: 10,
  hp: 100,
  hpPerVit: 10,
  hpPerLevel: 5,
  mp: 50,
  mpPerSpi: 5,
  st: 100,
};

/** D180: base speeds (m/s). */
export const SPEED = { walk: 2.5, run: 5, sprint: 7.5, swim: 3 };

/** D181 / D182 / D210: sprint drain and the start threshold. */
export const SPRINT = {
  costPerSec: 8,
  minToStart: 10,
  /** D183: forward and the front diagonals (45°) relative to the body; a little slack for input. */
  maxAngleDeg: 50,
};

/**
 * D184–D190, D212: jumps. Both jumps rise up to 1 m from where they are taken; the arc is a
 * parabola with the chosen gravity (technical parameter): apex after `apexTime` seconds.
 */
export const JUMP2 = {
  height: 1,
  apexTime: 0.32,
  /** D212: air control limit after a standing jump or walking off an edge (m/s). */
  airMin: 2.5,
  /** Air steering response (1/s) toward the wanted horizontal velocity. */
  airAccel: 8,
};
export const GRAVITY = (2 * JUMP2.height) / (JUMP2.apexTime * JUMP2.apexTime);
export const JUMP_V0 = Math.sqrt(2 * GRAVITY * JUMP2.height);

/** D212: support and steps. Block tops are flat (0°), block sides are walls (90°). */
export const SUPPORT = {
  maxSlopeDeg: 45,
  /**
   * Steps up to this height are walked; down to it are stepped (deeper drops are falls). Owner,
   * update 7: 0.5 m (quarter and half blocks are walked smoothly, no hop; was D212's 0.3 m).
   */
  step: 0.5,
  /** Feet may slip this far below a ledge top and still count as above it while in the air. */
  airTol: 0.03,
};

/** Hero collision (technical): a column of this radius and height. */
export const HERO_BODY = { radius: 0.32, height: 1.8 };

/** D191: fall damage by height (m) as a share of max HP; above the last row: death. */
export const FALL_TABLE: { upTo: number; share: number }[] = [
  { upTo: 3, share: 0 },
  { upTo: 5, share: 0.05 },
  { upTo: 8, share: 0.15 },
  { upTo: 12, share: 0.35 },
  { upTo: 20, share: 0.7 },
];

/** D192 / D193: water. */
export const WATER = {
  /** Water this deep (or deeper) at the entry point prevents fall damage. */
  safeDepth: 2,
  /** Water deeper than this is swum, shallower is waded (technical). */
  swimDepth: 1.2,
  /** How far below the surface the feet hang while swimming (technical, visual). */
  sink: 1.1,
};

/** D167–D179: dodge. */
export const DODGE = {
  duration: 0.5,
  iframes: 0.2,
  cost: 20,
  cooldown: 1,
  distance: 3,
  /** D178: presses of attack / skill within the last 0.15 s are buffered (one, the latest). */
  buffer: 0.15,
};

/** D079 / D080: one game day per 60 minutes of active play; a new playthrough starts day 1, 08:00. */
export const CLOCK = {
  /** Game minutes per real second of active play: 1440 / 3600. */
  rate: 1440 / 3600,
  startMinutes: 8 * 60,
};

/** D041: periodic autosave interval in seconds of active play. */
export const AUTOSAVE_SECONDS = 10 * 60;

/** Levels (GDD «Общие основы»): 1..60, +10 LP per level, +1 talent point at 5, 10, ..., 60. */
export const LEVELS = { min: 1, max: 60, lpPerLevel: 10 };

/** D006: round to nearest, .5 up for non-negative damage; a positive hit deals at least 1. */
export function roundDamage(v: number): number {
  if (!(v > 0)) return 0;
  return Math.max(1, Math.floor(v + 0.5));
}

import { GameClock } from '../game/GameClock';
import { AUTOSAVE_SECONDS, CLOCK } from './config';
import { HeroState, STAT_IDS, baseStats, newProgress, type Progress, type Stats } from './hero';
import type { MotorSave } from './motor';
import { ActiveTime } from './time';
import { checkCombat, newCombatData, type CombatData } from './combat/system';
import { masteryThreshold } from './combat/formulas';

/**
 * Playthrough snapshot of the RPG systems (stage 1: the hero state, the movement state, the clock
 * and active time). Separate from the main game's save (`cubeborn.save.v1`, untouched) and from
 * the controls (D211). Every record carries its format version (D202); older versions are
 * migrated with a backup, newer ones are refused with a clear message. The full slot system
 * (D040–D047) arrives in stage 6 and keeps this record as the snapshot body.
 */
export const PLAYTHROUGH_FORMAT = 'cubeborn.rpg2.playthrough';
/** 1: stage 1 (hero, movement, clock). 2: stage 2 adds the combat block. */
export const PLAYTHROUGH_VERSION = 2;
/** The test scene's single record (stage 6 replaces it with slots and queues). */
export const TEST_SAVE_KEY = 'cubeborn.rpg2.test';

export interface PlaythroughSave {
  format: typeof PLAYTHROUGH_FORMAT;
  version: number;
  /** 'test' for the test scene (normal playthroughs come with stage 6). */
  kind: 'test';
  id: string;
  /** Real time of writing (ms), for "most recent" (D046). */
  savedAt: number;
  map: string;
  hero: {
    name: string;
    race: string;
    stats: Stats;
    progress: Progress;
    hp: number;
    mp: number;
    st: number;
    stIdle: number;
    combatLeft: number;
  };
  motor: MotorSave;
  clock: { minutes: number; days: number };
  /** Active play seconds and the active time left to the next periodic autosave (D041, D202). */
  active: { seconds: number; autosaveLeft: number };
  /** Stage 2: weapons, panels, cooldowns, ОМ, the running action, projectiles, zones and enemies. */
  combat: CombatData;
}

export function snapshot(o: { id: string; map: string; name: string; race: string; hero: HeroState; motor: MotorSave; time: ActiveTime; combat: CombatData; now?: number }): PlaythroughSave {
  const h = o.hero;
  return {
    format: PLAYTHROUGH_FORMAT,
    version: PLAYTHROUGH_VERSION,
    kind: 'test',
    id: o.id,
    savedAt: o.now ?? Date.now(),
    map: o.map,
    hero: {
      name: o.name,
      race: o.race,
      stats: { ...h.stats },
      progress: { ...h.progress, mastery: { ...h.progress.mastery } },
      hp: h.hp,
      mp: h.mp,
      st: h.st,
      stIdle: h.stIdle,
      combatLeft: h.combatLeft,
    },
    motor: { ...o.motor, dodge: o.motor.dodge ? { ...o.motor.dodge } : null },
    clock: { minutes: o.time.clock.minutes, days: o.time.clock.days },
    active: { seconds: o.time.seconds, autosaveLeft: o.time.autosaveLeft },
    combat: JSON.parse(JSON.stringify(o.combat)),
  };
}

/** Restores the hero and the active time from a checked record. */
export function restore(s: PlaythroughSave): { hero: HeroState; time: ActiveTime; combat: CombatData } {
  const hero = new HeroState();
  hero.stats = { ...s.hero.stats };
  hero.progress = { ...s.hero.progress, mastery: { ...s.hero.progress.mastery } };
  hero.hp = s.hero.hp;
  hero.mp = s.hero.mp;
  hero.st = s.hero.st;
  hero.stIdle = s.hero.stIdle;
  hero.combatLeft = s.hero.combatLeft;
  hero.clamp();
  const time = new ActiveTime(new GameClock(s.clock.minutes, s.clock.days, CLOCK.rate));
  time.seconds = s.active.seconds;
  time.autosaveLeft = s.active.autosaveLeft;
  return { hero, time, combat: JSON.parse(JSON.stringify(s.combat)) };
}

export class SaveError extends Error {}

const num = (v: unknown, path: string): number => {
  if (typeof v !== 'number' || !Number.isFinite(v)) throw new SaveError(`Повреждённое поле «${path}»`);
  return v;
};

/**
 * Checks and upgrades a parsed record. Throws SaveError with a Russian reason for a broken record
 * or one written by a newer game (no silent reset or partial load, D202).
 */
export function migratePlaythrough(raw: any): { save: PlaythroughSave; migrated: boolean } {
  if (!raw || typeof raw !== 'object' || raw.format !== PLAYTHROUGH_FORMAT) throw new SaveError('Это не сохранение прохождения');
  const v = num(raw.version, 'version');
  if (v > PLAYTHROUGH_VERSION) throw new SaveError(`Сохранение создано более новой версией игры (формат ${v}, поддерживается ${PLAYTHROUGH_VERSION})`);
  const migrated = v < PLAYTHROUGH_VERSION;
  // each version adds its step here, oldest first
  let combat: CombatData;
  if (v < 2) {
    // v1 → v2: the approved start (one sword, no skills); masteries of v1 become their ОМ thresholds
    combat = newCombatData('start');
    for (const k of ['sword', 'bow', 'staff'] as const) combat.om[k] = masteryThreshold(num(raw.hero?.progress?.mastery?.[k] ?? 1, `hero.progress.mastery.${k}`));
  } else {
    try {
      combat = checkCombat(raw.combat);
    } catch (e) {
      throw new SaveError(`Повреждён боевой блок: ${(e as Error).message}`);
    }
  }
  const h = raw.hero ?? {};
  const stats = baseStats();
  for (const k of STAT_IDS) stats[k] = num(h.stats?.[k], `hero.stats.${k}`);
  const p = newProgress();
  const pr = h.progress ?? {};
  p.level = num(pr.level, 'hero.progress.level');
  p.xp = num(pr.xp, 'hero.progress.xp');
  p.lp = num(pr.lp ?? 0, 'hero.progress.lp');
  p.tp = num(pr.tp ?? 0, 'hero.progress.tp');
  for (const k of ['sword', 'bow', 'staff'] as const) p.mastery[k] = num(pr.mastery?.[k] ?? 1, `hero.progress.mastery.${k}`);
  const m = raw.motor ?? {};
  const mode = m.mode === 'air' || m.mode === 'swim' ? m.mode : 'ground';
  const motor: MotorSave = {
    x: num(m.x, 'motor.x'), y: num(m.y, 'motor.y'), z: num(m.z, 'motor.z'),
    vx: num(m.vx ?? 0, 'motor.vx'), vy: num(m.vy ?? 0, 'motor.vy'), vz: num(m.vz ?? 0, 'motor.vz'),
    fx: num(m.fx ?? 0, 'motor.fx'), fz: num(m.fz ?? -1, 'motor.fz'),
    mode, airJumpReady: m.airJumpReady !== false, fallTop: num(m.fallTop ?? m.y, 'motor.fallTop'), launchSpeed: num(m.launchSpeed ?? 0, 'motor.launchSpeed'),
    walk: m.walk === true,
    dodge: m.dodge && typeof m.dodge === 'object' ? { t: num(m.dodge.t, 'motor.dodge.t'), dirX: num(m.dodge.dirX, 'motor.dodge.dirX'), dirZ: num(m.dodge.dirZ, 'motor.dodge.dirZ'), speed: num(m.dodge.speed, 'motor.dodge.speed') } : null,
    dodgeCd: num(m.dodgeCd ?? 0, 'motor.dodgeCd'), buffered: typeof m.buffered === 'string' ? m.buffered : null,
    stunLeft: num(m.stunLeft ?? 0, 'motor.stunLeft'), slow: num(m.slow ?? 0, 'motor.slow'),
  };
  const save: PlaythroughSave = {
    format: PLAYTHROUGH_FORMAT,
    version: PLAYTHROUGH_VERSION,
    kind: 'test',
    id: typeof raw.id === 'string' ? raw.id : 'test',
    savedAt: num(raw.savedAt ?? 0, 'savedAt'),
    map: typeof raw.map === 'string' ? raw.map : 'rpg_test',
    hero: {
      name: typeof h.name === 'string' ? h.name : 'Испытатель',
      race: typeof h.race === 'string' ? h.race : 'human',
      stats,
      progress: p,
      hp: num(h.hp, 'hero.hp'),
      mp: num(h.mp, 'hero.mp'),
      st: num(h.st, 'hero.st'),
      stIdle: num(h.stIdle ?? 1, 'hero.stIdle'),
      combatLeft: num(h.combatLeft ?? 0, 'hero.combatLeft'),
    },
    motor,
    clock: { minutes: num(raw.clock?.minutes, 'clock.minutes'), days: num(raw.clock?.days ?? 0, 'clock.days') },
    active: { seconds: num(raw.active?.seconds ?? 0, 'active.seconds'), autosaveLeft: num(raw.active?.autosaveLeft ?? AUTOSAVE_SECONDS, 'active.autosaveLeft') },
    combat,
  };
  return { save, migrated };
}

interface KV {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
  removeItem(k: string): void;
}
const ls = (): KV => localStorage;

/**
 * Writes a record: the new text replaces the old one only after it was written and read back
 * intact; the previous good record stays under `<key>.prev` (D202: a failure never destroys the
 * last working snapshot). A dead hero is never saved (D047 / D213) — the caller checks that.
 */
export function writePlaythrough(s: PlaythroughSave, key = TEST_SAVE_KEY, st: KV = ls()): boolean {
  const text = JSON.stringify(s);
  try {
    st.setItem(key + '.tmp', text);
    if (st.getItem(key + '.tmp') !== text) return false;
    migratePlaythrough(JSON.parse(text));
    const old = st.getItem(key);
    if (old) st.setItem(key + '.prev', old);
    st.setItem(key, text);
    st.removeItem(key + '.tmp');
    return true;
  } catch {
    return false;
  }
}

/** Reads a record: null when none exists; throws SaveError with the reason when unusable. */
export function readPlaythrough(key = TEST_SAVE_KEY, st: KV = ls()): PlaythroughSave | null {
  let text: string | null;
  try {
    text = st.getItem(key);
  } catch {
    throw new SaveError('Хранилище браузера недоступно');
  }
  if (!text) return null;
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new SaveError('Файл сохранения повреждён');
  }
  const { save, migrated } = migratePlaythrough(raw);
  if (migrated) {
    // compatible upgrade: keep the original under a versioned backup key, then store the new form
    try {
      const bk = `${key}.backup.v${(raw as { version: number }).version}`;
      if (st.getItem(bk) === null) st.setItem(bk, text);
      st.setItem(key, JSON.stringify(save));
    } catch {
      /* the upgraded record still loads */
    }
  }
  return save;
}

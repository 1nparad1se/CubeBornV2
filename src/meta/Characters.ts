import { fixGear, newGear, type Gear } from '../rpg/equipment';
import { STARTER_ITEMS } from '../rpg/items';
import { RACE_BY_ID } from '../rpg/races';

/**
 * A created character: race, name, level and experience (progression comes later), the gear
 * (equipped items and the bag) and play time. The world is the training meadow; characters
 * always appear at its spawn point.
 */
export interface CharSave {
  id: string;
  name: string;
  race: string;
  level: number;
  xp: number;
  gear: Gear;
  created: number;
  /** Seconds played. */
  playTime: number;
  lastPlayed: number;
}

export const MAX_CHARS = 12;

export function newChar(name: string, race: string): CharSave {
  const now = Date.now();
  return {
    id: now.toString(36) + Math.random().toString(36).slice(2, 6),
    name: name.trim().slice(0, 16) || 'Герой',
    race: RACE_BY_ID[race]?.available ? race : 'human',
    level: 1,
    xp: 0,
    gear: newGear(STARTER_ITEMS),
    created: now,
    playTime: 0,
    lastPlayed: now,
  };
}

/** Weapons taken out of the game in save v9 (spear, two-handed sword, two-handed staff, crossbow). */
const REMOVED_ITEMS = ['sword_guard2h', 'spear_militia', 'staff_apprentice', 'crossbow_light'];

/**
 * Save v8 → v9: the removed weapons leave the bag; an equipped one is replaced by the starter
 * sword (taken out of the bag when it is there, so nothing is duplicated).
 */
export function dropRemovedWeapons(rawChar: any): any {
  const g = rawChar?.gear;
  if (!g || typeof g !== 'object') return rawChar;
  const equip = { ...(g.equip && typeof g.equip === 'object' ? g.equip : {}) };
  let bag: unknown[] = Array.isArray(g.bag) ? g.bag.map((id: unknown) => (REMOVED_ITEMS.includes(id as string) ? null : id)) : [];
  if (REMOVED_ITEMS.includes(equip.main)) {
    const i = bag.indexOf('sword_recruit');
    if (i >= 0) bag[i] = null;
    equip.main = 'sword_recruit';
  }
  return { ...rawChar, gear: { ...g, equip, bag } };
}

/** Repairs a stored character of the current format; anything else (old class heroes) is dropped. */
export function fixChar(raw: any): CharSave | null {
  if (!raw || typeof raw !== 'object' || typeof raw.race !== 'string' || !RACE_BY_ID[raw.race]?.available) return null;
  const d = newChar(String(raw.name ?? 'Герой'), raw.race);
  const num = (v: unknown, def: number) => (Number.isFinite(Number(v)) ? Number(v) : def);
  return {
    ...d,
    id: typeof raw.id === 'string' && raw.id ? raw.id : d.id,
    level: Math.max(1, Math.floor(num(raw.level, 1))),
    xp: Math.max(0, num(raw.xp, 0)),
    gear: fixGear(raw.gear, d.gear),
    created: num(raw.created, d.created),
    playTime: Math.max(0, num(raw.playTime, 0)),
    lastPlayed: num(raw.lastPlayed, num(raw.created, d.created)),
  };
}

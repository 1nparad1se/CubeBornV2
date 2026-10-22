import BEST from '../data/bestiary.json';
import { checkStoryQuests, newStoryQuests, type StoryQuests } from './quests';

/**
 * The stage 5 part of the playthrough: quests and the journal history, the bestiary (two stages,
 * D061 / D062), discovered places (D063 / D064, no XP), visited rune destinations (D067),
 * activated waystones (D070) and personal map marks. Plus the test scene's layout.
 */
export interface MapMark {
  x: number;
  z: number;
  label: string;
}
export interface StoryData {
  q: StoryQuests;
  /** 1 = seen (name and look), 2 = credited kill (full entry). */
  bestiary: Record<string, 1 | 2>;
  pois: string[];
  visited: string[];
  waystones: string[];
  marks: MapMark[];
}

export function newStory(): StoryData {
  return { q: newStoryQuests(), bestiary: {}, pois: [], visited: [], waystones: [], marks: [] };
}

export interface BestiaryRow {
  id: string;
  name: string;
  level: number;
  rank: string;
  hp: number;
  armor: number;
  res: number;
  damage: number;
  damageType: string;
  interval: number;
  xp: number;
  behavior: string;
  habitat: string;
  zone: string;
  speed: number;
}
export const BESTIARY = BEST.enemies as unknown as BestiaryRow[];
export const BESTIARY_BY_ID: Record<string, BestiaryRow> = Object.fromEntries(BESTIARY.map((b) => [b.id, b]));
/** Quest zone of an enemy kind (the catalog «zone» of its species). */
export function zoneOf(enemy: string): string | null {
  return BESTIARY_BY_ID[enemy]?.zone ?? null;
}

// ------------------------------------------------------------------ layout of the test scene
/** NPC places: the three mentors, four merchants (Мира is the alchemist and the magic mentor), Лада and Орен. */
export const NPC_SPOTS: { id: string; x: number; z: number; color: number }[] = [
  { id: 'arden', x: 46, z: 55, color: 0x8c3b2a },
  { id: 'hira', x: 46, z: 59, color: 0x3d6b32 },
  { id: 'alchemist', x: 46, z: 63, color: 0x3a4f8f },
  { id: 'smith', x: 48, z: 70, color: 0x5a5a62 },
  { id: 'cook', x: 51, z: 70, color: 0xb07a3a },
  { id: 'hunter', x: 54, z: 70, color: 0x5b4a2a },
  { id: 'supplier', x: 57, z: 70, color: 0x6b6b3a },
  { id: 'lada', x: 61, z: 67, color: 0x9a5a8a },
  { id: 'oren', x: 63, z: 70, color: 0x4a6a6a },
];
export interface Poi {
  id: string;
  name: string;
  x: number;
  z: number;
  /** Discovery area radius (an ordinary place) or the inner point radius (a hidden one). */
  r: number;
  hidden?: boolean;
}
export const POIS: Poi[] = [
  { id: 'quiet-valley', name: 'Тихая Долина · колодец', x: 60, z: 64, r: 6 },
  { id: 'old-trail', name: 'Старая тропа · логово волков', x: 33, z: 64, r: 7 },
  { id: 'greyfang-lair', name: 'Территория Серого Клыка', x: 30, z: 49, r: 7 },
  { id: 'river-crossing', name: 'Старая переправа', x: 25, z: 57, r: 6 },
  { id: 'old-ruins', name: 'Старые руины', x: 66, z: 76, r: 5 },
  { id: 'stone-ford', name: 'Каменный Брод · площадь у ворот', x: 82, z: 34, r: 6 },
  { id: 'ruins-vault', name: 'Тайник под аркой', x: 67.5, z: 77.5, r: 1.2, hidden: true },
];
/** Rune destinations (D206): one shared plaza with the waystone; a visit counts within 5 m. */
export const DESTINATIONS: Record<string, { name: string; x: number; z: number; rune: string; stone: string }> = {
  'quiet-valley': { name: 'Тихая Долина', x: 58, z: 64, rune: 'rune-quiet-valley', stone: 'waystone-quiet-valley' },
  'stone-ford': { name: 'Каменный Брод', x: 82, z: 34, rune: 'rune-stone-ford', stone: 'waystone-stone-ford' },
};
export const VISIT_RADIUS = 5;
export const WAYSTONES: { id: string; name: string; dest: string; x: number; z: number }[] = [
  { id: 'waystone-quiet-valley', name: 'Путевой камень Тихой Долины', dest: 'quiet-valley', x: 58, z: 62 },
  { id: 'waystone-stone-ford', name: 'Путевой камень Каменного Брода', dest: 'stone-ford', x: 82, z: 32 },
];
export const RUNE_DEST: Record<string, string> = { 'rune-quiet-valley': 'quiet-valley', 'rune-stone-ford': 'stone-ford', 'rune-forest-rest': 'forest-rest' };
/** A specially marked hero bed (D082) and the arch of the ruins (the explore objective). */
export const BED = { x: 52, z: 64 };
export const ARCH = { x: 66, z: 77, place: 'old-ruins' };
export const CAMPFIRE_RADIUS = 5;
export const TRAVEL_PREP = 5;

// ------------------------------------------------------------------ sleep (D081–D083)
export const SLEEP_HOURS = [6, 12, 18, 0];
/** The next occurrence of `hour`: the same moment or a past hour wakes next day (never zero sleep). */
export function wakeAt(day: number, minutes: number, hour: number): { day: number; minutes: number } {
  const target = hour * 60;
  return target > minutes ? { day, minutes: target } : { day: day + 1, minutes: target };
}

export function checkStory(raw: any): StoryData {
  if (!raw || typeof raw !== 'object') throw new Error('поле «story»');
  const s = newStory();
  s.q = checkStoryQuests(raw.q);
  for (const [k, v] of Object.entries((raw.bestiary ?? {}) as Record<string, unknown>)) if (BESTIARY_BY_ID[k] && (v === 1 || v === 2)) s.bestiary[k] = v;
  const ids = (a: unknown, ok: (x: string) => boolean) => (Array.isArray(a) ? [...new Set(a.filter((x): x is string => typeof x === 'string' && ok(x)))] : []);
  s.pois = ids(raw.pois, (x) => POIS.some((p) => p.id === x));
  s.visited = ids(raw.visited, (x) => !!DESTINATIONS[x]);
  s.waystones = ids(raw.waystones, (x) => WAYSTONES.some((w) => w.id === x));
  s.marks = Array.isArray(raw.marks) ? raw.marks.filter((m: any) => Number.isFinite(m?.x) && Number.isFinite(m?.z)).slice(0, 50).map((m: any) => ({ x: m.x, z: m.z, label: String(m.label ?? '') })) : [];
  return s;
}

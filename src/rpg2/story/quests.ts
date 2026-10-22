import QUESTS from '../data/quests.json';
import type { GrowthData } from '../growth/growth';
import type { HeroState } from '../hero';
import { addXp } from '../growth/levels';
import { addStack, removeStack, stackCount } from '../economy/bag';
import { makeItem } from '../growth/items';
import { stackName } from '../economy/goods';

/**
 * Quests (Quests Dialogues tables, JSON questDefs, D103–D116, «Задания и мир»): accepted in a
 * dialogue, event progress only after acceptance, one credited kill advances every matching
 * quest, materials counted from the hero's bag at the moment of turn-in (not reserved), all
 * checks before any deduction, rewards only by the explicit dialogue command, side quests can be
 * cancelled and taken again (event progress restarts, rewards never repeat), unique quest items.
 */
export interface Objective {
  kind: 'talk' | 'material' | 'consumable' | 'kill' | 'deliver' | 'explore';
  npc?: string;
  key?: string;
  recipe?: string;
  enemy?: string;
  zone?: string;
  token?: string;
  place?: string;
  count: number;
  text: string;
}
export interface QuestDef {
  id: string;
  name: string;
  type: 'talk' | 'collect' | 'kill' | 'deliver' | 'explore';
  main: boolean;
  npc: string;
  level: number;
  requires: string[];
  text: string;
  direction: string;
  objectives: Objective[];
  reward: { xp: number; gold: number; consumables?: Record<string, number>; materials?: Record<string, number>; gear?: { template: string; rarity: 'common' }; choice?: string[] };
  intro: string;
  thanks: string;
}
export const QUEST_DEFS = QUESTS.questDefs as unknown as QuestDef[];
export const QUEST_BY_ID: Record<string, QuestDef> = Object.fromEntries(QUEST_DEFS.map((q) => [q.id, q]));
export const QUEST_TYPE = QUESTS.questTypes as Record<string, string>;
export const TOKEN_NAMES = QUESTS.tokenNames as Record<string, string>;
/** Dialogue NPCs of the catalog (eight with topics) plus Хира, the bow mentor (D205, no catalog topics). */
export interface NpcDef {
  id: string;
  name: string;
  role: string;
  place: string;
  greeting: string;
  topics: [string, string][];
  mentor?: boolean;
  merchant?: string;
}
export const NPC_DEFS: NpcDef[] = [
  ...(QUESTS.questNPCs as unknown as NpcDef[]),
  { id: 'hira', name: 'Хира', role: 'Наставница', place: 'Лесной Привал · площадка для стрельбы', greeting: 'Лук любит спокойные руки. Чему учиться будем?', topics: [], mentor: true },
];
export const NPC_BY_ID: Record<string, NpcDef> = Object.fromEntries(NPC_DEFS.map((n) => [n.id, n]));
export const npcName = (id: string) => NPC_BY_ID[id]?.name ?? id;

export interface QuestState {
  status: 'active' | 'done' | 'failed';
  /** Event progress per objective (talk, kill, deliver, explore); materials are read from the bag. */
  progress: number[];
  attempts: number;
}
export interface HistoryRow {
  quest: string;
  event: 'accepted' | 'cancelled' | 'completed';
  day: number;
  minutes: number;
}
export interface StoryQuests {
  quests: Record<string, QuestState>;
  tracked: string | null;
  history: HistoryRow[];
  /** Unique quest items held by the hero (D103): never sold, stored, dropped or destroyed. */
  tokens: string[];
}

export function newStoryQuests(): StoryQuests {
  return { quests: {}, tracked: null, history: [], tokens: [] };
}

export interface QuestCtx {
  q: StoryQuests;
  g: GrowthData;
  hero: HeroState;
  /** Clock for the history rows. */
  day: number;
  minutes: number;
}

const isEvent = (o: Objective) => o.kind === 'talk' || o.kind === 'kill' || o.kind === 'deliver' || o.kind === 'explore';

/** D111: can this NPC give the quest right now? */
export function canOffer(c: QuestCtx, id: string): boolean {
  const d = QUEST_BY_ID[id];
  const st = c.q.quests[id];
  if (st && st.status !== 'failed') return false;
  if (c.hero.progress.level < d.level) return false;
  return d.requires.every((r) => c.q.quests[r]?.status === 'done');
}
export function offersOf(c: QuestCtx, npc: string): QuestDef[] {
  return QUEST_DEFS.filter((d) => d.npc === npc && canOffer(c, d.id));
}

/** Current count of an objective (materials from the hero's bag only, D104 / D105). */
export function objectiveCount(c: QuestCtx, id: string, i: number): number {
  const o = QUEST_BY_ID[id].objectives[i];
  if (o.kind === 'material') return stackCount(c.g, o.key!);
  if (o.kind === 'consumable') return stackCount(c.g, o.recipe!);
  return c.q.quests[id]?.progress[i] ?? 0;
}
export function objectiveDone(c: QuestCtx, id: string, i: number): boolean {
  return objectiveCount(c, id, i) >= QUEST_BY_ID[id].objectives[i].count;
}
/** D106 / D113: ready to turn in now (recomputed from the current state every time). */
export function isReady(c: QuestCtx, id: string): boolean {
  const st = c.q.quests[id];
  if (!st || st.status !== 'active') return false;
  return QUEST_BY_ID[id].objectives.every((_, i) => objectiveDone(c, id, i));
}

function log(c: QuestCtx, quest: string, event: HistoryRow['event']) {
  c.q.history.push({ quest, event, day: c.day, minutes: Math.floor(c.minutes) });
}

export function accept(c: QuestCtx, id: string): string | null {
  if (!QUEST_BY_ID[id]) return 'Нет такого задания';
  if (!canOffer(c, id)) return 'Задание недоступно';
  const d = QUEST_BY_ID[id];
  const prev = c.q.quests[id];
  c.q.quests[id] = { status: 'active', progress: d.objectives.map(() => 0), attempts: (prev?.attempts ?? 0) + 1 };
  // D109: the unique items of the quest are handed out again, without duplicates
  for (const o of d.objectives) if (o.kind === 'deliver' && o.token && !c.q.tokens.includes(o.token)) c.q.tokens.push(o.token);
  log(c, id, 'accepted');
  return null;
}

/** D108 / D109: side quests only; no reward or penalty; event progress is lost; quest items removed. */
export function cancel(c: QuestCtx, id: string): string | null {
  const d = QUEST_BY_ID[id];
  const st = c.q.quests[id];
  if (!d || !st || st.status !== 'active') return 'Задание не активно';
  if (d.main) return 'Основное задание отменить нельзя';
  st.status = 'failed';
  for (const o of d.objectives) if (o.kind === 'deliver' && o.token) c.q.tokens = c.q.tokens.filter((t) => t !== o.token);
  if (c.q.tracked === id) c.q.tracked = null;
  log(c, id, 'cancelled');
  return null;
}

/** D107: one credited kill advances every active quest that matches (each life once per quest). */
export function onKill(c: QuestCtx, enemy: string, zone: string | null): string[] {
  const moved: string[] = [];
  for (const [id, st] of Object.entries(c.q.quests)) {
    if (st.status !== 'active') continue;
    QUEST_BY_ID[id].objectives.forEach((o, i) => {
      if (o.kind !== 'kill' || o.enemy !== enemy || (o.zone && o.zone !== zone) || st.progress[i] >= o.count) return;
      st.progress[i]++;
      moved.push(id);
    });
  }
  return moved;
}

/** Talk objectives of the active quests this NPC answers (the «Расспросить по заданию» lines, D114). */
export function talkTopics(c: QuestCtx, npc: string): { quest: string; i: number; text: string }[] {
  const out: { quest: string; i: number; text: string }[] = [];
  for (const [id, st] of Object.entries(c.q.quests)) {
    if (st.status !== 'active') continue;
    QUEST_BY_ID[id].objectives.forEach((o, i) => {
      if (o.kind === 'talk' && o.npc === npc && st.progress[i] < o.count) out.push({ quest: id, i, text: o.text });
    });
  }
  return out;
}
export function talk(c: QuestCtx, quest: string, i: number, npc: string): string | null {
  const st = c.q.quests[quest];
  const o = QUEST_BY_ID[quest]?.objectives[i];
  if (!st || st.status !== 'active' || !o || o.kind !== 'talk') return 'Нет такой цели';
  if (o.npc !== npc) return 'Этот NPC тут ни при чём';
  st.progress[i] = o.count;
  return null;
}

/** Delivery steps this NPC can receive now. */
export function deliveries(c: QuestCtx, npc: string): { quest: string; i: number; token: string }[] {
  const out: { quest: string; i: number; token: string }[] = [];
  for (const [id, st] of Object.entries(c.q.quests)) {
    if (st.status !== 'active') continue;
    QUEST_BY_ID[id].objectives.forEach((o, i) => {
      if (o.kind === 'deliver' && o.npc === npc && st.progress[i] < o.count && c.q.tokens.includes(o.token!)) out.push({ quest: id, i, token: o.token! });
    });
  }
  return out;
}
/** A wrong NPC never takes the letter; the item leaves the bag at the hand-over, the report is a separate step. */
export function deliver(c: QuestCtx, quest: string, i: number, npc: string): string | null {
  const st = c.q.quests[quest];
  const o = QUEST_BY_ID[quest]?.objectives[i];
  if (!st || st.status !== 'active' || !o || o.kind !== 'deliver') return 'Нет такой цели';
  if (o.npc !== npc) return 'Этот NPC письмо не примет';
  if (!c.q.tokens.includes(o.token!)) return `Нет предмета: ${TOKEN_NAMES[o.token!]}`;
  c.q.tokens = c.q.tokens.filter((t) => t !== o.token);
  st.progress[i] = o.count;
  return null;
}

/** An inspection event for the active explore objectives of this place (repeatable before acceptance). */
export function explore(c: QuestCtx, place: string): string[] {
  const moved: string[] = [];
  for (const [id, st] of Object.entries(c.q.quests)) {
    if (st.status !== 'active') continue;
    QUEST_BY_ID[id].objectives.forEach((o, i) => {
      if (o.kind === 'explore' && o.place === place && st.progress[i] < o.count) {
        st.progress[i] = o.count;
        moved.push(id);
      }
    });
  }
  return moved;
}

/** Active quests this NPC accepts the final turn-in for. */
export function turnInsAt(c: QuestCtx, npc: string): QuestDef[] {
  return QUEST_DEFS.filter((d) => d.npc === npc && c.q.quests[d.id]?.status === 'active');
}

export function turnInProblem(c: QuestCtx, id: string, npc: string, choice?: string): string | null {
  const d = QUEST_BY_ID[id];
  const st = c.q.quests[id];
  if (!d || !st || st.status !== 'active') return 'Задание не активно';
  if (d.npc !== npc) return `Сдать задание нужно: ${npcName(d.npc)}`;
  for (let i = 0; i < d.objectives.length; i++)
    if (!objectiveDone(c, id, i)) {
      const o = d.objectives[i];
      return o.kind === 'material' || o.kind === 'consumable' ? `Не хватает: ${stackName(o.key ?? o.recipe!)} ${objectiveCount(c, id, i)}/${o.count}` : `Не выполнено: ${o.text}`;
    }
  if (d.reward.choice && (!choice || !d.reward.choice.includes(choice))) return 'Выберите одну награду';
  return null;
}

/**
 * The explicit dialogue command: every check first, then one deduction of the materials and the
 * rewards (XP capped at level 60). Returns the levels gained, or the reason when refused.
 */
export function turnIn(c: QuestCtx, id: string, npc: string, nextUid: () => string, choice?: string): { error: string } | { levels: number } {
  const p = turnInProblem(c, id, npc, choice);
  if (p) return { error: p };
  const d = QUEST_BY_ID[id];
  for (const o of d.objectives) {
    if (o.kind === 'material') removeStack(c.g, o.key!, o.count);
    if (o.kind === 'consumable') removeStack(c.g, o.recipe!, o.count);
  }
  const r = d.reward;
  const levels = addXp(c.hero.progress, r.xp);
  c.g.gold += r.gold;
  for (const [k, n] of Object.entries(r.consumables ?? {})) addStack(c.g, k, n);
  for (const [k, n] of Object.entries(r.materials ?? {})) addStack(c.g, k, n);
  const tpl = (t: string) => t.replace('Шлем', '_head').replace('Нагрудник', '_chest').replace('Штаны', '_legs');
  if (r.gear) c.g.items.push(makeItem(nextUid(), tpl(r.gear.template), 'common'));
  if (r.choice && choice) c.g.items.push(makeItem(nextUid(), choice, 'common'));
  c.q.quests[id].status = 'done';
  if (c.q.tracked === id) c.q.tracked = null;
  log(c, id, 'completed');
  return { levels };
}

/** D111 / D113: «?» when a turn-in is ready here, otherwise «!» when a new quest can be given. */
export function markerOf(c: QuestCtx, npc: string): '?' | '!' | null {
  if (turnInsAt(c, npc).some((d) => isReady(c, d.id))) return '?';
  if (offersOf(c, npc).length) return '!';
  return null;
}

export function checkStoryQuests(raw: any): StoryQuests {
  const bad = (f: string): never => {
    throw new Error(`поле «story.${f}»`);
  };
  if (!raw || typeof raw !== 'object') bad('quests');
  const out = newStoryQuests();
  for (const [id, st] of Object.entries((raw.quests ?? {}) as Record<string, any>)) {
    const d = QUEST_BY_ID[id];
    if (!d || !['active', 'done', 'failed'].includes(st?.status) || !Array.isArray(st.progress) || st.progress.length !== d.objectives.length) bad(`quests.${id}`);
    out.quests[id] = {
      status: st.status,
      progress: st.progress.map((v: unknown, i: number) => (typeof v === 'number' && v >= 0 ? Math.min(v, d.objectives[i].count) : bad(`quests.${id}.progress`))),
      attempts: typeof st.attempts === 'number' ? st.attempts : 1,
    };
  }
  out.tracked = typeof raw.tracked === 'string' && out.quests[raw.tracked]?.status === 'active' ? raw.tracked : null;
  out.history = Array.isArray(raw.history) ? raw.history.filter((h: any) => QUEST_BY_ID[h?.quest]).map((h: any) => ({ quest: h.quest, event: h.event, day: Number(h.day) || 0, minutes: Number(h.minutes) || 0 })) : [];
  out.tokens = Array.isArray(raw.tokens) ? raw.tokens.filter((t: unknown) => typeof t === 'string' && TOKEN_NAMES[t as string]) : [];
  return out;
}
export { isEvent };

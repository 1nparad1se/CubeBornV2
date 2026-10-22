import type { GrowthData } from '../growth/growth';
import { isEquipped } from '../growth/growth';
import { itemName, type Item } from '../growth/items';
import { STACK_MAX, stackName } from './goods';

/**
 * Hero bag and world containers (D094–D103, D137, D209). The hero's bag is unlimited (stack
 * counts by key plus item instances); a container keeps an ordered list of entries (one slot
 * each: a stack of up to 99 or one item) and a number of gold. Every transfer moves the very
 * object or the exact count: nothing is copied, nothing is lost.
 */
export type Entry =
  | { kind: 'stack'; key: string; qty: number; tool?: string | null; skill?: string | null }
  | { kind: 'item'; item: Item };

export interface Container {
  entries: Entry[];
  gold: number;
  /** Slots (D099: 50 for chests); null for a corpse (nothing can be put into it). */
  cap: number | null;
}

export function stackCount(g: GrowthData, key: string): number {
  return g.stacks[key] ?? 0;
}
export function addStack(g: GrowthData, key: string, qty: number) {
  if (qty <= 0) return;
  g.stacks[key] = (g.stacks[key] ?? 0) + qty;
}
/** Removes exactly `qty` (the caller checked the count). */
export function removeStack(g: GrowthData, key: string, qty: number) {
  const left = (g.stacks[key] ?? 0) - qty;
  if (left < 0) throw new Error('stack underflow');
  if (left === 0) delete g.stacks[key];
  else g.stacks[key] = left;
}
export function hasTool(g: GrowthData, tool: string): boolean {
  return g.items.some((i) => i.tpl === tool);
}

export function entryName(e: Entry): string {
  return e.kind === 'stack' ? stackName(e.key) : itemName(e.item);
}

const HUNT_NAME = ['', 'Охотник', 'Опытный охотник', 'Мастер охоты'];
/** D095 / D209: a trophy whose knife or hunting tier is missing stays in the corpse. */
export function trophyProblem(e: Entry, g: GrowthData): string | null {
  if (e.kind !== 'stack') return null;
  if (e.skill) {
    const need = Number(e.skill.slice(-1));
    if (g.hunt < need) return `Нужна ступень охоты «${HUNT_NAME[need]}»`;
  }
  if (e.tool && !hasTool(g, e.tool)) return 'Нужен охотничий нож в инвентаре';
  return null;
}

/** Takes `qty` of entry `idx` (a whole item) into the hero's bag. Returns the reason when refused. */
export function takeEntry(g: GrowthData, c: Container, idx: number, qty = Infinity): string | null {
  const e = c.entries[idx];
  if (!e) return 'Предмета нет';
  const p = trophyProblem(e, g);
  if (p) return p;
  if (e.kind === 'item') {
    c.entries.splice(idx, 1);
    g.items.push(e.item);
    return null;
  }
  const n = Math.min(e.qty, Math.max(1, Math.floor(qty)));
  addStack(g, e.key, n);
  e.qty -= n;
  if (e.qty <= 0) c.entries.splice(idx, 1);
  return null;
}

export function takeGold(g: GrowthData, c: Container): number {
  const v = c.gold;
  g.gold += v;
  c.gold = 0;
  return v;
}

/**
 * D209 «Взять всё»: every available entry in the container's own order (whatever the filter or
 * sort of the window) and the gold; trophies with missing requirements stay with their reason.
 * A second press takes nothing new and creates no duplicates.
 */
export function takeAll(g: GrowthData, c: Container): { taken: number; gold: number; skipped: { name: string; why: string }[] } {
  let taken = 0;
  const skipped: { name: string; why: string }[] = [];
  let i = 0;
  while (i < c.entries.length) {
    const e = c.entries[i];
    const why = trophyProblem(e, g);
    if (why) {
      skipped.push({ name: entryName(e), why });
      i++;
      continue;
    }
    takeEntry(g, c, i);
    taken++;
  }
  return { taken, gold: takeGold(g, c), skipped };
}

/**
 * D101: puts up to `qty` units of a stack into a chest: partial stacks of the same goods are
 * filled to 99 first, then free slots take new stacks; the rest stays with the hero.
 * Returns the number actually moved.
 */
export function putStack(g: GrowthData, c: Container, key: string, qty: number): number {
  if (c.cap === null) return 0;
  let want = Math.min(Math.floor(qty), stackCount(g, key));
  let moved = 0;
  for (const e of c.entries) {
    if (want <= 0) break;
    if (e.kind !== 'stack' || e.key !== key || e.tool || e.skill || e.qty >= STACK_MAX) continue;
    const n = Math.min(STACK_MAX - e.qty, want);
    e.qty += n;
    want -= n;
    moved += n;
  }
  while (want > 0 && c.entries.length < c.cap) {
    const n = Math.min(STACK_MAX, want);
    c.entries.push({ kind: 'stack', key, qty: n });
    want -= n;
    moved += n;
  }
  if (moved) removeStack(g, key, moved);
  return moved;
}

/** D098 / D137 / D099: an own item into a chest (not an equipped one, one free slot needed). */
export function putItemProblem(g: GrowthData, c: Container, uid: string): string | null {
  if (c.cap === null) return 'В тело ничего нельзя положить';
  if (!g.items.some((i) => i.uid === uid)) return 'Предмета нет';
  if (isEquipped(g, uid)) return 'Надетый предмет сначала нужно снять';
  if (c.entries.length >= c.cap) return `Нет свободного места (${c.cap} слотов)`;
  return null;
}
export function putItem(g: GrowthData, c: Container, uid: string): string | null {
  const p = putItemProblem(g, c, uid);
  if (p) return p;
  const k = g.items.findIndex((i) => i.uid === uid);
  const [it] = g.items.splice(k, 1);
  c.entries.push({ kind: 'item', item: it });
  return null;
}

/** Every item uid and stack total of a bag plus containers (conservation checks in tests). */
export function census(g: GrowthData, cs: Container[]): { uids: string[]; stacks: Record<string, number>; gold: number } {
  const uids = g.items.map((i) => i.uid);
  const stacks: Record<string, number> = { ...g.stacks };
  let gold = g.gold;
  for (const c of cs) {
    gold += c.gold;
    for (const e of c.entries) {
      if (e.kind === 'item') uids.push(e.item.uid);
      else stacks[e.key] = (stacks[e.key] ?? 0) + e.qty;
    }
  }
  return { uids, stacks, gold };
}

import CRAFT from '../data/craft.json';
import type { GrowthData } from '../growth/growth';
import { addStack, hasTool } from './bag';
import { TOOL_NAMES } from './goods';

/**
 * Resource points (JSON resourceSources, D084–D093, D129–D132): one material per point, a random
 * stock (uniform integer) rolled at creation and at each real respawn, one unit per finished
 * cycle (plants 1 s, ore and wood 3 s), hold E to repeat, interrupted by movement, an attack,
 * damage, stun, releasing E or opening a menu; allowed in combat; no ST or MP. The respawn timer
 * starts at the last unit and runs on active time; the point comes back only ≥ 30 m from the
 * hero and out of view (or behind an obstacle).
 */
export interface SourceDef {
  id: string;
  name: string;
  material: string;
  kind: string;
  tool: string | null;
  skill: string | null;
  stock: { min: number; max: number };
  respawnMinutes: number;
  cycleSeconds: number;
  minimumRespawnDistance: number;
}
export const SOURCES = CRAFT.resourceSources as SourceDef[];
export const SOURCE_BY_ID: Record<string, SourceDef> = Object.fromEntries(SOURCES.map((s) => [s.id, s]));
const SKILL_NAME: Record<string, string> = { rareplants: 'Знаток редких растений', rareminerals: 'Добытчик редких минералов', rarewood: 'Заготовщик редкой древесины' };

export interface NodeState {
  src: string;
  stock: number;
  /** Seconds to the respawn after the last unit; null while the point has stock. */
  respawnLeft: number | null;
}

/** D092: every integer of the range is equally likely. */
export function rollStock(src: SourceDef, rnd: () => number = Math.random): number {
  const { min, max } = src.stock;
  return min + Math.min(max - min, Math.floor(rnd() * (max - min + 1)));
}
export function newNode(src: string, rnd?: () => number): NodeState {
  return { src, stock: rollStock(SOURCE_BY_ID[src], rnd), respawnLeft: null };
}

export function gatherProblem(g: GrowthData, n: NodeState): string | null {
  const s = SOURCE_BY_ID[n.src];
  if (n.stock <= 0) return 'Истощено — восстановится позже';
  if (s.skill && !g.gather.includes(s.skill)) return `Нужен навык «${SKILL_NAME[s.skill]}»`;
  if (s.tool && !hasTool(g, s.tool)) return `Нужен инструмент: ${TOOL_NAMES[s.tool]}`;
  return null;
}

/** One gathering action in progress (bound to the point it started on, D131). */
export interface GatherAction {
  node: string;
  t: number;
  dur: number;
}

/** Advances a cycle; on completion gives one unit and lowers the stock (D089). Returns 'unit' / 'empty' / null. */
export function tickGather(g: GrowthData, n: NodeState, a: GatherAction, dt: number): 'unit' | 'empty' | null {
  a.t += dt;
  if (a.t < a.dur) return null;
  const s = SOURCE_BY_ID[n.src];
  addStack(g, s.material, 1);
  n.stock -= 1;
  a.t = 0;
  if (n.stock <= 0) {
    n.stock = 0;
    n.respawnLeft = s.respawnMinutes * 60;
    return 'empty';
  }
  return 'unit';
}

/** D085 / D086: the timer runs on active time; the stock is rolled again only when the point really comes back. */
export function tickNode(n: NodeState, dt: number, canRespawn: () => boolean, rnd?: () => number): boolean {
  if (n.respawnLeft === null) return false;
  n.respawnLeft = Math.max(0, n.respawnLeft - dt);
  if (n.respawnLeft > 0 || !canRespawn()) return false;
  n.stock = rollStock(SOURCE_BY_ID[n.src], rnd);
  n.respawnLeft = null;
  return true;
}

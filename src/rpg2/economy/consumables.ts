import type { GrowthData } from '../growth/growth';
import type { HeroState } from '../hero';
import { removeStack, stackCount } from './bag';
import { consumableDef, stackName } from './goods';

/**
 * D199: potions restore up to the maximum at once and work in combat (one shared 10 s cooldown
 * that starts on a successful use); food only out of combat, no cooldown. Nothing is spent at a
 * full resource, during the cooldown, stun, knockback, a dodge, an attack or a preparation.
 */
export const POTION_CD = 10;

export interface UseState {
  inCombat: boolean;
  /** Stunned, knocked back, dodging, attacking or preparing. */
  busy: string | null;
}

export function useProblem(g: GrowthData, hero: HeroState, key: string, s: UseState): string | null {
  const d = consumableDef(key);
  if (!d) return 'Это нельзя использовать';
  if (stackCount(g, key) < 1) return `Нет: ${stackName(key)}`;
  if (s.busy) return s.busy;
  const stat = d.result.stat!;
  const cur = stat === 'HP' ? hero.hp : stat === 'MP' ? hero.mp : hero.st;
  const max = stat === 'HP' ? hero.maxHp : stat === 'MP' ? hero.maxMp : hero.maxSt;
  if (d.result.kind === 'food') {
    if (s.inCombat) return 'Еда — только вне боя';
  } else if (g.potionCd > 0) return `Откат зелий: ${Math.ceil(g.potionCd)} с`;
  if (cur >= max) return `${stat} уже полное`;
  return null;
}

export function useConsumable(g: GrowthData, hero: HeroState, key: string, s: UseState): string | null {
  const p = useProblem(g, hero, key, s);
  if (p) return p;
  const d = consumableDef(key)!;
  const amt = d.result.amount!;
  const stat = d.result.stat!;
  if (stat === 'HP') hero.hp = Math.min(hero.maxHp, hero.hp + amt);
  else if (stat === 'MP') hero.mp = Math.min(hero.maxMp, hero.mp + amt);
  else hero.st = Math.min(hero.maxSt, hero.st + amt);
  removeStack(g, key, 1);
  if (d.result.kind === 'potion') g.potionCd = POTION_CD;
  return null;
}

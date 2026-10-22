/**
 * Talents (Combat Talents tables, D057, D060, D121): three trees, two branches each, three tiers;
 * 1 talent point per node; tier I needs level 5 and 0 points in the tree, II level 20 and 2,
 * III level 40 and 4, plus the previous node of the branch. Learned in the personal screen out of
 * combat; a full reset at a mentor costs 100 + 25 × level gold and returns every point.
 */
export type TreeId = 'phys' | 'magic' | 'surv';

export interface TalentDef {
  id: string;
  tree: TreeId;
  branch: string;
  tier: 1 | 2 | 3;
  name: string;
  effect: string;
}

export const TREE_NAME: Record<TreeId, string> = { phys: 'Физическое', magic: 'Магическое', surv: 'Выживание' };
export const TIER_REQ = { 1: { level: 5, spent: 0 }, 2: { level: 20, spent: 2 }, 3: { level: 40, spent: 4 } } as const;

const T = (id: string, tree: TreeId, branch: string, tier: 1 | 2 | 3, name: string, effect: string): TalentDef => ({ id, tree, branch, tier, name, effect });

export const TALENTS: TalentDef[] = [
  T('p_a1', 'phys', 'Натиск', 1, 'Твёрдая рука', 'Физический урон меча и лука +5%.'),
  T('p_a2', 'phys', 'Натиск', 2, 'Верный расчёт', 'Шанс критического удара мечом и луком +3 п.п.'),
  T('p_a3', 'phys', 'Натиск', 3, 'Сокрушительный натиск', 'Коэффициент критического урона меча и лука +0,20.'),
  T('p_b1', 'phys', 'Техника', 1, 'Экономные движения', 'Расход ST активных навыков меча и лука −10%.'),
  T('p_b2', 'phys', 'Техника', 2, 'Быстрое восстановление', 'Перезарядки активных навыков меча и лука −8%.'),
  T('p_b3', 'phys', 'Техника', 3, 'Крепкий блок', 'Снижение урона блоком меча 50% → 60%.'),
  T('m_a1', 'magic', 'Сила стихий', 1, 'Проводник стихий', 'Урон всех трёх школ магии +5%.'),
  T('m_a2', 'magic', 'Сила стихий', 2, 'Острый разум', 'Шанс критического удара заклинаний +3 п.п.'),
  T('m_a3', 'magic', 'Сила стихий', 3, 'Воля стихий', 'Коэффициент критического урона заклинаний +0,20.'),
  T('m_b1', 'magic', 'Контроль маны', 1, 'Бережное плетение', 'Расход MP заклинаний −10%.'),
  T('m_b2', 'magic', 'Контроль маны', 2, 'Ясный поток', 'Скорость восстановления MP ×1,15.'),
  T('m_b3', 'magic', 'Контроль маны', 3, 'Ритм заклинателя', 'Перезарядки заклинаний −8%.'),
  T('s_a1', 'surv', 'Запас сил', 1, 'Крепкое здоровье', 'Максимальный HP +10% (с округлением вниз).'),
  T('s_a2', 'surv', 'Запас сил', 2, 'Второе дыхание', 'Максимальный ST +15.'),
  T('s_a3', 'surv', 'Запас сил', 3, 'Быстрая передышка', 'Задержка восстановления ST 1 → 0,7 с.'),
  T('s_b1', 'surv', 'Путь странника', 1, 'Лёгкий шаг', 'Расход ST спринта 8 → 6,8 в секунду.'),
  T('s_b2', 'surv', 'Путь странника', 2, 'Отточенный перекат', 'Расход ST уклонения 20 → 18.'),
  T('s_b3', 'surv', 'Путь странника', 3, 'Спокойное восстановление', 'Восстановление HP вне боя 0,2 → 0,25 %/с.'),
];
export const TALENT_BY_ID: Record<string, TalentDef> = Object.fromEntries(TALENTS.map((t) => [t.id, t]));

export function previousNode(t: TalentDef): TalentDef | null {
  if (t.tier === 1) return null;
  return TALENTS.find((x) => x.tree === t.tree && x.branch === t.branch && x.tier === t.tier - 1) ?? null;
}

export function spentInTree(learned: string[], tree: TreeId): number {
  return learned.filter((id) => TALENT_BY_ID[id]?.tree === tree).length;
}

/** Why the talent cannot be learned now (null when it can). */
export function talentProblem(id: string, learned: string[], level: number, tp: number, inCombat: boolean): string | null {
  const t = TALENT_BY_ID[id];
  if (!t) return 'Неизвестный талант';
  if (learned.includes(id)) return 'Уже изучен';
  const req = TIER_REQ[t.tier];
  if (level < req.level) return `Нужен уровень ${req.level}`;
  if (spentInTree(learned, t.tree) < req.spent) return `Нужно ${req.spent} ОТ в дереве «${TREE_NAME[t.tree]}»`;
  const prev = previousNode(t);
  if (prev && !learned.includes(prev.id)) return `Нужен талант «${prev.name}»`;
  if (tp < 1) return 'Нет очков талантов';
  if (inCombat) return 'Только вне боя';
  return null;
}

/** D057: full reset price. */
export function talentResetCost(level: number): number {
  return 100 + 25 * level;
}

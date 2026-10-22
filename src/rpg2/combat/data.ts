/**
 * Combat catalogs of GDD v1.2 used by stage 2: weapons («Каталог оружия», JSON gearTemplates),
 * the 12 weapon skills (Combat Talents), the 15 spells (Magic) and the two enemies of the test
 * scene (Bestiary: Серый волк, Серый Клык). Stable ids are the catalog ids.
 */
export type WeaponFamily = 'sword' | 'bow' | 'staff';
export type WeaponKind2 = 'sword' | 'greatsword' | 'bow' | 'staff';

export interface WeaponDef {
  id: string;
  name: string;
  kind: WeaponKind2;
  family: WeaponFamily;
  /** Base damage (physical for swords and bows, magic for staves). */
  damage: number;
  /** Normal attacks per second. */
  aps: number;
  /** Requirement: the stat and its value (checked by equipment in stage 3). */
  attr: 'str' | 'dex' | 'int';
  req: number;
  /** Existing cubic item mesh used to draw it (src/rpg/items.ts). */
  mesh: string;
}

const W = (id: string, name: string, kind: WeaponKind2, damage: number, aps: number, req: number): WeaponDef => {
  const family: WeaponFamily = kind === 'bow' ? 'bow' : kind === 'staff' ? 'staff' : 'sword';
  const attr = family === 'sword' ? 'str' : family === 'bow' ? 'dex' : 'int';
  const mesh = kind === 'sword' ? 'sword_recruit' : kind === 'greatsword' ? 'sword_guard2h' : kind === 'bow' ? 'bow_hunter' : 'staff_apprentice';
  return { id, name, kind, family, damage, aps, attr, req, mesh };
};

/** «Каталог оружия»: 12 templates. */
export const WEAPONS: WeaponDef[] = [
  W('sword1', 'Железный меч', 'sword', 12, 1.25, 10),
  W('greatsword1', 'Железный двуручник', 'greatsword', 20, 0.8, 10),
  W('bow1', 'Простой лук', 'bow', 10, 1, 10),
  W('staff1', 'Дорожный посох', 'staff', 12, 1.05, 10),
  W('sword2', 'Стальной меч', 'sword', 24, 1.25, 25),
  W('greatsword2', 'Стальной двуручник', 'greatsword', 38, 0.8, 25),
  W('bow2', 'Составной лук', 'bow', 20, 1, 25),
  W('staff2', 'Посох кристалла', 'staff', 24, 1.05, 25),
  W('sword3', 'Укреплённый меч', 'sword', 40, 1.25, 50),
  W('greatsword3', 'Укреплённый двуручник', 'greatsword', 62, 0.8, 50),
  W('bow3', 'Лук древней древесины', 'bow', 34, 1, 50),
  W('staff3', 'Посох древнего рога', 'staff', 40, 1.05, 50),
];
export const WEAPON_BY_ID: Record<string, WeaponDef> = Object.fromEntries(WEAPONS.map((w) => [w.id, w]));

/** D008 / D009 / D195: normal attack numbers per kind. */
export const NORMAL = {
  /** ST cost of a normal sword attack (D008). */
  stCost: { sword: 1, greatsword: 2, bow: 0, staff: 0 } as Record<WeaponKind2, number>,
  /** MP of a normal staff shot (D009); charged: 3 + 3t (D010). */
  staffMp: 3,
  /** Melee reach (D195). */
  reach: { sword: 2, greatsword: 2.7 } as Record<string, number>,
  /** Melee sector, degrees (D195). */
  sector: 100,
  arrow: { speed: 40, range: 30 },
  bolt: { speed: 25, range: 25 },
  /** Hit / release moment as a share of the attack interval (technical). */
  hitAt: { sword: 0.4, greatsword: 0.5, bow: 0.45, staff: 0.4 } as Record<WeaponKind2, number>,
};

export type SkillShape =
  | { type: 'melee'; sector: number; reach: number | 'weapon'; maxTargets?: number }
  | { type: 'arrow'; count: number; interval?: number; spreadDeg?: number; pierce?: number[]; maxPerTarget?: number; range: number };

export interface SkillDef {
  id: string;
  name: string;
  family: 'sword' | 'bow';
  st: number;
  cd: number;
  /** Preparation (s); 0 = released at once (technical swing of 0.25 s). */
  prep: number;
  /** Damage coefficient of weapon damage (per hit). */
  coef: number;
  /** s6: coefficient when the target has ≤ 30 % HP before the hit. */
  executeCoef?: number;
  shape: SkillShape;
  stun?: number;
  slow?: { power: number; dur: number };
  knock?: number;
  /** Learning requirements (stage 3). */
  attr: number;
  mastery: number;
  lp: number;
  gold: number;
}

/** Combat Talents: 6 sword and 6 bow skills. */
export const SKILLS: SkillDef[] = [
  { id: 's1', name: 'Сильный удар', family: 'sword', st: 18, cd: 6, prep: 0.6, coef: 1.6, shape: { type: 'melee', sector: 100, reach: 'weapon', maxTargets: 1 }, attr: 10, mastery: 1, lp: 3, gold: 75 },
  { id: 's2', name: 'Широкий взмах', family: 'sword', st: 24, cd: 9, prep: 0, coef: 1.2, shape: { type: 'melee', sector: 120, reach: 'weapon' }, attr: 15, mastery: 10, lp: 4, gold: 150 },
  { id: 's3', name: 'Удар навершием', family: 'sword', st: 20, cd: 14, prep: 0, coef: 0.6, stun: 1, shape: { type: 'melee', sector: 100, reach: 1.5, maxTargets: 1 }, attr: 25, mastery: 25, lp: 6, gold: 300 },
  { id: 's4', name: 'Теснящий удар', family: 'sword', st: 26, cd: 12, prep: 0, coef: 1.3, knock: 2, shape: { type: 'melee', sector: 100, reach: 'weapon', maxTargets: 1 }, attr: 40, mastery: 40, lp: 8, gold: 500 },
  { id: 's5', name: 'Круговой удар', family: 'sword', st: 35, cd: 18, prep: 0, coef: 1.5, shape: { type: 'melee', sector: 360, reach: 'weapon' }, attr: 60, mastery: 60, lp: 10, gold: 800 },
  { id: 's6', name: 'Решающий удар', family: 'sword', st: 32, cd: 20, prep: 0.8, coef: 1.9, executeCoef: 2.5, shape: { type: 'melee', sector: 100, reach: 'weapon', maxTargets: 1 }, attr: 80, mastery: 80, lp: 12, gold: 1200 },
  { id: 'b1', name: 'Прицельный выстрел', family: 'bow', st: 15, cd: 6, prep: 0.7, coef: 1.6, shape: { type: 'arrow', count: 1, range: 30 }, attr: 10, mastery: 1, lp: 3, gold: 75 },
  { id: 'b2', name: 'Двойной выстрел', family: 'bow', st: 22, cd: 9, prep: 0, coef: 0.85, shape: { type: 'arrow', count: 2, interval: 0.25, range: 25 }, attr: 15, mastery: 10, lp: 4, gold: 150 },
  { id: 'b3', name: 'Сдерживающая стрела', family: 'bow', st: 20, cd: 12, prep: 0, coef: 0.9, slow: { power: 0.3, dur: 4 }, shape: { type: 'arrow', count: 1, range: 25 }, attr: 25, mastery: 25, lp: 6, gold: 300 },
  { id: 'b4', name: 'Пробивная стрела', family: 'bow', st: 26, cd: 12, prep: 0, coef: 1.4, shape: { type: 'arrow', count: 1, pierce: [1.4, 1.0, 0.7], range: 30 }, attr: 40, mastery: 40, lp: 8, gold: 500 },
  { id: 'b5', name: 'Веер стрел', family: 'bow', st: 32, cd: 16, prep: 0, coef: 0.55, shape: { type: 'arrow', count: 5, spreadDeg: 40, maxPerTarget: 2, range: 20 }, attr: 60, mastery: 60, lp: 10, gold: 800 },
  { id: 'b6', name: 'Отбрасывающий выстрел', family: 'bow', st: 35, cd: 20, prep: 1, coef: 2, knock: 2, shape: { type: 'arrow', count: 1, range: 30 }, attr: 80, mastery: 80, lp: 12, gold: 1200 },
];

export type SpellShape =
  /** A flying bolt toward the aim; `explode` = radius of a burst where it stops. */
  | { type: 'bolt'; explode?: number }
  /** An instant hit on the aimed target. */
  | { type: 'target' }
  /** Front sector from the hero. */
  | { type: 'sector'; deg: number }
  /** A fixed zone at the aim point: pulses at the given seconds after the preparation. */
  | { type: 'zone'; radius: number; pulses: number[] }
  /** An instant burst at the aim point. */
  | { type: 'burst'; radius: number }
  /** Chain: up to N different targets, each jump ≤ `jump` m from the previous one. */
  | { type: 'chain'; jump: number };

export type School = 'fire' | 'ice' | 'lightning';

export interface SpellDef {
  id: string;
  name: string;
  school: School;
  tier: number;
  /** Base damage of each hit / pulse / chain link. */
  hits: number[];
  mp: number;
  cd: number;
  cast: number;
  range: number;
  shape: SpellShape;
  slow?: { power: number; dur: number };
  stun?: number;
  /** l5: only the first pulse stuns. */
  stunFirstOnly?: boolean;
  lp: number;
  gold: number;
}

/** Magic: 15 spells (5 circles × 3 schools). */
export const SPELLS: SpellDef[] = [
  { id: 'f1', name: 'Огненная искра', school: 'fire', tier: 1, hits: [36], mp: 8, cd: 2, cast: 0.3, range: 25, shape: { type: 'bolt' }, lp: 3, gold: 75 },
  { id: 'f2', name: 'Огненный шар', school: 'fire', tier: 2, hits: [84], mp: 18, cd: 6, cast: 0.7, range: 25, shape: { type: 'bolt', explode: 2 }, lp: 5, gold: 200 },
  { id: 'f3', name: 'Огненная волна', school: 'fire', tier: 3, hits: [110], mp: 26, cd: 9, cast: 0.6, range: 6, shape: { type: 'sector', deg: 90 }, lp: 7, gold: 450 },
  { id: 'f4', name: 'Огненный шторм', school: 'fire', tier: 4, hits: [45, 45, 45, 45], mp: 42, cd: 18, cast: 1.2, range: 22, shape: { type: 'zone', radius: 4, pulses: [0, 1, 2, 3] }, lp: 10, gold: 850 },
  { id: 'f5', name: 'Метеоритный дождь', school: 'fire', tier: 5, hits: [100, 100, 100], mp: 65, cd: 30, cast: 2, range: 25, shape: { type: 'zone', radius: 4, pulses: [0, 1, 2] }, lp: 14, gold: 1500 },
  { id: 'i1', name: 'Водяной снаряд', school: 'ice', tier: 1, hits: [28], mp: 9, cd: 3, cast: 0.3, range: 25, shape: { type: 'bolt' }, slow: { power: 0.2, dur: 3 }, lp: 3, gold: 75 },
  { id: 'i2', name: 'Ледяная стрела', school: 'ice', tier: 2, hits: [65], mp: 19, cd: 7, cast: 0.6, range: 28, shape: { type: 'bolt' }, slow: { power: 0.3, dur: 4 }, lp: 5, gold: 200 },
  { id: 'i3', name: 'Ледяная буря', school: 'ice', tier: 3, hits: [28, 28, 28, 28], mp: 32, cd: 14, cast: 1, range: 22, shape: { type: 'zone', radius: 3.5, pulses: [0, 1, 2, 3] }, slow: { power: 0.35, dur: 4 }, lp: 7, gold: 450 },
  { id: 'i4', name: 'Ледяная тюрьма', school: 'ice', tier: 4, hits: [100], mp: 38, cd: 20, cast: 0.9, range: 22, shape: { type: 'target' }, slow: { power: 0.5, dur: 5 }, lp: 10, gold: 850 },
  { id: 'i5', name: 'Абсолютный холод', school: 'ice', tier: 5, hits: [220], mp: 65, cd: 32, cast: 1.8, range: 22, shape: { type: 'burst', radius: 5 }, slow: { power: 0.5, dur: 6 }, lp: 14, gold: 1500 },
  { id: 'l1', name: 'Электрический разряд', school: 'lightning', tier: 1, hits: [32], mp: 10, cd: 2.5, cast: 0.2, range: 20, shape: { type: 'bolt' }, lp: 3, gold: 75 },
  { id: 'l2', name: 'Удар молнии', school: 'lightning', tier: 2, hits: [72], mp: 20, cd: 7, cast: 0.5, range: 25, shape: { type: 'target' }, stun: 1, lp: 5, gold: 200 },
  { id: 'l3', name: 'Цепная молния', school: 'lightning', tier: 3, hits: [90, 65, 45], mp: 30, cd: 11, cast: 0.7, range: 25, shape: { type: 'chain', jump: 6 }, lp: 7, gold: 450 },
  { id: 'l4', name: 'Грозовой удар', school: 'lightning', tier: 4, hits: [160], mp: 40, cd: 18, cast: 0.9, range: 25, shape: { type: 'target' }, stun: 1.5, lp: 10, gold: 850 },
  { id: 'l5', name: 'Гнев небес', school: 'lightning', tier: 5, hits: [90, 90, 90], mp: 70, cd: 35, cast: 2, range: 25, shape: { type: 'zone', radius: 5, pulses: [0, 1, 2] }, stun: 1.5, stunFirstOnly: true, lp: 14, gold: 1500 },
];

export const SKILL_BY_ID: Record<string, SkillDef> = Object.fromEntries(SKILLS.map((s) => [s.id, s]));
export const SPELL_BY_ID: Record<string, SpellDef> = Object.fromEntries(SPELLS.map((s) => [s.id, s]));

/** Name of a skill or spell id. */
export function abilityName(id: string): string {
  return SKILL_BY_ID[id]?.name ?? SPELL_BY_ID[id]?.name ?? id;
}

export type Rank = 'normal' | 'strong' | 'elite' | 'mini' | 'regional' | 'world';

export interface EnemySpecial {
  name: string;
  damage: number;
  phys: boolean;
  windup: number;
  cd: number;
  /** Reach of the leap (m); the hit lands on the spot fixed at the start of the windup. */
  range: number;
  /** Radius around that spot that is hit. */
  radius: number;
}

export interface EnemyDef {
  id: string;
  name: string;
  level: number;
  rank: Rank;
  hp: number;
  armor: number;
  res: number;
  damage: number;
  phys: boolean;
  interval: number;
  xp: number;
  behavior: 'aggressive' | 'territorial';
  detect: number;
  leash: number;
  windup: number;
  speed: number;
  range: number;
  special?: EnemySpecial;
  /** Active minutes to respawn (Bestiary «Возрождение»). */
  respawnMin: number;
  /** Model scale (technical). */
  scale: number;
  /** Cubic model kind (technical): a wolf by default, a humanoid for bandits. */
  model?: 'wolf' | 'human';
  color: number;
}

/** Bestiary JSON rows (enemyDefs) of the enemies placed in the test scene (stage 5 adds the bandits of the crossing). */
export const ENEMIES: EnemyDef[] = [
  { id: 'wolf', name: 'Серый волк', level: 3, rank: 'normal', hp: 85, armor: 2, res: 2, damage: 14, phys: true, interval: 2.2, xp: 90, behavior: 'aggressive', detect: 12, leash: 35, windup: 0.5, speed: 4.5, range: 2, respawnMin: 4, scale: 1, color: 0x8a8a86 },
  {
    id: 'greyfang', name: 'Серый Клык', level: 8, rank: 'mini', hp: 900, armor: 8, res: 5, damage: 30, phys: true, interval: 2.7, xp: 600, behavior: 'territorial', detect: 16, leash: 35, windup: 1, speed: 4.8, range: 2, respawnMin: 180, scale: 1.45, color: 0x55524e,
    special: { name: 'Прыжок вожака', damage: 45, phys: true, windup: 1.1, cd: 10, range: 6, radius: 1.3 },
  },
];
ENEMIES.push({ id: 'bandit', name: 'Разбойник переправы', level: 10, rank: 'normal', hp: 260, armor: 10, res: 5, damage: 32, phys: true, interval: 2.5, xp: 150, behavior: 'aggressive', detect: 12, leash: 35, windup: 0.5, speed: 3.5, range: 2, respawnMin: 4, scale: 1, color: 0x7a3a2a, model: 'human' });
export const ENEMY_BY_ID: Record<string, EnemyDef> = Object.fromEntries(ENEMIES.map((e) => [e.id, e]));

export function isBoss(r: Rank): boolean {
  return r === 'mini' || r === 'regional' || r === 'world';
}

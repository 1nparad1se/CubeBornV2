import type { AttackShape, WeaponKind } from './items';

/**
 * Weapon types: everything one kind of weapon shares, whatever the item. An item only names its
 * kind and its numbers (damage, speed, range: rpg/items.ts); how it is held, how it attacks and
 * how it sounds come from here, so a new sword, staff or bow is one more entry in ITEMS.
 *
 * The three base families are the staff (magic), the sword (melee) and the bow (ranged); the
 * spear and the crossbow are variants of melee and ranged.
 */
export type WeaponFamily = 'sword' | 'staff' | 'bow' | 'spear' | 'crossbow';
/** melee: hits in reach; magic: casts a spell projectile; ranged: shoots ammunition. */
export type WeaponStyle = 'melee' | 'magic' | 'ranged';
/**
 * How the model holds it: `one` in the right hand (the left stays free for a shield);
 * `two` with both hands on the handle; `bow` gripped by the left hand and drawn by the right;
 * `crossbow` shouldered with both hands.
 */
export type WeaponGrip = 'one' | 'two' | 'bow' | 'crossbow';

export interface WeaponType {
  kind: WeaponKind;
  family: WeaponFamily;
  style: WeaponStyle;
  /** Hands it takes (2: no shield). */
  hands: 1 | 2;
  grip: WeaponGrip;
  /** Attack shape the items of this kind use. */
  shape: AttackShape;
  /** Sound when a swing starts (shots and spells sound when they leave). */
  swingSound: string | null;
  /** Inventory label of the attack («Ближний бой» ...). */
  attackLabel: string;
  /**
   * Two-hand grip: where the left hand may close on the handle, as pixels along the weapon from
   * the right hand (negative: toward the pommel / butt), and the preferred spot.
   */
  leftHand?: { min: number; max: number; pref: number };
}

const MELEE = 'Ближний бой';
const MAGIC = 'Магия (снаряд)';
const RANGED = 'Дальний бой (снаряд)';

export const WEAPON_TYPES: Record<WeaponKind, WeaponType> = {
  sword1h: { kind: 'sword1h', family: 'sword', style: 'melee', hands: 1, grip: 'one', shape: 'melee', swingSound: 'slash', attackLabel: MELEE },
  sword2h: { kind: 'sword2h', family: 'sword', style: 'melee', hands: 2, grip: 'two', shape: 'melee', swingSound: 'slash', attackLabel: MELEE, leftHand: { min: -3.6, max: -1.6, pref: -2.6 } },
  spear: { kind: 'spear', family: 'spear', style: 'melee', hands: 2, grip: 'two', shape: 'sweep', swingSound: 'thrust', attackLabel: `${MELEE}, по площади`, leftHand: { min: -6, max: 9, pref: 5 } },
  staff1h: { kind: 'staff1h', family: 'staff', style: 'magic', hands: 1, grip: 'one', shape: 'projectile', swingSound: null, attackLabel: MAGIC },
  staff2h: { kind: 'staff2h', family: 'staff', style: 'magic', hands: 2, grip: 'two', shape: 'projectile', swingSound: null, attackLabel: MAGIC, leftHand: { min: -5, max: 9, pref: 5 } },
  bow: { kind: 'bow', family: 'bow', style: 'ranged', hands: 2, grip: 'bow', shape: 'projectile', swingSound: null, attackLabel: RANGED },
  crossbow: { kind: 'crossbow', family: 'crossbow', style: 'ranged', hands: 2, grip: 'crossbow', shape: 'projectile', swingSound: null, attackLabel: RANGED },
};

export function weaponType(kind: WeaponKind | null | undefined): WeaponType | null {
  return kind ? WEAPON_TYPES[kind] : null;
}

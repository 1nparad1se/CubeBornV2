import * as THREE from 'three';
import { clump, limb, smoothOut, toGeometry, type SmoothOut } from '../smoothModels';
import { ARMOR_PAL } from './sprites';

/**
 * The stylised human figure (owner: no longer a Minecraft character): a slightly large rounded
 * head with eyes, brows, nose, mouth and ears, shaped hair volumes, a distinct neck, a chest
 * narrowing to the waist over the hips, tapered limbs with elbows and knees, hands and feet.
 * Low-poly and smooth, vertex coloured and softly painted by the shared material. Built in body
 * pixels (32 px = 1.8 blocks) per animated part, around the same joints the poses use.
 */

export type FigurePart = 'head' | 'hair' | 'torso' | 'armR' | 'armL' | 'legR' | 'legL';
type V3 = [number, number, number];

export interface FigureLook {
  skin: number;
  hair: number;
  shirt: number;
  pants: number;
  shoe: number;
  belt: number;
  eye: number;
}

export const HUMAN_LOOK: FigureLook = { skin: 0xe6b894, hair: 0x4a3020, shirt: 0xd8cfb4, pants: 0x6a4a2e, shoe: 0x3a2a1e, belt: 0x4a321c, eye: 0x2e3a5a };

const c = (hex: number) => () => hex;
const ball = (o: SmoothOut, at: V3, r: V3, hex: number, sub = 2, bump?: (x: number, y: number, z: number) => number) => clump(o, at, r, sub, bump ?? (() => 1), c(hex), 2);
const bone = (o: SmoothOut, a: V3, b: V3, ra: number, rb: number, hex: number, sides = 10, rings = 2) => limb(o, a, b, ra, rb, sides, rings, c(hex), 2, true);

/** Geometry of one body part (pixels scaled to blocks by `px`). */
export function figurePart(part: FigurePart, look: FigureLook, px: number): THREE.BufferGeometry {
  const o = smoothOut();
  const s = part.endsWith('R') ? -1 : 1;
  switch (part) {
    case 'legR':
    case 'legL':
      // thigh, knee, shin, a shoe pointing forward
      bone(o, [0, 0.6, 0], [0, -6, 0.25], 2.0, 1.5, look.pants);
      ball(o, [0, -6, 0.35], [1.5, 1.4, 1.5], look.pants, 1);
      bone(o, [0, -6, 0.25], [0, -10.6, 0], 1.45, 1.05, look.pants);
      bone(o, [0, -9.4, 0], [0, -11.2, 0], 1.25, 1.15, look.shoe, 10, 1);
      ball(o, [0, -11.3, 0.9], [1.25, 0.75, 2.1], look.shoe, 1);
      break;
    case 'torso':
      // hips, belt, waist, chest and shoulders
      ball(o, [0, 1.3, 0], [3.25, 1.85, 2.0], look.pants);
      ball(o, [0, 2.8, 0], [3.2, 0.7, 2.15], look.belt, 1);
      ball(o, [0, 3.0, 1.95], [0.7, 0.55, 0.3], 0xb8964a, 0);
      bone(o, [0, 3.0, 0], [0, 7.0, 0], 2.75, 3.2, look.shirt, 14, 2);
      // a broad flat chest (a man's build: wide shoulders, no bust), a rounded back
      ball(o, [0, 8.9, -0.1], [3.85, 2.9, 1.95], look.shirt);
      ball(o, [0, 10.0, -0.3], [3.4, 1.6, 1.8], look.shirt, 1);
      ball(o, [-4.15, 10.3, -0.1], [1.55, 1.45, 1.6], look.shirt, 1);
      ball(o, [4.15, 10.3, -0.1], [1.55, 1.45, 1.6], look.shirt, 1);
      // laces down the front of the shirt
      bone(o, [0, 10.9, 1.75], [0, 8.6, 1.9], 0.12, 0.12, look.belt, 5, 1);
      break;
    case 'head': {
      bone(o, [0, -1.2, 0], [0, 1.6, 0.1], 1.25, 1.15, look.skin, 8, 1);
      // skull and jaw
      ball(o, [0, 4.7, 0.1], [3.6, 4.0, 3.8], look.skin);
      ball(o, [0, 2.9, 0.9], [2.6, 1.9, 2.6], look.skin, 1);
      // ears
      ball(o, [-3.55, 4.3, 0], [0.5, 0.95, 0.75], look.skin, 1);
      ball(o, [3.55, 4.3, 0], [0.5, 0.95, 0.75], look.skin, 1);
      // eyes (white, iris), brows, nose, mouth
      for (const e of [-1, 1]) {
        ball(o, [e * 1.3, 4.95, 3.4], [0.62, 0.5, 0.38], 0xf2eee6, 1);
        ball(o, [e * 1.27, 4.92, 3.72], [0.32, 0.4, 0.14], look.eye, 1);
        ball(o, [e * 1.4, 6.0, 3.55], [0.95, 0.24, 0.32], look.hair, 0);
      }
      ball(o, [0, 4.0, 3.85], [0.38, 0.7, 0.42], look.skin, 1);
      ball(o, [0, 2.55, 3.35], [0.9, 0.2, 0.3], 0x9a5244, 0);
      break;
    }
    case 'hair': {
      // hair: a cap over the crown, fuller at the back, a swept fringe and side locks
      const tuft = (x: number, y: number, z: number) => 1 + Math.sin(x * 2.1 + z * 1.3) * 0.05 + Math.cos(y * 2.7 + x) * 0.04;
      ball(o, [0, 7.0, -0.25], [4.0, 2.7, 4.15], look.hair, 2, tuft);
      ball(o, [0, 4.6, -1.7], [3.8, 3.4, 2.7], look.hair, 2, tuft);
      ball(o, [-1.5, 7.45, 2.9], [2.1, 1.05, 1.2], look.hair, 1);
      ball(o, [1.6, 7.2, 3.05], [1.7, 0.9, 1.0], look.hair, 1);
      ball(o, [-3.55, 5.0, -0.6], [0.8, 2.0, 1.7], look.hair, 1);
      ball(o, [3.55, 5.0, -0.6], [0.8, 2.0, 1.7], look.hair, 1);
      break;
    }
    case 'armR':
    case 'armL':
      // sleeve, elbow, bare forearm, a hand with a thumb
      bone(o, [0, 0.4, 0], [0, -4.6, 0], 1.4, 1.15, look.shirt, 12, 3);
      ball(o, [0, -4.7, 0], [1.22, 1.0, 1.22], look.shirt, 1);
      ball(o, [0, -5.5, 0], [1.28, 0.45, 1.28], look.shirt, 1);
      bone(o, [0, -5.2, 0], [0, -8.2, 0.1], 1.0, 0.8, look.skin, 12, 2);
      ball(o, [0, -9.0, 0.25], [0.95, 1.2, 1.05], look.skin, 1);
      ball(o, [-s * 0.75, -8.6, 0.85], [0.35, 0.65, 0.35], look.skin, 0);
      break;
  }
  const g = toGeometry(o);
  g.scale(px, px, px);
  g.computeBoundingSphere();
  return g;
}

/** Armour pieces shaped to the figure, per slot and set, each listed with the part it rides on. */
export function armorParts(slot: string, set: string, px: number): { part: FigurePart; geo: THREE.BufferGeometry }[] {
  const P = ARMOR_PAL[set] ?? ARMOR_PAL.guard;
  const hex = (s: string) => parseInt(s.slice(1), 16);
  const A = hex(P.a), B = hex(P.b), C = hex(P.c), D = hex(P.d);
  const heavy = set === 'guard';
  const out: { part: FigurePart; geo: THREE.BufferGeometry }[] = [];
  const piece = (part: FigurePart, build: (o: SmoothOut) => void) => {
    const o = smoothOut();
    build(o);
    const g = toGeometry(o);
    g.scale(px, px, px);
    g.computeBoundingSphere();
    out.push({ part, geo: g });
  };
  if (slot === 'head') {
    piece('head', (o) => {
      if (set === 'apprentice') {
        // a tall soft mage's hat with a wide brim and a trim band
        ball(o, [0, 7.2, -0.1], [5.6, 0.45, 5.6], A);
        ball(o, [0, 7.7, -0.1], [3.9, 0.55, 3.9], D, 1);
        limb(o, [0, 7.6, -0.1], [0.8, 13.6, -1.4], 3.6, 0.35, 12, 4, c(A), 2, true, (t) => [Math.sin(t * 2.4) * 0.6 * t, 0]);
      } else if (heavy) {
        // a rounded steel helm with a cheek guard band and a nasal
        ball(o, [0, 6.4, -0.4], [4.55, 4.0, 4.75], B);
        ball(o, [0, 4.7, -1.6], [4.4, 2.6, 3.3], B, 1);
        ball(o, [0, 5.0, -0.4], [4.65, 0.6, 4.85], C, 1);
        bone(o, [0, 5.6, 4.35], [0, 3.4, 4.55], 0.38, 0.3, C, 6, 1);
        ball(o, [0, 10.0, -0.4], [0.8, 0.8, 3.0], D, 1);
      } else {
        // a leather hood over the hair, open at the face
        ball(o, [0, 6.6, -0.6], [4.55, 3.9, 4.6], A);
        ball(o, [0, 4.0, -1.9], [4.25, 3.6, 3.0], C);
        ball(o, [0, 0.6, -0.4], [2.9, 1.0, 2.6], A, 1);
      }
    });
  }
  if (slot === 'body') {
    piece('torso', (o) => {
      ball(o, [0, 8.9, -0.1], [4.2, 3.3, 2.35], A);
      ball(o, [0, 10.0, -0.3], [3.75, 1.9, 2.15], A, 1);
      limb(o, [0, 2.6, 0], [0, 7.3, 0], 3.05, 3.5, 14, 2, c(set === 'apprentice' ? A : C), 2, true);
      for (const x of [-4.15, 4.15]) ball(o, [x, 10.3, -0.1], [1.85, 1.75, 1.9], heavy ? B : A, 1);
      ball(o, [0, 2.9, 0], [3.45, 0.75, 2.45], D, 1);
      if (heavy) ball(o, [0, 8.9, 1.7], [2.8, 2.5, 1.0], B, 1);
      if (set === 'apprentice') {
        // robe skirt down over the thighs
        limb(o, [0, 2.6, 0], [0, -5.5, 0], 3.4, 4.3, 14, 3, c(A), 2);
      }
    });
    for (const part of ['armR', 'armL'] as FigurePart[])
      piece(part, (o) => {
        const r = heavy ? 2.3 : 1.95;
        ball(o, [0, -0.4, 0], [r, heavy ? 1.9 : 1.6, r], heavy ? B : A, 1);
        bone(o, [0, -0.6, 0], [0, -4.2, 0], 1.7, 1.4, A, 10, 1);
      });
  }
  if (slot === 'hands')
    for (const part of ['armR', 'armL'] as FigurePart[])
      piece(part, (o) => {
        bone(o, [0, -5.4, 0], [0, -8.3, 0.1], 1.35, 1.1, heavy ? B : A, 10, 1);
        ball(o, [0, -5.4, 0], [1.5, 0.55, 1.5], D, 1);
        ball(o, [0, -9.0, 0.25], [1.12, 1.35, 1.2], heavy ? C : A, 1);
      });
  if (slot === 'feet')
    for (const part of ['legR', 'legL'] as FigurePart[])
      piece(part, (o) => {
        bone(o, [0, -7.2, 0.1], [0, -11.1, 0], 1.75, 1.4, heavy ? B : A, 10, 1);
        ball(o, [0, -7.2, 0.15], [1.85, 0.55, 1.85], D, 1);
        ball(o, [0, -11.3, 0.95], [1.45, 0.9, 2.3], heavy ? C : A, 1);
      });
  return out;
}

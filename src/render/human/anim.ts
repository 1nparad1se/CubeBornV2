import * as THREE from 'three';

/**
 * Animation logic of the character (pure: no scene, testable in Node). The model asks it, every
 * frame, for the pose of the moment, and places the bones from that (HumanModel: FK for the
 * body and legs, two-bone IK for the arms onto the weapon's grips).
 *
 * - Combat state: peace → drawing → combat → sheathing → peace, with timed transitions; the
 *   weapon is never swapped from back to hand in one frame (the hand reaches it first).
 * - Locomotion in eight directions relative to the facing: the legs step along the actual way of
 *   travel (forward, back, sideways and diagonally) while the body keeps facing the target.
 * - Weapon frames: where the grip is and how the weapon points (body frame: metres, y up, +z
 *   forward, +x the model's left), per weapon family, for the stance, the back and every frame of
 *   every attack. Attacks are keyed so that the impact (or the release) lands on the hit moment.
 */

export type Family = 'sword' | 'great' | 'bow' | 'staff' | 'other';
export type CombatPhase = 'peace' | 'drawing' | 'combat' | 'sheathing';

/** Seconds of the weapon transitions per family (the staff only raises / lowers). */
export const DRAW_TIME: Record<Family, number> = { sword: 0.55, great: 0.7, bow: 0.55, staff: 0.4, other: 0.3 };
export const SHEATHE_TIME: Record<Family, number> = { sword: 0.65, great: 0.8, bow: 0.6, staff: 0.45, other: 0.3 };
/** Share of the draw at which the hand closes on the weapon on the back (the grab). */
export const GRAB_AT = 0.38;

/**
 * Combat state machine. `want`: the game wants the weapon ready (a fight, a selected enemy near,
 * an attack or a held action); `busy`: an attack runs (the weapon is never put away during one).
 */
export class CombatState {
  phase: CombatPhase = 'peace';
  /** Progress of the running transition 0..1 (1 at the end of drawing / sheathing). */
  t = 0;
  constructor(public family: Family | null = null) {}

  update(dt: number, want: boolean, busy: boolean): void {
    const f = this.family ?? 'other';
    switch (this.phase) {
      case 'peace':
        if (want || busy) {
          this.phase = 'drawing';
          this.t = 0;
        }
        break;
      case 'drawing':
        this.t = Math.min(1, this.t + dt / DRAW_TIME[f]);
        if (this.t >= 1) this.phase = 'combat';
        break;
      case 'combat':
        this.t = 1;
        if (!want && !busy) {
          this.phase = 'sheathing';
          this.t = 0;
        }
        break;
      case 'sheathing':
        if (want || busy) {
          // back to the hand from where the weapon is now (no jump)
          this.phase = 'drawing';
          this.t = 1 - this.t;
          break;
        }
        this.t = Math.min(1, this.t + dt / SHEATHE_TIME[f]);
        if (this.t >= 1) {
          this.phase = 'peace';
          this.t = 0;
        }
        break;
    }
  }

  /** 0 = weapon away (peace), 1 = ready (combat), smooth in between. */
  get ready(): number {
    if (this.phase === 'combat') return 1;
    if (this.phase === 'peace') return 0;
    return this.phase === 'drawing' ? this.t : 1 - this.t;
  }

  /** Is the weapon in the hand (true) or still / already on its mount (false)? */
  get inHand(): boolean {
    if (this.phase === 'combat') return true;
    if (this.phase === 'peace') return false;
    return this.phase === 'drawing' ? this.t >= GRAB_AT : this.t < 1 - GRAB_AT;
  }
}

// ---------------------------------------------------------------- frames

/** Grip point `g`, handle direction `a` (toward the business end), edge / arrow direction `e`. */
export interface Frame {
  g: THREE.Vector3;
  a: THREE.Vector3;
  e: THREE.Vector3;
}

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

/** A frame from a grip point, a direction and a hint for the edge (made perpendicular). */
export function frame(g: THREE.Vector3, a: THREE.Vector3, hint: THREE.Vector3 = V(0, 0, 1)): Frame {
  const an = a.clone().normalize();
  let e = hint.clone().sub(an.clone().multiplyScalar(an.dot(hint)));
  if (e.lengthSq() < 1e-6) e = Math.abs(an.y) < 0.9 ? V(0, 1, 0).sub(an.clone().multiplyScalar(an.y)) : V(1, 0, 0).sub(an.clone().multiplyScalar(an.x));
  return { g: g.clone(), a: an, e: e.normalize() };
}

/** Interpolates two frames (positions linearly, directions by slerp of their bases). */
export function mixFrame(a: Frame, b: Frame, k: number, out?: Frame): Frame {
  const o = out ?? { g: new THREE.Vector3(), a: new THREE.Vector3(), e: new THREE.Vector3() };
  o.g.lerpVectors(a.g, b.g, k);
  const qa = basisQuat(a);
  const qb = basisQuat(b);
  qa.slerp(qb, k);
  o.a.set(0, 1, 0).applyQuaternion(qa);
  o.e.set(0, 0, 1).applyQuaternion(qa);
  return o;
}

/** Rotation taking the grip frame (+y handle, +z edge) to the frame's directions. */
export function basisQuat(f: Frame): THREE.Quaternion {
  const x = new THREE.Vector3().crossVectors(f.a, f.e).normalize();
  const e = new THREE.Vector3().crossVectors(x, f.a).normalize();
  const m = new THREE.Matrix4().makeBasis(x, f.a, e);
  return new THREE.Quaternion().setFromRotationMatrix(m);
}

const ease = (x: number) => {
  const c = Math.max(0, Math.min(1, x));
  return c * c * (3 - 2 * c);
};

/** One key of an attack: time (0..1 of the swing; `hit` marks the impact key), frame, body. */
interface Key {
  t: number;
  g: [number, number, number];
  a: [number, number, number];
  e?: [number, number, number];
  /** Torso turn (radians, + to the left), lean forward (+), step of the front foot (0..1). */
  yaw?: number;
  lean?: number;
  step?: number;
  hit?: boolean;
}

/** Body motion that goes with a weapon frame. */
export interface BodyMotion {
  yaw: number;
  lean: number;
  step: number;
}

export interface WeaponPose {
  frame: Frame;
  body: BodyMotion;
  /** Bow: how far the string is drawn (0..1); the arrow shows; the right hand is on the string. */
  draw?: number;
  arrow?: boolean;
  onString?: boolean;
  /** Staff: the magic at its head (0..1 size) and a flash at the release. */
  orb?: number;
  flash?: number;
  /** Second hand on the handle (two-handed grips). */
  twoHands?: boolean;
  /** Staff: the free hand's target (body frame) and how open it is (0 open .. 1 fist). */
  free?: THREE.Vector3;
  freeCurl?: number;
  /** Bow: the drawing hand reaches over the shoulder for a new arrow (0..1). */
  reload?: number;
}

// The right hand's side is -x. Shoulders at y 1.235, x ±0.25; the hands reach about 0.53 m.

/** Sword (one hand): four swings and the guard. */
const SWORD_SWINGS: Key[][] = [
  // 0: horizontal, right to left
  [
    { t: 0, g: [-0.42, 1.12, 0.02], a: [-0.75, 0.25, -0.6], e: [0, 0, 1], yaw: -0.65, lean: 0.05 },
    { t: 0.55, g: [-0.12, 1.08, 0.44], a: [0.05, 0.08, 1], e: [1, 0, 0], yaw: 0.05, lean: 0.12, step: 0.8, hit: true },
    { t: 0.8, g: [0.2, 1.04, 0.32], a: [0.9, 0.02, 0.35], e: [0.3, 0, -1], yaw: 0.45, lean: 0.1, step: 0.6 },
    { t: 1, g: [-0.16, 1.02, 0.3], a: [-0.55, 0.8, 0.22], e: [0.7, 0.2, 0.7], yaw: 0.25, lean: 0.06, step: 0.9 },
  ],
  // 1: horizontal, left to right (backhand)
  [
    { t: 0, g: [0.12, 1.15, 0.22], a: [0.85, 0.2, -0.3], e: [0, 0, -1], yaw: 0.55, lean: 0.05 },
    { t: 0.55, g: [-0.1, 1.08, 0.46], a: [-0.05, 0.08, 1], e: [-1, 0, 0], yaw: -0.05, lean: 0.12, step: 0.8, hit: true },
    { t: 0.8, g: [-0.38, 1.05, 0.22], a: [-0.9, 0.05, 0.25], e: [-0.2, 0, -1], yaw: -0.5, lean: 0.08, step: 0.5 },
    { t: 1, g: [-0.16, 1.02, 0.3], a: [-0.55, 0.8, 0.22], e: [0.7, 0.2, 0.7], yaw: 0.25, lean: 0.06, step: 0.9 },
  ],
  // 2: vertical, top to bottom
  [
    { t: 0, g: [-0.14, 1.52, 0.02], a: [0.05, 0.55, -0.85], e: [0, 1, 0], yaw: -0.15, lean: -0.15 },
    { t: 0.55, g: [-0.1, 1.08, 0.48], a: [0.02, 0.1, 1], e: [0, -1, 0], yaw: 0, lean: 0.25, step: 1, hit: true },
    { t: 0.8, g: [-0.12, 0.86, 0.42], a: [0.05, -0.7, 0.7], e: [0, -1, -0.5], yaw: 0, lean: 0.3, step: 0.9 },
    { t: 1, g: [-0.16, 1.02, 0.3], a: [-0.55, 0.8, 0.22], e: [0.7, 0.2, 0.7], yaw: 0.25, lean: 0.06, step: 0.9 },
  ],
  // 3: diagonal, from over the right shoulder down to the left hip
  [
    { t: 0, g: [-0.36, 1.45, 0.02], a: [-0.45, 0.65, -0.6], e: [-0.3, 0.3, 1], yaw: -0.5, lean: -0.05 },
    { t: 0.55, g: [-0.08, 1.12, 0.46], a: [0.35, 0.05, 0.95], e: [0.7, -0.7, 0], yaw: 0.1, lean: 0.18, step: 0.9, hit: true },
    { t: 0.8, g: [0.16, 0.86, 0.32], a: [0.6, -0.65, 0.45], e: [0.5, -0.6, -0.6], yaw: 0.4, lean: 0.22, step: 0.7 },
    { t: 1, g: [-0.16, 1.02, 0.3], a: [-0.55, 0.8, 0.22], e: [0.7, 0.2, 0.7], yaw: 0.25, lean: 0.06, step: 0.9 },
  ],
];

/** Greatsword (two hands): wider, heavier swings on the same four lines. */
const GREAT_SWINGS: Key[][] = SWORD_SWINGS.map((sw) =>
  sw.map((k) => ({ ...k, g: [k.g[0] * 0.75 + 0.03, k.g[1] + 0.02, k.g[2] * 0.95] as [number, number, number], yaw: (k.yaw ?? 0) * 1.25, lean: (k.lean ?? 0) * 1.2 })),
);

/**
 * Combat stance of each family (owner's reference sheets, «В бою»): the sword raised in both hands
 * in front of the right shoulder, the blade up and out; the bow upright in the outstretched left
 * hand at face height, an arrow nocked and drawn to the chin; the staff in the right hand, leaning
 * out with the crystal up beside the head, the free hand reaching forward.
 */
export function stanceFrame(f: Family, walk: number, moving: number): Frame {
  const bob = Math.sin(walk * 2) * 0.012 * moving;
  switch (f) {
    case 'sword':
      return frame(V(-0.16, 1.02 + bob, 0.3), V(-0.55, 0.8, 0.22), V(0.7, 0.2, 0.7));
    case 'great':
      return frame(V(-0.14, 0.98 + bob, 0.3), V(-0.5, 0.82, 0.25), V(0.7, 0.2, 0.7));
    case 'bow':
      // upright, the arrow along +z at chin height (in front of the face: the head is a big cube)
      return frame(V(BOW_X, 1.3 + bob, 0.64), V(0.06, 1, 0), V(0, 0, 1));
    case 'staff':
      return frame(V(-0.32, 1.0 + bob, 0.22), V(-0.45, 0.88, 0.14), V(0, 0, 1));
    default:
      return frame(V(-0.3, 0.8 + bob, 0.18), V(0, 0.2, 1), V(0, -1, 0));
  }
}

/** Sideways place of the bow hand and of the drawing hand in the stance (one line: the arrow). */
export const BOW_X = -0.05;
/** The drawing hand's anchor at full draw: under the chin, just in front of the face. */
export const BOW_ANCHOR = V(BOW_X, 1.3, 0.16);

/**
 * Out of combat («Вне боя»): the weapon held low in the hand at the side — the sword's blade
 * pointing down and forward, the bow upright beside the left leg, the staff upright with its butt
 * on the ground — swinging a little with the step.
 */
export function peaceFrame(f: Family, walk: number, moving: number): Frame {
  const sw = Math.sin(walk) * moving;
  switch (f) {
    case 'sword':
      return frame(V(-0.34, 0.72, 0.1 + sw * 0.1), V(0.1, -0.55, 0.83 - sw * 0.2), V(0, 0.8, 0.5));
    case 'great':
      return frame(V(-0.35, 0.74, 0.1 + sw * 0.08), V(0.08, -0.45, 0.89 - sw * 0.15), V(0, 0.9, 0.4));
    case 'bow':
      return frame(V(0.36, 0.8, 0.08 - sw * 0.1), V(0, 1, 0.04 - sw * 0.12), V(0, 0, 1));
    case 'staff':
      return frame(V(-0.36, 0.86, 0.12 + sw * 0.12), V(0, 1, 0.03 + sw * 0.15), V(0, 0, 1));
    default:
      return frame(V(-0.34, 0.74, 0.1), V(0, -0.3, 1), V(0, 1, 0));
  }
}

/** @deprecated kept for old callers: the staff's relaxed frame. */
export function staffPeaceFrame(walk: number, moving: number): Frame {
  return peaceFrame('staff', walk, moving);
}

/** Body of the combat stance per family: torso turn, lean, and how wide the feet stand. */
export function stanceBody(f: Family): BodyMotion {
  switch (f) {
    case 'sword':
      return { yaw: 0.25, lean: 0.06, step: 0.9 };
    case 'great':
      return { yaw: 0.3, lean: 0.08, step: 1 };
    case 'bow':
      // side-on: the left shoulder toward the target
      return { yaw: -0.75, lean: 0.02, step: 1 };
    case 'staff':
      return { yaw: 0.2, lean: 0.05, step: 0.9 };
    default:
      return { yaw: 0, lean: 0, step: 0 };
  }
}

/** The free (left) hand of the staff: reaching forward, palm open (body frame). */
export const STAFF_FREE = V(0.22, 1.12, 0.52);

/**
 * Where the weapon rests on the back (chest frame). Since update 7 weapons stay in the hand
 * («Вне боя» poses of the references); only the bow's quiver is on the back.
 */
export function backFrame(f: Family): Frame {
  switch (f) {
    case 'sword':
      return frame(V(-0.2, 0.5, -0.19), V(0.45, -1, 0), V(0, 0, -1));
    case 'great':
      return frame(V(-0.18, 0.55, -0.2), V(0.4, -1, 0), V(0, 0, -1));
    case 'bow':
      return frame(V(0.02, 0.22, -0.21), V(0.6, 0.8, 0), V(-0.8, 0.6, 0));
    default:
      return frame(V(-0.3, -0.1, 0.05), V(0, 1, 0), V(0, 0, 1));
  }
}

/** Interpolates attack keys at time u (0..1), the impact key placed at `hitAt`. */
function keyed(keys: Key[], u: number, hitAt: number): WeaponPose {
  // remap: keys before the impact take [0, hitAt], after it [hitAt, 1]
  const hk = keys.find((k) => k.hit)?.t ?? 0.5;
  const t = u <= hitAt ? (u / Math.max(1e-3, hitAt)) * hk : hk + ((u - hitAt) / Math.max(1e-3, 1 - hitAt)) * (1 - hk);
  let i = 0;
  while (i < keys.length - 2 && keys[i + 1].t < t) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const k0 = Math.max(0, Math.min(1, (t - a.t) / Math.max(1e-4, b.t - a.t)));
  // windup and recovery ease; the strike itself accelerates into the impact (weapon inertia)
  const k = b.hit ? k0 * k0 * (2 - k0 * 0.6) / 1.4 : ease(k0);
  const fa = frame(V(...a.g), V(...a.a), V(...(a.e ?? [0, 0, 1])));
  const fb = frame(V(...b.g), V(...b.a), V(...(b.e ?? [0, 0, 1])));
  const kk = Math.min(1, Math.max(0, k));
  return {
    frame: mixFrame(fa, fb, kk),
    body: { yaw: lerp(a.yaw ?? 0, b.yaw ?? 0, kk), lean: lerp(a.lean ?? 0, b.lean ?? 0, kk), step: lerp(a.step ?? 0, b.step ?? 0, kk) },
  };
}
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/** Swings keep the fighting stance's wide feet (the step of a key only adds to it). */
function withStep(p: WeaponPose): WeaponPose {
  p.body.step = Math.min(1.4, 0.8 + p.body.step * 0.6);
  return p;
}

/**
 * Melee swing `variant` (0 right→left, 1 left→right, 2 top→bottom, 3 diagonal) at progress u.
 * A combo is consecutive attacks taking the next variant; a skill swing chains two (`combo`).
 */
export function swingPose(f: 'sword' | 'great', variant: number, u: number, hitAt: number, combo = false): WeaponPose {
  const set = f === 'great' ? GREAT_SWINGS : SWORD_SWINGS;
  if (combo) {
    // two strikes in one action: the diagonal, then the backhand (the second on the hit moment)
    if (u < hitAt * 0.6) return withStep({ ...keyed(set[3], u / (hitAt * 0.6), 0.75), twoHands: true });
    const v = keyed(set[1], (u - hitAt * 0.6) / (1 - hitAt * 0.6), (hitAt * 0.4) / (1 - hitAt * 0.6));
    return withStep({ ...v, twoHands: true });
  }
  return withStep({ ...keyed(set[((variant % 4) + 4) % 4], u, hitAt), twoHands: true });
}

/** Stance draw of the bow in combat (an arrow nocked, the string partly drawn). */
export const BOW_STANCE_DRAW = 0.85;

/**
 * Bow shot at progress u (release at hitAt): from the stance the string comes to full draw, holds
 * a moment (aim), is released (the string snaps back, the bow hand gives a little), the drawing
 * hand goes over the shoulder for a new arrow, nocks it and draws back into the stance.
 */
export function bowPose(u: number, hitAt: number, walk: number, moving: number): WeaponPose {
  const st = stanceFrame('bow', walk, moving);
  const r = Math.max(0.05, hitAt);
  const body = stanceBody('bow');
  if (u < r) {
    const k = ease(u / (r * 0.7));
    return { frame: st, body: { ...body, lean: body.lean + 0.03 * k }, draw: BOW_STANCE_DRAW + (1 - BOW_STANCE_DRAW) * k, arrow: true, onString: true };
  }
  const v = (u - r) / Math.max(1e-3, 1 - r);
  // recoil: the bow hand kicks forward and down a little, then settles
  const kick = Math.max(0, 1 - v / 0.25);
  const f = frame(st.g.clone().add(V(0, -0.03 * kick, 0.04 * kick)), st.a, st.e);
  if (v < 0.18) return { frame: f, body, draw: 0, arrow: false, onString: false, reload: 0 };
  if (v < 0.6) return { frame: f, body, draw: 0, arrow: v > 0.4, onString: false, reload: ease((v - 0.18) / 0.22) };
  // nock and draw back into the stance
  const k = ease((v - 0.6) / 0.4);
  return { frame: f, body, draw: BOW_STANCE_DRAW * k, arrow: true, onString: true, reload: 1 - k };
}

/** Bow held at full draw (aiming). */
export function bowAimPose(k: number, walk: number, moving: number): WeaponPose {
  const st = stanceFrame('bow', walk, moving);
  return { frame: st, body: stanceBody('bow'), draw: BOW_STANCE_DRAW + (1 - BOW_STANCE_DRAW) * ease(k), arrow: true, onString: true };
}

/**
 * Staff spell at progress u (release at hitAt): gather (the staff drawn back and up, the free hand
 * to the crystal), thrust the crystal at the target with the free hand pushing forward (release:
 * flash), back to the stance. `power`: the strong spell — raised high over the head first, a lunge
 * into the release, a bigger orb.
 */
export function staffPose(u: number, hitAt: number, walk: number, moving: number, power = false): WeaponPose {
  const st = stanceFrame('staff', walk, moving);
  const sb = stanceBody('staff');
  const prep = power ? frame(V(-0.22, 1.46, 0.08), V(-0.08, 1, -0.12), V(0, 0, 1)) : frame(V(-0.3, 1.22, 0.06), V(-0.2, 0.96, -0.2), V(0, 0, 1));
  const point = frame(V(-0.22, 1.16, 0.4), V(-0.06, 0.5, 0.86), V(0, 1, 0));
  const freePrep = power ? V(0.05, 1.62, 0.18) : V(0.12, 1.3, 0.3);
  const freePush = V(0.16, 1.2, 0.62);
  const r = Math.max(0.05, hitAt);
  let f: Frame;
  let body: BodyMotion;
  let free: THREE.Vector3;
  if (u < r * 0.6) {
    const k = ease(u / (r * 0.6));
    f = mixFrame(st, prep, k);
    free = STAFF_FREE.clone().lerp(freePrep, k);
    body = { yaw: lerp(sb.yaw, 0.35, k), lean: lerp(sb.lean, power ? -0.12 : -0.04, k), step: sb.step };
  } else if (u < r) {
    const k = ease((u - r * 0.6) / (r * 0.4));
    f = mixFrame(prep, point, k);
    free = freePrep.clone().lerp(freePush, k);
    body = { yaw: lerp(0.35, -0.1, k), lean: lerp(power ? -0.12 : -0.04, power ? 0.25 : 0.14, k), step: 1 };
  } else {
    const k = ease((u - r) / (1 - r));
    f = mixFrame(point, st, k);
    free = freePush.clone().lerp(STAFF_FREE, k);
    body = { yaw: lerp(-0.1, sb.yaw, k), lean: lerp(power ? 0.25 : 0.14, sb.lean, k), step: 1 - (1 - sb.step) * k };
  }
  const orb = u < r ? ease(u / r) * (power ? 1 : 0.6) : 0;
  const flash = u >= r ? Math.max(0, 1 - (u - r) / 0.12) : 0;
  return { frame: f, body, orb, flash, twoHands: false, free, freeCurl: u < r * 0.6 ? 0.35 : 0.05 };
}

/** Staff charged (held): drawn back and up, the free hand cupping the growing orb. */
export function staffChargePose(k: number, walk: number, moving: number): WeaponPose {
  const st = stanceFrame('staff', walk, moving);
  const prep = frame(V(-0.22, 1.42, 0.12), V(-0.1, 1, -0.08), V(0, 0, 1));
  const kk = ease(k * 2);
  return { frame: mixFrame(st, prep, kk), body: { yaw: 0.3 * kk, lean: -0.06 * k, step: 1 }, orb: 0.3 + 0.7 * k, twoHands: false, free: STAFF_FREE.clone().lerp(V(0.0, 1.5, 0.36), kk), freeCurl: 0.4 };
}

/** Sword block (held): the blade across in front of the face, both hands on the hilt. */
export function blockPose(f: 'sword' | 'great', k: number, walk: number, moving: number): WeaponPose {
  const st = stanceFrame(f, walk, moving);
  const guard = frame(V(-0.2, 1.3, 0.36), V(0.95, 0.3, 0.05), V(0, 0.3, 1));
  return { frame: mixFrame(st, guard, ease(k)), body: { yaw: 0.1 * (1 - k), lean: 0.05 * k, step: 1 }, twoHands: true };
}

// ---------------------------------------------------------------- locomotion

/** Joint angles of one frame of the gait (body frame; radians). */
export interface Legs {
  /** Thigh swing about the axis across the way of travel (+ = foot back) and its axis. */
  swingR: number;
  swingL: number;
  axis: THREE.Vector3;
  /** Knee bend (+ = flexion) and foot pitch relative to level (+ = toes down). */
  kneeR: number;
  kneeL: number;
  footR: number;
  footL: number;
  /** Pelvis turn with the stride (+ = right hip forward), hip roll, sideways sway (m). */
  hipYaw: number;
  hipRoll: number;
  sway: number;
  /** Extra pelvis height of the run's flight phase (m). */
  lift: number;
  /** Arm swing amplitude and elbow bend; 0 walk .. 1 run blend. */
  armAmp: number;
  elbow: number;
  run: number;
  /** Lean toward the way of travel (x sideways, y forward). */
  lean: THREE.Vector2;
  /** Kept for old callers: the pelvis bob (the model now grounds the feet itself). */
  bob: number;
}

/**
 * Stride (m per step) at a speed: a walk takes short steps, a run long ones with a flight between
 * them (cadence about 2 steps a second walking, 3.5 sprinting).
 */
export function stride(speed: number): number {
  if (speed <= 2.5) return 0.42 + speed * 0.12;
  if (speed <= 5) return 0.72 + (speed - 2.5) * 0.29;
  return 1.45 + Math.min(1, (speed - 5) / 2.5) * 0.45;
}

/** Hip to ankle of the model (m). */
export const LEG_LEN = 0.59;

/**
 * Thigh swing amplitude at a speed: matched to the stride while walking (the planted foot moves
 * with the ground), held in a natural range when running (the flight covers the rest).
 */
export function swingAmp(speed: number): number {
  const walk = Math.asin(Math.min(0.9, stride(Math.min(speed, 2.2)) / 2 / LEG_LEN));
  if (speed <= 2.2) return walk;
  return walk + Math.min(1, (speed - 2.2) / 5.3) * (0.68 - walk);
}

/**
 * The gait: `local` is the velocity in the body frame (x left, z forward, m/s), `phase` the step
 * phase (grows by π per stride walked). A natural cycle per leg: the swing leg's knee folds
 * (much more when running), the stance knee gives a little at contact, the heel strikes and the
 * toes push off; the pelvis turns with the stride and sways over the standing foot; the arms
 * swing against the legs, the elbows bend more with speed. Walking forward, back, sideways and
 * diagonally all step along the actual way of travel; everything fades out toward standing.
 */
export function legs(local: THREE.Vector2, phase: number): Legs {
  const speed = local.length();
  const k = Math.min(1, speed / 1.2);
  const run = Math.max(0, Math.min(1, (speed - 2.8) / 2.2));
  const axis = new THREE.Vector3(1, 0, 0);
  if (speed > 0.05) axis.set(local.y, 0, -local.x).normalize();
  // sideways steps are shorter (the legs would cross); backwards steps a little shorter too
  const side = speed > 0.05 ? Math.abs(local.x) / speed : 0;
  const back = speed > 0.05 && local.y < 0 ? -local.y / speed : 0;
  const amp = swingAmp(speed) * k * (1 - side * 0.4) * (1 - back * 0.2);
  const leg = (p: number) => {
    const s = Math.sin(p);
    const c = Math.cos(p);
    // swing phase: cos > 0 (the foot travels forward through the air); stance: cos < 0
    const swing = -amp * s;
    const kSwing = (0.55 + run * 1.05) * k;
    const kStance = (0.1 + run * 0.35) * k;
    const sw = Math.max(0, Math.cos(p + 0.35));
    const st = c < 0 ? Math.max(0, Math.sin(2 * (p - Math.PI / 2))) : 0;
    const knee = 0.04 * k + kSwing * Math.pow(sw, 1.3) + kStance * Math.max(0, st) * (s > 0 ? 1 : 0.4);
    // feet: heel strike (toes up) as the leg lands in front, push-off (toes down) behind
    const toeOff = Math.max(0, -s) * Math.max(0, c + 0.2) * (0.45 + run * 0.4);
    const heel = Math.max(0, s) * Math.max(0, -c) * 0.25;
    const foot = (toeOff - heel - sw * 0.12) * k;
    return { swing, knee, foot };
  };
  const R = leg(phase);
  const L = leg(phase + Math.PI);
  const s = Math.sin(phase);
  const c = Math.cos(phase);
  const hipYaw = s * (0.1 + run * 0.06) * k * (1 - side);
  const hipRoll = -c * 0.04 * k * (1 - run * 0.5);
  const sway = c * (0.018 - run * 0.008) * k * (1 - side);
  const lift = run * Math.pow(Math.abs(s), 3) * 0.035;
  const lean = new THREE.Vector2(local.x, local.y).multiplyScalar(0.025 * Math.min(1, speed / 3));
  return {
    swingR: R.swing,
    swingL: L.swing,
    axis,
    kneeR: R.knee,
    kneeL: L.knee,
    footR: R.foot,
    footL: L.foot,
    hipYaw,
    hipRoll,
    sway,
    lift,
    armAmp: (0.42 + run * 0.5) * k,
    elbow: 0.25 + run * 1.05 * k,
    run,
    lean,
    bob: 0,
  };
}

/** Swing variant of the n-th attack of a combo: the next line each time, back to the first after a pause. */
export class ComboCounter {
  private last = -1;
  private gap = 99;
  variant = 0;
  /** Call every frame with the running attack's id (null when none). */
  update(dt: number, seq: number | null): number {
    if (seq === null) {
      this.gap += dt;
      if (this.gap > 1.6) this.variant = -1;
      return Math.max(0, this.variant);
    }
    if (seq !== this.last) {
      this.last = seq;
      this.variant = this.gap > 1.6 ? 0 : (this.variant + 1) % 4;
      this.gap = 0;
    }
    return this.variant;
  }
}

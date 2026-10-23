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
}

// The right hand's side is -x. Shoulders at y 1.235, x ±0.25; the hands reach about 0.53 m.

/** Sword (one hand): four swings and the guard. */
const SWORD_SWINGS: Key[][] = [
  // 0: horizontal, right to left
  [
    { t: 0, g: [-0.42, 1.12, 0.02], a: [-0.75, 0.25, -0.6], e: [0, 0, 1], yaw: -0.65, lean: 0.05 },
    { t: 0.55, g: [-0.12, 1.08, 0.44], a: [0.05, 0.08, 1], e: [1, 0, 0], yaw: 0.05, lean: 0.12, step: 0.8, hit: true },
    { t: 0.8, g: [0.2, 1.04, 0.32], a: [0.9, 0.02, 0.35], e: [0.3, 0, -1], yaw: 0.45, lean: 0.1, step: 0.6 },
    { t: 1, g: [-0.2, 0.98, 0.3], a: [0.2, 0.75, 0.6], yaw: 0, step: 0 },
  ],
  // 1: horizontal, left to right (backhand)
  [
    { t: 0, g: [0.12, 1.15, 0.22], a: [0.85, 0.2, -0.3], e: [0, 0, -1], yaw: 0.55, lean: 0.05 },
    { t: 0.55, g: [-0.1, 1.08, 0.46], a: [-0.05, 0.08, 1], e: [-1, 0, 0], yaw: -0.05, lean: 0.12, step: 0.8, hit: true },
    { t: 0.8, g: [-0.38, 1.05, 0.22], a: [-0.9, 0.05, 0.25], e: [-0.2, 0, -1], yaw: -0.5, lean: 0.08, step: 0.5 },
    { t: 1, g: [-0.2, 0.98, 0.3], a: [0.2, 0.75, 0.6], yaw: 0, step: 0 },
  ],
  // 2: vertical, top to bottom
  [
    { t: 0, g: [-0.14, 1.52, 0.02], a: [0.05, 0.55, -0.85], e: [0, 1, 0], yaw: -0.15, lean: -0.15 },
    { t: 0.55, g: [-0.1, 1.08, 0.48], a: [0.02, 0.1, 1], e: [0, -1, 0], yaw: 0, lean: 0.25, step: 1, hit: true },
    { t: 0.8, g: [-0.12, 0.86, 0.42], a: [0.05, -0.7, 0.7], e: [0, -1, -0.5], yaw: 0, lean: 0.3, step: 0.9 },
    { t: 1, g: [-0.2, 0.98, 0.3], a: [0.2, 0.75, 0.6], yaw: 0, step: 0 },
  ],
  // 3: diagonal, from over the right shoulder down to the left hip
  [
    { t: 0, g: [-0.36, 1.45, 0.02], a: [-0.45, 0.65, -0.6], e: [-0.3, 0.3, 1], yaw: -0.5, lean: -0.05 },
    { t: 0.55, g: [-0.08, 1.12, 0.46], a: [0.35, 0.05, 0.95], e: [0.7, -0.7, 0], yaw: 0.1, lean: 0.18, step: 0.9, hit: true },
    { t: 0.8, g: [0.16, 0.86, 0.32], a: [0.6, -0.65, 0.45], e: [0.5, -0.6, -0.6], yaw: 0.4, lean: 0.22, step: 0.7 },
    { t: 1, g: [-0.2, 0.98, 0.3], a: [0.2, 0.75, 0.6], yaw: 0, step: 0 },
  ],
];

/** Greatsword (two hands): wider, heavier swings on the same four lines. */
const GREAT_SWINGS: Key[][] = SWORD_SWINGS.map((sw) =>
  sw.map((k) => ({ ...k, g: [k.g[0] * 0.75 + 0.03, k.g[1] + 0.02, k.g[2] * 0.95] as [number, number, number], yaw: (k.yaw ?? 0) * 1.25, lean: (k.lean ?? 0) * 1.2 })),
);

/** Grip of the stance, the guard, per family (combat), and on the move. */
export function stanceFrame(f: Family, walk: number, moving: number): Frame {
  const bob = Math.sin(walk * 2) * 0.012 * moving;
  switch (f) {
    case 'sword':
      return frame(V(-0.2, 0.98 + bob, 0.3), V(0.2, 0.75, 0.6), V(0.6, 0, 0.4));
    case 'great':
      return frame(V(-0.06, 0.95 + bob, 0.32), V(0.25, 0.8, 0.45), V(0.7, 0, 0.3));
    case 'bow':
      // level across the front of the belly, limbs left and right (owner's rule), arrow forward
      return frame(V(0.06, 1.0 + bob, 0.34), V(1, 0.05, 0), V(0, 0, 1));
    case 'staff':
      // both hands, diagonal across the body, the head up and forward
      return frame(V(-0.14, 1.02 + bob, 0.3), V(0.35, 0.82, 0.45), V(0, 0, 1));
    default:
      return frame(V(-0.3, 0.8 + bob, 0.18), V(0, 0.2, 1), V(0, -1, 0));
  }
}

/** Peace: the staff in hand as a walking stick (swinging with the step). */
export function staffPeaceFrame(walk: number, moving: number): Frame {
  const sw = Math.sin(walk) * 0.12 * moving;
  return frame(V(-0.36, 0.86, 0.1 + sw), V(0, 1, 0.12 + sw * 0.6), V(0, 0, 1));
}

/**
 * Where the weapon rests on the back, in the frame of the chest (spine bone: origin at its head
 * y = 0.86, axes of the body at rest). Swords and greatswords diagonally in a scabbard, the hilt
 * over the right shoulder; the bow across the back, from the right hip to the left shoulder.
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

/**
 * Melee swing `variant` (0 right→left, 1 left→right, 2 top→bottom, 3 diagonal) at progress u.
 * A combo is consecutive attacks taking the next variant; a skill swing chains two (`combo`).
 */
export function swingPose(f: 'sword' | 'great', variant: number, u: number, hitAt: number, combo = false): WeaponPose {
  const set = f === 'great' ? GREAT_SWINGS : SWORD_SWINGS;
  if (combo) {
    // two strikes in one action: the diagonal, then the backhand (the second on the hit moment)
    if (u < hitAt * 0.6) return { ...keyed(set[3], u / (hitAt * 0.6), 0.75), twoHands: f === 'great' };
    const v = keyed(set[1], (u - hitAt * 0.6) / (1 - hitAt * 0.6), (hitAt * 0.4) / (1 - hitAt * 0.6));
    return { ...v, twoHands: f === 'great' };
  }
  return { ...keyed(set[((variant % 4) + 4) % 4], u, hitAt), twoHands: f === 'great' };
}

/**
 * Bow shot at progress u (release at hitAt): raise the bow, take an arrow and nock it, draw the
 * string straight back to the chest, aim, release, lower the bow back into the stance.
 */
export function bowPose(u: number, hitAt: number, walk: number, moving: number): WeaponPose {
  const low = stanceFrame('bow', walk, moving);
  const high = frame(V(0.04, 1.27, 0.46), V(1, 0.04, 0), V(0, 0, 1));
  const r = Math.max(0.05, hitAt);
  const raise = ease(u / (r * 0.35));
  let draw = 0;
  let arrow = false;
  let onString = false;
  if (u < r) {
    arrow = u > r * 0.25;
    onString = u > r * 0.35;
    // the pull: from the string at rest to full draw, slowing as the bow bends; then held (aim)
    draw = onString ? ease((u - r * 0.35) / (r * 0.5)) : 0;
  } else {
    // released: the string snaps back at once, the arrow is gone
    draw = 0;
  }
  const lowerK = u > r ? ease((u - r - (1 - r) * 0.25) / ((1 - r) * 0.75)) : 0;
  const k = raise * (1 - lowerK);
  const f = mixFrame(low, high, k);
  return { frame: f, body: { yaw: 0.15 * k, lean: 0.02 * k, step: 0 }, draw, arrow, onString: u < r ? onString : u < r + 0.06, twoHands: false };
}

/** Bow held at full draw (aiming). */
export function bowAimPose(k: number, walk: number, moving: number): WeaponPose {
  const low = stanceFrame('bow', walk, moving);
  const high = frame(V(0.04, 1.27, 0.46), V(1, 0.04, 0), V(0, 0, 1));
  return { frame: mixFrame(low, high, ease(k * 1.6)), body: { yaw: 0.15 * k, lean: 0.02, step: 0 }, draw: ease((k - 0.35) / 0.65), arrow: k > 0.15, onString: k > 0.3, twoHands: false };
}

/**
 * Staff spell at progress u (release at hitAt): gather the magic (staff raised), point the staff
 * at the target, release (flash at the head), back to the stance. `power`: the strong spell —
 * raised high over the head, a lunge into the release, a bigger orb.
 */
export function staffPose(u: number, hitAt: number, walk: number, moving: number, power = false): WeaponPose {
  const st = stanceFrame('staff', walk, moving);
  const prep = power ? frame(V(-0.08, 1.48, 0.12), V(0.05, 1, -0.1), V(0, 0, 1)) : frame(V(-0.16, 1.3, 0.26), V(0.12, 1, 0.12), V(0, 0, 1));
  const point = frame(V(-0.08, 1.2, 0.52), V(0.05, 0.12, 1), V(0, 1, 0));
  const r = Math.max(0.05, hitAt);
  let f: Frame;
  let body: BodyMotion;
  if (u < r * 0.65) {
    const k = ease(u / (r * 0.65));
    f = mixFrame(st, prep, k);
    body = { yaw: -0.2 * k, lean: (power ? -0.1 : -0.03) * k, step: 0 };
  } else if (u < r) {
    const k = ease((u - r * 0.65) / (r * 0.35));
    f = mixFrame(prep, point, k);
    body = { yaw: -0.2 + 0.3 * k, lean: (power ? 0.25 : 0.12) * k, step: (power ? 1 : 0.5) * k };
  } else {
    const k = ease((u - r) / (1 - r));
    f = mixFrame(point, st, k);
    body = { yaw: 0.1 * (1 - k), lean: (power ? 0.25 : 0.12) * (1 - k), step: (power ? 1 : 0.5) * (1 - k) };
  }
  const orb = u < r ? ease(u / r) * (power ? 1 : 0.6) : 0;
  const flash = u >= r ? Math.max(0, 1 - (u - r) / 0.12) : 0;
  return { frame: f, body, orb, flash, twoHands: true };
}

/** Staff charged (held): raised, the orb grows with the charge. */
export function staffChargePose(k: number, walk: number, moving: number): WeaponPose {
  const st = stanceFrame('staff', walk, moving);
  const prep = frame(V(-0.08, 1.48, 0.12), V(0.05, 1, -0.1), V(0, 0, 1));
  return { frame: mixFrame(st, prep, ease(k * 2)), body: { yaw: -0.15 * k, lean: -0.08 * k, step: 0 }, orb: 0.3 + 0.7 * k, twoHands: true };
}

/** Sword block (held): the blade across in front of the face. */
export function blockPose(f: 'sword' | 'great', k: number, walk: number, moving: number): WeaponPose {
  const st = stanceFrame(f, walk, moving);
  const guard = frame(V(-0.16, 1.32, 0.36), V(0.95, 0.3, 0.05), V(0, 0.3, 1));
  return { frame: mixFrame(st, guard, ease(k)), body: { yaw: -0.1 * k, lean: 0.05 * k, step: 0.3 * k }, twoHands: f === 'great' || k > 0.5 };
}

// ---------------------------------------------------------------- locomotion

/** Leg angles for one frame of locomotion. */
export interface Legs {
  /** Thigh swing about the axis across the way of travel (rad) and its axis (body frame). */
  swingR: number;
  swingL: number;
  axis: THREE.Vector3;
  kneeR: number;
  kneeL: number;
  /** Pelvis bob (m) and the lean toward the way of travel. */
  bob: number;
  lean: THREE.Vector2;
}

/** Stride (m per step) at a speed: a walk takes shorter steps than a run. */
export function stride(speed: number): number {
  return 0.55 + Math.min(1, speed / 6) * 0.45;
}

/** Leg swing amplitude matching a stride (feet do not slide: the planted foot moves with the ground). */
export function swingAmp(speed: number): number {
  const legLen = 0.62;
  return Math.asin(Math.min(0.9, stride(speed) / 2 / legLen));
}

/**
 * Locomotion of the legs: `local` is the velocity in the body frame (x left, z forward, m/s),
 * `phase` the step phase (grows by π per stride walked). Walking forward, back, sideways and
 * diagonally all swing the legs along the actual way of travel.
 */
export function legs(local: THREE.Vector2, phase: number): Legs {
  const speed = local.length();
  const k = Math.min(1, speed / 1.2);
  const axis = new THREE.Vector3(1, 0, 0);
  if (speed > 0.05) axis.set(local.y, 0, -local.x).normalize();
  // sideways steps are shorter (the legs would cross)
  const side = speed > 0.05 ? Math.abs(local.x) / speed : 0;
  const amp = swingAmp(speed) * k * (1 - side * 0.4);
  const s = Math.sin(phase);
  const swingR = -amp * s;
  const swingL = amp * s;
  // the knee bends while its foot swings forward through the air
  const kneeR = Math.max(0, Math.cos(phase)) * amp * 1.4 + 0.05 * k;
  const kneeL = Math.max(0, -Math.cos(phase)) * amp * 1.4 + 0.05 * k;
  const bob = -Math.abs(Math.cos(phase)) * 0.025 * k;
  const lean = new THREE.Vector2(local.x, local.y).multiplyScalar(0.02 * Math.min(1, speed / 4));
  return { swingR, swingL, axis, kneeR, kneeL, bob, lean };
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

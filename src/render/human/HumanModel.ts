import * as THREE from 'three';
import { item, type Slot, type WeaponKind } from '../../rpg/items';
import { weaponType, type WeaponType } from '../../rpg/weapons';
import { PX } from './skinAtlas';
import { HUMAN_LOOK, armorParts, figurePart } from './figure';
import { treeMaterial } from '../TreeRenderer';
import { shieldModel, weaponModel, type WeaponModel } from './itemMeshes';

/** What the model shows this frame (filled from the simulation or by a preview). */
interface HumanPose {
  /** Walk cycle phase (radians-ish, grows with distance walked). */
  walk: number;
  /** 0 standing .. 1 walking at full speed. */
  moving: number;
  airborne: boolean;
  /** Vertical speed while airborne (+ up). */
  vy: number;
  /** Basic attack in progress: progress 0..1 and the hit moment (fraction). */
  attack: { t: number; hitAt: number } | null;
  time: number;
  /** Somersault of the double jump: progress 0..1 (0 = none). */
  flip?: number;
}

/**
 * A two-hand hold: the right hand's spot on the handle (`g`, body pixels), the weapon's direction
 * as elevation `el` above the forward horizontal and yaw `yaw` toward the model's left (radians).
 */
interface Hold {
  g: THREE.Vector3;
  el: number;
  yaw: number;
}

const ease = (x: number) => {
  const c = Math.max(0, Math.min(1, x));
  return c * c * (3 - 2 * c);
};
const DEG = Math.PI / 180;
const hold = (x: number, y: number, z: number, el: number, yaw: number): Hold => ({ g: new THREE.Vector3(x, y, z), el: el * DEG, yaw: yaw * DEG });
/** a + (b - a) * k for holds (into `out`). */
function mixHold(out: Hold, a: Hold, b: Hold, k: number): Hold {
  out.g.lerpVectors(a.g, b.g, k);
  out.el = a.el + (b.el - a.el) * k;
  out.yaw = a.yaw + (b.yaw - a.yaw) * k;
  return out;
}

/** Shoulder pivots (body pixels) and the reach from a shoulder to the middle of the fist. */
const SHOULDER_R = new THREE.Vector3(-6, 22, 0);
const SHOULDER_L = new THREE.Vector3(6, 22, 0);
const ARM_REACH = 9;
/** Height of the body's middle (blocks): the double-jump somersault turns around it. */
const FLIP_CENTER = 17 * PX;

/**
 * Two-hand holds per weapon (idle, run, and the attack's key poses). Pixels in the body frame:
 * +Z forward, +X the model's left, y up from the feet. The left hand finds its own spot on the
 * handle (WEAPON_TYPES leftHand range), so a hold only places the right hand and the direction.
 */
const HOLDS: Partial<Record<WeaponKind, Record<'idle' | 'run' | 'a' | 'b', Hold>>> = {
  // guard stance, blade up and forward; the attack raises it over the head (a) and chops (b)
  sword2h: { idle: hold(0.5, 16.5, 5.5, 58, -12), run: hold(0.5, 16, 6, 36, -24), a: hold(0.5, 26.5, 2.5, 140, -4), b: hold(0.5, 14, 8, -28, 0) },
  // shaft level at the hip, head forward; drawn back (a), then thrust (b)
  spear: { idle: hold(-1.5, 15, 4.5, 8, 6), run: hold(-1.5, 15.5, 4.5, 18, 8), a: hold(-2.5, 16, 1.5, 4, 4), b: hold(-0.5, 16.5, 8.5, 2, 0) },
  // staff upright in front; raised high (a), then swept forward to send the orb (b)
  staff2h: { idle: hold(-2.5, 14.5, 4.5, 78, 10), run: hold(-2, 15, 5, 55, 15), a: hold(-1, 24, 4, 95, 4), b: hold(0, 19, 8.5, 15, 0) },
};
const _hold = { g: new THREE.Vector3(), el: 0, yaw: 0 };
const _hold2 = { g: new THREE.Vector3(), el: 0, yaw: 0 };
const _d = new THREE.Vector3();
const _x = new THREE.Vector3();
const _z = new THREE.Vector3();

const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _v3 = new THREE.Vector3();
const _sL = new THREE.Vector3();
const _sR = new THREE.Vector3();
const _g = new THREE.Vector3();
const _h = new THREE.Vector3();
const _a = new THREE.Vector3();
const _n = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _m = new THREE.Matrix4();
const BOW_LEVEL_SCALE = 1.35;

type Part = 'head' | 'torso' | 'armR' | 'armL' | 'legR' | 'legL';

/**
 * The stylised human (owner: no longer Minecraft-like; see figure.ts): smooth low-poly parts on
 * the same joints as before (hips, neck, shoulders), one pixel = PX blocks, 32 px tall. Armour
 * pieces are shaped shells on the matching parts, the weapon sits in the right hand, a shield on
 * the left forearm. Faces +Z; feet at y = 0.
 */
export class HumanModel {
  readonly root = new THREE.Group();
  /** Turns the body (facing); the root stays the world position. */
  readonly body = new THREE.Group();
  /** Between root and body: turns the whole figure for the double-jump somersault. */
  private tumble = new THREE.Group();
  private parts = {} as Record<Part, THREE.Group>;
  private mat: THREE.MeshLambertMaterial;
  private geos: THREE.BufferGeometry[] = [];
  /** Armor meshes per slot (each piece has its own atlas). */
  private armor: Partial<Record<Slot, { meshes: THREE.Mesh[]; geos: THREE.BufferGeometry[] }>> = {};
  private equipIds: Partial<Record<Slot, string | null>> = {};
  private weapon: WeaponModel | null = null;
  private weaponKind: WeaponKind | null = null;
  private wtype: WeaponType | null = null;
  private shield: { root: THREE.Group; dispose(): void } | null = null;
  private holderR = new THREE.Group();
  private holderL = new THREE.Group();
  private shieldMount = new THREE.Group();
  private hair: THREE.Mesh;

  constructor(skinId = 'human', private shadows = true) {
    void skinId;
    const look = HUMAN_LOOK;
    this.mat = treeMaterial();
    this.root.add(this.tumble);
    this.tumble.add(this.body);
    const mk = (name: Part, pivot: [number, number, number]) => {
      const g = new THREE.Group();
      g.position.set(pivot[0] * PX, pivot[1] * PX, pivot[2] * PX);
      this.body.add(g);
      this.parts[name] = g;
      const geo = figurePart(name, look, PX);
      this.geos.push(geo);
      const m = new THREE.Mesh(geo, this.mat);
      m.castShadow = shadows;
      g.add(m);
      return g;
    };
    // pivots: legs at the hips, torso at the hips, head at the neck, arms at the shoulders
    mk('legR', [-2, 12, 0]);
    mk('legL', [2, 12, 0]);
    mk('torso', [0, 12, 0]);
    mk('head', [0, 24, 0]);
    mk('armR', [-6, 22, 0]);
    mk('armL', [6, 22, 0]);
    // hair rides on the head; a close helm or hood hides it (no strands through the metal)
    const hairGeo = figurePart('hair', look, PX);
    this.geos.push(hairGeo);
    this.hair = new THREE.Mesh(hairGeo, this.mat);
    this.hair.castShadow = shadows;
    this.parts.head.add(this.hair);
    // hands: the item holders sit at the bottom of the arms
    this.holderR.position.set(0, -9 * PX, 0);
    this.parts.armR.add(this.holderR);
    this.holderL.position.set(0, -9 * PX, 0);
    this.parts.armL.add(this.holderL);
    // the shield straps to the outside of the left forearm
    this.shieldMount.position.set(2.9 * PX, -6 * PX, 0);
    this.parts.armL.add(this.shieldMount);
  }

  // ---------------------------------------------------------------- equipment
  /** Shows the equipped items (call with the gear's equip map whenever it changes). */
  setEquip(equip: Record<Slot, string | null>) {
    for (const s of ['head', 'hands', 'feet', 'body'] as Slot[]) {
      if (this.equipIds[s] === equip[s]) continue;
      this.equipIds[s] = equip[s];
      this.clearArmor(s);
      const def = item(equip[s]);
      if (def?.armorSet) this.buildArmor(s, def.armorSet);
    }
    const helm = item(equip.head)?.armorSet;
    this.hair.visible = !helm || helm === 'apprentice';
    if (this.equipIds.main !== equip.main) {
      this.equipIds.main = equip.main;
      this.weapon?.dispose();
      if (this.weapon) this.weapon.root.removeFromParent();
      this.weapon = null;
      this.weaponKind = null;
      this.wtype = null;
      const w = item(equip.main)?.weapon;
      if (w) {
        this.weapon = weaponModel(w.kind);
        this.weaponKind = w.kind;
        this.wtype = weaponType(w.kind);
        this.mountWeapon();
      }
    }
    if (this.equipIds.off !== equip.off) {
      this.equipIds.off = equip.off;
      if (this.shield) {
        this.shield.root.removeFromParent();
        this.shield.dispose();
        this.shield = null;
      }
      if (equip.off) {
        this.shield = shieldModel();
        // flat against the forearm, face outward (+x), top toward the hand
        this.shield.root.rotation.set(0, Math.PI / 2, 0);
        this.shieldMount.add(this.shield.root);
      }
    }
    if (this.shadows) this.root.traverse((o) => ((o as THREE.Mesh).isMesh ? ((o as THREE.Mesh).castShadow = true) : null));
  }

  get weaponType(): WeaponKind | null {
    return this.weaponKind;
  }

  /** Lays the weapon into the hand(s): grip at the hand, business end forward/up. */
  private mountWeapon() {
    const w = this.weapon;
    if (!w) return;
    const k = this.weaponKind;
    const r = w.root;
    r.position.set(0, 0, 0);
    r.rotation.set(0, 0, 0);
    if (k === 'bow' || this.wtype?.grip === 'two') {
      // the bow (level across the front, limbs left and right) and two-hand weapons live in the
      // body frame: the pose places them every frame and closes the hands on their grips
      this.body.add(r);
      return;
    }
    if (k === 'crossbow') {
      r.rotation.set(Math.PI / 2, 0, 0);
      r.position.set(0.5 * PX, 0, 0);
      this.holderR.add(r);
      return;
    }
    // diagonal items: +Y of the item points forward out of the fist (arm hangs along -Y)
    r.rotation.set(Math.PI / 2, 0, 0);
    this.holderR.add(r);
  }

  private buildArmor(slot: Slot, set: string) {
    const geos: THREE.BufferGeometry[] = [];
    const meshes: THREE.Mesh[] = [];
    for (const { part, geo } of armorParts(slot, set, PX)) {
      geos.push(geo);
      const m = new THREE.Mesh(geo, this.mat);
      m.castShadow = this.shadows;
      this.parts[part === 'hair' ? 'head' : part].add(m);
      meshes.push(m);
    }
    this.armor[slot] = { meshes, geos };
  }

  private clearArmor(slot: Slot) {
    const a = this.armor[slot];
    if (!a) return;
    for (const m of a.meshes) m.removeFromParent();
    a.geos.forEach((g) => g.dispose());
    delete this.armor[slot];
  }

  // ---------------------------------------------------------------- animation
  /** Sets every joint for this frame (pure function of the pose: no hidden animation state). */
  pose(p: HumanPose) {
    const P = this.parts;
    for (const k of Object.keys(P) as Part[]) P[k].rotation.set(0, 0, 0);
    P.torso.position.set(0, 12 * PX, 0);
    this.body.position.set(0, 0, 0);
    this.body.rotation.set(0, 0, 0);
    const k = this.weaponKind;
    const grip = this.wtype?.grip ?? null;
    const sw = Math.sin(p.walk);
    const mv = p.moving;
    // walk: legs and arms swing in opposition
    const legSwing = sw * 0.75 * mv;
    P.legR.rotation.x = legSwing;
    P.legL.rotation.x = -legSwing;
    let armR = -sw * 0.6 * mv;
    let armL = sw * 0.6 * mv;
    // idle breathing: arms drift out a little
    const br = Math.sin(p.time * 1.6) * 0.03;
    P.armR.rotation.z = -0.04 - br;
    P.armL.rotation.z = 0.04 + br;
    // holding stance per weapon type (two-hand weapons are posed by holdTwoHanded below)
    if (grip === 'one') armR = this.oneHandStance(k, sw, mv, br);
    else if (k) armR = armR * 0.5 - 0.3;
    if (k === 'bow') armR = -sw * 0.4 * mv;
    if (k === 'crossbow') {
      armR = -1.1;
      armL = -1.1;
      P.armL.rotation.y = 0.5;
    }
    if (this.shield) armL = armL * 0.5 - 0.2;
    // jump: legs tuck a little, free arms lift outward
    if (p.airborne) {
      const up = Math.max(-1, Math.min(1, p.vy / 4));
      P.legR.rotation.x = -0.35 + up * 0.15;
      P.legL.rotation.x = 0.2 - up * 0.1;
      P.armR.rotation.z -= 0.35;
      P.armL.rotation.z += 0.35;
    }
    P.armR.rotation.x = armR;
    P.armL.rotation.x = armL;
    P.head.rotation.x = 0;
    if (this.weapon && k === 'crossbow') this.weapon.setState('loaded');
    if (this.weapon && k === 'bow' && !p.attack) {
      // carried level in front of the belly, limbs left and right, gripped by the left hand
      const bob = Math.abs(Math.cos(p.walk)) * 0.5 * mv;
      const g = _g.set(1, 15.5 + bob, 6.5);
      this.aimArm(P.armL, _sL.set(6, 22, 0), g, 1);
      this.placeBow(g, 0);
      this.weapon.setDraw(null, false, 0);
    }
    if (grip === 'two') this.twoHandPose(p, br);
    else if (p.attack) this.attackPose(p.attack.t, p.attack.hitAt);
    this.flipPose(p.flip ?? 0, grip === 'two');
  }

  /**
   * Idle and run stance of one-hand weapons: the sword in a low guard at rest and raised, blade
   * forward, on the run; the staff held upright like a walking staff at rest and slanted forward
   * on the run. Returns the right arm's swing; tilts the weapon in the hand.
   */
  private oneHandStance(k: WeaponKind | null, sw: number, mv: number, br: number): number {
    const r = this.weapon?.root;
    if (k === 'staff1h') {
      if (r) {
        r.rotation.set(0.15 + 0.75 * mv, 0, 0);
        r.position.set(0, 0, 2.4 * PX);
      }
      return -0.12 - br * 2 + (-0.18 - sw * 0.3) * mv;
    }
    // sword (and anything else held in one hand)
    if (r) {
      r.rotation.set(Math.PI / 2 + 0.42 - 0.6 * mv, 0, 0);
      r.position.set(0, 0, 0);
    }
    return -0.28 - br * 2 + (-0.24 - sw * 0.25) * mv;
  }

  /**
   * Two-hand weapons (two-handed sword, spear, staff): idle, run and attack are holds (HOLDS)
   * blended over time; holdTwoHanded then lays the weapon along the hold and closes both hands on
   * the handle, so the left hand never floats free of it.
   */
  private twoHandPose(p: HumanPose, br: number) {
    const k = this.weaponKind!;
    const H = HOLDS[k];
    if (!H) return;
    const P = this.parts;
    const mv = p.moving;
    // stance: idle blended into the run, with a bob of the step and a breath at rest
    const base = mixHold(_hold, H.idle, H.run, mv);
    base.g.y += Math.abs(Math.cos(p.walk)) * 0.7 * mv + br * 8 * (1 - mv);
    let h = base;
    const a = p.attack;
    if (a) {
      const t = a.t;
      const hitAt = a.hitAt;
      const wu = Math.min(1, t / Math.max(0.01, hitAt));
      const ft = t <= hitAt ? 0 : Math.min(1, (t - hitAt) / Math.max(0.01, 1 - hitAt));
      // wind up into pose a, strike into pose b right at the hit moment, hold, then recover
      const up = ease(wu / 0.7);
      const strike = ease((wu - 0.7) / 0.3);
      const rec = t <= hitAt ? 0 : ease((ft - 0.2) / 0.8);
      if (t <= hitAt) h = mixHold(_hold2, mixHold(_hold2, base, H.a, up), H.b, strike);
      else h = mixHold(_hold2, H.b, base, rec);
      const into = t <= hitAt ? strike : 1 - rec;
      const back = t <= hitAt ? up * (1 - strike) : 0;
      if (k === 'sword2h') {
        this.body.rotation.x = -back * 0.08 + into * 0.18;
        P.legR.rotation.x += -into * 0.3;
        P.legL.rotation.x += into * 0.3;
      } else if (k === 'spear') {
        // the whole body steps into the thrust
        this.body.position.z = (into * 3 - back * 1.5) * PX;
        this.body.rotation.y = back * 0.2;
        P.legR.rotation.x += -into * 0.35;
        P.legL.rotation.x += into * 0.25;
      } else {
        this.body.rotation.x = -back * 0.06 + into * 0.12;
        P.head.rotation.x = -back * 0.15;
      }
    }
    this.holdTwoHanded(h);
  }

  /**
   * Lays a two-hand weapon along hold `h` and puts both hands on it: the right hand reaches as
   * far as it can toward the hold point and grips there; the left hand slides along the handle
   * (within the weapon type's range, as close to its preferred spot as the arm allows).
   */
  private holdTwoHanded(h: Hold) {
    const P = this.parts;
    const r = this.weapon?.root;
    const lh = this.wtype?.leftHand;
    if (!r || !lh) return;
    const dir = _d.set(Math.cos(h.el) * Math.sin(h.yaw), Math.sin(h.el), Math.cos(h.el) * Math.cos(h.yaw));
    const hr = _h.subVectors(h.g, SHOULDER_R).setLength(ARM_REACH).add(SHOULDER_R);
    // points of the handle line an arm's length from the left shoulder: |hr + dir s - S| = reach
    const rel = _v1.subVectors(hr, SHOULDER_L);
    const b = dir.dot(rel);
    const disc = b * b - (rel.lengthSq() - ARM_REACH * ARM_REACH);
    let s = Math.max(lh.min, Math.min(lh.max, -b));
    if (disc >= 0) {
      const q = Math.sqrt(disc);
      let best = Infinity;
      for (const c of [-b - q, -b + q]) {
        const cc = Math.max(lh.min, Math.min(lh.max, c));
        // in range first, then nearest the preferred spot
        const cost = Math.abs(cc - c) * 10 + Math.abs(cc - lh.pref);
        if (cost < best) {
          best = cost;
          s = cc;
        }
      }
    }
    const hl = _n.copy(hr).addScaledVector(dir, s);
    this.aimArm(P.armR, SHOULDER_R, hr, 1);
    this.aimArm(P.armL, SHOULDER_L, hl, 1);
    // the weapon: grip in the right hand, along `dir`, the flat of the blade to the sides
    const x = _x.set(1, 0, 0).addScaledVector(dir, -dir.x);
    if (x.lengthSq() < 1e-4) x.set(0, 0, 1).addScaledVector(dir, -dir.z);
    x.normalize();
    const z = _z.crossVectors(x, dir);
    r.quaternion.setFromRotationMatrix(_m.makeBasis(x, dir, z));
    r.position.copy(hr).multiplyScalar(PX);
    r.scale.setScalar(1);
  }

  /**
   * Double jump: one smooth forward somersault around the middle of the body, knees tucked to
   * the chest (and free arms hugging them) at its height. `t` 0..1, 0 = none.
   */
  private flipPose(t: number, twoHands: boolean) {
    const tb = this.tumble;
    if (t <= 0 || t >= 1) {
      tb.rotation.set(0, 0, 0);
      tb.position.set(0, 0, 0);
      return;
    }
    const a = ease(t) * Math.PI * 2;
    tb.rotation.set(a, 0, 0);
    tb.position.set(0, FLIP_CENTER * (1 - Math.cos(a)), -FLIP_CENTER * Math.sin(a));
    const tuck = Math.sin(Math.PI * t);
    const P = this.parts;
    P.legR.rotation.x = P.legR.rotation.x * (1 - tuck) - 1.25 * tuck;
    P.legL.rotation.x = P.legL.rotation.x * (1 - tuck) - 1.1 * tuck;
    P.head.rotation.x += 0.35 * tuck;
    if (!twoHands && this.weaponKind !== 'bow') {
      P.armR.rotation.x = P.armR.rotation.x * (1 - tuck) - 0.9 * tuck;
      P.armL.rotation.x = P.armL.rotation.x * (1 - tuck) - 0.9 * tuck;
      P.armR.rotation.z *= 1 - tuck;
      P.armL.rotation.z *= 1 - tuck;
    }
  }

  /**
   * Points an arm (pivot at the shoulder `from`, body space, pixels) at `to`, blended from its
   * current rotation by `w`. The hand's +Z (the bow's up) is kept toward world up.
   */
  private aimArm(arm: THREE.Group, from: THREE.Vector3, to: THREE.Vector3, w: number) {
    const y = _v1.subVectors(from, to).normalize(); // the arm hangs along its local -Y
    const z = _v2.set(0, 1, 0).addScaledVector(y, -y.y).normalize();
    const x = _v3.crossVectors(y, z);
    _q.setFromRotationMatrix(_m.makeBasis(x, y, z));
    arm.quaternion.slerp(_q, w);
  }

  /** Lays the bow level (limbs along body ±X, arrow forward +Z) with its grip at `grip` (pixels). */
  private placeBow(grip: THREE.Vector3, tilt: number) {
    const r = this.weapon!.root;
    r.position.copy(grip).multiplyScalar(PX);
    // bow up (+Y) → body -X, forward stays +Z; `tilt` lifts the front a little
    r.rotation.set(-tilt, 0, Math.PI / 2, 'XYZ');
    // held level it is drawn a size up so the limbs reach well past the shoulders
    r.scale.setScalar(BOW_LEVEL_SCALE);
  }

  /**
   * The bow shot, held like a crossbow of the old sagas: square to the target, the bow level
   * across the front of the chest (limbs out like wings), the left hand on the grip, the right
   * hand drawing the string straight back to the sternum; release at the hit moment, recover.
   * Body frame = facing frame (+Z toward the target), pixels.
   */
  private bowPose(t: number, hitAt: number) {
    const P = this.parts;
    const ease = (x: number) => { const c = Math.max(0, Math.min(1, x)); return c * c * (3 - 2 * c); };
    const wu = Math.min(1, t / Math.max(0.01, hitAt));
    const ft = t <= hitAt ? 0 : Math.min(1, (t - hitAt) / Math.max(0.01, 1 - hitAt));
    const drawing = t <= hitAt;
    // raise during the first quarter, hold, lower after the release
    const s = drawing ? ease(wu / 0.25) : 1 - ease((ft - 0.3) / 0.7);
    const draw = drawing ? ease((wu - 0.25) / 0.75) : 0;
    const flick = drawing ? 0 : ease(ft / 0.25);
    P.legL.rotation.x += -0.12 * s;
    P.legR.rotation.x += 0.1 * s;
    P.head.rotation.x = 0.08 * s;
    // the grip: from the carry (belly) up to shoulder height, an arm's length ahead
    const grip = _g.set(1, 15.5, 6.5).lerp(_a.set(1, 20, 9.5), s);
    this.aimArm(P.armL, _sL.set(6, 22, 0), grip, 1);
    this.placeBow(grip, 0);
    const r = this.weapon?.root;
    if (!r) return;
    // the nock in the bow's space: on the arrow line, pulled straight back by `draw`
    this.root.updateMatrixWorld(true);
    const nocked = drawing && wu > 0.12;
    const back = 4.8 + 2.7 * draw; // pixels behind the grip (string at rest ≈ 4.7)
    const nockBody = _n.set(grip.x - 0.5, grip.y + 0.9, grip.z - back);
    // the right hand pinches the nock (after the release it flicks back and out)
    const hand = _h.copy(nockBody);
    if (!drawing) hand.set(grip.x - 2 - 3 * flick, grip.y + 0.5, grip.z - 4.6 - 2.5 * flick);
    const wR = drawing ? Math.min(1, wu / 0.15) : s;
    this.aimArm(P.armR, _sR.set(-6, 22, 0), hand, wR);
    const nock = this.body.localToWorld(nockBody.multiplyScalar(PX));
    r.worldToLocal(nock);
    this.weapon!.setDraw(nocked ? nock : null, nocked, draw);
  }

  /** Basic attack motion of the held weapon (t = progress 0..1 of one attack). */
  private attackPose(t: number, hitAt: number) {
    const P = this.parts;
    const k = this.weaponKind;
    // windup 0..1 until the hit, follow-through 0..1 after it
    const wu = Math.min(1, t / Math.max(0.01, hitAt));
    const ft = t <= hitAt ? 0 : Math.min(1, (t - hitAt) / Math.max(0.01, 1 - hitAt));
    const ease = (x: number) => x * x * (3 - 2 * x);
    const strike = t <= hitAt ? ease(wu) : 1 - ease(ft);
    const r = this.weapon?.root;
    switch (k) {
      case null:
      case 'sword1h': {
        // the blade comes level out of the stance for the cut and goes back after it
        if (r) r.rotation.x = Math.PI / 2 + (r.rotation.x - Math.PI / 2) * (t <= hitAt ? 1 - Math.min(1, wu * 3) : ft);
        // raise up and back, then a fast diagonal cut down across the body
        const up = t <= hitAt ? ease(wu) : 0;
        const down = t <= hitAt ? 0 : 1 - ease(ft);
        P.armR.rotation.x = -0.3 - up * 2.1 - down * 0.9 + (t > hitAt ? 0 : 0);
        P.armR.rotation.z = -0.04 - up * 0.5 + down * 0.35;
        P.armR.rotation.y = down * 0.5;
        this.body.rotation.y = -up * 0.25 + down * 0.3;
        if (t > hitAt && ft < 0.25) P.armR.rotation.x = -1.4 + ft * 2;
        break;
      }
      case 'staff1h': {
        // point the staff forward and release the spark
        if (r) {
          r.rotation.x += (Math.PI / 2 - r.rotation.x) * strike;
          r.position.z *= 1 - strike;
        }
        P.armR.rotation.x = -0.3 - strike * 1.15;
        P.armR.rotation.z = -0.04 + strike * 0.12;
        this.body.rotation.y = -strike * 0.1;
        break;
      }
      case 'bow':
        this.bowPose(t, hitAt);
        break;
      case 'crossbow': {
        // a quick aim and shot, then a long reload: the crossbow tips down and the string is spanned
        const reload = t > hitAt ? ft : 0;
        const tip = Math.sin(Math.min(1, reload) * Math.PI);
        P.armR.rotation.x = -Math.PI / 2 + tip * 0.9 + (t <= hitAt ? 0 : 0);
        P.armL.rotation.x = -Math.PI / 2 + tip * 1.2;
        P.armL.rotation.y = 0.55 - tip * 0.2;
        if (t > hitAt && ft < 0.08) this.body.rotation.x = -0.06;
        if (this.weapon) this.weapon.setState(t <= hitAt || reload > 0.8 ? 'loaded' : 'empty');
        break;
      }
    }
  }

  dispose() {
    for (const s of Object.keys(this.armor) as Slot[]) this.clearArmor(s);
    this.weapon?.dispose();
    this.shield?.dispose();
    this.geos.forEach((g) => g.dispose());
    this.mat.dispose();
  }
}

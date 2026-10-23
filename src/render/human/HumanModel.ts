import * as THREE from 'three';
import { item, type Slot, type WeaponKind } from '../../rpg/items';
import { weaponType, type WeaponType } from '../../rpg/weapons';
import { PX, SkinAtlas, type Paint } from './skinAtlas';
import { SKINS, armorPaints, type BodySkin } from './skins';
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

const ease = (x: number) => {
  const c = Math.max(0, Math.min(1, x));
  return c * c * (3 - 2 * c);
};

/** Height of the body's middle (blocks): the double-jump somersault turns around it. */
const FLIP_CENTER = 17 * PX;

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
 * The cubic (Minecraft-style) human: head 8×8×8, torso 8×12×4, arms and legs 4×12×4 pixels,
 * one pixel = PX blocks. Built from textured boxes only (no rounding, no voxel detail). Armor
 * pieces are slightly inflated boxes on the matching parts, the weapon sits in the right hand,
 * a shield on the left forearm. Faces +Z; feet at y = 0.
 */
export class HumanModel {
  readonly root = new THREE.Group();
  /** Turns the body (facing); the root stays the world position. */
  readonly body = new THREE.Group();
  /** Between root and body: turns the whole figure for the double-jump somersault. */
  private tumble = new THREE.Group();
  private parts = {} as Record<Part, THREE.Group>;
  private atlas: SkinAtlas;
  private mat: THREE.MeshLambertMaterial;
  private geos: THREE.BufferGeometry[] = [];
  /** Armor meshes per slot (each piece has its own atlas). */
  private armor: Partial<Record<Slot, { meshes: THREE.Mesh[]; atlas: SkinAtlas; mat: THREE.Material; geos: THREE.BufferGeometry[] }>> = {};
  private equipIds: Partial<Record<Slot, string | null>> = {};
  private weapon: WeaponModel | null = null;
  private weaponKind: WeaponKind | null = null;
  private wtype: WeaponType | null = null;
  private shield: { root: THREE.Group; dispose(): void } | null = null;
  private holderR = new THREE.Group();
  private holderL = new THREE.Group();
  private shieldMount = new THREE.Group();

  constructor(skinId = 'human', private shadows = true) {
    const skin: BodySkin = SKINS[skinId] ?? SKINS.human;
    this.atlas = new SkinAtlas(128);
    this.mat = this.atlas.material();
    this.root.add(this.tumble);
    this.tumble.add(this.body);
    const mk = (name: Part, pivot: [number, number, number]) => {
      const g = new THREE.Group();
      g.position.set(pivot[0] * PX, pivot[1] * PX, pivot[2] * PX);
      this.body.add(g);
      this.parts[name] = g;
      return g;
    };
    const box = (parent: THREE.Group, w: number, h: number, d: number, paint: Paint, at: [number, number, number]) => {
      const geo = this.atlas.box(w, h, d, paint);
      this.geos.push(geo);
      const m = new THREE.Mesh(geo, this.mat);
      m.position.set(at[0] * PX, at[1] * PX, at[2] * PX);
      m.castShadow = shadows;
      parent.add(m);
      return m;
    };
    // pivots: legs at the hips, torso at the hips, head at the neck, arms at the shoulders
    box(mk('legR', [-2, 12, 0]), 4, 12, 4, skin.legR, [0, -6, 0]);
    box(mk('legL', [2, 12, 0]), 4, 12, 4, skin.legL, [0, -6, 0]);
    box(mk('torso', [0, 12, 0]), 8, 12, 4, skin.torso, [0, 6, 0]);
    box(mk('head', [0, 24, 0]), 8, 8, 8, skin.head, [0, 4, 0]);
    box(mk('armR', [-6, 22, 0]), 4, 12, 4, skin.armR, [0, -4, 0]);
    box(mk('armL', [6, 22, 0]), 4, 12, 4, skin.armL, [0, -4, 0]);
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
    if (k === 'bow') {
      // the bow (level across the front, limbs left and right) lives in the body frame: the
      // pose places it every frame
      this.body.add(r);
      return;
    }
    // diagonal items: +Y of the item points forward out of the fist (arm hangs along -Y)
    r.rotation.set(Math.PI / 2, 0, 0);
    this.holderR.add(r);
  }

  private buildArmor(slot: Slot, set: string) {
    const P = armorPaints(set);
    const atlas = new SkinAtlas(64);
    const mat = atlas.material();
    const geos: THREE.BufferGeometry[] = [];
    const meshes: THREE.Mesh[] = [];
    const add = (part: Part, w: number, h: number, d: number, paint: Paint, inflate: number, at: [number, number, number]) => {
      const geo = atlas.box(w, h, d, paint, inflate);
      geos.push(geo);
      const m = new THREE.Mesh(geo, mat);
      m.position.set(at[0] * PX, at[1] * PX, at[2] * PX);
      m.castShadow = this.shadows;
      this.parts[part].add(m);
      meshes.push(m);
    };
    const heavy = set === 'guard';
    if (slot === 'head') add('head', 8, 8, 8, P.helmet, heavy ? 0.85 : 0.65, [0, 4, 0]);
    if (slot === 'body') {
      add('torso', 8, 10, 4, P.torso, heavy ? 0.7 : 0.55, [0, 7, 0]);
      // shoulders: the upper part of each arm (above the gloves)
      add('armR', 4, 6, 4, P.shoulder, heavy ? 0.75 : 0.6, [0, -1, 0]);
      add('armL', 4, 6, 4, P.shoulder, heavy ? 0.75 : 0.6, [0, -1, 0]);
    }
    if (slot === 'hands') {
      add('armR', 4, 5, 4, P.glove, 0.4, [0, -7.5, 0]);
      add('armL', 4, 5, 4, P.glove, 0.4, [0, -7.5, 0]);
    }
    if (slot === 'feet') {
      add('legR', 4, 5, 4, P.boot, 0.4, [0, -9.5, 0]);
      add('legL', 4, 5, 4, P.boot, 0.4, [0, -9.5, 0]);
    }
    this.armor[slot] = { meshes, atlas, mat, geos };
  }

  private clearArmor(slot: Slot) {
    const a = this.armor[slot];
    if (!a) return;
    for (const m of a.meshes) m.removeFromParent();
    a.geos.forEach((g) => g.dispose());
    a.mat.dispose();
    a.atlas.dispose();
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
    // walk: legs and arms swing in opposition (Minecraft gait)
    const legSwing = sw * 0.75 * mv;
    P.legR.rotation.x = legSwing;
    P.legL.rotation.x = -legSwing;
    let armR = -sw * 0.6 * mv;
    let armL = sw * 0.6 * mv;
    // idle breathing: arms drift out a little
    const br = Math.sin(p.time * 1.6) * 0.03;
    P.armR.rotation.z = -0.04 - br;
    P.armL.rotation.z = 0.04 + br;
    // holding stance per weapon type
    if (grip === 'one') armR = this.oneHandStance(k, sw, mv, br);
    if (k === 'bow') armR = -sw * 0.4 * mv;
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
    if (this.weapon && k === 'bow' && !p.attack) {
      // carried level in front of the belly, limbs left and right, gripped by the left hand
      const bob = Math.abs(Math.cos(p.walk)) * 0.5 * mv;
      const g = _g.set(1, 15.5 + bob, 6.5);
      this.aimArm(P.armL, _sL.set(6, 22, 0), g, 1);
      this.placeBow(g, 0);
      this.weapon.setDraw(null, false, 0);
    }
    if (p.attack) this.attackPose(p.attack.t, p.attack.hitAt);
    this.flipPose(p.flip ?? 0);
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
   * Double jump: one smooth forward somersault around the middle of the body, knees tucked to
   * the chest (and free arms hugging them) at its height. `t` 0..1, 0 = none.
   */
  private flipPose(t: number) {
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
    if (this.weaponKind !== 'bow') {
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
    }
  }

  dispose() {
    for (const s of Object.keys(this.armor) as Slot[]) this.clearArmor(s);
    this.weapon?.dispose();
    this.shield?.dispose();
    this.geos.forEach((g) => g.dispose());
    this.mat.dispose();
    this.atlas.dispose();
  }
}

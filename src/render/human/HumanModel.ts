import * as THREE from 'three';
import { item, type Slot, type WeaponKind } from '../../rpg/items';
import { BONES, BONE_INDEX, PARTS, PART_INDEX, boneHead, boneTail, characterGeometry, characterTexture } from './charAsset';
import { ARMOR, armorMeshes, type ArmorSetId, type ArmorSlot } from './armorModels';
import {
  CombatState,
  ComboCounter,
  GRAB_AT,
  backFrame,
  basisQuat,
  blockPose,
  bowAimPose,
  bowPose,
  frame,
  legs,
  mixFrame,
  staffChargePose,
  staffPeaceFrame,
  staffPose,
  stanceFrame,
  stride,
  swingPose,
  type Family,
  type Frame,
  type WeaponPose,
} from './anim';
import { ITEM_VOX, arrowGeometry, voxWeapon, type VoxWeapon } from './weaponModels';
import { weaponModel, type WeaponModel } from './itemMeshes';

/** What the model shows this frame (filled from the simulation or by a preview). */
export interface HumanPose {
  /** Walk cycle phase of the old model (unused by the legs now: they follow the distance walked). */
  walk: number;
  /** 0 standing .. 1 walking at full speed. */
  moving: number;
  airborne: boolean;
  /** Vertical speed while airborne (+ up). */
  vy: number;
  /** Basic attack in progress: progress 0..1, the hit moment (fraction), its id and kind. */
  attack: { t: number; hitAt: number; seq?: number; kind?: 'normal' | 'skill' | 'spell' } | null;
  time: number;
  /** Somersault of the double jump: progress 0..1 (0 = none). */
  flip?: number;
  /** A held action: sword block, bow aim, staff charge; `k` 0..1 builds the pose up. */
  hold?: { kind: 'block' | 'aim' | 'charge'; k: number } | null;
  /**
   * Velocity in the body's own frame (m/s; x to the model's left, z forward). The legs step along
   * it whatever way the body faces: forward, back, sideways, diagonally.
   */
  move?: { x: number; z: number };
  /** The fight wants the weapon ready (drawn); without it the weapon is put away after a while. */
  combat?: boolean;
}

/** Variant of the base character (NPCs): colours of its parts, a body build, extra pieces. */
export interface CharacterLook {
  /** Multipliers per body part group (linear colour; > 1 brightens). */
  tint?: Partial<Record<'shirt' | 'trousers' | 'boots' | 'hair' | 'skin' | 'belt', [number, number, number]>>;
  /** Overall scale (height) and width of the build. */
  height?: number;
  width?: number;
  /** Armour pieces worn as clothes (set and slots). */
  wear?: { set: ArmorSetId; slots: ArmorSlot[] }[];
}

const GROUPS: Record<string, string[]> = {
  shirt: ['Torso_Shirt', 'Collar_L', 'Collar_R', 'Collar_Step_L', 'Collar_Step_R', 'Shoulder_Shirt_L', 'Shoulder_Shirt_R', 'Upper_Shirt_Back', 'Sleeve_L', 'Sleeve_R', 'Rolled_Cuff_L', 'Rolled_Cuff_R'],
  trousers: ['Pants_Leg_L', 'Pants_Leg_R', 'Waist'],
  boots: ['Boot_Cuff_L', 'Boot_Cuff_R', 'Boot_Foot_L', 'Boot_Foot_R', 'Boot_Shaft_L', 'Boot_Shaft_R'],
  hair: ['Hair_VoxelShell'],
  belt: ['Belt', 'Lace_Upper', 'Lace_Lower'],
  skin: ['Head', 'Neck', 'Neckline', 'Ear_L', 'Ear_R', 'Forearm_L', 'Forearm_R', 'Palm_L', 'Palm_R', 'Thumb_L', 'Thumb_R', 'Finger_1_L', 'Finger_1_R', 'Finger_2_L', 'Finger_2_R', 'Finger_3_L', 'Finger_3_R', 'Finger_4_L', 'Finger_4_R'],
};

/** Family of a weapon by its equipped id. */
function familyOf(id: string | null): { family: Family | null; kind: WeaponKind | null; vox: VoxWeapon | null } {
  if (!id) return { family: null, kind: null, vox: null };
  const v = /^vox(2h)?:(.+)$/.exec(id);
  const mapped = v ? { id: v[2], great: !!v[1] } : ITEM_VOX[id];
  const kind = item(id)?.weapon?.kind ?? null;
  if (mapped) {
    const vox = voxWeapon(mapped.id, mapped.great);
    if (vox) {
      const family: Family = vox.kind === 'sword' ? (mapped.great ? 'great' : 'sword') : vox.kind;
      return { family, kind, vox };
    }
  }
  if (!kind) return { family: null, kind: null, vox: null };
  const family: Family = kind === 'sword1h' ? 'sword' : kind === 'sword2h' ? 'great' : kind === 'bow' ? 'bow' : kind === 'staff1h' || kind === 'staff2h' ? 'staff' : 'other';
  return { family, kind, vox: null };
}

const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _v3 = new THREE.Vector3();
const _q1 = new THREE.Quaternion();
const _q2 = new THREE.Quaternion();
const _m1 = new THREE.Matrix4();
const _x = new THREE.Vector3(1, 0, 0);
const _y = new THREE.Vector3(0, 1, 0);
const _z = new THREE.Vector3(0, 0, 1);
const ease = (x: number) => {
  const c = Math.max(0, Math.min(1, x));
  return c * c * (3 - 2 * c);
};

/** Point in the hand's own frame where the handle passes through the closed fist. */
const GRIP_IN_HAND = (side: 1 | -1) => new THREE.Vector3(side * 0.012, -0.062, 0);
/** Height of the body's middle: the double-jump somersault turns around it. */
const FLIP_CENTER = 0.95;

/**
 * The character (owner's model, Character.blend): a skinned mesh on a 27-bone skeleton. Every
 * frame the pose is computed procedurally (src/render/human/anim.ts): the legs walk along the
 * real way of travel (eight directions relative to the facing), the upper body follows the weapon
 * — the stance, the swings, the shot, the spell — and the arms reach the weapon's grips by
 * two-bone IK, so the weapon is always in the hands (never floating or through the palm). The
 * weapon is drawn from the back and put away there with the hand carrying it; the staff stays in
 * the hand. Faces +z, feet at y = 0.
 */
export class HumanModel {
  readonly root = new THREE.Group();
  /** Turns the body (facing); the root stays the world position. */
  readonly body = new THREE.Group();
  /** Between root and body: turns the whole figure for the double-jump somersault. */
  private tumble = new THREE.Group();
  private mesh: THREE.SkinnedMesh;
  private geo: THREE.BufferGeometry;
  private bones: THREE.Bone[] = [];
  private b = {} as Record<string, THREE.Bone>;
  private matShow: THREE.MeshLambertMaterial;
  private matHide: THREE.Material;
  private hidden = new Set<string>();
  private hideKey: string | null = null;
  /** Armour meshes per slot (riding on bones). */
  private armor: Partial<Record<Slot, THREE.Mesh[]>> = {};
  private worn: THREE.Mesh[] = [];
  private equipIds: Partial<Record<Slot, string | null>> = {};
  private family: Family | null = null;
  private weaponKind: WeaponKind | null = null;
  /** The weapon: its grip frame object (in the body frame) and the visible model inside. */
  private weaponRoot = new THREE.Group();
  private weaponObj: THREE.Object3D | null = null;
  private vox: VoxWeapon | null = null;
  private oldWeapon: WeaponModel | null = null;
  private weaponMat = new THREE.MeshLambertMaterial({ vertexColors: true });
  /** Scabbard (swords) and quiver (bow) on the back. */
  private backGear = new THREE.Group();
  private string: THREE.Mesh[] = [];
  private arrow: THREE.Mesh;
  private orb: THREE.Mesh;
  private orbMat = new THREE.MeshBasicMaterial({ color: 0x8ad8ff, transparent: true, opacity: 0.85, depthWrite: false });
  readonly combat = new CombatState();
  private combo = new ComboCounter();
  private phase = 0;
  private lastTime = -1;
  /** Smoothed weapon frame and body motion (blending between poses). */
  private wf: Frame = frame(new THREE.Vector3(-0.3, 0.8, 0.1), new THREE.Vector3(0, 1, 0));
  private wfInit = false;
  private bodyM = { yaw: 0, lean: 0, step: 0 };
  private restU: Record<'L' | 'R', THREE.Vector3>;
  private restF: Record<'L' | 'R', THREE.Vector3>;
  private len: Record<'U' | 'F', number>;
  private look: CharacterLook;

  constructor(_skinId = 'human', private shadows = true, look: CharacterLook = {}) {
    this.look = look;
    this.root.add(this.tumble);
    this.tumble.add(this.body);
    // ---------------------------------------------------------------- skeleton
    for (const bd of BONES) {
      const bone = new THREE.Bone();
      bone.name = bd.name;
      const h = new THREE.Vector3(...bd.head);
      if (bd.parent) {
        const p = new THREE.Vector3(...BONES[BONE_INDEX[bd.parent]].head);
        bone.position.copy(h.sub(p));
        this.b[bd.parent].add(bone);
      } else bone.position.copy(h);
      this.bones.push(bone);
      this.b[bd.name] = bone;
    }
    this.geo = characterGeometry().clone();
    this.applyLook();
    this.matShow = new THREE.MeshLambertMaterial({ map: characterTexture(), vertexColors: true });
    this.matHide = new THREE.MeshBasicMaterial({ visible: false });
    this.mesh = new THREE.SkinnedMesh(this.geo, [this.matShow, this.matHide]);
    this.mesh.add(this.bones[0]);
    this.mesh.updateMatrixWorld(true);
    this.mesh.bind(new THREE.Skeleton(this.bones));
    this.mesh.castShadow = shadows;
    this.mesh.frustumCulled = false;
    this.body.add(this.mesh);
    this.regroup();
    const s = look.height ?? 1;
    this.body.scale.set(s * (look.width ?? 1), s, s * (look.width ?? 1));
    // arm data for the IK
    const dir = (a: string, b: string) => boneHead(b).sub(boneHead(a)).normalize();
    this.restU = { L: dir('upper_arm.L', 'forearm.L'), R: dir('upper_arm.R', 'forearm.R') };
    this.restF = { L: dir('forearm.L', 'hand.L'), R: dir('forearm.R', 'hand.R') };
    this.len = { U: boneHead('upper_arm.L').distanceTo(boneHead('forearm.L')), F: boneHead('forearm.L').distanceTo(boneHead('hand.L')) };
    // ---------------------------------------------------------------- weapon pieces
    this.body.add(this.weaponRoot);
    this.b.spine.add(this.backGear);
    this.arrow = new THREE.Mesh(arrowGeometry(), this.weaponMat);
    this.arrow.visible = false;
    this.body.add(this.arrow);
    const sg = new THREE.BoxGeometry(0.012, 1, 0.012);
    sg.translate(0, 0.5, 0);
    for (let i = 0; i < 2; i++) {
      const m = new THREE.Mesh(sg, new THREE.MeshBasicMaterial({ color: 0xe8e0c8 }));
      m.visible = false;
      this.string.push(m);
      this.body.add(m);
    }
    this.orb = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.16), this.orbMat);
    this.orb.visible = false;
    this.body.add(this.orb);
    for (const w of look.wear ?? []) for (const slot of w.slots) this.wear(w.set, slot);
  }

  // ---------------------------------------------------------------- looks
  /** Per-vertex colour of every part from the look's tints (NPC variants). */
  private applyLook() {
    const part = this.geo.getAttribute('aPart') as THREE.BufferAttribute;
    const col = new Float32Array(part.count * 3).fill(1);
    const tint = this.look.tint ?? {};
    for (const [g, names] of Object.entries(GROUPS)) {
      const t = (tint as Record<string, [number, number, number]>)[g];
      if (!t) continue;
      const ids = new Set(names.map((n) => PART_INDEX[n]));
      for (let i = 0; i < part.count; i++)
        if (ids.has(part.getX(i))) {
          col[i * 3] = t[0];
          col[i * 3 + 1] = t[1];
          col[i * 3 + 2] = t[2];
        }
    }
    this.geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  }

  /** Draw groups: runs of visible parts share one draw, hidden parts are skipped. */
  private regroup() {
    const key = [...this.hidden].sort().join(',');
    if (key === this.hideKey && this.geo.groups.length) return;
    this.hideKey = key;
    const base = characterGeometry().groups;
    this.geo.clearGroups();
    let start = -1;
    let count = 0;
    let cur = -1;
    base.forEach((g, i) => {
      const m = this.hidden.has(PARTS[i].name) ? 1 : 0;
      if (m === cur && start + count === g.start) count += g.count;
      else {
        if (cur >= 0) this.geo.addGroup(start, count, cur);
        start = g.start;
        count = g.count;
        cur = m;
      }
    });
    if (cur >= 0) this.geo.addGroup(start, count, cur);
  }

  /** Puts on an armour piece (the body parts under it are hidden). */
  private wear(set: ArmorSetId, slot: ArmorSlot): THREE.Mesh[] {
    const out: THREE.Mesh[] = [];
    for (const { bone, mesh } of armorMeshes(set, slot, this.shadows)) {
      this.b[bone].add(mesh);
      out.push(mesh);
    }
    for (const h of ARMOR[set][slot].hides) this.hidden.add(h);
    this.regroup();
    this.worn.push(...out);
    return out;
  }

  private updateHidden() {
    this.hidden.clear();
    for (const w of this.look.wear ?? []) for (const s of w.slots) for (const h of ARMOR[w.set][s].hides) this.hidden.add(h);
    for (const s of ['head', 'hands', 'feet', 'body'] as Slot[]) {
      const set = item(this.equipIds[s])?.armorSet as ArmorSetId | undefined;
      if (set && ARMOR[set]) for (const h of ARMOR[set][s as ArmorSlot].hides) this.hidden.add(h);
    }
    this.regroup();
  }

  // ---------------------------------------------------------------- equipment
  /** Shows the equipped items (call with the gear's equip map whenever it changes). */
  setEquip(equip: Record<Slot, string | null>) {
    for (const s of ['head', 'hands', 'feet', 'body'] as Slot[]) {
      if (this.equipIds[s] === equip[s]) continue;
      this.equipIds[s] = equip[s];
      for (const m of this.armor[s] ?? []) m.removeFromParent();
      delete this.armor[s];
      const set = item(equip[s])?.armorSet as ArmorSetId | undefined;
      if (set && ARMOR[set]) {
        const ms: THREE.Mesh[] = [];
        for (const { bone, mesh } of armorMeshes(set, s as ArmorSlot, this.shadows)) {
          this.b[bone].add(mesh);
          ms.push(mesh);
        }
        this.armor[s] = ms;
      }
      this.updateHidden();
    }
    if (this.equipIds.main !== equip.main) {
      this.equipIds.main = equip.main;
      this.setWeapon(equip.main);
    }
  }

  get weaponType(): WeaponKind | null {
    return this.weaponKind;
  }

  private setWeapon(id: string | null) {
    if (this.weaponObj) this.weaponObj.removeFromParent();
    this.oldWeapon?.dispose();
    this.oldWeapon = null;
    this.weaponObj = null;
    this.backGear.clear();
    const f = familyOf(id);
    this.family = f.family;
    this.weaponKind = f.kind;
    this.vox = f.vox;
    this.combat.family = f.family;
    // a new weapon starts put away (or in the hand for the staff), then the state takes over
    this.combat.phase = 'peace';
    this.combat.t = 0;
    this.wfInit = false;
    if (!f.family) return;
    if (f.vox) {
      const m = new THREE.Mesh(f.vox.geometry, this.weaponMat);
      m.castShadow = this.shadows;
      this.weaponObj = m;
    } else if (f.kind) {
      this.oldWeapon = weaponModel(f.kind);
      this.weaponObj = this.oldWeapon.root;
    }
    if (this.weaponObj) this.weaponRoot.add(this.weaponObj);
    this.buildBackGear();
  }

  /** The scabbard of a sword and the quiver of the bow, on the back. */
  private buildBackGear() {
    const f = this.family;
    const leather = new THREE.MeshLambertMaterial({ color: 0x5a3820 });
    const brass = new THREE.MeshLambertMaterial({ color: 0xb08a40 });
    const spine = boneHead('spine');
    if ((f === 'sword' || f === 'great') && this.vox) {
      const bf = backFrame(f);
      // the scabbard runs down from just under the guard along the blade
      const guard = 0.12;
      const len = this.vox.length - 0.2 - guard;
      const w = f === 'great' ? 0.13 : 0.1;
      const g = new THREE.BoxGeometry(w, len, 0.06);
      g.translate(0, guard + len / 2, 0);
      const sc = new THREE.Mesh(g, leather);
      const q = basisQuat(bf);
      sc.quaternion.copy(q);
      sc.position.copy(bf.g);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(w + 0.02, 0.05, 0.075), brass);
      cap.position.set(0, guard + 0.02, 0);
      sc.add(cap);
      // a strap across the chest holds it
      const strap = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.52, 0.32), leather);
      strap.position.set(0.0, 0.18, -0.02);
      strap.rotation.z = -0.75;
      strap.scale.set(1, 1, 1.02);
      this.backGear.add(sc);
      void spine;
    }
    if (f === 'bow') {
      const qv = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.46, 0.1), leather);
      qv.position.set(0.12, 0.2, -0.2);
      qv.rotation.z = -0.35;
      for (let i = 0; i < 4; i++) {
        const fl = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.1, 0.03), new THREE.MeshLambertMaterial({ color: i % 2 ? 0xe8e2d4 : 0xc84a3a }));
        fl.position.set(-0.03 + i * 0.02, 0.27, 0);
        qv.add(fl);
      }
      this.backGear.add(qv);
    }
    if (this.shadows) this.backGear.traverse((o) => ((o as THREE.Mesh).isMesh ? ((o as THREE.Mesh).castShadow = true) : null));
  }

  // ---------------------------------------------------------------- animation
  /** Sets every joint for this frame. */
  pose(p: HumanPose) {
    const dt = this.lastTime < 0 ? 1 / 60 : Math.max(0, Math.min(0.1, p.time - this.lastTime));
    this.lastTime = p.time;
    const fam = this.family;
    const busy = !!p.attack || !!p.hold;
    this.combat.update(dt, !!p.combat, busy);
    const variant = this.combo.update(dt, p.attack ? p.attack.seq ?? 0 : null);
    // ------------------------------------------------ locomotion phase from the distance walked
    const mv = p.move ?? { x: 0, z: p.moving * 3.5 };
    const local = new THREE.Vector2(mv.x, mv.z);
    const speed = p.airborne ? 0 : local.length();
    this.phase += (dt * speed * Math.PI) / stride(speed);
    const L = legs(local, this.phase);
    // ------------------------------------------------ reset the skeleton
    for (const b of this.bones) b.quaternion.identity();
    this.b.root.position.set(...BONES[0].head);
    this.b.pelvis.position.set(0, BONES[BONE_INDEX.pelvis].head[1] - BONES[0].head[1], 0);
    this.tumble.rotation.set(0, 0, 0);
    this.tumble.position.set(0, 0, 0);
    // ------------------------------------------------ weapon pose (target of this frame)
    const want = this.weaponPose(p, fam, variant);
    const rate = p.attack || p.hold ? 26 : 10;
    const k = 1 - Math.exp(-rate * dt);
    if (!this.wfInit && want) {
      this.wf = { g: want.frame.g.clone(), a: want.frame.a.clone(), e: want.frame.e.clone() };
      this.wfInit = true;
    } else if (want) mixFrame(this.wf, want.frame, k, this.wf);
    const bm = want?.body ?? { yaw: 0, lean: 0, step: 0 };
    this.bodyM.yaw += (bm.yaw - this.bodyM.yaw) * k;
    this.bodyM.lean += (bm.lean - this.bodyM.lean) * k;
    this.bodyM.step += (bm.step - this.bodyM.step) * k;
    // ------------------------------------------------ body (FK)
    const runLean = Math.min(1, speed / 6) * 0.12;
    this.b.pelvis.position.y += L.bob;
    this.rot(this.b.pelvis, _y, this.bodyM.yaw * 0.35);
    this.rot(this.b.spine, _y, this.bodyM.yaw * 0.65);
    this.rot(this.b.spine, _x, this.bodyM.lean + runLean * Math.sign(local.y || 1) + L.lean.y * 0.5);
    this.rot(this.b.spine, _z, -L.lean.x * 0.5);
    // the head keeps looking ahead (at the target) while the torso turns
    this.rot(this.b.neck, _y, -this.bodyM.yaw * 0.8);
    this.rot(this.b.neck, _x, -this.bodyM.lean * 0.6);
    // ------------------------------------------------ legs
    const step = this.bodyM.step * (speed < 0.5 ? 1 : 0.3);
    this.legFK('R', L.swingR + step * 0.28, L.axis, L.kneeR + step * 0.15);
    this.legFK('L', L.swingL - step * 0.45, L.axis, L.kneeL + step * 0.35);
    if (p.airborne) {
      const up = Math.max(-1, Math.min(1, p.vy / 5));
      this.legFK('R', -0.35 + up * 0.2, _x, 0.7 - up * 0.2);
      this.legFK('L', 0.15 - up * 0.1, _x, 0.35);
    }
    if (p.flip && p.flip > 0) {
      const a = -ease(p.flip) * Math.PI * 2;
      this.tumble.position.set(0, FLIP_CENTER - Math.cos(a) * FLIP_CENTER, Math.sin(a) * FLIP_CENTER);
      this.tumble.rotation.x = a;
      this.legFK('R', -1.0, _x, 1.6);
      this.legFK('L', -1.0, _x, 1.6);
    }
    this.body.updateMatrixWorld(true);
    // ------------------------------------------------ arms and the weapon
    this.armsAndWeapon(p, want, L, speed);
  }

  /** Rotates a bone about an axis given in the body frame (composed onto its local rotation). */
  private rot(b: THREE.Bone, axis: THREE.Vector3, ang: number) {
    if (!ang) return;
    b.quaternion.multiply(_q1.setFromAxisAngle(axis, ang));
  }

  private legFK(side: 'L' | 'R', swing: number, axis: THREE.Vector3, knee: number) {
    const th = this.b['thigh.' + side];
    const sh = this.b['shin.' + side];
    const ft = this.b['foot.' + side];
    th.quaternion.setFromAxisAngle(axis, swing);
    sh.quaternion.setFromAxisAngle(_x, knee);
    // the foot stays roughly level with the ground
    ft.quaternion.setFromAxisAngle(_x, -knee * 0.55 - (axis.x * swing) * 0.4);
  }

  /** The weapon pose wanted this frame (null without a weapon). */
  private weaponPose(p: HumanPose, fam: Family | null, variant: number): WeaponPose | null {
    if (!fam) return null;
    const walk = this.phase;
    const mov = Math.min(1, (p.move ? Math.hypot(p.move.x, p.move.z) : p.moving * 3.5) / 3.5);
    const a = p.attack;
    const hitAt = a?.hitAt ?? 0.5;
    // held actions first (they last as long as the key)
    if (p.hold && !a) {
      if (p.hold.kind === 'aim' && fam === 'bow') return bowAimPose(p.hold.k, walk, mov);
      if (p.hold.kind === 'charge' && fam === 'staff') return staffChargePose(p.hold.k, walk, mov);
      if (p.hold.kind === 'block' && (fam === 'sword' || fam === 'great')) return blockPose(fam, p.hold.k, walk, mov);
    }
    if (a) {
      if (fam === 'sword' || fam === 'great') return swingPose(fam, variant, a.t, hitAt, a.kind === 'skill');
      if (fam === 'bow') return bowPose(a.t, hitAt, walk, mov);
      if (fam === 'staff') return staffPose(a.t, hitAt, walk, mov, a.kind === 'spell' || a.kind === 'skill');
      // other weapons: a thrust from the stance
      const st = stanceFrame('other', walk, mov);
      const k = Math.sin(Math.min(1, a.t / Math.max(0.05, hitAt)) * Math.PI * 0.5) * (a.t < hitAt ? 1 : 1 - (a.t - hitAt) / (1 - hitAt));
      return { frame: frame(st.g.clone().add(new THREE.Vector3(0.05, 0.15, 0.3).multiplyScalar(k)), st.a, st.e), body: { yaw: 0.2 * k, lean: 0.15 * k, step: k } };
    }
    const st = stanceFrame(fam, walk, mov);
    if (fam === 'staff') {
      // the staff stays in the hand: lowered as a walking stick in peace, raised in the fight
      const peace = staffPeaceFrame(walk, mov);
      return { frame: mixFrame(peace, st, ease(this.combat.ready)), body: { yaw: 0, lean: 0, step: 0 }, twoHands: this.combat.ready > 0.5 };
    }
    return { frame: st, body: { yaw: 0, lean: 0, step: 0 }, twoHands: fam === 'great' };
  }

  /** Back frame of the family, in the body frame (follows the chest). */
  private backInBody(fam: Family): Frame {
    const bf = backFrame(fam);
    const spine = this.b.spine;
    _m1.copy(this.body.matrixWorld).invert().multiply(spine.matrixWorld);
    const q = _q2.setFromRotationMatrix(_m1);
    return { g: bf.g.clone().applyMatrix4(_m1), a: bf.a.clone().applyQuaternion(q), e: bf.e.clone().applyQuaternion(q) };
  }

  /** A bone's position in the body frame. */
  private posOf(b: THREE.Object3D, out: THREE.Vector3) {
    _m1.copy(this.body.matrixWorld).invert().multiply(b.matrixWorld);
    return out.setFromMatrixPosition(_m1);
  }
  /** A bone's rotation in the body frame. */
  private quatOf(b: THREE.Object3D, out: THREE.Quaternion) {
    _m1.copy(this.body.matrixWorld).invert().multiply(b.matrixWorld);
    return out.setFromRotationMatrix(_m1);
  }

  private armsAndWeapon(p: HumanPose, want: WeaponPose | null, L: ReturnType<typeof legs>, speed: number) {
    const fam = this.family;
    const swingK = Math.min(1, speed / 1.2) * 0.45;
    const armSwing = (side: 'L' | 'R') => {
      const s = (side === 'R' ? 1 : -1) * Math.sin(this.phase) * swingK;
      const u = this.b['upper_arm.' + side];
      // free arms swing against the legs, a little out from the body
      u.quaternion.setFromAxisAngle(L.axis, s).multiply(_q1.setFromAxisAngle(_z, (side === 'R' ? -1 : 1) * 0.06));
      this.b['forearm.' + side].quaternion.setFromAxisAngle(_x, -0.22 - Math.abs(s) * 0.3);
      if (p.airborne) u.quaternion.multiply(_q1.setFromAxisAngle(_z, (side === 'R' ? -1 : 1) * 0.5));
    };
    this.arrow.visible = false;
    this.orb.visible = false;
    for (const s of this.string) s.visible = false;
    this.curl('R', 0.25);
    this.curl('L', 0.25);
    if (!fam || !want || !this.weaponObj) {
      armSwing('R');
      armSwing('L');
      if (this.weaponObj) this.weaponObj.visible = false;
      return;
    }
    this.weaponObj.visible = true;
    const cs = this.combat;
    const mainSide: 'L' | 'R' = fam === 'bow' ? 'L' : 'R';
    const offSide: 'L' | 'R' = mainSide === 'L' ? 'R' : 'L';
    const hasBack = fam === 'sword' || fam === 'great' || fam === 'bow';
    // where the weapon is: on the back (peace), carried (drawing / sheathing), in the hands
    let wf: Frame = this.wf;
    let handOn = true;
    let reach = 0;
    if (hasBack && cs.phase !== 'combat') {
      const back = this.backInBody(fam);
      if (cs.phase === 'peace') {
        wf = back;
        handOn = false;
      } else {
        // the draw: the hand reaches the grip on the back (weapon still mounted), takes it, and
        // brings the weapon over the shoulder into the stance; the sheathe is the same backwards
        const t = cs.phase === 'drawing' ? cs.t : 1 - cs.t;
        if (t < GRAB_AT) {
          wf = back;
          handOn = false;
          reach = ease(t / GRAB_AT);
        } else {
          const k = ease((t - GRAB_AT) / (1 - GRAB_AT));
          const m = mixFrame(back, this.wf, k);
          // the arc lifts the weapon up and out, clear of the head and the shoulder
          const lift = Math.sin(k * Math.PI);
          m.g.add(_v1.set(mainSide === 'R' ? -0.18 : 0.18, 0.22, 0.12).multiplyScalar(lift));
          wf = m;
        }
      }
    }
    // the weapon's grip frame
    const q = basisQuat(wf);
    this.weaponRoot.position.copy(wf.g);
    this.weaponRoot.quaternion.copy(q);
    // ------------------------------------------------ the main hand
    if (handOn || reach > 0) {
      const target = this.handFrameOnGrip(mainSide, wf, fam === 'bow');
      if (!handOn) {
        // reaching for the weapon on the back: from the swing pose toward the grip
        armSwing(mainSide);
        this.body.updateMatrixWorld(true);
        const hand = this.b['hand.' + mainSide];
        const from = this.posOf(hand, _v2.set(0, 0, 0)).clone();
        const fromQ = this.quatOf(hand, _q2).clone();
        target.pos.lerpVectors(from, target.pos, reach);
        target.rot.copy(fromQ.slerp(target.rot, reach));
      }
      const got = this.ik(mainSide, target.pos, target.rot);
      this.curl(mainSide, 1.1);
      if (handOn && got > 0.002) {
        // out of reach: the weapon follows the hand (never floats away from it)
        const hand = this.b['hand.' + mainSide];
        const wpos = this.posOf(hand, _v2);
        const hq = this.quatOf(hand, _q2);
        const grip = GRIP_IN_HAND(mainSide === 'L' ? 1 : -1).applyQuaternion(hq).add(wpos);
        this.weaponRoot.position.copy(grip);
      }
    } else armSwing(mainSide);
    // ------------------------------------------------ the other hand
    const gp = this.weaponRoot.position;
    const ga = _v3.set(0, 1, 0).applyQuaternion(this.weaponRoot.quaternion);
    const ge = new THREE.Vector3(0, 0, 1).applyQuaternion(this.weaponRoot.quaternion);
    if (fam === 'bow' && handOn) {
      this.bowString(want, gp, ga, ge, offSide);
    } else if (handOn && want.twoHands) {
      // second hand on the handle, below the first (greatsword) or above it (staff)
      const off = fam === 'staff' ? 0.26 : -0.13;
      const f2 = { g: gp.clone().addScaledVector(ga, off), a: ga.clone(), e: ge.clone() };
      const t2 = this.handFrameOnGrip(offSide, f2, false);
      this.ik(offSide, t2.pos, t2.rot);
      this.curl(offSide, 1.1);
    } else armSwing(offSide);
    // ------------------------------------------------ magic
    if (fam === 'staff' && this.vox) {
      const orb = want.orb ?? 0;
      const flash = want.flash ?? 0;
      const tip = gp.clone().addScaledVector(ga, this.vox.tip.y - 0.06);
      if (orb > 0.02 || flash > 0.02) {
        this.orb.visible = true;
        this.orb.position.copy(tip);
        const s = 0.25 + orb * 0.9 + flash * 1.6;
        this.orb.scale.setScalar(s);
        this.orb.rotation.set(p.time * 3, p.time * 4, 0);
        this.orbMat.opacity = 0.55 + orb * 0.35 + flash * 0.3;
      }
    }
  }

  /**
   * Where the hand must be (wrist position and rotation, body frame) to hold a grip frame: the
   * handle runs through the fist from the little finger to the thumb (hand +z along the handle),
   * the knuckles toward the edge (the bow: toward the arrow's way).
   */
  private handFrameOnGrip(side: 'L' | 'R', f: Frame, bow: boolean) {
    const z = f.a.clone();
    const y = f.e.clone().negate();
    if (bow) y.copy(f.e).negate();
    const x = new THREE.Vector3().crossVectors(y, z).normalize();
    y.crossVectors(z, x).normalize();
    const rot = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
    const pos = f.g.clone().sub(GRIP_IN_HAND(side === 'L' ? 1 : -1).applyQuaternion(rot));
    return { pos, rot };
  }

  /** Bow: the string from the limb tips to the nock (drawn by the right hand), the arrow on it. */
  private bowString(want: WeaponPose, gp: THREE.Vector3, ga: THREE.Vector3, ge: THREE.Vector3, side: 'L' | 'R') {
    const v = this.vox!;
    const q = this.weaponRoot.quaternion;
    const top = v.tip.clone().applyQuaternion(q).add(gp);
    const bot = v.tipLow!.clone().applyQuaternion(q).add(gp);
    const rest = top.clone().add(bot).multiplyScalar(0.5);
    const draw = want.draw ?? 0;
    // full draw brings the nock straight back to the chest, under the chin
    const anchor = new THREE.Vector3(-0.03, 1.3, 0.1);
    const full = Math.max(rest.clone().sub(gp).dot(ge) * -1 + 0.05, gp.clone().sub(anchor).dot(ge));
    const depth0 = -rest.clone().sub(gp).dot(ge);
    const nock = gp.clone().addScaledVector(ge, -(depth0 + (full - depth0) * draw));
    nock.y += (rest.y - nock.y) * (1 - draw);
    if (want.onString) {
      // the right hand holds the string at the nock, fingers on it, the forearm in line with the arrow
      const f = { g: nock.clone().addScaledVector(ge, -0.02), a: ga.clone().negate(), e: ge.clone() };
      const t = this.handFrameOnGrip(side, f, false);
      this.ik(side, t.pos, t.rot, new THREE.Vector3(side === 'R' ? -1 : 1, 0.15, -0.5));
      this.curl(side, 0.7);
    } else if (want.arrow) {
      // taking an arrow from the quiver over the shoulder
      const f = { g: new THREE.Vector3(-0.12, 1.45, -0.1), a: new THREE.Vector3(0, 1, 0), e: new THREE.Vector3(0, 0, 1) };
      const t = this.handFrameOnGrip(side, f, false);
      this.ik(side, t.pos, t.rot);
      this.curl(side, 0.9);
    } else {
      const u = this.b['upper_arm.' + side];
      u.quaternion.setFromAxisAngle(_x, -0.25);
      this.b['forearm.' + side].quaternion.setFromAxisAngle(_x, -0.5);
    }
    for (const [i, a] of [top, bot].entries()) {
      const s = this.string[i];
      s.visible = true;
      s.position.copy(a);
      const d = nock.clone().sub(a);
      s.scale.set(1, d.length(), 1);
      s.quaternion.setFromUnitVectors(_y, d.normalize());
    }
    if (want.arrow && want.onString) {
      this.arrow.visible = true;
      this.arrow.position.copy(nock);
      this.arrow.quaternion.setFromUnitVectors(_z, ge);
    }
  }

  /** Fingers close around a handle (0 open .. ~1.2 fist). */
  private curl(side: 'L' | 'R', k: number) {
    const s = side === 'L' ? -1 : 1;
    for (let i = 1; i <= 4; i++) this.b[`finger_${i}.${side}`].quaternion.setFromAxisAngle(_z, s * k);
    this.b['thumb.' + side].quaternion.setFromAxisAngle(_x, -k * 0.4);
  }

  /**
   * Two-bone IK of an arm: the wrist to `pos` and the hand turned to `rot` (body frame), the
   * elbow bending toward `pole` (out, down and back by default). Returns how far the wrist
   * stayed from the target (0 when reached).
   */
  private ik(side: 'L' | 'R', pos: THREE.Vector3, rot: THREE.Quaternion, pole?: THREE.Vector3): number {
    const sgn = side === 'L' ? 1 : -1;
    const upper = this.b['upper_arm.' + side];
    const fore = this.b['forearm.' + side];
    const hand = this.b['hand.' + side];
    upper.quaternion.identity();
    fore.quaternion.identity();
    hand.quaternion.identity();
    this.body.updateMatrixWorld(true);
    const S = this.posOf(upper, new THREE.Vector3());
    const parentQ = this.quatOf(upper.parent!, new THREE.Quaternion());
    const L1 = this.len.U;
    const L2 = this.len.F;
    const toT = pos.clone().sub(S);
    const dRaw = toT.length();
    const d = Math.max(Math.abs(L1 - L2) + 1e-3, Math.min(L1 + L2 - 1e-4, dRaw));
    const n = toT.normalize();
    const P = (pole ?? new THREE.Vector3(sgn * 0.55, -0.45, -0.7)).clone().normalize();
    const m = P.clone().addScaledVector(n, -n.dot(P));
    if (m.lengthSq() < 1e-6) m.set(0, -1, 0).addScaledVector(n, -n.y);
    m.normalize();
    const cosA = (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d);
    const sinA = Math.sqrt(Math.max(0, 1 - cosA * cosA));
    const E = S.clone().addScaledVector(n, L1 * cosA).addScaledVector(m, L1 * sinA);
    const W = S.clone().addScaledVector(n, d);
    const dirU = E.clone().sub(S).normalize();
    const dirF = W.clone().sub(E).normalize();
    // the bend plane: the forearm folds toward m (at rest that is forward, about -x)
    const bend = new THREE.Vector3().crossVectors(dirU, m).normalize();
    const qU = this.align(this.restU[side], dirU, bend);
    const qF = this.align(this.restF[side], dirF, bend);
    // body-frame rotations to the bones' local ones (rest rotations are identity)
    upper.quaternion.copy(parentQ.clone().invert().multiply(qU));
    fore.quaternion.copy(qU.clone().invert().multiply(qF));
    hand.quaternion.copy(qF.clone().invert().multiply(rot));
    return Math.max(0, dRaw - d);
  }

  /** Rotation taking the rest direction `rest` to `dir`, the rest bend axis (-x) to `bend`. */
  private align(rest: THREE.Vector3, dir: THREE.Vector3, bend: THREE.Vector3): THREE.Quaternion {
    const yr = rest.clone().normalize();
    const xr = new THREE.Vector3(-1, 0, 0).addScaledVector(yr, yr.x).normalize();
    const zr = new THREE.Vector3().crossVectors(xr, yr);
    const yd = dir.clone().normalize();
    const xd = bend.clone().addScaledVector(yd, -bend.dot(yd)).normalize();
    const zd = new THREE.Vector3().crossVectors(xd, yd);
    const Br = new THREE.Matrix4().makeBasis(xr, yr, zr);
    const Bd = new THREE.Matrix4().makeBasis(xd, yd, zd);
    return new THREE.Quaternion().setFromRotationMatrix(Bd.multiply(Br.transpose()));
  }

  /** World position of the weapon's business end (staff head, blade tip) for effects. */
  weaponTip(out: THREE.Vector3): THREE.Vector3 | null {
    if (!this.weaponObj || !this.vox) return null;
    out.set(0, this.vox.tip.y, 0);
    return this.weaponRoot.localToWorld(out);
  }

  dispose() {
    this.geo.dispose();
    this.matShow.dispose();
    this.matHide.dispose();
    this.orbMat.dispose();
    this.weaponMat.dispose();
    this.oldWeapon?.dispose();
    this.arrow.geometry.dispose();
    for (const s of this.string) (s.material as THREE.Material).dispose();
    for (const m of [...this.worn, ...Object.values(this.armor).flat()]) m?.removeFromParent();
  }
}

void boneTail;

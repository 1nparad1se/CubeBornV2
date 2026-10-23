import * as THREE from 'three';
import { item, type Slot, type WeaponKind } from '../../rpg/items';
import { BONES, BONE_INDEX, PARTS, PART_INDEX, boneHead, boneTail, characterGeometry, characterTexture } from './charAsset';
import { ARMOR, armorMeshes, type ArmorSetId, type ArmorSlot } from './armorModels';
import {
  BOW_ANCHOR,
  BOW_STANCE_DRAW,
  CombatState,
  ComboCounter,
  STAFF_FREE,
  basisQuat,
  blockPose,
  bowAimPose,
  bowPose,
  frame,
  legs,
  mixFrame,
  peaceFrame,
  staffChargePose,
  staffPose,
  stanceBody,
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
  /** Seconds since the character was last hit (a flinch plays for 0.4 s). */
  hurt?: number;
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
      const family: Family = vox.kind === 'sword' ? (mapped.great || vox.great ? 'great' : 'sword') : vox.kind;
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
/** Slow in, fast through the middle, slow out (the salto's turn). */
const smoother = (x: number) => {
  const c = Math.max(0, Math.min(1, x));
  return c * c * c * (c * (c * 6 - 15) + 10);
};
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
/** Points of a sole in the foot bone's frame (heel and toe, at the ground at rest). */
const SOLE = [new THREE.Vector3(0, -0.14, -0.05), new THREE.Vector3(0, -0.14, 0.17)];

/** Point in the hand's own frame where the handle passes through the closed fist. */
const GRIP_IN_HAND = (side: 1 | -1) => new THREE.Vector3(side * 0.012, -0.062, 0);
/** Height of the tucked body's middle: the double-jump salto turns around it. */
const FLIP_CENTER = 0.85;

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
  /** Smoothed velocity in the body frame (blends idle, walk, run and sprint). */
  private vel = new THREE.Vector2();
  /** Jump state: time in the air, height of the take-off, time since landing and how hard. */
  private wasAir = false;
  private airT = 0;
  private takeoffY = 0;
  private landT = 9;
  private landHard = 0.5;
  private lastVy = 0;
  /** Glowing part of a weapon (the staff's crystal) and the floating pixels around it. */
  private glowMat: THREE.MeshBasicMaterial | null = null;
  private sparks = new THREE.Group();
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
    const sparkMat = new THREE.MeshBasicMaterial({ color: 0x7af0ff, transparent: true, opacity: 0.9, depthWrite: false });
    const sparkGeo = new THREE.BoxGeometry(0.035, 0.035, 0.035);
    for (let i = 0; i < 10; i++) this.sparks.add(new THREE.Mesh(sparkGeo, sparkMat));
    this.sparks.visible = false;
    this.body.add(this.sparks);
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
    this.glowMat?.dispose();
    this.glowMat = null;
    if (f.vox) {
      // a glowing part (the staff's crystal) is drawn unlit with its own material
      if (f.vox.glow) this.glowMat = new THREE.MeshBasicMaterial({ vertexColors: true });
      const m = new THREE.Mesh(f.vox.geometry, this.glowMat ? [this.weaponMat, this.glowMat] : this.weaponMat);
      m.castShadow = this.shadows;
      this.weaponObj = m;
    } else if (f.kind) {
      this.oldWeapon = weaponModel(f.kind);
      this.weaponObj = this.oldWeapon.root;
    }
    if (this.weaponObj) this.weaponRoot.add(this.weaponObj);
    this.buildBackGear();
  }

  /** The quiver of the bow on the back, its arrows over the right shoulder (weapons stay in the hand). */
  private buildBackGear() {
    const leather = new THREE.MeshLambertMaterial({ color: 0x5a3820 });
    if (this.family === 'bow') {
      const qv = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.46, 0.1), leather);
      qv.position.set(-0.08, 0.2, -0.2);
      qv.rotation.z = 0.4;
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
    // ------------------------------------------------ jump state (take-off, flight, landing)
    const rootY = this.root.position.y;
    if (p.airborne && !this.wasAir) {
      this.airT = 0;
      this.takeoffY = rootY;
    } else if (!p.airborne && this.wasAir) {
      this.landT = 0;
      this.landHard = Math.max(0.45, Math.min(1, -this.lastVy / 7));
    }
    if (p.airborne) this.airT += dt;
    else this.landT += dt;
    this.wasAir = p.airborne;
    this.lastVy = p.vy;
    // ------------------------------------------------ locomotion: smoothed velocity and the step phase
    const mv = p.move ?? { x: 0, z: p.moving * 3.5 };
    const kv = 1 - Math.exp(-(p.airborne ? 4 : 10) * dt);
    this.vel.x += ((p.airborne ? 0 : mv.x) - this.vel.x) * kv;
    this.vel.y += ((p.airborne ? 0 : mv.z) - this.vel.y) * kv;
    const speed = this.vel.length();
    this.phase += (dt * speed * Math.PI) / stride(speed);
    const L = legs(this.vel, this.phase);
    const moveK = Math.min(1, speed / 1.2);
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
    // ------------------------------------------------ one-off moves: landing, hit, salto, take-off
    const land = !p.airborne && this.landT < 0.3 ? this.landHard * Math.sin(Math.min(1, this.landT / 0.05) * Math.PI * 0.5) * (1 - ease((this.landT - 0.05) / 0.25)) : 0;
    const hurt = p.hurt !== undefined && p.hurt < 0.4 ? Math.sin(Math.min(1, p.hurt / 0.06) * Math.PI * 0.5) * (1 - ease((p.hurt - 0.06) / 0.34)) : 0;
    const flip = p.flip && p.flip > 0 && p.airborne ? Math.min(1, p.flip) : 0;
    // the salto: push-off, tuck while turning a full circle forward around the middle, open up
    const tuck = flip ? ease((flip - 0.06) / 0.2) * (1 - ease((flip - 0.64) / 0.22)) : 0;
    // ------------------------------------------------ body (FK)
    const idle = (1 - moveK) * (p.airborne ? 0 : 1);
    const breathe = Math.sin(p.time * 1.9) * 0.012 * idle;
    const runLean = (0.05 + L.run * 0.16) * moveK * Math.sign(this.vel.y || 1);
    this.b.pelvis.position.x += L.sway;
    this.rot(this.b.pelvis, _y, L.hipYaw + this.bodyM.yaw * 0.35);
    this.rot(this.b.pelvis, _z, L.hipRoll);
    this.rot(this.b.spine, _y, -L.hipYaw * 1.6 + this.bodyM.yaw * 0.65);
    const spinePitch = this.bodyM.lean + runLean + L.lean.y * 0.4 + breathe + land * 0.42 - hurt * 0.32 + tuck * 0.5 + (p.airborne && !flip ? 0.08 : 0);
    this.rot(this.b.spine, _x, spinePitch);
    this.rot(this.b.spine, _z, -L.lean.x * 0.5 - L.hipRoll * 0.7);
    // the head keeps looking ahead (at the target) while the torso turns and leans
    const look = idle * (1 - (fam ? this.combat.ready : 0)) * (Math.sin(p.time * 0.37) * 0.14 + Math.sin(p.time * 0.91) * 0.05);
    this.rot(this.b.neck, _y, -(this.bodyM.yaw - L.hipYaw * 0.6) * 0.9 + look);
    this.rot(this.b.neck, _x, -(spinePitch - tuck * 0.5) * 0.65 + tuck * 0.35 - hurt * 0.2);
    // ------------------------------------------------ legs
    const S = this.bodyM.step * (1 - moveK) * (p.airborne ? 0 : 1);
    let lr = { swing: L.swingR + S * 0.2, knee: L.kneeR + S * 0.22, foot: L.footR, splay: -0.1 * S };
    let ll = { swing: L.swingL - S * 0.32, knee: L.kneeL + S * 0.28, foot: L.footL, splay: 0.1 * S };
    let axis = L.axis;
    if (land > 0) {
      lr = { swing: lr.swing - 0.72 * land, knee: lr.knee + 1.45 * land, foot: lr.foot, splay: lr.splay - 0.08 * land };
      ll = { swing: ll.swing - 0.85 * land, knee: ll.knee + 1.55 * land, foot: ll.foot, splay: ll.splay + 0.08 * land };
    }
    if (p.airborne) {
      axis = _x;
      if (flip) {
        // push-off (legs long, toes down) → tucked knees to the chest → open, legs reaching down
        const open = flip < 0.3 ? { s: 0.2, k: 0.15, f: 0.5 } : { s: -0.45, k: 0.45, f: 0.1 };
        lr = { swing: lerp(open.s, -2.05, tuck), knee: lerp(open.k, 2.35, tuck), foot: open.f * (1 - tuck), splay: -0.06 };
        ll = { swing: lerp(open.s + 0.15, -1.95, tuck), knee: lerp(open.k, 2.3, tuck), foot: open.f * (1 - tuck), splay: 0.06 };
      } else {
        // first jump: the push (legs straight, toes pointed) → rise (front knee up) → apex (both
        // tucked) → descent (legs reaching for the ground)
        const u = Math.max(-1, Math.min(1, p.vy / 6));
        const push = 1 - ease(this.airT / 0.16);
        const rise = { R: [-1.15, 1.55], L: [0.35, 1.05] };
        const apex = { R: [-0.95, 1.45], L: [-0.55, 1.35] };
        const fall = { R: [-0.4, 0.55], L: [-0.1, 0.4] };
        const pick = (side: 'R' | 'L', i: number) => (u > 0.3 ? lerp(apex[side][i], rise[side][i], (u - 0.3) / 0.7) : u > -0.3 ? apex[side][i] : lerp(apex[side][i], fall[side][i], (-u - 0.3) / 0.7));
        lr = { swing: lerp(pick('R', 0), 0.12, push), knee: lerp(pick('R', 1), 0.08, push), foot: lerp(0.1, 0.55, push), splay: -0.05 };
        ll = { swing: lerp(pick('L', 0), 0.3, push), knee: lerp(pick('L', 1), 0.15, push), foot: lerp(0.1, 0.6, push), splay: 0.05 };
        // the crouch before the push: the first instants of the flight show the knees still bent
        const crouch = 1 - ease(this.airT / 0.07);
        if (crouch > 0) {
          lr = { swing: lerp(lr.swing, -0.75, crouch), knee: lerp(lr.knee, 1.35, crouch), foot: lerp(lr.foot, 0, crouch), splay: -0.08 };
          ll = { swing: lerp(ll.swing, -0.8, crouch), knee: lerp(ll.knee, 1.4, crouch), foot: lerp(ll.foot, 0, crouch), splay: 0.08 };
        }
      }
    }
    this.legFK('R', lr.swing, axis, lr.knee, lr.foot, lr.splay);
    this.legFK('L', ll.swing, axis, ll.knee, ll.foot, ll.splay);
    // ------------------------------------------------ feet on the ground (no sinking, no floating)
    this.body.updateMatrixWorld(true);
    if (!p.airborne) {
      const shift = -this.soleMin() + L.lift + Math.sin(p.time * 3.2) * 0.006 * (fam ? this.combat.ready : 0) * idle;
      this.b.pelvis.position.y += shift;
    } else if (!flip && this.airT < 0.12) {
      // take-off: the feet stay on the ground while the legs extend (the push), then leave it
      const ground = this.takeoffY - rootY;
      const need = ground - this.soleMin();
      if (need < 0) this.b.pelvis.position.y += Math.max(-0.3, need) * (1 - this.airT / 0.12);
    }
    if (flip) {
      const a = Math.PI * 2 * smoother((flip - 0.1) / 0.72);
      const c = FLIP_CENTER;
      this.tumble.rotation.x = a;
      this.tumble.position.set(0, c - c * Math.cos(a), -c * Math.sin(a));
    }
    this.body.updateMatrixWorld(true);
    // ------------------------------------------------ arms and the weapon
    this.armsAndWeapon(p, want, L, { land, hurt, tuck, flip });
    this.updateSparks(p, fam);
  }

  /** Lowest point of the soles (body frame y). */
  private soleMin(): number {
    let m = Infinity;
    for (const side of ['L', 'R']) {
      const f = this.b['foot.' + side];
      for (const pt of SOLE) {
        _m1.copy(this.body.matrixWorld).invert().multiply(f.matrixWorld);
        const y = _v1.copy(pt).applyMatrix4(_m1).y;
        if (y < m) m = y;
      }
    }
    return m;
  }

  /** Rotates a bone about an axis given in the body frame (composed onto its local rotation). */
  private rot(b: THREE.Bone, axis: THREE.Vector3, ang: number) {
    if (!ang) return;
    b.quaternion.multiply(_q1.setFromAxisAngle(axis, ang));
  }

  /** Thigh swing (about `axis`) with a sideways splay, knee bend, foot pitch relative to level. */
  private legFK(side: 'L' | 'R', swing: number, axis: THREE.Vector3, knee: number, foot = 0, splay = 0) {
    const th = this.b['thigh.' + side];
    const sh = this.b['shin.' + side];
    const ft = this.b['foot.' + side];
    th.quaternion.setFromAxisAngle(_z, splay).multiply(_q1.setFromAxisAngle(axis, swing));
    sh.quaternion.setFromAxisAngle(_x, knee);
    // the foot stays level with the ground (cancelling thigh and knee), plus its own pitch
    ft.quaternion.setFromAxisAngle(_x, -knee - axis.x * swing + foot);
  }

  /** The weapon pose wanted this frame (null without a weapon). */
  private weaponPose(p: HumanPose, fam: Family | null, variant: number): WeaponPose | null {
    if (!fam) return null;
    const walk = this.phase;
    const mov = Math.min(1, this.vel.length() / 3.5);
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
    // no action: the relaxed hold («Вне боя») blends into the fighting stance («В бою»)
    const r = ease(this.combat.ready);
    const f = mixFrame(peaceFrame(fam, walk, mov), stanceFrame(fam, walk, mov), r);
    const sb = stanceBody(fam);
    const out: WeaponPose = { frame: f, body: { yaw: sb.yaw * r, lean: sb.lean * r, step: sb.step * r }, twoHands: (fam === 'sword' || fam === 'great') && r > 0.55 };
    if (fam === 'bow') {
      const n = ease((r - 0.55) / 0.45);
      out.draw = BOW_STANCE_DRAW * n;
      out.arrow = r > 0.55;
      out.onString = r > 0.55;
    }
    if (fam === 'staff' && r > 0.05) {
      out.free = new THREE.Vector3(0.34, 0.74, 0.08).lerp(STAFF_FREE, r);
      out.freeCurl = lerp(0.6, 0.1, r);
    }
    return out;
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

  private armsAndWeapon(p: HumanPose, want: WeaponPose | null, L: ReturnType<typeof legs>, fx: { land: number; hurt: number; tuck: number; flip: number }) {
    const fam = this.family;
    const air = p.airborne && !fx.flip;
    const u = Math.max(-1, Math.min(1, p.vy / 6));
    const armSwing = (side: 'L' | 'R') => {
      const sg = side === 'R' ? 1 : -1;
      const s = sg * Math.sin(this.phase) * L.armAmp;
      const up = this.b['upper_arm.' + side];
      // free arms swing against the legs, a little out from the body; the elbow bends more forward
      let swing = s;
      let out = 0.07 + L.run * 0.06;
      let elbow = L.elbow + Math.max(0, -s) * 0.45;
      if (air) {
        // rising: arms swung up and forward; apex: forward and out; falling: out for balance
        const push = 1 - ease(this.airT / 0.16);
        // like a running jump: the arm opposite the lifted (right) knee swings forward-up
        const riseA = side === 'R' ? 0.45 : -1.55;
        const a = u > 0 ? lerp(-0.85, riseA, u) : lerp(-0.85, -0.3, -u);
        swing = lerp(a, -2.4, push * 0.6);
        out = u > 0 ? 0.25 : lerp(0.25, 0.95, -u);
        elbow = u > 0 ? 0.9 : 0.45;
        const crouch = 1 - ease(this.airT / 0.07);
        if (crouch > 0) {
          swing = lerp(swing, 0.7, crouch);
          elbow = lerp(elbow, 0.3, crouch);
        }
      }
      if (fx.flip) {
        // salto: arms up at the push, then hugging the shins, then out for the landing
        const openA = fx.flip < 0.3 ? -2.5 : -0.5;
        swing = lerp(openA, -1.35, fx.tuck);
        out = lerp(fx.flip < 0.3 ? 0.2 : 0.8, 0.25, fx.tuck);
        elbow = lerp(0.3, 1.5, fx.tuck);
      }
      if (fx.land > 0) {
        swing = lerp(swing, -0.75, fx.land);
        out = lerp(out, 0.3, fx.land);
        elbow = lerp(elbow, 0.7, fx.land);
      }
      if (fx.hurt > 0) {
        swing = lerp(swing, -0.35, fx.hurt);
        out = lerp(out, 0.5, fx.hurt);
      }
      up.quaternion.setFromAxisAngle(_z, -sg * out).multiply(_q1.setFromAxisAngle(air || fx.flip ? _x : L.axis, swing));
      this.b['forearm.' + side].quaternion.setFromAxisAngle(_x, -elbow);
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
    const mainSide: 'L' | 'R' = fam === 'bow' ? 'L' : 'R';
    const offSide: 'L' | 'R' = mainSide === 'L' ? 'R' : 'L';
    // the weapon stays in the hand (update 7): its grip frame follows the smoothed pose
    const wf: Frame = this.wf;
    const q = basisQuat(wf);
    this.weaponRoot.position.copy(wf.g);
    this.weaponRoot.quaternion.copy(q);
    // ------------------------------------------------ the main hand
    const target = this.handFrameOnGrip(mainSide, wf, fam === 'bow');
    const got = this.ik(mainSide, target.pos, target.rot);
    this.curl(mainSide, 1.1);
    if (got > 0.002) {
      // out of reach: the weapon follows the hand (never floats away from it)
      const hand = this.b['hand.' + mainSide];
      const wpos = this.posOf(hand, _v2);
      const hq = this.quatOf(hand, _q2);
      const grip = GRIP_IN_HAND(mainSide === 'L' ? 1 : -1).applyQuaternion(hq).add(wpos);
      this.weaponRoot.position.copy(grip);
    }
    // ------------------------------------------------ the other hand
    const gp = this.weaponRoot.position;
    const ga = _v3.set(0, 1, 0).applyQuaternion(this.weaponRoot.quaternion);
    const ge = new THREE.Vector3(0, 0, 1).applyQuaternion(this.weaponRoot.quaternion);
    if (fam === 'bow') {
      this.bowString(want, gp, ga, ge, offSide);
    } else if (want.twoHands && (fam === 'sword' || fam === 'great')) {
      // second hand on the handle, under the first
      const off = -(this.vox?.gripLen ?? 0.2) * 0.48;
      const f2 = { g: gp.clone().addScaledVector(ga, off), a: ga.clone(), e: ge.clone() };
      const t2 = this.handFrameOnGrip(offSide, f2, false);
      this.ik(offSide, t2.pos, t2.rot);
      this.curl(offSide, 1.1);
    } else if (fam === 'staff' && want.free) {
      // the free hand reaches forward, palm out, fingers up (casting)
      const pr = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(_v1.set(0, 0.6, -0.8), _v2.set(0, -0.8, -0.6), new THREE.Vector3(-1, 0, 0)));
      this.ik(offSide, want.free, pr, new THREE.Vector3(0.7, -0.6, -0.3));
      this.curl(offSide, want.freeCurl ?? 0.1);
    } else armSwing(offSide);
    // ------------------------------------------------ magic
    if (fam === 'staff' && this.vox) {
      const orb = want.orb ?? 0;
      const flash = want.flash ?? 0;
      const tip = gp.clone().addScaledVector(ga, this.vox.tip.y - 0.02);
      if (orb > 0.02 || flash > 0.02) {
        this.orb.visible = true;
        this.orb.position.copy(tip);
        const s = 0.25 + orb * 0.9 + flash * 1.6;
        this.orb.scale.setScalar(s);
        this.orb.rotation.set(p.time * 3, p.time * 4, 0);
        this.orbMat.opacity = 0.45 + orb * 0.3 + flash * 0.3;
      }
    }
    if (this.glowMat) {
      const r = this.combat.ready;
      const pulse = 0.85 + 0.15 * Math.sin(p.time * 4) * r + (want.flash ?? 0) * 0.5;
      this.glowMat.color.setScalar(Math.min(1.4, pulse + r * 0.15));
    }
  }

  /** Floating cyan pixels around the staff's crystal while in combat (reference «В бою»). */
  private updateSparks(p: HumanPose, fam: Family | null) {
    const on = fam === 'staff' && !!this.vox?.glow && !!this.weaponObj?.visible;
    const r = on ? this.combat.ready : 0;
    this.sparks.visible = r > 0.05;
    if (!this.sparks.visible || !this.vox) return;
    const tip = _v1.set(0, this.vox.tip.y, 0).applyQuaternion(this.weaponRoot.quaternion).add(this.weaponRoot.position);
    this.sparks.children.forEach((c, i) => {
      const m = c as THREE.Mesh;
      const ph = (p.time * 0.45 + i / this.sparks.children.length) % 1;
      const ang = i * 2.399 + p.time * 0.9;
      const rad = 0.1 + 0.07 * Math.sin(i * 1.7 + p.time * 1.3);
      m.position.set(tip.x + Math.cos(ang) * rad, tip.y - 0.12 + ph * 0.42, tip.z + Math.sin(ang) * rad);
      const s = (0.6 + (i % 3) * 0.25) * Math.sin(ph * Math.PI) * r;
      m.scale.setScalar(Math.max(0.001, s));
    });
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

  /**
   * Bow: the string from the limb tips to the nock, drawn by the right hand straight back toward
   * the chin; after the release the hand goes over the right shoulder to the quiver for the next
   * arrow; the arrow lies on the string while it is nocked.
   */
  private bowString(want: WeaponPose, gp: THREE.Vector3, ga: THREE.Vector3, ge: THREE.Vector3, side: 'L' | 'R') {
    const v = this.vox!;
    const q = this.weaponRoot.quaternion;
    const top = v.tip.clone().applyQuaternion(q).add(gp);
    const bot = v.tipLow!.clone().applyQuaternion(q).add(gp);
    const rest = top.clone().add(bot).multiplyScalar(0.5);
    const draw = want.draw ?? 0;
    // full draw: the nock at the anchor under the chin, on the arrow's line behind the bow hand
    const anchor = gp.clone().addScaledVector(ge, BOW_ANCHOR.z - gp.z);
    anchor.y = BOW_ANCHOR.y + (gp.y - 1.3);
    const nock = rest.clone().lerp(anchor, draw);
    if (want.onString) {
      // the right hand holds the string at the nock, the forearm in line with the arrow
      const f = { g: nock.clone().addScaledVector(ge, -0.02), a: ga.clone().negate(), e: ge.clone() };
      const t = this.handFrameOnGrip(side, f, false);
      this.ik(side, t.pos, t.rot, new THREE.Vector3(side === 'R' ? -1 : 1, 0.1, -0.6));
      this.curl(side, 0.7);
    } else if ((want.reload ?? 0) > 0) {
      // over the right shoulder to the quiver
      const from = anchor.clone().add(_v1.set(-0.06, 0.02, -0.08));
      const quiver = new THREE.Vector3(-0.2, 1.5, -0.12);
      const f = { g: from.lerp(quiver, want.reload!), a: new THREE.Vector3(0, 1, 0), e: new THREE.Vector3(0, 0, 1) };
      const t = this.handFrameOnGrip(side, f, false);
      this.ik(side, t.pos, t.rot);
      this.curl(side, 0.9);
    } else if (this.combat.ready > 0.3 || want.draw !== undefined) {
      // just released: the hand flies open back past the chin
      const f = { g: anchor.clone().add(_v1.set(-0.08, 0.03, -0.1)), a: ga.clone().negate(), e: ge.clone() };
      const t = this.handFrameOnGrip(side, f, false);
      this.ik(side, t.pos, t.rot, new THREE.Vector3(-1, 0.1, -0.6));
      this.curl(side, 0.2);
    } else {
      const sg = side === 'R' ? 1 : -1;
      const s = sg * Math.sin(this.phase) * 0.3 * Math.min(1, this.vel.length() / 1.2);
      this.b['upper_arm.' + side].quaternion.setFromAxisAngle(_z, -sg * 0.07).multiply(_q1.setFromAxisAngle(_x, s));
      this.b['forearm.' + side].quaternion.setFromAxisAngle(_x, -0.3);
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
    this.glowMat?.dispose();
    this.oldWeapon?.dispose();
    this.arrow.geometry.dispose();
    for (const s of this.string) (s.material as THREE.Material).dispose();
    for (const m of [...this.worn, ...Object.values(this.armor).flat()]) m?.removeFromParent();
  }
}

void boneTail;

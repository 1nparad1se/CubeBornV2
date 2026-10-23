import * as THREE from 'three';
import { hash2 } from '../../core/Rng';
import { boneHead } from './charAsset';

/**
 * Armour made for the new character: three sets (light — scout, heavy — guard, magic robe —
 * apprentice), four pieces each (head, body, hands, feet). A piece is a few boxes, each bound to
 * one bone and built just outside the body part it covers, so it moves with the body and does not
 * cut into it; the body parts fully under a piece are hidden. Surfaces are pixel textures (one
 * texel ≈ 2.8 cm, like the body), with a pattern per material: plates and rivets, leather and
 * stitches, cloth with trims.
 */
export type ArmorSetId = 'scout' | 'guard' | 'apprentice';
export type ArmorSlot = 'head' | 'body' | 'hands' | 'feet';

type Pattern = 'plate' | 'mail' | 'leather' | 'cloth' | 'trim' | 'fur' | 'gem' | 'metal';

interface Box {
  bone: string;
  /** Model-space corners at rest (metres; the model's left side, +x; mirrored for `both`). */
  min: [number, number, number];
  max: [number, number, number];
  pat: Pattern;
  color: number;
  /** Also on the right side (x mirrored, bone .L → .R). */
  both?: boolean;
}

export interface ArmorPiece {
  boxes: Box[];
  /** Body parts hidden under the piece (character part names). */
  hides: string[];
}

const SHIRT = ['Torso_Shirt', 'Collar_L', 'Collar_R', 'Collar_Step_L', 'Collar_Step_R', 'Lace_Upper', 'Lace_Lower', 'Neckline', 'Shoulder_Shirt_L', 'Shoulder_Shirt_R', 'Upper_Shirt_Back'];
const HANDS = ['Palm_L', 'Palm_R', 'Thumb_L', 'Thumb_R', 'Finger_1_L', 'Finger_1_R', 'Finger_2_L', 'Finger_2_R', 'Finger_3_L', 'Finger_3_R', 'Finger_4_L', 'Finger_4_R'];
const BOOTS = ['Boot_Cuff_L', 'Boot_Cuff_R', 'Boot_Foot_L', 'Boot_Foot_R', 'Boot_Shaft_L', 'Boot_Shaft_R'];

/** Covers of the fingers and the thumb (each on its own bone, so a fist closes inside the glove). */
function fingers(pat: Pattern, color: number): Box[] {
  const out: Box[] = [];
  const zs = [-0.09, -0.043, 0.004, 0.051];
  for (let i = 0; i < 4; i++) {
    // fingers hang below the palm: x 0.32..0.415, y 0.55..0.645, z per finger (front = +z)
    out.push({ bone: `finger_${i + 1}.L`, min: [0.316, 0.545, -zs[i] - 0.043], max: [0.42, 0.65, -zs[i] + 0.004], pat, color, both: true });
  }
  out.push({ bone: 'thumb.L', min: [0.294, 0.6, 0.058], max: [0.382, 0.716, 0.152], pat, color, both: true });
  return out;
}

const STEEL = 0x9aa0aa;
const STEEL_DARK = 0x6a707a;
const BRASS = 0xc8a050;
const LEATHER = 0x7a4e2c;
const LEATHER_DARK = 0x5a3820;
const ROBE = 0x3a4e9a;
const ROBE_DARK = 0x2a3670;
const GOLD = 0xd8b048;

export const ARMOR: Record<ArmorSetId, Record<ArmorSlot, ArmorPiece>> = {
  // ---------------------------------------------------------------- heavy: the guard
  guard: {
    head: {
      // an open-faced helmet: crown, back, cheek plates, nasal bar, a crest
      boxes: [
        { bone: 'head', min: [-0.32, 1.63, -0.34], max: [0.32, 1.86, 0.32], pat: 'plate', color: STEEL },
        { bone: 'head', min: [-0.32, 1.3, -0.34], max: [0.32, 1.64, -0.16], pat: 'plate', color: STEEL },
        { bone: 'head', min: [0.24, 1.32, -0.17], max: [0.32, 1.64, 0.3], pat: 'plate', color: STEEL, both: true },
        { bone: 'head', min: [-0.03, 1.45, 0.2], max: [0.03, 1.66, 0.25], pat: 'metal', color: STEEL_DARK },
        { bone: 'head', min: [-0.035, 1.85, -0.3], max: [0.035, 1.95, 0.26], pat: 'trim', color: 0xb03028 },
      ],
      hides: ['Hair_VoxelShell', 'Ear_L', 'Ear_R'],
    },
    body: {
      // breastplate and backplate, a fauld over the hips, big pauldrons, rerebraces on the arms
      boxes: [
        { bone: 'spine', min: [-0.24, 0.84, -0.16], max: [0.24, 1.27, 0.165], pat: 'plate', color: STEEL },
        { bone: 'spine', min: [-0.1, 1.2, -0.12], max: [0.1, 1.3, 0.13], pat: 'metal', color: STEEL_DARK },
        { bone: 'pelvis', min: [-0.245, 0.64, -0.165], max: [0.245, 0.86, 0.17], pat: 'mail', color: STEEL_DARK },
        { bone: 'pelvis', min: [-0.06, 0.78, 0.165], max: [0.06, 0.86, 0.19], pat: 'metal', color: BRASS },
        { bone: 'upper_arm.L', min: [0.15, 1.14, -0.17], max: [0.38, 1.35, 0.17], pat: 'plate', color: STEEL, both: true },
        { bone: 'upper_arm.L', min: [0.16, 0.95, -0.145], max: [0.405, 1.15, 0.145], pat: 'mail', color: STEEL_DARK, both: true },
      ],
      hides: [...SHIRT, 'Belt', 'Buckle', 'Waist', 'Sleeve_L', 'Sleeve_R', 'Rolled_Cuff_L', 'Rolled_Cuff_R'],
    },
    hands: {
      boxes: [
        { bone: 'forearm.L', min: [0.215, 0.68, -0.122], max: [0.442, 0.97, 0.122], pat: 'plate', color: STEEL, both: true },
        { bone: 'hand.L', min: [0.29, 0.6, -0.105], max: [0.437, 0.74, 0.105], pat: 'plate', color: STEEL_DARK, both: true },
        ...fingers('metal', STEEL_DARK),
      ],
      hides: ['Forearm_L', 'Forearm_R', ...HANDS],
    },
    feet: {
      // cuisses on the thighs, knee cops, greaves, sabatons
      boxes: [
        { bone: 'thigh.L', min: [0.0, 0.5, -0.145], max: [0.285, 0.75, 0.15], pat: 'plate', color: STEEL, both: true },
        { bone: 'thigh.L', min: [0.05, 0.4, 0.06], max: [0.27, 0.53, 0.18], pat: 'metal', color: STEEL_DARK, both: true },
        { bone: 'shin.L', min: [0.05, 0.13, -0.15], max: [0.295, 0.46, 0.15], pat: 'plate', color: STEEL, both: true },
        { bone: 'foot.L', min: [0.032, 0.0, -0.16], max: [0.32, 0.16, 0.235], pat: 'plate', color: STEEL_DARK, both: true },
      ],
      hides: ['Pants_Leg_L', 'Pants_Leg_R', ...BOOTS],
    },
  },
  // ---------------------------------------------------------------- light: the scout
  scout: {
    head: {
      // a leather cap with ear flaps, a metal brow band
      boxes: [
        { bone: 'head', min: [-0.315, 1.58, -0.32], max: [0.315, 1.84, 0.31], pat: 'leather', color: LEATHER },
        { bone: 'head', min: [-0.315, 1.36, -0.32], max: [0.315, 1.6, -0.18], pat: 'leather', color: LEATHER_DARK },
        { bone: 'head', min: [0.23, 1.38, -0.18], max: [0.31, 1.6, 0.08], pat: 'leather', color: LEATHER_DARK, both: true },
        { bone: 'head', min: [-0.32, 1.57, 0.27], max: [0.32, 1.63, 0.325], pat: 'metal', color: STEEL },
      ],
      hides: ['Hair_VoxelShell', 'Ear_L', 'Ear_R'],
    },
    body: {
      // a leather jerkin with metal studs, small shoulder guards, a belt with a buckle
      boxes: [
        { bone: 'spine', min: [-0.23, 0.82, -0.148], max: [0.23, 1.245, 0.152], pat: 'leather', color: LEATHER },
        { bone: 'spine', min: [-0.235, 0.98, 0.15], max: [0.235, 1.04, 0.16], pat: 'trim', color: LEATHER_DARK },
        { bone: 'pelvis', min: [-0.225, 0.77, -0.15], max: [0.225, 0.86, 0.155], pat: 'trim', color: LEATHER_DARK },
        { bone: 'pelvis', min: [-0.045, 0.785, 0.15], max: [0.045, 0.845, 0.175], pat: 'metal', color: BRASS },
        { bone: 'upper_arm.L', min: [0.17, 1.16, -0.15], max: [0.345, 1.29, 0.15], pat: 'leather', color: LEATHER_DARK, both: true },
      ],
      hides: [...SHIRT, 'Belt', 'Buckle'],
    },
    hands: {
      boxes: [
        { bone: 'forearm.L', min: [0.218, 0.68, -0.115], max: [0.44, 0.84, 0.115], pat: 'leather', color: LEATHER_DARK, both: true },
        { bone: 'hand.L', min: [0.293, 0.605, -0.1], max: [0.434, 0.735, 0.1], pat: 'leather', color: LEATHER, both: true },
        ...fingers('leather', LEATHER),
      ],
      hides: HANDS,
    },
    feet: {
      // soft tall boots
      boxes: [
        { bone: 'shin.L', min: [0.06, 0.1, -0.142], max: [0.29, 0.43, 0.142], pat: 'leather', color: LEATHER_DARK, both: true },
        { bone: 'shin.L', min: [0.05, 0.36, -0.15], max: [0.3, 0.43, 0.15], pat: 'trim', color: LEATHER, both: true },
        { bone: 'foot.L', min: [0.036, 0.0, -0.158], max: [0.315, 0.155, 0.215], pat: 'leather', color: LEATHER_DARK, both: true },
      ],
      hides: BOOTS,
    },
  },
  // ---------------------------------------------------------------- magic: the apprentice's robe
  apprentice: {
    head: {
      // a deep hood with a golden hem around the face
      boxes: [
        { bone: 'head', min: [-0.32, 1.6, -0.34], max: [0.32, 1.86, 0.3], pat: 'cloth', color: ROBE },
        { bone: 'head', min: [-0.32, 1.28, -0.34], max: [0.32, 1.62, -0.15], pat: 'cloth', color: ROBE_DARK },
        { bone: 'head', min: [0.235, 1.3, -0.16], max: [0.32, 1.62, 0.28], pat: 'cloth', color: ROBE, both: true },
        { bone: 'head', min: [-0.325, 1.6, 0.27], max: [0.325, 1.65, 0.31], pat: 'trim', color: GOLD },
        { bone: 'head', min: [0.24, 1.3, 0.25], max: [0.325, 1.62, 0.3], pat: 'trim', color: GOLD, both: true },
      ],
      hides: ['Hair_VoxelShell', 'Ear_L', 'Ear_R'],
    },
    body: {
      // the robe: a long coat over the chest, a sash, the skirt panels over the thighs, wide sleeves,
      // a short cape on the back with a gem clasp
      boxes: [
        { bone: 'spine', min: [-0.232, 0.8, -0.15], max: [0.232, 1.25, 0.155], pat: 'cloth', color: ROBE },
        { bone: 'spine', min: [-0.03, 0.8, 0.155], max: [0.03, 1.25, 0.165], pat: 'trim', color: GOLD },
        { bone: 'spine', min: [-0.22, 0.62, -0.18], max: [0.22, 1.24, -0.155], pat: 'cloth', color: ROBE_DARK },
        { bone: 'spine', min: [-0.04, 1.17, 0.155], max: [0.04, 1.24, 0.18], pat: 'gem', color: 0x7ae0ff },
        { bone: 'pelvis', min: [-0.235, 0.74, -0.155], max: [0.235, 0.82, 0.16], pat: 'trim', color: GOLD },
        { bone: 'thigh.L', min: [0.0, 0.3, -0.155], max: [0.285, 0.76, 0.16], pat: 'cloth', color: ROBE, both: true },
        { bone: 'thigh.L', min: [0.0, 0.3, -0.158], max: [0.288, 0.35, 0.163], pat: 'trim', color: GOLD, both: true },
        { bone: 'upper_arm.L', min: [0.16, 0.95, -0.15], max: [0.405, 1.285, 0.15], pat: 'cloth', color: ROBE, both: true },
        { bone: 'forearm.L', min: [0.21, 0.83, -0.14], max: [0.445, 0.97, 0.14], pat: 'cloth', color: ROBE_DARK, both: true },
        { bone: 'forearm.L', min: [0.21, 0.82, -0.142], max: [0.447, 0.85, 0.142], pat: 'trim', color: GOLD, both: true },
      ],
      hides: [...SHIRT, 'Belt', 'Buckle', 'Sleeve_L', 'Sleeve_R', 'Rolled_Cuff_L', 'Rolled_Cuff_R'],
    },
    hands: {
      // cloth wraps on the wrists and light gloves
      boxes: [
        { bone: 'forearm.L', min: [0.22, 0.68, -0.112], max: [0.437, 0.8, 0.112], pat: 'cloth', color: 0xd8ccb0, both: true },
        { bone: 'hand.L', min: [0.294, 0.606, -0.099], max: [0.433, 0.733, 0.099], pat: 'cloth', color: 0xe4d8bc, both: true },
        ...fingers('cloth', 0xe4d8bc),
      ],
      hides: HANDS,
    },
    feet: {
      boxes: [
        { bone: 'shin.L', min: [0.065, 0.1, -0.138], max: [0.285, 0.27, 0.138], pat: 'cloth', color: ROBE_DARK, both: true },
        { bone: 'foot.L', min: [0.038, 0.0, -0.156], max: [0.313, 0.15, 0.225], pat: 'leather', color: 0x4a3a5a, both: true },
      ],
      hides: BOOTS,
    },
  },
};

// ---------------------------------------------------------------- textures

/** Texel size of the armour (metres). */
const TEXEL = 0.028;
const textures = new Map<Pattern, THREE.Texture>();

/** A 16 × 16 grey pattern (multiplied by the box colour): plates, mail, leather, cloth... */
function patternTexture(p: Pattern): THREE.Texture {
  const hit = textures.get(p);
  if (hit) return hit;
  const c = document.createElement('canvas');
  c.width = c.height = 16;
  const g = c.getContext('2d')!;
  const img = g.createImageData(16, 16);
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      const r = hash2(x, y, 31 + p.length);
      let v = 0.9 + r * 0.1;
      switch (p) {
        case 'plate':
          // plates of 8 rows with a lit top edge, a dark seam and rivets
          if (y % 8 === 7) v = 0.62;
          else if (y % 8 === 0) v = 1.08;
          if ((x === 2 || x === 13) && y % 8 === 3) v = 1.15;
          v *= 0.95 + hash2(x >> 2, y >> 3, 3) * 0.08;
          break;
        case 'mail':
          v = (x + (y & 1)) % 2 === 0 ? 1.02 : 0.72;
          if (y % 2 === 1 && x % 2 === 0) v = 0.6;
          break;
        case 'leather':
          v = 0.86 + hash2(x >> 1, y >> 1, 5) * 0.12 + r * 0.05;
          if (x === 1 && y % 3 === 0) v = 1.12;
          if (x === 14 && y % 3 === 1) v = 1.12;
          break;
        case 'cloth':
          v = (x + y) % 4 === 0 ? 0.88 : 0.97 + r * 0.05;
          if (y === 0 || y === 15) v = 0.82;
          break;
        case 'trim':
          v = y % 4 === 0 ? 1.12 : x % 4 === 0 ? 0.85 : 0.98;
          break;
        case 'fur':
          v = 0.75 + r * 0.35;
          break;
        case 'gem':
          v = Math.abs(x - 7.5) + Math.abs(y - 7.5) < 5 ? 1.25 : 0.8;
          break;
        case 'metal':
          v = 0.92 + r * 0.12;
          if (x === y || x === 15 - y) v = 1.1;
          break;
      }
      const k = Math.max(0, Math.min(1, v * 0.85));
      const i = (y * 16 + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = Math.round(k * 255);
      img.data[i + 3] = 255;
    }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.magFilter = t.minFilter = THREE.NearestFilter;
  t.generateMipmaps = false;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  textures.set(p, t);
  return t;
}

/** A box with UVs in texels (the pattern repeats at the body's pixel size). */
function boxGeometry(w: number, h: number, d: number): THREE.BufferGeometry {
  const g = new THREE.BoxGeometry(w, h, d);
  const pos = g.attributes.position;
  const nor = g.attributes.normal;
  const uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const nx = Math.abs(nor.getX(i));
    const ny = Math.abs(nor.getY(i));
    const [u, v] = nx > 0.5 ? [z, y] : ny > 0.5 ? [x, z] : [x, y];
    uv.setXY(i, u / (TEXEL * 16), v / (TEXEL * 16));
  }
  return g;
}

const materials = new Map<string, THREE.Material>();
function material(p: Pattern, color: number): THREE.Material {
  const key = p + color;
  let m = materials.get(key);
  if (!m) {
    m = new THREE.MeshLambertMaterial({ map: patternTexture(p), color, emissive: p === 'gem' ? 0x2a6a80 : 0x000000 });
    materials.set(key, m);
  }
  return m;
}

/**
 * Builds the meshes of a piece, each with the bone it rides on and its offset from that bone's
 * head at rest (the model adds them as children of the bones).
 */
export function armorMeshes(set: ArmorSetId, slot: ArmorSlot, shadows: boolean): { bone: string; mesh: THREE.Mesh }[] {
  const piece = ARMOR[set][slot];
  const out: { bone: string; mesh: THREE.Mesh }[] = [];
  const add = (bone: string, min: [number, number, number], max: [number, number, number], b: Box) => {
    const w = max[0] - min[0];
    const h = max[1] - min[1];
    const d = max[2] - min[2];
    const m = new THREE.Mesh(boxGeometry(w, h, d), material(b.pat, b.color));
    const head = boneHead(bone);
    m.position.set((min[0] + max[0]) / 2 - head.x, (min[1] + max[1]) / 2 - head.y, (min[2] + max[2]) / 2 - head.z);
    m.castShadow = shadows;
    out.push({ bone, mesh: m });
  };
  for (const b of piece.boxes) {
    add(b.bone, b.min, b.max, b);
    if (b.both) add(b.bone.replace('.L', '.R'), [-b.max[0], b.min[1], b.min[2]], [-b.min[0], b.max[1], b.max[2]], b);
  }
  return out;
}

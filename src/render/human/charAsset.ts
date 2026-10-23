import * as THREE from 'three';
import data from '../../assets/character.json';
import texUrl from '../../assets/character.png';
import { separateCoplanar } from './coplanar';

/**
 * The owner's character (Character.blend, converted by tools/assets/convert_character.py):
 * 27 bones and 45 rigid parts, each bound to one bone (the trousers to the thigh above the knee
 * and the shin below it), on one pixel atlas. Metres, y up, the model faces +z, its left is +x.
 */
export interface BoneDef {
  name: string;
  parent: string | null;
  head: [number, number, number];
  tail: [number, number, number];
}
interface PartDef {
  name: string;
  pos: number[];
  uv: number[];
  bone: number[];
  idx: number[];
}

export const BONES = (data as unknown as { bones: BoneDef[] }).bones;
const RAW_PARTS = (data as unknown as { parts: PartDef[] }).parts;

/**
 * The hair shell lies in places a fraction of a millimetre over the head and the ears, facing the
 * same way: the depth test flipped between them pixel by pixel (the shimmer of the hair). Its faces
 * there are lifted to a clear gap, and overlapping coplanar hair faces get distinct layers.
 */
function fixHair(parts: PartDef[]): PartDef[] {
  const fixedNames = ['Head', 'Ear_L', 'Ear_R'];
  const pos: number[] = [];
  const idx: number[] = [];
  for (const p of parts)
    if (fixedNames.includes(p.name)) {
      const o = pos.length / 3;
      pos.push(...p.pos);
      for (const i of p.idx) idx.push(i + o);
    }
  return parts.map((p) => (p.name === 'Hair_VoxelShell' ? { ...p, ...separateCoplanar(p, { pos, idx }) } : p));
}
export const PARTS = fixHair(RAW_PARTS);
export const BONE_INDEX: Record<string, number> = Object.fromEntries(BONES.map((b, i) => [b.name, i]));
export const PART_INDEX: Record<string, number> = Object.fromEntries(PARTS.map((p, i) => [p.name, i]));

export const boneHead = (name: string) => new THREE.Vector3(...BONES[BONE_INDEX[name]].head);
export const boneTail = (name: string) => new THREE.Vector3(...BONES[BONE_INDEX[name]].tail);
export const boneLength = (name: string) => boneHead(name).distanceTo(boneTail(name));

let geo: THREE.BufferGeometry | null = null;

/**
 * The whole body as one skinned geometry with a draw group per part (so parts under armour can be
 * hidden by their group's material). Shared by every character; colours per part come from a
 * per-vertex `color` the model fills (NPC variants).
 */
export function characterGeometry(): THREE.BufferGeometry {
  if (geo) return geo;
  let nv = 0;
  let ni = 0;
  for (const p of PARTS) {
    nv += p.pos.length / 3;
    ni += p.idx.length;
  }
  const pos = new Float32Array(nv * 3);
  const uv = new Float32Array(nv * 2);
  const si = new Uint16Array(nv * 4);
  const sw = new Float32Array(nv * 4);
  const part = new Float32Array(nv);
  const idx = new Uint32Array(ni);
  const g = new THREE.BufferGeometry();
  let v0 = 0;
  let i0 = 0;
  PARTS.forEach((p, pi) => {
    const n = p.pos.length / 3;
    pos.set(p.pos, v0 * 3);
    uv.set(p.uv, v0 * 2);
    for (let k = 0; k < n; k++) {
      si[(v0 + k) * 4] = p.bone[k];
      sw[(v0 + k) * 4] = 1;
      part[v0 + k] = pi;
    }
    for (let k = 0; k < p.idx.length; k++) idx[i0 + k] = p.idx[k] + v0;
    g.addGroup(i0, p.idx.length, pi);
    v0 += n;
    i0 += p.idx.length;
  });
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si, 4));
  g.setAttribute('skinWeight', new THREE.BufferAttribute(sw, 4));
  g.setAttribute('aPart', new THREE.BufferAttribute(part, 1));
  g.setIndex(new THREE.BufferAttribute(idx, 1));
  g.computeVertexNormals();
  g.computeBoundingSphere();
  geo = g;
  return g;
}

let tex: THREE.Texture | null = null;

/**
 * The character's pixel atlas: nearest filtering close up (every texel a crisp square); far away,
 * where a texel is smaller than a screen pixel, mipmaps average the texels (without them the fine
 * hair and cloth pixels sparkle as the figure moves).
 */
export function characterTexture(): THREE.Texture {
  if (tex) return tex;
  const t = new THREE.TextureLoader().load(texUrl);
  t.magFilter = THREE.NearestFilter;
  t.minFilter = THREE.NearestMipmapLinearFilter;
  t.generateMipmaps = true;
  t.anisotropy = 4;
  t.colorSpace = THREE.SRGBColorSpace;
  t.flipY = true;
  tex = t;
  return t;
}

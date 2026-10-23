import * as THREE from 'three';
import type { WeaponKind } from '../../rpg/items';
import { clump, limb, pushV, smoothOut, toGeometry, type SmoothOut } from '../smoothModels';

type V3 = [number, number, number];

/**
 * Weapon models (owner: proportionate, detailed, no longer flat pixel items): smooth low-poly
 * pieces in metres, vertex coloured — bevelled steel blades with honed edges, leather-wrapped
 * grips, gold fittings, turned wood. Realistic sizes next to the 1.8-block hero.
 */
const STEEL = 0xc9cfd8, STEEL_HI = 0xeef2f6, STEEL_DK = 0x6e7684;
const GOLD = 0xc99a3a, GOLD_DK = 0x8a6424;
const LEATHER = 0x5a3822, LEATHER_DK = 0x3a2416;
const WOOD = 0x8a5a30, WOOD_DK = 0x5a3a1e, WOOD_LT = 0xa8763e;
const cc = (hex: number) => () => hex;

/** A rod along Y (or between two points), capped, with a constant colour. */
function rod(o: SmoothOut, a: V3, b: V3, ra: number, rb: number, hex: number, sides = 10, rings = 1, wobble?: (t: number) => [number, number]) {
  limb(o, a, b, ra, rb, sides, rings, cc(hex), 1, true, wobble);
}
function knob(o: SmoothOut, at: V3, r: V3, hex: number, sub = 1) {
  clump(o, at, r, sub, () => 1, cc(hex), 1);
}
/** A leather wrap: slightly bulging bands over a handle from y0 to y1. */
function wrap(o: SmoothOut, y0: number, y1: number, r: number, n: number) {
  const h = (y1 - y0) / n;
  for (let i = 0; i < n; i++) rod(o, [0, y0 + i * h, 0], [0, y0 + (i + 1) * h, 0], r * 0.96, r * 1.04, i % 2 ? LEATHER : LEATHER_DK, 10, 1);
}

/**
 * A bevelled blade lofted along +Y: each section gives its height, half width (along Z, the
 * edge) and half thickness (along X, the flat side faces ±X). Flat facets: two broad faces and
 * four brighter honed bevels. The last section with width 0 makes the point.
 */
function blade(o: SmoothOut, secs: { y: number; w: number; t: number }[], body = STEEL, edge = STEEL_HI) {
  // hexagonal section: edge, bevel shoulders, opposite edge
  const pts = (s: { y: number; w: number; t: number }): V3[] => [
    [0, s.y, s.w], [s.t, s.y, s.w * 0.62], [s.t, s.y, -s.w * 0.62],
    [0, s.y, -s.w], [-s.t, s.y, -s.w * 0.62], [-s.t, s.y, s.w * 0.62],
  ];
  for (let i = 0; i + 1 < secs.length; i++) {
    const A = pts(secs[i]), B = pts(secs[i + 1]);
    for (let f = 0; f < 6; f++) {
      const g = (f + 1) % 6;
      const a = A[f], b = A[g], c = B[g], d = B[f];
      // facet normal
      const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
      const vx = d[0] - a[0], vy = d[1] - a[1], vz = d[2] - a[2];
      let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      if (Math.hypot(nx, ny, nz) < 1e-9) { const wx = c[0] - b[0], wy = c[1] - b[1], wz = c[2] - b[2]; nx = uy * wz - uz * wy; ny = uz * wx - ux * wz; nz = ux * wy - uy * wx; }
      const mid = [(a[0] + c[0]) / 2, (a[2] + c[2]) / 2];
      if (nx * mid[0] + nz * mid[1] < 0) { nx = -nx; ny = -ny; nz = -nz; }
      const broad = f === 1 || f === 4;
      const hex = broad ? body : edge;
      const k = broad ? 1 : 1.04;
      const i0 = pushV(o, ...a, nx, ny, nz, hex, k, 1);
      const i1 = pushV(o, ...b, nx, ny, nz, hex, k, 1);
      const i2 = pushV(o, ...c, nx, ny, nz, hex, k, 1);
      const i3 = pushV(o, ...d, nx, ny, nz, hex, k, 1);
      o.idx.push(i0, i1, i2, i0, i2, i3, i0, i2, i1, i0, i3, i2);
    }
  }
  // a darker fuller groove down the middle of both faces (thin inset strips)
}

/** A flat board from a 2D outline (x, y), `thick` deep along Z with a domed front (+Z). */
function board(o: SmoothOut, outline: [number, number][], thick: number, dome: number, front: (x: number, y: number) => number, back: number, side: number) {
  const n = outline.length;
  let R = 0;
  for (const [x, y] of outline) R = Math.max(R, Math.hypot(x, y));
  const zf = (x: number, y: number) => thick / 2 + dome * (1 - Math.min(1, (x * x + y * y) / (R * R)));
  // front: rings from the centre outward for a smooth dome
  const RINGS = 5;
  const base = o.pos.length / 3;
  const c0 = pushV(o, 0, 0, zf(0, 0), 0, 0, 1, front(0, 0), 1, 1);
  for (let r = 1; r <= RINGS; r++)
    for (let i = 0; i < n; i++) {
      const x = outline[i][0] * r / RINGS, y = outline[i][1] * r / RINGS;
      const sl = (2 * dome) / (R * R);
      pushV(o, x, y, zf(x, y), x * sl, y * sl, 1, front(x, y), 1, 1);
    }
  const at = (r: number, i: number) => (r === 0 ? c0 : base + 1 + (r - 1) * n + (i % n));
  for (let i = 0; i < n; i++) o.idx.push(c0, at(1, i), at(1, i + 1));
  for (let r = 1; r < RINGS; r++)
    for (let i = 0; i < n; i++) o.idx.push(at(r, i), at(r + 1, i), at(r + 1, i + 1), at(r, i), at(r + 1, i + 1), at(r, i + 1));
  // back: a flat fan
  const bc = pushV(o, 0, 0, -thick / 2, 0, 0, -1, back, 0.85, 1);
  const bb = o.pos.length / 3;
  for (const [x, y] of outline) pushV(o, x, y, -thick / 2, 0, 0, -1, back, 0.85, 1);
  for (let i = 0; i < n; i++) o.idx.push(bc, bb + ((i + 1) % n), bb + i);
  // the rim wall
  for (let i = 0; i < n; i++) {
    const [x0, y0] = outline[i], [x1, y1] = outline[(i + 1) % n];
    const nx = y1 - y0, ny = -(x1 - x0);
    const a = pushV(o, x0, y0, -thick / 2, nx, ny, 0, side, 1, 1);
    const b = pushV(o, x1, y1, -thick / 2, nx, ny, 0, side, 1, 1);
    const c = pushV(o, x1, y1, zf(x1, y1), nx, ny, 0, side, 1, 1);
    const d = pushV(o, x0, y0, zf(x0, y0), nx, ny, 0, side, 1, 1);
    o.idx.push(a, b, c, a, c, d);
  }
}

function geoOf(build: (o: SmoothOut) => void): THREE.BufferGeometry {
  const o = smoothOut();
  build(o);
  return toGeometry(o, false);
}

let itemMat: THREE.MeshLambertMaterial | null = null;
export function itemMaterial(): THREE.MeshLambertMaterial {
  return (itemMat ??= new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide }));
}
let glowMat: THREE.MeshBasicMaterial | null = null;
let haloMat: THREE.MeshBasicMaterial | null = null;

function meshOf(geo: THREE.BufferGeometry): THREE.Mesh {
  const m = new THREE.Mesh(geo, itemMaterial());
  m.castShadow = true;
  return m;
}

// ------------------------------------------------------------------ the weapons

function sword1h(o: SmoothOut) {
  knob(o, [0, -0.135, 0], [0.026, 0.03, 0.026], GOLD, 2);
  rod(o, [0, -0.115, 0], [0, -0.1, 0], 0.016, 0.019, GOLD_DK);
  wrap(o, -0.1, 0.055, 0.0165, 6);
  // crossguard: a gold bar with rounded quillon ends, a small langet over the blade
  rod(o, [0, 0.07, -0.115], [0, 0.07, 0.115], 0.012, 0.012, GOLD, 8);
  knob(o, [0, 0.072, -0.12], [0.017, 0.02, 0.017], GOLD);
  knob(o, [0, 0.072, 0.12], [0.017, 0.02, 0.017], GOLD);
  knob(o, [0, 0.07, 0], [0.02, 0.024, 0.03], GOLD_DK);
  blade(o, [
    { y: 0.075, w: 0.03, t: 0.008 }, { y: 0.12, w: 0.028, t: 0.0075 }, { y: 0.6, w: 0.025, t: 0.0065 },
    { y: 0.86, w: 0.02, t: 0.005 }, { y: 0.96, w: 0.0, t: 0.0015 },
  ]);
}

function sword2h(o: SmoothOut) {
  knob(o, [0, -0.33, 0], [0.032, 0.036, 0.032], GOLD, 2);
  wrap(o, -0.305, 0.07, 0.019, 10);
  rod(o, [0, 0.07, 0], [0, 0.085, 0], 0.024, 0.026, GOLD_DK);
  // a long straight guard bending slightly forward at the tips
  rod(o, [0, 0.095, -0.17], [0, 0.095, 0.17], 0.014, 0.014, STEEL_DK, 8, 4, (t) => [0, 0]);
  knob(o, [0, 0.105, -0.18], [0.02, 0.026, 0.02], GOLD);
  knob(o, [0, 0.105, 0.18], [0.02, 0.026, 0.02], GOLD);
  knob(o, [0, 0.095, 0], [0.024, 0.03, 0.036], GOLD);
  // ricasso (blunt, darker) then the long blade
  blade(o, [{ y: 0.1, w: 0.03, t: 0.01 }, { y: 0.2, w: 0.03, t: 0.01 }], STEEL_DK, STEEL);
  knob(o, [0, 0.2, 0], [0.012, 0.012, 0.05], STEEL_DK);
  blade(o, [
    { y: 0.2, w: 0.04, t: 0.0095 }, { y: 0.9, w: 0.036, t: 0.008 }, { y: 1.25, w: 0.028, t: 0.0065 },
    { y: 1.4, w: 0.0, t: 0.002 },
  ]);
}

function spear(o: SmoothOut) {
  // a long ash shaft with an iron butt cap, two leather grips, a socket and a leaf head
  rod(o, [0, -1.0, 0], [0, 1.32, 0], 0.019, 0.016, WOOD, 8, 6, (t) => [Math.sin(t * 9) * 0.002, 0]);
  rod(o, [0, -1.04, 0], [0, -0.95, 0], 0.016, 0.022, STEEL_DK, 8);
  wrap(o, -0.12, 0.12, 0.021, 6);
  wrap(o, 0.3, 0.52, 0.0195, 5);
  rod(o, [0, 1.3, 0], [0, 1.42, 0], 0.024, 0.017, STEEL_DK, 8);
  rod(o, [0, 1.31, 0], [0, 1.33, 0], 0.026, 0.026, GOLD, 8);
  blade(o, [
    { y: 1.41, w: 0.012, t: 0.012 }, { y: 1.47, w: 0.045, t: 0.011 }, { y: 1.55, w: 0.04, t: 0.009 },
    { y: 1.66, w: 0.0, t: 0.003 },
  ]);
}

/** A staff: gnarled shaft, gold bands, three claws holding a glowing crystal at `top`. */
function staff(o: SmoothOut, y0: number, top: number, r: number): number {
  const twist = (t: number): [number, number] => [Math.sin(t * 7.3) * r * 0.25, Math.cos(t * 5.1) * r * 0.25];
  rod(o, [0, y0, 0], [0, top, 0], r * 0.85, r * 1.1, WOOD_DK, 8, 10, twist);
  knob(o, [0, y0, 0], [r * 1.15, r * 1.3, r * 1.15], GOLD_DK);
  wrap(o, -0.1, 0.12, r * 1.18, 5);
  for (const y of [0.16, top - 0.06]) rod(o, [0, y, 0], [0, y + 0.025, 0], r * 1.3, r * 1.3, GOLD, 10);
  knob(o, [0, top + 0.01, 0], [r * 1.6, r * 1.1, r * 1.6], WOOD_LT);
  // claws curving up and in around the crystal
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    const cx = Math.cos(a), cz = Math.sin(a);
    rod(o, [cx * r, top, cz * r], [cx * r * 2.6, top + 0.07, cz * r * 2.6], r * 0.42, r * 0.3, GOLD, 6);
    rod(o, [cx * r * 2.6, top + 0.07, cz * r * 2.6], [cx * r * 1.3, top + 0.15, cz * r * 1.3], r * 0.3, r * 0.12, GOLD, 6);
  }
  return top + 0.085;
}

function crystal(root: THREE.Group, geos: THREE.BufferGeometry[], y: number, size: number) {
  const g = new THREE.OctahedronGeometry(size, 0);
  g.scale(0.8, 1.45, 0.8);
  geos.push(g);
  const m = new THREE.Mesh(g, (glowMat ??= new THREE.MeshBasicMaterial({ color: 0x8fe0ff })));
  m.position.y = y;
  m.rotation.y = 0.4;
  root.add(m);
  const h = new THREE.SphereGeometry(size * 2.1, 12, 8);
  geos.push(h);
  const halo = new THREE.Mesh(h, (haloMat ??= new THREE.MeshBasicMaterial({ color: 0x4ab8ff, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false })));
  halo.position.y = y;
  root.add(halo);
}

/** Bow limbs (grip at the origin, up +Y, the string side −Z), recurved tips with horn nocks. */
function bowLimbs(o: SmoothOut) {
  const H = 0.6;
  const curve = (t: number) => -0.28 * Math.pow(t, 1.6) + 0.05 * Math.pow(t, 6); // z of the limb
  for (const sgn of [1, -1]) {
    const tipY = sgn > 0 ? H : -H + 0.04;
    const N = 9;
    for (let i = 0; i < N; i++) {
      const t0 = i / N, t1 = (i + 1) / N;
      const w0 = 0.022 - 0.013 * t0, w1 = 0.022 - 0.013 * t1;
      rod(o, [0, sgn * 0.07 + (tipY - sgn * 0.07) * t0, curve(t0)], [0, sgn * 0.07 + (tipY - sgn * 0.07) * t1, curve(t1)], w0, w1, i % 3 === 2 ? WOOD_DK : WOOD, 8, 1);
    }
    knob(o, [0, tipY, curve(1)], [0.012, 0.022, 0.012], 0xe8dcc0);
  }
  // the riser and a leather grip wrap, an arrow shelf
  rod(o, [0, -0.09, 0.004], [0, 0.09, 0.004], 0.024, 0.024, WOOD_DK, 10);
  wrap(o, -0.06, 0.06, 0.027, 4);
  knob(o, [0.03, 0.072, 0], [0.01, 0.012, 0.02], GOLD);
}
/**
 * Held weapon model. The returned group has the grip at its origin with the business end along
 * +Y and the flat side facing ±X (so it can be laid into a hand). The crossbow carries two
 * states (loaded/empty) switched with `setState`; the bow has a geometric string and a nocked
 * arrow driven by `setDraw`.
 */
export interface WeaponModel {
  root: THREE.Group;
  setState(k: 'loaded' | 'empty'): void;
  /**
   * Bow only: `nock` is the string's nock point in the weapon's local space (null = straight
   * string at rest), `arrow` shows the nocked arrow, `flex` 0..1 bends the limbs a little.
   */
  setDraw(nock: THREE.Vector3 | null, arrow: boolean, flex: number): void;
  dispose(): void;
}

/** Bow string anchors in the bow's local space (grip at the origin, forward +Z, up +Y). */
export const BOW_TIP_TOP = new THREE.Vector3(0, 0.6, -0.23);
export const BOW_TIP_BOTTOM = new THREE.Vector3(0, -0.56, -0.23);
/** Where the arrow shaft rests: on top of the grip (the bow is held level, its +X up). */
export const BOW_ARROW_REST = new THREE.Vector3(0.04, 0.072, 0);
const ARROW_NOCK = 0.3; // distance from the arrow model's origin back to its nock
let stringMat: THREE.MeshLambertMaterial | null = null;

export function weaponModel(kind: WeaponKind): WeaponModel {
  const root = new THREE.Group();
  const geos: THREE.BufferGeometry[] = [];
  const add = (geo: THREE.BufferGeometry) => {
    geos.push(geo);
    const m = meshOf(geo);
    root.add(m);
    return m;
  };
  let setState: WeaponModel['setState'] = () => {};
  let setDraw: WeaponModel['setDraw'] = () => {};
  if (kind === 'sword1h') add(geoOf(sword1h));
  else if (kind === 'sword2h') add(geoOf(sword2h));
  else if (kind === 'spear') add(geoOf(spear));
  else if (kind === 'staff1h') {
    let y = 0;
    add(geoOf((o) => (y = staff(o, -0.32, 0.62, 0.017))));
    crystal(root, geos, y, 0.034);
  } else if (kind === 'staff2h') {
    let y = 0;
    add(geoOf((o) => (y = staff(o, -0.78, 1.22, 0.021))));
    crystal(root, geos, y, 0.05);
  } else if (kind === 'bow') {
    const limbs = add(geoOf(bowLimbs));
    // the string: two thin segments from the limb tips to the nock point
    const segGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 5);
    geos.push(segGeo);
    const smat = (stringMat ??= new THREE.MeshLambertMaterial({ color: 0xf0ece0 }));
    const segs = [0, 1].map(() => {
      const m = new THREE.Mesh(segGeo, smat);
      m.castShadow = true;
      root.add(m);
      return m;
    });
    // the nocked arrow (the same model as the flying projectile, +Z forward)
    const arrowGeo = arrowModel(false);
    geos.push(arrowGeo);
    const arrow = meshOf(arrowGeo);
    arrow.visible = false;
    root.add(arrow);
    const top = new THREE.Vector3();
    const bot = new THREE.Vector3();
    const rest = new THREE.Vector3();
    const dir = new THREE.Vector3();
    const Z = new THREE.Vector3(0, 0, 1);
    const Y = new THREE.Vector3(0, 1, 0);
    const T = 0.006;
    const seg = (m: THREE.Mesh, a: THREE.Vector3, b: THREE.Vector3) => {
      dir.subVectors(b, a);
      const len = dir.length();
      m.position.addVectors(a, b).multiplyScalar(0.5);
      m.quaternion.setFromUnitVectors(Y, dir.multiplyScalar(1 / (len || 1)));
      m.scale.set(T, len, T);
    };
    setDraw = (nock, showArrow, flex) => {
      // flexing limbs: the tips come back and in a little
      const f = Math.max(0, Math.min(1, flex));
      limbs.scale.set(1, 1 - 0.05 * f, 1 + 0.25 * f);
      top.copy(BOW_TIP_TOP).multiply(limbs.scale);
      bot.copy(BOW_TIP_BOTTOM).multiply(limbs.scale);
      rest.lerpVectors(top, bot, 0.5);
      rest.y = BOW_ARROW_REST.y;
      // the string never sits in front of its straight line (the hand can only pull it back)
      const n = nock && nock.z < rest.z ? nock : rest;
      seg(segs[0], top, n);
      seg(segs[1], n, bot);
      arrow.visible = showArrow;
      if (showArrow) {
        dir.subVectors(BOW_ARROW_REST, n).normalize();
        arrow.quaternion.setFromUnitVectors(Z, dir);
        arrow.position.copy(n).addScaledVector(dir, ARROW_NOCK);
      }
    };
    setDraw(null, false, 0);
  } else if (kind === 'crossbow') {
    // stock along +Y (forward) with the grip at the origin, the prod across ±X at the front,
    // the bolt groove on the −Z side (up when aimed), trigger and grip on +Z
    // the model is built with the stock along +Y, then turned so it lies along +Z: the stock
    // follows the forearm out of the fist (the same frame the hold and reload poses expect)
    const body = add(geoOf(crossbowBody));
    const string = (loaded: boolean) =>
      add(geoOf((o) => {
        const back = loaded ? 0.12 : 0.36;
        for (const s of [-1, 1]) rod(o, [s * 0.27, 0.4, -0.02], [0, back, -0.03], 0.003, 0.003, 0xe8e2d0, 4);
        if (loaded) {
          rod(o, [0, back, -0.045], [0, 0.5, -0.045], 0.0055, 0.0055, WOOD_DK, 6);
          blade(o, [{ y: 0.5, w: 0.011, t: 0.011 }, { y: 0.56, w: 0, t: 0.002 }], STEEL_DK, STEEL);
          for (const z of [-1, 1]) knob(o, [0, back + 0.03, -0.045 + z * 0.012], [0.002, 0.03, 0.01], 0x3f68b8, 0);
        }
      }));
    const loaded = string(true);
    const empty = string(false);
    empty.visible = false;
    for (const m of [body, loaded, empty]) m.rotation.x = Math.PI / 2;
    setState = (k) => {
      loaded.visible = k !== 'empty';
      empty.visible = k === 'empty';
    };
  }
  return {
    root,
    setState,
    setDraw,
    dispose: () => geos.forEach((g) => g.dispose()),
  };
}

function crossbowBody(o: SmoothOut) {
  // the tiller (stock) with a butt sloping back, a steel trigger and a gold-banded nose
  rod(o, [0, -0.3, 0.02], [0, 0.44, -0.01], 0.032, 0.026, WOOD, 8, 3);
  rod(o, [0, -0.3, 0.025], [0, -0.42, 0.06], 0.036, 0.042, WOOD_DK, 8);
  knob(o, [0, 0.12, -0.03], [0.012, 0.3, 0.008], WOOD_DK); // bolt groove rail
  rod(o, [0, 0.0, 0.03], [0, -0.03, 0.09], 0.005, 0.004, STEEL_DK, 6); // trigger lever
  wrap(o, -0.07, 0.07, 0.034, 4);
  rod(o, [0, 0.38, 0], [0, 0.42, 0], 0.036, 0.036, GOLD, 8);
  rod(o, [0, 0.12, 0], [0, 0.14, 0], 0.035, 0.035, STEEL_DK, 8); // the nut that holds the string
  // the prod: two steel limbs swept slightly forward to their tips
  for (const s of [-1, 1]) {
    rod(o, [0, 0.42, -0.02], [s * 0.16, 0.44, -0.02], 0.013, 0.011, STEEL_DK, 8);
    rod(o, [s * 0.16, 0.44, -0.02], [s * 0.27, 0.41, -0.02], 0.011, 0.008, STEEL, 8);
    knob(o, [s * 0.275, 0.405, -0.02], [0.01, 0.01, 0.01], GOLD);
  }
  // the stirrup loop at the nose
  for (const s of [-1, 1]) rod(o, [s * 0.03, 0.45, -0.01], [s * 0.035, 0.53, -0.01], 0.005, 0.005, STEEL_DK, 6);
  rod(o, [-0.035, 0.53, -0.01], [0.035, 0.53, -0.01], 0.005, 0.005, STEEL_DK, 6);
}

/** The shield: a heater shield, oak boards under a painted face, steel rim and gold boss; front +Z. */
export function shieldModel(): { root: THREE.Group; dispose(): void } {
  const W = 0.29, TOP = 0.34, BOT = -0.36;
  const outline: [number, number][] = [];
  // flat-ish top edge, straight upper sides, curving down to a point
  const N = 28;
  for (let i = 0; i <= N; i++) outline.push([-W + (2 * W * i) / N, TOP - 0.02 * Math.sin((Math.PI * i) / N)]);
  for (let i = 1; i <= 14; i++) {
    const t = i / 14;
    outline.push([W * Math.cos(t * Math.PI * 0.5) ** 0.7 * (1 - t * 0.02), TOP - 0.1 - t * (TOP - 0.1 - BOT)]);
  }
  for (let i = 13; i >= 1; i--) {
    const t = i / 14;
    outline.push([-W * Math.cos(t * Math.PI * 0.5) ** 0.7 * (1 - t * 0.02), TOP - 0.1 - t * (TOP - 0.1 - BOT)]);
  }
  outline.reverse(); // counter-clockwise seen from the front
  const geo = geoOf((o) => {
    const face = (x: number, y: number) => {
      // a deep blue field with a gold chevron and the oak showing at the edge
      const ch = Math.abs(y - (0.05 - Math.abs(x) * 0.9)) < 0.045;
      return ch ? GOLD : 0x2c4a86;
    };
    board(o, outline, 0.03, 0.035, face, WOOD, STEEL_DK);
    // steel rim: rods along the outline just proud of the face
    for (let i = 0; i < outline.length; i++) {
      const [x0, y0] = outline[i], [x1, y1] = outline[(i + 1) % outline.length];
      rod(o, [x0, y0, 0.012], [x1, y1, 0.012], 0.012, 0.012, i % 2 ? STEEL : STEEL_DK, 6);
    }
    knob(o, [0, 0.06, 0.05], [0.055, 0.055, 0.035], GOLD, 2);
    knob(o, [0, 0.06, 0.08], [0.018, 0.018, 0.012], GOLD_DK, 1);
    // back: the arm straps
    for (const y of [0.12, -0.08]) rod(o, [-0.12, y, -0.02], [0.12, y, -0.02], 0.012, 0.012, LEATHER, 6);
  });
  const root = new THREE.Group();
  root.add(meshOf(geo));
  return { root, dispose: () => geo.dispose() };
}

// ---------------------------------------------------------------- projectiles

/** Arrow / bolt model pointing along +Z (shaft, steel head, fletching). */
export function arrowModel(bolt: boolean): THREE.BufferGeometry {
  const L = bolt ? 0.22 : 0.3;
  return geoOf((o) => {
    rod(o, [0, 0, -L], [0, 0, L - 0.04], 0.0055, 0.0055, bolt ? WOOD_DK : WOOD_LT, 6);
    // the head: a narrow bodkin/leaf point
    rod(o, [0, 0, L - 0.05], [0, 0, L - 0.035], 0.008, 0.008, STEEL_DK, 6);
    rod(o, [0, 0, L - 0.04], [0, 0, L + 0.03], 0.012, 0.0005, STEEL, 4);
    // three vanes at the back
    const fl = bolt ? 0x3f68b8 : 0xeeeae2;
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      const x = Math.cos(a) * 0.012, y = Math.sin(a) * 0.012;
      knob(o, [x, y, -L + (bolt ? 0.04 : 0.06)], [Math.abs(Math.cos(a)) * 0.01 + 0.002, Math.abs(Math.sin(a)) * 0.01 + 0.002, bolt ? 0.035 : 0.055], fl, 1);
    }
    rod(o, [0, 0, -L - 0.008], [0, 0, -L + 0.006], 0.007, 0.007, 0x2a2a2a, 6);
  });
}

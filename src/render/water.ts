import * as THREE from 'three';
import { isWater, type Terrain } from '../game/Terrain';
import { GLSL_NOISE } from './glsl';

/**
 * Water as its own see-through layer over the ground. The ground mesh draws the beds (sand,
 * gravel, mud) at their real depth; this layer draws the surfaces, the falling sheets of the
 * waterfalls and the spray at their feet. Colour and opacity follow the depth under each pixel
 * (bilinear across cells), so a shallow bed shows clearly, a normal one in part, deep water
 * hardly at all. Nine kinds of water:
 *
 *  0 обычная (plain river), 1 глубокая (deep: lakes and the sea past ~2.5 blocks),
 *  2 мелкая (shallow: any water under ~0.5 block), 3 быстрая река (rapids), 4 водопад,
 *  5 спокойное озеро, 6 болото, 7 морская, 8 замёрзшая (ice, drawn by the ground shader).
 *
 * Kinds 1 and 2 are depth bands blended smoothly into the body they belong to; the body (river,
 * rapids, lake, swamp, sea) comes from the cell's tile.
 */
export const WATER = {
  plain: 0,
  deep: 1,
  shallow: 2,
  fast: 3,
  fall: 4,
  lake: 5,
  swamp: 6,
  sea: 7,
  frozen: 8,
} as const;

/** Body kind of a water tile (`water_<type>_<depth>`). */
export function waterBody(name: string): number {
  const ty = /^water_([a-z]+)/.exec(name)?.[1] ?? '';
  if (ty === 'sea') return WATER.sea;
  if (ty === 'lake' || ty === 'lagoon') return WATER.lake;
  if (ty === 'swamp') return WATER.swamp;
  if (ty === 'fast' || ty === 'mountain') return WATER.fast;
  return WATER.plain;
}

/** Ground tile under each kind of water (a name the map has, or null). */
export function bedTileName(name: string, names: string[]): string | null {
  const body = waterBody(name);
  const want = body === WATER.sea ? ['sand', 'gravel'] : body === WATER.lake ? ['sand', 'clay', 'gravel'] : body === WATER.swamp ? ['clay', 'grass_lush'] : body === WATER.fast ? ['stone', 'gravel'] : ['gravel', 'sand'];
  for (const w of want) if (names.includes(w)) return w;
  return names.find((n) => /sand|gravel|stone|dirt/.test(n)) ?? null;
}

/** Drop (blocks) between neighbouring water surfaces that makes a falling sheet. */
const FALL_MIN = 0.3;

/**
 * Per-cell water data for the shaders: `lin` (bilinear) holds depth * 32, waterfall churn and the
 * flow vector; `body` (nearest) the body kind + 1 (0 = dry).
 */
export function waterTextures(t: Terrain, level: Float32Array) {
  const n = t.size;
  const lin = new Uint8Array(n * n * 4);
  const body = new Uint8Array(n * n);
  const kinds = t.tileNames.map(waterBody);
  const churn = new Float32Array(n * n);
  for (let i = 0; i < n * n; i++) {
    if (!isWater(t.cell[i])) continue;
    const x = i % n;
    const z = (i / n) | 0;
    // the foot of a fall: a neighbour's surface well above this one
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const ax = x + dx;
      const az = z + dz;
      if (ax < 0 || az < 0 || ax >= n || az >= n) continue;
      const j = az * n + ax;
      if (isWater(t.cell[j]) && level[j] - level[i] >= FALL_MIN) churn[i] = Math.max(churn[i], Math.min(1, 0.45 + (level[j] - level[i]) * 0.25));
    }
  }
  for (let i = 0; i < n * n; i++) {
    const c = t.cell[i];
    if (!isWater(c)) continue;
    const bed = t.top ? t.top[i] : level[i] - 1;
    lin[i * 4] = Math.max(1, Math.min(255, Math.round((level[i] - bed) * 32)));
    lin[i * 4 + 1] = Math.round(churn[i] * 255);
    const f = t.flow ? t.flow[i] : 0;
    if (f) {
      const a = (f / 256) * Math.PI * 2;
      lin[i * 4 + 2] = Math.round(128 + Math.cos(a) * 127);
      lin[i * 4 + 3] = Math.round(128 + Math.sin(a) * 127);
    } else lin[i * 4 + 2] = lin[i * 4 + 3] = 128;
    body[i] = kinds[t.tile[i]] + 1;
  }
  // dry cells next to the water: no depth, but the flow of the water beside them (smooth edges)
  for (let i = 0; i < n * n; i++) {
    if (body[i]) continue;
    lin[i * 4 + 2] = lin[i * 4 + 3] = 128;
  }
  const linTex = new THREE.DataTexture(lin, n, n, THREE.RGBAFormat);
  linTex.magFilter = linTex.minFilter = THREE.LinearFilter;
  linTex.needsUpdate = true;
  const bodyTex = new THREE.DataTexture(body, n, n, THREE.RedFormat);
  bodyTex.magFilter = bodyTex.minFilter = THREE.NearestFilter;
  bodyTex.needsUpdate = true;
  return { lin: linTex, body: bodyTex };
}

/** GLSL: the water data lookups shared by the water layer and the ground's beds. */
export const GLSL_WATER = `
uniform sampler2D uWLin;
uniform sampler2D uWBody;
float waterDepth(vec2 xz) { return texture2D(uWLin, xz / uSize).r * 255.0 / 32.0; }
`;

/**
 * The water layer's material: see-through, lit like the ground, the surface drawn per pixel of
 * 1/16 block. `aFall` marks surfaces (0), falling sheets (1) and spray (2).
 */
export function waterMaterial(u: { uTime: { value: number }; uOrigin: { value: THREE.Vector2 } }, cells: THREE.Texture, tex: { lin: THREE.Texture; body: THREE.Texture }, n: number) {
  const mat = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, depthWrite: false, side: THREE.DoubleSide });
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = u.uTime;
    sh.uniforms.uOrigin = u.uOrigin;
    sh.uniforms.uCells = { value: cells };
    sh.uniforms.uWLin = { value: tex.lin };
    sh.uniforms.uWBody = { value: tex.body };
    sh.uniforms.uSize = { value: n };
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aFall;\nattribute float aTopY;\nattribute float aBotY;\nvarying vec3 vWPos;\nvarying vec3 vWN;\nvarying float vFall;\nvarying float vTopY;\nvarying float vBotY;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvWPos = (modelMatrix * vec4(position, 1.0)).xyz;\nvWN = normal;\nvFall = aFall;\nvTopY = aTopY;\nvBotY = aBotY;');
    sh.fragmentShader = sh.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
varying vec3 vWPos;
varying vec3 vWN;
varying float vFall;
varying float vTopY;
varying float vBotY;
uniform float uTime;
uniform vec2 uOrigin;
uniform sampler2D uCells;
uniform float uSize;
vec3 wEmit = vec3(0.0);
${GLSL_NOISE}
${GLSL_WATER}
bool dryAt(vec2 c) { return texture2D(uCells, (c + 0.5) / uSize).b < 0.05; }
vec3 lin3(vec3 c) { return pow(c, vec3(2.2)); }
float ripple(vec2 q) { return vnoise(q * 1.7) * 0.62 + vnoise(q * 3.9 + 11.0) * 0.38; }`,
      )
      .replace(
        '#include <map_fragment>',
        `{
  vec3 col;
  float alpha;
  vec3 foamC = vec3(0.9, 0.96, 1.0);
  if (vFall > 1.5) {
    // spray at the foot of a fall: white puffs drifting up and thinning out
    float along = dot(vWPos.xz, vec2(-vWN.z, vWN.x));
    vec2 sp = floor(vec2(along, vWPos.y) * 12.0);
    float hf = clamp((vWPos.y - vBotY) / max(0.1, vTopY - vBotY), 0.0, 1.0);
    float puff = vnoise(sp * 0.33 + vec2(0.0, -uTime * 5.0)) * 0.7 + h21(sp + floor(uTime * 9.0)) * 0.3;
    alpha = smoothstep(0.35, 0.72, puff) * pow(1.0 - hf, 1.3) * 0.85;
    if (alpha < 0.04) discard;
    col = lin3(vec3(0.86, 0.93, 0.98));
    wEmit = col * 0.35;
  } else if (vFall > 0.5) {
    // a falling sheet: lanes of water pouring down at their own speeds, bright streaks, a glassy
    // lip at the top and white foam where it hits the pool
    float along = dot(vWPos.xz, vec2(-vWN.z, vWN.x));
    float lx = floor(along * 16.0);
    float lane = h21(vec2(lx, 3.0));
    float py = floor(vWPos.y * 16.0) / 16.0;
    float spd = 2.4 + lane * 1.6;
    float s = fract(py * 0.7 + uTime * spd * 0.55 + lane * 5.0);
    float n = vnoise(vec2(lx * 0.5, py * 3.0 + uTime * spd * 1.6));
    col = mix(lin3(vec3(0.34, 0.58, 0.74)), lin3(vec3(0.52, 0.74, 0.86)), n);
    col = mix(col, lin3(foamC), smoothstep(0.72, 0.92, s) * 0.75);
    float dt = vTopY - vWPos.y;
    col = mix(col, lin3(vec3(0.7, 0.86, 0.94)), (1.0 - smoothstep(0.0, 0.2, dt)) * 0.5);
    float db = vWPos.y - vBotY;
    float foot = 1.0 - smoothstep(0.0, 0.45, db + (h21(vec2(lx, floor(uTime * 10.0))) - 0.5) * 0.25);
    col = mix(col, lin3(foamC), foot * 0.9);
    alpha = 0.72 + 0.14 * smoothstep(0.72, 0.92, s) + foot * 0.14;
    wEmit = col * 0.15;
  } else {
    vec2 xz = vWPos.xz - uOrigin;
    vec2 cell = floor(xz);
    float body = floor(texture2D(uWBody, (cell + 0.5) / uSize).r * 255.0 + 0.5) - 1.0;
    // the surface is drawn in pixels of 1/16 block, like the blocks around it
    vec2 pq = (floor(xz * 16.0) + 0.5) / 16.0;
    vec4 wl = texture2D(uWLin, pq / uSize);
    float depth = wl.r * 255.0 / 32.0;
    float churn = wl.g;
    vec2 fv = wl.ba * 2.0 - 1.0;
    // per body: colours by the shore and in the depths, opacity range, how fast light fades
    vec3 cS; vec3 cD; float aS; float aD; float absorb; float spd;
    if (body == 7.0) { cS = vec3(0.33, 0.66, 0.68); cD = vec3(0.06, 0.2, 0.42); aS = 0.3; aD = 0.93; absorb = 0.45; spd = 0.22; }
    else if (body == 5.0) { cS = vec3(0.36, 0.62, 0.62); cD = vec3(0.07, 0.23, 0.38); aS = 0.24; aD = 0.9; absorb = 0.62; spd = 0.12; }
    else if (body == 6.0) { cS = vec3(0.34, 0.36, 0.2); cD = vec3(0.2, 0.23, 0.12); aS = 0.6; aD = 0.9; absorb = 2.6; spd = 0.04; }
    else if (body == 3.0) { cS = vec3(0.52, 0.74, 0.8); cD = vec3(0.22, 0.46, 0.62); aS = 0.36; aD = 0.78; absorb = 1.2; spd = 2.6; }
    else { cS = vec3(0.38, 0.64, 0.68); cD = vec3(0.12, 0.34, 0.5); aS = 0.26; aD = 0.82; absorb = 1.0; spd = 0.9; }
    float dk = 1.0 - exp(-depth * absorb);
    col = mix(cS, cD, dk);
    alpha = mix(aS, aD, dk);
    // deep water (lakes and the sea past ~2.5 blocks) darkens further
    float deep = smoothstep(2.0, 4.0, depth) * step(4.5, body);
    col *= 1.0 - deep * 0.25;
    alpha = mix(alpha, 0.95, deep);
    // ripples carried along the flow (two phases cross-faded, so the pattern never stretches);
    // still water drifts slowly
    vec2 dir = length(fv) > 0.25 ? normalize(fv) : vec2(0.8, 0.45);
    float ph = uTime * spd * 0.5;
    float p0 = fract(ph);
    float p1 = fract(ph + 0.5);
    float w0 = 1.0 - abs(1.0 - 2.0 * p0);
    float rp = mix(ripple(pq * 1.4 - dir * p1 * 2.0 + 5.3), ripple(pq * 1.4 - dir * p0 * 2.0), w0);
    // a few flat brightness steps, no glossy highlights
    col *= 0.9 + floor(rp * 4.0) / 4.0 * 0.18;
    if (rp > 0.74) col = mix(col, vec3(0.78, 0.9, 0.95), body == 6.0 ? 0.08 : 0.2);
    // shallow water: the light on the bed shows through in thin bright lines
    float shallow = 1.0 - smoothstep(0.25, 0.6, depth);
    if (body != 6.0) {
      float ca = abs(vnoise(pq * 2.3 + vec2(uTime * 0.35, -uTime * 0.25)) - vnoise(pq * 2.1 - vec2(uTime * 0.3, 0.2 * uTime)));
      col = mix(col, vec3(0.75, 0.9, 0.92), shallow * step(ca, 0.05) * 0.35);
    }
    if (body == 3.0) {
      // rapids: white streaks racing downstream, broken water on the stones
      vec2 side = vec2(-dir.y, dir.x);
      float ln = floor(dot(pq, side) * 16.0);
      float st = fract(dot(pq, dir) * 0.9 - uTime * 1.6 + h21(vec2(ln, 7.0)) * 9.0);
      float sk = smoothstep(0.82, 0.95, st) * (0.5 + 0.5 * step(0.4, h21(vec2(ln, 2.0))));
      col = mix(col, foamC, sk * 0.65);
      alpha = max(alpha, sk * 0.85);
    }
    if (body == 6.0) {
      // swamp: duckweed specks and a slow bubble now and then
      float weed = step(0.8, vnoise(pq * 1.3 + 3.0)) * step(0.45, h21(floor(pq * 16.0)));
      col = mix(col, vec3(0.36, 0.5, 0.16), weed * 0.85);
      alpha = max(alpha, weed * 0.95);
      float bub = step(0.992, h21(floor(pq * 8.0) + floor(uTime * 0.7 + h21(cell) * 5.0)));
      col = mix(col, vec3(0.55, 0.6, 0.4), bub * 0.6);
    }
    // foam along the banks (none on the swamp; a wide slow surf on the sea)
    if (body != 6.0) {
      vec2 lp = fract(pq);
      float ed = 1.0;
      if (dryAt(cell + vec2(-1.0, 0.0))) ed = min(ed, lp.x);
      if (dryAt(cell + vec2(1.0, 0.0))) ed = min(ed, 1.0 - lp.x);
      if (dryAt(cell + vec2(0.0, -1.0))) ed = min(ed, lp.y);
      if (dryAt(cell + vec2(0.0, 1.0))) ed = min(ed, 1.0 - lp.y);
      float sea = body == 7.0 ? 1.0 : 0.0;
      float fw = mix(0.05, 0.13, sea) + mix(0.03, 0.06, sea) * (0.5 + 0.5 * sin(uTime * mix(2.0, 0.9, sea) + (pq.x - pq.y) * 4.0));
      float fm = 0.0;
      if (ed < fw) fm = 0.7;
      else if (ed < fw + 0.08 && h21(floor(pq * 16.0) + floor(uTime * mix(3.0, 1.5, sea))) > 0.62) fm = 0.4;
      col = mix(col, foamC, fm);
      alpha = max(alpha, fm);
    }
    // churning white water where a fall lands
    float ch = churn * smoothstep(0.25, 0.75, vnoise(pq * 3.0 + vec2(uTime * 2.3, -uTime * 1.7)) + churn * 0.3);
    col = mix(col, foamC, ch * 0.85);
    alpha = max(alpha, ch * 0.9);
    col = lin3(col);
    wEmit = col * 0.1;
  }
  diffuseColor.rgb *= col;
  diffuseColor.a *= alpha;
}`,
      )
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += wEmit;');
  };
  return mat;
}

interface Part {
  pos: number[];
  nor: number[];
  fall: number[];
  topY: number[];
  botY: number[];
  idx: number[];
}

/**
 * Water geometry of the cells [x0, x1) x [z0, z1): flat surfaces (runs of one level merged), a
 * falling sheet on every edge where the surface drops to a lower one, spray where it lands.
 * Null when the area holds no water.
 */
export function waterGeometry(t: Terrain, level: Float32Array, x0: number, z0: number, x1: number, z1: number): THREE.BufferGeometry | null {
  const n = t.size;
  const wet = (x: number, z: number) => x >= 0 && z >= 0 && x < n && z < n && isWater(t.cell[z * n + x]);
  const p: Part = { pos: [], nor: [], fall: [], topY: [], botY: [], idx: [] };
  const quad = (v: number[], nx: number, ny: number, nz: number, fall: number, top: number, bot: number) => {
    const b = p.pos.length / 3;
    p.pos.push(...v);
    for (let k = 0; k < 4; k++) {
      p.nor.push(nx, ny, nz);
      p.fall.push(fall);
      p.topY.push(top);
      p.botY.push(bot);
    }
    p.idx.push(b, b + 2, b + 1, b, b + 3, b + 2);
  };
  for (let z = z0; z < z1; z++) {
    let x = x0;
    while (x < x1) {
      if (!wet(x, z)) {
        x++;
        continue;
      }
      const h = level[z * n + x];
      let e = x + 1;
      while (e < x1 && wet(e, z) && level[z * n + e] === h) e++;
      quad([x, h, z, e, h, z, e, h, z + 1, x, h, z + 1], 0, 1, 0, 0, h, h);
      x = e;
    }
    for (let x = x0; x < x1; x++) {
      if (!wet(x, z)) continue;
      const i = z * n + x;
      const h = level[i];
      for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        if (!wet(x + dx, z + dz)) continue;
        const lo = level[(z + dz) * n + x + dx];
        const drop = h - lo;
        if (drop < FALL_MIN) continue;
        // the shared edge, the sheet leaning out a little as it falls
        const ex = dx > 0 ? x + 1 : dx < 0 ? x : null;
        const ez = dz > 0 ? z + 1 : dz < 0 ? z : null;
        const out = Math.min(0.35, 0.06 + drop * 0.06);
        const a = ex !== null ? [ex + dx * 0.02, z, ex + dx * 0.02, z + 1] : [x, ez! + dz * 0.02, x + 1, ez! + dz * 0.02];
        const b = ex !== null ? [ex + dx * out, z, ex + dx * out, z + 1] : [x, ez! + dz * out, x + 1, ez! + dz * out];
        quad([a[0], h, a[1], a[2], h, a[3], b[2], lo - 0.05, b[3], b[0], lo - 0.05, b[1]], dx, 0, dz, 1, h, lo);
        if (drop >= 1.2) {
          // spray: two crossed planes rising from the pool at the foot
          const cx = (b[0] + b[2]) / 2 + dx * 0.45;
          const cz = (b[1] + b[3]) / 2 + dz * 0.45;
          const hgt = Math.min(2.4, 0.6 + drop * 0.35);
          const w = 0.85;
          quad([cx - w, lo, cz - w * 0.3, cx + w, lo, cz + w * 0.3, cx + w, lo + hgt, cz + w * 0.3, cx - w, lo + hgt, cz - w * 0.3], -0.3, 0, 1, 2, lo + hgt, lo);
          quad([cx - w * 0.3, lo, cz + w, cx + w * 0.3, lo, cz - w, cx + w * 0.3, lo + hgt, cz - w, cx - w * 0.3, lo + hgt, cz + w], 1, 0, 0.3, 2, lo + hgt, lo);
        }
      }
    }
  }
  if (!p.idx.length) return null;
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(p.pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(p.nor, 3));
  g.setAttribute('aFall', new THREE.Float32BufferAttribute(p.fall, 1));
  g.setAttribute('aTopY', new THREE.Float32BufferAttribute(p.topY, 1));
  g.setAttribute('aBotY', new THREE.Float32BufferAttribute(p.botY, 1));
  g.setIndex(p.idx);
  g.computeBoundingSphere();
  return g;
}

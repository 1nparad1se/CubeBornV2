import * as THREE from 'three';

/**
 * Organic, low-poly-smooth model pieces for the painted world (owner: the world is no longer
 * cubic; only characters, weapons and armour stay blocky): rounded tapering limbs, lumpy leaf
 * clumps, drooping cone tiers, and a surface-nets mesher that turns a voxel sketch into a soft
 * rounded shape. All pieces write into one shared buffer set with vertex colours and a surface
 * kind (leaf / wood / fruit) for the painted tree material.
 */

export interface SmoothOut {
  pos: number[];
  nor: number[];
  col: number[];
  surf: number[];
  idx: number[];
}

export function smoothOut(): SmoothOut {
  return { pos: [], nor: [], col: [], surf: [], idx: [] };
}

const _c = new THREE.Color();

export function pushV(o: SmoothOut, x: number, y: number, z: number, nx: number, ny: number, nz: number, hex: number, k: number, surf: number) {
  _c.setHex(hex).convertSRGBToLinear();
  o.pos.push(x, y, z);
  const l = Math.hypot(nx, ny, nz) || 1;
  o.nor.push(nx / l, ny / l, nz / l);
  o.col.push(_c.r * k, _c.g * k, _c.b * k);
  o.surf.push(surf);
  return o.pos.length / 3 - 1;
}

// ---------- unit icospheres (shared vertices), by subdivision level ----------

const icoCache: { v: number[]; f: number[] }[] = [];
export function icosphere(sub: number): { v: number[]; f: number[] } {
  if (icoCache[sub]) return icoCache[sub];
  const t = (1 + Math.sqrt(5)) / 2;
  let v = [-1, t, 0, 1, t, 0, -1, -t, 0, 1, -t, 0, 0, -1, t, 0, 1, t, 0, -1, -t, 0, 1, -t, t, 0, -1, t, 0, 1, -t, 0, -1, -t, 0, 1];
  let f = [0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11, 1, 5, 9, 5, 11, 4, 11, 10, 2, 10, 7, 6, 7, 1, 8, 3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9, 4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1];
  const norm = () => {
    for (let i = 0; i < v.length; i += 3) {
      const l = Math.hypot(v[i], v[i + 1], v[i + 2]);
      v[i] /= l;
      v[i + 1] /= l;
      v[i + 2] /= l;
    }
  };
  norm();
  for (let s = 0; s < sub; s++) {
    const mid = new Map<number, number>();
    const m = (a: number, b: number) => {
      const key = a < b ? a * 65536 + b : b * 65536 + a;
      let r = mid.get(key);
      if (r === undefined) {
        r = v.length / 3;
        v.push((v[a * 3] + v[b * 3]) / 2, (v[a * 3 + 1] + v[b * 3 + 1]) / 2, (v[a * 3 + 2] + v[b * 3 + 2]) / 2);
        mid.set(key, r);
      }
      return r;
    };
    const nf: number[] = [];
    for (let i = 0; i < f.length; i += 3) {
      const a = f[i], b = f[i + 1], c = f[i + 2];
      const ab = m(a, b), bc = m(b, c), ca = m(c, a);
      nf.push(a, ab, ca, b, bc, ab, c, ca, bc, ab, bc, ca);
    }
    f = nf;
    norm();
  }
  v = v.slice();
  icoCache[sub] = { v, f };
  return icoCache[sub];
}

/**
 * A lumpy clump (leaves, a bush ball, a fruit): an icosphere of `sub` subdivisions stretched to
 * radii r, pushed in and out by `bump(x, y, z)` (a factor around 1). Normals stay those of the
 * smooth ellipsoid, which lights a crown softly like a mass of leaves rather than a hard shell.
 */
export function clump(o: SmoothOut, c: [number, number, number], r: [number, number, number], sub: number, bump: (x: number, y: number, z: number) => number, color: (x: number, y: number, z: number, low: number) => number, surf: number, flatBottom = 0) {
  const s = icosphere(sub);
  const base = o.pos.length / 3;
  for (let i = 0; i < s.v.length; i += 3) {
    const dx = s.v[i], dy = s.v[i + 1], dz = s.v[i + 2];
    let x = c[0] + dx * r[0];
    let y = c[1] + dy * r[1];
    let z = c[2] + dz * r[2];
    const k = bump(x, y, z);
    x = c[0] + dx * r[0] * k;
    y = c[1] + dy * r[1] * k;
    z = c[2] + dz * r[2] * k;
    // the underside of a crown is flatter and darker (leaves hang over shade)
    if (flatBottom > 0 && dy < 0) y = c[1] + dy * r[1] * k * (1 - flatBottom);
    const low = (dy + 1) / 2;
    pushV(o, x, y, z, dx / r[0], dy / r[1] + 0.25, dz / r[2], color(x, y, z, low), 0.62 + 0.38 * Math.min(1, low * 1.4), surf);
  }
  for (const i of s.f) o.idx.push(base + i);
}

/**
 * A rounded limb from a to b (radius ra at a, rb at b), `sides` around, `rings` along; the ends
 * are left open (they sit inside a trunk or a crown) unless `cap` closes the far end.
 */
export function limb(o: SmoothOut, a: [number, number, number], b: [number, number, number], ra: number, rb: number, sides: number, rings: number, color: (x: number, y: number, z: number) => number, surf: number, cap = false, wobble?: (t: number) => [number, number]) {
  const ax = b[0] - a[0], ay = b[1] - a[1], az = b[2] - a[2];
  const len = Math.hypot(ax, ay, az) || 1e-6;
  const dx = ax / len, dy = ay / len, dz = az / len;
  // a frame around the axis
  let ux = -dz, uy = 0, uz = dx;
  if (Math.hypot(ux, uz) < 1e-3) {
    ux = 1;
    uz = 0;
  }
  const l = Math.hypot(ux, uy, uz);
  ux /= l;
  uy /= l;
  uz /= l;
  const vx = dy * uz - dz * uy, vy = dz * ux - dx * uz, vz = dx * uy - dy * ux;
  const base = o.pos.length / 3;
  for (let j = 0; j <= rings; j++) {
    const t = j / rings;
    const rr = ra + (rb - ra) * t;
    const [wx, wz] = wobble ? wobble(t) : [0, 0];
    const cx = a[0] + ax * t + wx, cy = a[1] + ay * t, cz = a[2] + az * t + wz;
    for (let s = 0; s < sides; s++) {
      const ang = (s / sides) * Math.PI * 2;
      const cs = Math.cos(ang), sn = Math.sin(ang);
      const nx = ux * cs + vx * sn, ny = uy * cs + vy * sn, nz = uz * cs + vz * sn;
      const x = cx + nx * rr, y = cy + ny * rr, z = cz + nz * rr;
      pushV(o, x, y, z, nx, ny, nz, color(x, y, z), 0.8 + 0.2 * Math.max(0, ny + 0.5), surf);
    }
  }
  for (let j = 0; j < rings; j++)
    for (let s = 0; s < sides; s++) {
      const a0 = base + j * sides + s;
      const a1 = base + j * sides + ((s + 1) % sides);
      const b0 = a0 + sides;
      const b1 = a1 + sides;
      o.idx.push(a0, a1, b1, a0, b1, b0);
    }
  if (cap) {
    // a rounded end, not a flat disc
    const tx = b[0] + dx * rb * 0.7, ty = b[1] + dy * rb * 0.7, tz = b[2] + dz * rb * 0.7;
    const tip = pushV(o, tx, ty, tz, dx, dy, dz, color(tx, ty, tz), 1, surf);
    const r0 = base + rings * sides;
    for (let s = 0; s < sides; s++) o.idx.push(r0 + s, r0 + ((s + 1) % sides), tip);
  }
}

/**
 * One drooping tier of a conifer: a ring at height y (radius r, `sides` around, jagged by
 * `jag(angle)`) sagging at its rim, rising to an apex at `top`, closed underneath.
 */
export function tier(o: SmoothOut, y: number, top: number, r: number, sides: number, jag: (a: number) => number, color: (x: number, y: number, z: number, low: number) => number, surf: number) {
  const base = o.pos.length / 3;
  const sag = Math.min(0.35, r * 0.22);
  for (let s = 0; s < sides; s++) {
    const a = (s / sides) * Math.PI * 2;
    const rr = r * jag(a);
    const x = Math.cos(a) * rr, z = Math.sin(a) * rr;
    pushV(o, x, y - sag, z, Math.cos(a), 0.7, Math.sin(a), color(x, y - sag, z, 0), 0.72, surf);
    // a mid ring so the tier bulges a little (soft, not a sharp cone)
    const mx = x * 0.62, mz = z * 0.62, my = y + (top - y) * 0.38;
    pushV(o, mx, my, mz, Math.cos(a), 1.1, Math.sin(a), color(mx, my, mz, 0.6), 0.92, surf);
  }
  const apex = pushV(o, 0, top, 0, 0, 1, 0, color(0, top, 0, 1), 1, surf);
  const under = pushV(o, 0, y + (top - y) * 0.15, 0, 0, -1, 0, color(0, y, 0, 0), 0.45, surf);
  for (let s = 0; s < sides; s++) {
    const r0 = base + s * 2, r1 = base + ((s + 1) % sides) * 2;
    o.idx.push(r0, r0 + 1, r1, r1, r0 + 1, r1 + 1);
    o.idx.push(r0 + 1, apex, r1 + 1);
    o.idx.push(r0, r1, under);
  }
}

/**
 * Surface nets over a voxel occupancy (nx, ny, nz cells of size `res`, origin `org`): one vertex
 * per cell on the surface at the mean of its edge crossings, smoothed `iters` times, so a voxel
 * sketch becomes a soft rounded shape. `colorAt(i, j, k)` gives the colour (or -1) of a voxel.
 */
export function surfaceNets(o: SmoothOut, nx: number, ny: number, nz: number, res: number, org: [number, number, number], colorAt: (i: number, j: number, k: number) => number, surfAt: (i: number, j: number, k: number) => number, iters = 2) {
  const occ = (i: number, j: number, k: number) => i >= 0 && j >= 0 && k >= 0 && i < nx && j < ny && k < nz && colorAt(i, j, k) >= 0;
  // cells of the dual grid: (i, j, k) spans voxels i-1..i, j-1..j, k-1..k
  const W = nx + 1, H = ny + 1, D = nz + 1;
  const vid = new Int32Array(W * H * D).fill(-1);
  const vp: number[] = [];
  const vc: number[] = [];
  const vs: number[] = [];
  const at = (i: number, j: number, k: number) => (j * D + k) * W + i;
  for (let j = 0; j < H; j++)
    for (let k = 0; k < D; k++)
      for (let i = 0; i < W; i++) {
        let n = 0;
        let sx = 0, sy = 0, sz = 0;
        let filled = 0;
        let cHex = -1;
        let cS = 0;
        for (let q = 0; q < 8; q++) {
          const ii = i - 1 + (q & 1), jj = j - 1 + ((q >> 1) & 1), kk = k - 1 + (q >> 2);
          if (occ(ii, jj, kk)) {
            filled++;
            if (cHex < 0) {
              cHex = colorAt(ii, jj, kk);
              cS = surfAt(ii, jj, kk);
            }
            sx += (q & 1) - 0.5;
            sy += ((q >> 1) & 1) - 0.5;
            sz += (q >> 2) - 0.5;
            n++;
          }
        }
        if (filled === 0 || filled === 8) continue;
        // the vertex leans toward the filled corners (a soft average)
        const f = 0.35 / n;
        vid[at(i, j, k)] = vp.length / 3;
        vp.push(org[0] + (i + sx * f) * res, org[1] + (j + sy * f) * res, org[2] + (k + sz * f) * res);
        vc.push(cHex);
        vs.push(cS);
      }
  const tri: number[] = [];
  // a quad for every voxel face between filled and empty
  for (let j = 0; j < ny; j++)
    for (let k = 0; k < nz; k++)
      for (let i = 0; i < nx; i++) {
        if (!occ(i, j, k)) continue;
        const faces: [number, number, number, number[][]][] = [
          [1, 0, 0, [[i + 1, j, k], [i + 1, j + 1, k], [i + 1, j + 1, k + 1], [i + 1, j, k + 1]]],
          [-1, 0, 0, [[i, j, k], [i, j, k + 1], [i, j + 1, k + 1], [i, j + 1, k]]],
          [0, 1, 0, [[i, j + 1, k], [i, j + 1, k + 1], [i + 1, j + 1, k + 1], [i + 1, j + 1, k]]],
          [0, -1, 0, [[i, j, k], [i + 1, j, k], [i + 1, j, k + 1], [i, j, k + 1]]],
          [0, 0, 1, [[i, j, k + 1], [i + 1, j, k + 1], [i + 1, j + 1, k + 1], [i, j + 1, k + 1]]],
          [0, 0, -1, [[i, j, k], [i, j + 1, k], [i + 1, j + 1, k], [i + 1, j, k]]],
        ];
        for (const [fx, fy, fz, q] of faces) {
          if (occ(i + fx, j + fy, k + fz)) continue;
          const v = q.map(([a, b, c]) => vid[at(a, b, c)]);
          if (v.some((x) => x < 0)) continue;
          // wind each quad to face out of the solid
          const A = v[0] * 3, B = v[1] * 3, C = v[2] * 3;
          const ux = vp[B] - vp[A], uy = vp[B + 1] - vp[A + 1], uz = vp[B + 2] - vp[A + 2];
          const wx = vp[C] - vp[A], wy = vp[C + 1] - vp[A + 1], wz = vp[C + 2] - vp[A + 2];
          const d = (uy * wz - uz * wy) * fx + (uz * wx - ux * wz) * fy + (ux * wy - uy * wx) * fz;
          if (d >= 0) tri.push(v[0], v[1], v[2], v[0], v[2], v[3]);
          else tri.push(v[0], v[2], v[1], v[0], v[3], v[2]);
        }
      }
  // smoothing: each vertex moves toward the mean of its neighbours
  const nv = vp.length / 3;
  const nb: number[][] = Array.from({ length: nv }, () => []);
  for (let t = 0; t < tri.length; t += 3)
    for (let e = 0; e < 3; e++) {
      const a = tri[t + e], b = tri[t + ((e + 1) % 3)];
      nb[a].push(b);
      nb[b].push(a);
    }
  let P = vp;
  for (let it = 0; it < iters; it++) {
    const Q = P.slice();
    for (let v = 0; v < nv; v++) {
      const L = nb[v];
      if (!L.length) continue;
      let sx = 0, sy = 0, sz = 0;
      for (const u of L) {
        sx += P[u * 3];
        sy += P[u * 3 + 1];
        sz += P[u * 3 + 2];
      }
      Q[v * 3] = P[v * 3] * 0.4 + (sx / L.length) * 0.6;
      Q[v * 3 + 1] = Math.max(org[1], P[v * 3 + 1] * 0.4 + (sy / L.length) * 0.6);
      Q[v * 3 + 2] = P[v * 3 + 2] * 0.4 + (sz / L.length) * 0.6;
    }
    P = Q;
  }
  // smooth normals from the faces
  const N = new Float32Array(nv * 3);
  for (let t = 0; t < tri.length; t += 3) {
    const a = tri[t] * 3, b = tri[t + 1] * 3, c = tri[t + 2] * 3;
    const ux = P[b] - P[a], uy = P[b + 1] - P[a + 1], uz = P[b + 2] - P[a + 2];
    const wx = P[c] - P[a], wy = P[c + 1] - P[a + 1], wz = P[c + 2] - P[a + 2];
    const nx2 = uy * wz - uz * wy, ny2 = uz * wx - ux * wz, nz2 = ux * wy - uy * wx;
    for (const q of [a, b, c]) {
      N[q] += nx2;
      N[q + 1] += ny2;
      N[q + 2] += nz2;
    }
  }
  const base = o.pos.length / 3;
  for (let v = 0; v < nv; v++) {
    const ny2 = N[v * 3 + 1];
    pushV(o, P[v * 3], P[v * 3 + 1], P[v * 3 + 2], N[v * 3], ny2 + 0.15 * Math.hypot(N[v * 3], ny2, N[v * 3 + 2]), N[v * 3 + 2], vc[v], 1, vs[v]);
  }
  for (let t = 0; t < tri.length; t += 3) o.idx.push(base + tri[t], base + tri[t + 1], base + tri[t + 2]);
}

/** Packs a SmoothOut into a geometry (with the aSurf attribute when `surf`). */
export function toGeometry(o: SmoothOut, surf = true): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(o.pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(o.nor, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(o.col, 3));
  if (surf) g.setAttribute('aSurf', new THREE.Float32BufferAttribute(o.surf, 1));
  g.setIndex(o.idx);
  g.computeBoundingSphere();
  g.computeBoundingBox();
  return g;
}

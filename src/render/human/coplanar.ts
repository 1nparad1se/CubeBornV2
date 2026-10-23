/**
 * Removes z-fighting between coplanar faces of a voxel shell (the hair: its cubes overlap, so many
 * faces lie in the same plane, facing the same way, over each other, and the depth test flips
 * between them from pixel to pixel — the shimmer). Faces are grouped into flat patches (triangles
 * joined by shared vertices in one plane); a patch that overlaps an earlier one in its plane is
 * pushed out along its normal by a whole layer (1 mm each), so every overlap has one clear winner.
 * The smaller patch goes on top (details over the large faces). Patches lying less than 4 mm over
 * a fixed face (the head, the ears) are lifted to a 4 mm gap. Pure: works on flat arrays.
 */
export interface Shell {
  pos: number[];
  uv: number[];
  bone: number[];
  idx: number[];
}

const LAYER = 0.001;
/** Clear gap kept between the shell and a fixed face just under it (m). */
const NEAR = 0.004;

type V3 = [number, number, number];

/** Area of the overlap of two convex polygons in 2D (Sutherland–Hodgman clip). */
export function overlapArea(a: [number, number][], b: [number, number][]): number {
  let out = a;
  const n = b.length;
  // orientation of the clip polygon
  let s = 0;
  for (let i = 0; i < n; i++) s += b[i][0] * b[(i + 1) % n][1] - b[(i + 1) % n][0] * b[i][1];
  const sign = s >= 0 ? 1 : -1;
  for (let i = 0; i < n && out.length; i++) {
    const p = b[i];
    const q = b[(i + 1) % n];
    const inside = (v: [number, number]) => sign * ((q[0] - p[0]) * (v[1] - p[1]) - (q[1] - p[1]) * (v[0] - p[0])) >= -1e-12;
    const next: [number, number][] = [];
    for (let j = 0; j < out.length; j++) {
      const c = out[j];
      const d = out[(j + 1) % out.length];
      const ci = inside(c);
      const di = inside(d);
      if (ci) next.push(c);
      if (ci !== di) {
        const ex = q[0] - p[0];
        const ey = q[1] - p[1];
        const den = ex * (d[1] - c[1]) - ey * (d[0] - c[0]);
        if (Math.abs(den) > 1e-15) {
          const t = (ey * (c[0] - p[0]) - ex * (c[1] - p[1])) / den;
          next.push([c[0] + (d[0] - c[0]) * t, c[1] + (d[1] - c[1]) * t]);
        }
      }
    }
    out = next;
  }
  let ar = 0;
  for (let i = 0; i < out.length; i++) ar += out[i][0] * out[(i + 1) % out.length][1] - out[(i + 1) % out.length][0] * out[i][1];
  return Math.abs(ar) / 2;
}

/**
 * Returns a copy of `shell` with overlapping coplanar patches separated. `fixed` (optional, same
 * space) are faces that stay where they are (the head under the hair): patches of the shell over
 * them are pushed out too. The result has no shared vertices between patches.
 */
export function separateCoplanar(shell: Shell, fixed?: { pos: number[]; idx: number[] }): Shell {
  const P = shell.pos;
  const vert = (arr: number[], i: number): V3 => [arr[i * 3], arr[i * 3 + 1], arr[i * 3 + 2]];
  interface Tri { v: number[]; n: V3; d: number; key: string; fixed: boolean; }
  const tris: Tri[] = [];
  const addTris = (pos: number[], idx: number[], isFixed: boolean) => {
    for (let t = 0; t < idx.length; t += 3) {
      const a = vert(pos, idx[t]);
      const b = vert(pos, idx[t + 1]);
      const c = vert(pos, idx[t + 2]);
      const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
      const w = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
      let n: V3 = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
      const l = Math.hypot(...n);
      if (l < 1e-12) continue;
      n = [n[0] / l, n[1] / l, n[2] / l];
      const d = n[0] * a[0] + n[1] * a[1] + n[2] * a[2];
      const key = `${n.map((x) => Math.round(x * 200)).join(',')}|${Math.round(d * 2000)}`;
      tris.push({ v: [idx[t], idx[t + 1], idx[t + 2]], n, d, key, fixed: isFixed });
    }
  };
  addTris(P, shell.idx, false);
  const nShell = tris.length;
  if (fixed) addTris(fixed.pos, fixed.idx, true);
  // patches: shell triangles of one plane joined by shared vertices (union-find)
  const parent = tris.map((_, i) => i);
  const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const byKey = new Map<string, number[]>();
  tris.forEach((t, i) => {
    const l = byKey.get(t.key);
    if (l) l.push(i);
    else byKey.set(t.key, [i]);
  });
  for (const list of byKey.values()) {
    const owner = new Map<number, number>();
    for (const i of list) {
      if (tris[i].fixed) continue;
      for (const v of tris[i].v) {
        const o = owner.get(v);
        if (o === undefined) owner.set(v, i);
        else parent[find(i)] = find(o);
      }
    }
  }
  // 2D projection of a triangle in its plane
  const proj = (t: Tri): [number, number][] => {
    const ax = Math.abs(t.n[0]) > 0.6 ? 0 : Math.abs(t.n[1]) > 0.6 ? 1 : 2;
    const o = [0, 1, 2].filter((k) => k !== ax);
    const src = t.fixed ? fixed!.pos : P;
    return t.v.map((i) => [src[i * 3 + o[0]], src[i * 3 + o[1]]] as [number, number]);
  };
  const layer = new Map<number, number>();
  for (const list of byKey.values()) {
    const patches = new Map<number, number[]>();
    for (const i of list) {
      const r = tris[i].fixed ? -1 - i : find(i);
      const l = patches.get(r);
      if (l) l.push(i);
      else patches.set(r, [i]);
    }
    if (patches.size < 2) continue;
    const polys = [...patches.entries()].map(([r, ts]) => {
      const pp = ts.map((i) => proj(tris[i]));
      const area = pp.reduce((s, p) => s + overlapArea(p, p), 0);
      return { r, pp, area, fixed: tris[ts[0]].fixed };
    });
    // fixed faces first (layer 0, they never move), then the larger patches below the smaller
    polys.sort((a, b) => (a.fixed !== b.fixed ? (a.fixed ? -1 : 1) : b.area - a.area));
    const placed: { pp: [number, number][][]; L: number }[] = [];
    for (const p of polys) {
      let L = p.fixed ? 0 : 0;
      if (!p.fixed) {
        const busy = new Set<number>();
        for (const q of placed) {
          let hit = false;
          for (const a of p.pp) {
            for (const b of q.pp) if (overlapArea(a, b) > 1e-8) { hit = true; break; }
            if (hit) break;
          }
          if (hit) busy.add(q.L);
        }
        while (busy.has(L)) L++;
        layer.set(p.r, L);
      }
      placed.push({ pp: p.pp, L });
    }
  }
  // patches lying just over a fixed face (the hair a fraction of a millimetre over the head or the
  // ears) are lifted to a clear gap above it, so the depth test never confuses the two
  const lift = new Map<number, number>();
  if (fixed) {
    const fixedTris = tris.slice(nShell);
    const patchTris = new Map<number, number[]>();
    for (let i = 0; i < nShell; i++) {
      const r = find(i);
      const l = patchTris.get(r);
      if (l) l.push(i);
      else patchTris.set(r, [i]);
    }
    for (const [r, ts] of patchTris) {
      const t0 = tris[ts[0]];
      let need = 0;
      for (const f of fixedTris) {
        if (f.n[0] * t0.n[0] + f.n[1] * t0.n[1] + f.n[2] * t0.n[2] < 0.995) continue;
        const gap = t0.d - f.d;
        if (gap >= NEAR || gap <= -NEAR) continue;
        const fp = proj(f);
        if (!ts.some((i) => overlapArea(proj(tris[i]), fp) > 1e-8)) continue;
        need = Math.max(need, NEAR - gap);
      }
      if (need > 0) lift.set(r, need);
    }
  }
  // rebuild the shell without shared vertices across patches, pushed out by their layers
  const out: Shell = { pos: [], uv: [], bone: [], idx: [] };
  const remap = new Map<string, number>();
  for (let i = 0; i < nShell; i++) {
    const t = tris[i];
    const r = find(i);
    const off = (layer.get(r) ?? 0) * LAYER + (lift.get(r) ?? 0);
    for (const v of t.v) {
      const k = `${r}:${v}`;
      let ni = remap.get(k);
      if (ni === undefined) {
        ni = out.pos.length / 3;
        remap.set(k, ni);
        out.pos.push(P[v * 3] + t.n[0] * off, P[v * 3 + 1] + t.n[1] * off, P[v * 3 + 2] + t.n[2] * off);
        out.uv.push(shell.uv[v * 2], shell.uv[v * 2 + 1]);
        out.bone.push(shell.bone[v]);
      }
      out.idx.push(ni);
    }
  }
  return out;
}

/** Counts pairs of overlapping same-facing coplanar faces from different patches (0 = no z-fighting). */
export function coplanarOverlaps(shell: Shell): number {
  const P = shell.pos;
  const key = (t: number) => {
    const a = [0, 1, 2].map((k) => [P[shell.idx[t + k] * 3], P[shell.idx[t + k] * 3 + 1], P[shell.idx[t + k] * 3 + 2]]);
    const u = [a[1][0] - a[0][0], a[1][1] - a[0][1], a[1][2] - a[0][2]];
    const w = [a[2][0] - a[0][0], a[2][1] - a[0][1], a[2][2] - a[0][2]];
    const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
    const l = Math.hypot(n[0], n[1], n[2]) || 1;
    const nn = n.map((x) => x / l);
    const d = nn[0] * a[0][0] + nn[1] * a[0][1] + nn[2] * a[0][2];
    const ax = Math.abs(nn[0]) > 0.6 ? 0 : Math.abs(nn[1]) > 0.6 ? 1 : 2;
    const o = [0, 1, 2].filter((k) => k !== ax);
    return { k: `${nn.map((x) => Math.round(x * 200)).join(',')}|${Math.round(d * 20000)}`, p: a.map((v) => [v[o[0]], v[o[1]]] as [number, number]), vs: [shell.idx[t], shell.idx[t + 1], shell.idx[t + 2]] };
  };
  const groups = new Map<string, ReturnType<typeof key>[]>();
  for (let t = 0; t < shell.idx.length; t += 3) {
    const g = key(t);
    const l = groups.get(g.k);
    if (l) l.push(g);
    else groups.set(g.k, [g]);
  }
  let n = 0;
  for (const l of groups.values())
    for (let i = 0; i < l.length; i++)
      for (let j = i + 1; j < l.length; j++) if (overlapArea(l[i].p, l[j].p) > 1e-8) n++;
  return n;
}

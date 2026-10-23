/**
 * Update 6: the hero model's animation rules (src/render/human/anim.ts) and the converted assets.
 * Run: npx tsx tools/tests/human.ts
 */
import * as THREE from 'three';
import { readFileSync, readdirSync } from 'node:fs';
import { CombatState, ComboCounter, GRAB_AT, bowPose, legs, staffPose, swingPose, stanceFrame, peaceFrame, stride, swingAmp } from '../../src/render/human/anim';
import { separateCoplanar, coplanarOverlaps, overlapArea } from '../../src/render/human/coplanar';
import { refWeapon } from '../../src/render/human/refWeapons';

let failed = 0;
const ok = (name: string, cond: boolean) => {
  console.log(`${cond ? 'ok  ' : 'FAIL'} ${name}`);
  if (!cond) failed++;
};
const run = (c: CombatState, secs: number, want: boolean, busy = false) => {
  for (let t = 0; t < secs; t += 1 / 60) c.update(1 / 60, want, busy);
};

// combat states: peace → drawing → combat → sheathing → peace, never a jump
{
  const c = new CombatState('sword');
  ok('starts in peace, weapon away', c.phase === 'peace' && !c.inHand);
  run(c, 0.1, true);
  ok('drawing starts on combat', c.phase === 'drawing' && !c.inHand);
  let prev = c.ready;
  let smooth = true;
  for (let i = 0; i < 60; i++) {
    c.update(1 / 60, true, false);
    if (Math.abs(c.ready - prev) > 0.1) smooth = false;
    prev = c.ready;
  }
  ok('drawn in combat, ready grows smoothly', c.phase === 'combat' && c.inHand && smooth);
  run(c, 0.2, false, true);
  ok('never sheathed during an attack', c.phase === 'combat');
  run(c, 0.2, false);
  ok('sheathing after combat ends', c.phase === 'sheathing');
  const r = c.ready;
  c.update(1 / 60, true, false);
  ok('combat resumed: drawn again from where it is', c.phase === 'drawing' && Math.abs(c.ready - r) < 0.1);
  run(c, 2, false);
  ok('back in peace', c.phase === 'peace' && !c.inHand);
  ok('the grab happens mid-transition', GRAB_AT > 0.2 && GRAB_AT < 0.6);
}

// sword: several different swings, a combo cycles them, resets after a pause
{
  const cc = new ComboCounter();
  const vs = [1, 2, 3, 4].map((s) => {
    cc.update(0.3, null);
    return cc.update(0.01, s);
  });
  ok('combo cycles four swing lines', new Set(vs).size === 4);
  cc.update(2, null);
  ok('combo restarts after a pause', cc.update(0.01, 9) === 0);
  // the direction the blade travels through the hit: right→left, left→right, down, diagonal
  const tips = [0, 1, 2, 3].map((v) => swingPose('sword', v, 0.5, 0.45).frame.a.clone().sub(swingPose('sword', v, 0.4, 0.45).frame.a).normalize());
  let distinct = true;
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) if (tips[i].angleTo(tips[j]) < 0.2) distinct = false;
  ok('the four swings cut along different lines', distinct);
  const a0 = swingPose('sword', 0, 0.1, 0.45).frame.a;
  ok('the sword moves between wind-up and hit', a0.angleTo(swingPose('sword', 0, 0.45, 0.45).frame.a) > 0.5);
}

// bow: string drawn before the shot, released at the hit; staff: magic grows, flash at release
{
  const before = bowPose(0.4, 0.5, 0, 0);
  const after = bowPose(0.56, 0.5, 0, 0);
  ok('bow drawn and arrow nocked before the shot', (before.draw ?? 0) > 0.6 && !!before.arrow);
  ok('bow released after the shot', (after.draw ?? 0) < 0.3 && !after.arrow);
  ok('a new arrow is nocked by the end of the shot', !!bowPose(0.99, 0.5, 0, 0).arrow);
  const st = stanceFrame('bow', 0, 0);
  ok('bow upright in the stance (reference «В бою»)', st.a.y > 0.9 && st.e.z > 0.9);
  ok('bow held low at the side out of combat', peaceFrame('bow', 0, 0).g.y < 0.9 && peaceFrame('bow', 0, 0).g.x > 0.25);
  const charge = staffPose(0.3, 0.5, 0, 0);
  const release = staffPose(0.52, 0.5, 0, 0);
  ok('staff gathers magic before the cast', (charge.orb ?? 0) > 0.2);
  ok('staff flashes at the release', (release.flash ?? 0) > 0);
  ok('staff points at the target on the cast', release.frame.a.z > 0.5);
  ok('staff: the free hand reaches forward', (release.free?.z ?? 0) > 0.4);
  ok('sword raised in the stance, lowered out of combat', stanceFrame('sword', 0, 0).a.y > 0.6 && peaceFrame('sword', 0, 0).a.y < -0.3);
}

// reference weapons: sizes against the 1.8 m hero
{
  const sw = refWeapon('ref_sword')!;
  const gs = refWeapon('ref_greatsword')!;
  const bw = refWeapon('ref_bow')!;
  const sf = refWeapon('ref_staff')!;
  ok('sword about leg + torso long (1.1–1.3 m)', sw.length > 1.1 && sw.length < 1.3);
  ok('greatsword bigger than the sword', gs.length > sw.length + 0.25);
  ok("bow almost the hero's height (1.45–1.7 m)", bw.length > 1.45 && bw.length < 1.7 && !!bw.tipLow);
  ok('staff taller than the shoulder (1.8–2.1 m)', sf.length > 1.8 && sf.length < 2.1 && !!sf.glow);
}

// hair: no coplanar overlaps, nothing lying just over the head or the ears
{
  const ch = JSON.parse(readFileSync('src/assets/character.json', 'utf8'));
  const hair = ch.parts.find((p: { name: string }) => p.name === 'Hair_VoxelShell');
  const fixed = { pos: [] as number[], idx: [] as number[] };
  for (const p of ch.parts)
    if (['Head', 'Ear_L', 'Ear_R'].includes(p.name)) {
      const o = fixed.pos.length / 3;
      fixed.pos.push(...p.pos);
      fixed.idx.push(...p.idx.map((i: number) => i + o));
    }
  const fx = separateCoplanar(hair, fixed);
  ok('hair: no overlapping coplanar faces', coplanarOverlaps(fx) === 0);
  // no hair face lies less than 3 mm from a same-facing face of the head or an ear it overlaps
  const tri = (P: number[], I: number[], t: number) => {
    const v = [0, 1, 2].map((k) => [0, 1, 2].map((c) => P[I[t + k] * 3 + c]));
    const u = [0, 1, 2].map((c) => v[1][c] - v[0][c]);
    const w = [0, 1, 2].map((c) => v[2][c] - v[0][c]);
    const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
    const l = Math.hypot(n[0], n[1], n[2]) || 1;
    const nn = n.map((x) => x / l);
    const ax = [0, 1, 2].reduce((m, k) => (Math.abs(nn[k]) > Math.abs(nn[m]) ? k : m), 0);
    const o = [0, 1, 2].filter((k) => k !== ax);
    return { n: nn, d: nn[0] * v[0][0] + nn[1] * v[0][1] + nn[2] * v[0][2], p: v.map((q) => [q[o[0]], q[o[1]]] as [number, number]), ax };
  };
  const heads: ReturnType<typeof tri>[] = [];
  for (let t = 0; t < fixed.idx.length; t += 3) heads.push(tri(fixed.pos, fixed.idx, t));
  const countNear = (sh: { pos: number[]; idx: number[] }) => {
    let n = 0;
    for (let t = 0; t < sh.idx.length; t += 3) {
      const a = tri(sh.pos, sh.idx, t);
      for (const b of heads) {
        if (a.ax !== b.ax || a.n[0] * b.n[0] + a.n[1] * b.n[1] + a.n[2] * b.n[2] < 0.995 || Math.abs(a.d - b.d) >= 0.003) continue;
        if (overlapArea(a.p, b.p) > 1e-8) n++;
      }
    }
    return n;
  };
  const near = countNear(fx);
  ok('the raw hair did lie too close to the head (the shimmer)', countNear(hair) > 0);
  ok('hair: no face within 3 mm of a same-facing head or ear face', near === 0);
}

// legs: 8 directions relative to the facing
{
  const fwd = legs(new THREE.Vector2(0, 3), 1);
  const back = legs(new THREE.Vector2(0, -3), 1);
  const side = legs(new THREE.Vector2(3, 0), 1);
  ok('backwards walk swings legs the other way', fwd.axis.dot(back.axis) < -0.9);
  ok('strafe swings across the side direction', Math.abs(side.axis.z) > 0.9);
  ok('standing still: no swing', legs(new THREE.Vector2(0, 0), 1).swingR === 0);
  ok('a run takes longer strides than a walk, a sprint longer still', stride(2.5) < stride(5) && stride(5) < stride(7.5));
  ok('thigh swing stays natural (< 40°)', swingAmp(7.5) < 0.7 && swingAmp(2.5) > 0.3);
  const w = legs(new THREE.Vector2(0, 2.5), 0);
  const r = legs(new THREE.Vector2(0, 6), 0);
  ok('swing knee bends more when running', r.kneeR > w.kneeR + 0.4);
  ok('arms swing harder when running', r.armAmp > w.armAmp);
  ok('the pelvis turns with the stride', Math.abs(legs(new THREE.Vector2(0, 2.5), Math.PI / 2).hipYaw) > 0.05);
}

// converted assets
{
  const ch = JSON.parse(readFileSync('src/assets/character.json', 'utf8'));
  ok('character: skeleton and parts', ch.bones.length >= 20 && ch.parts.length >= 30);
  const ys = ch.parts.flatMap((p: { pos: number[] }) => p.pos.filter((_: number, i: number) => i % 3 === 1));
  const h = Math.max(...ys) - Math.min(...ys);
  ok('character about 1.8 m tall', h > 1.6 && h < 2.1);
  const files = readdirSync('src/assets/weapons');
  for (const k of ['sword', 'staff', 'bow']) ok(`weapons: ten ${k}s`, files.filter((f) => f.startsWith(k)).length === 10);
}

if (failed) {
  console.log(`\n${failed} failed`);
  process.exit(1);
}
console.log('\nall passed');

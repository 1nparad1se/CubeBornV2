/**
 * Update 6: the hero model's animation rules (src/render/human/anim.ts) and the converted assets.
 * Run: npx tsx tools/tests/human.ts
 */
import * as THREE from 'three';
import { readFileSync, readdirSync } from 'node:fs';
import { CombatState, ComboCounter, GRAB_AT, bowPose, legs, staffPose, swingPose, backFrame, stanceFrame } from '../../src/render/human/anim';

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
  const after = bowPose(0.6, 0.5, 0, 0);
  ok('bow drawn and arrow nocked before the shot', (before.draw ?? 0) > 0.6 && !!before.arrow);
  ok('bow released after the shot', (after.draw ?? 0) < 0.3 && !after.arrow);
  const st = stanceFrame('bow', 0, 0);
  ok('bow held level across the chest (limbs left-right)', Math.abs(st.a.y) < 0.2 && Math.abs(st.a.x) > 0.9);
  const charge = staffPose(0.3, 0.5, 0, 0);
  const release = staffPose(0.52, 0.5, 0, 0);
  ok('staff gathers magic before the cast', (charge.orb ?? 0) > 0.2);
  ok('staff flashes at the release', (release.flash ?? 0) > 0);
  ok('staff points at the target on the cast', release.frame.a.z > 0.5);
}

// mounts: sword and bow go to the back
{
  ok('sword sheath on the back', backFrame('sword').g.z < 0);
  ok('bow carried on the back', backFrame('bow').g.z < 0);
}

// legs: 8 directions relative to the facing
{
  const fwd = legs(new THREE.Vector2(0, 3), 1);
  const back = legs(new THREE.Vector2(0, -3), 1);
  const side = legs(new THREE.Vector2(3, 0), 1);
  ok('backwards walk swings legs the other way', fwd.axis.dot(back.axis) < -0.9);
  ok('strafe swings across the side direction', Math.abs(side.axis.z) > 0.9);
  ok('standing still: no swing', legs(new THREE.Vector2(0, 0), 1).swingR === 0);
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

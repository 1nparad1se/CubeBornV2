/**
 * RPG stage 6 (docs/rpg2/IMPLEMENTATION.md): save slots — separate playthroughs, the start record,
 * queues 3 / 3 / 1 / 3, unlimited manual records, «Продолжить», write-verify-replace, load errors,
 * migration with a backup and the import of the stage 1–5 record.
 * Run: npx tsx tools/tests/rpg2saves.ts
 */
import { HeroState } from '../../src/rpg2/hero';
import { HeroMotor, type MotorGround } from '../../src/rpg2/motor';
import { newCombatData } from '../../src/rpg2/combat/system';
import { newGrowth } from '../../src/rpg2/growth/growth';
import { newEconomyWorld } from '../../src/rpg2/economy/world';
import { SaveError, TEST_SAVE_KEY, snapshot, type PlaythroughSave } from '../../src/rpg2/save';
import { ActiveTime } from '../../src/rpg2/time';
import { newStory } from '../../src/rpg2/story/world';
import { INDEX_KEY, SlotStore, type KV } from '../../src/rpg2/slots';

let fails = 0;
const ok = (c: boolean, msg: string) => {
  console.log((c ? 'ok   ' : 'FAIL ') + msg);
  if (!c) fails++;
};
class Mem implements KV {
  m = new Map<string, string>();
  failNext = false;
  getItem(k: string) {
    return this.m.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    if (this.failNext) throw new Error('quota');
    this.m.set(k, v);
  }
  removeItem(k: string) {
    this.m.delete(k);
  }
}
const ground: MotorGround = { top: () => 0, wall: () => false, water: () => null };
const snap = (level = 1, gold = 0): PlaythroughSave => {
  const g = newGrowth('sword1');
  g.gold = gold;
  const hero = new HeroState();
  hero.progress.level = level;
  const combat = newCombatData('start');
  combat.quick = [g.equip.weapon, null, null, null];
  return snapshot({ id: 'x', map: 'rpg_test', name: 'И', race: 'human', hero, motor: new HeroMotor(ground, 5, 5).toSave(), time: new ActiveTime(), combat, growth: g, world: newEconomyWorld(g), story: newStory() });
};

const kv = new Mem();
const st = new SlotStore(kv);
const a = st.createPlaythrough('A', 'normal');
ok(Array.isArray(st.write(a.id, snap(1, 0), [{ kind: 'start' }])), 'start record written');
for (let i = 1; i <= 5; i++) st.write(a.id, snap(1, i), [{ kind: 'auto' }]);
for (let i = 1; i <= 4; i++) st.write(a.id, snap(1, 10 + i), [{ kind: 'event' }]);
for (let i = 1; i <= 2; i++) st.write(a.id, snap(1, 20 + i), [{ kind: 'exit' }]);
for (let i = 1; i <= 4; i++) st.write(a.id, snap(1, 30 + i), [{ kind: 'quick' }]);
const count = (k: string) => st.records(a.id).filter((r) => r.kind === k).length;
ok(count('start') === 1 && count('auto') === 3 && count('event') === 3 && count('exit') === 1 && count('quick') === 3, 'queues 1 start / 3 auto / 3 event / 1 exit / 3 quick');
ok(st.read(st.latest(a.id, 'auto')!.key).growth.gold === 5 && st.read(st.records(a.id).filter((r) => r.kind === 'auto').pop()!.key).growth.gold === 3, 'the oldest auto records were evicted');
ok(st.read(st.latest(a.id, 'start')!.key).growth.gold === 0, 'the start record is never evicted');
ok(st.read(st.latest(a.id, 'quick')!.key).growth.gold === 34, 'F9 target: the latest quicksave');
const keysNow = [...kv.m.keys()].filter((k) => k.startsWith('cubeborn.rpg2.rec.')).length;
ok(keysNow === st.records(a.id).length, 'evicted record bodies are removed from storage');
for (let i = 0; i < 12; i++) st.write(a.id, snap(1, 100 + i), [{ kind: 'manual', name: `M${i}` }]);
ok(count('manual') === 12 && count('auto') === 3, 'manual saves unlimited and never evict queues');
const m3 = st.records(a.id).find((r) => r.name === 'M3')!;
st.write(a.id, snap(1, 999), [{ kind: 'manual', name: 'M3', replace: m3.key }]);
ok(count('manual') === 12 && st.read(st.records(a.id).find((r) => r.name === 'M3')!.key).growth.gold === 999, 'overwrite replaces only that manual record');
ok(st.deleteRecord(a.id, st.records(a.id).find((r) => r.name === 'M4')!.key) && count('manual') === 11, 'delete a manual record');
ok(!st.deleteRecord(a.id, st.latest(a.id, 'auto')!.key), 'autosaves cannot be deleted by hand');
// dual record from one snapshot (D213)
const dual = st.write(a.id, snap(2, 555), [{ kind: 'auto' }, { kind: 'event', note: 'x' }]);
ok(Array.isArray(dual) && dual.length === 2 && kv.getItem(dual[0].key) === kv.getItem(dual[1].key), 'periodic + event: two records of one snapshot');
// separate playthroughs and «Продолжить»
const b = st.createPlaythrough('B', 'normal');
st.write(b.id, snap(1, 7), [{ kind: 'start' }]);
ok(st.continueTarget()!.pt.id === b.id, 'Продолжить: the last opened playthrough');
st.setLast(a.id);
ok(st.continueTarget()!.pt.id === a.id && st.read(st.continueTarget()!.rec.key).growth.gold === 555, 'a newer record of another playthrough does not take over');
ok(st.records(b.id).length === 1 && count('auto') === 3, 'histories of playthroughs are separate');
// write failure keeps everything
const before = JSON.stringify([...kv.m.entries()]);
kv.failNext = true;
const r = st.write(a.id, snap(1, 1), [{ kind: 'quick' }]);
kv.failNext = false;
ok(typeof r === 'string' && JSON.stringify([...kv.m.entries()]) === before, 'a failed write changes nothing');
// load errors
const bad = st.latest(a.id, 'quick')!;
kv.setItem(bad.key, '{broken');
let why = '';
try {
  st.read(bad.key);
} catch (e) {
  why = e instanceof SaveError ? e.message : '';
}
ok(why === 'Файл сохранения повреждён', 'a broken record gives a reason');
const newer = JSON.parse(kv.getItem(st.latest(a.id, 'auto')!.key)!);
newer.version = 99;
kv.setItem(bad.key, JSON.stringify(newer));
try {
  st.read(bad.key);
} catch (e) {
  why = (e as Error).message;
}
ok(why.includes('более новой версией'), 'a newer format is refused with a clear message');
// migration with a backup
const old = JSON.parse(kv.getItem(st.latest(a.id, 'auto')!.key)!);
old.version = 4;
delete old.story;
kv.setItem(bad.key, JSON.stringify(old));
const mig = st.read(bad.key);
ok(mig.version === 5 && kv.getItem(bad.key + '.backup.v4') !== null && JSON.parse(kv.getItem(bad.key)!).version === 5, 'v4 record upgraded, original kept as a backup');
// import of the stage 1–5 single record
const kv2 = new Mem();
kv2.setItem(TEST_SAVE_KEY, JSON.stringify(snap(3, 42)));
const st2 = new SlotStore(kv2);
const ct = st2.continueTarget();
ok(!!ct && st2.read(ct.rec.key).growth.gold === 42 && kv2.getItem(TEST_SAVE_KEY) !== null && kv2.getItem(INDEX_KEY) !== null, 'the old single record becomes a playthrough; the original stays');
console.log(fails ? `\n${fails} failed` : '\nall passed');
process.exit(fails ? 1 : 0);

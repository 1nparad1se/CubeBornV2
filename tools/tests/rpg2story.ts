/**
 * RPG stage 5 (docs/rpg2/IMPLEMENTATION.md): quests (accept, kills, turn-in checks before any
 * deduction, cancel / re-accept, quest items, markers), sleep wake times and the v5 save.
 * Run: npx tsx tools/tests/rpg2story.ts
 */
import { HeroState } from '../../src/rpg2/hero';
import { HeroMotor, type MotorGround } from '../../src/rpg2/motor';
import { newCombatData } from '../../src/rpg2/combat/system';
import { ENEMIES } from '../../src/rpg2/combat/data';
import { newGrowth } from '../../src/rpg2/growth/growth';
import { addStack, stackCount } from '../../src/rpg2/economy/bag';
import { newEconomyWorld } from '../../src/rpg2/economy/world';
import { PLAYTHROUGH_VERSION, migratePlaythrough, restore, snapshot } from '../../src/rpg2/save';
import { ActiveTime } from '../../src/rpg2/time';
import { QUEST_DEFS, accept, cancel, deliver, explore, isReady, markerOf, offersOf, onKill, talk, talkTopics, turnIn, turnInProblem, type QuestCtx } from '../../src/rpg2/story/quests';
import { BESTIARY_BY_ID, checkStory, newStory, wakeAt, zoneOf } from '../../src/rpg2/story/world';

let fails = 0;
const ok = (c: boolean, msg: string) => {
  console.log((c ? 'ok   ' : 'FAIL ') + msg);
  if (!c) fails++;
};
const ground: MotorGround = { top: () => 0, wall: () => false, water: () => null };

const story = newStory();
const g = newGrowth('sword1');
const hero = new HeroState();
const c: QuestCtx = { q: story.q, g, hero, day: 0, minutes: 480 };
let uid = 1000;
const next = () => 'q' + uid++;

// ------------------------------------------------------------------ data
ok(QUEST_DEFS.length === 10, 'ten catalog quests');
ok(ENEMIES.filter((e) => BESTIARY_BY_ID[e.id]).length === ENEMIES.length, 'every enemy of the scene has a bestiary row');
ok(zoneOf('wolf') === 'old-trail' && zoneOf('bandit') === 'river-crossing', 'quest zones of wolves and bandits');

// ------------------------------------------------------------------ first quest
ok(markerOf(c, 'lada') === '!' && markerOf(c, 'hunter') === null, '«!» only where a quest can be given now');
ok(offersOf(c, 'hunter').length === 0, 'locked quests are not offered (no future quests shown)');
ok(accept(c, 'first') === null && accept(c, 'first') !== null, 'accept once');
ok(markerOf(c, 'lada') === null, 'no sign for an intermediate step');
ok(turnInProblem(c, 'first', 'lada') !== null && 'error' in turnIn(c, 'first', 'lada', next), 'turn-in refused before the objective');
ok(talkTopics(c, 'arden').length === 1 && talk(c, 'first', 0, 'hira') !== null, 'talk topic only at Арден');
ok(talk(c, 'first', 0, 'arden') === null && isReady(c, 'first'), 'talk completes the objective');
ok(markerOf(c, 'lada') === '?', '«?» when the turn-in is ready');
const xp0 = hero.progress.xp + hero.progress.level * 1e6;
const gold0 = g.gold;
const pot0 = stackCount(g, 'potionHP1');
ok(isReady(c, 'first') && g.gold === gold0, 'no reward without the explicit command');
const r1 = turnIn(c, 'first', 'lada', next);
ok(!('error' in r1) && g.gold === gold0 + 35 && stackCount(g, 'potionHP1') === pot0 + 1 && hero.progress.xp + hero.progress.level * 1e6 > xp0, 'reward on turn-in: 100 XP, 35 gold, a potion');
ok('error' in turnIn(c, 'first', 'lada', next) && g.gold === gold0 + 35, 'no second reward');
ok(story.q.history.map((h) => h.event).join(',') === 'accepted,completed', 'journal history');

// ------------------------------------------------------------------ materials: checks before any deduction
ok(accept(c, 'herbs') === null, 'herbs accepted');
addStack(g, 'red', 4);
const goldH = g.gold;
ok('error' in turnIn(c, 'herbs', 'alchemist', next) && stackCount(g, 'red') === 4 && g.gold === goldH, 'too few herbs: nothing deducted, nothing given');
ok('error' in turnIn(c, 'herbs', 'lada', next), 'wrong NPC refused');
addStack(g, 'red', 3);
ok(!('error' in turnIn(c, 'herbs', 'alchemist', next)) && stackCount(g, 'red') === 1 && g.gold === goldH + 45, 'six herbs taken once, reward given');

// ------------------------------------------------------------------ kills, cancel and re-accept
ok(accept(c, 'wolves') === null, 'wolves accepted');
onKill(c, 'wolf', 'river-crossing');
ok(story.q.quests.wolves.progress[0] === 0, 'a wolf outside the zone does not count');
ok(onKill(c, 'wolf', 'old-trail').includes('wolves') && story.q.quests.wolves.progress[0] === 1, 'a credited wolf kill advances the quest');
onKill(c, 'rat', 'old-trail');
ok(story.q.quests.wolves.progress[0] === 1, 'another species does not count');
story.q.tracked = 'wolves';
ok(cancel(c, 'wolves') === null && story.q.quests.wolves.status === 'failed' && story.q.tracked === null, 'side quest cancelled, tracking removed');
ok(cancel(c, 'first') !== null, 'main quest cannot be cancelled');
ok(accept(c, 'wolves') === null && story.q.quests.wolves.progress[0] === 0 && story.q.quests.wolves.attempts === 2, 're-accepted from zero');
for (let i = 0; i < 5; i++) onKill(c, 'wolf', 'old-trail');
ok(story.q.quests.wolves.progress[0] === 3, 'progress stops at the count');
const items0 = g.items.length;
ok(!('error' in turnIn(c, 'wolves', 'hunter', next)) && g.items.length === items0 + 1, 'reward gear given once');

// ------------------------------------------------------------------ quest items (the letter)
ok(accept(c, 'parcel') === null && story.q.tokens.includes('sealed-letter'), 'the letter is given on accept');
ok(deliver(c, 'parcel', 0, 'cook') !== null && story.q.tokens.includes('sealed-letter'), 'a wrong NPC does not take it');
ok(markerOf(c, 'smith') !== '?', 'no «?» over the intermediate receiver');
ok(deliver(c, 'parcel', 0, 'smith') === null && !story.q.tokens.includes('sealed-letter'), 'delivered to the smith');
ok(!('error' in turnIn(c, 'parcel', 'lada', next)), 'parcel reported to Лада');
ok(accept(c, 'ruins') === null && explore(c, 'old-ruins').includes('ruins') && isReady(c, 'ruins'), 'the arch completes «Следы прошлого»');
ok(!('error' in turnIn(c, 'ruins', 'oren', next)), 'ruins turned in to Орен');
// a cancelled side quest with a quest item: none is the case in the catalog, so check the rule on supplies
ok(accept(c, 'supplies') === null && cancel(c, 'supplies') === null && accept(c, 'supplies') === null, 'supplies cancel / re-accept');

// ------------------------------------------------------------------ bandits: choice reward
ok(hero.progress.level < 10 && accept(c, 'bandits') !== null, 'bandits need level 10');
hero.progress.level = 10;
ok(accept(c, 'bandits') === null, 'bandits accepted');
for (let i = 0; i < 4; i++) onKill(c, 'bandit', 'river-crossing');
ok(turnInProblem(c, 'bandits', 'lada') === 'Выберите одну награду', 'a reward must be chosen');
const it0 = g.items.length;
ok(!('error' in turnIn(c, 'bandits', 'lada', next, 'bow2')) && g.items[g.items.length - 1].tpl === 'bow2' && g.items.length === it0 + 1, 'one chosen weapon');

// ------------------------------------------------------------------ sleep
ok(JSON.stringify(wakeAt(0, 480, 12)) === JSON.stringify({ day: 0, minutes: 720 }), 'sleep 08:00 → 12:00 same day');
ok(JSON.stringify(wakeAt(0, 720, 12)) === JSON.stringify({ day: 1, minutes: 720 }), 'the same hour wakes next day');
ok(JSON.stringify(wakeAt(0, 1300, 6)) === JSON.stringify({ day: 1, minutes: 360 }), 'a past hour wakes next day');
ok(JSON.stringify(wakeAt(2, 100, 0)) === JSON.stringify({ day: 3, minutes: 0 }), 'midnight is the next midnight');

// ------------------------------------------------------------------ save v5
story.bestiary.wolf = 2;
story.bestiary.bandit = 1;
story.pois.push('quiet-valley');
story.visited.push('quiet-valley');
story.waystones.push('waystone-quiet-valley');
story.marks.push({ x: 10, z: 12, label: 'Метка 1' });
const combat = newCombatData('start');
combat.quick = [g.equip.weapon, null, null, null];
const world = newEconomyWorld(g);
const snap = snapshot({ id: 't', map: 'rpg_test', name: 'И', race: 'human', hero, motor: new HeroMotor(ground, 5, 5).toSave(), time: new ActiveTime(), combat, growth: g, world, story });
ok(snap.version === PLAYTHROUGH_VERSION && PLAYTHROUGH_VERSION === 5, 'save version 5');
const back = restore(migratePlaythrough(JSON.parse(JSON.stringify(snap))).save);
ok(JSON.stringify(back.story) === JSON.stringify(story), 'story round trip');
const old = JSON.parse(JSON.stringify(snap));
old.version = 4;
delete old.story;
const mig = migratePlaythrough(old);
ok(mig.migrated && mig.save.version === 5 && JSON.stringify(mig.save.story) === JSON.stringify(newStory()), 'v4 → v5: an empty story');
let threw = false;
try {
  checkStory({ q: { quests: { first: { status: 'weird', progress: [0] } } } });
} catch {
  threw = true;
}
ok(threw, 'a broken story block is refused');

console.log(fails ? `\n${fails} failed` : '\nall passed');
process.exit(fails ? 1 : 0);

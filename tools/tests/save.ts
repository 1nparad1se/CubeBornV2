/** Save v9 (v8 characters migrate, older heroes are dropped): old saves keep only settings, old heroes and world data are dropped, a backup is kept. Run: npx tsx tools/tests/save.ts */
import { BACKUP_KEY, BACKUP_KEY_V8, VERSION, loadSave, migrate, writeSave, type SaveStorage } from '../../src/meta/Save';
import { newChar } from '../../src/meta/Characters';

let fails = 0;
const ok = (c: boolean, msg: string) => {
  console.log((c ? 'ok   ' : 'FAIL ') + msg);
  if (!c) fails++;
};
(globalThis as any).navigator ??= { language: 'ru-RU' };
const mem = (init: Record<string, string> = {}): SaveStorage & { m: Map<string, string> } => {
  const m = new Map(Object.entries(init));
  return { m, getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
};
const old = {
  version: 7,
  settings: { master: 0.4, shadows: 'low', keybinds: { skillQ: ['KeyQ'], dodge: ['Space'] }, enemyHealthBars: 'all' },
  chars: [{ id: 'a', name: 'Брам', cls: 'berserker', level: 31, skills: [3, 3, 3, 3, 1, 1, 1, 1], cpos: { x: 4100, z: 3900 }, uniq: ['camp1'] }],
  activeChar: 'a',
  bestiary: ['cave_orc', 'wild_boar'],
  clock: { minutes: 700, days: 3 },
};
const raw = JSON.stringify(old);
const st = mem({ 'cubeborn.save.v1': raw });
const d = loadSave(st);
ok(d.version === VERSION && VERSION === 9, 'save version is 9');
ok(d.chars.length === 0 && d.activeChar === null, 'old class heroes are dropped');
ok(!('bestiary' in d), 'bestiary (old creatures) is gone');
ok(d.settings.master === 0.4 && d.settings.shadows === 'low', 'settings are kept');
ok(!('enemyHealthBars' in d.settings) && !('skillQ' in d.settings.keybinds) && d.settings.keybinds.jump[0] === 'Space', 'old settings of removed systems dropped, key bindings reset');
ok(st.m.get(BACKUP_KEY) === raw, 'the original save is backed up under ' + BACKUP_KEY);
const stored = JSON.parse(st.m.get('cubeborn.save.v1')!);
ok(stored.version === 9 && stored.chars.length === 0 && !JSON.stringify(stored).includes('berserker') && !JSON.stringify(stored).includes('cpos'), 'the stored save is rewritten: nothing old can come back');
// a second load does not overwrite the backup
st.m.set('cubeborn.save.v1', JSON.stringify({ ...old, version: 6 }));
loadSave(st);
ok(st.m.get(BACKUP_KEY) === raw, 'the backup is written once and never overwritten');
// v8 characters survive a round trip
const c = newChar('Ратибор', 'human');
const s2 = mem();
writeSave({ version: 9, settings: d.settings, chars: [c], activeChar: c.id }, s2);
const back = loadSave(s2);
ok(back.chars.length === 1 && back.chars[0].race === 'human' && back.chars[0].gear.bag.filter(Boolean).length === 16, 'a new human with the 16 starter items loads back');
ok(!s2.m.has(BACKUP_KEY), 'a current save is not backed up');
// a v8 save holding an old-style class hero (no race) drops it
const mixed = migrate({ version: 9, settings: {}, chars: [{ id: 'x', name: 'Old', cls: 'paladin' }, c] });
ok(mixed.chars.length === 1 && mixed.chars[0].id === c.id, 'characters without a playable race are dropped');
// an unavailable race cannot be created
ok(newChar('Гимли', 'dwarf').race === 'human', 'races that are not available yet fall back to human');
// key bindings: Tab and I open the inventory, M the map; old untouched defaults follow
const kb = migrate({ version: 9, settings: { keybinds: { inventory: ['KeyI', 'KeyB'], jump: ['Space'] } }, chars: [] }).settings.keybinds;
ok(kb.inventory.includes('KeyI') && kb.inventory.includes('Tab') && kb.map[0] === 'KeyM', 'inventory on I / Tab (old I / B default updated), map on M');
const custom = migrate({ version: 9, settings: { keybinds: { inventory: ['KeyU'] } }, chars: [] }).settings.keybinds;
ok(custom.inventory.length === 1 && custom.inventory[0] === 'KeyU', 'a custom inventory key is kept');
// v8 → v9: the removed weapons leave the saved characters, a backup of the v8 save is kept
{
  const gone = ['sword_guard2h', 'spear_militia', 'staff_apprentice', 'crossbow_light'];
  const mk = (id: string, equip: any, bag: (string | null)[]) => ({ id, name: id, race: 'human', level: 5, xp: 10, gear: { equip, bag }, created: 1, playTime: 7, lastPlayed: 2 });
  const noEq = { off: null, head: null, hands: null, feet: null, body: null };
  const v8 = {
    version: 8,
    settings: { master: 0.3 },
    chars: [
      mk('spear', { ...noEq, main: 'spear_militia', off: null }, ['sword_recruit', 'sword_guard2h', null, 'crossbow_light', 'shield_wood', 'bow_hunter', 'staff_apprentice', 'staff_spark', 'app_hood']),
      mk('bow', { ...noEq, main: 'bow_hunter' }, ['sword_guard2h', 'sword_recruit']),
      mk('plain', { ...noEq, main: 'sword_recruit', off: 'shield_wood', body: 'guard_cuirass' }, ['spear_militia', 'guard_boots']),
    ],
    activeChar: 'spear',
    clock: { minutes: 100, days: 2 },
  };
  const raw8 = JSON.stringify(v8);
  const s8 = mem({ 'cubeborn.save.v1': raw8 });
  const m = loadSave(s8);
  ok(m.version === 9 && m.chars.length === 3 && m.activeChar === 'spear', 'v8 characters survive the move to v9');
  ok(s8.m.get(BACKUP_KEY_V8) === raw8 && !s8.m.has(BACKUP_KEY), 'the v8 save is backed up under ' + BACKUP_KEY_V8);
  const all = m.chars.flatMap((c) => [...Object.values(c.gear.equip), ...c.gear.bag]);
  ok(all.every((id) => !id || !gone.includes(id)), 'no removed weapon is left in any equipment or bag');
  const sp = m.chars[0].gear;
  ok(sp.equip.main === 'sword_recruit' && sp.bag.filter((x) => x === 'sword_recruit').length === 0, 'an equipped removed weapon is replaced by the starter sword (no copy stays in the bag)');
  ok(['shield_wood', 'bow_hunter', 'staff_spark', 'app_hood'].every((id) => sp.bag.includes(id)), 'the other bag items are kept');
  ok(m.chars[1].gear.equip.main === 'bow_hunter' && m.chars[1].gear.bag.includes('sword_recruit'), 'a kept equipped weapon stays equipped');
  const pl = m.chars[2].gear;
  ok(pl.equip.main === 'sword_recruit' && pl.equip.off === 'shield_wood' && pl.equip.body === 'guard_cuirass' && pl.bag.includes('guard_boots'), 'a character without removed weapons is unchanged');
  ok(m.chars[0].level === 5 && m.chars[0].playTime === 7 && m.settings.master === 0.3 && m.clock?.days === 2, 'level, play time, settings and the clock are kept');
  ok(JSON.parse(s8.m.get('cubeborn.save.v1')!).version === 9, 'the stored save is rewritten as v9');
}
console.log(fails ? `${fails} save check(s) FAILED` : 'all save checks passed');
process.exit(fails ? 1 : 0);

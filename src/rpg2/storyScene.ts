import * as THREE from 'three';
import { h } from '../ui/dom';
import { pxIcon } from '../ui/pixelIcons';
import type { CombatSystem } from './combat/system';
import { enemyDef, type EnemyState } from './combat/enemy';
import type { GrowthData } from './growth/growth';
import type { HeroState } from './hero';
import type { HeroMotor, MotorGround } from './motor';
import { QUEST_BY_ID, explore, isReady, markerOf, npcName, objectiveCount, onKill, type QuestCtx } from './story/quests';
import { ARCH, BED, BESTIARY_BY_ID, DESTINATIONS, NPC_SPOTS, POIS, RUNE_DEST, TRAVEL_PREP, VISIT_RADIUS, WAYSTONES, zoneOf, type StoryData } from './story/world';
import type { Target } from './economyScene';

/** What the stage 5 scene glue needs from the test scene. */
export interface StorySceneHost {
  hero: HeroState;
  growth: GrowthData;
  story: StoryData;
  motor: HeroMotor;
  combat: CombatSystem;
  ground: MotorGround;
  forward(): [number, number];
  clock(): { day: number; minutes: number };
  toast(t: string): void;
  addObject(o: THREE.Object3D): void;
  label(text: string): THREE.Sprite;
  /** Puts the hero on the ground at (x, z) (travel). */
  teleport(x: number, z: number): void;
  /** D042: the first waystone activation makes an event autosave. */
  eventSave(why: string): void;
}

const SEE_RANGE = 30;
const VIEW_COS = Math.cos((60 * Math.PI) / 180);

/** A started travel (D069): 5 s standing still; the start position and HP are watched. */
export interface TravelPrep {
  kind: 'stone' | 'rune';
  dest: string;
  t: number;
  x: number;
  z: number;
  hp: number;
}

/**
 * Stage 5 in the test scene: Лада and Орен, the well, the hero bed, two waystones and the arch of
 * the ruins (cubic placeholders); quest markers over NPCs (D110–D114); discovery of places and rune
 * destinations; bestiary sightings and credited kills; travel preparation; the tracked quest on the HUD.
 */
export class StoryScene {
  prep: TravelPrep | null = null;
  private markers = new Map<string, THREE.Sprite>();
  private markerTex: Record<'!' | '?', THREE.SpriteMaterial>;
  private track: HTMLElement;
  private prepEl: HTMLElement;
  private trackKey = '';

  constructor(private s: StorySceneHost, root: HTMLElement) {
    this.track = h('div.r2.r2-track.r2-panel');
    this.prepEl = h('div.r2.r2-prep.r2-panel');
    this.prepEl.style.display = 'none';
    root.append(this.track, this.prepEl);
    this.markerTex = { '!': this.markerMat('!', '#ffd84a'), '?': this.markerMat('?', '#7fe0ff') };
    this.build();
  }

  dispose() {
    this.track.remove();
    this.prepEl.remove();
  }

  private ctx(): QuestCtx {
    const c = this.s.clock();
    return { q: this.s.story.q, g: this.s.growth, hero: this.s.hero, day: c.day, minutes: c.minutes };
  }

  // ------------------------------------------------------------------ drawing
  private markerMat(ch: string, color: string): THREE.SpriteMaterial {
    const cv = document.createElement('canvas');
    cv.width = cv.height = 16;
    const g = cv.getContext('2d')!;
    g.fillStyle = '#1a1208';
    g.fillRect(4, 0, 8, 16);
    g.fillStyle = color;
    // pixel glyphs (cubic, no font)
    const px = (x: number, y: number) => g.fillRect(x, y, 2, 2);
    if (ch === '!') {
      for (let y = 1; y <= 9; y += 2) px(7, y);
      px(7, 13);
    } else {
      px(5, 1); px(7, 1); px(9, 1); px(9, 3); px(9, 5); px(7, 7); px(7, 9); px(7, 13);
      px(5, 3);
    }
    const t = new THREE.CanvasTexture(cv);
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestFilter;
    return new THREE.SpriteMaterial({ map: t, depthTest: false, transparent: true });
  }
  private box(g: THREE.Group, w: number, hh: number, d: number, color: number, x: number, y: number, z: number) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, hh, d), new THREE.MeshLambertMaterial({ color }));
    m.position.set(x, y, z);
    g.add(m);
  }
  private figure(g: THREE.Group, x: number, z: number, cloth: number, name: string) {
    const y = this.s.ground.top(x, z);
    this.box(g, 0.5, 0.75, 0.3, 0x3a2f28, x, y + 0.375, z);
    this.box(g, 0.6, 0.75, 0.35, cloth, x, y + 1.125, z);
    this.box(g, 0.5, 0.5, 0.5, 0xd9a87c, x, y + 1.75, z);
    const l = this.s.label(name);
    l.position.set(x, y + 2.4, z);
    g.add(l);
  }
  private build() {
    const g = new THREE.Group();
    const top = (x: number, z: number) => this.s.ground.top(x, z);
    for (const id of ['lada', 'oren']) {
      const sp = NPC_SPOTS.find((n) => n.id === id)!;
      this.figure(g, sp.x, sp.z, sp.color, npcName(id));
    }
    // the well of Тихая Долина
    const wy = top(60, 64);
    for (const [dx, dz, w, d] of [[0, -0.6, 1.4, 0.2], [0, 0.6, 1.4, 0.2], [-0.6, 0, 0.2, 1.0], [0.6, 0, 0.2, 1.0]] as const) this.box(g, w, 0.7, d, 0x77736c, 60 + dx, wy + 0.35, 64 + dz);
    this.box(g, 1.0, 0.1, 1.0, 0x2a4a7a, 60, wy + 0.5, 64);
    // the hero bed (D082)
    const by = top(BED.x, BED.z);
    this.box(g, 1, 0.4, 2, 0x6a4a2a, BED.x, by + 0.2, BED.z);
    this.box(g, 0.9, 0.12, 1.4, 0xb03a3a, BED.x, by + 0.46, BED.z + 0.25);
    this.box(g, 0.8, 0.14, 0.4, 0xeeeeee, BED.x, by + 0.47, BED.z - 0.7);
    const bl = this.s.label('Кровать героя');
    bl.position.set(BED.x, by + 1.3, BED.z);
    g.add(bl);
    for (const w of WAYSTONES) {
      const y = top(w.x, w.z);
      this.box(g, 0.8, 2.2, 0.6, 0x6a6e78, w.x, y + 1.1, w.z);
      this.box(g, 0.3, 0.3, 0.62, 0x7ad0ff, w.x, y + 1.6, w.z);
      const l = this.s.label(w.name);
      l.position.set(w.x, y + 2.8, w.z);
      g.add(l);
    }
    const ay = top(ARCH.x, ARCH.z);
    this.box(g, 0.8, 3, 0.8, 0x8a8478, ARCH.x - 1.2, ay + 1.5, ARCH.z);
    this.box(g, 0.8, 3, 0.8, 0x8a8478, ARCH.x + 1.2, ay + 1.5, ARCH.z);
    this.box(g, 3.2, 0.8, 0.8, 0x77736c, ARCH.x, ay + 3.4, ARCH.z);
    const al = this.s.label('Арка старых руин');
    al.position.set(ARCH.x, ay + 4.3, ARCH.z);
    g.add(al);
    for (const sp of NPC_SPOTS) {
      const m = new THREE.Sprite(this.markerTex['!']);
      m.scale.set(0.5, 0.9, 1);
      m.position.set(sp.x, top(sp.x, sp.z) + 3.0, sp.z);
      m.visible = false;
      g.add(m);
      this.markers.set(sp.id, m);
    }
    this.s.addObject(g);
  }

  // ------------------------------------------------------------------ targets (E)
  targets(): Target[] {
    const out: Target[] = [];
    for (const id of ['lada', 'oren']) {
      const sp = NPC_SPOTS.find((n) => n.id === id)!;
      out.push({ kind: 'npc', id, x: sp.x, z: sp.z, name: npcName(id) });
    }
    out.push({ kind: 'bed', id: 'bed', x: BED.x, z: BED.z, name: 'Кровать героя' });
    for (const w of WAYSTONES) out.push({ kind: 'stone', id: w.id, x: w.x, z: w.z, name: w.name });
    out.push({ kind: 'arch', id: 'arch', x: ARCH.x, z: ARCH.z, name: 'Арка старых руин' });
    return out;
  }

  /** The arch of the ruins: the explore objective counts when the hero examines it (E). */
  examineArch(): string {
    const done = explore(this.ctx(), ARCH.place);
    return done.length ? `Арка осмотрена: ${done.map((id) => `«${QUEST_BY_ID[id].name}»`).join(', ')}` : 'Старая арка, поросшая мхом.';
  }

  // ------------------------------------------------------------------ world checks
  /** One credited kill advances every matching quest (D107) and opens the full bestiary entry (D062). */
  onCredited(e: EnemyState) {
    const def = enemyDef(e);
    if (BESTIARY_BY_ID[def.id]) {
      if (this.s.story.bestiary[def.id] !== 2) this.s.toast(`Бестиарий: полная запись — ${def.name}`);
      this.s.story.bestiary[def.id] = 2;
    }
    const adv = onKill(this.ctx(), def.id, zoneOf(def.id));
    if (adv.length) this.s.toast(`Задание: ${adv.map((id) => QUEST_BY_ID[id].name).join(', ')} — ${def.name}`);
  }

  private seen(x: number, y: number, z: number): boolean {
    const m = this.s.motor;
    const dx = x - m.x;
    const dz = z - m.z;
    const d = Math.hypot(dx, dz);
    if (d > SEE_RANGE) return false;
    const [fx, fz] = this.s.forward();
    if (d > 1 && (dx * fx + dz * fz) / d < VIEW_COS) return false;
    return this.s.combat.los(m.x, m.y + 1.6, m.z, x, y, z);
  }

  /** Discovery (D063 / D064, no XP), rune destination visits (D067) and bestiary sightings (D061). */
  tick() {
    const st = this.s.story;
    const m = this.s.motor;
    for (const p of POIS) {
      if (st.pois.includes(p.id) || Math.hypot(p.x - m.x, p.z - m.z) > p.r) continue;
      st.pois.push(p.id);
      this.s.toast(p.hidden ? `Найдено тайное место: ${p.name}` : `Открыто место: ${p.name}`);
    }
    for (const [id, d] of Object.entries(DESTINATIONS))
      if (!st.visited.includes(id) && Math.hypot(d.x - m.x, d.z - m.z) <= VISIT_RADIUS) st.visited.push(id);
    for (const e of this.s.combat.data.enemies) {
      if (e.mode === 'dead') continue;
      const def = enemyDef(e);
      if (!BESTIARY_BY_ID[def.id] || st.bestiary[def.id]) continue;
      if (!this.seen(e.x, e.y + 0.6, e.z)) continue;
      st.bestiary[def.id] = 1;
      this.s.toast(`Бестиарий: новая запись — ${def.name}`);
    }
  }

  /** D110–D114: «?» over «!»; within 30 m, in view, with line of sight; never on the map. */
  updateMarkers() {
    const c = this.ctx();
    for (const sp of NPC_SPOTS) {
      const mk = this.markers.get(sp.id)!;
      const kind = markerOf(c, sp.id);
      const vis = !!kind && this.seen(sp.x, mk.position.y - 0.6, sp.z);
      mk.visible = vis;
      if (vis && mk.material !== this.markerTex[kind!]) mk.material = this.markerTex[kind!];
    }
  }

  /** D115: the tracked quest (name, objectives with counters, the receiving NPC when ready). */
  updateTrack(paused: boolean) {
    const q = this.s.story.q;
    const id = q.tracked;
    const st = id ? q.quests[id] : null;
    if (id && (!st || st.status !== 'active')) q.tracked = null;
    let key = '';
    let lines: string[] = [];
    if (q.tracked && !paused) {
      const d = QUEST_BY_ID[q.tracked];
      const c = this.ctx();
      lines = d.objectives.map((o, i) => {
        const n = objectiveCount(c, d.id, i);
        return `${n >= o.count ? '✓' : ''}${o.text}: ${Math.min(n, o.count)} / ${o.count}`;
      });
      if (isReady(c, d.id)) lines.push(`Сдать: ${npcName(d.npc)}`);
      key = d.name + '|' + lines.join('|');
      // mockup hud-07: the quest name, each objective with the quest's icon, «J — Журнал»
      const ico = ({ collect: 'red', kill: 'wolf', deliver: 'scroll', talk: 'chat', explore: 'map' } as Record<string, string>)[d.type] ?? 'quest';
      if (key !== this.trackKey)
        this.track.replaceChildren(h('b', d.name), ...lines.map((l) => h('div.r2-trow', pxIcon(l.startsWith('Сдать') ? 'mark-turnin' : ico, 24), l)), h('small.r2-tkey', 'J — Журнал'));
    }
    this.trackKey = key;
    this.track.style.display = key ? '' : 'none';
  }

  // ------------------------------------------------------------------ waystones, runes, travel
  activateStone(id: string, inCombat: boolean): string | null {
    const st = this.s.story;
    if (inCombat) return 'Камень активируется только вне боя';
    if (st.waystones.includes(id)) return 'Камень уже активирован';
    const first = st.waystones.length === 0;
    st.waystones.push(id);
    const w = WAYSTONES.find((x) => x.id === id)!;
    if (!st.visited.includes(w.dest)) st.visited.push(w.dest);
    this.s.toast(`Активирован: ${w.name}`);
    if (first) this.s.eventSave('waystone');
    return null;
  }

  /** Why the travel cannot start (D065–D070), or null. */
  travelProblem(kind: 'stone' | 'rune', dest: string, inCombat: boolean): string | null {
    if (inCombat) return 'Перемещение только вне боя';
    if (this.prep) return 'Подготовка уже идёт';
    if (kind === 'stone') {
      if (!this.s.story.waystones.includes(dest)) return 'Камень назначения не активирован';
      return null;
    }
    const place = RUNE_DEST[dest];
    if (!place || !DESTINATIONS[place]) return 'Место назначения руны недоступно на этой площадке';
    if (!this.s.growth.items.some((i) => i.tpl === dest)) return 'Нет такой руны';
    if (!this.s.story.visited.includes(place)) return `Сначала побывайте в месте «${DESTINATIONS[place].name}» (в пределах 5 м)`;
    return null;
  }

  startTravel(kind: 'stone' | 'rune', dest: string, inCombat: boolean): string | null {
    const p = this.travelProblem(kind, dest, inCombat);
    if (p) return p;
    const m = this.s.motor;
    this.prep = { kind, dest, t: 0, x: m.x, z: m.z, hp: this.s.hero.hp };
    return null;
  }

  private target(p: TravelPrep): { x: number; z: number; name: string } {
    if (p.kind === 'stone') {
      const w = WAYSTONES.find((x) => x.id === p.dest)!;
      return { x: w.x + 1.5, z: w.z + 1.5, name: DESTINATIONS[w.dest].name };
    }
    const d = DESTINATIONS[RUNE_DEST[p.dest]];
    return { x: d.x, z: d.z, name: d.name };
  }

  /** D069: movement, jump, dodge, attack, stun, damage or combat cancel; after 5 s the hero arrives. */
  stepTravel(dt: number, f: { moving: boolean; attacking: boolean; inCombat: boolean }) {
    const p = this.prep;
    if (!p) {
      this.prepEl.style.display = 'none';
      return;
    }
    const m = this.s.motor;
    const hero = this.s.hero;
    const why = f.moving || Math.hypot(m.x - p.x, m.z - p.z) > 0.05 || m.mode !== 'ground' || m.dodging ? 'Перемещение отменено: движение'
      : f.attacking ? 'Перемещение отменено: атака'
      : m.stunned ? 'Перемещение отменено: оглушение'
      : hero.hp < p.hp ? 'Перемещение отменено: урон'
      : f.inCombat ? 'Перемещение отменено: начался бой' : null;
    if (why) {
      this.prep = null;
      this.prepEl.style.display = 'none';
      this.s.toast(why);
      return;
    }
    p.t += dt;
    const tg = this.target(p);
    if (p.t >= TRAVEL_PREP) {
      this.prep = null;
      this.prepEl.style.display = 'none';
      this.s.teleport(tg.x, tg.z);
      this.s.toast(`Перемещение: ${tg.name}`);
      return;
    }
    this.prepEl.style.display = '';
    this.prepEl.textContent = `Подготовка перемещения: ${tg.name} — ${Math.max(0, TRAVEL_PREP - p.t).toFixed(1).replace('.', ',')} с (не двигайтесь)`;
  }

  cancelTravel(why?: string) {
    if (!this.prep) return;
    this.prep = null;
    this.prepEl.style.display = 'none';
    if (why) this.s.toast(why);
  }
}

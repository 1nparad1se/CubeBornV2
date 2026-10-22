import * as THREE from 'three';
import { h } from '../ui/dom';
import type { CombatSystem } from './combat/system';
import { enemyDef, type EnemyState } from './combat/enemy';
import type { GrowthData, MentorId } from './growth/growth';
import { MENTORS } from './growth/growth';
import type { HeroState } from './hero';
import type { HeroMotor } from './motor';
import type { MotorGround } from './motor';
import { SOURCE_BY_ID, gatherProblem, tickGather, tickNode, type GatherAction } from './economy/gather';
import { stackName } from './economy/goods';
import { STATION_NAME, type Station } from './economy/craft';
import { MERCHANTS, tickMerchant, type MerchantId } from './economy/trade';
import { CHEST_SPOTS, MERCHANT_SPOTS, NODE_SPOTS, STATION_SPOTS, corpseFromKill, type EconomyWorld } from './economy/world';
import type { EconomyScreens } from './ui/economyUi';

/** What the stage 4 scene glue needs from the test scene. */
export interface EcoSceneHost {
  hero: HeroState;
  growth: GrowthData;
  world: EconomyWorld;
  motor: HeroMotor;
  combat: CombatSystem;
  ground: MotorGround;
  eco: EconomyScreens;
  forward(): [number, number];
  toast(t: string): void;
  openMentor(id: MentorId): void;
  keyName(): string;
  addObject(o: THREE.Object3D): void;
  label(text: string): THREE.Sprite;
  /** Stage 5: NPC dialogues (mentors and merchants talk first), and the extra story targets. */
  openDialog(npc: string): void;
  extraTargets(): Target[];
  extraHint(t: Target, inCombat: boolean, key: string): string;
  useExtra(t: Target, inCombat: boolean): boolean;
}

/** One thing the hero can use with E (D129: up to 3 m, no obstacle; D130: the nearest under the aim). */
export interface Target {
  kind: 'mentor' | 'merchant' | 'station' | 'chest' | 'corpse' | 'node' | 'npc' | 'bed' | 'stone' | 'arch';
  id: string;
  x: number;
  z: number;
  name: string;
}

export const INTERACT_RANGE = 3;
/** The aim of the third-person camera: a narrow cone around the camera's forward direction. */
const AIM_COS = Math.cos((35 * Math.PI) / 180);

const MENTOR_SPOTS: { id: MentorId; x: number; z: number }[] = [
  { id: 'arden', x: 46, z: 55 },
  { id: 'hira', x: 46, z: 59 },
  { id: 'mira', x: 46, z: 63 },
];

/**
 * Stage 4 in the test scene: placeholder merchants, stations, one-off chests, resource points and
 * corpses (cubic boxes with labels), the E target and its hint, holding E to gather, and the
 * active-time timers of corpses, points and merchants.
 */
export class EconomyScene {
  gather: GatherAction | null = null;
  target: Target | null = null;
  private hint: HTMLElement;
  private nodeMeshes = new Map<string, THREE.Object3D>();
  private corpseMeshes = new Map<string, THREE.Object3D>();
  private corpseGroup = new THREE.Group();
  private lastHp = 0;

  constructor(private s: EcoSceneHost, root: HTMLElement) {
    this.hint = h('div.r2.r2-hint');
    this.hint.style.display = 'none';
    root.appendChild(this.hint);
    this.build();
  }

  dispose() {
    this.hint.remove();
  }

  // ------------------------------------------------------------------ drawing
  private box(g: THREE.Group, w: number, hh: number, d: number, color: number, x: number, y: number, z: number) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, hh, d), new THREE.MeshLambertMaterial({ color }));
    m.position.set(x, y, z);
    g.add(m);
    return m;
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
    const colors: Record<MerchantId, number> = { smith: 0x5a5a62, alchemist: 0x3a4f8f, cook: 0xb07a3a, hunter: 0x5b4a2a, supplier: 0x6b6b3a };
    for (const m of MERCHANT_SPOTS) this.figure(g, m.x, m.z, colors[m.id], `${MERCHANTS[m.id].name} · ${MERCHANTS[m.id].role}`);
    const stColor: Record<Station, number> = { forge: 0x4a4a4a, alchemy: 0x6a4a8a, stove: 0x8a4a2a };
    for (const st of STATION_SPOTS) {
      const y = this.s.ground.top(st.x, st.z);
      this.box(g, 1, 0.9, 1, stColor[st.id], st.x, y + 0.45, st.z);
      this.box(g, 0.6, 0.15, 0.6, st.id === 'stove' ? 0xff8a2a : st.id === 'forge' ? 0xd04a1a : 0x7ad0c0, st.x, y + 0.98, st.z);
      const l = this.s.label(STATION_NAME[st.id]);
      l.position.set(st.x, y + 1.6, st.z);
      g.add(l);
    }
    for (const c of CHEST_SPOTS) {
      const y = this.s.ground.top(c.x, c.z);
      this.box(g, 0.9, 0.6, 0.6, 0x7a5530, c.x, y + 0.3, c.z);
      this.box(g, 0.94, 0.12, 0.64, 0xb8913f, c.x, y + 0.62, c.z);
      const l = this.s.label(c.name);
      l.position.set(c.x, y + 1.2, c.z);
      g.add(l);
    }
    const nodeColor: Record<string, number> = {
      'node-red': 0xc0392b, 'node-blue': 0x2e6fd0, 'node-yellow': 0xe0c030, 'node-ore': 0x8a7a6a, 'node-wood': 0x7a5530,
      'node-moon': 0xd8e0ff, 'node-blood': 0x8a1020, 'node-starore': 0x6a7aa0, 'node-crystal': 0x80d0ff, 'node-oldwood': 0x4a3420,
    };
    for (const n of NODE_SPOTS) {
      const src = SOURCE_BY_ID[n.src];
      const y = this.s.ground.top(n.x, n.z);
      const grp = new THREE.Group();
      const plant = src.cycleSeconds === 1;
      this.box(grp, plant ? 0.4 : 0.8, plant ? 0.4 : 0.8, plant ? 0.4 : 0.8, nodeColor[n.src] ?? 0x888888, n.x, y + (plant ? 0.2 : 0.4), n.z);
      g.add(grp);
      this.nodeMeshes.set(n.id, grp);
      const l = this.s.label(src.name);
      l.position.set(n.x, y + 1.3, n.z);
      g.add(l);
    }
    g.add(this.corpseGroup);
    this.s.addObject(g);
    // mentors are drawn by the stage 3 code; Мира stands with them
  }

  /** Corpses and depleted points follow the state (cheap: only on change). */
  syncView() {
    const w = this.s.world;
    for (const n of NODE_SPOTS) {
      const m = this.nodeMeshes.get(n.id);
      if (m) m.visible = w.nodes[n.id].stock > 0;
    }
    const alive = new Set(w.corpses.map((c) => c.id));
    for (const [id, m] of this.corpseMeshes)
      if (!alive.has(id)) {
        this.corpseGroup.remove(m);
        this.corpseMeshes.delete(id);
      }
    for (const c of w.corpses) {
      if (this.corpseMeshes.has(c.id)) continue;
      const grp = new THREE.Group();
      const big = c.rank !== 'normal';
      const y = this.s.ground.top(c.x, c.z);
      this.box(grp, big ? 1.6 : 1.1, 0.35, big ? 0.8 : 0.55, 0x55524e, c.x, y + 0.18, c.z);
      this.box(grp, 0.4, 0.3, 0.35, 0x45423e, c.x + (big ? 0.95 : 0.7), y + 0.2, c.z);
      this.corpseGroup.add(grp);
      this.corpseMeshes.set(c.id, grp);
    }
  }

  // ------------------------------------------------------------------ deaths, timers
  onKilled(e: EnemyState) {
    const d = enemyDef(e);
    corpseFromKill(this.s.world, this.s.growth, e, d.name, d.rank);
  }

  /** Active-time timers (the world is paused in every menu, D026). */
  tick(dt: number, canRespawn: (x: number, z: number) => boolean) {
    const w = this.s.world;
    for (const c of w.corpses) c.left -= dt;
    w.corpses = w.corpses.filter((c) => c.left > 0);
    for (const n of NODE_SPOTS) tickNode(w.nodes[n.id], dt, () => canRespawn(n.x, n.z));
    for (const id of Object.keys(w.merchants) as MerchantId[]) tickMerchant(id, w.merchants[id], dt);
    const g = this.s.growth;
    if (g.potionCd > 0) g.potionCd = Math.max(0, g.potionCd - dt);
  }

  // ------------------------------------------------------------------ targets
  targets(): Target[] {
    const w = this.s.world;
    const out: Target[] = [];
    for (const m of MENTOR_SPOTS) out.push({ kind: 'mentor', id: m.id, x: m.x, z: m.z, name: MENTORS[m.id].name });
    for (const m of MERCHANT_SPOTS) out.push({ kind: 'merchant', id: m.id, x: m.x, z: m.z, name: MERCHANTS[m.id].name });
    for (const st of STATION_SPOTS) out.push({ kind: 'station', id: st.id, x: st.x, z: st.z, name: STATION_NAME[st.id] });
    for (const c of CHEST_SPOTS) out.push({ kind: 'chest', id: c.id, x: c.x, z: c.z, name: c.name });
    for (const c of w.corpses) out.push({ kind: 'corpse', id: c.id, x: c.x, z: c.z, name: c.name });
    for (const n of NODE_SPOTS) if (w.nodes[n.id].stock > 0) out.push({ kind: 'node', id: n.id, x: n.x, z: n.z, name: SOURCE_BY_ID[n.src].name });
    out.push(...this.s.extraTargets());
    return out;
  }

  /** D129 / D130: within 3 m, inside the aim cone, nothing opaque between; the most central, then the nearest. */
  pick(): Target | null {
    const m = this.s.motor;
    const [fx, fz] = this.s.forward();
    let best: Target | null = null;
    let bestScore = -Infinity;
    for (const t of this.targets()) {
      const dx = t.x - m.x;
      const dz = t.z - m.z;
      const d = Math.hypot(dx, dz);
      if (d > INTERACT_RANGE) continue;
      const cos = d < 0.4 ? 1 : (dx * fx + dz * fz) / d;
      if (cos < AIM_COS) continue;
      const ty = this.s.ground.top(t.x, t.z) + 0.6;
      if (d > 0.6 && !this.s.combat.los(m.x, m.y + 1.6, m.z, t.x, ty, t.z)) continue;
      const score = cos * 10 - d;
      if (score > bestScore) {
        bestScore = score;
        best = t;
      }
    }
    return best;
  }

  /** The hint for the selected target (D130: the action or the reason it is not available). */
  hintText(t: Target | null, inCombat: boolean): string {
    const k = this.s.keyName();
    if (this.gather) {
      const n = this.s.world.nodes[this.gather.node];
      const src = SOURCE_BY_ID[n.src];
      return `Сбор: ${src.name} — ${this.gather.t.toFixed(1).replace('.', ',')} / ${this.gather.dur} с · осталось ${n.stock}`;
    }
    if (!t) return '';
    switch (t.kind) {
      case 'mentor':
        return inCombat ? `${t.name}: в бою разговор недоступен` : `${k} — говорить: ${t.name}`;
      case 'merchant':
        return inCombat ? `${t.name}: в бою торговля недоступна` : `${k} — говорить: ${t.name}`;
      case 'station':
        return inCombat ? `${t.name}: изготовление только вне боя` : `${k} — ${t.name}`;
      case 'chest':
        return `${k} — открыть: ${t.name}`;
      case 'corpse': {
        const c = this.s.world.corpses.find((x) => x.id === t.id);
        return `${k} — обыскать: ${t.name}${c ? ` (исчезнет через ${Math.ceil(c.left / 60)} мин)` : ''}`;
      }
      case 'node': {
        const n = this.s.world.nodes[t.id];
        const p = gatherProblem(this.s.growth, n);
        return p ? `${t.name}: ${p}` : `${k} (удерживать) — собрать: ${t.name} · запас ${n.stock}`;
      }
      default:
        return this.s.extraHint(t, inCombat, k);
    }
  }

  updateHint(paused: boolean, inCombat: boolean) {
    this.target = paused || this.s.hero.dead ? null : this.gather ? this.target : this.pick();
    const txt = paused ? '' : this.hintText(this.target, inCombat);
    if (this.hint.textContent !== txt) this.hint.textContent = txt;
    this.hint.style.display = txt ? '' : 'none';
  }

  /** E pressed on the current target. Returns true when a window opened. */
  interact(inCombat: boolean): boolean {
    const t = this.pick();
    this.target = t;
    if (!t) return false;
    const e = this.s.eco;
    const w = this.s.world;
    switch (t.kind) {
      case 'mentor':
        if (inCombat) {
          this.s.toast('В бою разговор недоступен');
          return false;
        }
        this.s.openDialog(t.id === 'mira' ? 'alchemist' : t.id);
        return true;
      case 'merchant':
        if (inCombat) {
          this.s.toast('В бою торговля недоступна');
          return false;
        }
        this.s.openDialog(t.id);
        return true;
      case 'station':
        if (inCombat) {
          this.s.toast('Изготовление только вне боя');
          return false;
        }
        e.station(t.id as Station);
        return true;
      case 'chest':
        e.container(t.id, t.name, w.chests[t.id], 'chest');
        return true;
      case 'corpse': {
        const c = w.corpses.find((x) => x.id === t.id)!;
        e.container(t.id, `${c.name} · тело`, c.box, 'corpse', `Исчезнет через ${Math.ceil(c.left / 60)} мин активной игры; невзятое пропадёт вместе с телом.`);
        return true;
      }
      case 'node': {
        const n = w.nodes[t.id];
        const p = gatherProblem(this.s.growth, n);
        if (p) {
          this.s.toast(p);
          return false;
        }
        this.gather = { node: t.id, t: 0, dur: SOURCE_BY_ID[n.src].cycleSeconds };
        this.lastHp = this.s.hero.hp;
        return false;
      }
      default:
        return this.s.useExtra(t, inCombat);
    }
  }

  /**
   * D087–D091 / D131: the cycle runs while E is held; moving, attacking, damage, stun or releasing
   * E cancel the unfinished cycle (no unit); finished cycles give one unit each.
   */
  stepGather(dt: number, held: boolean, moving: boolean, attacking: boolean) {
    const a = this.gather;
    if (!a) return;
    const hero = this.s.hero;
    const why = !held ? 'Сбор прерван' : moving ? 'Сбор прерван движением' : attacking ? 'Сбор прерван атакой' : hero.hp < this.lastHp ? 'Сбор прерван уроном' : this.s.motor.stunned ? 'Сбор прерван оглушением' : null;
    this.lastHp = hero.hp;
    if (why) {
      if (a.t > 0.05 || held) this.s.toast(why);
      this.gather = null;
      return;
    }
    const n = this.s.world.nodes[a.node];
    const p = gatherProblem(this.s.growth, n);
    if (p) {
      this.s.toast(p);
      this.gather = null;
      return;
    }
    const r = tickGather(this.s.growth, n, a, dt);
    const src = SOURCE_BY_ID[n.src];
    if (r) this.s.toast(`+1 ${stackName(src.material)}`);
    if (r === 'empty') {
      this.s.toast(`${src.name}: запас исчерпан`);
      this.gather = null;
    }
  }

  /** D132: a menu cancels the unfinished cycle (no partial time is kept). */
  cancelGather() {
    this.gather = null;
  }
}

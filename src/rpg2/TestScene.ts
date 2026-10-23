import * as THREE from 'three';
import { h } from '../ui/dom';
import type { Renderer } from '../render/Renderer';
import type { Inventory } from '../ui/Inventory';
import type { WorldMap } from '../ui/WorldMap';
import type { World } from '../rpg/World';
import type { GameClock } from '../game/GameClock';
import { JUMP } from '../rpg/Player';
import { cloneGear, newGear, type Gear } from '../rpg/equipment';
import { STARTER_ITEMS } from '../rpg/items';
import { AUTOSAVE_SECONDS } from './config';
import { CONTROL_LIST, actionName, bind, codeName, defaultControls, loadControls, saveControls, type ControlAction, type ControlSettings } from './controls';
import { HeroState, STAT_IDS, STAT_NAMES } from './hero';
import { SceneInput } from './input';
import { HeroMotor, NO_INTENT, type MotorEvent, type MotorIntent } from './motor';
import { PauseManager } from './pause';
import { SaveError, restore, snapshot, type PlaythroughSave } from './save';
import { KIND_NAME, SlotStore, type PlaythroughMeta, type RecordKind, type RecordMeta, type SlotIndex } from './slots';
import { formatClock } from '../game/GameClock';
import { buildTestSite, type TestMarker, type TestSite } from './testSite';
import { ActiveTime } from './time';
import { SceneHud } from './ui/hud';
import { SceneMenus } from './ui/menus';
import * as kit from './ui/kit';
import { heroFigure } from './ui/figure';
import { npcModel } from '../render/human/npcs';
import { WEAPON_BY_ID } from './combat/data';
import { pxIcon } from '../ui/pixelIcons';
import { NORMAL, SKILLS, SPELLS, WEAPONS, abilityName, type WeaponFamily } from './combat/data';
import { CombatSystem, FAMILY_NAME, applyTestProfile, arenaEnemies, newCombatData, type Aim, type CombatData } from './combat/system';
import { CombatView } from './combat/view';
import { MENTORS, addItem, applyHeroMods, combatBonuses, equip, itemOf, newGrowth, totalArmor, type GrowthData, type MentorId } from './growth/growth';
import { ARMOR_BY_ID, RARITIES, RARITY, isItemTpl, isWeapon, itemName, type Rarity } from './growth/items';
import { XP_CAP, addXp, xpForLevel } from './growth/levels';
import { GrowthScreens } from './ui/growthUi';
import { EconomyScreens } from './ui/economyUi';
import { EconomyScene } from './economyScene';
import { STATION_SPOTS, newEconomyWorld, type EconomyWorld } from './economy/world';
import { itemBuyPrice, MATERIAL_NAMES } from './economy/goods';
import { addStack } from './economy/bag';
import { useConsumable } from './economy/consumables';
import { StoryScreens } from './ui/storyUi';
import { ClickWalk } from './clickWalk';
import { setCursor } from '../ui/cursor';
import { QUEST_BY_ID } from './story/quests';
import { StoryScene } from './storyScene';
import { CAMPFIRE_RADIUS, DESTINATIONS, RUNE_DEST, wakeAt, newStory, type StoryData } from './story/world';
import { stackName } from './economy/goods';

/** What the RPG test scene borrows from the app. */
export interface SceneHost {
  root: HTMLElement;
  view: HTMLElement;
  renderer: Renderer;
  inventory: Inventory;
  worldMap: WorldMap;
  /** Creates the world and starts drawing it (the app wires the effects). */
  createWorld(site: TestSite, clock: GameClock, gear: Gear): World;
  sfx(id: string): void;
  zoom(dir: number): void;
  /** Leaves to the main menu (the scene has already saved and cleaned up). */
  exit(): void;
}

const HERO_NAME = 'Испытатель';
/** Mouse look: radians per pixel at sensitivity 1. */
const LOOK = { yaw: 0.006, pitch: 0.004 };

/**
 * «Тестовая площадка»: the RPG systems of stage 1 (hero state, resources, active time, pause and
 * movement) on a separate copy of the training meadow, with keyboard + mouse controls (D211),
 * the existing hero model and the existing orbit camera turned by mouse look.
 */
export class TestScene {
  readonly pause = new PauseManager();
  readonly menus: SceneMenus;
  readonly input: SceneInput;
  readonly hud: SceneHud;
  controls: ControlSettings;
  site!: TestSite;
  world!: World;
  hero = new HeroState();
  motor!: HeroMotor;
  time = new ActiveTime();
  gear: Gear = newGear(STARTER_ITEMS);
  /** Stage 3: gold, items and equipment, talents, circles and mods. */
  growth: GrowthData = newGrowth();
  readonly screens: GrowthScreens;
  /** Stage 4: corpses, chests, resource points and merchants. */
  eworld: EconomyWorld = newEconomyWorld(this.growth);
  readonly eco: EconomyScreens;
  ecoScene!: EconomyScene;
  /** Stage 5: quests, journal, bestiary, places, waystones, runes, map marks. */
  story: StoryData = newStory();
  readonly storyUi: StoryScreens;
  storyScene!: StoryScene;
  readonly dev: boolean;
  private devPanel: HTMLElement | null = null;
  /** Intent of the current frame; edge presses are used by the first simulation step only. */
  private intent: MotorIntent = { ...NO_INTENT };
  private attackPress = false;
  private rmbPress = false;
  private swapPress = false;
  private skillIdx: number | null = null;
  combat!: CombatSystem;
  private view: CombatView | null = null;
  aim: Aim = { x: 0, z: 0, target: null };
  playthroughId = '';
  /** Stage 6: the save slots (playthroughs, queues, manual records). */
  readonly slots = new SlotStore();
  /** An event autosave raised during a world step, written at the end of the step (D213). */
  private pendingEvent: string | null = null;
  private holdT = 0;
  /** Mouse control (stage 7, the main game's controls). */
  walk!: ClickWalk;
  selected: string | null = null;
  autoAttack = false;
  private autoInReach = false;
  private lastHp = Infinity;
  private sprintOn = false;
  private steerHeld = false;
  private steerT = 0;
  private repathT = 0;
  private disposed = false;
  /** Last result of the save / load for tests and the dev panel. */
  lastSave = '';
  /** Counters for automated checks. */
  stats = { jumps: 0, airJumps: 0, dodges: 0, attacks: 0, autosaves: 0, records: 0 };

  constructor(private host: SceneHost, opts: { dev: boolean }) {
    this.dev = opts.dev;
    this.controls = loadControls();
    this.menus = new SceneMenus(host.root, this.pause);
    this.input = new SceneInput(host.view, this.controls.binds);
    this.hud = new SceneHud(host.root);
    this.hud.setBinds(this.controls.binds);
    const self = this;
    this.screens = new GrowthScreens({
      get hero() { return self.hero; },
      get growth() { return self.growth; },
      get combat() { return self.combat; },
      menus: this.menus,
      name: HERO_NAME,
      inCombat: () => this.hero.inCombat,
      toast: (t) => this.hud.toast(t),
      changed: () => this.growthChanged(),
      extraInventory: (f, again) => this.eco.goods(f, again),
      goodsDetail: (sel, again) => this.eco.goodsDetail(sel, again),
      itemPrice: (it) => itemBuyPrice(it),
      trainXp: (v) => this.trainXp(v),
    });
    this.eco = new EconomyScreens({
      get hero() { return self.hero; },
      get growth() { return self.growth; },
      get world() { return self.eworld; },
      get combat() { return self.combat; },
      menus: this.menus,
      inCombat: () => this.hero.inCombat,
      toast: (t) => this.hud.toast(t),
      changed: () => this.growthChanged(),
      nextUid: () => 'i' + this.growth.nextUid++,
      busy: () => this.consumableBusy(),
      mentor: (id) => this.screens.mentor(id),
      runeProblem: (tpl) => this.storyScene?.travelProblem('rune', tpl, this.hero.inCombat) ?? null,
      useRune: (tpl) => this.startTravel('rune', tpl),
    });
    this.storyUi = new StoryScreens({
      get hero() { return self.hero; },
      get growth() { return self.growth; },
      get story() { return self.story; },
      menus: this.menus,
      inCombat: () => this.hero.inCombat,
      toast: (t) => this.hud.toast(t),
      changed: () => this.growthChanged(),
      nextUid: () => 'i' + this.growth.nextUid++,
      clock: () => ({ day: this.time.clock.days, minutes: this.time.clock.minutes }),
      service: (npc, svc) => {
        if (svc === 'mentor') return this.screens.mentor(npc === 'alchemist' ? 'mira' : (npc as MentorId));
        if (svc === 'trade') return this.eco.trade(npc as never);
        if (svc === 'training') return this.eco.training(npc as never);
        return this.eco.forge();
      },
      questDone: (id) => this.eventSave(`задание «${QUEST_BY_ID[id]?.name ?? id}» выполнено`),
      sleep: (hr) => this.sleep(hr),
      activateStone: (id) => this.storyScene.activateStone(id, this.hero.inCombat),
      travel: (kind, dest) => this.startTravel(kind, dest),
      heroPos: () => ({ x: this.motor.x, z: this.motor.z, yaw: this.host.renderer.rig.yaw }),
      ground: (x, z) => this.site.ground.top(x, z),
      get size() { return self.site.map.size; },
    });
    // D208 / D211: a menu stops sprint, drops queued presses and frees the cursor
    this.pause.onPause = () => {
      this.input.live = false;
      this.input.freeze();
      this.motor?.releaseHeld();
      this.attackPress = false;
      this.rmbPress = this.swapPress = false;
      this.skillIdx = null;
      this.combat?.onMenu();
      this.ecoScene?.cancelGather();
      this.storyScene?.cancelTravel('Перемещение отменено: открыто окно');
      this.intent = { ...NO_INTENT };
      this.walk?.stop();
      this.autoAttack = false;
    };
    this.pause.onResume = () => {
      this.input.freeze();
      this.input.live = !this.hero.dead;
    };
    this.input.onMenuKey = (code) => this.menuKey(code);
  }

  // ------------------------------------------------------------------ start / stop
  /** Enters the scene: loads the test playthrough or starts a new one (day 1, 08:00). */
  start() {
    this.site = buildTestSite();
    this.world = this.host.createWorld(this.site, this.time.clock, cloneGear(this.gear));
    this.motor = new HeroMotor(this.site.ground, this.site.spawn.x, this.site.spawn.z);
    this.world.driver = (dt) => this.step(dt);
    this.walk = new ClickWalk(this.site.terrain, this.site.ground);
    this.installCombat(newCombatData('start'));
    this.addMarkers(this.site.markers);
    this.addMentors();
    const self = this;
    this.ecoScene = new EconomyScene({
      get hero() { return self.hero; },
      get growth() { return self.growth; },
      get world() { return self.eworld; },
      get motor() { return self.motor; },
      get combat() { return self.combat; },
      get ground() { return self.site.ground; },
      get eco() { return self.eco; },
      forward: () => this.forward(),
      toast: (t) => this.hud.toast(t),
      openMentor: (id) => this.screens.mentor(id),
      keyName: () => codeName(this.controls.binds.interact[0] ?? 'KeyE'),
      addObject: (o) => this.host.renderer.addRunObject(o),
      label: (t) => labelSprite(t),
      openDialog: (npc) => this.storyUi.dialog(npc),
      extraTargets: () => this.storyScene.targets(),
      extraHint: (t, inCombat, k) => {
        if (t.kind === 'npc') return inCombat ? `${t.name}: в бою разговор недоступен` : `${k} — говорить: ${t.name}`;
        if (t.kind === 'bed') return inCombat ? 'Спать можно только вне боя' : `${k} — лечь спать`;
        if (t.kind === 'stone') return inCombat ? `${t.name}: только вне боя` : `${k} — ${t.name}`;
        return `${k} — осмотреть: ${t.name}`;
      },
      useExtra: (t, inCombat) => {
        if (t.kind === 'arch') {
          this.hud.toast(this.storyScene.examineArch());
          return false;
        }
        if (inCombat) {
          this.hud.toast(t.kind === 'npc' ? 'В бою разговор недоступен' : 'Только вне боя');
          return false;
        }
        if (t.kind === 'npc') this.storyUi.dialog(t.id);
        else if (t.kind === 'bed') this.storyUi.bed();
        else this.storyUi.waystone(t.id);
        return true;
      },
    }, this.host.root);
    this.storyScene = new StoryScene({
      get hero() { return self.hero; },
      get growth() { return self.growth; },
      get story() { return self.story; },
      get motor() { return self.motor; },
      get combat() { return self.combat; },
      get ground() { return self.site.ground; },
      forward: () => this.forward(),
      clock: () => ({ day: this.time.clock.days, minutes: this.time.clock.minutes }),
      toast: (t) => this.hud.toast(t),
      addObject: (o) => this.host.renderer.addRunObject(o),
      label: (t) => labelSprite(t),
      teleport: (x, z) => this.placeHero(x, z),
      eventSave: () => this.eventSave('первая активация путевого камня'),
    }, this.host.root);
    this.input.active = true;
    this.input.live = true;
    this.hud.setVisible(true);
    if (this.dev) this.buildDev();
    this.syncPlayer(0);
    this.host.renderer.snapTo(this.motor.x, this.motor.z);
    this.entryMenu();
    window.addEventListener('blur', this.onBlur);
    document.addEventListener('visibilitychange', this.onBlur);
  }

  private onBlur = () => {
    if (!this.disposed && !this.pause.paused && (document.hidden || !document.hasFocus())) this.openPause();
  };

  /** Leaves to the main menu: the regular exit saves the moment (D042), never a dead hero. */
  exit() {
    if (!this.hero.dead && this.playthroughId) this.save('exit');
    this.dispose();
    this.host.exit();
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    setCursor('default');
    this.input.active = false;
    this.input.dispose();
    this.menus.closeAll();
    this.hud.dispose();
    this.devPanel?.remove();
    this.ecoScene?.dispose();
    this.storyScene?.dispose();
    window.removeEventListener('blur', this.onBlur);
    document.removeEventListener('visibilitychange', this.onBlur);
    if ((window as unknown as { rpg2?: TestScene }).rpg2 === this) delete (window as unknown as { rpg2?: TestScene }).rpg2;
  }

  // ------------------------------------------------------------------ frame
  frame(realDt: number) {
    if (this.disposed) return;
    const dt = Math.min(realDt, 0.05);
    const rig = this.host.renderer.rig;
    const inp = this.input;
    // mouse look turns the existing orbit camera (its tilt limits and terrain collision stay)
    if (inp.lookX || inp.lookY) {
      const s = this.controls.sensitivity;
      // the right button held and dragged orbits the camera, with the main game's rates
      rig.orbit(-inp.lookX * LOOK.yaw * s, inp.lookY * LOOK.pitch * s * (this.controls.invertY ? -1 : 1));
      inp.lookX = inp.lookY = 0;
    }
    if (inp.wheel) {
      this.host.zoom(Math.sign(inp.wheel));
      inp.wheel = 0;
    }
    const live = !this.pause.paused && !this.hero.dead;
    if (live) {
      this.readInput();
      if (this.pause.paused) {
        // a window hotkey opened a menu this frame
      } else {
        const steps = Math.max(1, Math.ceil(dt / (1 / 60)));
        for (let i = 0; i < steps; i++) {
          this.world.update(dt / steps);
          // edges belong to the first step only
          this.intent.jumpPressed = this.intent.dodgePressed = this.intent.sprintPressed = false;
          this.attackPress = false;
        }
        // D213: deaths of this step are resolved first; a dead hero is never saved. A periodic and an
        // event record due together come from one snapshot into their own queues.
        const due = this.time.advance(dt);
        const ev = this.pendingEvent;
        this.pendingEvent = null;
        if (this.hero.dead) this.onDeath();
        else if (due || ev) {
          if (due) this.stats.autosaves++;
          const ok = due ? this.save('auto', { also: ev ? ['event'] : [], note: ev ?? undefined }) : this.save('event', { note: ev! });
          this.hud.toast(ok ? (due ? 'Автосохранение' : `Автосохранение: ${ev}`) : this.lastSave);
        }
      }
    }
    this.host.renderer.frame(this.pause.paused ? 0 : dt);
    this.view?.update(this.pause.paused ? 0 : dt, this.aim.target);
    this.hud.updateCombat(this.combat, this.aim);
    this.hud.update(this.world, this.hero, this.motor, this.time, HERO_NAME, rig.yaw, realDt);
    this.host.worldMap.yaw = rig.yaw;
    this.host.worldMap.draw(this.world);
    this.ecoScene.syncView();
    this.ecoScene.updateHint(this.pause.paused, this.hero.inCombat);
    this.storyScene.updateMarkers();
    this.storyScene.updateTrack(this.pause.paused);
    const g = this.growth;
    this.hud.setPotions((['hp', 'mp', 'st'] as const).map((k) => ({ name: stackName(g.potionSel[k]), count: g.stacks[g.potionSel[k]] ?? 0, cd: g.potionCd })));
  }

  /** Camera forward on the ground (unit x / z). */
  private forward(): [number, number] {
    const yaw = this.host.renderer.rig.yaw;
    return [-Math.sin(yaw), -Math.cos(yaw)];
  }

  private readInput() {
    const inp = this.input;
    const pr = inp.takePresses();
    // window hotkeys (open full-screen menus: the world stops this frame)
    if (pr.has('inventory')) return this.toggleInventory(true);
    if (pr.has('map')) return this.storyUi.map();
    if (pr.has('journal')) return this.storyUi.journal();
    if (pr.has('bestiary')) return this.storyUi.bestiary();
    if (pr.has('character')) return this.openCharacter();
    if (pr.has('progress')) return this.screens.development();
    if (pr.has('interact') && !this.ecoScene.gather && this.ecoScene.interact(this.hero.inCombat)) return;
    const potion = (a: ControlAction, k: 'hp' | 'mp' | 'st') => {
      if (!pr.has(a)) return;
      const r = useConsumable(this.growth, this.hero, this.growth.potionSel[k], { inCombat: this.hero.inCombat, busy: this.consumableBusy() });
      if (r) this.hud.toast(r);
    };
    potion('potionHp', 'hp');
    potion('potionMp', 'mp');
    potion('potionSt', 'st');
    if (pr.has('quickSave')) this.quickSave();
    if (pr.has('quickLoad')) return this.quickLoad();
    for (const a of ['trade', 'dialog'] as ControlAction[]) if (pr.has(a)) this.hud.toast(`«${actionName(a)}» — появится на следующих этапах`);
    if (pr.has('walkToggle')) {
      this.motor.walk = !this.motor.walk;
      this.hud.toast(this.motor.walk ? 'Ходьба' : 'Бег');
    }
    this.readMouse(pr);
    this.attackPress = pr.has('attack');
    this.rmbPress = pr.has('block');
    this.swapPress = pr.has('weaponSwap');
    for (let i = 1; i <= 6; i++) if (pr.has(`skill${i}` as ControlAction)) this.skillPress(i);
  }

  /** The ground point and the enemy or dummy under the cursor (tested at a few body heights, like the main game). */
  private underCursor(): { ground: [number, number] | null; hover: string | null } {
    const inp = this.input;
    if (inp.mx < 0) return { ground: null, hover: null };
    const rig = this.host.renderer.rig;
    const vw = this.host.view.clientWidth || 1;
    const vh = this.host.view.clientHeight || 1;
    const top = (x: number, z: number) => this.site.ground.top(x, z);
    const ground = rig.terrainPoint(inp.mx, inp.my, vw, vh, top, 0);
    let hover: string | null = null;
    const ts = this.combat.targets();
    for (const lift of [1.2, 0.7, 0.2]) {
      const q = rig.terrainPoint(inp.mx, inp.my, vw, vh, top, lift);
      if (!q) continue;
      let best = Infinity;
      for (const t of ts) {
        const d = Math.hypot(t.x - q[0], t.z - q[1]);
        if (d < t.radius + 0.3 && d < best) {
          best = d;
          hover = t.uid;
        }
      }
      if (hover) break;
    }
    return { ground, hover };
  }

  /**
   * Mouse control, the same as the main game (owner's decision): a left click on the ground walks
   * there (path search; held, the order follows the cursor), on an enemy or dummy it selects it, a
   * second click on the selected one starts the automatic attack (walk into reach, keep hitting);
   * a ground click stops it. Attacks and skills aim at the selected target. Space jumps (again in
   * the air), Shift dodges toward the cursor, Alt toggles sprint, Q held blocks / aims / charges.
   */
  private readMouse(pr: Set<ControlAction>) {
    const inp = this.input;
    const m = this.motor;
    const { ground, hover } = this.underCursor();
    setCursor(hover ? 'attack' : 'default');
    const clicks = inp.takeClicks();
    if (clicks > 0) {
      this.steerT = 0;
      if (hover) {
        if (this.selected === hover) this.autoAttack = true;
        else {
          this.selected = hover;
          this.autoAttack = false;
        }
        this.steerHeld = false;
      } else if (ground) {
        this.autoAttack = false;
        this.walk.order(m.x, m.z, ground[0], ground[1]);
        this.host.renderer.markMove(ground[0], ground[1]);
        this.steerHeld = true;
        this.steerT = 0.25;
      }
    } else if (this.steerHeld && inp.lmb && ground) {
      if ((this.steerT -= 1 / 60) <= 0) {
        this.steerT = 0.2;
        this.walk.order(m.x, m.z, ground[0], ground[1]);
      }
    }
    if (!inp.lmb) this.steerHeld = false;
    // the selection follows the target's life
    const tgt = this.combat.target(this.selected);
    if (!tgt) {
      this.selected = null;
      this.autoAttack = false;
    }
    // automatic attack: walk into the weapon's reach, then keep attacking
    let inReach = false;
    if (tgt && this.autoAttack) {
      const reach = this.reach();
      const d = Math.hypot(tgt.x - m.x, tgt.z - m.z) - tgt.radius;
      inReach = d <= reach && this.combat.los(m.x, m.y + 1.6, m.z, tgt.x, tgt.y + tgt.height * 0.6, tgt.z);
      if (inReach) this.walk.stop();
      else if (!this.walk.walking || (this.repathT -= 1 / 60) <= 0) {
        this.repathT = 0.3;
        const ux = (m.x - tgt.x) / Math.max(0.01, d + tgt.radius);
        const uz = (m.z - tgt.z) / Math.max(0.01, d + tgt.radius);
        const k = tgt.radius + Math.max(0.5, reach - 0.4);
        this.walk.order(m.x, m.z, tgt.x + ux * k, tgt.z + uz * k);
      }
    }
    this.autoInReach = inReach;
    const st = this.walk.steer(m, 1 / 60);
    let mx = st ? st.dx : 0;
    let mz = st ? st.dz : 0;
    // facing: the selected target while attacking or holding block / aim / charge, else the way walked
    let fx = m.fx;
    let fz = m.fz;
    // owner: the hero turns to the selected target only while an attack, a skill or a held
    // block / aim / charge actually runs; otherwise he faces the way he walks (or keeps his facing)
    const c = this.combat;
    const busy = !!c.data.action || c.blocking || c.aiming || c.charge !== null;
    if (tgt && busy) {
      const l = Math.hypot(tgt.x - m.x, tgt.z - m.z) || 1;
      fx = (tgt.x - m.x) / l;
      fz = (tgt.z - m.z) / l;
    } else if (st) {
      fx = st.dx;
      fz = st.dz;
    }
    // Shift: dodge toward the cursor
    const dodge = pr.has('dodge');
    if (dodge && ground) {
      const l = Math.hypot(ground[0] - m.x, ground[1] - m.z);
      if (l > 0.1) {
        mx = (ground[0] - m.x) / l;
        mz = (ground[1] - m.z) / l;
      }
    }
    let sprintPressed = false;
    if (pr.has('sprint')) {
      this.sprintOn = !this.sprintOn;
      sprintPressed = this.sprintOn;
      this.hud.toast(this.sprintOn ? 'Спринт включён' : 'Спринт выключен');
    }
    this.intent = {
      moveX: mx,
      moveZ: mz,
      faceX: fx,
      faceZ: fz,
      sprintHeld: this.sprintOn,
      sprintPressed,
      jumpPressed: pr.has('jump') || !!st?.jump,
      dodgePressed: dodge,
    };
  }

  /** Reach of the held weapon for the automatic attack (melee: the hit reach; bow and staff: their range). */
  private reach(): number {
    const k = this.combat.weapon.kind;
    const melee = (NORMAL.reach as Record<string, number>)[k];
    if (melee) return melee;
    return k === 'bow' ? 28 : 23;
  }

  /** A panel key: used now, or kept in the dodge buffer during the last 0.15 s of a dodge (D178). */
  private skillPress(i: number) {
    if (this.motor.dodging) this.motor.pressAction(`skill${i}`);
    else this.skillIdx = i - 1;
  }

  /** One simulation step (called by World.update in place of the mouse-driven hero). */
  private step(dt: number) {
    const m = this.motor;
    const hero = this.hero;
    const p = this.world.player;
    const c = this.combat;
    // D166 / D194 / D195: block, aim and preparation limit the speed and forbid sprint
    const lim = c.moveLimits();
    m.moveMul = lim.mul;
    m.noSprint = lim.noSprint;
    const evs = m.update(dt, this.intent, hero);
    for (const e of evs) this.onMotorEvent(e);
    // a press during a dodge is refused and buffered in its last 0.15 s (D176 / D178)
    if (this.attackPress && m.dodging) m.pressAction('attack');
    const attacks0 = c.counters.attacks;
    const sel = c.target(this.selected);
    // owner: never pick a target by itself; without a clicked target attacks go where the hero faces
    this.aim = sel ? { x: sel.x, z: sel.z, target: sel.uid } : { x: m.x + m.fx * 8, z: m.z + m.fz * 8, target: null };
    c.update(dt, {
      attackHeld: !hero.dead && !m.dodging && (this.input.held('attack') || this.attackPress || this.autoInReach),
      rmbHeld: this.input.held('block'),
      rmbPressed: this.rmbPress,
      skill: m.dodging ? null : this.skillIdx,
      swap: this.swapPress,
    }, this.aim);
    this.rmbPress = this.swapPress = false;
    this.skillIdx = null;
    this.stats.attacks += c.counters.attacks - attacks0;
    // the existing hero model plays the swing of the running action
    const a = c.data.action;
    // held action poses (owner's request): block, aim and charge last as long as the action
    const hk: 'block' | 'aim' | 'charge' | null = c.blocking ? 'block' : c.aiming ? 'aim' : c.charge !== null ? 'charge' : null;
    this.holdT = hk && p.hold?.kind === hk ? this.holdT + dt : 0;
    p.hold = hk ? { kind: hk, k: hk === 'charge' ? Math.min(1, 0.35 + (c.charge ?? 0)) : Math.min(1, this.holdT / (hk === 'aim' ? 0.4 : 0.15)) } : null;
    p.attack = a ? ({ weapon: null, t: a.t, dur: a.dur, hitAt: Math.min(1, a.hitAt / a.dur), done: a.t >= a.hitAt, dirX: a.dirX, dirZ: a.dirZ, seq: a.rec, kind: a.kind } as unknown as typeof p.attack) : null;
    // the weapon is ready in a fight and while an enemy is selected near the hero
    const near = sel ? Math.hypot(sel.x - m.x, sel.z - m.z) < 15 && !sel.dummy : false;
    p.inCombat = hero.inCombat || near;
    this.syncWeapon();
    // D028: a campfire (the cooking stove) within 5 m out of combat: HP / MP regeneration ×5
    const fire = STATION_SPOTS.find((x) => x.id === 'stove')!;
    hero.tick(dt, { campfire: !hero.inCombat && Math.hypot(fire.x - m.x, fire.z - m.z) <= CAMPFIRE_RADIUS }, m.sprinting);
    this.storyScene.tick();
    this.storyScene.stepTravel(dt, { moving: Math.hypot(this.intent.moveX, this.intent.moveZ) > 0.01, attacking: c.counters.attacks !== attacks0 || !!c.data.action, inCombat: hero.inCombat });
    this.ecoScene.stepGather(dt, this.input.held('interact'), Math.hypot(this.intent.moveX, this.intent.moveZ) > 0.01 || m.mode !== 'ground' || m.dodging, c.counters.attacks !== attacks0 || !!c.data.action);
    this.ecoScene.tick(dt, (x, z) => this.canRespawnAt(x, z, 30));
    this.syncPlayer(dt);
  }

  private onMotorEvent(e: MotorEvent) {
    const fx = this.world.fx;
    const m = this.motor;
    const p = this.world.player;
    switch (e.type) {
      case 'jump':
        this.stats.jumps++;
        // D166 / D194: a jump ends the block and cancels a preparation or the charge
        this.combat.onJump();
        if (e.air) {
          this.stats.airJumps++;
          p.airJumpT = 0;
          fx.burst(m.x, 0.1, m.z, 0xe8f0f8, 6, 1.6, 0.1, 0.3, 'smoke');
        }
        fx.sound('jump', e.air ? 0.42 : 0.5);
        break;
      case 'land':
        if (e.height > 0.6) {
          fx.burst(m.x, 0.1, m.z, 0xb8a888, 8, 2.2, 0.14, 0.4, 'smoke');
          fx.sound('land', 0.5);
        }
        if (e.death) this.hud.toast(`Падение ${m1(e.height)} м — смерть`);
        else if (e.damage > 0) {
          this.hud.toast(`Падение ${m1(e.height)} м: −${e.damage} HP`);
          fx.number(m.x, m.z, e.damage, false, 0xff5040);
        }
        break;
      case 'water':
        fx.burst(m.x, 0.2, m.z, 0x9cc8ff, 12, 2.6, 0.12, 0.5, 'smoke');
        fx.sound('land', 0.4);
        this.hud.toast(e.damage > 0 ? `Вода мелкая: −${e.damage} HP` : `Падение в воду ${m1(e.height)} м: без урона`);
        break;
      case 'dodge':
        this.stats.dodges++;
        // D175: a started dodge cancels the unfinished part of an attack (cooldowns stay)
        p.attack = null;
        this.combat.onDodge();
        fx.burst(m.x, 0.15, m.z, 0xd8d0c0, 7, 2, 0.12, 0.3, 'smoke');
        fx.sound('jump', 0.35);
        break;
      case 'dodgeEnd':
        if (e.buffered === 'attack') this.attackPress = true;
        else if (e.buffered?.startsWith('skill')) this.skillIdx = Number(e.buffered.slice(5)) - 1;
        break;
      case 'sprintEmpty':
        this.sprintOn = false;
        this.hud.toast('Выносливость закончилась');
        break;
      default:
        break;
    }
  }

  /** Copies the motor into the existing hero object the renderer draws. */
  private syncPlayer(dt: number) {
    const m = this.motor;
    const p = this.world.player;
    p.x = m.x;
    p.y = m.y;
    p.z = m.z;
    p.vx = m.vx;
    p.vz = m.vz;
    p.stepY = m.stepY;
    p.jumpPhase = m.mode === 'air' ? 'air' : 'ground';
    // a flinch on every hit taken
    if (this.hero.hp < this.lastHp - 0.01) p.hurtT = 0;
    else p.hurtT += dt;
    this.lastHp = this.hero.hp;
    p.jumpV = m.vy;
    const sp = m.speed;
    p.moving = sp > 0.3;
    if (p.moving) p.anim += dt * sp * 2.2;
    if (p.airJumpT >= 0) {
      p.airJumpT += dt;
      if (p.airJumpT > JUMP.flipTime || m.mode !== 'air') p.airJumpT = -1;
    }
    if (!p.attack) {
      p.fx = m.fx;
      p.fz = m.fz;
    }
  }

  // ------------------------------------------------------------------ menus
  private menuKey(code: string) {
    if (code === 'Escape') {
      if (this.input.capture) {
        this.input.capture = null;
        if (this.menus.isOpen('controls')) this.openControls();
        return;
      }
      // D211: Esc closes the top window; with none open it opens the pause menu
      if (this.hero.dead && this.menus.isOpen('death') && this.pause.top === 'death') return;
      if (!this.menus.closeTop()) this.openPause();
      return;
    }
    // window hotkeys inside menus: the same key closes its own window; Tab / skills do nothing (D211)
    const a = this.input.actionOf(code);
    const top = this.pause.top;
    if (a === 'inventory' && top === 'inventory') this.toggleInventory(false);
    else if (a === 'map' && top === 'map') this.toggleMap(false);
    else if (a === 'map' && top === 'map2') this.menus.close('map2');
    else if (a === 'journal' && top === 'journal') this.menus.close('journal');
    else if (a === 'bestiary' && top === 'bestiary') this.menus.close('bestiary');
    else if (a === 'character' && top === 'character') this.menus.close('character');
    else if (a === 'progress' && top === 'development') this.menus.close('development');
  }

  openPause() {
    if (this.menus.isOpen('pause')) return;
    const btn = (label: string, fn: () => void, primary = false) => h('button.r2-btn' + (primary ? '.primary' : ''), { onclick: fn }, label);
    const note = h('div.r2-note');
    const body = h(
      'div',
      h('h1', 'Пауза'),
      h('div.r2-rule'),
      btn('Продолжить', () => this.resume(), true),
      btn('Персонаж', () => this.openCharacter()),
      btn('Развитие и умения', () => this.screens.development()),
      btn('Панели и быстрые назначения', () => this.openLoadout()),
      btn('Управление', () => this.openControls()),
      btn('Сохранения и загрузка', () => this.savesMenu()),
      btn('Загрузить последнее', () => this.loadLatest()),
      btn('Новое прохождение', () => this.chooseStart()),
      btn('Выйти в главное меню', () => this.exit()),
      note,
      h('div.r2-note', 'Мир, время, восстановление и перезарядки стоят, пока открыто любое окно.'),
    );
    this.menus.show('pause', body);
  }

  /** «Продолжить»: closes the pause menu and captures the pointer again (a click is a gesture). */
  private resume() {
    this.menus.close('pause');

  }

  /** I: the stage 3 inventory and equipment window (D200). */
  toggleInventory(open: boolean) {
    if (open && !this.menus.isOpen('inventory')) this.screens.inventory();
    else if (!open) this.menus.close('inventory');
  }

  /** Gear changed in the inventory (the world's stats follow; equipment rules are stage 3). */
  setGear(g: Gear) {
    this.gear = cloneGear(g);
    this.world.setGear(cloneGear(g));
  }

  toggleMap(open: boolean) {
    const map = this.host.worldMap;
    if (open && !this.menus.isOpen('map')) {
      map.open(this.world);
      this.menus.attach('map', () => map.close());
    } else if (!open) this.menus.close('map');
  }

  openCharacter() {
    return this.screens.character();
  }

  /** Stage 2 summary (kept for reference in dev mode). */
  openCharacterOld() {
    const hr = this.hero;
    const pr = hr.progress;
    const kv = (k: string, v: string | number) => [h('span', k), h('b', String(v))];
    const body = h(
      'div',
      h('h1', HERO_NAME),
      h('div.r2-rule'),
      h(
        'div.r2-kv',
        h('h3', 'Развитие'),
        kv('Уровень', pr.level),
        kv('Опыт (XP)', pr.xp),
        kv('Очки обучения (LP)', pr.lp),
        kv('Очки талантов (ОТ)', pr.tp),
        h('h3', 'Характеристики'),
        STAT_IDS.map((s) => kv(STAT_NAMES[s], hr.stats[s])),
        h('h3', 'Запасы'),
        kv('Здоровье (HP)', `${Math.floor(hr.hp)} / ${hr.maxHp}`),
        kv('Мана (MP)', `${Math.floor(hr.mp)} / ${hr.maxMp}`),
        kv('Выносливость (ST)', `${Math.floor(hr.st)} / ${hr.maxSt}`),
        h('h3', 'Мастерство'),
        kv('Меч', `${pr.mastery.sword} (ОМ ${this.combat.data.om.sword})`),
        kv('Лук', `${pr.mastery.bow} (ОМ ${this.combat.data.om.bow})`),
        kv('Посох', `${pr.mastery.staff} (ОМ ${this.combat.data.om.staff})`),
        h('h3', 'Бой'),
        kv('Оружие', this.combat.weapon.name),
        kv('Броня', this.combat.heroArmor),
        kv('Побеждено противников', this.combat.data.kills),
        h('h3', 'Время'),
        kv('Игровое время', this.time.label),
        kv('Активная игра', fmtDur(this.time.seconds)),
        kv('До автосохранения', fmtDur(this.time.autosaveLeft)),
      ),
      h('div', { style: 'margin-top:14px' }, h('button.r2-btn.small', { onclick: () => this.menus.close('character') }, 'Закрыть')),
    );
    this.menus.show('character', body);
  }

  /** D211: rebinding with a conflict prompt, reset to defaults, mouse sensitivity and inversion. */
  openControls() {
    const c = this.controls;
    const grid = h('div.r2-binds');
    let group = '';
    for (const row of CONTROL_LIST) {
      if (row.group !== group) {
        group = row.group;
        grid.append(h('h3', group));
      }
      const key = h('button.r2-key', codeName(c.binds[row.id][0]));
      key.addEventListener('click', (e) => {
        e.stopPropagation();
        key.textContent = 'Нажмите…';
        key.classList.add('wait');
        // the click itself must not be captured: wait for the next press
        setTimeout(() => {
          this.input.capture = (code) => this.rebind(row.id, code);
        }, 0);
      });
      const clr = h('button.r2-key', { title: 'Снять назначение' }, 'Снять');
      clr.addEventListener('click', () => {
        c.binds[row.id] = [];
        this.applyControls();
        this.openControls();
      });
      grid.append(h('span', row.name), key, clr);
    }
    const sens = h('input', { type: 'range', min: '0.2', max: '3', step: '0.1', value: String(c.sensitivity) }) as HTMLInputElement;
    const sensV = h('b', c.sensitivity.toFixed(1));
    sens.addEventListener('input', () => {
      c.sensitivity = Number(sens.value);
      sensV.textContent = c.sensitivity.toFixed(1);
      this.applyControls();
    });
    const inv = h('input', { type: 'checkbox' }) as HTMLInputElement;
    inv.checked = c.invertY;
    inv.addEventListener('change', () => {
      c.invertY = inv.checked;
      this.applyControls();
    });
    const body = h(
      'div',
      h('h1', 'Управление'),
      h('div.r2-rule'),
      h('div.r2-row', h('span', 'Чувствительность мыши'), sens, sensV),
      h('label.r2-row', inv, h('span', 'Инвертировать вертикальную ось')),
      grid,
      h(
        'div',
        { style: 'margin-top:14px' },
        h('button.r2-btn.small', {
          onclick: () =>
            this.menus.confirm('Вернуть все назначения и настройки мыши по умолчанию?', () => {
              this.controls = defaultControls();
              this.applyControls();
              this.openControls();
            }),
        }, 'По умолчанию'),
        h('button.r2-btn.small.primary', { onclick: () => this.menus.close('controls') }, 'Готово'),
      ),
      h('div.r2-note', 'Настройки управления общие для всей игры и не зависят от прохождения. Esc отменяет назначение.'),
    );
    this.menus.show('controls', body);
  }

  private rebind(action: ControlAction, code: string) {
    const b = this.controls.binds;
    const r = bind(b, action, code, false);
    if (r.done) {
      this.applyControls();
      this.openControls();
      return;
    }
    if (r.conflict)
      this.menus.confirm(
        `«${codeName(code)}» уже назначена на действие «${actionName(r.conflict)}». Заменить назначение?`,
        () => {
          bind(b, action, code, true);
          this.applyControls();
          this.openControls();
        },
        'Заменить',
        'Отмена',
        () => this.openControls(),
      );
    else this.openControls();
  }

  private applyControls() {
    this.input.binds = this.controls.binds;
    this.hud.setBinds(this.controls.binds);
    saveControls(this.controls);
  }

  // ------------------------------------------------------------------ saves (stage 6: D040–D047, D202, D213)
  /** One consistent snapshot of the current moment (D040). */
  private snap(): PlaythroughSave {
    return snapshot({ id: this.playthroughId, map: this.site.map.id, name: HERO_NAME, race: 'human', hero: this.hero, motor: this.motor.toSave(), time: this.time, combat: this.combat.data, growth: this.growth, world: this.eworld, story: this.story });
  }

  /**
   * Writes records of the current playthrough from ONE snapshot (D213: a periodic and an event record
   * due together are two records in their queues). Never for a dead hero (D047 / D213).
   */
  save(kind: RecordKind, opts: { name?: string; replace?: string; note?: string; also?: RecordKind[] } = {}): boolean {
    if (this.hero.dead) {
      this.lastSave = 'Мёртвого героя сохранить нельзя.';
      return false;
    }
    if (!this.playthroughId) {
      this.lastSave = 'Прохождение не выбрано.';
      return false;
    }
    const kinds = [{ kind, name: opts.name, replace: opts.replace, note: opts.note }, ...(opts.also ?? []).map((k) => ({ kind: k, note: opts.note }))];
    const r = this.slots.write(this.playthroughId, this.snap(), kinds);
    if (typeof r === 'string') {
      this.lastSave = r;
      return false;
    }
    this.stats.records += r.length;
    const shot = this.host.renderer.thumbnail?.();
    if (shot) for (const m of r) this.slots.setThumb(m.key, shot);
    this.lastSave = `Сохранено: ${r.map((m) => KIND_NAME[m.kind]).join(' + ')}`;
    return true;
  }

  /**
   * D042 event autosave. In a menu (quest turn-in, waystone window) it is written at once after the
   * operation (D213); during a world step it waits for the end of the step and joins a periodic
   * record due at the same moment.
   */
  eventSave(note: string) {
    if (this.pause.paused) {
      if (this.save('event', { note })) this.hud.toast(`Автосохранение: ${note}`);
      else if (!this.hero.dead) this.hud.toast(this.lastSave);
    } else this.pendingEvent = note;
  }

  quickSave() {
    if (this.save('quick')) this.hud.toast('Быстрое сохранение');
    else this.hud.toast(this.lastSave);
  }

  /** F9: the latest quicksave of the current playthrough (D044); none → a message and the list (D202). */
  quickLoad() {
    const rec = this.playthroughId ? this.slots.latest(this.playthroughId, 'quick') : null;
    if (!rec) {
      this.hud.toast('Быстрых сохранений этого прохождения нет');
      this.savesMenu();
      return;
    }
    this.loadRecord(this.playthroughId, rec.key);
  }

  /** D047 «Загрузить последнее»: the newest record of the current playthrough, any kind. */
  loadLatest() {
    const rec = this.playthroughId ? this.slots.latest(this.playthroughId) : null;
    if (!rec) {
      this.hud.toast('У этого прохождения нет сохранений');
      this.savesMenu();
      return;
    }
    this.loadRecord(this.playthroughId, rec.key);
  }

  /** Loads one record; an error shows the reason and offers another record (D202). */
  loadRecord(pt: string, key: string): boolean {
    let s: PlaythroughSave;
    try {
      s = this.slots.read(key);
    } catch (e) {
      this.loadError(e);
      return false;
    }
    this.playthroughId = pt;
    this.slots.setLast(pt);
    this.menus.closeAll();
    this.apply(s);
    this.hud.toast('Загружено');
    return true;
  }

  /** Puts a record into the running scene (the whole consistent moment, D040). */
  private apply(s: PlaythroughSave) {
    const r = restore(s);
    this.hero = r.hero;
    this.time.seconds = r.time.seconds;
    this.time.autosaveLeft = r.time.autosaveLeft;
    this.time.clock.minutes = r.time.clock.minutes;
    this.time.clock.days = r.time.clock.days;
    this.motor.loadSave(s.motor);
    this.growth = r.growth;
    this.eworld = r.world;
    this.story = r.story;
    this.pendingEvent = null;
    this.ecoScene?.cancelGather();
    this.storyScene?.cancelTravel();
    this.installCombat(r.combat);
    this.world.player.attack = null;
    this.input.freeze();
    this.syncPlayer(0);
    this.host.renderer.snapTo(this.motor.x, this.motor.z);
    if (!this.pause.paused) this.input.live = true;
  }

  private loadError(e: unknown) {
    const why = e instanceof SaveError ? e.message : String((e as Error)?.message ?? e);
    const body = h(
      'div',
      h('h1', 'Ошибка загрузки'),
      h('div.r2-rule'),
      h('p', `Сохранение не загружено: ${why}.`),
      h('p.r2-note', 'Запись не удалена, текущее состояние не изменено. Выберите другую запись.'),
      h('button.r2-btn.primary', { onclick: () => { this.menus.close('loadError'); this.savesMenu(); } }, 'Выбрать другую запись'),
      h('button.r2-btn', { onclick: () => this.leave() }, 'Главное меню'),
    );
    this.menus.show('loadError', body);
  }

  /** The entry screen of the test scene: continue, new playthrough, load, main menu. */
  entryMenu() {
    let cont: ReturnType<SlotStore['continueTarget']> = null;
    let err = '';
    try {
      cont = this.slots.continueTarget();
    } catch (e) {
      err = (e as Error).message;
    }
    const btn = (label: string, fn: () => void, primary = false) => h('button.r2-btn' + (primary ? '.primary' : ''), { onclick: fn }, label);
    const body = h(
      'div',
      h('h1', 'Тестовая площадка'),
      h('div.r2-rule'),
      cont ? btn(`Продолжить — ${cont.pt.name}: ${KIND_NAME[cont.rec.kind].toLowerCase()}, ${fmtDate(cont.rec.savedAt)}`, () => this.loadRecord(cont!.pt.id, cont!.rec.key), true) : h('p.r2-note', 'Продолжить нечего: нет записей последнего открытого прохождения.'),
      btn('Новое прохождение', () => this.chooseStart(), !cont),
      btn('Загрузить сохранение', () => this.savesMenu()),
      this.dev ? h('div', h('h3', 'Режим разработки: тестовые профили'),
        btn('Новое тестовое прохождение: всё оружие и умения', () => this.restart('sword1', 'test')),
        btn('Новое тестовое прохождение: уровень 60', () => this.restart('sword1', 'high'))) : null,
      btn('Главное меню', () => this.leave()),
      err ? h('p.r2-note', err) : null,
    );
    this.menus.show('entry', body, () => {
      // the scene has no playthrough yet: closing the entry screen with Esc brings it back
      if (!this.playthroughId && !this.disposed) setTimeout(() => this.entryMenu(), 0);
    });
  }

  /** Leaves without saving (no playthrough yet, the death screen, a load error). */
  private leave() {
    if (this.playthroughId && !this.hero.dead) this.save('exit');
    this.dispose();
    this.host.exit();
  }

  /** Save / load screen (mockups hud-03 / hud-04): playthroughs, records with thumbnails, a detail panel. */
  private savesTab: 'load' | 'save' = 'load';
  private savesPt: string | null = null;
  private savesSel: string | null = null;
  private savesKind: 'all' | RecordKind = 'all';
  private savesSort: 'new' | 'old' = 'new';
  savesMenu(tab?: 'load' | 'save') {
    const KIND_ICON: Record<RecordKind, string> = { start: 'flag', auto: 'clock', event: 'check', exit: 'house', quick: 'hourglass', manual: 'save' };
    if (tab) this.savesTab = tab;
    const again = () => this.savesMenu();
    let ix: SlotIndex;
    try {
      ix = this.slots.index();
    } catch (e) {
      this.menus.show('saves', h('div', h('h1', 'Сохранения'), h('p', (e as Error).message), h('button.r2-btn.small', { onclick: () => this.menus.close('saves') }, 'Закрыть')));
      return;
    }
    const cur = ix.playthroughs.find((p) => p.id === this.playthroughId) ?? null;
    const pt = ix.playthroughs.find((p) => p.id === this.savesPt) ?? cur ?? ix.playthroughs[0] ?? null;
    const thumb = (r: RecordMeta | null, cls: string) => {
      const url = r ? this.slots.thumb(r.key) : null;
      return url ? h('img.' + cls, { src: url, alt: '' }) : h('div.' + cls + '.r2-nothumb', pxIcon('flag', 28));
    };
    const when = (r: RecordMeta) => `${fmtDate(r.savedAt)} · ур. ${r.level} · день ${r.day + 1}, ${formatClock(r.minutes)}`;
    const title = (r: RecordMeta) => (r.kind === 'manual' ? r.name : KIND_NAME[r.kind]);
    const recRow = (p: PlaythroughMeta, r: RecordMeta, sel: boolean) =>
      kit.row({ icon: KIND_ICON[r.kind], iconSize: 34, title: title(r), sub: `${KIND_NAME[r.kind]} · ${when(r)}${r.note ? ` · ${r.note}` : ''}`, sel, cls: 'r2-saverow', onclick: () => { this.savesPt = p.id; this.savesSel = r.key; again(); } });
    const withThumb = (el: HTMLElement, r: RecordMeta) => (el.prepend(thumb(r, 'r2-sthumb')), el);
    const ptList = kit.panel(
      'Прохождения',
      kit.scroll(
        ix.playthroughs.length
          ? ix.playthroughs.map((p) => {
              const last = [...p.records].sort((a, b) => b.seq - a.seq)[0] ?? null;
              return kit.row({ icon: p.id === this.playthroughId ? 'flag' : 'house', title: p.name, sub: `${p.id === this.playthroughId ? 'текущее · ' : ''}${p.profile !== 'normal' ? 'тестовое · ' : ''}записей: ${p.records.length}${last ? ` · ур. ${last.level}` : ''}`, sel: p === pt, onclick: () => { this.savesPt = p.id; this.savesSel = null; again(); } });
            })
          : kit.note('Прохождений нет.'),
      ),
      pt && pt.id !== this.playthroughId
        ? kit.bigBtn('Удалить прохождение', null, () => this.menus.confirm(`Удалить прохождение «${pt.name}» со всеми записями?`, () => { this.slots.deletePlaythrough(pt.id); this.savesPt = null; again(); }), false)
        : null,
      kit.bigBtn('Новое прохождение', null, () => this.chooseStart(), false),
    );
    const KINDS: [('all' | RecordKind), string][] = [['all', 'Все типы'], ...(Object.keys(KIND_NAME) as RecordKind[]).map((k) => [k, KIND_NAME[k]] as [RecordKind, string])];
    let recs = pt ? [...pt.records].filter((r) => this.savesKind === 'all' || r.kind === this.savesKind) : [];
    recs.sort((a, b) => (this.savesSort === 'new' ? b.seq - a.seq : a.seq - b.seq));
    const sel = pt?.records.find((r) => r.key === this.savesSel) ?? recs[0] ?? null;
    const detail = (r: RecordMeta | null, p: PlaythroughMeta | null) =>
      kit.panel(
        r ? title(r) : 'Запись',
        r && p
          ? [
              thumb(r, 'r2-bthumb'),
              kit.table(null, [
                ['Прохождение', p.name],
                ['Тип', KIND_NAME[r.kind]],
                ['Сохранено', fmtDate(r.savedAt)],
                ['Уровень', String(r.level)],
                ['Игровое время', `день ${r.day + 1}, ${formatClock(r.minutes)}`],
                r.note ? ['Событие', r.note] : null,
              ].filter((x): x is string[] => !!x), '.r2-kv'),
              h('div.r2-grow'),
              kit.bigBtn('Загрузить', null, () => this.loadRecord(p.id, r.key)),
              r.kind === 'manual'
                ? h('div.r2-btnrow',
                    kit.bigBtn('Перезаписать', p.id !== this.playthroughId ? 'Перезаписать можно только записи текущего прохождения' : this.hero.dead ? 'Мёртвого героя сохранить нельзя.' : null, () => this.menus.confirm(`Перезаписать «${r.name}» текущим моментом?`, () => { this.hud.toast(this.save('manual', { name: r.name, replace: r.key }) ? 'Перезаписано' : this.lastSave); this.savesSel = null; again(); }), false),
                    kit.bigBtn('Удалить', null, () => this.menus.confirm(`Удалить «${r.name}»?`, () => { this.slots.deleteRecord(p.id, r.key); this.savesSel = null; again(); }), false))
                : kit.note('Автоматические записи заменяются по очереди; удалить можно только ручные.'),
            ]
          : kit.note('Выберите запись.'),
      );
    const RULE = 'Хранятся: стартовая запись, 3 автосохранения (каждые 10 мин активной игры), 3 событийных, 1 при выходе, 3 быстрых (F5 / F9) и любые ручные. Очереди не вытесняют друг друга.';
    let body: HTMLElement;
    const top = kit.tabs([['load', 'Загрузка'], ['save', 'Сохранение']] as const, this.savesTab, (t) => this.savesMenu(t));
    if (this.savesTab === 'load') {
      body = kit.screen('Сохранения', '340px 1fr 420px', [
        ptList,
        kit.panel(
          kit.phead('Сохранения', null, pt ? pt.name : null),
          h('div.r2-filters', kit.select(KINDS, this.savesKind, (k) => { this.savesKind = k; again(); }), kit.select([['new', 'Сначала новые'], ['old', 'Сначала старые']] as const, this.savesSort, (k) => { this.savesSort = k; again(); })),
          kit.scroll(pt && recs.length ? recs.map((r) => withThumb(recRow(pt, r, r === sel), r)) : kit.note('Записей нет.')),
          kit.note(RULE),
        ),
        detail(sel, pt),
      ], top);
    } else {
      const manual = cur ? [...cur.records].filter((r) => r.kind === 'manual').sort((a, b) => b.seq - a.seq) : [];
      const msel = manual.find((r) => r.key === this.savesSel) ?? null;
      const name = document.createElement('input');
      name.className = 'r2-input';
      name.placeholder = 'Название записи';
      name.value = `Запись ${manual.length + 1}`;
      const last = cur ? [...cur.records].sort((a, b) => b.seq - a.seq)[0] ?? null : null;
      const canSave = !cur ? 'Прохождение не выбрано.' : this.hero.dead ? 'Мёртвого героя сохранить нельзя.' : null;
      const create = () => { const n = name.value.trim() || 'Без названия'; this.hud.toast(this.save('manual', { name: n }) ? `Сохранено: ${n}` : this.lastSave); again(); };
      name.onkeydown = (e) => { if (e.key === 'Enter' && !canSave) create(); };
      body = kit.screen('Сохранения', '1fr 1fr 1fr', [
        kit.panel(
          'Текущее прохождение',
          cur
            ? [
                kit.row({ icon: 'flag', title: cur.name, sub: cur.profile !== 'normal' ? 'тестовый профиль' : 'обычный профиль' }),
                thumb(last, 'r2-bthumb'),
                kit.table(null, [
                  ['Уровень', String(this.hero.progress.level)],
                  ['Создано', fmtDate(cur.created)],
                  ['Мир', `день ${this.time.clock.days + 1} · ${formatClock(this.time.clock.minutes)}`],
                  ['Записей', String(cur.records.length)],
                ], '.r2-kv'),
              ]
            : kit.note('Прохождение не выбрано.'),
        ),
        kit.panel(
          'Новое сохранение',
          h('div.r2-flabel', 'Название'),
          name,
          h('div.r2-psub', 'Создать отдельную ручную запись.'),
          h('div.r2-savehero', pxIcon('save', 96), h('p', 'Количество ручных сохранений не ограничено. Новая запись не заменяет предыдущие.')),
          kit.bigBtn('Создать сохранение', canSave, create),
        ),
        kit.panel(
          'Ручные сохранения',
          kit.scroll(cur && manual.length ? manual.map((r) => withThumb(kit.row({ title: r.name, sub: when(r), sel: r === msel, cls: 'r2-saverow', onclick: () => { this.savesSel = r.key; again(); } }), r)) : kit.note('Ручных записей нет.')),
          msel && cur
            ? [
                h('div.r2-psub', `Выбрано: ${msel.name}`),
                h('div.r2-btnrow',
                  kit.bigBtn('Перезаписать', canSave, () => this.menus.confirm(`Перезаписать «${msel.name}» текущим моментом?`, () => { this.hud.toast(this.save('manual', { name: msel.name, replace: msel.key }) ? 'Перезаписано' : this.lastSave); this.savesSel = null; again(); }), false),
                  kit.bigBtn('Удалить', null, () => this.menus.confirm(`Удалить «${msel.name}»?`, () => { this.slots.deleteRecord(cur.id, msel.key); this.savesSel = null; again(); }), false)),
                h('div.r2-psub', 'Перезапись и удаление — с подтверждением.'),
              ]
            : h('div.r2-psub', 'Выберите запись, чтобы перезаписать или удалить её.'),
        ),
      ], top);
    }
    this.menus.show('saves', body);
  }

  /** D048: the start weapon is chosen before a new playthrough begins (mockup hud-02). */
  private startPick: 'sword1' | 'bow1' | 'staff1' = 'sword1';
  private startName = '';
  chooseStart() {
    const again = () => this.chooseStart();
    const n = (() => { try { return this.slots.index().playthroughs.length + 1; } catch { return 1; } })();
    const name = document.createElement('input');
    name.className = 'r2-input r2-bigin';
    name.placeholder = `Прохождение ${n}`;
    name.value = this.startName;
    name.oninput = () => { this.startName = name.value; };
    const arm = (s: string) => ARMOR_BY_ID[`light_${s}1`]?.mesh ?? null;
    const equipFig = { main: WEAPON_BY_ID[this.startPick]?.mesh ?? null, off: null, head: arm('head'), hands: null, body: arm('chest'), feet: arm('legs') };
    const opts: ['sword1' | 'bow1' | 'staff1', string, string][] = [['sword1', 'Железный меч', 'sword'], ['bow1', 'Охотничий лук', 'bow'], ['staff1', 'Посох ученика', 'staff']];
    const go = () => this.restart(this.startPick, 'normal', this.startName.trim() || undefined);
    const body = kit.screen('Новое прохождение', '1fr 1.1fr 1fr', [
      kit.panel(
        'Название прохождения',
        name,
        kit.rule(),
        h('h2.r2-ph', 'Внешний вид'),
        h('div.r2-skinrow', h('div.r2-skin.sel', { title: 'Человек' }, pxIcon('hero', 72)), ...['face-blond', 'face-dark', 'face-red'].map((f) => h('div.r2-skin.r2-off', { title: 'Облик пока недоступен' }, pxIcon(f, 72), pxIcon('lock', 22, 'r2-skinlock')))),
        kit.note('Пока есть один облик человека. Выбор облика и цвета появится вместе с новыми обликами; внешность не влияет на характеристики.'),
      ),
      h('div.r2-startfig', heroFigure(equipFig, 340, 460)),
      kit.panel(
        'Стартовое оружие',
        opts.map(([id, label, icon]) => kit.row({ icon, iconSize: 56, title: label, sel: id === this.startPick, right: id === this.startPick ? pxIcon('check', 26) : null, onclick: () => { this.startPick = id; again(); } })),
        h('div.r2-psub', 'Лёгкая броня I, 3 малых зелья здоровья, 0 золота; умений нет. Прежние прохождения и их записи остаются.'),
        kit.rule(),
        kit.row({ title: 'Без классов', sub: 'Умения и магия изучаются у наставников' }),
        h('div.r2-grow'),
        kit.bigBtn('Начать игру', null, go),
      ),
    ]);
    this.menus.show('start', body);
  }

  /**
   * A new playthrough with its own world and history: the approved start (or, in dev mode only, a
   * test profile), day 1 08:00 at the spawn, and its start record (never evicted, D202).
   */
  restart(start: 'sword1' | 'bow1' | 'staff1' = 'sword1', profile: 'normal' | 'test' | 'high' = 'normal', name?: string) {
    if (profile !== 'normal' && !this.dev) return;
    let pt: PlaythroughMeta;
    try {
      const n = this.slots.index().playthroughs.length + 1;
      pt = this.slots.createPlaythrough(name ?? (profile === 'normal' ? `Прохождение ${n}` : `Тестовое прохождение ${n}`), profile);
    } catch (e) {
      this.loadError(e);
      return;
    }
    this.playthroughId = pt.id;
    this.menus.closeAll();
    this.growth = newGrowth(start);
    this.eworld = newEconomyWorld(this.growth);
    this.story = newStory();
    this.pendingEvent = null;
    this.ecoScene?.cancelGather();
    this.storyScene?.cancelTravel();
    this.hero = new HeroState();
    const t = new ActiveTime();
    this.time.seconds = 0;
    this.time.autosaveLeft = AUTOSAVE_SECONDS;
    this.time.clock.minutes = t.clock.minutes;
    this.time.clock.days = t.clock.days;
    const fresh = new HeroMotor(this.site.ground, this.site.spawn.x, this.site.spawn.z);
    this.motor.loadSave(fresh.toSave());
    this.installCombat(newCombatData('start'));
    if (profile !== 'normal') this.devProfile(profile);
    this.world.player.attack = null;
    this.syncPlayer(0);
    this.host.renderer.snapTo(this.motor.x, this.motor.z);
    this.input.live = !this.pause.paused;
    if (!this.save('start')) this.hud.toast(this.lastSave);
    else this.hud.toast(`${pt.name}: начало`);
  }

  // ------------------------------------------------------------------ stage 5: travel and sleep
  /** D069: the window closes first, then 5 s of standing still. */
  startTravel(kind: 'stone' | 'rune', dest: string): string | null {
    const p = this.storyScene.travelProblem(kind, dest, this.hero.inCombat);
    if (p) {
      this.hud.toast(p);
      return p;
    }
    this.menus.closeAll();
    const r = this.storyScene.startTravel(kind, dest, this.hero.inCombat);
    if (r) this.hud.toast(r);
    else this.hud.toast(kind === 'rune' ? `Руна: ${DESTINATIONS[RUNE_DEST[dest]].name} — 5 с подготовки` : 'Подготовка перемещения — 5 с');
    return r;
  }

  /**
   * D081–D083: sleep until the next occurrence of the hour. Full HP / MP / ST, every cooldown and the
   * potion cooldown end, control effects are removed; active time, respawn, corpse and autosave
   * timers do not advance (only the clock jumps).
   */
  sleep(hour: number): string | null {
    if (this.hero.inCombat) return 'Спать можно только вне боя';
    if (this.hero.dead) return 'Герой мёртв';
    const c = this.time.clock;
    const w = wakeAt(c.days, c.minutes, hour);
    c.days = w.day;
    c.minutes = w.minutes;
    const hr = this.hero;
    hr.hp = hr.maxHp;
    hr.mp = hr.maxMp;
    hr.st = hr.maxSt;
    hr.clamp();
    this.combat.data.cds = {};
    this.combat.data.normalCd = 0;
    this.growth.potionCd = 0;
    this.motor.stunLeft = 0;
    this.storyScene.cancelTravel();
    this.hud.toast(`Вы проснулись: день ${w.day + 1}, ${String(hour).padStart(2, '0')}:00`);
    return null;
  }

  /** D199: why consumables cannot be used right now. */
  consumableBusy(): string | null {
    if (this.motor.stunned) return 'Оглушение: расходники недоступны';
    if (this.motor.dodging) return 'Во время уклонения расходники недоступны';
    if (this.combat.data.action) return 'Во время атаки или подготовки расходники недоступны';
    return null;
  }

  /** D086: ≥ min metres from the hero and out of the camera's view or behind an obstacle. */
  canRespawnAt(x: number, z: number, min: number): boolean {
    const m = this.motor;
    const g = this.site.ground;
    const dx = x - m.x;
    const dz = z - m.z;
    const dist = Math.hypot(dx, dz);
    if (dist < min) return false;
    const [fx, fz] = this.forward();
    const inCone = (dx * fx + dz * fz) / dist > Math.cos((60 * Math.PI) / 180);
    return !inCone || !this.combat.los(m.x, m.y + 1.6, m.z, x, g.top(x, z) + 0.6, z);
  }

  /** D047: the death screen; no automatic load and no save of the dead hero. */
  private onDeath() {
    if (this.menus.isOpen('death')) return;
    const body = h(
      'div',
      h('h1', 'Вы погибли'),
      h('div.r2-rule'),
      h('button.r2-btn.primary', { onclick: () => this.loadLatest() }, 'Загрузить последнее'),
      h('button.r2-btn', { onclick: () => this.savesMenu() }, 'Выбрать сохранение'),
      h('button.r2-btn', { onclick: () => this.leave() }, 'Главное меню'),
      h('div.r2-note', 'Смерть не создаёт сохранение; прежние записи остаются.'),
    );
    this.menus.show('death', body);
  }

  // ------------------------------------------------------------------ markers and dev mode
  /** Cubic signposts with Russian labels (test markers; later stages' placeholders use the same). */
  private addMarkers(list: TestMarker[]) {
    const group = new THREE.Group();
    const wood = new THREE.MeshLambertMaterial({ color: 0x7a5530 });
    const board = new THREE.MeshLambertMaterial({ color: 0xc8a064 });
    for (const m of list) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.3, 0.16), wood);
      post.position.set(m.x, m.y + 0.65, m.z);
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.42, 0.1), board);
      b.position.set(m.x, m.y + 1.2, m.z);
      group.add(post, b);
      const label = labelSprite(m.label);
      label.position.set(m.x, m.y + 2.05, m.z);
      group.add(label);
    }
    this.host.renderer.addRunObject(group);
  }

  private buildDev() {
    (window as unknown as { rpg2?: TestScene }).rpg2 = this;
    // collapsed by default so it does not cover the HUD (mockup hud-07); the title opens it
    const box = h('div.r2.r2-dev.r2-panel', h('b', { title: 'Показать / скрыть', onclick: (e: MouseEvent) => { e.stopPropagation(); box.classList.toggle('open'); } }, 'Режим разработки'));
    const btn = (label: string, fn: () => void) => box.append(h('button', { onclick: (e: MouseEvent) => { e.stopPropagation(); fn(); } }, label));
    btn('Полные HP / MP / ST', () => this.devSet({ hp: this.hero.maxHp, mp: this.hero.maxMp, st: this.hero.maxSt }));
    btn('ST = 0', () => this.devSet({ st: 0 }));
    btn('ST = 9', () => this.devSet({ st: 9 }));
    btn('HP = 50 %', () => this.devSet({ hp: this.hero.maxHp / 2 }));
    btn('Атака врага (бой)', () => this.hero.combatEvent());
    btn('Оглушить на 2 с', () => this.motor.applyStun(2));
    btn('Замедление 50 % / снять', () => (this.motor.slow = this.motor.slow ? 0 : 0.5));
    btn('Тестовый профиль: всё оружие и умения', () => this.devProfile('test'));
    btn('Высокий уровень: 60, характеристики 100', () => this.devProfile('high'));
    btn('Обычный старт: меч без умений', () => this.devProfile('start'));
    btn('+1000 золота', () => this.devGrant({ gold: 1000 }));
    btn('+50 LP', () => this.devGrant({ lp: 50 }));
    btn('+5000 XP', () => this.devGrant({ xp: 5000 }));
    btn('Предмет…', () => this.openDevItems());
    btn('+20 всех материалов', () => this.devMaterials(20));
    btn('Нож, кирка и топор', () => { for (const t of ['knife', 'pickaxe', 'axe']) this.devItem(t); this.hud.toast('Инструменты добавлены'); });
    btn('Все ремёсла, охота и сбор', () => this.devCrafts());
    btn('Активное время +60 мин (мир)', () => this.devAdvance(3600));
    btn('Оружие и умения…', () => this.openLoadout());
    btn('Возродить противников', () => this.combat.respawnAll());
    btn('Разозлить Серого Клыка', () => this.combat.provoke('greyfang1'));
    for (const m of this.site.markers.filter((x) => x.tp)) btn(`Телепорт: ${m.label}`, () => this.devTeleport(m.id === 'spawn' ? this.site.spawn.x : m.x, m.id === 'spawn' ? this.site.spawn.z : m.z));
    this.devPanel = box;
    this.host.root.appendChild(box);
  }

  /** Dev mode only: switches the combat profile (ОМ, enemies and cooldowns stay). */
  devProfile(p: 'test' | 'start' | 'high') {
    if (!this.dev) return;
    // a test profile used on a normal playthrough marks it as a test playthrough (kept apart, D214)
    if (p !== 'start' && this.playthroughId) this.slots.markProfile(this.playthroughId, p);
    const d = this.combat.data;
    if (p === 'high') {
      addXp(this.hero.progress, XP_CAP);
      for (const s of STAT_IDS) this.hero.stats[s] = Math.max(this.hero.stats[s], 100);
      this.growth.gold += 1_000_000;
      this.growth.circles = 5;
      this.hero.clamp();
      this.growthChanged();
      this.hud.toast('Высокий уровень: 60, характеристики 100, 1 000 000 золота');
      return;
    }
    if (p === 'test') {
      applyTestProfile(d);
      this.growth.circles = 5;
      for (const r of RARITIES) for (const tpl of ['sword1', 'bow1', 'staff1']) if (r !== 'common') addItem(this.growth, tpl, r);
      this.linkGrowth();
    } else {
      const f = newCombatData('start');
      d.profile = 'start';
      d.quick = f.quick;
      d.cur = 0;
      d.learned = [];
      d.panels = f.panels;
    }
    this.combat.cancelAction();
    if (p === 'start') this.linkGrowth();
    this.hud.toast(p === 'test' ? 'Тестовый профиль: 4 оружия, 12 навыков, 15 заклинаний' : 'Обычный старт: железный меч, без умений');
  }

  /** Replaces the combat system (new playthrough or a loaded record): the enemies of the arena are placed if missing. */
  private installCombat(data: CombatData) {
    const g = this.site.ground;
    // the arena's enemies; ones added by a later stage (the stage 5 bandits) join an older record
    for (const e of arenaEnemies(g)) if (!data.enemies.some((x) => x.uid === e.uid)) data.enemies.push(e);
    const wfx = this.world.fx;
    this.combat = new CombatSystem(g, this.hero, this.motor, () => this.world.dummies, {
      number: (x, z, v, crit, col) => wfx.number(x, z, v, crit, col),
      burst: (x, y, z, col, n) => wfx.burst(x, y - g.top(x, z), z, col, n, 2.4, 0.12, 0.4, 'glow'),
      sound: (id, v) => wfx.sound(id, v),
      toast: (t) => this.hud.toast(t),
      dummyHit: (id, v, magic, fx, fz) => {
        const d = this.world.dummies.find((x) => x.id === id);
        if (d) this.world.damage(d, v, magic, fx, fz);
      },
    }, data);
    // D021: respawn only when the hero is ≥ 80 m away and the spot is out of view
    this.combat.canRespawn = (e) => {
      const m = this.motor;
      const dx = e.homeX - m.x;
      const dz = e.homeZ - m.z;
      const dist = Math.hypot(dx, dz);
      if (dist < 80) return false;
      const [fx, fz] = this.forward();
      const inCone = (dx * fx + dz * fz) / dist > Math.cos((60 * Math.PI) / 180);
      return !inCone || !this.combat.los(m.x, m.y + 1.6, m.z, e.homeX, g.top(e.homeX, e.homeZ) + 0.6, e.homeZ);
    };
    this.linkGrowth();
    this.combat.onKilled = (e) => this.ecoScene.onKilled(e);
    this.combat.onCredited = (e) => this.storyScene.onCredited(e);
    if (this.view) this.view.root.parent?.remove(this.view.root);
    this.view = new CombatView(this.combat);
    this.host.renderer.addRunObject(this.view.root);
    this.syncWeapon();
  }

  /**
   * Stage 3: the combat system reads the weapon, quick list items and every bonus from growth;
   * the quick list holds item uids (template ids of an old record become the matching items).
   */
  private linkGrowth() {
    const c = this.combat;
    const hero = this.hero;
    const gr = () => this.growth;
    c.gear = {
      weaponTpl: () => itemOf(gr(), gr().equip.weapon)?.tpl ?? 'sword1',
      itemTpl: (uid) => itemOf(gr(), uid)?.tpl,
      equipWeapon: (uid) => equip(gr(), uid, hero),
      bonuses: () => combatBonuses(gr()),
    };
    const d = c.data;
    const g = this.growth;
    d.quick = d.quick.map((q) => {
      if (!q) return null;
      if (itemOf(g, q) && isWeapon(itemOf(g, q)!.tpl)) return q;
      const it = g.items.find((i) => i.tpl === q) ?? (isWeapon(q) ? addItem(g, q, 'common') : null);
      return it ? it.uid : null;
    });
    while (d.quick.length < 4) d.quick.push(null);
    const w = g.equip.weapon;
    const k = d.quick.indexOf(w);
    if (k >= 0) d.cur = k;
    else {
      const free = d.quick.indexOf(null);
      d.cur = free >= 0 ? free : 0;
      d.quick[d.cur] = w;
    }
    this.growthChanged();
  }

  /** Equipment, talents or stats changed: maxima, armor and the drawn gear follow (D121). */
  growthChanged() {
    applyHeroMods(this.growth, this.hero);
    this.combat.heroArmor = totalArmor(this.growth);
    // the equipped weapon is always in the quick list at the current slot
    const d = this.combat.data;
    const w = this.growth.equip.weapon;
    if (w && d.quick[d.cur] !== w) {
      const k = d.quick.indexOf(w);
      if (k >= 0) d.cur = k;
      else d.quick[d.cur] = w;
    }
    this.syncWeapon();
  }

  /** The drawn weapon and armor follow the equipment (existing cubic item meshes). */
  private syncWeapon() {
    const e = this.gear.equip;
    const arm = (slot: 'head' | 'chest' | 'legs') => {
      const it = itemOf(this.growth, this.growth.equip[slot]);
      return it ? ARMOR_BY_ID[it.tpl]?.mesh ?? null : null;
    };
    const want = { main: this.combat.weapon.mesh, off: null, head: arm('head'), body: arm('chest'), feet: arm('legs') };
    if (e.main === want.main && !e.off && e.head === want.head && e.body === want.body && e.feet === want.feet) return;
    Object.assign(e, want);
    this.world.setGear(cloneGear(this.gear));
  }

  // ------------------------------------------------------------------ mentors (placeholders until stage 5)
  private mentorSpots: { id: MentorId; x: number; z: number }[] = [
    { id: 'arden', x: 46, z: 55 },
    { id: 'hira', x: 46, z: 59 },
    { id: 'mira', x: 46, z: 63 },
  ];

  /** Mentors on the hero's model (src/render/human/npcs.ts); E within 3 m opens the training window. */
  private addMentors() {
    const group = new THREE.Group();
    for (const sp of this.mentorSpots) {
      const y = this.site.ground.top(sp.x, sp.z);
      const npc = npcModel(sp.id);
      npc.root.position.set(sp.x, y, sp.z);
      npc.root.rotation.y = Math.PI / 2;
      group.add(npc.root);
      const m = MENTORS[sp.id];
      const label = labelSprite(m.name);
      label.position.set(sp.x, y + 2.4, sp.z);
      group.add(label);
    }
    this.host.renderer.addRunObject(group);
  }

  /** D207: up to four weapons for Tab and a 1–6 panel per weapon type (a window of the pause menu). */
  openLoadout() {
    const c = this.combat;
    const d = c.data;
    const sel = (opts: [string, string][], value: string | null, on: (v: string | null) => void) => {
      const s = document.createElement('select');
      s.className = 'r2-select';
      for (const [v, label] of opts) {
        const o = document.createElement('option');
        o.value = v;
        o.textContent = label;
        s.append(o);
      }
      s.value = value ?? '';
      s.onchange = () => on(s.value || null);
      return s;
    };
    const owned = this.growth.items.filter((it) => isWeapon(it.tpl));
    const wOpts: [string, string][] = [['', '— пусто —'], ...owned.map((it) => [it.uid, itemName(it)] as [string, string])];
    const setQ = (i: number, v: string | null) => {
      if (i === d.cur && v !== this.growth.equip.weapon) {
        // the current slot holds the equipped weapon: changing it equips the new one (requirements checked)
        const why = v ? equip(this.growth, v, this.hero) : 'Текущее оружие можно только заменить';
        if (why) return this.hud.toast(why);
      }
      d.quick[i] = v;
      this.growthChanged();
    };
    const quick = h('div.r2-loadout', h('span', 'Tab'), [0, 1, 2, 3].map((i) => sel(wOpts, d.quick[i], (v) => { setQ(i, v); this.openLoadout(); })), h('span', ''), h('span', ''));
    const panels = h('div.r2-loadout');
    for (const f of ['sword', 'bow', 'staff'] as WeaponFamily[]) {
      const ids = (f === 'staff' ? SPELLS.map((x) => x.id) : SKILLS.filter((x) => x.family === f).map((x) => x.id)).filter((id) => d.learned.includes(id));
      const opts: [string, string][] = [['', '— пусто —'], ...ids.map((id) => [id, abilityName(id)] as [string, string])];
      panels.append(h('span', FAMILY_NAME[f]));
      for (let i = 0; i < 6; i++) panels.append(sel(opts, d.panels[f][i], (v) => { d.panels[f][i] = v; }));
    }
    const body = h(
      'div',
      h('h1', 'Оружие и умения'),
      h('div.r2-rule'),
      h('h3', 'Быстрое переключение (до четырёх, по кругу клавишей Tab)'),
      quick,
      h('h3', `Панели 1–6 по типу оружия (сейчас: ${FAMILY_NAME[c.family]} — ${c.weapon.name})`),
      d.learned.length ? panels : h('p.r2-note', 'Умения не изучены: их преподают наставники Арден, Хира и Мира (E рядом с ними). В режиме разработки есть «Тестовый профиль».'),
      h('p.r2-note', 'Одноручный и двуручный меч используют один набор. Откаты сохраняются при смене оружия.'),
      h('button.r2-btn.small', { onclick: () => this.menus.close('loadout') }, 'Закрыть'),
    );
    if (this.menus.isOpen('loadout')) this.menus.close('loadout');
    this.menus.show('loadout', body);
  }

  /** Dev mode only: grants gold, LP or XP (XP raises levels as a kill would). */
  devGrant(v: { gold?: number; lp?: number; xp?: number }) {
    if (!this.dev) return;
    if (v.gold) this.growth.gold += v.gold;
    if (v.lp) this.hero.progress.lp += v.lp;
    if (v.xp) {
      const up = addXp(this.hero.progress, v.xp);
      if (up) this.hud.toast(`Новый уровень: ${this.hero.progress.level}`);
    }
  }

  /**
   * Test scene training aid (owner's request): the mentor window raises the level or adds XP.
   * The test scene is the only place it exists; the big world has no such buttons.
   */
  trainXp(v: { levels?: number; xp?: number }) {
    const pr = this.hero.progress;
    let amount = v.xp ?? 0;
    if (v.levels) amount += Math.max(0, xpForLevel(Math.min(60, pr.level + v.levels)) - pr.xp);
    const up = addXp(pr, amount);
    this.growthChanged();
    this.hud.toast(up ? `Новый уровень: ${pr.level}` : amount > 0 ? `+${amount} XP` : 'Максимальный уровень');
  }

  /** Dev mode only: every material ×n. */
  devMaterials(n: number) {
    if (!this.dev) return;
    for (const k of Object.keys(MATERIAL_NAMES)) addStack(this.growth, k, n);
    this.hud.toast(`+${n} каждого материала`);
  }

  /** Dev mode only: all craft tiers, hunting and the rare gathering skills. */
  devCrafts() {
    if (!this.dev) return;
    this.growth.crafts = { smith: 3, alchemy: 3, cooking: 3 };
    this.growth.hunt = 3;
    this.growth.gather = ['rareplants', 'rareminerals', 'rarewood'];
    this.hud.toast('Все ремёсла, охота и редкий сбор изучены');
  }

  /** Dev mode only: runs the world's active-time timers (corpses, points, merchants, potion cooldown). */
  devAdvance(sec: number) {
    if (!this.dev) return;
    this.ecoScene.tick(sec, (x, z) => this.canRespawnAt(x, z, 30));
    this.hud.toast(`Мир: +${Math.round(sec / 60)} мин активного времени`);
  }

  /** Dev mode only: creates an item of any template and rarity (affixes rolled as in the catalog). */
  devItem(tpl: string, rarity: Rarity = 'common'): string | null {
    if (!this.dev) return null;
    if (!isItemTpl(tpl)) return null;
    return addItem(this.growth, tpl, rarity).uid;
  }

  private openDevItems() {
    const tplSel = document.createElement('select');
    tplSel.className = 'r2-select';
    for (const w of WEAPONS) tplSel.append(new Option(w.name, w.id));
    for (const a of Object.values(ARMOR_BY_ID)) tplSel.append(new Option(a.name, a.id));
    const rSel = document.createElement('select');
    rSel.className = 'r2-select';
    for (const r of RARITIES) rSel.append(new Option(RARITY[r].name, r));
    const body = h(
      'div',
      h('h1', 'Создать предмет'),
      h('div.r2-rule'),
      tplSel,
      rSel,
      h('button.r2-btn.primary', { onclick: () => { if (this.devItem(tplSel.value, rSel.value as Rarity)) this.hud.toast('Предмет создан'); } }, 'Создать'),
      h('button.r2-btn.small', { onclick: () => this.menus.close('devItems') }, 'Закрыть'),
    );
    this.menus.show('devItems', body);
  }

  /** Dev mode only: sets current resources. */
  devSet(v: Partial<Record<'hp' | 'mp' | 'st', number>>) {
    if (!this.dev) return;
    if (v.hp !== undefined) this.hero.hp = v.hp;
    if (v.mp !== undefined) this.hero.mp = v.mp;
    if (v.st !== undefined) this.hero.st = v.st;
    this.hero.clamp();
  }

  /** Dev mode only: puts the hero on the ground at (x, z). */
  devTeleport(x: number, z: number) {
    if (!this.dev) return;
    this.placeHero(x, z);
  }

  /** Puts the hero on the ground at (x, z) (dev teleport, waystones and runes). */
  placeHero(x: number, z: number) {
    const s = this.motor.toSave();
    const y = this.site.ground.top(x, z);
    this.motor.loadSave({ ...s, x, z, y, vx: 0, vy: 0, vz: 0, mode: 'ground', fallTop: y, airJumpReady: true, dodge: null });
    this.syncPlayer(0);
    this.host.renderer.snapTo(x, z);
  }
}

/** Real date and time of a record. */
function fmtDate(ms: number): string {
  const d = new Date(ms);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getDate())}.${p(d.getMonth() + 1)} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

/** Metres with a Russian decimal comma. */
function m1(v: number): string {
  return v.toFixed(1).replace('.', ',');
}

function fmtDur(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  return `${m} мин ${s % 60} с`;
}

/** A pixel-font label drawn on a canvas, always facing the camera. */
function labelSprite(text: string): THREE.Sprite {
  const c = document.createElement('canvas');
  const g = c.getContext('2d')!;
  const font = 'bold 28px Rubik, sans-serif';
  g.font = font;
  const w = Math.ceil(g.measureText(text).width) + 24;
  c.width = w;
  c.height = 44;
  g.font = font;
  g.fillStyle = 'rgba(10,9,8,0.82)';
  g.fillRect(0, 0, w, 44);
  g.strokeStyle = '#b8913f';
  g.lineWidth = 2;
  g.strokeRect(1, 1, w - 2, 42);
  g.fillStyle = '#f6dfa4';
  g.textBaseline = 'middle';
  g.fillText(text, 12, 23);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = THREE.NearestFilter;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthWrite: false, transparent: true }));
  const k = 0.0085;
  sp.scale.set(w * k, 44 * k, 1);
  return sp;
}


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
import { SaveError, readPlaythrough, restore, snapshot, writePlaythrough, type PlaythroughSave } from './save';
import { buildTestSite, type TestMarker, type TestSite } from './testSite';
import { ActiveTime } from './time';
import { SceneHud } from './ui/hud';
import { SceneMenus } from './ui/menus';
import { SKILLS, SPELLS, WEAPONS, abilityName, type WeaponFamily } from './combat/data';
import { CombatSystem, FAMILY_NAME, applyTestProfile, arenaEnemies, newCombatData, type Aim, type CombatData } from './combat/system';
import { CombatView } from './combat/view';
import { MENTORS, MENTOR_RANGE, addItem, applyHeroMods, combatBonuses, equip, itemOf, newGrowth, totalArmor, type GrowthData, type MentorId } from './growth/growth';
import { ARMOR_BY_ID, RARITIES, RARITY, isWeapon, itemName, type Rarity } from './growth/items';
import { XP_CAP, addXp } from './growth/levels';
import { GrowthScreens } from './ui/growthUi';

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
const LOOK = { yaw: 0.0028, pitch: 0.0018 };

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
  private mentorHint: HTMLElement | null = null;
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
  private playthroughId = 'test';
  private disposed = false;
  /** Last result of the save / load for tests and the dev panel. */
  lastSave = '';
  /** Counters for automated checks. */
  stats = { jumps: 0, airJumps: 0, dodges: 0, attacks: 0, autosaves: 0 };

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
      this.intent = { ...NO_INTENT };
      this.input.releaseLock();
    };
    this.pause.onResume = () => {
      this.input.freeze();
      this.input.live = !this.hero.dead;
    };
    this.input.onMenuKey = (code) => this.menuKey(code);
    this.input.onLockLost = () => {
      if (!this.pause.paused) this.openPause();
    };
  }

  // ------------------------------------------------------------------ start / stop
  /** Enters the scene: loads the test playthrough or starts a new one (day 1, 08:00). */
  start() {
    this.site = buildTestSite();
    this.world = this.host.createWorld(this.site, this.time.clock, cloneGear(this.gear));
    this.motor = new HeroMotor(this.site.ground, this.site.spawn.x, this.site.spawn.z);
    this.world.driver = (dt) => this.step(dt);
    this.installCombat(newCombatData('start'));
    this.addMarkers(this.site.markers);
    this.addMentors();
    this.input.active = true;
    this.input.live = true;
    this.hud.setVisible(true);
    if (this.dev) this.buildDev();
    let save: PlaythroughSave | null = null;
    try {
      save = readPlaythrough();
    } catch (e) {
      this.loadError(e);
      this.syncPlayer(0);
      return;
    }
    if (save) this.apply(save);
    else this.syncPlayer(0);
    this.host.renderer.snapTo(this.motor.x, this.motor.z);
    this.hud.toast(save ? 'Тестовая площадка: продолжение' : 'Тестовая площадка: новое прохождение');
    window.addEventListener('blur', this.onBlur);
    document.addEventListener('visibilitychange', this.onBlur);
  }

  private onBlur = () => {
    if (!this.disposed && !this.pause.paused && (document.hidden || !document.hasFocus())) this.openPause();
  };

  /** Leaves to the main menu: the regular exit saves the moment (D042), never a dead hero. */
  exit() {
    if (!this.hero.dead) this.save('exit');
    this.dispose();
    this.host.exit();
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.input.releaseLock();
    this.input.active = false;
    this.input.dispose();
    this.menus.closeAll();
    this.hud.dispose();
    this.devPanel?.remove();
    this.mentorHint?.remove();
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
        if (this.time.advance(dt) && !this.hero.dead) {
          this.stats.autosaves++;
          if (this.save('auto')) this.hud.toast('Автосохранение');
        }
        if (this.hero.dead) this.onDeath();
      }
    }
    this.host.renderer.frame(this.pause.paused ? 0 : dt);
    this.view?.update(this.pause.paused ? 0 : dt, this.aim.target);
    this.hud.updateCombat(this.combat, this.aim);
    this.hud.update(this.world, this.hero, this.motor, this.time, HERO_NAME, rig.yaw, realDt);
    this.host.worldMap.yaw = rig.yaw;
    this.host.worldMap.draw(this.world);
    this.updateMentorHint();
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
    if (pr.has('map')) return this.toggleMap(true);
    if (pr.has('character')) return this.openCharacter();
    if (pr.has('progress')) return this.screens.development();
    if (pr.has('interact')) {
      const m = this.nearMentor();
      if (m && this.hero.inCombat) this.hud.toast('Наставник не учит во время боя');
      else if (m) return this.screens.mentor(m);
    }
    if (pr.has('quickSave')) this.quickSave();
    if (pr.has('quickLoad')) return this.quickLoad();
    for (const a of ['journal', 'bestiary', 'trade', 'dialog'] as ControlAction[]) if (pr.has(a)) this.hud.toast(`«${actionName(a)}» — появится на следующих этапах`);
    if (pr.has('walkToggle')) {
      this.motor.walk = !this.motor.walk;
      this.hud.toast(this.motor.walk ? 'Ходьба' : 'Бег');
    }
    const [fx, fz] = this.forward();
    let mx = 0;
    let mz = 0;
    const f = (inp.held('moveF') ? 1 : 0) - (inp.held('moveB') ? 1 : 0);
    const r = (inp.held('moveR') ? 1 : 0) - (inp.held('moveL') ? 1 : 0);
    mx = fx * f + -fz * r;
    mz = fz * f + fx * r;
    const l = Math.hypot(mx, mz);
    if (l > 1) {
      mx /= l;
      mz /= l;
    }
    this.intent = {
      moveX: mx,
      moveZ: mz,
      faceX: fx,
      faceZ: fz,
      sprintHeld: inp.held('sprint'),
      sprintPressed: pr.has('sprint'),
      jumpPressed: pr.has('jump'),
      dodgePressed: pr.has('dodge'),
    };
    this.attackPress = pr.has('attack');
    this.rmbPress = pr.has('block');
    this.swapPress = pr.has('weaponSwap');
    for (let i = 1; i <= 6; i++) if (pr.has(`skill${i}` as ControlAction)) this.skillPress(i);
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
    this.aim = c.aimAhead();
    c.update(dt, {
      attackHeld: !hero.dead && !m.dodging && (this.input.held('attack') || this.attackPress),
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
    p.attack = a ? ({ weapon: null, t: a.t, dur: a.dur, hitAt: Math.min(1, a.hitAt / a.dur), done: a.t >= a.hitAt, dirX: a.dirX, dirZ: a.dirZ, seq: a.rec } as unknown as typeof p.attack) : null;
    this.syncWeapon();
    hero.tick(dt, { campfire: false }, m.sprinting);
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
      btn('Сохранить', () => {
        note.textContent = this.save('manual') ? 'Сохранено.' : this.lastSave;
      }),
      btn('Загрузить последнее', () => this.quickLoad()),
      btn('Начать площадку заново', () => this.menus.confirm('Начать тестовое прохождение заново? Текущее состояние будет заменено при следующем сохранении.', () => this.chooseStart())),
      btn('Выйти в главное меню', () => this.exit()),
      note,
      h('div.r2-note', 'Мир, время, восстановление и перезарядки стоят, пока открыто любое окно.'),
    );
    this.menus.show('pause', body);
  }

  /** «Продолжить»: closes the pause menu and captures the pointer again (a click is a gesture). */
  private resume() {
    this.menus.close('pause');
    if (!this.pause.paused) this.input.requestLock();
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

  // ------------------------------------------------------------------ saves
  /** Writes the test playthrough (never for a dead hero, D047 / D213). */
  save(kind: 'manual' | 'quick' | 'auto' | 'exit'): boolean {
    if (this.hero.dead) {
      this.lastSave = 'Мёртвого героя сохранить нельзя.';
      return false;
    }
    const s = snapshot({ id: this.playthroughId, map: this.site.map.id, name: HERO_NAME, race: 'human', hero: this.hero, motor: this.motor.toSave(), time: this.time, combat: this.combat.data, growth: this.growth });
    const ok = writePlaythrough(s);
    this.lastSave = ok ? `Сохранено (${kind})` : 'Не удалось записать сохранение: браузер отказал в хранилище.';
    return ok;
  }

  quickSave() {
    if (this.save('quick')) this.hud.toast('Быстрое сохранение');
    else this.hud.toast(this.lastSave);
  }

  /** Loads the last record of the test playthrough. */
  quickLoad() {
    let s: PlaythroughSave | null;
    try {
      s = readPlaythrough();
    } catch (e) {
      this.loadError(e);
      return;
    }
    if (!s) {
      this.hud.toast('Сохранений тестовой площадки пока нет');
      return;
    }
    this.menus.closeAll();
    this.apply(s);
    this.hud.toast('Загружено');
  }

  /** Puts a record into the running scene (hero, movement, clock, active time). */
  private apply(s: PlaythroughSave) {
    const r = restore(s);
    this.playthroughId = s.id;
    this.hero = r.hero;
    this.time.seconds = r.time.seconds;
    this.time.autosaveLeft = r.time.autosaveLeft;
    this.time.clock.minutes = r.time.clock.minutes;
    this.time.clock.days = r.time.clock.days;
    this.motor.loadSave(s.motor);
    this.growth = r.growth;
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
      h('p', `Сохранение тестовой площадки не загружено: ${why}.`),
      h('p.r2-note', 'Старая запись не удалена. Можно начать заново (запись будет заменена при следующем сохранении) или выйти.'),
      h('button.r2-btn.primary', { onclick: () => { this.menus.close('loadError'); this.restart(); } }, 'Начать заново'),
      h('button.r2-btn', { onclick: () => { this.dispose(); this.host.exit(); } }, 'Главное меню'),
    );
    this.menus.show('loadError', body);
  }

  /** D048: the start weapon is chosen before a new playthrough begins. */
  chooseStart() {
    const pick = (id: 'sword1' | 'bow1' | 'staff1', label: string) => h('button.r2-btn', { onclick: () => this.restart(id) }, label);
    const body = h(
      'div',
      h('h1', 'Начальное оружие'),
      h('div.r2-rule'),
      h('p', 'Выберите оружие, с которым герой начнёт путь. Лёгкая броня I, 3 малых зелья здоровья, 0 золота; умений нет.'),
      pick('sword1', 'Железный меч'),
      pick('bow1', 'Охотничий лук'),
      pick('staff1', 'Посох ученика'),
      h('button.r2-btn.small', { onclick: () => this.menus.close('start') }, 'Отмена'),
    );
    this.menus.show('start', body);
  }

  /** A new test playthrough: full resources, day 1 08:00, at the spawn. */
  restart(start: 'sword1' | 'bow1' | 'staff1' = 'sword1') {
    this.menus.closeAll();
    this.growth = newGrowth(start);
    this.hero = new HeroState();
    const t = new ActiveTime();
    this.time.seconds = 0;
    this.time.autosaveLeft = AUTOSAVE_SECONDS;
    this.time.clock.minutes = t.clock.minutes;
    this.time.clock.days = t.clock.days;
    const fresh = new HeroMotor(this.site.ground, this.site.spawn.x, this.site.spawn.z);
    this.motor.loadSave(fresh.toSave());
    this.installCombat(newCombatData('start'));
    this.world.player.attack = null;
    this.playthroughId = 'test';
    this.syncPlayer(0);
    this.host.renderer.snapTo(this.motor.x, this.motor.z);
    this.input.live = !this.pause.paused;
  }

  /** D047: the death screen; no automatic load and no save of the dead hero. */
  private onDeath() {
    if (this.menus.isOpen('death')) return;
    const body = h(
      'div',
      h('h1', 'Вы погибли'),
      h('div.r2-rule'),
      h('button.r2-btn.primary', { onclick: () => this.quickLoad() }, 'Загрузить последнее'),
      h('button.r2-btn', { onclick: () => this.chooseStart() }, 'Начать площадку заново'),
      h('button.r2-btn', { onclick: () => this.exit() }, 'Главное меню'),
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
    const box = h('div.r2.r2-dev.r2-panel', h('b', 'Режим разработки'));
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
    if (!data.enemies.length) data.enemies = arenaEnemies(g);
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

  /** Cubic placeholder figures with name labels; E within 3 m opens the training window. */
  private addMentors() {
    const group = new THREE.Group();
    const colors: Record<MentorId, number> = { arden: 0x8c3b2a, hira: 0x3d6b32, mira: 0x3a4f8f };
    const skin = new THREE.MeshLambertMaterial({ color: 0xd9a87c });
    const legs = new THREE.MeshLambertMaterial({ color: 0x3a2f28 });
    for (const sp of this.mentorSpots) {
      const y = this.site.ground.top(sp.x, sp.z);
      const cloth = new THREE.MeshLambertMaterial({ color: colors[sp.id] });
      const parts: [THREE.Material, number, number, number, number][] = [
        [legs, 0.5, 0.75, 0.3, 0.375],
        [cloth, 0.6, 0.75, 0.35, 1.125],
        [skin, 0.5, 0.5, 0.5, 1.75],
      ];
      for (const [mat, w, hh, dd, cy] of parts) {
        const b = new THREE.Mesh(new THREE.BoxGeometry(w, hh, dd), mat);
        b.position.set(sp.x, y + cy, sp.z);
        b.rotation.y = Math.PI / 2;
        group.add(b);
      }
      const m = MENTORS[sp.id];
      const label = labelSprite(m.name);
      label.position.set(sp.x, y + 2.4, sp.z);
      group.add(label);
    }
    this.host.renderer.addRunObject(group);
    this.mentorHint = h('div.r2.r2-hint');
    this.mentorHint.style.display = 'none';
    this.host.root.appendChild(this.mentorHint);
  }

  /** The mentor within the 3 m interaction range, if any. */
  nearMentor(): MentorId | null {
    let best: MentorId | null = null;
    let bd = MENTOR_RANGE;
    for (const sp of this.mentorSpots) {
      const d = Math.hypot(sp.x - this.motor.x, sp.z - this.motor.z);
      if (d <= bd) {
        bd = d;
        best = sp.id;
      }
    }
    return best;
  }

  private updateMentorHint() {
    const el = this.mentorHint;
    if (!el) return;
    const m = !this.pause.paused && !this.hero.dead ? this.nearMentor() : null;
    const txt = m ? `${codeName(this.controls.binds.interact[0] ?? 'KeyE')} — обучение: ${MENTORS[m].name}` : '';
    if (el.textContent !== txt) el.textContent = txt;
    el.style.display = txt ? '' : 'none';
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

  /** Dev mode only: creates an item of any template and rarity (affixes rolled as in the catalog). */
  devItem(tpl: string, rarity: Rarity = 'common'): string | null {
    if (!this.dev) return null;
    if (!isWeapon(tpl) && !ARMOR_BY_ID[tpl]) return null;
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
    const s = this.motor.toSave();
    const y = this.site.ground.top(x, z);
    this.motor.loadSave({ ...s, x, z, y, vx: 0, vy: 0, vz: 0, mode: 'ground', fallTop: y, airJumpReady: true, dodge: null });
    this.syncPlayer(0);
    this.host.renderer.snapTo(x, z);
  }
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


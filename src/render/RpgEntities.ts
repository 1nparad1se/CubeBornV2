import * as THREE from 'three';
import type { World, Projectile } from '../rpg/World';
import { HumanModel } from './human/HumanModel';
import { DummyModel } from './human/DummyModel';
import { arrowModel, itemMaterial } from './human/itemMeshes';
import { RACE_BY_ID } from '../rpg/races';
import { JUMP } from '../rpg/Player';

/** Square pixel ring lying on the ground (target marker). */
function ringGeo(r: number, w: number): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(-r, -r);
  s.lineTo(r, -r);
  s.lineTo(r, r);
  s.lineTo(-r, r);
  s.lineTo(-r, -r);
  const hole = new THREE.Path();
  const q = r - w;
  hole.moveTo(-q, -q);
  hole.lineTo(-q, q);
  hole.lineTo(q, q);
  hole.lineTo(q, -q);
  hole.lineTo(-q, -q);
  s.holes.push(hole);
  const g = new THREE.ShapeGeometry(s);
  g.rotateX(-Math.PI / 2);
  return g;
}

/** Draws the training ground's actors: the hero, the dummies, projectiles and the target marker. */
export class RpgEntities {
  readonly group = new THREE.Group();
  readonly hero: HumanModel;
  private dummies: DummyModel[] = [];
  private yaw = 0;
  private proj = new Map<Projectile, THREE.Object3D>();
  private arrowGeo = arrowModel(false);
  private boltGeo = arrowModel(true);
  private sparkGeo = new THREE.BoxGeometry(0.14, 0.14, 0.14);
  private orbGeo = new THREE.BoxGeometry(0.24, 0.24, 0.24);
  private sparkMat = new THREE.MeshBasicMaterial({ color: 0xffb040 });
  private orbMat = new THREE.MeshBasicMaterial({ color: 0x6ab8ff });
  private ring: THREE.Mesh;
  private ringMat = new THREE.MeshBasicMaterial({ color: 0xff5040, transparent: true, opacity: 0.9, depthWrite: false });
  private equipKey = '';
  /** Where the last walk order points: a small ring on the ground that fades while walking. */
  private mark: THREE.Mesh;
  private markMat = new THREE.MeshBasicMaterial({ color: 0xe8ffd0, transparent: true, opacity: 0.9, depthWrite: false });
  private markLife = 0;
  /** Seconds the weapon stays ready after the last sign of a fight. */
  private combatT = 0;

  constructor(private world: World, shadows: boolean) {
    this.hero = new HumanModel(RACE_BY_ID[world.raceId]?.skin ?? 'human', shadows);
    this.group.add(this.hero.root);
    for (const d of world.dummies) {
      const m = new DummyModel(shadows);
      m.root.position.set(d.x, world.terrain.groundY(d.x, d.z), d.z);
      this.group.add(m.root);
      this.dummies.push(m);
    }
    this.ring = new THREE.Mesh(ringGeo(0.62, 0.1), this.ringMat);
    this.ring.renderOrder = 2;
    this.group.add(this.ring);
    this.mark = new THREE.Mesh(ringGeo(0.32, 0.07), this.markMat);
    this.mark.renderOrder = 2;
    this.mark.visible = false;
    this.group.add(this.mark);
    this.yaw = Math.atan2(world.player.fx, world.player.fz);
  }

  update(dt: number) {
    const w = this.world;
    const p = w.player;
    const key = JSON.stringify(w.gear.equip);
    if (key !== this.equipKey) {
      this.equipKey = key;
      this.hero.setEquip(w.gear.equip);
    }
    // facing turns smoothly toward the player's direction
    const want = Math.atan2(p.fx, p.fz);
    let d = want - this.yaw;
    d = Math.atan2(Math.sin(d), Math.cos(d));
    this.yaw += d * (1 - Math.exp(-18 * dt));
    const h = this.hero;
    h.root.position.set(p.x, p.y + p.stepY, p.z);
    h.body.rotation.y = 0;
    h.root.rotation.y = this.yaw;
    const speed = Math.hypot(p.vx, p.vz);
    const a = p.attack;
    // the velocity in the body's own frame: the legs step along it while the body faces its way
    // (at the target in a fight), so the hero walks sideways or backwards when needed
    const c = Math.cos(this.yaw);
    const s = Math.sin(this.yaw);
    const move = { x: p.vx * c - p.vz * s, z: p.vx * s + p.vz * c };
    // the weapon is ready while fighting and put away a few seconds after
    const fighting = !!a || !!p.hold || w.autoAttack || !!p.inCombat;
    this.combatT = fighting ? 5 : Math.max(0, this.combatT - dt);
    h.pose({
      walk: p.anim,
      moving: Math.min(1, speed / Math.max(1, w.stats.moveSpeed)),
      airborne: p.airborne,
      vy: p.jumpV,
      attack: a ? { t: Math.min(1, a.t / a.dur), hitAt: a.hitAt, seq: a.seq, kind: (a as { kind?: 'normal' | 'skill' | 'spell' }).kind } : null,
      hold: p.hold,
      time: w.time,
      flip: p.airJumpT >= 0 ? p.airJumpT / JUMP.flipTime : 0,
      move,
      combat: this.combatT > 0,
    });
    // dummies wobble when hit
    w.dummies.forEach((dm, i) => this.dummies[i].wobble(dm.wobble, dm.wobX, dm.wobZ, w.time));
    // target marker: yellow when selected, red and faster while the auto attack is on
    const t = w.target;
    this.ring.visible = !!t;
    if (t) {
      const atk = w.autoAttack;
      this.ring.position.set(t.x, w.terrain.groundY(t.x, t.z) + 0.03, t.z);
      this.ringMat.color.setHex(atk ? 0xff3a30 : 0xffd040);
      this.ringMat.opacity = 0.7 + Math.sin(w.time * (atk ? 10 : 5)) * 0.25;
      this.ring.rotation.y = atk ? w.time * 1.5 : 0;
      this.ring.scale.setScalar(1 + Math.sin(w.time * (atk ? 10 : 5)) * 0.06);
    }
    // walk order marker: shrinks into the spot, fades out on arrival
    if (this.markLife > 0) {
      this.markLife = p.path.length ? Math.max(0.35, this.markLife - dt * 0.6) : this.markLife - dt * 3;
      const k = Math.max(0, this.markLife);
      this.mark.visible = k > 0;
      this.markMat.opacity = Math.min(1, k) * 0.9;
      this.mark.scale.setScalar(0.7 + k * 0.5);
    }
    this.syncProjectiles();
  }

  /** Shows the walk order marker at (x, z) on the ground. */
  markMove(x: number, z: number) {
    this.mark.position.set(x, this.world.terrain.groundY(x, z) + 0.04, z);
    this.markLife = 1;
    this.mark.visible = true;
  }

  private syncProjectiles() {
    const w = this.world;
    const live = new Set(w.projectiles);
    for (const [pr, obj] of this.proj)
      if (!live.has(pr)) {
        this.group.remove(obj);
        this.proj.delete(pr);
      }
    for (const pr of w.projectiles) {
      let obj = this.proj.get(pr);
      if (!obj) {
        obj =
          pr.kind === 'arrow' ? new THREE.Mesh(this.arrowGeo, itemMaterial()) : pr.kind === 'bolt' ? new THREE.Mesh(this.boltGeo, itemMaterial()) : new THREE.Mesh(pr.kind === 'orb' ? this.orbGeo : this.sparkGeo, pr.kind === 'orb' ? this.orbMat : this.sparkMat);
        this.group.add(obj);
        this.proj.set(pr, obj);
      }
      obj.position.set(pr.x, pr.y, pr.z);
      if (pr.kind === 'arrow' || pr.kind === 'bolt') obj.lookAt(pr.x + pr.dx, pr.y + pr.dy, pr.z + pr.dz);
      else obj.rotation.set(pr.age * 7, pr.age * 9, 0);
    }
  }

  dispose() {
    this.hero.dispose();
    this.dummies.forEach((d) => d.dispose());
    for (const g of [this.arrowGeo, this.boltGeo, this.sparkGeo, this.orbGeo]) g.dispose();
    this.sparkMat.dispose();
    this.orbMat.dispose();
    this.ring.geometry.dispose();
    this.ringMat.dispose();
    this.mark.geometry.dispose();
    this.markMat.dispose();
  }
}

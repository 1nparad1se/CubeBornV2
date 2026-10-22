import * as THREE from 'three';
import { ENEMY_BY_ID, SPELL_BY_ID } from './data';
import { enemyDef, type EnemyState } from './enemy';
import type { CombatSystem, ProjState, ZoneState } from './system';

/**
 * Drawing of stage 2 combat: voxel wolves (original pixel textures, cubic parts), their HP labels
 * and attack telegraphs, arrows and magic bolts, zones as rings of cubes, chain lightning and
 * the aim marker. Everything hangs under one group added with Renderer.addRunObject.
 */
const SCHOOL: Record<string, number> = { fire: 0xff7a2a, ice: 0x8fd0ff, lightning: 0xf4e468 };

/** An 8 × 8 pixel texture of a base colour with darker and lighter specks (original). */
function furTexture(base: number, seed: number): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = c.height = 8;
  const g = c.getContext('2d')!;
  const col = new THREE.Color(base);
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let y = 0; y < 8; y++)
    for (let x = 0; x < 8; x++) {
      const k = 0.82 + rnd() * 0.3 - (y > 5 ? 0.08 : 0);
      g.fillStyle = `rgb(${Math.min(255, col.r * 255 * k) | 0},${Math.min(255, col.g * 255 * k) | 0},${Math.min(255, col.b * 255 * k) | 0})`;
      g.fillRect(x, y, 1, 1);
    }
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.NearestFilter;
  t.minFilter = THREE.NearestFilter;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

interface WolfParts {
  root: THREE.Group;
  body: THREE.Group;
  legs: THREE.Mesh[];
  head: THREE.Group;
  tail: THREE.Mesh;
  label: THREE.Sprite;
  labelKey: string;
  canvas: HTMLCanvasElement;
  tex: THREE.CanvasTexture;
  tele: THREE.Group;
  deadT: number;
}

function wolfModel(color: number, scale: number, seed: number): Omit<WolfParts, 'label' | 'labelKey' | 'canvas' | 'tex' | 'tele' | 'deadT'> {
  const fur = new THREE.MeshLambertMaterial({ map: furTexture(color, seed) });
  const light = new THREE.MeshLambertMaterial({ map: furTexture(new THREE.Color(color).offsetHSL(0, 0, 0.18).getHex(), seed + 7) });
  const dark = new THREE.MeshLambertMaterial({ color: 0x1c1a18 });
  const eye = new THREE.MeshBasicMaterial({ color: 0xf0d040 });
  const box = (w: number, h: number, d: number, m: THREE.Material) => {
    const me = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    me.castShadow = true;
    return me;
  };
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);
  const torso = box(0.46, 0.42, 0.95, fur);
  torso.position.set(0, 0.62, 0);
  body.add(torso);
  const chest = box(0.5, 0.48, 0.34, light);
  chest.position.set(0, 0.64, 0.36);
  body.add(chest);
  const head = new THREE.Group();
  head.position.set(0, 0.82, 0.58);
  body.add(head);
  const skull = box(0.36, 0.34, 0.34, fur);
  head.add(skull);
  const snout = box(0.2, 0.16, 0.22, light);
  snout.position.set(0, -0.06, 0.26);
  head.add(snout);
  const nose = box(0.08, 0.06, 0.04, dark);
  nose.position.set(0, -0.01, 0.38);
  head.add(nose);
  for (const sx of [-1, 1]) {
    const ear = box(0.08, 0.14, 0.06, fur);
    ear.position.set(sx * 0.11, 0.23, -0.06);
    head.add(ear);
    const e = box(0.05, 0.05, 0.02, eye);
    e.position.set(sx * 0.1, 0.05, 0.175);
    head.add(e);
  }
  const legs: THREE.Mesh[] = [];
  for (const [lx, lz] of [[-0.15, 0.32], [0.15, 0.32], [-0.15, -0.34], [0.15, -0.34]]) {
    const g = new THREE.BoxGeometry(0.14, 0.44, 0.14);
    g.translate(0, -0.22, 0);
    const leg = new THREE.Mesh(g, fur);
    leg.castShadow = true;
    leg.position.set(lx, 0.44, lz);
    body.add(leg);
    legs.push(leg);
  }
  const tg = new THREE.BoxGeometry(0.1, 0.1, 0.42);
  tg.translate(0, 0, -0.21);
  const tail = new THREE.Mesh(tg, fur);
  tail.position.set(0, 0.74, -0.47);
  tail.rotation.x = 0.6;
  body.add(tail);
  root.scale.setScalar(scale);
  return { root, body, legs, head, tail };
}

/** A cubic humanoid (bandits): the same animated parts as the wolf (legs swing, «tail» = the sword). */
function humanModel(color: number, scale: number): Omit<WolfParts, 'label' | 'labelKey' | 'canvas' | 'tex' | 'tele' | 'deadT'> {
  const cloth = new THREE.MeshLambertMaterial({ color });
  const skin = new THREE.MeshLambertMaterial({ color: 0xc89070 });
  const pants = new THREE.MeshLambertMaterial({ color: 0x3a3228 });
  const steel = new THREE.MeshLambertMaterial({ color: 0xa8a8b0 });
  const box = (w: number, h: number, d: number, m: THREE.Material) => {
    const me = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    me.castShadow = true;
    return me;
  };
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);
  const torso = box(0.5, 0.7, 0.28, cloth);
  torso.position.set(0, 1.1, 0);
  body.add(torso);
  const head = new THREE.Group();
  head.position.set(0, 1.68, 0);
  body.add(head);
  head.add(box(0.42, 0.42, 0.42, skin));
  const mask = box(0.44, 0.14, 0.44, pants);
  mask.position.set(0, -0.08, 0.01);
  head.add(mask);
  const legs: THREE.Mesh[] = [];
  for (const [lx, ly, m] of [[-0.13, 0.75, pants], [0.13, 0.75, pants], [-0.36, 1.42, cloth], [0.36, 1.42, cloth]] as [number, number, THREE.Material][]) {
    const g = new THREE.BoxGeometry(0.2, ly > 1 ? 0.62 : 0.75, 0.22);
    g.translate(0, ly > 1 ? -0.31 : -0.375, 0);
    const leg = new THREE.Mesh(g, m);
    leg.castShadow = true;
    leg.position.set(lx, ly, 0);
    body.add(leg);
    legs.push(leg);
  }
  const tg = new THREE.BoxGeometry(0.06, 0.06, 0.8);
  tg.translate(0, 0, 0.4);
  const tail = new THREE.Mesh(tg, steel);
  tail.position.set(0.36, 0.85, 0.1);
  body.add(tail);
  root.scale.setScalar(scale);
  return { root, body, legs, head, tail };
}

/** A ring of small cubes (a round area drawn in the cubic style). */
function cubeRing(radius: number, color: number, opacity: number): THREE.Group {
  const g = new THREE.Group();
  const n = Math.max(10, Math.round(radius * 9));
  const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false });
  const geo = new THREE.BoxGeometry(0.18, 0.06, 0.18);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const m = new THREE.Mesh(geo, mat);
    m.position.set(Math.cos(a) * radius, 0.04, Math.sin(a) * radius);
    g.add(m);
  }
  // a faint checker fill of the area
  const fill = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: opacity * 0.25, depthWrite: false });
  const step = 0.5;
  const fg = new THREE.BoxGeometry(step * 0.92, 0.02, step * 0.92);
  for (let x = -radius; x <= radius; x += step)
    for (let z = -radius; z <= radius; z += step) {
      if (Math.hypot(x, z) > radius - 0.15 || ((Math.round(x / step) + Math.round(z / step)) & 1)) continue;
      const m = new THREE.Mesh(fg, fill);
      m.position.set(x, 0.02, z);
      g.add(m);
    }
  return g;
}

export class CombatView {
  readonly root = new THREE.Group();
  private wolves = new Map<string, WolfParts>();
  private projs = new Map<ProjState, THREE.Object3D>();
  private zones = new Map<ZoneState, THREE.Group>();
  private chain: THREE.Line | null = null;
  private aimRing = cubeRing(0.7, 0xffe060, 0.9);
  private arrowGeo = new THREE.BoxGeometry(0.05, 0.05, 0.7);
  private arrowMat = new THREE.MeshLambertMaterial({ color: 0x8a6a40 });
  private boltGeo = new THREE.BoxGeometry(0.22, 0.22, 0.22);
  private time = 0;

  constructor(private sys: CombatSystem) {
    this.root.name = 'rpg2-combat';
    this.root.add(this.aimRing);
    this.aimRing.visible = false;
  }

  private wolf(e: EnemyState): WolfParts {
    let w = this.wolves.get(e.uid);
    if (w) return w;
    const d = enemyDef(e);
    const m = d.model === 'human' ? humanModel(d.color, d.scale) : wolfModel(d.color, d.scale, e.uid.length * 97 + d.hp);
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
    label.scale.set(2.4, 0.6, 1);
    label.renderOrder = 10;
    const tele = cubeRing(d.special?.radius ?? 1, 0xff3020, 0.85);
    tele.visible = false;
    this.root.add(m.root, label, tele);
    w = { ...m, label, labelKey: '', canvas, tex, tele, deadT: 0 };
    this.wolves.set(e.uid, w);
    return w;
  }

  private drawLabel(w: WolfParts, e: EnemyState) {
    const d = ENEMY_BY_ID[e.def];
    const key = `${Math.ceil(e.hp)}|${e.mode}`;
    if (key === w.labelKey) return;
    w.labelKey = key;
    const g = w.canvas.getContext('2d')!;
    g.clearRect(0, 0, 256, 64);
    g.font = 'bold 20px sans-serif';
    g.textAlign = 'center';
    g.fillStyle = d.rank === 'mini' ? '#ffcf60' : '#ffffff';
    g.strokeStyle = 'rgba(0,0,0,0.8)';
    g.lineWidth = 4;
    const name = `${d.name} · ур. ${d.level}`;
    g.strokeText(name, 128, 24);
    g.fillText(name, 128, 24);
    g.fillStyle = 'rgba(0,0,0,0.7)';
    g.fillRect(28, 34, 200, 16);
    g.fillStyle = '#c83a2a';
    g.fillRect(30, 36, Math.round(196 * Math.max(0, e.hp / d.hp)), 12);
    g.font = 'bold 12px sans-serif';
    g.fillStyle = '#fff';
    g.fillText(`${Math.ceil(e.hp)} / ${d.hp}`, 128, 47);
    w.tex.needsUpdate = true;
  }

  update(dt: number, aimUid: string | null) {
    this.time += dt;
    const data = this.sys.data;
    // enemies
    for (const e of data.enemies) {
      const w = this.wolf(e);
      const d = enemyDef(e);
      const dead = e.mode === 'dead';
      w.deadT = dead ? w.deadT + dt : 0;
      w.root.visible = !dead || w.deadT < 3;
      w.label.visible = !dead;
      w.root.position.set(e.x, e.y, e.z);
      w.root.rotation.y = Math.atan2(e.fx, e.fz);
      w.root.rotation.z = dead ? Math.min(Math.PI / 2, w.deadT * 6) : 0;
      const swing = e.moving ? Math.sin(e.anim) * 0.6 : 0;
      w.legs[0].rotation.x = swing;
      w.legs[3].rotation.x = swing;
      w.legs[1].rotation.x = -swing;
      w.legs[2].rotation.x = -swing;
      w.tail.rotation.x = 0.6 + Math.sin(this.time * 3 + e.homeX) * 0.12;
      const wu = e.windup;
      let crouch = 0;
      let lunge = 0;
      let hop = 0;
      if (wu) {
        const k = wu.t / wu.dur;
        if (wu.kind === 'special') {
          crouch = Math.min(1, k * 1.6) * 0.18;
          hop = k > 0.75 ? Math.sin(((k - 0.75) / 0.25) * Math.PI) * 0.8 : 0;
        } else {
          crouch = k < 0.7 ? k * 0.15 : 0;
          lunge = k >= 0.7 ? ((k - 0.7) / 0.3) * 0.35 : 0;
        }
      }
      w.body.position.y = -crouch + hop;
      w.body.position.z = lunge;
      w.head.rotation.x = e.ctl.stunLeft > 0 ? 0.5 : -crouch;
      w.tele.visible = !!wu && wu.kind === 'special';
      if (wu && wu.kind === 'special') w.tele.position.set(wu.sx, this.sys.groundTop(wu.sx, wu.sz) + 0.02, wu.sz);
      w.label.position.set(e.x, e.y + 1.45 * d.scale + 0.35, e.z);
      this.drawLabel(w, e);
    }
    // projectiles
    const live = new Set(data.projectiles);
    for (const [p, o] of this.projs)
      if (!live.has(p)) {
        this.root.remove(o);
        this.projs.delete(p);
      }
    for (const p of data.projectiles) {
      let o = this.projs.get(p);
      if (!o) {
        if (p.kind === 'arrow') o = new THREE.Mesh(this.arrowGeo, this.arrowMat);
        else {
          const col = p.school ? SCHOOL[p.school] : 0xb070ff;
          o = new THREE.Mesh(this.boltGeo, new THREE.MeshBasicMaterial({ color: col }));
          if (p.explode) o.scale.setScalar(1.6);
        }
        this.root.add(o);
        this.projs.set(p, o);
      }
      o.position.set(p.x, p.y, p.z);
      o.lookAt(p.x + p.dx, p.y + p.dy, p.z + p.dz);
      if (p.kind !== 'arrow') o.rotateZ(this.time * 8);
    }
    // zones
    const lz = new Set(data.zones);
    for (const [z, g] of this.zones)
      if (!lz.has(z)) {
        this.root.remove(g);
        this.zones.delete(z);
      }
    for (const z of data.zones) {
      let g = this.zones.get(z);
      if (!g) {
        g = cubeRing(z.radius, SCHOOL[SPELL_BY_ID[z.ability].school], 0.75);
        this.root.add(g);
        this.zones.set(z, g);
      }
      g.position.set(z.x, z.y + 0.02, z.z);
      g.rotation.y = this.time * 0.4;
    }
    // chain lightning
    const ch = this.sys.lastChain;
    if (this.chain) {
      this.root.remove(this.chain);
      this.chain.geometry.dispose();
      this.chain = null;
    }
    if (ch) {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i < ch.pts.length - 1; i++) {
        const [ax, ay, az] = ch.pts[i];
        const [bx, by, bz] = ch.pts[i + 1];
        for (let k = 0; k <= 6; k++) {
          const t = k / 6;
          const j = k === 0 || k === 6 ? 0 : 0.25;
          pts.push(new THREE.Vector3(ax + (bx - ax) * t + (Math.random() - 0.5) * j, ay + (by - ay) * t + (Math.random() - 0.5) * j, az + (bz - az) * t + (Math.random() - 0.5) * j));
        }
      }
      this.chain = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: SCHOOL.lightning }));
      this.root.add(this.chain);
    }
    // aim marker under the soft-locked target
    const t = this.sys.target(aimUid);
    this.aimRing.visible = !!t;
    if (t) {
      this.aimRing.position.set(t.x, t.y + 0.03, t.z);
      this.aimRing.scale.setScalar((t.radius + 0.25) / 0.7);
      this.aimRing.rotation.y = this.time;
    }
  }
}

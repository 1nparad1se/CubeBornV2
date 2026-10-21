import { h } from './dom';
import type { World } from '../rpg/World';
import type { Terrain } from '../game/Terrain';
import { buildMapImage, drawDummies, drawHeroArrow, viewRot } from './mapImage';

/** World units from the hero to the edge of the minimap disc. */
const VIEW_RADIUS = 22;
/** Cardinal points: label and world direction (north is -z). */
const CARDINALS: [string, number, number][] = [
  ['С', 0, -1],
  ['В', 1, 0],
  ['Ю', 0, 1],
  ['З', -1, 0],
];

/**
 * Round compass minimap (top right): the land around the hero turned like the camera view, so
 * walking up the screen is walking up the map; the hero's arrow in the middle points where it
 * faces; dummies and the target are marked; a compass ring shows the cardinal points.
 */
export class Minimap {
  readonly root: HTMLElement;
  private canvas: HTMLCanvasElement;
  private g: CanvasRenderingContext2D;
  private img: HTMLCanvasElement | null = null;
  private imgFor: Terrain | null = null;
  private px = 0;
  /** Camera yaw (the view's rotation around the vertical axis). */
  yaw = Math.PI / 4;

  constructor(readonly size = 156) {
    this.canvas = h('canvas.mm-canvas') as HTMLCanvasElement;
    this.g = this.canvas.getContext('2d')!;
    this.root = h('div.rh-minimap', { title: 'Миникарта (M — карта мира)' }, this.canvas);
  }

  private fit() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const px = Math.round(this.size * dpr);
    if (px === this.px) return;
    this.px = px;
    this.canvas.width = this.canvas.height = px;
    this.canvas.style.width = this.canvas.style.height = `${this.size}px`;
  }

  draw(w: World) {
    this.fit();
    if (this.imgFor !== w.terrain) {
      this.img = buildMapImage(w.terrain, w.map, w.trees);
      this.imgFor = w.terrain;
    }
    const g = this.g;
    const S = this.px;
    const R = S / 2;
    const ring = S * 0.075;
    const inner = R - ring;
    const k = inner / VIEW_RADIUS;
    const p = w.player;
    const t = w.terrain;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, S, S);
    // the land, clipped to the disc
    g.save();
    g.beginPath();
    g.arc(R, R, inner, 0, Math.PI * 2);
    g.clip();
    g.fillStyle = '#4a4c52';
    g.fillRect(0, 0, S, S);
    g.translate(R, R);
    g.rotate(this.yaw);
    g.scale(k, k);
    g.translate(-p.x, -p.z);
    g.imageSmoothingEnabled = false;
    if (this.img) g.drawImage(this.img, t.ox, t.oz, t.size, t.size);
    g.setTransform(1, 0, 0, 1, 0, 0);
    const rot = viewRot(this.yaw);
    const to = (x: number, z: number): [number, number] => {
      const [a, b] = rot(x - p.x, z - p.z);
      return [R + a * k, R + b * k];
    };
    drawDummies(g, w, to, Math.max(2.5, S * 0.022));
    // the hero: an arrow turned to its facing
    const [fx, fy] = rot(p.fx, p.fz);
    drawHeroArrow(g, R, R, Math.atan2(fx, -fy), S * 0.06);
    // inner shade so the disc reads as sunk into the ring
    const sh = g.createRadialGradient(R, R, inner * 0.7, R, R, inner);
    sh.addColorStop(0, 'rgba(0,0,0,0)');
    sh.addColorStop(1, 'rgba(0,0,0,0.35)');
    g.fillStyle = sh;
    g.fillRect(0, 0, S, S);
    g.restore();
    // compass ring: dark bevelled band, ticks, the four cardinal letters (north in red)
    g.lineWidth = ring;
    g.strokeStyle = 'rgba(26, 22, 30, 0.9)';
    g.beginPath();
    g.arc(R, R, R - ring / 2, 0, Math.PI * 2);
    g.stroke();
    g.lineWidth = Math.max(1, S * 0.012);
    g.strokeStyle = 'rgba(255,255,255,0.18)';
    g.beginPath();
    g.arc(R, R, R - g.lineWidth / 2, Math.PI * 0.75, Math.PI * 1.75);
    g.stroke();
    g.strokeStyle = '#0c0a10';
    g.beginPath();
    g.arc(R, R, inner, 0, Math.PI * 2);
    g.stroke();
    for (let i = 0; i < 8; i++) {
      const [dx, dy] = rot(Math.sin((i * Math.PI) / 4), -Math.cos((i * Math.PI) / 4));
      const a = R - ring * 0.5;
      g.strokeStyle = i % 2 ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0)';
      g.beginPath();
      g.moveTo(R + dx * (a - ring * 0.18), R + dy * (a - ring * 0.18));
      g.lineTo(R + dx * (a + ring * 0.18), R + dy * (a + ring * 0.18));
      g.stroke();
    }
    g.font = `${Math.round(ring * 0.95)}px "Russo One", sans-serif`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    for (const [label, wx, wz] of CARDINALS) {
      const [dx, dy] = rot(wx, wz);
      const x = R + dx * (R - ring / 2);
      const y = R + dy * (R - ring / 2) + ring * 0.05;
      g.fillStyle = label === 'С' ? '#ff5a4a' : '#f4efe2';
      g.lineWidth = Math.max(2, ring * 0.22);
      g.strokeStyle = '#0c0a10';
      g.strokeText(label, x, y);
      g.fillText(label, x, y);
    }
  }
}

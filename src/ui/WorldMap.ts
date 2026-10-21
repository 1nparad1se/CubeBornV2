import { h } from './dom';
import type { World } from '../rpg/World';
import type { Terrain } from '../game/Terrain';
import { L } from '../i18n';
import { buildMapImage, drawDummies, drawHeroArrow, viewRot } from './mapImage';

/**
 * World map window (M): the whole territory turned like the camera view (so it matches the
 * screen and the minimap), with the hero's position and facing, the dummies (named) and the
 * target. Redrawn every frame while open, so the hero's arrow moves live. Closes on M or Esc.
 */
export class WorldMap {
  readonly root: HTMLElement;
  private canvas: HTMLCanvasElement;
  private g: CanvasRenderingContext2D;
  private title = h('h2');
  private coords = h('span.wm-coords');
  /** Legend entries of the map's own landscape (set on open). */
  private extra = h('span.wm-extra');
  private img: HTMLCanvasElement | null = null;
  private imgFor: Terrain | null = null;
  private px = 0;
  /** Camera yaw (the view's rotation around the vertical axis). */
  yaw = Math.PI / 4;
  onClose: (() => void) | null = null;

  constructor(parent: HTMLElement) {
    this.canvas = h('canvas.wm-canvas') as HTMLCanvasElement;
    this.g = this.canvas.getContext('2d')!;
    const key = (cls: string, label: string) => h('span.wm-key', h('i.' + cls), label);
    this.root = h(
      'div.wmap.hidden',
      { onclick: (e: MouseEvent) => e.target === this.root && this.onClose?.() },
      h(
        'div.inv-win.wm-win',
        h('div.inv-head', this.title, h('button.inv-x', { title: 'Закрыть (M / Esc)', onclick: () => this.onClose?.() }, '×')),
        this.canvas,
        h(
          'div.wm-legend',
          key('wk-hero', 'Вы'),
          key('wk-dummy', 'Манекен'),
          key('wk-target', 'Цель'),
          this.extra,
          this.coords,
        ),
      ),
    );
    parent.appendChild(this.root);
  }

  get isOpen(): boolean {
    return !this.root.classList.contains('hidden');
  }

  open(w: World) {
    this.title.textContent = `Карта: ${L(w.map.name)}`;
    const key = (cls: string, label: string) => h('span.wm-key', h('i.' + cls), label);
    this.extra.replaceChildren(
      ...(w.map.generator === 'wild'
        ? [key('wk-forest', 'Лес'), key('wk-water', 'Реки и озёра'), key('wk-swamp', 'Болота'), key('wk-snow', 'Снег'), key('wk-sand', 'Пустыня, пляж'), key('wk-rock', 'Горы, скалы')]
        : [key('wk-bush', 'Кусты'), key('wk-block', 'Возвышение'), key('wk-rock', 'Скалы (край)')]),
    );
    this.root.classList.remove('hidden');
    this.draw(w);
  }

  close() {
    this.root.classList.add('hidden');
  }

  /** Canvas side in CSS pixels: as large as the screen allows. */
  private fit(): number {
    const side = Math.max(240, Math.min(720, window.innerHeight - 170, window.innerWidth - 80));
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const px = Math.round(side * dpr);
    if (px !== this.px) {
      this.px = px;
      this.canvas.width = this.canvas.height = px;
      this.canvas.style.width = this.canvas.style.height = `${side}px`;
    }
    return px;
  }

  draw(w: World) {
    if (!this.isOpen) return;
    const S = this.fit();
    const t = w.terrain;
    if (this.imgFor !== t) {
      this.img = buildMapImage(t, w.map, w.trees);
      this.imgFor = t;
    }
    const g = this.g;
    const n = t.size;
    // the turned square fits the canvas with a small margin
    const span = n * (Math.abs(Math.cos(this.yaw)) + Math.abs(Math.sin(this.yaw)));
    const k = (S * 0.94) / span;
    const cx = t.ox + n / 2;
    const cz = t.oz + n / 2;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.fillStyle = '#2a2630';
    g.fillRect(0, 0, S, S);
    g.translate(S / 2, S / 2);
    g.rotate(this.yaw);
    g.scale(k, k);
    g.translate(-cx, -cz);
    // a big world is drawn much smaller than its picture: smooth it down
    g.imageSmoothingEnabled = n > 400;
    if (this.img) g.drawImage(this.img, t.ox, t.oz, n, n);
    // a faint grid every ten blocks
    g.strokeStyle = 'rgba(0,0,0,0.12)';
    g.lineWidth = 1 / k;
    g.beginPath();
    const step = n > 400 ? 100 : 10;
    for (let i = step; i < n; i += step) {
      g.moveTo(t.ox + i, t.oz);
      g.lineTo(t.ox + i, t.oz + n);
      g.moveTo(t.ox, t.oz + i);
      g.lineTo(t.ox + n, t.oz + i);
    }
    g.stroke();
    g.setTransform(1, 0, 0, 1, 0, 0);
    const rot = viewRot(this.yaw);
    const to = (x: number, z: number): [number, number] => {
      const [a, b] = rot(x - cx, z - cz);
      return [S / 2 + a * k, S / 2 + b * k];
    };
    drawDummies(g, w, to, Math.max(3, k * 0.45), true);
    const p = w.player;
    const [hx, hy] = to(p.x, p.z);
    const [fx, fy] = rot(p.fx, p.fz);
    // a soft pulse around the hero so it is found at a glance
    const pulse = 0.5 + 0.5 * Math.sin(w.time * 4);
    g.strokeStyle = `rgba(255,255,255,${0.25 + pulse * 0.35})`;
    g.lineWidth = Math.max(2, S * 0.004);
    g.beginPath();
    g.arc(hx, hy, S * (0.022 + pulse * 0.008), 0, Math.PI * 2);
    g.stroke();
    drawHeroArrow(g, hx, hy, Math.atan2(fx, -fy), Math.max(7, S * 0.016));
    this.compass(g, S);
    const cellX = Math.floor(p.x - t.ox);
    const cellZ = Math.floor(p.z - t.oz);
    const txt = `Вы: ${cellX}, ${cellZ}`;
    if (this.coords.textContent !== txt) this.coords.textContent = txt;
  }

  /** Compass rose in the corner: the north needle points where north is on the turned map. */
  private compass(g: CanvasRenderingContext2D, S: number) {
    const r = S * 0.05;
    const x = S - r * 1.6;
    const y = r * 1.6;
    const rot = viewRot(this.yaw);
    g.fillStyle = 'rgba(26,22,30,0.75)';
    g.beginPath();
    g.arc(x, y, r * 1.3, 0, Math.PI * 2);
    g.fill();
    const [nx, ny] = rot(0, -1);
    const a = Math.atan2(nx, -ny);
    g.save();
    g.translate(x, y);
    g.rotate(a);
    g.fillStyle = '#ff5a4a';
    g.beginPath();
    g.moveTo(0, -r * 0.62);
    g.lineTo(r * 0.26, 0);
    g.lineTo(-r * 0.26, 0);
    g.fill();
    g.fillStyle = '#f4efe2';
    g.beginPath();
    g.moveTo(0, r * 0.62);
    g.lineTo(r * 0.3, 0);
    g.lineTo(-r * 0.3, 0);
    g.fill();
    g.restore();
    g.font = `${Math.round(r * 0.6)}px "Russo One", sans-serif`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillStyle = '#ff5a4a';
    g.fillText('С', x + nx * r * 0.98, y + ny * r * 0.98);
  }
}

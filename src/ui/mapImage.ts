import { hash2 } from '../core/Rng';
import { CELL, isWater, type Terrain } from '../game/Terrain';
import type { MapDef } from '../data/types';
import { bushSpots } from '../render/flora';
import { SPRITE } from '../render/Textures';
import type { World } from '../rpg/World';
import type { TreeList } from '../world/trees';

/** Pixels per cell of the map picture: 4 on small maps, 1 on big worlds (it is scaled anyway). */
function mapPx(n: number) {
  return n > 400 ? 1 : 4;
}

/** Map colour of a ground tile: its palette colour, or a fixed one for roads, water and rock. */
function tileColor(name: string, map: MapDef): number {
  if (/path|trail|road|cobble/.test(name)) return 0xa8875a;
  if (/water_sea/.test(name)) return 0x2c66aa;
  if (/water_swamp/.test(name)) return 0x5a6a3c;
  if (/water/.test(name)) return 0x3f86cc;
  return map.palette.tiles[name]?.[0] ?? 0x6aa842;
}

/**
 * The whole map as a picture, north up: the ground by its block (meadows, snow, sand, rock,
 * water), shaded by the relief (lit from the north-west, darker rims under ledges and cliffs),
 * with the trees (or the bushes of the training meadow) as dark green dots. Built once per
 * terrain, pixel by pixel; the minimap and the world map draw it turned to the camera view.
 */
const cache = new WeakMap<Terrain, HTMLCanvasElement>();

export function buildMapImage(t: Terrain, map: MapDef, trees?: TreeList | null): HTMLCanvasElement {
  const hit = cache.get(t);
  if (hit) return hit;
  const n = t.size;
  const P = mapPx(n);
  const W = n * P;
  const c = document.createElement('canvas');
  c.width = c.height = W;
  const g = c.getContext('2d')!;
  const img = g.createImageData(W, W);
  const d = img.data;
  const tileRGB = t.tileNames.map((nm) => tileColor(nm, map));
  const h = (x: number, z: number) => t.centerY(Math.max(0, Math.min(n - 1, z)) * n + Math.max(0, Math.min(n - 1, x)));
  const put = (px: number, pz: number, rgb: number, k: number) => {
    const o = (pz * W + px) * 4;
    d[o] = Math.min(255, ((rgb >> 16) & 255) * k);
    d[o + 1] = Math.min(255, ((rgb >> 8) & 255) * k);
    d[o + 2] = Math.min(255, (rgb & 255) * k);
    d[o + 3] = 255;
  };
  for (let z = 0; z < n; z++)
    for (let x = 0; x < n; x++) {
      const i = z * n + x;
      const cell = t.cell[i];
      let rgb: number;
      let k: number;
      if (cell === CELL.wall) {
        rgb = 0x6e7078;
        k = 0.9 + hash2(x, z, 3) * 0.12;
      } else {
        rgb = tileRGB[t.tile[i]] ?? 0x6aa842;
        if (isWater(cell)) k = 0.95 + hash2(x, z, 4) * 0.04;
        else {
          // relief: lit from the north-west, slopes facing away darker, height a little lighter
          const e = h(x, z);
          const slope = h(x - 1, z - 1) - e;
          k = 0.9 + hash2(x, z, 5) * 0.05 + Math.max(-0.35, Math.min(0.2, -slope * 0.12)) + Math.min(e, 90) * (n > 400 ? 0.002 : 0.04);
          // ledges: a dark rim where the ground drops a whole block or more
          if (e - h(x + 1, z) >= 0.99 || e - h(x, z + 1) >= 0.99) k *= 0.72;
          else if (n <= 400 && (e - h(x + 1, z) >= 0.49 || e - h(x, z + 1) >= 0.49)) k *= 0.86;
        }
        if (cell === CELL.solid) {
          rgb = 0x2e5a24;
          k = 1;
        }
      }
      for (let dz = 0; dz < P; dz++) for (let dx = 0; dx < P; dx++) put(x * P + dx, z * P + dz, rgb, k);
    }
  // trees: a dark crown around each trunk
  if (trees)
    for (let i = 0; i < trees.count; i++) {
      const x = Math.floor(trees.x[i]);
      const z = Math.floor(trees.z[i]);
      const dead = trees.kind[i] === 4;
      for (const [dx, dz] of [[0, 0], [1, 0], [0, 1], [-1, 0], [0, -1]]) {
        const px = x + dx;
        const pz = z + dz;
        if (px < 0 || pz < 0 || px >= n || pz >= n) continue;
        put(px * P, pz * P, dead ? 0x6e6052 : trees.kind[i] === 1 || trees.kind[i] === 7 ? 0x24482a : 0x2f6a26, dx || dz ? 0.95 : 0.75);
      }
    }
  g.putImageData(img, 0, 0);
  // bushes of the training meadow: dark leafy dots (berry bushes with a red speck)
  if (map.generator === 'meadow')
    for (const b of bushSpots(t)) {
      const r = Math.max(1.5, b.s * P * 0.42);
      const cx = Math.round(b.x * P);
      const cz = Math.round(b.z * P);
      g.fillStyle = 'rgba(16,40,12,0.55)';
      g.fillRect(cx - r + 1, cz - r + 1, r * 2, r * 2);
      g.fillStyle = b.sprite === SPRITE.shrub ? '#3f6e2a' : '#356a26';
      g.fillRect(cx - r, cz - r, r * 2, r * 2);
      if (b.sprite === SPRITE.berryBush) {
        g.fillStyle = '#d8303a';
        g.fillRect(cx, cz - 1, 1, 1);
      }
    }
  cache.set(t, c);
  return c;
}

/** Arrow of the hero, pointing up (screen space) before rotation: a pixel-art chevron. */
export function drawHeroArrow(g: CanvasRenderingContext2D, x: number, y: number, angle: number, size: number) {
  g.save();
  g.translate(x, y);
  g.rotate(angle);
  g.beginPath();
  g.moveTo(0, -size);
  g.lineTo(size * 0.72, size * 0.75);
  g.lineTo(0, size * 0.35);
  g.lineTo(-size * 0.72, size * 0.75);
  g.closePath();
  g.fillStyle = '#ffffff';
  g.strokeStyle = '#141018';
  g.lineWidth = Math.max(1.5, size * 0.28);
  g.lineJoin = 'miter';
  g.stroke();
  g.fill();
  g.fillStyle = '#ffd040';
  g.beginPath();
  g.moveTo(0, -size * 0.55);
  g.lineTo(size * 0.32, size * 0.3);
  g.lineTo(0, size * 0.1);
  g.lineTo(-size * 0.32, size * 0.3);
  g.closePath();
  g.fill();
  g.restore();
}

/**
 * Screen-aligned map transform: world (x, z) → map pixels where screen-up is map-up, the same
 * rotation the camera has (its yaw). Returns [px, py] relative to the hero.
 */
export function viewRot(yaw: number) {
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  return (dx: number, dz: number): [number, number] => [c * dx - s * dz, s * dx + c * dz];
}

/** Dummies (and the selected target) as markers, positions through `to` (world → canvas). */
export function drawDummies(g: CanvasRenderingContext2D, w: World, to: (x: number, z: number) => [number, number], size: number, labels = false) {
  /** Label boxes placed so far: a name that would cover another goes under its marker. */
  const placed: [number, number, number, number][] = [];
  for (const d of w.dummies) {
    const [x, y] = to(d.x, d.z);
    const sel = w.target === d;
    g.fillStyle = '#141018';
    g.fillRect(x - size - 1, y - size - 1, size * 2 + 2, size * 2 + 2);
    g.fillStyle = sel ? '#ffd040' : '#e0503a';
    g.fillRect(x - size, y - size, size * 2, size * 2);
    if (sel) {
      g.strokeStyle = w.autoAttack ? '#ff5040' : '#ffd040';
      g.lineWidth = 2;
      g.strokeRect(x - size - 4, y - size - 4, size * 2 + 8, size * 2 + 8);
    }
    if (labels) {
      const fs = Math.round(size * 2.6);
      g.font = `600 ${fs}px "Russo One", sans-serif`;
      g.textAlign = 'center';
      const tw = g.measureText(d.name).width;
      const hit = (ly: number) => placed.some(([px, py, pw, ph]) => Math.abs(px - x) < (pw + tw) / 2 && Math.abs(py - ly) < (ph + fs) / 2);
      let ly = y - size - 5 - fs / 2;
      if (hit(ly)) ly = y + size + 5 + fs / 2;
      placed.push([x, ly, tw, fs]);
      g.textBaseline = 'middle';
      g.lineWidth = 3;
      g.strokeStyle = 'rgba(0,0,0,0.85)';
      g.strokeText(d.name, x, ly);
      g.fillStyle = sel ? '#ffd040' : '#ffffff';
      g.fillText(d.name, x, ly);
    }
  }
}

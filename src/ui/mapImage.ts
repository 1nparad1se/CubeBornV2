import { hash2 } from '../core/Rng';
import { CELL, type Terrain } from '../game/Terrain';
import type { MapDef } from '../data/types';
import { bushSpots } from '../render/flora';
import { SPRITE } from '../render/Textures';
import type { World } from '../rpg/World';

/** Pixels per cell of the map picture (the maps scale it; pixelated, like the world). */
export const MAP_PX = 4;

const hex = (c: number) => '#' + c.toString(16).padStart(6, '0');

/** Map colour of a ground tile: its palette colour, or a fixed one for roads, water and rock. */
function tileColor(name: string, map: MapDef): number {
  if (/path|trail|road|cobble/.test(name)) return 0xa8875a;
  if (/water/.test(name)) return 0x3f7fc8;
  return map.palette.tiles[name]?.[0] ?? 0x6aa842;
}

/**
 * The whole map as a picture, north up, one MAP_PX square per cell: the ground by tile (meadow
 * shades, roads, water), raised blocks lit with a shadowed edge, the border rock and the bushes.
 * Built once per terrain; the minimap and the world map draw it turned to the camera view.
 */
export function buildMapImage(t: Terrain, map: MapDef): HTMLCanvasElement {
  const n = t.size;
  const c = document.createElement('canvas');
  c.width = c.height = n * MAP_PX;
  const g = c.getContext('2d')!;
  const shade = (hexc: number, k: number) => {
    const r = Math.min(255, ((hexc >> 16) & 255) * k);
    const gg = Math.min(255, ((hexc >> 8) & 255) * k);
    const b = Math.min(255, (hexc & 255) * k);
    return `rgb(${r | 0},${gg | 0},${b | 0})`;
  };
  for (let z = 0; z < n; z++)
    for (let x = 0; x < n; x++) {
      const i = z * n + x;
      const cell = t.cell[i];
      let col: string;
      if (cell === CELL.wall) col = shade(0x6e7078, 0.9 + hash2(x, z, 3) * 0.12);
      else if (cell === CELL.liquid) col = hex(0x3f7fc8);
      // higher ground is drawn lighter (relief shading), lowlands darker
      else col = shade(tileColor(t.tileNames[t.tile[i]] ?? '', map), 0.8 + hash2(x, z, 5) * 0.06 + Math.min(t.centerY(i), 12) * 0.045);
      g.fillStyle = col;
      g.fillRect(x * MAP_PX, z * MAP_PX, MAP_PX, MAP_PX);
    }
  // ledges: a dark rim where a block drops to lower ground; a whole block or more (a step that
  // needs a jump, a cliff) is drawn darker than the half and quarter steps of the hills
  const h = (x: number, z: number) => t.centerY(z * n + x);
  for (let z = 0; z < n; z++)
    for (let x = 0; x < n; x++) {
      const e = h(x, z);
      const rim = (d: number) => (d >= 0.99 ? 'rgba(20,24,10,0.6)' : d >= 0.49 ? 'rgba(20,30,10,0.3)' : null);
      const sides: [number, number, number, number, number, number][] = [
        [x, z + 1, x * MAP_PX, (z + 1) * MAP_PX - 1, MAP_PX, 1],
        [x + 1, z, (x + 1) * MAP_PX - 1, z * MAP_PX, 1, MAP_PX],
        [x, z - 1, x * MAP_PX, z * MAP_PX, MAP_PX, 1],
        [x - 1, z, x * MAP_PX, z * MAP_PX, 1, MAP_PX],
      ];
      for (const [nx, nz, rx, ry, rw, rh] of sides) {
        if (nx < 0 || nz < 0 || nx >= n || nz >= n) continue;
        const c = rim(e - h(nx, nz));
        if (!c) continue;
        g.fillStyle = c;
        g.fillRect(rx, ry, rw, rh);
      }
    }
  // the edge of the border rock
  g.fillStyle = 'rgba(0,0,0,0.35)';
  for (let z = 1; z < n - 1; z++)
    for (let x = 1; x < n - 1; x++) {
      if (t.cell[z * n + x] === CELL.wall) continue;
      if (t.cell[z * n + x - 1] === CELL.wall) g.fillRect(x * MAP_PX, z * MAP_PX, 1, MAP_PX);
      if (t.cell[z * n + x + 1] === CELL.wall) g.fillRect((x + 1) * MAP_PX - 1, z * MAP_PX, 1, MAP_PX);
      if (t.cell[(z - 1) * n + x] === CELL.wall) g.fillRect(x * MAP_PX, z * MAP_PX, MAP_PX, 1);
      if (t.cell[(z + 1) * n + x] === CELL.wall) g.fillRect(x * MAP_PX, (z + 1) * MAP_PX - 1, MAP_PX, 1);
    }
  // bushes: dark leafy dots (berry bushes with a red speck)
  if (map.generator === 'meadow')
    for (const b of bushSpots(t)) {
      const r = Math.max(1.5, b.s * MAP_PX * 0.42);
      const cx = Math.round(b.x * MAP_PX);
      const cz = Math.round(b.z * MAP_PX);
      g.fillStyle = 'rgba(16,40,12,0.55)';
      g.fillRect(cx - r + 1, cz - r + 1, r * 2, r * 2);
      g.fillStyle = b.sprite === SPRITE.shrub ? '#3f6e2a' : '#356a26';
      g.fillRect(cx - r, cz - r, r * 2, r * 2);
      if (b.sprite === SPRITE.berryBush) {
        g.fillStyle = '#d8303a';
        g.fillRect(cx, cz - 1, 1, 1);
      }
    }
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

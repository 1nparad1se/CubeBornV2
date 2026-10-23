/**
 * Pixel sprites of the starter weapons (our own pixel art, generated from simple rules so every
 * item reads as a flat Minecraft-style item: a diagonal blade, a shaft, a crystal). A sprite is a
 * square grid of colours ('' = empty); it becomes the inventory icon (drawn to a canvas) and the
 * 3D item (each pixel extruded into a one-pixel-thick block, see itemMeshes.ts).
 */
export type Sprite = { n: number; px: string[] };

function make(n: number, fn: (x: number, y: number, u: number, v: number) => string): Sprite {
  const px: string[] = [];
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      // diagonal coordinates: u along the bottom-left → top-right diagonal (0 .. n-1), v across it
      const u = (x + (n - 1 - y)) / 2;
      const v = x - (n - 1 - y);
      px.push(fn(x, y, u, v));
    }
  return { n, px };
}

/** Outline: an empty pixel next to a filled one becomes dark. */
function outline(s: Sprite, color: string): Sprite {
  const { n, px } = s;
  const out = [...px];
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      if (px[y * n + x]) continue;
      const nb = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ].some(([dx, dy]) => {
        const a = x + dx;
        const b = y + dy;
        return a >= 0 && b >= 0 && a < n && b < n && px[b * n + a] && px[b * n + a] !== color;
      });
      if (nb) out[y * n + x] = color;
    }
  return { n, px: out };
}

const IRON = { hi: '#eef0f4', mid: '#c4c8d0', lo: '#8a8e98', dark: '#4a4c56' };
const WOOD = { hi: '#a8763e', mid: '#835a2c', lo: '#5e3e1c' };
const GOLD = { hi: '#ffe27a', mid: '#e0b034', lo: '#a07818' };
const K = '#2a2026';

function blade(v: number): string {
  return v < 0 ? IRON.hi : v === 0 ? IRON.mid : IRON.lo;
}

/** Iron one-handed sword: short blade, small brass guard, leather grip. */
export const SPR_SWORD = outline(
  make(16, (_x, _y, u, v) => {
    const a = Math.abs(v);
    if (u >= 14.5) return a <= 0 ? IRON.hi : '';
    if (u >= 5.5 && a <= 1) return blade(v);
    if (u >= 4 && u < 5.5 && a <= 3) return a === 3 ? GOLD.lo : GOLD.mid;
    if (u >= 1.5 && u < 4 && a <= 0) return u < 2.5 ? WOOD.lo : WOOD.mid;
    if (u >= 1.5 && u < 4 && a === 1) return WOOD.lo;
    if (u >= 0.5 && u < 1.5 && a <= 1) return GOLD.mid;
    return '';
  }),
  K,
);

/** Small spark staff: short wand with an orange crystal in a brass claw. */
export const SPR_STAFF1H = outline(
  make(16, (_x, _y, u, v) => {
    const a = Math.abs(v);
    if (u >= 12 && u <= 14.5 && a <= 1) return v < 0 || u > 14 ? '#ffe090' : '#ff9a30';
    if (u >= 11 && u < 12 && a <= 2) return a === 2 ? GOLD.lo : GOLD.mid;
    if (u >= 1 && u < 11 && a <= 0) return Math.floor(u) % 4 === 0 ? WOOD.lo : WOOD.hi;
    if (u >= 1 && u < 11 && a === 1 && v > 0) return WOOD.lo;
    return '';
  }),
  K,
);

/**
 * Hunting bow, vertical (grip in the middle), limbs bowing to the left (forward). With `string`
 * the straight string is baked in (inventory icon); the held model draws its string as geometry.
 */
function bowSprite(string: boolean): Sprite {
  const n = 20;
  const px: string[] = new Array(n * n).fill('');
  const set = (x: number, y: number, c: string) => {
    if (x >= 0 && y >= 0 && x < n && y < n) px[y * n + x] = c;
  };
  const mid = (n - 1) / 2;
  for (let y = 1; y < n - 1; y++) {
    const d = (y - mid) / (mid - 0.5);
    // limb: an arc bowing to the left
    const lx = Math.round(5 + d * d * 5);
    set(lx, y, Math.abs(d) < 0.18 ? '#3a2a20' : WOOD.mid);
    set(lx + 1, y, Math.abs(d) < 0.18 ? '#5a4030' : WOOD.lo);
    if (string) set(11, y, '#f0ece0');
  }
  return outline({ n, px }, K);
}

export const SPR_BOW = bowSprite(true);
export const SPR_BOW_LIMBS = bowSprite(false);

/** Shield face (front texture, 10 × 12): oak planks with an iron rim and boss. */
export function shieldFace(x: number, y: number, w: number, h: number): string {
  const rim = x === 0 || y === 0 || x === w - 1 || y === h - 1;
  if (rim) return (x + y) % 3 === 0 ? IRON.hi : IRON.lo;
  const cx = (w - 1) / 2;
  const cy = (h - 1) / 2;
  if (Math.abs(x - cx) <= 1 && Math.abs(y - cy) <= 1) return Math.abs(x - cx) < 1 && Math.abs(y - cy) < 1 ? IRON.hi : IRON.mid;
  if (y === 3 || y === h - 4) return IRON.dark;
  const plank = Math.floor((x - 1) / 3);
  return x % 3 === 0 ? WOOD.lo : plank % 2 ? WOOD.mid : WOOD.hi;
}

// ---------------------------------------------------------------- armor icons

type ArmorPalette = { a: string; b: string; c: string; d: string };
export const ARMOR_PAL: Record<string, ArmorPalette> = {
  // a main, b light, c dark, d trim
  apprentice: { a: '#3c4ea6', b: '#5a70cc', c: '#26306c', d: '#e0b440' },
  scout: { a: '#8a5a32', b: '#a8743e', c: '#5a3a1e', d: '#4e6e30' },
  guard: { a: '#b8bcc6', b: '#e4e6ec', c: '#62666e', d: '#8a6a3a' },
};

/** Inventory icon of an armor piece: a 16-px silhouette per slot in the set's colours. */
export function armorIcon(slot: 'head' | 'hands' | 'feet' | 'body', set: string): Sprite {
  const P = ARMOR_PAL[set] ?? ARMOR_PAL.guard;
  const masks: Record<string, string[]> = {
    head: [
      '................',
      '................',
      '.....bbbbbb.....',
      '....baaaaaab....',
      '...baaaaaaaab...',
      '...aaddddddaa...',
      '...aa......aa...',
      '...aa......aa...',
      '...aa......aa...',
      '...ac......ca...',
      '...cc......cc...',
      '................',
      '................',
      '................',
      '................',
      '................',
    ],
    body: [
      '................',
      '..bbbb....bbbb..',
      '.baaaabbbbaaaab.',
      '.aaaaaadaaaaaaa.',
      '.aaa.aadaaa.aaa.',
      '.cc..aadaaa..cc.',
      '.....aadaaa.....',
      '.....aadaaa.....',
      '.....dddddd.....',
      '.....aaaaaa.....',
      '.....aaaaaa.....',
      '.....cccccc.....',
      '................',
      '................',
      '................',
      '................',
    ],
    hands: [
      '................',
      '................',
      '................',
      '..bbb.....bbb...',
      '..aaa.....aaa...',
      '..aaa.....aaa...',
      '..ddd.....ddd...',
      '.baaab...baaab..',
      '.aaaaa...aaaaa..',
      '.aaaac...caaaa..',
      '.aacc.....ccaa..',
      '................',
      '................',
      '................',
      '................',
      '................',
    ],
    feet: [
      '................',
      '................',
      '................',
      '..bbb.....bbb...',
      '..aaa.....aaa...',
      '..aaa.....aaa...',
      '..ddd.....ddd...',
      '..aaa.....aaa...',
      '..aaa.....aaa...',
      '..aaabb...aaabb.',
      '..aaaaa...aaaaa.',
      '..ccccc...ccccc.',
      '................',
      '................',
      '................',
      '................',
    ],
  };
  const rows = masks[slot];
  const px: string[] = [];
  for (const r of rows) for (const ch of r) px.push(ch === '.' ? '' : P[ch as keyof ArmorPalette]);
  return outline({ n: 16, px }, K);
}

/** Draws a sprite to a canvas (inventory icon), `scale` screen pixels per sprite pixel. */
export function spriteCanvas(s: Sprite, scale = 3): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = c.height = s.n * scale;
  const g = c.getContext('2d')!;
  for (let y = 0; y < s.n; y++)
    for (let x = 0; x < s.n; x++) {
      const col = s.px[y * s.n + x];
      if (!col) continue;
      g.fillStyle = col;
      g.fillRect(x * scale, y * scale, scale, scale);
    }
  return c;
}

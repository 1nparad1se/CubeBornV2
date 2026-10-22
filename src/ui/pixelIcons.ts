/**
 * Original pixel-art icons for the HUD and the windows, drawn in code on a 16×16 grid (cubic,
 * Minecraft-like item style: flat colours, one light and one dark shade, a dark outline). Nothing
 * is loaded from files. Each icon is rendered once to a data URL and cached; show it with
 * `pxIcon(name)` (an <i> with `image-rendering: pixelated`) or `pxIconUrl(name)`.
 *
 * Names: weapons and armor (sword, bow, staff, shield, helm, chest, legs, knife, pickaxe, axe),
 * resources (hp, mp, st, xp, lp, ot, gold, coins), potions (potion-hp, potion-mp, potion-st…),
 * materials (the keys of the craft catalogue: ore, wood, coal, iron, steel…), the 12 weapon skills
 * (s1–s6, b1–b6), the 15 spells (f1–f5, i1–i5, l1–l5), quest marks and interface signs.
 */

type Col = string | null;
const N = 16;

class Grid {
  g: Col[] = new Array(N * N).fill(null);
  set(x: number, y: number, c: Col) {
    x = Math.round(x);
    y = Math.round(y);
    if (x >= 0 && y >= 0 && x < N && y < N) this.g[y * N + x] = c;
  }
  get(x: number, y: number): Col {
    return x >= 0 && y >= 0 && x < N && y < N ? this.g[y * N + x] : null;
  }
  rect(x: number, y: number, w: number, h: number, c: Col) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c);
  }
  line(x0: number, y0: number, x1: number, y1: number, c: Col) {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
    for (let i = 0; i <= n; i++) this.set(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, c);
  }
  disc(cx: number, cy: number, r: number, c: Col) {
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) this.set(x, y, c);
  }
  /** Rows of characters; '.' or ' ' is empty, other characters map through the palette. */
  rows(x0: number, y0: number, rows: string[], pal: Record<string, string>) {
    rows.forEach((r, y) => [...r].forEach((ch, x) => ch !== '.' && ch !== ' ' && pal[ch] && this.set(x0 + x, y0 + y, pal[ch])));
  }
}

const OUT = '#120d0a';
const C = {
  steel: '#e4e8ec',
  steelMd: '#aab3bc',
  steelDk: '#6c7681',
  wood: '#9a6534',
  woodLt: '#c48a4c',
  woodDk: '#5e3a1c',
  gold: '#f6c445',
  goldLt: '#ffe58a',
  goldDk: '#b07a17',
  red: '#e0392b',
  redLt: '#ff7a5c',
  redDk: '#8e1a14',
  blue: '#3f86f0',
  blueLt: '#9cd2ff',
  blueDk: '#1f3f9a',
  green: '#4cc94a',
  greenLt: '#a6f07a',
  greenDk: '#22762a',
  purple: '#a259f0',
  purpleLt: '#dcb0ff',
  purpleDk: '#5a2a9e',
  orange: '#ff9a2a',
  yellow: '#ffe24a',
  white: '#fff8e6',
  glass: '#cfe6ee',
  skin: '#e9b48f',
  skinDk: '#c28462',
};

// ------------------------------------------------------------------ building blocks
function sword(p: Grid, o: { blade?: string; mid?: string; dk?: string; hilt?: string; guard?: string; big?: boolean } = {}) {
  const b = o.blade ?? C.steel, m = o.mid ?? C.steelMd, d = o.dk ?? C.steelDk;
  const len = o.big ? 9 : 8;
  for (let i = 0; i < len; i++) {
    p.set(6 + i, 9 - i, b);
    p.set(7 + i, 9 - i, m);
    p.set(6 + i, 8 - i, i === len - 1 ? null : b);
    p.set(7 + i, 10 - i, d);
  }
  p.set(6 + len, 9 - len, b);
  const gd = o.guard ?? '#8a8f96';
  p.line(3, 8, 7, 12, gd);
  p.set(4, 8, '#c3c8ce');
  p.line(4, 11, 2, 13, o.hilt ?? C.wood);
  p.set(3, 11, C.woodDk);
  p.set(1, 14, gd);
}

function bow(p: Grid, wood = C.wood, lt = C.woodLt) {
  for (let a = 0; a <= 90; a += 2) {
    const r = (a * Math.PI) / 180;
    p.set(2 + 11 * Math.sin(r), 13 - 11 * Math.cos(r), wood);
    p.set(2 + 10 * Math.sin(r), 13 - 10 * Math.cos(r), a > 20 && a < 70 ? lt : wood);
  }
  p.line(2, 2, 13, 13, '#e8e2d0');
  p.set(9, 5, C.woodDk);
  p.set(10, 6, C.woodDk);
}

function staff(p: Grid, gem = C.blue, gemLt = C.blueLt) {
  p.line(1, 14, 10, 5, C.wood);
  p.line(2, 14, 11, 5, C.woodDk);
  p.line(1, 13, 10, 4, C.woodLt);
  p.rows(9, 1, ['.ab.', 'abbc', 'bbcc', '.cc.'], { a: gemLt, b: gem, c: C.blueDk });
  p.set(9, 4, C.goldDk);
  p.set(12, 5, C.goldDk);
}

function arrow(p: Grid, x0: number, y0: number, x1: number, y1: number, head = C.steel) {
  p.line(x0, y0, x1, y1, C.woodLt);
  p.set(x0, y0, '#f2f2f2');
  p.set(x0 + 1, y0, '#f2f2f2');
  p.set(x0, y0 - 1, '#f2f2f2');
  p.set(x1, y1, head);
  p.set(x1 - 1, y1, head);
  p.set(x1, y1 + 1, head);
  p.set(x1 + 1, y1 - 1, '#ffffff');
}

/** Orange and yellow star burst. */
function burst(p: Grid, cx: number, cy: number, r: number, inner = C.yellow, outer = C.orange) {
  for (let a = 0; a < 8; a++) {
    const ang = (a * Math.PI) / 4;
    const rr = a % 2 ? r * 0.6 : r;
    p.line(cx, cy, cx + Math.cos(ang) * rr, cy + Math.sin(ang) * rr, outer);
  }
  p.disc(cx, cy, Math.max(1, r * 0.35), inner);
  p.set(cx, cy, C.white);
}

function crescent(p: Grid, cx: number, cy: number, r: number, c = C.orange, lt = C.yellow) {
  for (let a = -70; a <= 110; a += 4) {
    const t = (a * Math.PI) / 180;
    p.set(cx + Math.cos(t) * r, cy + Math.sin(t) * r, c);
    p.set(cx + Math.cos(t) * (r - 1), cy + Math.sin(t) * (r - 1), lt);
  }
}

function potion(p: Grid, liquid: string, lt: string, dk: string, size = 1) {
  p.rect(7, 1, 2, 1, C.woodLt);
  p.rect(7, 2, 2, 2, C.glass);
  const w = size === 3 ? 10 : size === 2 ? 9 : 8;
  const x0 = 8 - w / 2;
  const y0 = size === 3 ? 4 : 5;
  for (let y = y0; y < 15; y++) {
    const edge = y === y0 || y === 14 ? 1 : 0;
    p.rect(x0 + edge, y, w - 2 * edge, 1, y < y0 + 2 ? C.glass : liquid);
  }
  p.rect(x0 + 1, 14, w - 2, 1, dk);
  p.set(x0 + 1, y0 + 3, lt);
  p.set(x0 + 1, y0 + 4, lt);
  p.set(x0 + 2, y0 + 3, C.white);
}

function ingot(p: Grid, c: string, lt: string, dk: string) {
  p.rows(1, 5, ['....aaaaaaaa..', '...abbbbbbbba.', '..abbbbbbbbac.', '.aaaaaaaaaacc.', '.bbbbbbbbbbcc.', '.bbbbbbbbbbc..', '.dddddddddd...'], { a: lt, b: c, c: dk, d: dk });
}

function block(p: Grid, top: string, side: string, dk: string, speck?: string, speck2?: string) {
  p.rows(2, 2, ['....aaaa....', '..aaaaaaaa..', 'aaaaaaaaaaaa', 'bbaaaaaaaacc', 'bbbbaaaacccc', 'bbbbbbcccccc', 'bbbbbbcccccc', 'bbbbbbcccccc', 'bbbbbbcccccc', 'bbbbbbcccccc', '..bbbbcccc..', '....bbcc....'], { a: top, b: side, c: dk });
  if (speck) for (const [x, y] of [[4, 6], [8, 4], [10, 7], [5, 9], [9, 10], [11, 11], [6, 12]]) p.set(x, y, y % 2 ? speck : (speck2 ?? speck));
}

function gem(p: Grid, c: string, lt: string, dk: string) {
  p.rows(3, 1, ['...ab.....', '..aabb....', '.aaabbb...', '.aabbbcc..', 'aabbbbccc.', 'abbbbbcccc', '.bbbbcccc.', '..bbcccc..', '...bccc...', '....cc....'], { a: lt, b: c, c: dk });
  p.rows(9, 6, ['.ab.', 'abcc', '.cc.'], { a: lt, b: c, c: dk });
}

function flower(p: Grid, petal: string, lt: string, center = C.yellow) {
  p.line(8, 14, 8, 7, C.greenDk);
  p.line(7, 14, 7, 9, C.green);
  p.rows(3, 8, ['aa......', 'bab.....', '.bb.....'], { a: C.greenLt, b: C.green });
  p.rows(9, 9, ['....aa', '...bab', '...bb.'], { a: C.greenLt, b: C.green });
  for (const [cx, cy] of [[5, 4], [10, 3], [8, 7]]) {
    p.rows(cx - 2, cy - 2, ['.aa.', 'abba', 'abba', '.bb.'], { a: lt, b: petal });
    p.set(cx - 1 + 1, cy, center);
  }
}

function face(p: Grid, o: { hair: string; hairDk?: string; skin?: string; eye?: string; beard?: string; long?: boolean; band?: string }) {
  const s = o.skin ?? C.skin, sd = C.skinDk, hr = o.hair, hd = o.hairDk ?? hr;
  p.rect(2, 2, 12, 12, s);
  p.rect(2, 1, 12, 4, hr);
  p.rect(2, 5, 2, 3, hr);
  p.rect(12, 5, 2, 3, hr);
  p.set(5, 5, hr);
  p.set(9, 5, hr);
  p.rect(2, 1, 12, 1, hd);
  if (o.long) {
    p.rect(1, 3, 2, 11, hr);
    p.rect(13, 3, 2, 11, hr);
  }
  if (o.band) p.rect(2, 4, 12, 1, o.band);
  p.rect(4, 8, 2, 2, C.white);
  p.rect(10, 8, 2, 2, C.white);
  p.set(5, 8, o.eye ?? '#3a2a6a');
  p.set(5, 9, o.eye ?? '#3a2a6a');
  p.set(10, 8, o.eye ?? '#3a2a6a');
  p.set(10, 9, o.eye ?? '#3a2a6a');
  p.rect(7, 10, 2, 1, sd);
  p.rect(6, 12, 4, 1, '#9a4a3a');
  p.rect(2, 13, 12, 1, sd);
  if (o.beard) {
    p.rect(3, 11, 10, 3, o.beard);
    p.rect(5, 14, 6, 1, o.beard);
    p.rect(6, 12, 4, 1, '#6a3a2a');
  }
}

// ------------------------------------------------------------------ icon definitions
type Draw = (p: Grid) => void;
const D: Record<string, Draw> = {};
const def = (names: string | string[], f: Draw) => (Array.isArray(names) ? names : [names]).forEach((n) => (D[n] = f));

// weapons and gear
def(['sword', 'weapon'], (p) => sword(p));
def('sword-steel', (p) => sword(p, { blade: '#eef4ff', mid: '#9fb4d0', dk: '#5f7290', guard: '#c79a3a' }));
def('greatsword', (p) => sword(p, { big: true, guard: '#c79a3a' }));
def('bow', (p) => bow(p));
def('staff', (p) => staff(p));
def('knife', (p) => {
  p.line(7, 8, 12, 3, C.steel);
  p.line(8, 8, 13, 3, C.steelMd);
  p.line(5, 10, 3, 12, C.wood);
  p.line(6, 8, 8, 10, '#8a8f96');
});
def('pickaxe', (p) => {
  p.line(3, 13, 11, 5, C.wood);
  p.line(4, 13, 12, 5, C.woodDk);
  p.rows(4, 1, ['..aaaaaa..', '.abbbbbba.', 'ab......ba', 'b........b'], { a: C.steel, b: C.steelMd });
});
def('axe', (p) => {
  p.line(3, 13, 11, 5, C.wood);
  p.line(4, 13, 12, 5, C.woodDk);
  p.rows(8, 1, ['.aa...', 'abbb..', 'abbbb.', 'abbbbc', '.bbbc.', '..cc..'], { a: C.steel, b: C.steelMd, c: C.steelDk });
});
def('shield', (p) =>
  p.rows(2, 1, ['aaaaaaaaaaaa', 'abbbbbcbbbba', 'abbbbbcbbbba', 'abbbbbcbbbba', 'acccccccccca', 'abbbbbcbbbba', 'abbbbbcbbbba', '.abbbbcbbba.', '.abbbbcbbba.', '..abbbcbba..', '...abbcba...', '....abba....', '.....aa.....'], { a: '#8a8f96', b: C.blue, c: C.goldLt }),
);
def(['helm', 'head'], (p) =>
  p.rows(2, 2, ['...aaaaaa...', '..abbbbbba..', '.abbbbbbbbc.', '.abbbbbbbbc.', 'abbbbbbbbbbc', 'abbccccccbbc', 'abc......cbc', 'abc......cbc', 'abc......cbc', '.bc......cb.'], { a: C.steel, b: C.steelMd, c: C.steelDk }),
);
def(['chest', 'armor'], (p) =>
  p.rows(1, 2, ['..aaa....aaa..', '.abbba..abbbc.', 'abbbbbaabbbbbc', 'abbbbbbbbbbbbc', '.cbbbbbbbbbbc.', '..abbbbbbbbc..', '..abbbdbbbbc..', '..abbbbbbbbc..', '..abbbbbbbbc..', '..abbbbbbbbc..', '..cccccccccc..'], { a: C.woodLt, b: C.wood, c: C.woodDk, d: C.goldLt }),
);
def('legs', (p) =>
  p.rows(3, 2, ['aaaaaaaaaa', 'bbbbdbbbbc', 'abbbbbbbbc', 'abbbccbbbc', 'abbc..abbc', 'abbc..abbc', 'abbc..abbc', 'abbc..abbc', 'abbc..abbc', 'abbc..abbc', 'cccc..cccc'], { a: C.woodLt, b: C.wood, c: C.woodDk, d: C.goldDk }),
);
def('ring', (p) => {
  p.disc(8, 9, 5, C.gold);
  p.disc(8, 9, 3, null);
  p.rows(6, 1, ['.ab.', 'abbc', '.cc.'], { a: C.purpleLt, b: C.purple, c: C.purpleDk });
});
def('rune', (p) => {
  p.rows(3, 1, ['..aaaaaa..', '.abbbbbbc.', 'abbbdbbbbc', 'abbdddbbbc', 'abbbdbbbbc', 'abbbdbbbbc', 'abbdbdbbbc', 'abdbbbdbbc', 'abbbbbbbbc', 'abbbbbbbbc', '.abbbbbbc.', '.cccccccc.'], { a: '#c9c3b5', b: '#8f897c', c: '#56514a', d: C.blueLt });
});

// resources
def(['hp', 'heart', 'vit'], (p) =>
  p.rows(1, 2, ['.aaa....aaa..', 'abbba..abbba.', 'abwbbaabbbbbc', 'abbbbbbbbbbbc', 'abbbbbbbbbbbc', '.abbbbbbbbbc.', '..abbbbbbbc..', '...abbbbbc...', '....abbbc....', '.....abc.....', '......c......'], { a: C.redLt, b: C.red, c: C.redDk, w: C.white }),
);
def(['mp', 'mana', 'spi'], (p) =>
  p.rows(3, 1, ['....aa....', '....ab....', '...abbc...', '...abbc...', '..abbbbc..', '..abbbbc..', '.awbbbbbc.', '.awbbbbbc.', 'abbbbbbbbc', 'abbbbbbbbc', 'abbbbbbbbc', '.abbbbbbc.', '..cccccc..'], { a: C.blueLt, b: C.blue, c: C.blueDk, w: C.white }),
);
def(['st', 'stamina', 'bolt'], (p) =>
  p.rows(3, 0, ['......aab.', '.....aab..', '....aabb..', '...aabb...', '..aabb....', '.aabbbbbb.', 'aabbbbbbc.', '....abbc..', '...abbc...', '...abc....', '..abc.....', '..bc......', '.bc.......', '.c........', 'c.........'], { a: C.goldLt, b: C.gold, c: C.goldDk }),
);
def('xp', (p) => {
  p.rows(1, 1, ['......a.......', '.....aba......', '.....aba......', 'aaaaabbbaaaaa.', '.abbbbwbbbbba.', '..abbbbbbbba..', '...abbbbbba...', '...abbbbbba...', '..abbba.abba..', '..aba....aba..', '.aa.......aa..'], { a: C.purpleLt, b: C.purple, w: C.white });
});
def('lp', (p) => gem(p, C.green, C.greenLt, C.greenDk));
def('ot', (p) => {
  p.disc(8, 8, 6.5, C.purpleDk);
  p.disc(8, 8, 5.5, C.purple);
  p.disc(8, 8, 3.5, C.purpleDk);
  p.disc(8, 8, 2.2, C.purpleLt);
  p.set(6, 5, C.white);
});
def(['gold', 'coin'], (p) => {
  p.disc(8, 8, 6.6, C.goldDk);
  p.disc(7.6, 7.6, 5.8, C.gold);
  p.disc(7.6, 7.6, 3.6, C.goldDk);
  p.disc(7.6, 7.6, 2.8, C.goldLt);
  p.set(5, 4, C.white);
  p.set(4, 5, C.white);
});
def('coins', (p) => {
  for (const [x, y] of [[2, 10], [6, 11], [10, 10], [4, 7], [8, 7], [6, 4]]) p.rows(x, y, ['abbbc', 'bbbbc', 'ccccc'], { a: C.goldLt, b: C.gold, c: C.goldDk });
});
def(['str', 'strength'], (p) =>
  p.rows(2, 1, ['..aab.......', '.abbbb......', '.abbbbb.....', '..abbbb.....', '...abbb.....', '...abbbaab..', '..abbbbbbbb.', '.abbbbbbbbbc', 'abbbbbbbbbbc', 'abbbbbbbbbbc', 'abbbbbbbbbc.', '.abbbbbbbc..', '..cccccccc..'], { a: '#ffd2a8', b: '#eaa070', c: '#a8603a' }),
);
def(['dex', 'boot'], (p) =>
  p.rows(3, 1, ['...aaab...', '...abbc...', '...abbc...', '...abbc...', '...abbc...', '..abbbc...', '.abbbbbbb.', 'abbbbbbbbc', 'abbbbbbbbc', 'cccccccccc'], { a: '#e8a868', b: '#c8783a', c: '#7a4420' }),
);
def(['int', 'book'], (p) =>
  p.rows(0, 2, ['.aaaaaa..aaaaaa.', 'abbbbbba.abbbbbbc', 'abccccba.abccccbc', 'abbbbbba.abbbbbbc', 'abccccba.abccccbc', 'abbbbbba.abbbbbbc', 'abccccba.abccccbc', 'abbbbbbaaabbbbbbc', 'adddddddddddddddc', '.ddddddd.ddddddd.'], { a: '#fff4d8', b: '#f0dfb6', c: '#b8a07a', d: '#9a3a2a' }),
);
def(['res', 'shield-blue'], (p) =>
  p.rows(3, 1, ['aaaaaaaaaa', 'abbbbcccca', 'abwbbcccca', 'abbbbcccca', 'abbbbcccca', 'abbbbcccca', '.abbbccca.', '.abbbccca.', '..abbcca..', '...abca...', '....aa....'], { a: '#e4e8ec', b: '#aab3bc', c: '#6c7681', w: C.white }),
);

// potions
def(['potion-hp', 'potionHP1', 'potion'], (p) => potion(p, C.red, C.redLt, C.redDk));
def('potionHP2', (p) => potion(p, C.red, C.redLt, C.redDk, 2));
def('potionHP3', (p) => potion(p, C.red, C.redLt, C.redDk, 3));
def(['potion-mp', 'potionMP1'], (p) => potion(p, C.blue, C.blueLt, C.blueDk));
def('potionMP2', (p) => potion(p, C.blue, C.blueLt, C.blueDk, 2));
def('potionMP3', (p) => potion(p, C.blue, C.blueLt, C.blueDk, 3));
def(['potion-st', 'potionST1'], (p) => potion(p, C.gold, C.goldLt, C.goldDk));
def('potionST2', (p) => potion(p, C.gold, C.goldLt, C.goldDk, 2));
def('potionST3', (p) => potion(p, C.gold, C.goldLt, C.goldDk, 3));
def('potion-green', (p) => potion(p, C.green, C.greenLt, C.greenDk));
def('water', (p) => potion(p, '#7ec8f0', '#d0f0ff', '#3a8ab8'));
def('bottle', (p) => potion(p, '#dfeff4', C.white, '#9ab8c4'));

// food
def(['food', 'food10', 'food30'], (p) => {
  p.rows(1, 3, ['....aaaaa.....', '..aabbbbba....', '.abbbcbbbba...', 'abbbbbbbcbba..', 'abbcbbbbbbbba.', 'abbbbbbbbcbbad', '.abbbbbcbbbaddd', '..abbbbbbba.dd', '...aaaaaaa....'], { a: '#7a3a1a', b: '#b8602a', c: '#e09050', d: '#f0e8d8' });
});
def(['food11', 'food31', 'fish'], (p) => {
  p.rows(0, 4, ['......aaaa......', '....aabbbba...c.', '..aabbwbbbbba.cc', '.abbbbbbbbbbbacc', 'abkbbbbbbbbbbcc.', '.abbbbbbbbbbbacc', '..aabbbbbbbba.cc', '....aaaaaaa...c.'], { a: '#3a6a8a', b: '#7ab0d0', c: '#3a6a8a', w: '#d8f0ff', k: '#101010' });
});
def(['food12', 'grain'], (p) => {
  p.line(8, 14, 8, 3, '#b8902a');
  for (let y = 3; y < 11; y += 2) {
    p.rows(5, y, ['ab.', '.b.'], { a: C.goldLt, b: C.gold });
    p.rows(9, y + 1, ['.ba', '.b.'], { a: C.goldLt, b: C.gold });
  }
});
def(['food20', 'food21', 'food22', 'food32', 'soup'], (p) => {
  p.rows(1, 6, ['aaaaaaaaaaaaaa', 'abbbbbcbbbcbba', 'acccccccccccca', '.acccccccccca.', '..aacccccccaa.', '....aaaaaaa...'], { a: '#5e3a1c', b: '#e09050', c: '#9a6534' });
  p.line(10, 2, 13, 6, '#c8c8c8');
});
def('mushroom', (p) => p.rows(2, 2, ['...aaaaaa...', '.aabbabbbaa.', 'abbabbbbabba', 'abbbbbabbbba', 'cccccccccccc', '....dddd....', '....deed....', '....deed....', '....dddd....', '...dddddd...'], { a: '#ffffff', b: '#d23a2a', c: '#8a1a14', d: '#f0e0c8', e: '#c8b090' }));
def('meat', (p) => p.rows(1, 3, ['...aaaaa......', '..abbbbba.....', '.abbcbbbba....', 'abbbbbcbbba...', 'abcbbbbbbbba..', 'abbbbbbcbbba..', '.abbbbbbbbadd.', '..aabbbbbaddde', '....aaaaa..dde'], { a: '#8e1a14', b: '#e05a4a', c: '#ffb0a0', d: '#f0e8d8', e: '#c8bca8' }));

// materials
def('ore', (p) => block(p, '#9a9a9a', '#7a7a7a', '#5a5a5a', '#e8b890', '#c88a5a'));
def('starore', (p) => block(p, '#5a5a7a', '#44445e', '#2e2e44', C.blueLt, C.white));
def('coal', (p) => p.rows(2, 3, ['....aaab....', '..aabbbbbc..', '.abbbabbbbc.', 'abbabbbbabbc', 'abbbbbbbbbbc', 'abbbbabbbbcc', '.bbbbbbbbbc.', '..cbbbbbcc..', '...cccccc...'], { a: '#6a6a6a', b: '#2e2e2e', c: '#161616' }));
def('iron', (p) => ingot(p, '#c8ccd2', '#eef0f2', '#7c848c'));
def('steel', (p) => ingot(p, '#8fa8c8', '#cfe0f4', '#4e6484'));
def('alloy', (p) => ingot(p, '#d8b060', '#ffe8a0', '#8a6020'));
def(['wood', 'oldwood'], (p) =>
  p.rows(1, 3, ['......aaaaaa..', '....aabbbbbbc.', '..aabbbbbbbbcc', 'aabbbbbbbbccdd', 'abbbbbbbbccdde', 'abbbbbbbccdeed', 'abbbbbbccddeed', '.cbbbbbccdddd.', '..ccccccc.....'], { a: C.woodLt, b: C.wood, c: C.woodDk, d: '#d8a868', e: '#a87838' }),
);
def(['leather', 'rareleather', 'hide'], (p) =>
  p.rows(1, 1, ['..a......a....', '.aba....aba...', '.abbaaaabbba..', '..abbbbbbbba..', '.abbbcbbbbbba.', 'abbbbbbbcbbbba', 'abbcbbbbbbbbba', '.abbbbbbcbbba.', '..abbbbbbbba..', '.abbbbcbbbbba.', '.aba.abbba.aba', '..a...aaa...a.'], { a: '#5e3a1c', b: '#a8703a', c: '#c89058' }),
);
def('sinew', (p) => {
  for (let i = 0; i < 12; i++) p.set(2 + i, 8 + Math.round(Math.sin(i * 0.9) * 4), '#e06a7a');
  for (let i = 0; i < 12; i++) p.set(2 + i, 9 + Math.round(Math.sin(i * 0.9) * 4), '#a83a4a');
});
def(['horn', 'claw'], (p) => p.rows(2, 1, ['..........ab', '.........abc', '........abc.', '.......abbc.', '.....aabbc..', '...aabbbc...', '.aabbbbc....', 'abbbbbc.....', 'abbbbc......', '.cccc.......'], { a: '#fff4d8', b: '#d8c8a0', c: '#9a8a68' }));
def('red', (p) => flower(p, C.red, C.redLt));
def('blue', (p) => flower(p, C.blue, C.blueLt, C.white));
def('yellow', (p) => flower(p, C.gold, C.goldLt, C.orange));
def('moon', (p) => flower(p, '#c8d8ff', C.white, C.purpleLt));
def('blood', (p) => flower(p, '#9a1a3a', '#e05a7a', C.yellow));
def(['crystal', 'gem'], (p) => gem(p, C.blue, C.blueLt, C.blueDk));
def('material', (p) => block(p, '#9a9a9a', '#7a7a7a', '#5a5a5a', '#c8c8c8'));
def('tool', (p) => D.pickaxe(p));

// quest and interface signs
def(['quest', 'scroll'], (p) =>
  p.rows(2, 1, ['.aaaaaaaaaa.', 'abbbbbbbbbba', '.accccccccb.', '.acddddddcb.', '.accccccccb.', '.acddddddcb.', '.accccccccb.', '.acdddddccb.', '.accccccccb.', 'abbbbbbbbbba', '.aaaaaaaaaa.'], { a: '#8a5a2a', b: '#c89a5a', c: '#f4e4b8', d: '#a88a5a' }),
);
def('quest-active', (p) => {
  D.scroll(p);
  p.rect(7, 3, 2, 5, C.red);
  p.rect(7, 9, 2, 2, C.red);
});
def('quest-done', (p) => {
  D.scroll(p);
  p.line(4, 7, 6, 9, C.greenDk);
  p.line(6, 9, 11, 4, C.green);
  p.line(5, 7, 6, 8, C.green);
});
def('quest-failed', (p) => {
  D.scroll(p);
  p.line(5, 3, 10, 9, C.red);
  p.line(10, 3, 5, 9, C.red);
});
def('mark-quest', (p) => p.rows(5, 1, ['aaaaa.', 'abbbac', 'abbbac', 'abbbac', 'abbbac', 'abbbac', 'abbbac', '.abac.', '.abac.', '..ac..', '......', '.aaa..', '.abac.', '.aaac.'], { a: C.goldLt, b: C.gold, c: C.goldDk }));
def('mark-turnin', (p) => p.rows(4, 1, ['.aaaaa..', 'abbbbbac', 'abc..bac', '....abac', '...abac.', '..abac..', '..abac..', '..abac..', '...cc...', '........', '..aaa...', '..abac..', '..aaac..'], { a: C.goldLt, b: C.gold, c: C.goldDk }));
def('lock', (p) => p.rows(3, 1, ['...aaaa...', '..a....a..', '.a......a.', '.a......a.', '.a......a.', 'bbbbbbbbbb', 'bccccccccb', 'bcccddcccb', 'bcccddcccb', 'bccccdcccb', 'bccccccccb', 'bbbbbbbbbb'], { a: '#c8c8c8', b: '#8a8a8a', c: '#b8b8b8', d: '#3a3a3a' }));
def('check', (p) => {
  p.line(2, 8, 6, 12, C.green);
  p.line(3, 8, 6, 11, C.greenLt);
  p.line(6, 12, 14, 3, C.green);
  p.line(6, 11, 13, 3, C.greenLt);
});
def('cross', (p) => {
  p.line(3, 3, 12, 12, C.red);
  p.line(4, 3, 13, 12, C.redLt);
  p.line(12, 3, 3, 12, C.red);
  p.line(13, 3, 4, 12, C.redLt);
});
def('eye', (p) => p.rows(1, 4, ['....aaaaaa....', '..aabbbbbbaa..', '.abbbccccbbba.', 'abbbcddwccbbba', 'abbbcdddccbbba', '.abbbccccbbba.', '..aabbbbbbaa..', '....aaaaaa....'], { a: '#3a3a3a', b: '#f4f0e8', c: '#4a8ac8', d: '#101010', w: C.white }));
def('clock', (p) => {
  p.disc(8, 8, 6.6, '#e4e8ec');
  p.disc(8, 8, 5.4, '#2a2a2a');
  p.disc(8, 8, 4.6, '#f4f0e8');
  p.line(8, 8, 8, 4, '#2a2a2a');
  p.line(8, 8, 11, 8, '#2a2a2a');
});
def('hourglass', (p) => p.rows(4, 1, ['aaaaaaaa', '.bccccb.', '.bccccb.', '..bccb..', '...bb...', '...bb...', '..bddb..', '.bddddb.', '.bddddb.', 'aaaaaaaa'], { a: C.wood, b: '#c8e0ea', c: C.goldLt, d: C.gold }));
def('pin', (p) => p.rows(4, 1, ['..aaaa..', '.abbbba.', 'abbccbba', 'abccccba', 'abbccbba', '.abbbba.', '.abbbba.', '..abba..', '..abba..', '...aa...', '...aa...'], { a: '#8e1a14', b: C.red, c: C.white }));
def(['save', 'disk'], (p) => p.rows(2, 2, ['aaaaaaaaaab.', 'acccccccca.b', 'acccccccca.a', 'acccccccca.a', 'aaaaaaaaaaaa', 'aaaaaaaaaaaa', 'aaddddddddaa', 'aaddddddddaa', 'aaddddddddaa', 'aaddddddddaa', 'aaaaaaaaaaaa'], { a: '#f4e8cc', b: '#c8b890', c: '#3a3a3a', d: '#ffffff' }));
def('refresh', (p) => {
  for (let a = 30; a <= 330; a += 6) {
    const t = (a * Math.PI) / 180;
    p.set(8 + Math.cos(t) * 5, 8 + Math.sin(t) * 5, '#f4f0e8');
    p.set(8 + Math.cos(t) * 4, 8 + Math.sin(t) * 4, '#c8c0b0');
  }
  p.rows(11, 1, ['a...', 'aa..', 'aaa.', 'aa..'], { a: '#f4f0e8' });
});
def(['door', 'exit'], (p) => {
  p.rows(3, 1, ['aaaaaaaaa.', 'abbbbbbba.', 'abbbbbbba.', 'abbbbbbba.', 'abbbbbcba.', 'abbbbbbba.', 'abbbbbbba.', 'abbbbbbba.', 'abbbbbbba.', 'abbbbbbba.', 'abbbbbbba.', 'aaaaaaaaa.'], { a: '#5e3a1c', b: C.wood, c: C.goldLt });
  p.rows(11, 5, ['a...', 'aa..', 'aaa.', 'aa..', 'a...'], { a: '#f4f0e8' });
});
def(['chat', 'talk'], (p) => p.rows(1, 2, ['.aaaaaaaaaaaa.', 'abbbbbbbbbbbba', 'abbbbbbbbbbbba', 'abccbbccbbccba', 'abccbbccbbccba', 'abbbbbbbbbbbba', 'abbbbbbbbbbbba', '.aaabaaaaaaaa.', '...aba.......', '...aa........'], { a: '#8a7a5a', b: '#f4e8cc', c: '#3a3a3a' }));
def('trophy', (p) => p.rows(2, 1, ['aaaaaaaaaaaa', 'abbbbbbbbbbc', 'abbwbbbbbbbc', '.abbbbbbbbc.', '.abbbbbbbbc.', '..abbbbbbc..', '...abbbbc...', '....abbc....', '.....bc.....', '.....bc.....', '....abbc....', '...cccccc...', '..aaaaaaaa..'], { a: C.goldLt, b: C.gold, c: C.goldDk, w: C.white }));
def(['backpack', 'inventory', 'bag'], (p) => p.rows(2, 1, ['....aaaa....', '...a....a...', '..aaaaaaaa..', '.abbbbbbbbc.', 'abbbbbbbbbbc', 'abbccccccbbc', 'abbcddddcbbc', 'abbccccccbbc', 'abbbbbbbbbbc', 'abbbbbbbbbbc', 'abbbbbbbbbbc', '.cccccccccc.'], { a: '#e8a868', b: '#c8783a', c: '#7a4420', d: C.goldLt }));
def(['star', 'favorite'], (p) => p.rows(1, 1, ['......a.......', '.....aba......', '.....abb......', 'aaaaabbbbaaaa.', '.abbbbbbbbbbc.', '..abbbbbbbbc..', '...abbbbbbc...', '...abbbbbbc...', '..abbbcabbbc..', '..abc....abc..', '.ac.......ac..'], { a: C.goldLt, b: C.gold, c: C.goldDk }));
def('search', (p) => {
  p.disc(6, 6, 4.6, '#f4f0e8');
  p.disc(6, 6, 3.2, null);
  p.line(9, 9, 13, 13, '#f4f0e8');
  p.line(10, 9, 14, 13, '#c8c0b0');
});
def('anvil', (p) => p.rows(0, 3, ['aaaaaaaaaaaaaa..', '.bbbbbbbbbbbbbbb', '..cbbbbbbbbbbcc.', '.....cbbbbc.....', '.....cbbbbc.....', '....abbbbbbc....', '...abbbbbbbbc...', '..cccccccccccc..'], { a: '#c8ccd2', b: '#8a9098', c: '#4e545c' }));
def(['cauldron', 'stove'], (p) => {
  p.rows(1, 3, ['.aaaaaaaaaaaa.', 'abbbbbbbbbbbba', 'acccccccccccca', '.acccccccccca.', '.acccccccccca.', '..acccccccca..', '...aaaaaaaa...'], { a: '#2a2a2a', b: C.greenLt, c: '#4a4a4a' });
  p.rows(3, 11, ['.a.a.a.a.a', 'ababababab', 'bcbcbcbcbc'], { a: C.yellow, b: C.orange, c: C.red });
});
def(['alchemy', 'mortar'], (p) => {
  p.line(9, 2, 12, 8, C.wood);
  p.rows(2, 7, ['aaaaaaaaaaaa', 'abbbbbbbbbbc', '.abbbbbbbbc.', '..abbbbbbc..', '...cccccc...', '..cccccccc..'], { a: '#c8ccd2', b: '#8a9098', c: '#4e545c' });
  p.rows(1, 1, ['.a..', 'abc.', 'bbc.', 'bcc.'], { a: C.greenLt, b: C.green, c: C.greenDk });
});
def(['bed', 'sleep'], (p) => p.rows(0, 4, ['aa..............', 'ab..............', 'abcccbbbbbbbbbbb', 'abcccddddddddddd', 'abddddddddddddde', 'aaaaaaaaaaaaaaaa', 'a..............a', 'a..............a'], { a: C.woodDk, b: C.white, c: '#e8e0d0', d: '#c8302a', e: C.red }));
def(['container', 'box'], (p) => p.rows(1, 2, ['aaaaaaaaaaaaaa', 'abbbbbbbbbbbba', 'abccccccccccba', 'aaaaaaddaaaaaa', 'abbbbbdebbbbba', 'abbbbbddbbbbba', 'abbbbbbbbbbbba', 'abccccccccccba', 'abbbbbbbbbbbba', 'abccccccccccba', 'aaaaaaaaaaaaaa'], { a: '#3a2210', b: C.wood, c: C.woodDk, d: '#c8c8c8', e: '#3a3a3a' }));
def('waystone', (p) => {
  p.rows(4, 12, ['aaaaaaaa', 'bbbbbbbb', 'cccccccc'], { a: '#9a9a9a', b: '#7a7a7a', c: '#5a5a5a' });
  gem(p, '#4ad8f0', '#c8f8ff', '#1a7a9a');
});
def('waystone-off', (p) => gem(p, '#b8bcc4', '#f0f0f4', '#6a6e78'));
def('house', (p) => p.rows(1, 1, ['......aa......', '.....abba.....', '....abbbba....', '...abbbbbba...', '..abbbbbbbba..', '.abbbbbbbbbba.', 'aaaaaaaaaaaaaa', '.cccccccccccc.', '.cdddccccdddc.', '.cdddcceedddc.', '.ccccceeccccc.', '.ccccceeccccc.', '.ccccceeccccc.'], { a: '#8e2a1a', b: '#d84a2a', c: '#e8c890', d: '#5ab0e0', e: C.woodDk }));
def('flag', (p) => {
  p.line(4, 1, 4, 14, '#8a8a8a');
  p.rows(5, 1, ['aaaaaaaa', 'abbbbbba', 'abbbbbb.', 'abbbbb..', 'abbbbbba', 'aaaaaaaa'], { a: C.blueDk, b: C.blue });
});
def('sun', (p) => {
  burst(p, 8, 8, 7, C.yellow, C.orange);
  p.disc(8, 8, 3.6, C.yellow);
  p.disc(7, 7, 1.5, C.white);
});
def('moon-night', (p) => {
  p.disc(8, 8, 6, '#e8ecf8');
  p.disc(11, 6, 5, null);
});
def(['gear', 'settings'], (p) => {
  for (let a = 0; a < 8; a++) {
    const t = (a * Math.PI) / 4;
    p.rect(7 + Math.round(Math.cos(t) * 5.5) - 1, 7 + Math.round(Math.sin(t) * 5.5) - 1, 3, 3, '#c8c0b0');
  }
  p.disc(8, 8, 5, '#c8c0b0');
  p.disc(8, 8, 2, null);
});
def(['monitor', 'display'], (p) => p.rows(1, 2, ['aaaaaaaaaaaaaa', 'abbbbbbbbbbbba', 'abccbbbbbbbbba', 'abcbbbbbbbbbba', 'abbbbbbbbbbbba', 'abbbbbbbbbbbba', 'abbbbbbbbbbbba', 'aaaaaaaaaaaaaa', '.....aaaa.....', '...aaaaaaaa...'], { a: '#f4f0e8', b: '#2a2a2a', c: '#6a6a6a' }));
def(['speaker', 'sound'], (p) => {
  p.rows(1, 4, ['....aa', '..aaba', 'aaabba', 'abbbba', 'abbbba', 'aaabba', '..aaba', '....aa'], { a: '#f4f0e8', b: '#c8c0b0' });
  for (let r of [3, 5]) for (let a = -50; a <= 50; a += 10) p.set(8 + Math.cos((a * Math.PI) / 180) * r, 8 + Math.sin((a * Math.PI) / 180) * r, '#f4f0e8');
});
def(['gamepad', 'controls'], (p) => p.rows(0, 4, ['..aaaaaaaaaaaa..', '.abbbbbbbbbbbba.', 'abbabbbbbbbcbbba', 'abaaabbbbbcbcbba', 'abbabbbbbbbcbbba', 'abbbbbaaaabbbbba', 'abbbba....abbbba', '.aaaa......aaaa.'], { a: '#f4f0e8', b: '#c8c0b0', c: C.red }));
def(['interface', 'ui'], (p) => p.rows(1, 2, ['aaaaaaaaaaaaaa', 'abbbbbbbbbbbba', 'abccccbbddddba', 'abccccbbddddba', 'abbbbbbbbbbbba', 'abeeeeeeeeeeba', 'abbbbbbbbbbbba', 'aaaaaaaaaaaaaa', '.....aaaa.....', '...aaaaaaaa...'], { a: '#f4f0e8', b: '#2a2a2a', c: C.red, d: C.blue, e: C.gold }));
def('info', (p) => {
  p.disc(8, 8, 6.6, C.goldDk);
  p.disc(8, 8, 5.8, C.gold);
  p.rect(7, 4, 2, 2, '#2a1a0a');
  p.rect(7, 7, 2, 5, '#2a1a0a');
});
def('warn', (p) => {
  p.disc(8, 8, 6.6, '#c8c0b0');
  p.disc(8, 8, 5.8, '#3a3632');
  p.rect(7, 4, 2, 5, '#f4f0e8');
  p.rect(7, 10, 2, 2, '#f4f0e8');
});
def('pause', (p) => {
  p.rect(4, 2, 3, 12, C.gold);
  p.rect(9, 2, 3, 12, C.gold);
});
def('map', (p) => p.rows(1, 2, ['aaaa.aaaa.aaaa', 'abba.abba.abba', 'abbaabbbaabbba', 'abbbbbcbbbbbba', 'abbbbbcbbbbbba', 'abbcbbbbbdbbba', 'abbbbbbbbbbbba', 'abbbbbbbbbbbba', 'abbbbbbdbbbbba', 'aabbaabbaabbaa', '.aaa.aaaa.aaa.'], { a: C.woodDk, b: '#e8d8a8', c: C.red, d: C.green }));
def('arrow-up', (p) => p.rows(3, 2, ['....aa....', '...abba...', '..abbbba..', '.abbbbbba.', 'aaaabbaaaa', '...abba...', '...abba...', '...abba...', '...abba...', '...aaaa...'], { a: '#2a1a0a', b: C.white }));
def('group', (p) => {
  p.disc(5, 5, 2.4, '#f4f0e8');
  p.disc(11, 5, 2.4, '#f4f0e8');
  p.rect(2, 9, 6, 5, '#f4f0e8');
  p.rect(9, 9, 6, 5, '#f4f0e8');
});
def('tree', (p) => {
  p.rows(3, 1, ['....aa....', '...abba...', '..abbbba..', '...abba...', '..abbbba..', '.abbbbbba.', '..abbbba..', '.abbbbbba.', 'abbbbbbbba', '....cc....', '....cc....'], { a: C.greenLt, b: C.green, c: C.woodDk });
});

// faces
def(['hero', 'face'], (p) => face(p, { hair: '#6a3e1c', hairDk: '#4a2a12' }));
def(['face-blond'], (p) => face(p, { hair: '#e8c86a', hairDk: '#b8983a', eye: '#2a5aa8' }));
def(['face-dark'], (p) => face(p, { hair: '#2a2420', hairDk: '#14100c', skin: '#c89070' }));
def(['face-red'], (p) => face(p, { hair: '#c8582a', hairDk: '#8a3a1a', eye: '#2a7a3a' }));
def(['npc-mira', 'npc-alchemist', 'mira'], (p) => face(p, { hair: '#8a5a2a', hairDk: '#6a3e1c', eye: '#2a7a3a', long: true, band: C.green }));
def(['npc-arden', 'arden'], (p) => face(p, { hair: '#c8c8c8', hairDk: '#9a9a9a', beard: '#e0e0e0' }));
def(['npc-smith', 'npc-bran', 'smith'], (p) => face(p, { hair: '#6a3a1a', hairDk: '#4a2a12', beard: '#7a4a22', skin: '#d8a07a' }));
def(['npc-hira', 'hira'], (p) => face(p, { hair: '#2a2420', hairDk: '#14100c', long: true, eye: '#5a3a1a' }));
def(['npc-cook', 'cook'], (p) => face(p, { hair: '#f4f4f4', hairDk: '#d0d0d0', band: '#f4f4f4' }));
def(['npc-hunter', 'hunter'], (p) => face(p, { hair: '#4a3a1a', hairDk: '#3a2a12', beard: '#4a3a1a', band: C.greenDk }));
def(['npc-supplier', 'supplier', 'npc'], (p) => face(p, { hair: '#7a5a3a', hairDk: '#5a3a1a' }));
def(['wolf', 'greyfang', 'enemy'], (p) =>
  p.rows(1, 1, ['.a........a...', 'aba......aba..', 'abba....abba..', 'abbbaaaabbbba.', 'abbbbbbbbbbbba', 'abcbbbbbbbcbba', 'abwkbbbbbwkbba', 'abbbbbbbbbbbba', '.abbbccccbbba.', '.abbcccccccba.', '..abccdddcca..', '..abcccccca...', '...aaccccaa...', '.....aaaa.....'], { a: '#3a3a3e', b: '#8a8a8e', c: '#d8d8dc', d: '#101010', w: C.yellow, k: '#101010' }),
);
def(['bandit'], (p) => {
  face(p, { hair: '#4a2a12', hairDk: '#2a1a0a', skin: '#c89070' });
  p.rect(2, 10, 12, 4, '#2a2a2a');
});
def(['dummy'], (p) => p.rows(3, 1, ['...aaaa...', '...abba...', '...abba...', '....aa....', 'aaaaaaaaaa', 'abbbbbbbba', '...abba...', '...abba...', '...abba...', '...a..a...', '...a..a...', '..aaaaaa..'], { a: '#7a5a3a', b: '#c89a6a' }));

// ------------------------------------------------------------------ weapon skills (s1–s6, b1–b6)
def('s1', (p) => {
  sword(p);
  burst(p, 11, 4, 4);
});
def('s2', (p) => {
  sword(p);
  crescent(p, 8, 8, 7);
});
def('s3', (p) => {
  sword(p);
  burst(p, 3, 12, 3.5);
  p.set(1, 14, C.white);
});
def('s4', (p) => {
  sword(p);
  for (const y of [3, 6, 9]) p.line(10, y + 3, 14, y + 3, C.blueLt);
});
def('s5', (p) => {
  for (let a = 0; a < 360; a += 5) {
    const t = (a * Math.PI) / 180;
    p.set(8 + Math.cos(t) * 7, 8 + Math.sin(t) * 7, a < 270 ? C.orange : null);
    p.set(8 + Math.cos(t) * 6, 8 + Math.sin(t) * 6, a < 270 ? C.yellow : null);
  }
  sword(p);
});
def('s6', (p) => {
  sword(p, { blade: '#fff4d0', mid: '#e8c060', dk: '#a87820', guard: '#c79a3a' });
  burst(p, 12, 3, 3);
  burst(p, 4, 6, 2.5, C.yellow, C.red);
});
def('b1', (p) => {
  bow(p);
  arrow(p, 3, 12, 13, 2);
  p.disc(13, 2, 1.2, C.red);
});
def('b2', (p) => {
  arrow(p, 1, 10, 11, 0);
  arrow(p, 4, 14, 14, 4);
});
def('b3', (p) => {
  arrow(p, 2, 13, 12, 3);
  for (const [x, y] of [[12, 8], [9, 11], [13, 12]]) p.rows(x - 1, y - 1, ['.a.', 'aba', '.a.'], { a: C.blueLt, b: C.white });
});
def('b4', (p) => {
  arrow(p, 1, 14, 14, 1);
  p.rows(5, 5, ['aa..', 'aa..', '..bb', '..bb'], { a: C.steelMd, b: C.steelDk });
});
def('b5', (p) => {
  arrow(p, 2, 14, 2, 3);
  arrow(p, 2, 14, 8, 2);
  arrow(p, 2, 14, 13, 3);
  arrow(p, 2, 14, 14, 9);
});
def('b6', (p) => {
  bow(p);
  arrow(p, 3, 12, 13, 2);
  burst(p, 12, 3, 3.5);
});

// ------------------------------------------------------------------ spells (f / i / l, circles 1–5)
const FIRE = { a: C.yellow, b: C.orange, c: C.red, w: C.white };
const LIT = { a: C.white, b: C.yellow, c: '#c8a0ff', w: '#ffffff' };
function ball(p: Grid, cx: number, cy: number, r: number, pal: typeof FIRE, tail = true) {
  if (tail) for (let i = 1; i < 7; i++) p.disc(cx - i * 0.9, cy + i * 0.9, Math.max(0.6, r - i * 0.5), i < 3 ? pal.b : pal.c);
  p.disc(cx, cy, r, pal.c);
  p.disc(cx, cy, r - 0.8, pal.b);
  p.disc(cx + 0.4, cy - 0.4, r - 2, pal.a);
  p.set(cx + 1, cy - 1, pal.w);
}
function flake(p: Grid, cx: number, cy: number, r: number) {
  for (let a = 0; a < 6; a++) {
    const t = (a * Math.PI) / 3;
    p.line(cx, cy, cx + Math.cos(t) * r, cy + Math.sin(t) * r, a % 2 ? C.blueLt : C.white);
  }
  p.set(cx, cy, C.blue);
}
function zig(p: Grid, x: number, y: number, h: number, c = C.yellow, lt = C.white) {
  let cx = x;
  for (let i = 0; i < h; i++) {
    const nx = cx + (i % 4 < 2 ? 1 : -1);
    p.set(cx, y + i, c);
    p.set(cx + 1, y + i, lt);
    cx = nx;
  }
}
def('f1', (p) => burst(p, 8, 8, 6.5, C.yellow, C.orange));
def('f2', (p) => ball(p, 10, 6, 4.2, FIRE));
def('f3', (p) => {
  for (let k = 0; k < 3; k++) for (let a = -60; a <= 60; a += 5) {
    const t = (a * Math.PI) / 180, r = 4 + k * 3.5;
    p.set(2 + Math.cos(t) * r, 8 + Math.sin(t) * r, [C.yellow, C.orange, C.red][k]);
  }
});
def('f4', (p) => {
  for (const [x, h] of [[3, 7], [6, 11], [9, 8], [12, 12]]) {
    p.line(x, 15, x, 15 - h, C.red);
    p.line(x + 1, 15, x + 1, 16 - h, C.orange);
    p.set(x, 15 - h, C.yellow);
    p.line(x + 1, 15, x + 1, 18 - h, C.orange);
    p.set(x + 1, 16 - h + 2, C.yellow);
  }
  p.rect(1, 14, 14, 1, C.yellow);
});
def('f5', (p) => {
  ball(p, 11, 4, 3, FIRE);
  ball(p, 6, 9, 2.4, FIRE);
  ball(p, 12, 12, 2, FIRE, false);
  p.disc(12, 12, 1.4, '#3a2a2a');
});
def('i1', (p) => ball(p, 10, 6, 3.6, { a: C.white, b: '#7ec8f0', c: '#2a78c8', w: '#ffffff' }));
def('i2', (p) => {
  p.line(2, 14, 12, 4, C.blueLt);
  p.line(3, 14, 13, 4, C.blue);
  p.rows(10, 1, ['..aa..', '.abbc.', 'abbbcc', '.bbcc.', '..cc..'].map((r) => r), { a: C.white, b: C.blueLt, c: C.blue });
});
def('i3', (p) => {
  flake(p, 5, 5, 3.5);
  flake(p, 11, 8, 3.5);
  flake(p, 5, 12, 2.5);
});
def('i4', (p) =>
  p.rows(2, 1, ['aaaaaaaaaaaa', 'abbbbbbbbbbc', 'ab.b..b..b.c', 'ab.b..b..b.c', 'ab.b..b..b.c', 'abbbbbbbbbbc', 'ab.b..b..b.c', 'ab.b..b..b.c', 'ab.b..b..b.c', 'ab.b..b..b.c', 'abbbbbbbbbbc', 'cccccccccccc'].map((r) => r.replace(/\./g, 'd')), { a: C.white, b: C.blueLt, c: C.blue, d: '#cfe8ff' }),
);
def('i5', (p) => {
  p.disc(8, 8, 7, '#cfe8ff');
  p.disc(8, 8, 6, C.blueLt);
  flake(p, 8, 8, 6);
});
def('l1', (p) => {
  zig(p, 6, 1, 14);
  p.set(4, 4, C.yellow);
  p.set(11, 9, C.yellow);
});
def('l2', (p) => {
  p.rows(1, 0, ['..aaaa..aaa...', '.abbbbaabbba..', 'abbbbbbbbbbba.', '.cccccccccccc.'], { a: '#c8c8d8', b: '#8a8aa0', c: '#5a5a70' });
  zig(p, 7, 4, 11);
});
def('l3', (p) => {
  zig(p, 2, 2, 6);
  p.line(3, 8, 8, 7, C.yellow);
  zig(p, 8, 7, 4);
  p.line(9, 11, 13, 12, C.yellow);
  for (const [x, y] of [[2, 2], [8, 7], [13, 12]]) p.disc(x, y, 1.3, LIT.c);
});
def('l4', (p) => {
  p.rows(0, 0, ['.aaaaaa..aaaaa..', 'abbbbbbaabbbbba.', 'cccccccccccccccc'], { a: '#9a9ab0', b: '#5a5a70', c: '#3a3a4a' });
  zig(p, 7, 3, 12, C.yellow, C.white);
  zig(p, 3, 3, 6, C.yellow, C.yellow);
  zig(p, 12, 3, 7, C.yellow, C.yellow);
  burst(p, 8, 14, 2.5, C.white, C.yellow);
});
def('l5', (p) => {
  p.rows(0, 0, ['..aaaa....aaaa..', '.abbbbaaaabbbba.', 'abbbbbbbbbbbbbba', 'cccccccccccccccc'], { a: '#c8a0ff', b: '#7a5ac8', c: '#4a2a8a' });
  zig(p, 2, 4, 9);
  zig(p, 7, 4, 11);
  zig(p, 12, 4, 8);
});

// ------------------------------------------------------------------ rendering
const cache = new Map<string, string>();

/** Pixel colours of one icon (16×16, null = empty), outline included. Exported for tests. */
export function iconPixels(name: string, outline = true): Col[] | null {
  const f = D[name];
  if (!f) return null;
  const p = new Grid();
  f(p);
  if (outline) {
    const src = p.g.slice();
    for (let y = 0; y < N; y++)
      for (let x = 0; x < N; x++) {
        if (src[y * N + x]) continue;
        const near = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => {
          const xx = x + dx, yy = y + dy;
          return xx >= 0 && yy >= 0 && xx < N && yy < N && src[yy * N + xx] && src[yy * N + xx] !== OUT;
        });
        if (near) p.g[y * N + x] = OUT;
      }
  }
  return p.g;
}

export const ICON_NAMES = (): string[] => Object.keys(D);
export const hasIcon = (name: string) => name in D;

/** Data URL of an icon (64×64, pixels scaled ×4 so it stays crisp when shown at 32 or 48 px). */
export function pxIconUrl(name: string): string {
  const hit = cache.get(name);
  if (hit !== undefined) return hit;
  let url = '';
  const px = iconPixels(D[name] ? name : 'material');
  if (px && typeof document !== 'undefined') {
    const cv = document.createElement('canvas');
    cv.width = cv.height = N * 4;
    const ctx = cv.getContext('2d');
    if (ctx) {
      px.forEach((c, i) => {
        if (!c) return;
        ctx.fillStyle = c;
        ctx.fillRect((i % N) * 4, Math.floor(i / N) * 4, 4, 4);
      });
      url = cv.toDataURL();
    }
  }
  cache.set(name, url);
  return url;
}

/** An inline icon element; `size` in CSS pixels (default 32). */
export function pxIcon(name: string, size = 32, cls = ''): HTMLElement {
  const el = document.createElement('i');
  el.className = 'px-ico' + (cls ? ' ' + cls : '');
  el.style.width = el.style.height = `${size}px`;
  el.style.backgroundImage = `url(${pxIconUrl(name)})`;
  el.dataset.icon = name;
  return el;
}

/** Icon name for an RPG item template (weapon family, armor slot, tool, rune) or a stack key. */
export function iconForKey(key: string, hint?: { slot?: string; family?: string }): string {
  if (D[key]) return key;
  if (hint?.family) return hint.family === 'greatsword' ? 'greatsword' : hint.family;
  if (hint?.slot) return hint.slot === 'weapon' ? 'sword' : hint.slot;
  const k = key.toLowerCase();
  if (/rune/.test(k)) return 'rune';
  if (/pick/.test(k)) return 'pickaxe';
  if (/axe/.test(k)) return 'axe';
  if (/knife/.test(k)) return 'knife';
  if (/staff/.test(k)) return 'staff';
  if (/bow/.test(k)) return 'bow';
  if (/great/.test(k)) return 'greatsword';
  if (/sword|blade/.test(k)) return 'sword';
  if (/head|helm/.test(k)) return 'helm';
  if (/chest|cuirass/.test(k)) return 'chest';
  if (/legs|boots|pants/.test(k)) return 'legs';
  if (/potionhp/.test(k)) return 'potion-hp';
  if (/potionmp/.test(k)) return 'potion-mp';
  if (/potionst/.test(k)) return 'potion-st';
  if (/food/.test(k)) return 'food';
  return 'material';
}

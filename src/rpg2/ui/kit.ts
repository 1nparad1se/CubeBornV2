import { h } from '../../ui/dom';
import { pxIcon } from '../../ui/pixelIcons';

/**
 * Building blocks of the multi-panel windows of the owner's mockups (docs/references/hud): a row
 * of framed panels under the big title, list rows with an icon, item tiles with stack counts,
 * small tables, quantity steppers, chips and the wide gold action button.
 */

type Kid = HTMLElement | string | null | undefined | false | Kid[];
const kids = (k: Kid[]): (HTMLElement | string)[] => k.flat(9 as 1).filter((x): x is HTMLElement | string => !!x) as (HTMLElement | string)[];

/**
 * The body of a multi-panel window: `title` becomes the big screen title; `cols` is a CSS grid
 * template for the panels; `top` (tabs) spans the whole width above them.
 */
export function screen(title: string, cols: string, panels: Kid[], top?: HTMLElement | null, cls = ''): HTMLElement {
  const grid = h('div.r2-grid', { style: `grid-template-columns:${cols}` }, ...kids(panels));
  return h('div.r2-cols' + cls, h('h1', title), top ? h('div.r2-toptabs', top) : null, grid);
}

/** A framed panel; `title` is its heading, `sub` the dim line under it. */
export function panel(title: string | HTMLElement | null, ...rest: Kid[]): HTMLElement {
  const head = title === null ? null : typeof title === 'string' ? h('h2.r2-ph', title) : title;
  return h('section.r2-pnl', head, ...kids(rest));
}

/** A panel heading with something on the right (a chip, a badge). */
export function phead(title: string, right?: Kid, sub?: string | null): HTMLElement {
  return h('div.r2-phead', h('div', h('h2.r2-ph', title), sub ? h('div.r2-psub', sub) : null), ...kids([right]));
}

/** A scrolling part of a panel that takes the free height. */
export function scroll(...k: Kid[]): HTMLElement {
  return h('div.r2-scroll', ...kids(k));
}

export interface RowOpts {
  icon?: string;
  iconSize?: number;
  title: string | HTMLElement;
  sub?: Kid;
  sel?: boolean;
  locked?: boolean;
  right?: Kid;
  cls?: string;
  onclick?: () => void;
  tip?: string;
}
/** A selectable list row: icon, title, a dim second line, something on the right. */
export function row(o: RowOpts): HTMLElement {
  return h(
    'button.r2-row2' + (o.sel ? '.sel' : '') + (o.locked ? '.locked' : '') + (o.cls ? '.' + o.cls : ''),
    { onclick: o.onclick, title: o.tip },
    o.locked ? pxIcon('lock', 22, 'r2-lock') : null,
    o.icon ? pxIcon(o.icon, o.iconSize ?? 44, 'r2-rico') : null,
    h('span.r2-rtxt', h('b', o.title), o.sub ? h('small', ...kids([o.sub])) : null),
    ...kids([o.right]),
  );
}

export interface TileOpts {
  icon?: string;
  count?: number | string;
  sel?: boolean;
  tag?: string;
  color?: string;
  star?: boolean;
  lock?: boolean;
  tip?: string;
  onclick?: () => void;
}
/** An item tile of a grid (empty when no icon). */
export function tile(o: TileOpts = {}): HTMLElement {
  if (!o.icon) return h('div.r2-tile.empty');
  return h(
    'button.r2-tile' + (o.sel ? '.sel' : ''),
    { onclick: o.onclick, title: o.tip, style: o.color ? `--rar:${o.color}` : undefined },
    pxIcon(o.icon, 52),
    o.count !== undefined && o.count !== '' && o.count !== 1 ? h('span.r2-cnt', String(o.count)) : null,
    o.star ? h('span.r2-star', '★') : null,
    o.lock ? pxIcon('lock', 18, 'r2-tlock') : null,
    o.tag ? h('span.r2-ttag', o.tag) : null,
  );
}
/** A grid of tiles padded with empty cells to whole rows (at least `min` cells). */
export function tiles(list: HTMLElement[], perRow: number, min = 0): HTMLElement {
  const n = Math.max(min, Math.ceil(list.length / perRow) * perRow);
  const out = [...list];
  while (out.length < n) out.push(tile());
  return h('div.r2-tiles', { style: `grid-template-columns:repeat(${perRow},1fr)` }, ...out);
}

/** A small table; `head` may be null. Cells may be nodes. */
export function table(head: (string | null)[] | null, rows: Kid[][], cls = ''): HTMLElement {
  return h(
    'table.r2-tbl' + cls,
    head ? h('thead', h('tr', head.map((x) => h('th', x ?? '')))) : null,
    h('tbody', rows.map((r) => h('tr', r.map((c) => h('td', ...kids([c])))))),
  );
}

/** A quantity stepper (− value +) clamped to [min, max]. */
export function stepper(value: number, min: number, max: number, on: (v: number) => void): HTMLElement {
  const clamp = (v: number) => Math.max(min, Math.min(Math.max(min, max), Math.floor(v || min)));
  const inp = document.createElement('input');
  inp.className = 'r2-stepv';
  inp.type = 'number';
  inp.value = String(clamp(value));
  inp.onchange = () => on(clamp(Number(inp.value)));
  return h(
    'div.r2-step',
    h('button.r2-stepb', { onclick: () => on(clamp(value - 1)), class: value <= min ? 'r2-off' : undefined }, '−'),
    inp,
    h('button.r2-stepb', { onclick: () => on(clamp(value + 1)), class: value >= max ? 'r2-off' : undefined }, '+'),
  );
}

/** A chip: icon and text in a dark rounded box (`cls`: gold, purple, green, blue). */
export function chip(icon: string | null, text: Kid, cls = ''): HTMLElement {
  return h('span.r2-chip2' + (cls ? '.' + cls : ''), icon ? pxIcon(icon, 26) : null, ...kids([text]));
}

/** A rarity / state tag. */
export function tag(text: string, color?: string, cls = ''): HTMLElement {
  return h('span.r2-tag' + (cls ? '.' + cls : ''), { style: color ? `color:${color};border-color:${color}` : undefined }, text);
}

/** The wide action button (gold when primary); `problem` disables it with a hint. */
export function bigBtn(label: string, problem: string | null, fn: () => void, primary = true): HTMLElement {
  return h('button.r2-big' + (primary ? '.primary' : ''), { onclick: () => (problem ? undefined : fn()), title: problem ?? undefined, class: problem ? 'r2-off' : undefined }, label);
}

/** A note line with the round «!» sign. */
export function note(text: Kid, icon = 'info'): HTMLElement {
  return h('div.r2-pnote', pxIcon(icon, 22), h('span', ...kids([text])));
}

/** Top tabs (spanning the window). */
export function tabs<T extends string>(list: readonly (readonly [T, string])[], cur: T, on: (t: T) => void): HTMLElement {
  return h('div.r2-ttabs', list.map(([k, l]) => h('button.r2-ttab' + (k === cur ? '.sel' : ''), { onclick: () => k !== cur && on(k) }, l)));
}

/** A big framed icon (detail panels). */
export function bigIcon(icon: string, size = 128): HTMLElement {
  return h('div.r2-bigico', pxIcon(icon, size));
}

/** A thin gold rule with a centre square. */
export function rule(): HTMLElement {
  return h('div.r2-rule');
}

/** A requirement mark: green check or red cross. */
export function req(ok: boolean, text: string): HTMLElement {
  return h('span.r2-rq' + (ok ? '.ok' : '.no'), pxIcon(ok ? 'check' : 'cross', 18), text);
}

/** A progress bar with an optional label. */
export function bar(frac: number, label?: string, cls = ''): HTMLElement {
  return h('div.r2-pbar' + (cls ? '.' + cls : ''), h('i', { style: `width:${Math.max(0, Math.min(1, frac)) * 100}%` }), label ? h('span', label) : null);
}

/** Search field that keeps focus while the window is rebuilt. */
export function search(value: string, placeholder: string, on: (v: string) => void, key: string): HTMLElement {
  const q = document.createElement('input');
  q.className = 'r2-search';
  q.placeholder = placeholder;
  q.value = value;
  q.dataset.k = key;
  q.oninput = () => {
    on(q.value);
    const nq = document.querySelector(`.r2-search[data-k="${key}"]`) as HTMLInputElement | null;
    if (nq && nq !== q) {
      nq.focus();
      nq.setSelectionRange(nq.value.length, nq.value.length);
    }
  };
  return h('label.r2-searchbox', pxIcon('search', 22), q);
}

/** A select box styled like the mockups. */
export function select<T extends string>(opts: readonly (readonly [T, string])[], v: T, on: (x: T) => void): HTMLSelectElement {
  const s = document.createElement('select');
  s.className = 'r2-sel2';
  for (const [k, l] of opts) s.append(new Option(l, k));
  s.value = v;
  s.onchange = () => on(s.value as T);
  return s;
}

export const fmt = (n: number) => String(Math.round(n * 100) / 100).replace('.', ',');

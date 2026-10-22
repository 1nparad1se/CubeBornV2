/**
 * D211: rebindable controls of the RPG systems, stored for the whole game separately from
 * playthroughs (own storage key), with conflict detection and a reset to defaults. Mouse buttons
 * are written as "Mouse0" (left), "Mouse1" (middle), "Mouse2" (right).
 */
export type ControlAction =
  | 'moveF' | 'moveB' | 'moveL' | 'moveR'
  | 'jump' | 'dodge' | 'sprint' | 'walkToggle'
  | 'attack' | 'block' | 'interact' | 'weaponSwap'
  | 'skill1' | 'skill2' | 'skill3' | 'skill4' | 'skill5' | 'skill6'
  | 'potionHp' | 'potionMp' | 'potionSt'
  | 'quickSave' | 'quickLoad'
  | 'map' | 'journal' | 'character' | 'progress' | 'inventory' | 'bestiary' | 'trade' | 'dialog';

export type ControlBinds = Record<ControlAction, string[]>;

/** Actions in display order with their Russian names. */
export const CONTROL_LIST: { id: ControlAction; name: string; group: string }[] = [
  { id: 'moveF', name: 'Вперёд', group: 'Движение' },
  { id: 'moveB', name: 'Назад', group: 'Движение' },
  { id: 'moveL', name: 'Влево', group: 'Движение' },
  { id: 'moveR', name: 'Вправо', group: 'Движение' },
  { id: 'jump', name: 'Прыжок / воздушный прыжок', group: 'Движение' },
  { id: 'dodge', name: 'Уклонение', group: 'Движение' },
  { id: 'sprint', name: 'Спринт (удерживать)', group: 'Движение' },
  { id: 'walkToggle', name: 'Ходьба / бег', group: 'Движение' },
  { id: 'attack', name: 'Обычная атака', group: 'Бой' },
  { id: 'block', name: 'Блок / прицел / заряд', group: 'Бой' },
  { id: 'interact', name: 'Взаимодействие (удерживать — сбор)', group: 'Бой' },
  { id: 'weaponSwap', name: 'Смена оружия', group: 'Бой' },
  { id: 'skill1', name: 'Умение 1', group: 'Умения и зелья' },
  { id: 'skill2', name: 'Умение 2', group: 'Умения и зелья' },
  { id: 'skill3', name: 'Умение 3', group: 'Умения и зелья' },
  { id: 'skill4', name: 'Умение 4', group: 'Умения и зелья' },
  { id: 'skill5', name: 'Умение 5', group: 'Умения и зелья' },
  { id: 'skill6', name: 'Умение 6', group: 'Умения и зелья' },
  { id: 'potionHp', name: 'Зелье HP', group: 'Умения и зелья' },
  { id: 'potionMp', name: 'Зелье MP', group: 'Умения и зелья' },
  { id: 'potionSt', name: 'Зелье ST', group: 'Умения и зелья' },
  { id: 'quickSave', name: 'Быстрое сохранение', group: 'Сохранения' },
  { id: 'quickLoad', name: 'Быстрая загрузка', group: 'Сохранения' },
  { id: 'map', name: 'Карта', group: 'Окна' },
  { id: 'journal', name: 'Журнал', group: 'Окна' },
  { id: 'character', name: 'Персонаж', group: 'Окна' },
  { id: 'progress', name: 'Развитие', group: 'Окна' },
  { id: 'inventory', name: 'Инвентарь', group: 'Окна' },
  { id: 'bestiary', name: 'Бестиарий', group: 'Окна' },
  { id: 'trade', name: 'Торговля', group: 'Окна' },
  { id: 'dialog', name: 'Диалог', group: 'Окна' },
];

/** Defaults: the base key list of the GDD («Экраны и визуальный стиль», D193) plus WASD. */
export function defaultBinds(): ControlBinds {
  return {
    moveF: ['KeyW'], moveB: ['KeyS'], moveL: ['KeyA'], moveR: ['KeyD'],
    jump: ['Space'], dodge: ['ShiftLeft'], sprint: ['AltLeft'], walkToggle: ['CapsLock'],
    attack: ['Mouse0'], block: ['Mouse2'], interact: ['KeyE'], weaponSwap: ['Tab'],
    skill1: ['Digit1'], skill2: ['Digit2'], skill3: ['Digit3'], skill4: ['Digit4'], skill5: ['Digit5'], skill6: ['Digit6'],
    potionHp: ['F1'], potionMp: ['F2'], potionSt: ['F3'],
    quickSave: ['F5'], quickLoad: ['F9'],
    map: ['KeyM'], journal: ['KeyJ'], character: ['KeyC'], progress: ['KeyK'], inventory: ['KeyI'], bestiary: ['KeyB'], trade: ['KeyT'], dialog: ['KeyN'],
  };
}

export interface ControlSettings {
  version: number;
  binds: ControlBinds;
  /** Mouse look sensitivity multiplier (0.2 .. 3). */
  sensitivity: number;
  invertY: boolean;
}

export const CONTROLS_KEY = 'cubeborn.controls';
/** 2: the default sprint key moved from Ctrl to Alt (owner's decision); v1 binds with the old default are migrated. */
export const CONTROLS_VERSION = 2;

export function defaultControls(): ControlSettings {
  return { version: CONTROLS_VERSION, binds: defaultBinds(), sensitivity: 1, invertY: false };
}

/** Keys that are never bindable: Esc always opens / closes menus (D211). */
export const RESERVED = new Set(['Escape']);

/** Reads stored controls (anything unreadable falls back to defaults per field). */
export function fixControls(raw: unknown): ControlSettings {
  const d = defaultControls();
  if (!raw || typeof raw !== 'object') return d;
  const r = raw as Partial<ControlSettings> & { binds?: Record<string, unknown> };
  const binds = d.binds;
  if (r.binds && typeof r.binds === 'object')
    for (const k of Object.keys(binds) as ControlAction[]) {
      const v = r.binds[k];
      if (Array.isArray(v)) binds[k] = v.filter((c): c is string => typeof c === 'string' && !RESERVED.has(c)).slice(0, 2);
    }
  // v1 → v2: sprint still on the old default Ctrl moves to Alt (a key the player chose stays)
  if ((r.version ?? 1) < 2 && binds.sprint.length === 1 && binds.sprint[0] === 'ControlLeft') {
    const taken = (Object.keys(binds) as ControlAction[]).some((k) => k !== 'sprint' && binds[k].includes('AltLeft'));
    if (!taken) binds.sprint = ['AltLeft'];
  }
  return {
    version: CONTROLS_VERSION,
    binds,
    sensitivity: typeof r.sensitivity === 'number' && Number.isFinite(r.sensitivity) ? Math.min(3, Math.max(0.2, r.sensitivity)) : d.sensitivity,
    invertY: typeof r.invertY === 'boolean' ? r.invertY : d.invertY,
  };
}

interface KV {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
}

export function loadControls(st: KV | null = typeof localStorage !== 'undefined' ? localStorage : null): ControlSettings {
  try {
    const s = st?.getItem(CONTROLS_KEY);
    return s ? fixControls(JSON.parse(s)) : defaultControls();
  } catch {
    return defaultControls();
  }
}

export function saveControls(c: ControlSettings, st: KV | null = typeof localStorage !== 'undefined' ? localStorage : null): boolean {
  try {
    st?.setItem(CONTROLS_KEY, JSON.stringify(c));
    return true;
  } catch {
    return false;
  }
}

/** The action already using `code` (other than `except`), or null. */
export function conflictOf(b: ControlBinds, code: string, except?: ControlAction): ControlAction | null {
  for (const k of Object.keys(b) as ControlAction[]) if (k !== except && b[k].includes(code)) return k;
  return null;
}

/**
 * Binds `code` as the main key of `action`. With a conflict nothing changes unless `replace` is
 * true; then the other action loses that key (the caller asks the player first, D211).
 * Returns the conflicting action (null when there was none).
 */
export function bind(b: ControlBinds, action: ControlAction, code: string, replace: boolean): { conflict: ControlAction | null; done: boolean } {
  if (RESERVED.has(code)) return { conflict: null, done: false };
  const conflict = conflictOf(b, code, action);
  if (conflict && !replace) return { conflict, done: false };
  if (conflict) b[conflict] = b[conflict].filter((c) => c !== code);
  b[action] = [code, ...b[action].filter((c) => c !== code)].slice(0, 2);
  // a key bound once only: keep only the new main key when the old one was the same
  return { conflict, done: true };
}

export function actionName(a: ControlAction): string {
  return CONTROL_LIST.find((c) => c.id === a)?.name ?? a;
}

/** Readable name of a key or mouse button code. */
export function codeName(code: string | undefined): string {
  if (!code) return '—';
  if (code === 'Mouse0') return 'ЛКМ';
  if (code === 'Mouse1') return 'СКМ';
  if (code === 'Mouse2') return 'ПКМ';
  if (/^Mouse\d$/.test(code)) return 'Мышь ' + code.slice(5);
  if (code.startsWith('Key')) return code.slice(3);
  if (code.startsWith('Digit')) return code.slice(5);
  const map: Record<string, string> = {
    Space: 'Пробел', ShiftLeft: 'Л-Shift', ShiftRight: 'П-Shift', ControlLeft: 'Л-Ctrl', ControlRight: 'П-Ctrl', AltLeft: 'Л-Alt', AltRight: 'П-Alt',
    CapsLock: 'Caps Lock', Tab: 'Tab', Enter: 'Enter', Backspace: 'Backspace', ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→',
    Backquote: '`', Minus: '-', Equal: '=', Comma: ',', Period: '.', Slash: '/', Semicolon: ';', Quote: "'", BracketLeft: '[', BracketRight: ']', Backslash: '\\',
  };
  return map[code] ?? code.replace('Numpad', 'Num ');
}

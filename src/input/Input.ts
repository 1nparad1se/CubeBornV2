import type { BindAction, Keybinds } from '../meta/Save';

/**
 * PC input: the mouse moves the hero (left button) and turns the camera (right button held and
 * dragged); rebindable keys for jump, attack, inventory, map, pause and camera zoom (mouse wheel
 * or keys), plus an optional gamepad for pause and jump. There is no keyboard walking.
 */
export class Input {
  private keys = new Set<string>();
  enabled = false;
  binds: Keybinds;
  onPause: (() => void) | null = null;
  /** +1 zoom out, -1 zoom in. */
  onZoom: ((dir: number) => void) | null = null;
  /** Mouse settings: left/right buttons swapped, wheel zoom direction reversed. */
  swapMouse = false;
  invertWheel = false;
  private btn(b: number): number {
    return this.swapMouse && (b === 0 || b === 2) ? 2 - b : b;
  }
  onInventory: (() => void) | null = null;
  onMap: (() => void) | null = null;
  onJump: (() => void) | null = null;
  /** While set, the next key press is captured for rebinding instead of played. */
  capture: ((code: string) => void) | null = null;
  /** Mouse: position in the game view (px), buttons, and one-shot presses consumed by the client. */
  mx = -1;
  my = -1;
  lmb = false;
  rmb = false;
  lmbPressed = false;
  rmbPressed = false;
  /** Mouse travel (px) while the right button is held, consumed by the client (camera orbit). */
  dragX = 0;
  dragY = 0;
  private padPause = false;
  private padJump = false;

  constructor(area: HTMLElement, binds: Keybinds) {
    this.binds = binds;
    window.addEventListener('keydown', (e) => {
      if (this.capture) {
        e.preventDefault();
        const f = this.capture;
        this.capture = null;
        f(e.code);
        return;
      }
      if (e.code === 'Tab' && this.enabled) e.preventDefault();
      // typing into a text field (character name) never drives the game
      const tg = e.target as HTMLElement | null;
      if (tg && (tg.tagName === 'INPUT' || tg.tagName === 'SELECT' || tg.tagName === 'TEXTAREA')) return;
      if (e.repeat) return;
      // Escape always pauses, whatever the bindings say
      if (e.code === 'Escape' || this.is('pause', e.code)) {
        this.onPause?.();
        return;
      }
      if (this.enabled) {
        if (this.is('zoomIn', e.code)) this.onZoom?.(-1);
        else if (this.is('zoomOut', e.code)) this.onZoom?.(1);
        if (this.is('jump', e.code)) {
          e.preventDefault();
          this.onJump?.();
        }
      }
      if (this.is('inventory', e.code)) this.onInventory?.();
      else if (this.is('map', e.code)) this.onMap?.();
      this.keys.add(e.code);
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    window.addEventListener('blur', () => {
      this.keys.clear();
      this.lmb = this.rmb = false;
    });
    area.addEventListener(
      'wheel',
      (e) => {
        if (!this.enabled) return;
        e.preventDefault();
        if (Math.abs(e.deltaY) > 0.5) this.onZoom?.(Math.sign(e.deltaY) * (this.invertWheel ? -1 : 1));
      },
      { passive: false },
    );
    // no context menu over the game view
    area.addEventListener('contextmenu', (e) => e.preventDefault());
    const pos = (e: PointerEvent) => {
      const r = area.getBoundingClientRect();
      this.mx = e.clientX - r.left;
      this.my = e.clientY - r.top;
    };
    area.addEventListener('pointermove', (e) => {
      pos(e);
      if (this.enabled && this.rmb) {
        this.dragX += e.movementX;
        this.dragY += e.movementY;
      }
    });
    area.addEventListener('pointerdown', (e) => {
      pos(e);
      if (!this.enabled) return;
      const b = this.btn(e.button);
      if (b === 0) {
        this.lmb = true;
        this.lmbPressed = true;
      } else if (b === 2) {
        this.rmb = true;
        this.rmbPressed = true;
      }
      area.setPointerCapture?.(e.pointerId);
    });
    const up = (e: PointerEvent) => {
      const b = this.btn(e.button);
      if (b === 0) this.lmb = false;
      else if (b === 2) this.rmb = false;
    };
    area.addEventListener('pointerup', up);
    area.addEventListener('pointercancel', () => (this.lmb = this.rmb = false));
  }

  private is(action: BindAction, code: string): boolean {
    return this.binds[action]?.includes(code) ?? false;
  }

  held(action: BindAction): boolean {
    for (const c of this.binds[action] ?? []) if (this.keys.has(c)) return true;
    return false;
  }

  /** Polls the gamepad (pause and jump buttons). */
  update() {
    const pads = navigator.getGamepads?.() ?? [];
    for (const gp of pads) {
      if (!gp) continue;
      if (gp.buttons[9]?.pressed && !this.padPause) {
        this.padPause = true;
        if (this.enabled) this.onPause?.();
      } else if (!gp.buttons[9]?.pressed) this.padPause = false;
      // A / Cross jumps
      if (gp.buttons[0]?.pressed && !this.padJump) {
        this.padJump = true;
        if (this.enabled) this.onJump?.();
      } else if (!gp.buttons[0]?.pressed) this.padJump = false;
    }
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    if (!on) {
      this.keys.clear();
      this.lmb = this.rmb = this.lmbPressed = this.rmbPressed = false;
      this.dragX = this.dragY = 0;
    }
  }
}

/** Human-readable key name for a KeyboardEvent.code. */
export function keyName(code: string): string {
  if (!code) return '—';
  if (code.startsWith('Key')) return code.slice(3);
  if (code.startsWith('Digit')) return code.slice(5);
  const map: Record<string, string> = {
    ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→', Escape: 'Esc', Space: 'Space', Equal: '=', Minus: '-',
    NumpadAdd: 'Num +', NumpadSubtract: 'Num -', ShiftLeft: 'L-Shift', ShiftRight: 'R-Shift', ControlLeft: 'L-Ctrl', ControlRight: 'R-Ctrl',
    AltLeft: 'L-Alt', AltRight: 'R-Alt', Tab: 'Tab', Enter: 'Enter', Backquote: '`', Comma: ',', Period: '.', Slash: '/', Semicolon: ';', Quote: "'",
    BracketLeft: '[', BracketRight: ']', Backslash: '\\', CapsLock: 'Caps',
  };
  return map[code] ?? code.replace('Numpad', 'Num ');
}

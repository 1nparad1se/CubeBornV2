import type { ControlAction, ControlBinds } from './controls';

/**
 * Keyboard and mouse of the RPG test scene, the same as the main game (owner's decision): the left
 * button walks / selects / attacks (clicks and the cursor position are read by the scene), the right
 * button held and dragged orbits the camera, bound keys for the rest; and the rules for menus:
 *  - while a menu is open no game presses are recorded (D208: nothing queues up);
 *  - keys and buttons still held when a menu opens or closes are ignored until released and
 *    pressed again (sprint / block need a new press; UI clicks never leak into play).
 */
export class SceneInput {
  binds: ControlBinds;
  /** Physically held codes ("KeyW", "Mouse0", ...). */
  private down = new Set<string>();
  /** Held codes that do not count until released (held across a menu open / close). */
  private suppressed = new Set<string>();
  /** Codes pressed since the last `takePresses`. */
  private presses: string[] = [];
  /** Accumulated mouse look (px), consumed by the scene. */
  lookX = 0;
  lookY = 0;
  /** Wheel steps (+1 out, -1 in), consumed by the scene. */
  wheel = 0;
  /** Gameplay input is live (no menu, scene running). */
  live = false;
  /** Scene is active at all (listeners ignore everything otherwise). */
  active = false;
  /** Cursor position in the view (px), -1 when outside. */
  mx = -1;
  my = -1;
  private clicks = 0;
  /** While set, the next key or mouse press is handed over for rebinding. */
  capture: ((code: string) => void) | null = null;
  /** Keys handled even while menus are open (Esc and window hotkeys). */
  onMenuKey: ((code: string) => void) | null = null;
  private offs: (() => void)[] = [];

  constructor(private area: HTMLElement, binds: ControlBinds) {
    this.binds = binds;
    const on = <K extends keyof WindowEventMap>(tg: Window | HTMLElement | Document, ev: K | string, fn: (e: any) => void, opt?: AddEventListenerOptions) => {
      tg.addEventListener(ev, fn, opt);
      this.offs.push(() => tg.removeEventListener(ev, fn, opt));
    };
    on(window, 'keydown', (e: KeyboardEvent) => {
      if (!this.active) return;
      const tg = e.target as HTMLElement | null;
      if (tg && (tg.tagName === 'INPUT' || tg.tagName === 'TEXTAREA' || tg.tagName === 'SELECT')) return;
      if (this.capture && e.code !== 'Escape') {
        e.preventDefault();
        const f = this.capture;
        this.capture = null;
        f(e.code);
        return;
      }
      // keep browser shortcuts (F1 help, F5 reload, Tab focus, Space scroll, Ctrl+key) out of play;
      // F11 / F12 stay with the browser
      if (e.code !== 'F11' && e.code !== 'F12') e.preventDefault();
      if (e.repeat) return;
      this.down.add(e.code);
      if (e.code === 'Escape') {
        this.onMenuKey?.(e.code);
        return;
      }
      if (this.live) this.presses.push(e.code);
      else this.onMenuKey?.(e.code);
    });
    on(window, 'keyup', (e: KeyboardEvent) => {
      // Alt is the default sprint key: stop the browser from focusing its menu bar on Alt release
      if (this.active && (e.code === 'AltLeft' || e.code === 'AltRight')) e.preventDefault();
      this.down.delete(e.code);
      this.suppressed.delete(e.code);
      // Caps Lock on macOS sends keyup instead of a second keydown: count it as a press
      if (e.code === 'CapsLock' && this.active && this.live && /Mac/.test(navigator.platform)) this.presses.push(e.code);
    });
    on(window, 'blur', () => this.clearHeld());
    // mouse like the main game: left button walks / selects / attacks (the scene reads the clicks),
    // the right button held and dragged orbits the camera; no Pointer Lock
    on(area, 'contextmenu', (e: MouseEvent) => e.preventDefault());
    on(area, 'mousedown', (e: MouseEvent) => {
      if (!this.active) return;
      const code = 'Mouse' + e.button;
      if (this.capture) {
        e.preventDefault();
        return;
      }
      this.track(e);
      this.down.add(code);
      if (!this.live) return;
      if (e.button === 0) this.clicks++;
      this.presses.push(code);
    });
    on(window, 'mouseup', (e: MouseEvent) => {
      const code = 'Mouse' + e.button;
      this.down.delete(code);
      this.suppressed.delete(code);
    });
    on(window, 'mousemove', (e: MouseEvent) => {
      if (!this.active) return;
      this.track(e);
      if (this.live && this.down.has('Mouse2')) {
        this.lookX += e.movementX || 0;
        this.lookY += e.movementY || 0;
      }
    });
    on(area, 'mouseleave', () => {
      this.mx = this.my = -1;
    });
    on(
      area,
      'wheel',
      (e: WheelEvent) => {
        if (!this.active || !this.live) return;
        e.preventDefault();
        if (Math.abs(e.deltaY) > 0.5) this.wheel += Math.sign(e.deltaY);
      },
      { passive: false },
    );
  }

  private track(e: MouseEvent) {
    const r = this.area.getBoundingClientRect();
    this.mx = e.clientX - r.left;
    this.my = e.clientY - r.top;
  }

  /** Left button held (and not held across a menu). */
  get lmb(): boolean {
    return this.codeHeld('Mouse0');
  }

  /** Left clicks since the last call. */
  takeClicks(): number {
    const n = this.clicks;
    this.clicks = 0;
    return n;
  }

  /** A menu opened or closed: drop queued presses and ignore what is held until it is released. */
  freeze() {
    this.presses.length = 0;
    this.clicks = 0;
    this.lookX = this.lookY = 0;
    this.wheel = 0;
    this.suppressed = new Set(this.down);
  }

  clearHeld() {
    this.down.clear();
    this.suppressed.clear();
    this.presses.length = 0;
  }

  private codeHeld(c: string): boolean {
    return this.down.has(c) && !this.suppressed.has(c);
  }

  held(a: ControlAction): boolean {
    for (const c of this.binds[a] ?? []) if (this.codeHeld(c)) return true;
    return false;
  }

  /** Presses since the last call, as actions (a code bound to several actions yields each). */
  takePresses(): Set<ControlAction> {
    const out = new Set<ControlAction>();
    for (const code of this.presses)
      for (const a of Object.keys(this.binds) as ControlAction[]) if (this.binds[a].includes(code)) out.add(a);
    this.presses.length = 0;
    return out;
  }

  /** The bound action for a key code (menus use it for window hotkeys). */
  actionOf(code: string): ControlAction | null {
    for (const a of Object.keys(this.binds) as ControlAction[]) if (this.binds[a].includes(code)) return a;
    return null;
  }

  dispose() {
    for (const f of this.offs) f();
    this.offs.length = 0;
  }
}

/**
 * D026 / D208: the central world pause. Every full-screen menu registers itself here while it is
 * open; the world, all game timers, regeneration, cooldowns and the clock stand still while any
 * menu is open. Menus stack: closing the top one does not resume the world while another stays.
 */
export class PauseManager {
  private stack: string[] = [];
  /** Called when the world stops (first menu opened) and when it resumes (last menu closed). */
  onPause: (() => void) | null = null;
  onResume: (() => void) | null = null;

  get paused(): boolean {
    return this.stack.length > 0;
  }

  /** Open menus, bottom to top. */
  get menus(): readonly string[] {
    return this.stack;
  }

  get top(): string | null {
    return this.stack.length ? this.stack[this.stack.length - 1] : null;
  }

  isOpen(id: string): boolean {
    return this.stack.includes(id);
  }

  /** Opens a menu on top (an already open one moves to the top). */
  open(id: string) {
    const was = this.paused;
    const i = this.stack.indexOf(id);
    if (i >= 0) this.stack.splice(i, 1);
    this.stack.push(id);
    if (!was) this.onPause?.();
  }

  /** Closes one menu (anywhere in the stack). */
  close(id: string) {
    const i = this.stack.indexOf(id);
    if (i < 0) return;
    this.stack.splice(i, 1);
    if (!this.paused) this.onResume?.();
  }

  /** Closes the top menu; returns its id (null when none was open). */
  closeTop(): string | null {
    const id = this.top;
    if (id) this.close(id);
    return id;
  }

  closeAll() {
    if (!this.stack.length) return;
    this.stack.length = 0;
    this.onResume?.();
  }

  /** Seconds of world time for a frame of `dt` real seconds: none while paused. */
  worldDt(dt: number): number {
    return this.paused ? 0 : dt;
  }
}

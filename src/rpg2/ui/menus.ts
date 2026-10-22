import '../../ui/theme.css';
import './rpg2.css';
import { h } from '../../ui/dom';
import type { PauseManager } from '../pause';

/** Windows drawn as a centred framed column instead of a full screen. */
const COMPACT = new Set(['pause', 'entry', 'death', 'confirm', 'loadError']);

/**
 * Full-screen windows of the RPG test scene. Every window goes through the PauseManager (D026):
 * opening one pauses the world, windows stack, and Esc closes only the top one (D211); a
 * confirmation closed with Esc counts as «Отмена». Windows drawn elsewhere (the inventory and the
 * world map of the main game) register with `attach` and are closed through their own callback.
 */
export class SceneMenus {
  private layers = new Map<string, { el: HTMLElement | null; onClose: (() => void) | null }>();

  constructor(private parent: HTMLElement, private pause: PauseManager) {}

  isOpen(id: string): boolean {
    return this.layers.has(id);
  }

  /**
   * Opens (or rebuilds) a window drawn here, in the screen layout of the owner's mockups
   * (docs/references/hud): most windows fill the screen — back button, the window's first heading
   * as a big title, the CUBEBORN mark, the framed body, «Esc — Назад» and «Мир на паузе» below;
   * the pause, entry, death and confirmation windows stay a centred framed column (hud-05).
   */
  show(id: string, body: HTMLElement, onClose: (() => void) | null = null) {
    const old = this.layers.get(id);
    old?.el?.remove();
    const compact = COMPACT.has(id);
    const win = h('div.r2-win.r2-panel', body);
    let el: HTMLElement;
    if (compact) {
      el = h('div.r2.r2-menu.r2-compact.r2-menu-' + id, h('div.cb-logo.small.r2-cornerlogo', 'CUBEBORN'), win);
    } else {
      const title = body.querySelector('h1');
      const head = h('div.r2-head', h('button.cb-back', { title: 'Esc — Назад', onclick: () => this.close(id) }), title ? h('h1.cb-title', title.textContent ?? '') : null, h('div.cb-logo.small.r2-headlogo', 'CUBEBORN'));
      title?.remove();
      el = h(
        'div.r2.r2-menu.r2-screen.r2-menu-' + id,
        head,
        win,
        h('div.r2-foot', h('button.r2-escback', { onclick: () => this.close(id) }, h('kbd', 'Esc'), ' — Назад'), h('span.cb-paused', 'Мир на паузе')),
      );
    }
    this.parent.appendChild(el);
    this.layers.set(id, { el, onClose });
    this.pause.open(id);
  }

  /** Registers a window drawn by someone else (its close callback hides it). */
  attach(id: string, onClose: () => void) {
    this.layers.set(id, { el: null, onClose });
    this.pause.open(id);
  }

  close(id: string) {
    const l = this.layers.get(id);
    if (!l) return;
    this.layers.delete(id);
    l.el?.remove();
    this.pause.close(id);
    l.onClose?.();
  }

  /** Esc: closes the top window; returns false when none is open. */
  closeTop(): boolean {
    const id = this.pause.top;
    if (!id) return false;
    this.close(id);
    return true;
  }

  closeAll() {
    for (const id of [...this.pause.menus].reverse()) this.close(id);
  }

  /** A confirmation on top of everything; Esc or «Отмена» cancels. */
  confirm(text: string, yes: () => void, yesLabel = 'Да', noLabel = 'Отмена', no?: () => void) {
    const id = 'confirm';
    if (this.isOpen(id)) this.close(id);
    let answered = false;
    const body = h(
      'div',
      h('h1', 'Подтверждение'),
      h('div.r2-rule'),
      h('p', text),
      h(
        'div',
        h('button.r2-btn.small.primary', {
          onclick: () => {
            answered = true;
            this.close(id);
            yes();
          },
        }, yesLabel),
        h('button.r2-btn.small', { onclick: () => this.close(id) }, noLabel),
      ),
    );
    this.show(id, body, () => {
      if (!answered) no?.();
    });
    this.layers.get(id)!.el!.classList.add('r2-confirm');
  }
}

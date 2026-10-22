import { SaveError, TEST_SAVE_KEY, migratePlaythrough, type PlaythroughSave } from './save';

/**
 * Stage 6 save slots (D040–D047, D202, D213). Every playthrough has its own world and history:
 * one start record (never evicted), the last 3 periodic, 3 event and 1 exit autosaves, the last 3
 * quicksaves and unlimited named manual saves. Each record body lives under its own key; the index
 * changes only after the body was written, read back and checked, so a failed write never destroys
 * a working record (D202). Settings (controls) live elsewhere and are global (D211).
 */
export type RecordKind = 'start' | 'auto' | 'event' | 'exit' | 'quick' | 'manual';
export const KIND_NAME: Record<RecordKind, string> = {
  start: 'Начало прохождения',
  auto: 'Автосохранение',
  event: 'Событие',
  exit: 'Выход',
  quick: 'Быстрое',
  manual: 'Ручное',
};
/** Queue sizes (D043 / D044); manual and start are not queues. */
export const QUEUE: Partial<Record<RecordKind, number>> = { auto: 3, event: 3, exit: 1, quick: 3 };

export interface RecordMeta {
  key: string;
  kind: RecordKind;
  name: string;
  /** Real creation time (ms) and a strictly increasing sequence for ties (D046: freshness by creation). */
  savedAt: number;
  seq: number;
  level: number;
  day: number;
  minutes: number;
  /** Why it was made (event records), shown in the list. */
  note?: string;
}
export interface PlaythroughMeta {
  id: string;
  name: string;
  /** 'normal': the approved start; 'test' / 'high': dev test profiles (kept apart, D214). */
  profile: 'normal' | 'test' | 'high';
  created: number;
  records: RecordMeta[];
}
export interface SlotIndex {
  version: 1;
  /** The last opened playthrough (D046). */
  last: string | null;
  seq: number;
  playthroughs: PlaythroughMeta[];
}

export const INDEX_KEY = 'cubeborn.rpg2.index';
const REC_PREFIX = 'cubeborn.rpg2.rec.';
/** Save thumbnails live beside the records under their own keys, so the record format stays the same. */
const THUMB_PREFIX = 'cubeborn.rpg2.thumb.';

export interface KV {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
  removeItem(k: string): void;
}

export class SlotStore {
  constructor(private st: KV = localStorage) {}

  private emptyIndex(): SlotIndex {
    return { version: 1, last: null, seq: 0, playthroughs: [] };
  }

  /** The index; a stage 1–5 single record is imported once as its own playthrough (kept as a backup). */
  index(): SlotIndex {
    let text: string | null = null;
    try {
      text = this.st.getItem(INDEX_KEY);
    } catch {
      throw new SaveError('Хранилище браузера недоступно');
    }
    if (text) {
      try {
        const ix = JSON.parse(text) as SlotIndex;
        if (ix && ix.version === 1 && Array.isArray(ix.playthroughs)) return ix;
      } catch {
        /* fall through */
      }
      throw new SaveError('Список сохранений повреждён');
    }
    const ix = this.emptyIndex();
    const old = this.st.getItem(TEST_SAVE_KEY);
    if (old) {
      // the old record stays under its own key as the backup; a copy becomes a manual record
      let raw: any = null;
      try {
        raw = JSON.parse(old);
      } catch {
        /* imported below as-is: loading it shows the reason */
      }
      const id = 'p' + Date.now().toString(36);
      const key = REC_PREFIX + id + '.import';
      this.st.setItem(key, old);
      ix.seq = 1;
      ix.playthroughs.push({
        id, name: 'Прохождение из прежней версии', profile: 'normal', created: Date.now(),
        records: [{ key, kind: 'manual', name: 'Перенесено из прежней версии', savedAt: Number(raw?.savedAt) || Date.now(), seq: 1, level: Number(raw?.hero?.progress?.level) || 1, day: Number(raw?.clock?.days) || 0, minutes: Number(raw?.clock?.minutes) || 0 }],
      });
      ix.last = id;
    }
    this.writeIndex(ix);
    return ix;
  }

  private writeIndex(ix: SlotIndex): boolean {
    const text = JSON.stringify(ix);
    try {
      this.st.setItem(INDEX_KEY + '.tmp', text);
      if (this.st.getItem(INDEX_KEY + '.tmp') !== text) return false;
      this.st.setItem(INDEX_KEY, text);
      this.st.removeItem(INDEX_KEY + '.tmp');
      return true;
    } catch {
      return false;
    }
  }

  playthrough(id: string): PlaythroughMeta | null {
    return this.index().playthroughs.find((p) => p.id === id) ?? null;
  }

  createPlaythrough(name: string, profile: PlaythroughMeta['profile']): PlaythroughMeta {
    const ix = this.index();
    const p: PlaythroughMeta = { id: 'p' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36), name, profile, created: Date.now(), records: [] };
    ix.playthroughs.push(p);
    ix.last = p.id;
    if (!this.writeIndex(ix)) throw new SaveError('Не удалось записать список сохранений');
    return p;
  }

  setLast(id: string) {
    const ix = this.index();
    if (ix.last === id) return;
    ix.last = id;
    this.writeIndex(ix);
  }

  markProfile(id: string, profile: 'test' | 'high') {
    const ix = this.index();
    const p = ix.playthroughs.find((x) => x.id === id);
    if (!p || p.profile !== 'normal') return;
    p.profile = profile;
    this.writeIndex(ix);
  }

  deletePlaythrough(id: string) {
    const ix = this.index();
    const p = ix.playthroughs.find((x) => x.id === id);
    if (!p) return;
    ix.playthroughs = ix.playthroughs.filter((x) => x.id !== id);
    if (ix.last === id) ix.last = null;
    if (this.writeIndex(ix)) for (const r of p.records) this.drop(r.key);
  }

  /** Records of a playthrough, newest first. */
  records(id: string): RecordMeta[] {
    return [...(this.playthrough(id)?.records ?? [])].sort((a, b) => b.seq - a.seq);
  }
  latest(id: string, kind?: RecordKind): RecordMeta | null {
    return this.records(id).find((r) => !kind || r.kind === kind) ?? null;
  }
  /** D046: the newest record of the last opened playthrough (never another playthrough's). */
  continueTarget(): { pt: PlaythroughMeta; rec: RecordMeta } | null {
    const ix = this.index();
    const pt = ix.playthroughs.find((p) => p.id === ix.last);
    if (!pt) return null;
    const rec = this.latest(pt.id);
    return rec ? { pt, rec } : null;
  }

  /**
   * Writes several records of one playthrough from ONE snapshot (D213: a periodic and an event
   * record at the same moment are two records in their own queues). `replace` overwrites a manual
   * record (the caller confirmed). Returns the new metas, or a Russian reason.
   */
  write(id: string, s: PlaythroughSave, kinds: { kind: RecordKind; name?: string; note?: string; replace?: string }[]): RecordMeta[] | string {
    const text = JSON.stringify(s);
    try {
      migratePlaythrough(JSON.parse(text));
    } catch (e) {
      return `Снимок не прошёл проверку: ${(e as Error).message}`;
    }
    let ix: SlotIndex;
    try {
      ix = this.index();
    } catch (e) {
      return (e as Error).message;
    }
    const pt = ix.playthroughs.find((p) => p.id === id);
    if (!pt) return 'Прохождение не найдено';
    const made: RecordMeta[] = [];
    const drop: string[] = [];
    for (const k of kinds) {
      const seq = ++ix.seq;
      const key = `${REC_PREFIX}${id}.${seq}`;
      try {
        this.st.setItem(key, text);
        if (this.st.getItem(key) !== text) throw new Error('verify');
      } catch {
        for (const m of made) this.st.removeItem(m.key);
        try {
          this.st.removeItem(key);
        } catch {
          /* nothing */
        }
        return 'Не удалось записать сохранение: браузер отказал в хранилище. Прежние записи целы.';
      }
      const meta: RecordMeta = { key, kind: k.kind, name: k.name ?? KIND_NAME[k.kind], savedAt: Date.now(), seq, level: s.hero.progress.level, day: s.clock.days, minutes: s.clock.minutes, note: k.note };
      made.push(meta);
      if (k.replace) {
        const old = pt.records.find((r) => r.key === k.replace && r.kind === 'manual');
        if (old) {
          pt.records = pt.records.filter((r) => r !== old);
          drop.push(old.key);
        }
      }
      pt.records.push(meta);
      const cap = QUEUE[k.kind];
      if (cap) {
        const same = pt.records.filter((r) => r.kind === k.kind).sort((a, b) => a.seq - b.seq);
        while (same.length > cap) {
          const ev = same.shift()!;
          pt.records = pt.records.filter((r) => r !== ev);
          drop.push(ev.key);
        }
      }
    }
    ix.last = id;
    if (!this.writeIndex(ix)) {
      for (const m of made) this.st.removeItem(m.key);
      return 'Не удалось записать список сохранений. Прежние записи целы.';
    }
    for (const k of drop) this.drop(k);
    return made;
  }

  deleteRecord(id: string, key: string): boolean {
    const ix = this.index();
    const pt = ix.playthroughs.find((p) => p.id === id);
    if (!pt) return false;
    const r = pt.records.find((x) => x.key === key);
    if (!r || r.kind !== 'manual') return false;
    pt.records = pt.records.filter((x) => x !== r);
    if (!this.writeIndex(ix)) return false;
    this.drop(key);
    return true;
  }

  private drop(key: string) {
    this.st.removeItem(key);
    this.st.removeItem(THUMB_PREFIX + key);
  }

  /** Stores a record's thumbnail (a small JPEG data URL); a full storage just skips it. */
  setThumb(key: string, url: string) {
    try {
      this.st.setItem(THUMB_PREFIX + key, url);
    } catch {
      /* thumbnails are optional */
    }
  }

  thumb(key: string): string | null {
    try {
      return this.st.getItem(THUMB_PREFIX + key);
    } catch {
      return null;
    }
  }

  /** Reads a record (D202: a reason on error; a compatible older version is upgraded with a backup). */
  read(key: string): PlaythroughSave {
    let text: string | null;
    try {
      text = this.st.getItem(key);
    } catch {
      throw new SaveError('Хранилище браузера недоступно');
    }
    if (!text) throw new SaveError('Запись не найдена в хранилище');
    let raw: any;
    try {
      raw = JSON.parse(text);
    } catch {
      throw new SaveError('Файл сохранения повреждён');
    }
    const { save, migrated } = migratePlaythrough(raw);
    if (migrated) {
      try {
        const bk = `${key}.backup.v${raw.version}`;
        if (this.st.getItem(bk) === null) this.st.setItem(bk, text);
        this.st.setItem(key, JSON.stringify(save));
      } catch {
        /* the upgraded record still loads */
      }
    }
    return save;
  }
}

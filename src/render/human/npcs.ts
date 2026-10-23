import { HumanModel, type CharacterLook } from './HumanModel';

/**
 * NPCs on the hero's model: the same skeleton and animation, told apart by their clothes (part
 * colours and worn armour pieces), hair, build and the weapon they carry. One entry per role.
 */
const T = (r: number, g: number, b: number): [number, number, number] => [r, g, b];

export interface NpcLook {
  look: CharacterLook;
  /** Weapon carried (on the back, the staff in hand). */
  main?: string;
}

export const NPC_LOOKS: Record<string, NpcLook> = {
  // mentors of the test scene
  arden: { look: { tint: { shirt: T(0.85, 0.42, 0.36), hair: T(2.2, 2.2, 2.3), trousers: T(0.8, 0.8, 0.85) }, wear: [{ set: 'guard', slots: ['body', 'feet', 'hands'] }], width: 1.08 }, main: 'sword_guard2h' },
  hira: { look: { tint: { shirt: T(0.7, 0.95, 0.65), hair: T(0.5, 0.45, 0.4), trousers: T(0.75, 0.95, 0.7) }, wear: [{ set: 'scout', slots: ['body', 'hands', 'feet'] }] }, main: 'bow_hunter' },
  mira: { look: { tint: { hair: T(3.6, 3.2, 2.2), skin: T(1.05, 1.02, 1.0) }, wear: [{ set: 'apprentice', slots: ['body', 'feet', 'head'] }], height: 0.97, width: 0.95 }, main: 'staff_spark' },
  // villagers of the story scene
  lada: { look: { tint: { shirt: T(0.9, 0.6, 0.7), hair: T(3.4, 2.6, 1.6), trousers: T(0.65, 0.5, 0.75), boots: T(0.8, 0.7, 0.7) }, height: 0.95, width: 0.94 } },
  oren: { look: { tint: { shirt: T(1.05, 1.0, 0.75), hair: T(1.6, 1.6, 1.65), trousers: T(0.7, 0.75, 0.9) }, height: 1.02 } },
  // merchants of the economy scene
  smith: { look: { tint: { shirt: T(0.55, 0.55, 0.6), hair: T(0.4, 0.38, 0.36), trousers: T(0.6, 0.6, 0.65) }, wear: [{ set: 'scout', slots: ['body', 'hands'] }], width: 1.14, height: 1.02 } },
  alchemist: { look: { tint: { hair: T(2.4, 2.4, 2.5) }, wear: [{ set: 'apprentice', slots: ['body'] }], height: 0.98 }, main: 'staff_apprentice' },
  cook: { look: { tint: { shirt: T(1.18, 1.18, 1.15), trousers: T(0.85, 0.85, 0.9), hair: T(2.8, 1.8, 1.0) }, width: 1.1 } },
  hunter: { look: { tint: { shirt: T(0.7, 0.75, 0.55), hair: T(0.9, 0.7, 0.55) }, wear: [{ set: 'scout', slots: ['head', 'body', 'feet'] }] }, main: 'bow_hunter' },
  supplier: { look: { tint: { shirt: T(0.95, 0.85, 0.55), trousers: T(0.7, 0.65, 0.5), hair: T(1.2, 0.9, 0.7) }, width: 1.04 } },
};

/**
 * An NPC figure that animates itself while it is drawn: idle breathing and a slow look around,
 * the weapon put away (the staff held). Faces +z; turn `root` to face elsewhere.
 */
export function npcModel(id: string, shadows = true): HumanModel {
  const def = NPC_LOOKS[id] ?? { look: {} };
  const m = new HumanModel('human', shadows, def.look);
  m.setEquip({ main: def.main ?? null, off: null, head: null, hands: null, feet: null, body: null });
  const t0 = Math.random() * 10;
  let last = -1;
  const mesh = m.root.getObjectByProperty('isSkinnedMesh', true);
  if (mesh)
    mesh.onBeforeRender = () => {
      const now = performance.now() / 1000;
      if (now - last < 1 / 70) return;
      last = now;
      m.pose({ walk: 0, moving: 0, airborne: false, vy: 0, attack: null, time: now + t0, move: { x: 0, z: 0 }, combat: false });
    };
  m.pose({ walk: 0, moving: 0, airborne: false, vy: 0, attack: null, time: t0, move: { x: 0, z: 0 }, combat: false });
  return m;
}

import * as THREE from 'three';
import { HumanModel, type HumanPose } from '../../src/render/human/HumanModel';
import { npcModel } from '../../src/render/human/npcs';

/**
 * Pose lab (development only, `npm run dev` → /tools/poselab/): one character on a grid with a
 * fixed camera, driven from the console or a browser script through `window.lab`, for close-up
 * checks of the walk, jumps, the salto and every weapon stance and attack. Not part of the build.
 */
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x3a4250);
scene.add(new THREE.HemisphereLight(0xdde8ff, 0x50483c, 1.6));
const sun = new THREE.DirectionalLight(0xffffff, 2.2);
sun.position.set(3, 6, 4);
scene.add(sun);
const grid = new THREE.GridHelper(20, 20, 0x8090a0, 0x5a6270);
scene.add(grid);
const camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight, 0.1, 100);

let model: HumanModel = new HumanModel('human', false);
scene.add(model.root);

const base = (): HumanPose => ({ walk: 0, moving: 0, airborne: false, vy: 0, attack: null, time: 0, move: { x: 0, z: 0 }, combat: false });

const lab = {
  THREE,
  scene,
  get model() {
    return model;
  },
  /** New hero (or NPC by id) with a weapon id (e.g. 'sword1' items or 'vox:sword_01'). */
  make(weapon: string | null = null, npc?: string) {
    scene.remove(model.root);
    model.dispose();
    model = npc ? npcModel(npc, false) : new HumanModel('human', false);
    if (!npc) model.setEquip({ main: weapon, off: null, head: null, hands: null, feet: null, body: null });
    scene.add(model.root);
  },
  /** Camera at a yaw (deg, 0 = in front of the hero), distance, height, looking at `ty`. */
  cam(yawDeg = 30, dist = 4, h = 1.2, ty = 1.0) {
    const a = (yawDeg * Math.PI) / 180;
    const p = model.root.position;
    camera.position.set(p.x + Math.sin(a) * dist, p.y + h, p.z + Math.cos(a) * dist);
    camera.lookAt(p.x, p.y + ty, p.z);
  },
  /** Runs poses from t0 to t1 at 60 fps (the model smooths between frames), then renders. */
  play(f: (t: number) => Partial<HumanPose> & { y?: number }, t0: number, t1: number) {
    for (let t = t0; t <= t1 + 1e-9; t += 1 / 60) {
      const p = { ...base(), ...f(t), time: t };
      if (p.y !== undefined) model.root.position.y = p.y;
      model.pose(p);
    }
    renderer.render(scene, camera);
  },
  render() {
    renderer.render(scene, camera);
  },
};
(window as unknown as { lab: typeof lab }).lab = lab;
lab.cam();
lab.play(() => ({}), 0, 0.1);

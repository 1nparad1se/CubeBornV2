import * as THREE from 'three';
import { HumanModel } from '../../render/human/HumanModel';
import type { Slot } from '../../rpg/items';
import { ENEMY_BY_ID } from '../combat/data';
import { humanModel, wolfModel } from '../combat/view';

/**
 * A still picture of the hero's cubic model in its current gear (inventory and character windows,
 * mockups hud-08 / hud-09): the same HumanModel the world draws, rendered once into a small
 * offscreen canvas and kept as an image per gear set. No pose animation, a three-quarter view.
 */
let renderer: THREE.WebGLRenderer | null = null;
let failed = false;
const cache = new Map<string, string>();

export function heroFigure(equip: Record<Slot, string | null>, w = 300, hgt = 400): HTMLElement {
  const key = `${w}x${hgt}:` + JSON.stringify(equip);
  let url = cache.get(key);
  if (!url && !failed) {
    try {
      url = render(equip, w, hgt);
      cache.set(key, url);
    } catch {
      failed = true;
    }
  }
  const box = document.createElement('div');
  box.className = 'r2-figure';
  if (url) {
    const img = new Image();
    img.src = url;
    img.alt = 'Герой';
    img.width = w;
    img.height = hgt;
    box.appendChild(img);
  }
  return box;
}

function render(equip: Record<Slot, string | null>, w: number, hgt: number): string {
  if (!renderer) {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(1);
  }
  renderer.setSize(w, hgt, false);
  const scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xffffff, 1.6));
  const sun = new THREE.DirectionalLight(0xfff2dd, 2.2);
  sun.position.set(2, 3, 4);
  scene.add(sun);
  const model = new HumanModel('human', false);
  model.setEquip(equip);
  model.pose({ walk: 0, moving: 0, airborne: false, vy: 0, attack: null, time: 0 });
  model.body.rotation.y = 0.45;
  scene.add(model.root);
  const cam = new THREE.PerspectiveCamera(24, w / hgt, 0.1, 50);
  cam.position.set(0, 1.25, 5.4);
  cam.lookAt(0, 0.95, 0);
  renderer.render(scene, cam);
  const url = renderer.domElement.toDataURL('image/png');
  model.dispose();
  return url;
}

/**
 * A still picture of an enemy's cubic model (bestiary, mockup hud-17): the same wolf / humanoid
 * builders the combat view uses, on a small block of grass, three-quarter view.
 */
export function creatureFigure(id: string, w = 520, hgt = 360): HTMLElement {
  const key = `c:${id}:${w}x${hgt}`;
  let url = cache.get(key);
  if (!url && !failed) {
    try {
      url = renderCreature(id, w, hgt);
      cache.set(key, url);
    } catch {
      failed = true;
    }
  }
  const box = document.createElement('div');
  box.className = 'r2-figure r2-creature';
  if (url) {
    const img = new Image();
    img.src = url;
    img.alt = id;
    box.appendChild(img);
  }
  return box;
}

function renderCreature(id: string, w: number, hgt: number): string {
  const d = ENEMY_BY_ID[id];
  if (!d) throw new Error('no enemy');
  if (!renderer) {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(1);
  }
  renderer.setSize(w, hgt, false);
  const scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xffffff, 1.5));
  const sun = new THREE.DirectionalLight(0xfff2dd, 2.4);
  sun.position.set(3, 4, 3);
  scene.add(sun);
  const m = d.model === 'human' ? humanModel(d.color, 1) : wolfModel(d.color, 1, 7 + d.hp);
  m.root.rotation.y = d.model === 'human' ? 0.5 : 1.0;
  scene.add(m.root);
  // a block of grass and dirt under the creature
  const grass = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.18, 1.6), new THREE.MeshLambertMaterial({ color: 0x4f9a3a }));
  grass.position.y = -0.09;
  const dirt = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.4, 1.6), new THREE.MeshLambertMaterial({ color: 0x6b4a2c }));
  dirt.position.y = -0.38;
  scene.add(grass, dirt);
  const tall = d.model === 'human' ? 1.9 : 1.1;
  const cam = new THREE.PerspectiveCamera(30, w / hgt, 0.1, 50);
  cam.position.set(0, tall * 0.9 + 0.4, tall * 2.4 + 1.2);
  cam.lookAt(0, tall * 0.42, 0);
  renderer.render(scene, cam);
  const url = renderer.domElement.toDataURL('image/png');
  scene.traverse((o) => {
    const me = o as THREE.Mesh;
    if (me.isMesh) {
      me.geometry.dispose();
      const mat = me.material as THREE.MeshLambertMaterial;
      mat.map?.dispose();
      mat.dispose();
    }
  });
  return url;
}

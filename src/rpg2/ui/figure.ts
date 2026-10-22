import * as THREE from 'three';
import { HumanModel } from '../../render/human/HumanModel';
import type { Slot } from '../../rpg/items';

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

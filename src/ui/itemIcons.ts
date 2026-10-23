import * as THREE from 'three';
import { item } from '../rpg/items';
import { itemMaterial, shieldModel, weaponModel } from '../render/human/itemMeshes';
import { armorParts } from '../render/human/figure';
import { PX } from '../render/human/skinAtlas';

/**
 * Inventory icons drawn from the very 3D models the hero carries (weapons, shield, armour
 * pieces), rendered once into a small offscreen canvas and cached as images.
 */
const RES = 128;
let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let failed = false;

function setup(): boolean {
  if (renderer) return true;
  if (failed) return false;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(RES, RES, false);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xfff4e0, 0x404858, 1.6));
    const sun = new THREE.DirectionalLight(0xffffff, 2.2);
    sun.position.set(2, 3, 4);
    scene.add(sun);
    return true;
  } catch {
    failed = true;
    return false;
  }
}

/** The object shown for an item, oriented for a 3/4 icon view (camera looks down −Z). */
function iconObject(id: string): { obj: THREE.Object3D; dispose(): void } | null {
  const def = item(id);
  if (!def) return null;
  const k = def.weapon?.kind;
  if (k) {
    const w = weaponModel(k);
    const g = new THREE.Group();
    g.add(w.root);
    if (k === 'bow') {
      w.root.rotation.set(0, -Math.PI / 2 + 0.25, -Math.PI / 4);
    } else if (k === 'crossbow') {
      w.root.rotation.set(-Math.PI / 2 + 0.6, 0.3, -Math.PI / 4, 'ZYX');
    } else {
      // diagonal, blade up-right, flat side toward the viewer
      w.root.rotation.set(0, Math.PI / 2 - 0.35, -Math.PI / 4);
    }
    return { obj: g, dispose: w.dispose };
  }
  if (def.slot === 'off') {
    const s = shieldModel();
    s.root.rotation.set(-0.15, 0.35, 0);
    return { obj: s.root, dispose: s.dispose };
  }
  if (def.armorSet) {
    const g = new THREE.Group();
    const parts = armorParts(def.slot, def.armorSet, PX);
    const offs: Record<string, [number, number, number]> = { armR: [-0.32, 0, 0], armL: [0.32, 0, 0], legR: [-0.13, 0, 0], legL: [0.13, 0, 0] };
    for (const { part, geo } of parts) {
      const m = new THREE.Mesh(geo, itemMaterial());
      const o = offs[part] ?? [0, 0, 0];
      m.position.set(o[0], o[1], o[2]);
      g.add(m);
    }
    g.rotation.set(0.2, -0.45, 0);
    return { obj: g, dispose: () => parts.forEach((p) => p.geo.dispose()) };
  }
  return null;
}

function render(id: string): string {
  if (!setup()) return '';
  const it = iconObject(id);
  if (!it) return '';
  const pivot = new THREE.Group();
  pivot.add(it.obj);
  scene!.add(pivot);
  pivot.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(pivot);
  const c = box.getCenter(new THREE.Vector3());
  const sz = box.getSize(new THREE.Vector3());
  const half = Math.max(sz.x, sz.y) * 0.56 || 1;
  const cam = new THREE.OrthographicCamera(-half, half, half, -half, 0.01, 100);
  cam.position.set(c.x, c.y, c.z + 10);
  cam.lookAt(c);
  renderer!.render(scene!, cam);
  const url = renderer!.domElement.toDataURL();
  scene!.remove(pivot);
  it.dispose();
  return url;
}

const cache = new Map<string, string>();

/** An <img> of the item icon, `size` in CSS pixels. */
export function itemIcon(id: string, _scale = 3, size = 40): HTMLElement {
  let url = cache.get(id);
  if (url === undefined) {
    url = render(id);
    cache.set(id, url);
  }
  const img = document.createElement('img');
  img.className = 'item-icon';
  img.src = url;
  img.alt = item(id)?.name ?? '';
  img.draggable = false;
  img.style.width = img.style.height = size + 'px';
  return img;
}

import * as THREE from 'three';

/** Limits of the camera's downward tilt (degrees from the horizontal). */
export const PITCH_MIN = 25;
export const PITCH_MAX = 50;
/** Closest the camera may be pulled in by terrain between it and the hero (world units). */
const MIN_DIST = 2.2;

/**
 * Minecraft Dungeons style follow camera with a narrow lens: it orbits the hero (any yaw, a tilt
 * between PITCH_MIN and PITCH_MAX, turned with the right mouse button), follows it smoothly and
 * keeps it in the middle of the view; terrain between the hero and the camera pulls the camera
 * in so it never looks through a hill or mountain. Trauma-based shake.
 */
export class CameraRig {
  readonly camera: THREE.PerspectiveCamera;
  private trauma = 0;
  private tx = 0;
  private tz = 0;
  /** Followed ground height (eased, so steps and cliffs glide). */
  private ty = 0;
  /** Downward pitch of the view (radians from horizontal), PITCH_MIN..PITCH_MAX. */
  pitch = (PITCH_MAX * Math.PI) / 180;
  /** Camera distance to the target at zoom 1. */
  readonly baseDist = 34;
  /** Vertical field of view on wide screens (narrow lens for the near-orthographic MCD look). */
  readonly baseFov = 30;
  height = 34 * Math.sin((PITCH_MAX * Math.PI) / 180);
  back = 34 * Math.cos((PITCH_MAX * Math.PI) / 180);
  /** Rotation of the view around the vertical axis (45° at start: the diagonal dungeon look). */
  yaw = Math.PI / 4;
  /** Horizontal unit vector from the target toward the camera. */
  readonly toCam = { x: Math.sin(Math.PI / 4), z: Math.cos(Math.PI / 4) };
  /** Distance factor after terrain collision (1 = free view), eased. */
  private block = 1;
  /** Tilt actually used (radians): raised toward PITCH_MAX while terrain hides the hero. */
  private viewPitch = (PITCH_MAX * Math.PI) / 180;
  /** Screen shake strength 0..1 from settings. */
  shake = 1;
  zoom = 1;
  /** Automatic pull-back for big fights (multiplies zoom), eased toward autoTarget. */
  autoZoom = 1;
  autoTarget = 1;
  private ray = new THREE.Raycaster();
  private ndc = new THREE.Vector2();
  private plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  private hit = new THREE.Vector3();

  constructor(aspect: number) {
    this.camera = new THREE.PerspectiveCamera(this.baseFov, aspect, 1, 240);
  }

  resize(w: number, h: number) {
    const aspect = w / h;
    this.camera.aspect = aspect;
    // keep at least ~20 world units visible horizontally on narrow screens
    const f = this.baseFov;
    this.camera.fov = aspect < 1 ? f * 1.55 : aspect < 1.4 ? f * 1.2 : f;
    this.camera.updateProjectionMatrix();
  }

  get distance(): number {
    return Math.hypot(this.height, this.back) * this.zoom;
  }

  /**
   * Orbits the camera: `dYaw` turns it around the hero (any amount, full circle), `dPitch` tilts it
   * (radians, clamped to PITCH_MIN..PITCH_MAX). The view keeps the new angles until turned again.
   */
  orbit(dYaw: number, dPitch: number) {
    this.yaw = (((this.yaw + dYaw) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const lo = (PITCH_MIN * Math.PI) / 180;
    const hi = (PITCH_MAX * Math.PI) / 180;
    this.pitch = Math.max(lo, Math.min(hi, this.pitch + dPitch));
    const d = this.baseDist;
    this.height = d * Math.sin(this.pitch);
    this.back = d * Math.cos(this.pitch);
    this.toCam.x = Math.sin(this.yaw);
    this.toCam.z = Math.cos(this.yaw);
  }

  addShake(amount: number) {
    if (this.shake <= 0) return;
    this.trauma = Math.min(1, this.trauma + amount * this.shake);
  }

  snap(x: number, z: number, y = this.ty) {
    this.tx = x;
    this.tz = z;
    this.ty = y;
  }

  /**
   * `ground` (optional) is the terrain height: when hills or mountains rise between the hero and
   * the camera, the camera slides in along its line toward the hero until the view is clear.
   */
  update(dt: number, x: number, z: number, lead = { x: 0, z: 0 }, y = 0, ground?: (x: number, z: number) => number) {
    const k = 1 - Math.exp(-8 * dt);
    this.tx += (x + lead.x - this.tx) * k;
    this.tz += (z + lead.z - this.tz) * k;
    this.ty += (y - this.ty) * (1 - Math.exp(-4 * dt));
    this.trauma = Math.max(0, this.trauma - dt * 1.6);
    const s = this.trauma * this.trauma * 0.6;
    const ox = (Math.random() * 2 - 1) * s;
    const oz = (Math.random() * 2 - 1) * s;
    this.autoZoom += (this.autoTarget - this.autoZoom) * (1 - Math.exp(-1.5 * dt));
    const dist = this.baseDist * this.zoom * this.autoZoom;
    let pitch = this.pitch;
    let free = 1;
    if (ground) {
      // terrain between the hero and the camera: first tilt up (within the allowed range), then
      // slide in along the line until the view is clear
      const hi = (PITCH_MAX * Math.PI) / 180;
      let best = -1;
      for (let a = this.pitch; ; a = Math.min(hi, a + (5 * Math.PI) / 180)) {
        const f = this.clearance(ground, a, dist);
        if (f > best + 1e-3) {
          best = f;
          pitch = a;
        }
        if (f >= 1 || a >= hi) break;
      }
      free = best;
    }
    // the player's own tilt follows at once; a lift over terrain eases in, and back out slowly
    const kp = 1 - Math.exp((free >= 1 && pitch === this.pitch ? -20 : pitch > this.viewPitch ? -12 : -3) * dt);
    this.viewPitch += (pitch - this.viewPitch) * kp;
    // pull in at once, let out gently
    this.block += (free - this.block) * (1 - Math.exp((free < this.block ? -25 : -3) * dt));
    const d = dist * this.block;
    const h = 1.2 + (Math.sin(this.viewPitch) * dist - 1.2) * this.block;
    const b = Math.cos(this.viewPitch) * d;
    this.camera.position.set(this.tx + this.toCam.x * b + ox, this.ty + h, this.tz + this.toCam.z * b + oz);
    this.camera.lookAt(this.tx + ox * 0.5, this.ty, this.tz + oz * 0.5);
  }

  /**
   * How far out along the view line at tilt `pitch` the camera may sit (fraction of `dist`):
   * the line from the hero's chest is marched outward and stops a margin above the ground.
   */
  private clearance(ground: (x: number, z: number) => number, pitch: number, dist: number): number {
    const h = Math.sin(pitch) * dist;
    const b = Math.cos(pitch) * dist;
    const y0 = this.ty + 1.2;
    const steps = 48;
    for (let i = 1; i <= steps; i++) {
      const k = i / steps;
      const x = this.tx + this.toCam.x * b * k;
      const z = this.tz + this.toCam.z * b * k;
      // the margin covers the near plane and the ground between samples
      if (ground(x, z) + 1.0 > y0 + (h - 1.2) * k) return Math.max(MIN_DIST / dist, (i - 2) / steps);
    }
    return 1;
  }

  /** Turns a screen-space input direction (x right, z down) into a world direction. */
  screenToWorld(ix: number, iz: number): [number, number] {
    const c = Math.cos(this.yaw);
    const s = Math.sin(this.yaw);
    return [ix * c + iz * s, -ix * s + iz * c];
  }

  /** World point on the ground plane (height y) under a screen pixel. */
  groundPoint(px: number, py: number, w: number, h: number, y = 0): [number, number] | null {
    this.ndc.set((px / w) * 2 - 1, -(py / h) * 2 + 1);
    this.ray.setFromCamera(this.ndc, this.camera);
    this.plane.constant = -y;
    const p = this.ray.ray.intersectPlane(this.plane, this.hit);
    return p ? [p.x, p.z] : null;
  }

  /**
   * World point on the terrain under a screen pixel: marches the view ray down to the first
   * ground (plus `lift`) it meets, so clicks land on hill tops and cliff feet alike.
   */
  terrainPoint(px: number, py: number, w: number, h: number, ground: (x: number, z: number) => number, lift = 0): [number, number] | null {
    this.ndc.set((px / w) * 2 - 1, -(py / h) * 2 + 1);
    this.ray.setFromCamera(this.ndc, this.camera);
    const o = this.ray.ray.origin;
    const d = this.ray.ray.direction;
    if (d.y >= -0.01) return this.groundPoint(px, py, w, h, this.ty + lift);
    const step = 0.35;
    let prev = 0;
    for (let t = 0; t < 400; t += step) {
      const x = o.x + d.x * t;
      const y = o.y + d.y * t;
      const z = o.z + d.z * t;
      if (y <= ground(x, z) + lift) {
        // refine between the last point above ground and this one
        let a = prev;
        let b = t;
        for (let i = 0; i < 6; i++) {
          const m = (a + b) / 2;
          if (o.y + d.y * m <= ground(o.x + d.x * m, o.z + d.z * m) + lift) b = m;
          else a = m;
        }
        return [o.x + d.x * b, o.z + d.z * b];
      }
      prev = t;
      if (y < -2) break;
    }
    return this.groundPoint(px, py, w, h, lift);
  }

  get target(): { x: number; y: number; z: number } {
    return { x: this.tx, y: this.ty, z: this.tz };
  }
}

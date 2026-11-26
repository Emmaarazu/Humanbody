import * as THREE from 'three';

const CLICK_MAX_MOVE_PX = 12;
const CLICK_MAX_MS = 450;

export class SelectionManager {
  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.down = { x: 0, y: 0, time: 0 };
  }

  handlePointerDown(event) {
    this.down.x = event.clientX;
    this.down.y = event.clientY;
    this.down.time = performance.now();
  }

  handlePointerUp(event, camera, meshes, parts, onSelect) {
    const dx = event.clientX - this.down.x;
    const dy = event.clientY - this.down.y;
    const dist = Math.hypot(dx, dy);
    const elapsed = performance.now() - this.down.time;

    if (dist > CLICK_MAX_MOVE_PX || elapsed > CLICK_MAX_MS) return;

    const rect = event.currentTarget.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, camera);
    const visible = meshes.filter((m) => m.visible);
    const hits = this.raycaster.intersectObjects(visible, false);
    if (hits.length === 0) return;

    const hit = hits[0];
    const geometry = hit.object.geometry;
    const partIndexAttr = geometry.getAttribute('partIndex');
    if (!partIndexAttr || !hit.face) return;

    const vIdx = hit.face.a;
    const partIndex = Math.round(partIndexAttr.getX(vIdx));
    const part = parts[partIndex];
    if (part) onSelect(part, hit.object);
  }
}
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class CameraController {
  constructor(camera, domElement) {
    this.camera = camera;
    this.controls = new OrbitControls(camera, domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 0.4;
    this.controls.maxDistance = 8;
    this.controls.maxPolarAngle = Math.PI * 0.95;
    this.controls.target.set(0, 1.0, 0);

    camera.position.set(0, 1.15, 3.4);
    camera.lookAt(this.controls.target);
  }

  frame(box) {
    if (!box) return;
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);
    const height = size.y || 1.8;

    this.controls.target.copy(center);
    this.camera.position.set(
      center.x,
      center.y + height * 0.05,
      center.z + height * 1.85
    );
    this.camera.lookAt(center);
    this.controls.update();
  }

  update() {
    this.controls.update();
  }

  dispose() {
    this.controls.dispose();
  }
}
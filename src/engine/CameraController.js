import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class CameraController {
  constructor(camera, domElement) {
    this.camera = camera;
    this.controls = new OrbitControls(camera, domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 0.05;
    this.controls.maxDistance = 8;
    this.controls.maxPolarAngle = Math.PI * 0.95;
    
    // Default view
    this.defaultTarget = new THREE.Vector3(0, 1.0, 0);
    this.defaultPosition = new THREE.Vector3(0, 1.15, 3.4);
    
    this.controls.target.copy(this.defaultTarget);
    camera.position.copy(this.defaultPosition);
    camera.lookAt(this.defaultTarget);

    // Animation state
    this.isAnimating = false;
    this.animTargetPos = new THREE.Vector3();
    this.animTargetLookAt = new THREE.Vector3();
    this.animProgress = 0;
  }

  frame(box) {
    if (!box) return;
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);
    const height = size.y || 1.8;

    this.defaultTarget.copy(center);
    this.defaultPosition.set(
      center.x,
      center.y + height * 0.05,
      center.z + height * 1.85
    );
    this.resetView();
  }

  focusOn(box) {
    if (!box) return;
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    
    // Zoom in based on object size
    const distance = Math.max(maxDim * 3, 0.2);

    this.animTargetLookAt.copy(center);
    this.animTargetPos.set(
      center.x + distance * 0.5,
      center.y + distance * 0.2,
      center.z + distance
    );
    
    this.animProgress = 0;
    this.isAnimating = true;
  }

  resetView() {
    this.animTargetLookAt.copy(this.defaultTarget);
    this.animTargetPos.copy(this.defaultPosition);
    this.animProgress = 0;
    this.isAnimating = true;
  }

  update() {
    if (this.isAnimating) {
      this.animProgress += 0.05; // Smooth lerp speed
      
      if (this.animProgress >= 1) {
        this.animProgress = 1;
        this.isAnimating = false;
      }

      // Ease in-out quad
      const t = this.animProgress < 0.5 
        ? 2 * this.animProgress * this.animProgress 
        : 1 - Math.pow(-2 * this.animProgress + 2, 2) / 2;

      this.camera.position.lerp(this.animTargetPos, t);
      this.controls.target.lerp(this.animTargetLookAt, t);
    }
    
    this.controls.update();
  }

  dispose() {
    this.controls.dispose();
  }
}
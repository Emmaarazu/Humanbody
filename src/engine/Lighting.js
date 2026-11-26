import * as THREE from 'three';

export function setupLighting(scene) {
  const hemi = new THREE.HemisphereLight(0xdce6f0, 0x1a1a2e, 0.85);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xffffff, 2.0);
  key.position.set(-3, 6, 4);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x88ccff, 1.3);
  rim.position.set(3, 3, -4);
  scene.add(rim);

  const fill = new THREE.PointLight(0x4466aa, 0.5, 20);
  fill.position.set(0, 2, -3);
  scene.add(fill);

  return { hemi, key, rim, fill };
}
export class LayerManager {
  constructor(meshes) {
    this.meshes = meshes;
    this.targetOpacity = new Map();
    this.meshes.forEach((_, system) => this.targetOpacity.set(system, 1));
  }

  setVisible(system, visible) {
    if (!this.meshes.has(system)) return;
    this.targetOpacity.set(system, visible ? 1 : 0);
  }

  update(dt) {
    const speed = 5.0;
    const alpha = Math.min(1, speed * dt);

    this.meshes.forEach((mesh, system) => {
      const target = this.targetOpacity.get(system) ?? 1;
      const mat = mesh.material;
      if (!mat.transparent) mat.transparent = true;

      if (Math.abs(mat.opacity - target) > 0.005) {
        mat.opacity += (target - mat.opacity) * alpha;
      } else {
        mat.opacity = target;
      }
      mesh.visible = mat.opacity > 0.01;
    });
  }
}
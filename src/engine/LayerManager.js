export class LayerManager {
  constructor(meshes) {
    this.meshes = meshes;
    this.targetOpacity = new Map();
    this.isolationMode = false;
    this.isolatedSystem = null;
    
    this.meshes.forEach((_, system) => this.targetOpacity.set(system, 1));
  }

  setVisible(system, visible) {
    if (!this.meshes.has(system)) return;
    // If isolated, don't allow manual overrides of the isolation state
    if (this.isolationMode) return; 
    this.targetOpacity.set(system, visible ? 1 : 0);
  }

  setMode(isolated, system) {
    this.isolationMode = isolated;
    this.isolatedSystem = system;

    if (isolated && system) {
      this.meshes.forEach((_, sys) => {
        this.targetOpacity.set(sys, sys === system ? 1 : 0.05);
      });
    } else {
      // Restore all to visible when exiting isolation
      this.meshes.forEach((_, sys) => {
        this.targetOpacity.set(sys, 1);
      });
    }
  }

  update(dt) {
    const speed = 6.0;
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
      
      // Only fully hide if opacity is near zero, otherwise keep rendering
      mesh.visible = mat.opacity > 0.01;
    });
  }
}
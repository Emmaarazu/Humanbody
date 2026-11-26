import * as THREE from 'three';
import { CameraController } from './CameraController';
import { setupLighting } from './Lighting';
import { loadAnatomy, buildPartGeometry } from './ModelLoader';
import { SelectionManager } from './SelectionManager';
import { LayerManager } from './LayerManager';

export class SceneManager {
  constructor(container, callbacks = {}) {
    this.container = container;
    this.callbacks = callbacks;
    this.disposed = false;
    this.clock = new THREE.Clock();

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.setClearColor(0x05070d, 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x05070d, 8, 22);

    this.camera = new THREE.PerspectiveCamera(38, 1, 0.01, 100);
    this.cameraController = new CameraController(
      this.camera,
      this.renderer.domElement
    );

    setupLighting(this.scene);

    const grid = new THREE.GridHelper(6, 24, 0x162a44, 0x0a1220);
    grid.position.y = 0;
    this.scene.add(grid);

    this.meshes = new Map();
    this.parts = [];
    this.buffers = [];
    this.layerManager = null;
    this.selectionManager = new SelectionManager();
    this.highlightMesh = null;
    this.abortController = new AbortController();

    this.onPointerDown = (e) => this.selectionManager.handlePointerDown(e);
    this.onPointerUp = (e) =>
      this.selectionManager.handlePointerUp(
        e,
        this.camera,
        [...this.meshes.values()],
        this.parts,
        (part) => this.handleSelect(part)
      );
    this.onResize = () => this.resize();

    this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown);
    this.renderer.domElement.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('resize', this.onResize);

    this.resize();
    this.animate = this.animate.bind(this);
    this.raf = requestAnimationFrame(this.animate);
  }

  async load() {
    try {
      const result = await loadAnatomy(
        (p) => this.callbacks.onProgress?.(p),
        this.abortController.signal
      );

      this.parts = result.parts;
      this.buffers = result.buffers;
      this.meshes = result.mergedMeshes;

      this.meshes.forEach((mesh) => this.scene.add(mesh));
      this.layerManager = new LayerManager(this.meshes);

      this.cameraController.frame(result.boundingBox);

      requestAnimationFrame(() => this.callbacks.onReady?.());
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('[HUMAN MACHINE] load error:', err);
      this.callbacks.onError?.(err.message || 'Failed to load anatomy.');
    }
  }

  handleSelect(part) {
    this.callbacks.onSelect?.(part);
    this.highlightPart(part);
  }

  highlightPart(part) {
    this.clearHighlight();
    const buffer = this.buffers[part.chunk];
    if (!buffer) return;

    let geo;
    try {
      geo = buildPartGeometry(part, buffer);
    } catch (err) {
      console.warn('Could not rebuild highlighted geometry:', err);
      return;
    }

    const mat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.35,
      depthTest: false,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.renderOrder = 999;
    this.scene.add(mesh);
    this.highlightMesh = mesh;
  }

  clearHighlight() {
    if (!this.highlightMesh) return;
    this.scene.remove(this.highlightMesh);
    this.highlightMesh.geometry.dispose();
    this.highlightMesh.material.dispose();
    this.highlightMesh = null;
  }

  resetSelection() {
    this.clearHighlight();
    this.callbacks.onSelect?.(null);
  }

  setLayerVisible(system, visible) {
    this.layerManager?.setVisible(system, visible);
  }

  animate() {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.animate);

    const dt = Math.min(this.clock.getDelta(), 0.1);
    this.cameraController.update();
    this.layerManager?.update(dt);

    if (this.highlightMesh) {
      const t = performance.now() * 0.003;
      this.highlightMesh.material.opacity = 0.28 + Math.sin(t) * 0.08;
    }

    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    const w = this.container.clientWidth || 1;
    const h = this.container.clientHeight || 1;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.abortController.abort();
    this.renderer.domElement.removeEventListener('pointerdown', this.onPointerDown);
    this.renderer.domElement.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('resize', this.onResize);
    this.cameraController.dispose();
    this.clearHighlight();
    this.meshes.forEach((mesh) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
    });
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { SYSTEM_COLORS } from '../data/anatomyData';

const BASE_URL =
  'https://raw.githubusercontent.com/ashemag/human-atlas/main/public/models/';

const FETCH_TIMEOUT_MS = 30000;

async function fetchWithTimeout(url, signal) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  const combined = signal ? anySignal([signal, ctrl.signal]) : ctrl.signal;
  try {
    const res = await fetch(url, { signal: combined });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return res;
  } finally {
    clearTimeout(timer);
  }
}

function anySignal(signals) {
  const ctrl = new AbortController();
  for (const s of signals) {
    if (s.aborted) {
      ctrl.abort();
      return ctrl.signal;
    }
    s.addEventListener('abort', () => ctrl.abort(), { once: true });
  }
  return ctrl.signal;
}

async function decompressIfGzip(arrayBuffer) {
  const sig = new Uint8Array(arrayBuffer, 0, 2);
  if (sig[0] !== 0x1f || sig[1] !== 0x8b) return arrayBuffer;
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('Browser does not support gzip decompression.');
  }
  const stream = new Blob([arrayBuffer])
    .stream()
    .pipeThrough(new DecompressionStream('gzip'));
  return new Response(stream).arrayBuffer();
}

async function fetchChunk(index, signal) {
  const res = await fetchWithTimeout(`${BASE_URL}body-${index}.bin.gz`, signal);
  const raw = await res.arrayBuffer();
  return decompressIfGzip(raw);
}

export function buildPartGeometry(part, buffer) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute(
    'position',
    new THREE.BufferAttribute(
      new Float32Array(buffer, part.positions, part.vertexCount * 3),
      3
    )
  );
  geo.setAttribute(
    'normal',
    new THREE.BufferAttribute(
      new Int16Array(buffer, part.normals, part.vertexCount * 3),
      3,
      true
    )
  );
  geo.setIndex(
    new THREE.BufferAttribute(
      new Uint32Array(buffer, part.indices, part.indexCount),
      1
    )
  );
  geo.computeBoundingSphere();
  return geo;
}

function attachPartIndexAttribute(geometry, globalPartIndex) {
  const count = geometry.getAttribute('position').count;
  const arr = new Float32Array(count).fill(globalPartIndex);
  geometry.setAttribute('partIndex', new THREE.BufferAttribute(arr, 1));
  return geometry;
}

export async function loadAnatomy(onProgress, signal) {
  const manifestRes = await fetchWithTimeout(`${BASE_URL}atlas.json`, signal);
  const atlas = await manifestRes.json();
  const parts = atlas.parts;
  if (!Array.isArray(parts) || parts.length === 0) {
    throw new Error('Anatomy manifest is empty or malformed.');
  }

  const chunkCount = Math.max(...parts.map((p) => p.chunk)) + 1;
  const buffers = new Array(chunkCount);
  let loadedCount = 0;

  const queue = Array.from({ length: chunkCount }, (_, i) => i);
  const CONCURRENCY = 4;

  async function worker() {
    while (queue.length) {
      if (signal?.aborted) return;
      const idx = queue.shift();
      buffers[idx] = await fetchChunk(idx, signal);
      loadedCount += 1;
      onProgress?.(loadedCount / chunkCount);
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

  const systemGeometries = new Map();

  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    const buffer = buffers[p.chunk];
    const geo = buildPartGeometry(p, buffer);
    attachPartIndexAttribute(geo, i);
    if (!systemGeometries.has(p.system)) systemGeometries.set(p.system, []);
    systemGeometries.get(p.system).push(geo);
  }

  const mergedMeshes = new Map();
  let combinedBox = new THREE.Box3();

  for (const [system, geos] of systemGeometries) {
    const merged = mergeGeometries(geos, false);
    if (!merged) throw new Error(`Could not merge geometry for ${system}`);

    merged.computeBoundingBox();
    merged.computeBoundingSphere();
    combinedBox.union(merged.boundingBox);

    const color = SYSTEM_COLORS[system] || '#a0a0a0';
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness: 0.58,
      metalness: 0.06,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide,
      depthWrite: true,
    });

    const mesh = new THREE.Mesh(merged, mat);
    mesh.name = system;
    mesh.userData.system = system;
    mergedMeshes.set(system, mesh);

    geos.forEach((g) => g.dispose());
  }

  return {
    parts,
    mergedMeshes,
    buffers,
    boundingBox: combinedBox,
  };
}
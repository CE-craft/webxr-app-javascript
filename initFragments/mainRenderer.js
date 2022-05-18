import * as THREE from "three";

// Renderer
export const mainRenderer = (renderer, container) => {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.xr.enabled = true;

  container.appendChild(renderer.domElement);
  return renderer;
};

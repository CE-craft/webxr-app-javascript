import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const gltfLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();
let logoModel = new THREE.Object3D();

export const createLogo = () => {
  gltfLoader.load("../assets/gltf/logoSoloMesh.glb", (glb) => {
    console.log(glb);
    logoModel = glb.scene;

    logoModel.position.set(0.01, -0.01, -0.6);
    logoModel.rotation.set(Math.PI * 0.5, 0, 0);
    logoModel.scale.set(0.18, 0.18, 0.18);
  });

  return logoModel;
};

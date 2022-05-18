import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { createLogo } from "./logo";

const gltfLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();
let dronModel = new THREE.Object3D();

export const createDrone = (scene) => {
  gltfLoader.load("../assets/gltf/DroneLabledFix02.glb", (glb) => {
    // const logoModel = createLogo();
    // console.log(logoModel);
    glb.scene.traverse((child) => {
      child.material = bakedMaterial;
    });

    dronModel = glb.scene;
    dronModel.scale.set(0.005, 0.005, 0.005);
    dronModel.rotation.set(0, Math.PI, 0);
  });

  const bakedTexture = textureLoader.load("../assets/gltf/baked3.jpg");
  bakedTexture.flipY = false;
  bakedTexture.encoding = THREE.sRGBEncoding;
  const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });

  return dronModel;
};

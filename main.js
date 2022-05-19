import "./style.css";
import * as THREE from "three";
import * as ThreeMeshUI from "three-mesh-ui";
import { mainRenderer } from "./initFragments/mainRenderer";
import { BtnUI, containerUI, selectionUI } from "./UI/initUI";
import { updatePlaceBtn, updateUIPositionWithCamera } from "./UI/updateUI";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";
import { state, actions } from "./stateManager";
import {
  handleSelect,
  handleSelectEnd,
  placeObjectHandler,
} from "./handlers/handlers";

let container;
let camera, scene, renderer;
let controller;

const droneTexture = "./assets/drone.jpg";

let reticle;

let objectsToTest = [];
const texturesArr = [droneTexture];

let hitTestSource = null;
let hitTestSourceRequested = false;

const raycaster = new THREE.Raycaster();

const clock = new THREE.Clock();

let arrow;

let placeBtn;
let containerUIVar;
let selectionUiItem;

/***
 * INIT THREEJS CANVAS
 */

const init = () => {
  container = document.createElement("div");
  document.body.appendChild(container);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    20
  );
  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  light.position.set(0.5, 1, 0.25);
  scene.add(light);

  /***
   * RENDERER
   */
  renderer = mainRenderer(renderer, container);

  /**
   * ARROW RAYCASTER HELPER
   */
  arrow = new THREE.ArrowHelper(
    raycaster.ray.direction,
    raycaster.ray.origin,
    100,
    Math.random() * 0xffffff
  );
  //scene.add(arrow);

  /***
   * ACTIVATE AR BUTTON
   */
  document.body.appendChild(
    ARButton.createButton(renderer, { requiredFeatures: ["hit-test"] })
  );

  /***
   * XR CONTROLLER
   */
  controller = renderer.xr.getController(0);
  scene.add(controller);

  /***
   * XR HIT  TARGET MESH
   */
  reticle = new THREE.Mesh(
    new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial()
  );
  reticle.matrixAutoUpdate = false;
  reticle.visible = false;

  /***
   * 3D UI
   */
  //

  placeBtn = BtnUI(placeBtn, "Place", state, actions);
  if (!state.switchUI.isSelecting && !state.switchUI.isPlacing) {
    scene.add(placeBtn);
  }

  containerUIVar = containerUI(containerUIVar, texturesArr);

  selectionUiItem = selectionUI(texturesArr[0]);

  if (!state.switchUI.isSelecting && !state.switchUI.isPlacing)
    scene.add(placeBtn);
};

/***
 * RESIZE
 */
const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

/***
 *  XR RENDER
 */
const render = async (timestamp, frame) => {
  if (frame) {
    //Updating UI movment with camera

    //  arrow.setDirection(raycaster.ray.direction);
    updateUIPositionWithCamera(camera, placeBtn);
    updateUIPositionWithCamera(camera, selectionUiItem);

    const referenceSpace = renderer.xr.getReferenceSpace();
    const session = renderer.xr.getSession();
    if (hitTestSourceRequested === false) {
      session.requestReferenceSpace("viewer").then(function (referenceSpace) {
        // viewer position + orientation
        session
          .requestHitTestSource({ space: referenceSpace }) // space surface hit data
          .then(function (source) {
            hitTestSource = source;
          });
      });

      session.addEventListener("end", function () {
        hitTestSourceRequested = false;
        hitTestSource = null;
      });

      hitTestSourceRequested = true;
    }

    if (hitTestSource) {
      const hitTestResults = frame.getHitTestResults(hitTestSource); // update surface hit data on each frame

      if (hitTestResults.length) {
        const hit = hitTestResults[0];

        reticle.visible = true;
        reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix); // positioning the xrTarget on the same position and rotation of the hit in the space
      } else {
        reticle.visible = false;
      }
    }
  }
  ThreeMeshUI.update();
  renderer.render(scene, camera);

  /***
   * UPDATE BUTTONS
   */
  //
  if (!state.switchUI.isSelecting && !state.switchUI.isPlacing)
    updatePlaceBtn(objectsToTest, renderer, raycaster, state, actions);
};

/***
 * ANIMATION LOOP
 */

const animate = () => {
  renderer.setAnimationLoop(render);
};

init();
window.addEventListener("resize", onWindowResize);
animate();

objectsToTest = scene.children;

/**
 * COLLECTED DATA
 */
const data = {
  state,
  objectsToTest,
  placeBtn,
  selectionUiItem,
  reticle,
  controller,
  raycaster,
  renderer,
  scene,
};

/***
 * HANDLERS
 */
const handlersControl = () => {
  if (state.switchUI.isPlacing) {
    placeObjectHandler(data);
  } else {
    handleSelect(data);
  }
};

window.addEventListener("pointerdown", handlersControl);
window.addEventListener("pointerup", handleSelectEnd);

window.addEventListener("touchstart", handlersControl);
window.addEventListener("touchend", handleSelectEnd);

controller.addEventListener("selectstart", handlersControl);
controller.addEventListener("selectend", handleSelectEnd);

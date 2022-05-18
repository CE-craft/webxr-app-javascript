import * as THREE from "three";
import { state, actions } from "../stateManager";
import { createDrone } from "../models/drone";
import { checkUIIntersection } from "../UI/updateUI";

/**
 * SELECT HANDLER
 *
 */
export const handleSelect = (
  objectsToTest,
  placeBtn,
  selectionUiItem,
  reticle,
  controller,
  raycaster,
  renderer,
  scene
) => {
  const tempMatrix = new THREE.Matrix4();
  tempMatrix.identity().extractRotation(controller.matrixWorld);
  raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
  raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

  const intersect = checkUIIntersection(
    objectsToTest,
    renderer,
    raycaster,
    renderer
  );

  if (!state.switchUI.isSelecting && !state.switchUI.isPlacing) {
    scene.add(placeBtn);
  }

  if (
    intersect &&
    intersect?.object?.isUI &&
    intersect?.object?.uid === "placeBtn"
  ) {
    if (!state.switchUI.isSelecting) state.reducer(actions.selecting);
    if (!state.btnState.isClicked) state.reducer(actions.btnClicked);

    if (state.switchUI.isSelecting && !state.switchUI.isPlacing) {
      scene.remove(placeBtn);
      scene.add(selectionUiItem);
    }
    if (state.switchUI.isSelecting) {
      if (!state.switchUI.isSelecting) state.reducer(actions.selecting);
    }
  }

  if (
    intersect &&
    intersect?.object?.isUI &&
    intersect?.object?.uid === "imgBtn"
  ) {
    if (!state.switchUI.isPlacing) state.reducer(actions.placing);
    scene.remove(selectionUiItem);
    scene.add(reticle);
  }
};

/**
 * SELECT END HANDLER
 *
 */
export const handleSelectEnd = () => {
  state.reducer(actions.btnClicked);
};

/**
 * PLACING OBJECT HANDLER
 */
export const placeObjectHandler = (state, reticle, scene) => {
  if (reticle.visible && state.switchUI.isPlacing) {
    const drone = createDrone();

    reticle.matrix.decompose(
      drone.position,
      new THREE.Quaternion(0, Math.PI, 0, 0),
      drone.scale
    );
    scene.add(drone);
  }
};

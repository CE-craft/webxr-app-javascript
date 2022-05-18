import * as THREE from "three";

const raycastingIntersection = (objectsToTest = [], raycaster) => {
  return objectsToTest.reduce((closestInteraction, obj) => {
    const intersection = raycaster.intersectObject(obj);

    if (!intersection[0]) return closestInteraction;
    if (
      !closestInteraction ||
      intersection[0].distance < closestInteraction.distance
    ) {
      intersection[0].object = obj;

      return intersection[0];
    }

    return closestInteraction;
  }, null);
};

export const checkUIIntersection = (objectsToTest, renderer, raycaster) => {
  let intersect;

  if (renderer.xr.isPresenting) {
    intersect = raycastingIntersection(objectsToTest, raycaster);

    return intersect;
  }
};

export const updatePlaceBtn = (
  objectsToTest,
  renderer,
  raycaster,
  state,
  actions
) => {
  const { btnState } = state;

  const intersect = checkUIIntersection(objectsToTest, renderer, raycaster);

  //intersect?.object?.setState("idle");
  objectsToTest.forEach((obj) => {
    if (obj.isUI) obj.setState("idle");
  });

  if (intersect && intersect?.object?.isUI) {
    if (btnState.isSelected) {
      // intersect?.object.setState("selected");

      objectsToTest.forEach((obj) => {
        if (obj.isUI) obj.setState("selected");
      });
    }
  } else {
    if (btnState.isSelected) state.reducer(actions.btnClicked);
    //intersect?.object?.setState("idle");
    objectsToTest.forEach((obj) => {
      if (obj.isUI) obj.setState("idle");
    });
  }
};

/**
 * UI MESH CAMERA FOLLOW
 */
export const updateUIPositionWithCamera = (camera, obj) => {
  // fixed distance from camera to the object
  const dist = 2;
  const cameraWorldDirection = new THREE.Vector3();

  camera.getWorldDirection(cameraWorldDirection);

  cameraWorldDirection.multiplyScalar(dist);
  cameraWorldDirection.add(camera.position);

  obj.position.set(
    cameraWorldDirection.x,
    cameraWorldDirection.y,
    cameraWorldDirection.z
  );

  obj.setRotationFromQuaternion(camera.quaternion);
};

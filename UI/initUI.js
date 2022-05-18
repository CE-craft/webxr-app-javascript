import * as THREE from "three";
import * as ThreeMeshUI from "three-mesh-ui";

export const BtnStateChange = (state, actions) => {
  if (!state.switchUI.isSelecting) state.reducer(actions.selecting);
  if (!state.btnState.isClicked) state.reducer(actions.btnClicked);
  //console.log(state.switchUI.isSlecting);
};

const closingModal = () => {
  console.log("closing");
};

export function BtnUI(Btn, name, state = {}, actions = {}) {
  const btnOptions = {
    width: 0.4,
    height: 0.15,
    justifyContent: "center",
    offset: 0.05,
    margin: 0.02,
    borderRadius: 0.075,
    fontFamily: "./assets/Roboto-msdf.json",
    fontTexture: "./assets/Roboto-msdf.png",
  };
  const selectedStateAttributes = {
    offset: 0.035,
    backgroundColor: new THREE.Color(0x999999),
    backgroundOpacity: 1,
    fontColor: new THREE.Color(0xffffff),
  };

  const idleStateAttributes = {
    state: "idle",
    attributes: {
      offset: 0.035,
      backgroundColor: new THREE.Color(0x666666),
      backgroundOpacity: 0.5,
      fontColor: new THREE.Color(0xffffff),
    },
  };

  Btn = new ThreeMeshUI.Block(btnOptions);
  Btn.add(new ThreeMeshUI.Text({ content: name }));
  Btn.position.set(0, 0.1, -0.9);
  Btn.rotation.x = -0.3;

  Btn.setupState(idleStateAttributes);
  Btn.setupState({
    state: "selected",
    attributes: selectedStateAttributes,
    // onSet: BtnStateChange(state, actions),
  });

  Btn.uid = "placeBtn";

  return Btn;
}

/**
 * UI CHOICE
 *
 */
export const selectionUI = (textureImg) => {
  const imgUIOptions = {
    width: 0.4,
    height: 0.4,
    margin: 0.02,
    borderRadius: 0.025,
  };

  const imgBtn = new ThreeMeshUI.Block(imgUIOptions);
  new THREE.TextureLoader().load(textureImg, (texture) => {
    imgBtn.set({
      backgroundTexture: texture,
    });
  });

  imgBtn.setupState({
    state: "selected",
    onSet: () => {
      console.log("clicekd");
    },
  });

  imgBtn.uid = "imgBtn";

  return imgBtn;
};

const selectionContainer = (containerVar, imgArray) => {
  containerVar = new ThreeMeshUI.Block({
    contentDirection: "row",
    padding: 0.025,
    backgroundOpacity: 0,
  });

  imgArray.forEach((img) => containerVar.add(selectionUI(img)));

  return containerVar;
};

export const closeBtn = () => {
  const closeBtn = new ThreeMeshUI.Block({
    height: 0.07,
    width: 0.07,
    textAlign: "center",
    justifyContent: "center",
  });

  closeBtn.add(
    new ThreeMeshUI.Text({
      content: "X",
      fontSize: 0.025,
    })
  );

  closeBtn.setupState({
    state: "selected",
    onSet: () => {
      closingModal();
    },
  });
  closeBtn.uid = "closeId";
  return closeBtn;
};

const title = () => {
  const title = new ThreeMeshUI.Block({
    height: 0.07,
    width: 0.37,
    padding: 0.025,
    textAlign: "left",
    backgroundOpacity: 0,
  });

  title.add(
    new ThreeMeshUI.Text({
      content: "Select an item",
      fontSize: 0.025,
    })
  );

  return title;
};

const contentHeader = () => {
  const header = new ThreeMeshUI.Block({
    contentDirection: "row",
    borderRadius: 0.025,
    margin: 0.04,
    justifyContent: "space-between",
  });
  const close = closeBtn();
  const titleHeader = title();

  // console.log(titleHeader);
  header.add(titleHeader, close);

  return header;
};

export const containerUI = (containerVar, imgArray) => {
  const container = new ThreeMeshUI.Block({
    contentDirection: "column",
    borderRadius: 0.025,
    backgroundOpacity: 0.1,
    fontFamily: "./assets/Roboto-msdf.json",
    fontTexture: "./assets/Roboto-msdf.png",
  });

  const header = contentHeader();
  const selection = selectionContainer(containerVar, imgArray);

  container.add(header, selection);

  return container;
};

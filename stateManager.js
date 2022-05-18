//export const toggleBool = (bool) => !bool;

export const state = {
  btnState: {
    isClicked: false,
  },
  switchUI: {
    isSelecting: false,
    isPlacing: false,
  },
  reducer: function (action) {
    switch (action) {
      case "PLACING":
        return (this.switchUI.isPlacing = !this.switchUI.isPlacing);
      case "SELECTING":
        return (this.switchUI.isSelecting = !this.switchUI.isSelecting);
      case "CLICKED":
        return (this.btnState.isClicked = !this.btnState.isClicked);
      default:
        return this;
    }
  },
};

export const actions = {
  placing: "PLACING",
  selecting: "SELECTING",
  btnClicked: "CLICKED",
};

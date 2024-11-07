const initState = {
  isUpload: false,
};

export const isUpload = (state = initState, action) => {
  switch (action.type) {
    case "IS_UPLOAD/CHANGE":
      return {
        isUpload: action.payload,
      };
    default:
      return state;
  }
};

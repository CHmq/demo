export const auth = (state = {}, action) => {
  switch (action.type) {
    case "updateAuth":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

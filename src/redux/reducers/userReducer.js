import { userTypes, uiTypes } from "../types";

const initialState = {
  authenticated: false,
  credentials: {},
  approves: [],
  notifications: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case userTypes.SET_AUTHENTICATED:
      return { ...state, authenticated: true };

    case userTypes.SET_UNAUTHENTICATED:
      return initialState;

    case userTypes.SET_USER:
      return { authenticated: true, ...action.payload };

    default:
      return state;
  }
};

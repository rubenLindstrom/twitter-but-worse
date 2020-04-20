import { uiTypes } from "../types";

const initialState = {
  loading: false,
  errors: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case uiTypes.SET_ERRORS:
      return { ...state, loading: false, errors: action.payload };

    case uiTypes.CLEAR_ERRORS:
      return { ...state, errors: {} };

    case uiTypes.SET_LOADING:
      return { ...state, loading: action.payload };

    default:
      return state;
  }
};

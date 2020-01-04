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
      return { ...state, loading: false, errors: null };

    case uiTypes.LOADING:
      return { ...state, loading: true };
    default:
      return state;
  }
};

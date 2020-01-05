import { userTypes, dataTypes } from "../types";

const initialState = {
  authenticated: false,
  credentials: {},
  approves: [],
  notifications: [],
  loading: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case userTypes.SET_AUTHENTICATED:
      return { ...state, authenticated: true };

    case userTypes.SET_UNAUTHENTICATED:
      return initialState;

    case userTypes.SET_USER:
      return { authenticated: true, loading: false, ...action.payload };

    case userTypes.LOADING:
      return { ...state, loading: true };

    case dataTypes.APPROVE_POST:
      return {
        ...state,
        approves: [
          ...state.approves,
          {
            userHandle: state.credentials.handle,
            postId: action.payload.id
          }
        ]
      };

    case dataTypes.DISAPPROVE_POST:
      return {
        ...state,
        approves: state.approves.filter(
          approve => approve.postId !== action.payload.id
        )
      };

    default:
      return state;
  }
};

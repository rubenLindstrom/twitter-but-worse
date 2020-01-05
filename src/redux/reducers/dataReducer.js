import { dataTypes } from "../types";

const initialState = {
  posts: [],
  // TODO: Remove?
  post: {},
  loading: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case dataTypes.LOADING:
      return { ...state, loading: true };

    case dataTypes.SET_POSTS:
      return { ...state, posts: action.payload, loading: false };

    case dataTypes.APPROVE_POST:
    case dataTypes.DISAPPROVE_POST:
      const index = state.posts.findIndex(
        post => post.id === action.payload.id
      );
      const newPosts = [...state.posts];
      newPosts[index] = action.payload;
      return {
        ...state,
        posts: newPosts
      };

    default:
      return state;
  }
};

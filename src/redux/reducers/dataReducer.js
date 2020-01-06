import { dataTypes } from "../types";

const initialState = {
  posts: null,
  loading: false,
  currentProfile: null
};

export default (state = initialState, action) => {
  let posts;

  switch (action.type) {
    case dataTypes.LOADING:
      return { ...state, loading: true };

    case dataTypes.SET_POSTS:
      return { ...state, posts: action.payload, loading: false };

    case dataTypes.APPROVE_POST:
    case dataTypes.DISAPPROVE_POST:
      const { postId, isApprove } = action.payload;
      console.log(postId);
      const newPosts = { ...state.posts };
      newPosts[postId].approveCount += isApprove ? 1 : -1;
      return {
        ...state,
        posts: newPosts
      };

    case dataTypes.DELETE_POST:
      const oldPosts = { ...state.posts };
      delete oldPosts[action.payload];
      return {
        ...state,
        posts: oldPosts
      };

    case dataTypes.ADD_POST:
      return {
        ...state,
        posts: { [action.payload.id]: action.payload.post, ...state.posts }
      };

    case dataTypes.SET_COMMENTS:
      posts = { ...state.posts };
      posts[action.payload.postId].comments = action.payload.comments;
      return {
        ...state,
        posts
      };

    case dataTypes.SUBMIT_COMMENT:
      const { comment } = action.payload;
      posts = { ...state.posts };
      posts[action.payload.postId].comments.unshift(comment);
      posts[action.payload.postId].commentIds.unshift(comment.id);
      return {
        ...state,
        posts
      };

    default:
      return state;
  }
};

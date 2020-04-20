import { dataTypes } from "../types";

const initialState = {
  posts: null,
  loading: false
};

export default (state = initialState, action) => {
  let newPosts, newPost;

  switch (action.type) {
    case dataTypes.LOADING:
      return { ...state, loading: true };

    case dataTypes.SET_POSTS:
      return { ...state, posts: action.payload, loading: false };

    case dataTypes.APPROVE_POST:
    case dataTypes.DISAPPROVE_POST:
      const { isApprove } = action.payload;
      newPosts = { ...state.posts };
      newPost = { ...newPosts[action.payload.postId] };
      newPost.approveCount += isApprove ? 1 : -1;
      newPosts[action.payload.postId] = newPost;
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
      newPosts = { ...state.posts };
      newPost = { ...newPosts[action.payload.postId] };
      newPost.comments = action.payload.comments;
      newPosts[action.payload.postId] = newPost;
      return {
        ...state,
        posts: newPosts
      };

    case dataTypes.SUBMIT_COMMENT:
      const { comment } = action.payload;
      newPosts = { ...state.posts };
      newPost = { ...newPosts[action.payload.postId] };
      newPost.comments.unshift(comment);
      newPost.commentIds.unshift(comment.id);
      newPost.commentCount++;
      newPosts[action.payload.postId] = newPost;
      return {
        ...state,
        posts: newPosts
      };

    case dataTypes.DELETE_COMMENT:
      const { commentId, postId } = action.payload;
      newPosts = { ...state.posts };
      newPost = { ...newPosts[postId] };

      let { commentCount, commentIds, comments } = newPost;

      commentCount--;
      commentIds.splice(commentIds.indexOf(commentId), 1);
      const newComments = comments.filter(comment => comment.id !== commentId);

      newPost = { ...newPost, commentCount, commentIds, comments: newComments };
      newPosts[postId] = newPost;

      return {
        ...state,
        posts: newPosts
      };

    default:
      return state;
  }
};

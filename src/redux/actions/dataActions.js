import { dataTypes, uiTypes } from "../types";
import axios from "axios";

import { isEmpty } from "../../util/helpers";

// Get all posts
// TODO: Set error
const getPosts = () => dispatch => {
  dispatch({ type: dataTypes.LOADING });
  axios
    .get("/posts")
    .then(res => {
      dispatch({
        type: dataTypes.SET_POSTS,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: dataTypes.SET_POSTS,
        payload: {}
      });
    });
};

// Get a single post
const getPost = id => dispatch => {
  dispatch({ type: uiTypes.SET_LOADING, payload: true });
  axios
    .get(`/post/${id}`)
    .then(res => {
      dispatch({ type: uiTypes.SET_LOADING, payload: false });
      dispatch({ type: dataTypes.SET_POST, payload: res.data });
    })
    .catch(err => {
      console.log(err);
    });
};

// Approve a post
// TODO: Change like/dislike asyncronously
const toggleApprovePost = (postId, isApprove) => dispatch => {
  console.log(postId);

  const type = isApprove ? dataTypes.APPROVE_POST : dataTypes.DISAPPROVE_POST;
  dispatch({
    type,
    payload: {
      postId,
      isApprove
    }
  });
  axios
    .post(`/post/${postId}/approve`, { isApprove })
    .then()
    .catch(err => {
      dispatch({
        type: uiTypes.SET_ERRORS,
        payload: err.response.data
      });
      // If action is unsuccessful, reverse it
      console.log(err);
      const type = isApprove
        ? dataTypes.DISAPPROVE_POST
        : dataTypes.APPROVE_POST;
      dispatch({
        type,
        payload: {
          postId,
          isApprove: !isApprove
        }
      });
    });
};

const deletePost = postId => dispatch => {
  axios
    .delete(`/post/${postId}`)
    .then(() => {
      dispatch({
        type: dataTypes.DELETE_POST,
        payload: postId
      });
    })
    .catch(err => console.log(err));
};

const deleteComment = (commentId, postId) => dispatch => {
  axios
    .delete(`/comment/${commentId}`, { postId })
    .then(() => {
      dispatch({
        type: dataTypes.DELETE_COMMENT,
        payload: commentId
      });
    })
    .catch(err => console.log(err));
};

// Add a post
const addPost = post => dispatch => {
  if (isEmpty(post.body)) {
    dispatch({
      type: uiTypes.SET_ERRORS,
      payload: {
        body: "Must not be empty!"
      }
    });
  }
  dispatch({ type: uiTypes.SET_LOADING, payload: true });
  dispatch(clearErrors());

  axios
    .post("/post", post)
    .then(res => {
      dispatch({ type: uiTypes.SET_LOADING, payload: false });
      dispatch({ type: dataTypes.ADD_POST, payload: res.data });
    })
    .catch(err => {
      dispatch({
        type: uiTypes.SET_ERRORS,
        payload: err.response.data
      });
    });
};

const getComments = postId => dispatch => {
  axios
    .get(`/post/${postId}/comments`)
    .then(res => {
      dispatch({
        type: dataTypes.SET_COMMENTS,
        payload: { postId, comments: res.data }
      });
    })
    .catch(err => console.log(err));
};

const clearErrors = () => dispatch => {
  dispatch({ type: uiTypes.CLEAR_ERRORS });
};

// Submit a comment
const submitComment = (postId, comment) => async dispatch => {
  if (isEmpty(comment.body)) {
    dispatch({
      type: uiTypes.SET_ERRORS,
      payload: {
        comment: "Must not be empty!"
      }
    });
    return { success: false };
  }
  return axios
    .post(`/post/${postId}/comment`, comment)
    .then(res => {
      dispatch(clearErrors());
      dispatch({
        type: dataTypes.SUBMIT_COMMENT,
        payload: { postId, comment: res.data }
      });
      return { success: true };
    })
    .catch(err => {
      dispatch({ type: uiTypes.SET_ERRORS, payload: err.response.data });
      return { success: false };
    });
};

export default {
  getPosts,
  getPost,
  toggleApprovePost,
  deletePost,
  addPost,
  clearErrors,
  getComments,
  submitComment
};

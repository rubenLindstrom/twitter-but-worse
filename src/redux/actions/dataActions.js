import { dataTypes, uiTypes } from "../types";
import axios from "axios";

// Get all posts
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
        payload: []
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
const toggleApprovePost = (id, isApprove) => dispatch => {
  axios
    .post(`/post/${id}/approve`, { isApprove })
    .then(res => {
      console.log(res.data);

      const type = isApprove
        ? dataTypes.APPROVE_POST
        : dataTypes.DISAPPROVE_POST;
      dispatch({
        type,
        payload: res.data
      });
    })
    .catch(err => {
      console.log(err);
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

// Add a post
const addPost = post => dispatch => {
  console.log("add post called");
  dispatch({ type: uiTypes.SET_LOADING, payload: true });
  dispatch({ type: uiTypes.CLEAR_ERRORS });

  return axios
    .post("/post", post)
    .then(res => {
      dispatch({ type: uiTypes.SET_LOADING, payload: false });
      dispatch({ type: dataTypes.ADD_POST, payload: res.data });
      return { success: true };
    })
    .catch(err => {
      dispatch({
        type: uiTypes.SET_ERRORS,
        payload: err.response.data
      });
      return { success: false };
    });
};

const clearErrors = () => dispatch => {
  dispatch({ type: uiTypes.CLEAR_ERRORS });
};

export default {
  getPosts,
  toggleApprovePost,
  deletePost,
  addPost,
  clearErrors
};

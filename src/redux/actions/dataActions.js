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
  dispatch({ type: uiTypes.LOADING });

  axios
    .post("/post", post)
    .then(res => {
      dispatch({ type: dataTypes.ADD_POST, payload: res.data });
      dispatch({ type: uiTypes.CLEAR_ERRORS });
    })
    .catch(err => {
      dispatch({
        type: uiTypes.SET_ERRORS,
        payload: err.response.data
      });
    });
};

export default {
  getPosts,
  toggleApprovePost,
  deletePost,
  addPost
};

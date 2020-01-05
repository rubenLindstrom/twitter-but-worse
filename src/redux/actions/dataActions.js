import { dataTypes } from "../types";
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

export default {
  getPosts,
  toggleApprovePost,
  deletePost
};

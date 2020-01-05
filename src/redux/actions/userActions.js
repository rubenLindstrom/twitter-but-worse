import { userTypes, uiTypes } from "../types";
import axios from "axios";

const setAuthorizationHeader = token => {
  const authToken = `Bearer ${token}`;
  localStorage.setItem("authToken", authToken);
  axios.defaults.headers.common["Authorization"] = authToken;
};

const login = (userData, history) => dispatch => {
  console.log("login called");

  dispatch({ type: uiTypes.LOADING });
  axios
    .post("/login", userData)
    .then(res => {
      setAuthorizationHeader(res.data.token);
      dispatch({ type: uiTypes.CLEAR_ERRORS });
      dispatch(getUserData());
      history.push("/");
    })
    .catch(err => {
      console.log(err);
      dispatch({
        type: uiTypes.SET_ERRORS,
        payload: err.response.data
      });
    });
};

const signup = (userData, history) => dispatch => {
  console.log("signup called");

  dispatch({ type: uiTypes.LOADING });
  axios
    .post("/signup", userData)
    .then(res => {
      dispatch({ type: uiTypes.CLEAR_ERRORS });
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
      history.push("/");
    })
    .catch(err => {
      dispatch({
        type: uiTypes.SET_ERRORS,
        payload: err.response.data
      });
    });
};

const logout = () => dispatch => {
  localStorage.removeItem("authToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: userTypes.SET_UNAUTHENTICATED });
};

const getUserData = () => dispatch => {
  dispatch({ type: userTypes.LOADING });
  axios
    .get("/user")
    .then(res => {
      dispatch({
        type: userTypes.SET_USER,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};

const uploadImage = formData => dispatch => {
  dispatch({ type: userTypes.LOADING });
  axios
    .post("/user/image", formData)
    .then(() => {
      dispatch(getUserData());
    })
    .catch(err => {
      console.log(err);
    });
};

const editDetails = userDetails => dispatch => {
  dispatch({ type: userTypes.LOADING });
  axios
    .patch("/user", userDetails)
    .then(() => {
      dispatch(getUserData());
    })
    .catch(err => console.log(err));
};

export default {
  login,
  getUserData,
  signup,
  logout,
  uploadImage,
  editDetails
};

import { userTypes, uiTypes } from "../types";
import axios from "axios";

const loginUser = (userData, history) => dispatch => {
  dispatch({ type: uiTypes.LOADING });
  const { email, password } = userData;
  axios
    .post("/login", { email, password })
    .then(res => {
      const authToken = `Bearer ${res.data.token}`;
      localStorage.setItem("authToken", authToken);
      axios.defaults.headers.common["Authorization"] = authToken;
      dispatch(getUserData());
      dispatch({ type: uiTypes.CLEAR_ERRORS });
      history.push("/");
    })
    .catch(err => {
      dispatch({
        type: uiTypes.SET_ERRORS,
        payload: err.response.data
      });
    });
};

const getUserData = () => dispatch => {
  axios.get("/user").then(res => {
    dispatch({
      type: userTypes.SET_USER,
      payload: res.data
    });
  });
};

export default {
  loginUser,
  getUserData
};

import axios from "axios";
import { HTTP_CONNECT } from "../../config";
import { USER_LOGIN, USER_REGISTER } from "../constants/auth.constant";

//LOGIN
export const login = (username, password) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(`${HTTP_CONNECT}/auth/login`, {
        username,
        password,
      });

      await dispatch(loginAction(res.data));
    } catch (err) {
      dispatch(loginAction(err.response));
    }
  };
};

const loginAction = (res) => {
  return { type: USER_LOGIN, payload: res };
};

// REGISTER
export const register = (registerInfo) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(
        `${HTTP_CONNECT}/auth/register`,
        registerInfo
      );

      await dispatch(registerAction(res.data));
    } catch (err) {
      dispatch(registerAction(err.response));
    }
  };
};

const registerAction = (res) => {
  return { type: USER_REGISTER, payload: res };
};

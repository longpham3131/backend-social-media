import axios from "axios";
import { HTTP_CONNECT } from "../../config";
import { USER_AUTH, USER_REGISTER } from "./auth.constant";

//LOGIN
export const login = (username, password) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(`${HTTP_CONNECT}/auth/login`, {
        username,
        password,
      });

      await dispatch(loginAction(res));
    } catch (err) {
      dispatch(loginAction(err.response));
    }
  };
};

const loginAction = (res) => {
  return { type: USER_AUTH, payload: res };
};

// REGISTER
export const register = (registerInfo) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(`${HTTP_CONNECT}/auth/register`, {
        username: registerInfo.username,
        password: registerInfo.password,
        email: registerInfo.email,
      });

      await dispatch(registerAction(res));
    } catch (err) {
      dispatch(registerAction(err.response));
    }
  };
};

const registerAction = (res) => {
  return { type: USER_REGISTER, payload: res };
};

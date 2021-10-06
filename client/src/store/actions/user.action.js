import axios from "axios";
import { HTTP_CONNECT } from "config";
import {
  GET_USER_PROFILE,
  UPDATE_PROFILE_FAIL,
  UPDATE_PROFILE_SUCCESS,
} from "store/constants/user.constant";
import { setNotify } from "./common.action";

const config = {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
};

export const getUserProfile = (id) => {
  return async (dispatch) => {
    try {
      const res = await axios.get(
        `${HTTP_CONNECT}/users/${id}`,

        config
      );
      await dispatch(getUserProfileAction(res));
    } catch (err) {
      dispatch(getUserProfileAction(err.response));
    }
  };
};

const getUserProfileAction = (data) => {
  return { type: GET_USER_PROFILE, payload: data };
};

// UPDATE USER
export const updateProfile = (newProfile) => {
  return async (dispatch) => {
    try {
      const res = await axios.put(`${HTTP_CONNECT}/users/`, newProfile, config);
      await dispatch(updateProfileAction(res));
      await dispatch(setNotify(res.status));
    } catch (err) {
      dispatch(setNotify(err.response.status));
    }
  };
};

const updateProfileAction = (data) => {
  return {
    type: UPDATE_PROFILE_SUCCESS,
    payload: data,
  };
};

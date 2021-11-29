import axios from "axios";
import { HTTP_CONNECT } from "config";
import {
  GET_USER_PROFILE,
  UPDATE_PROFILE_FAIL,
  GET_USER_CURRENT_PROFILE,
  UPDATE_PROFILE_SUCCESS,
  FRIEND_REQUEST_SUCCESS,
  FRIEND_REQUEST_RESPONE_SUCCESS,
  GET_FRIEND_REQUEST_SUCCESS,
  UNFRIEND_SUCCESS,
  GET_IMAGE_USE_SUCCESS
} from "store/user/user.constant";
import { useSelector } from "react-redux";
import { setNotify } from "../common/common.action";

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
export const getUserCurrentProfile = () => {
  return async (dispatch) => {
    try {
      const res = await axios.get(
        `${HTTP_CONNECT}/users/profile`,

        config
      );
      await dispatch(getUserCurrentProfileAction(res.data));
    } catch (err) {
      dispatch(getUserCurrentProfileAction(err.response));
    }
  };
};
const getUserProfileAction = (data) => {
  return { type: GET_USER_PROFILE, payload: data };
};
const getUserCurrentProfileAction = (data) => {
  return { type: GET_USER_CURRENT_PROFILE, payload: data };
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

export const friendRequest = (data) => {
  return async (dispatch, getState) => {
    try {
      const profile = getState().userReducer.profileCurentUser;
      const res = await axios.post(
        `${HTTP_CONNECT}/users/friendRequest`,
        data,
        config
      );
      await dispatch(
        friendRequestAction({
          ...data,
          user: { _id: profile._id },
          createAt: Date.now(),
        })
      );
    } catch (err) {
      dispatch(setNotify(err.response));
    }
  };
};
export const friendRequestRespone = (data) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(
        `${HTTP_CONNECT}/users/friendRespone`,
        data,
        config
      );
      if (res.status == 200) {
        await dispatch(getUserCurrentProfile());
      }
    } catch (err) {
      dispatch(setNotify(err.response));
    }
  };
};
export const unfriend = (data) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(
        `${HTTP_CONNECT}/users/unfriend`,
        data,
        config
      );
      if (res.status == 200) {
        await dispatch(unfriendSuccess(data));
      }
    } catch (err) {
      dispatch(setNotify(err.response));
    }
  };
};
const unfriendSuccess = (data) => {
  console.log(data);
  return {
    type: UNFRIEND_SUCCESS,
    payload: data,
  };
};
const friendRequestAction = (data) => {
  console.log(data);
  return {
    type: FRIEND_REQUEST_SUCCESS,
    payload: data,
  };
};
export const getFriendsRequest = (data) => {
  return async (dispatch) => {
    try {
      const res = await axios.get(
        `${HTTP_CONNECT}/users/getFriendRequest`,
        config
      );
      console.log(res, "res");
      await dispatch(getFriendsRequestSuccess(res.data));
    } catch (err) {
      dispatch(setNotify(err.response));
    }
  };
};
const getFriendsRequestSuccess = (data) => {
  return {
    type: GET_FRIEND_REQUEST_SUCCESS,
    payload: data,
  };
};
const friendRequestResponeAction = (data) => {
  return {
    type: FRIEND_REQUEST_RESPONE_SUCCESS,
    payload: data,
  };
};
export const getImageUser = (data) => {
  return async (dispatch) => {
    try {
      const res = await axios.get(
        `${HTTP_CONNECT}/upload/getAllMediaByUserId?userId=${data}`,
        config
      );
      console.log(res, "res");
      await dispatch(getImageUserSuccess(res.data));
    } catch (err) {
      dispatch(setNotify(err.response));
    }
  };
};
const getImageUserSuccess = (data)=>{
  return{
    type:GET_IMAGE_USE_SUCCESS,
    payload:data
  }
}
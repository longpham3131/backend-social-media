import axios from "axios";
import { HTTP_CONNECT } from "config";
import { GET_USER_PROFILE } from "store/constants/user.constant";

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

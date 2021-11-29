import axios from "axios";
import { HTTP_CONNECT } from "config";
import { GET_NOTI_SUCCESS } from "./notification.constant";

import apis from "service";
import { setNotify } from "store/common/common.action";
const config = {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
};

export const getNotifications = () => {
  return async (dispatch) => {
    try {
      const res = await axios.get(`${HTTP_CONNECT}/notification`, config);
      if (res.status === 200) {
        await dispatch(getNotificationsSuccess(res));
      }
    } catch (err) {
      await dispatch(setNotify(err.status));
    }
  };
};
const getNotificationsSuccess = (data) => {
  return { type: GET_NOTI_SUCCESS, payload: data };
};

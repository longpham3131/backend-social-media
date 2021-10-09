import axios from "axios";
import { HTTP_CONNECT } from "config";
const config = {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
};

export const uploadFile = (attachment) => {
  return async (dispatch) => {
    console.log("FILE", attachment);
    try {
      const res = await axios.post(
        `${HTTP_CONNECT}/upload/singleFile`,
        attachment
      );
      console.log("HEEYY", res);
    } catch (err) {
      return console.log("ERRR", err.response);
    }
  };
};

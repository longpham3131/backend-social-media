import axios from "axios";

const config = {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
};

export const uploadFile = (attachment) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(
        `https://uploadfile0510.herokuapp.com/api/upload/singleFile`,
        attachment
      );
      console.log("HEEYY", res);
    } catch (err) {
      return console.log("ERRR", err.response);
    }
  };
};

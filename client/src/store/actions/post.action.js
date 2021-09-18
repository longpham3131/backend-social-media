import axios from "axios";
import { HTTP_CONNECT } from "config";
import { GET_POST_LIST } from "store/constants/post.constant";

const config = {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
};

export const getPostList = (limit) => {
  return async (dispatch) => {
    try {
      const res = await axios.get(
        `${HTTP_CONNECT}/post?limitPost=${limit}`,

        config
      );
      await dispatch(getPostListAction(res));
    } catch (err) {
      dispatch(getPostListAction(err.response));
    }
  };
};

const getPostListAction = (data) => {
  return { type: GET_POST_LIST, payload: data };
};

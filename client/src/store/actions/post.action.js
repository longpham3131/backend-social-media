import axios from "axios";
import { HTTP_CONNECT } from "config";
import {
  CREATE_POST_SUCCESS,
  CREATE_POST_FAIL,
  EDIT_POST_SUCCESS,
  EDIT_POST_FAIL,
  DELETE_POST_SUCCESS,
  DELETE_POST_FAIL,
  GET_POST_LIST,
} from "store/constants/post.constant";

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

export const createPost = (post) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(`${HTTP_CONNECT}/post`, post, config);
      if (res.status === 200) {
        await dispatch(createPostAction(true, res));
      }
    } catch (err) {
      dispatch(createPostAction(false, err.response));
    }
  };
};

const createPostAction = (isSuccess, data) => {
  return {
    type: isSuccess ? CREATE_POST_SUCCESS : CREATE_POST_FAIL,
    payload: data,
  };
};

export const deletePost = (postId) => {
  return async (dispatch) => {
    try {
      const res = await axios.delete(
        `${HTTP_CONNECT}/post/delete/${postId}`,
        config
      );
      if (res.status === 200) {
        await dispatch(detelePostAction(true, res));
      }
    } catch (err) {
      dispatch(detelePostAction(false, err.response));
    }
  };
};

const detelePostAction = (isSuccess, data) => {
  return {
    type: isSuccess ? DELETE_POST_SUCCESS : DELETE_POST_FAIL,
    payload: data,
  };
};

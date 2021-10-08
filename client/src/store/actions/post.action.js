import axios from "axios";
import { HTTP_CONNECT } from "config";
import {
  CREATE_POST_SUCCESS,
  EDIT_POST_SUCCESS,
  DELETE_POST_SUCCESS,
  GET_POST_LIST,
  LIKE_POST,
  LIKE_POST_SUCCESS
} from "store/constants/post.constant";
import apis from "service";
import { setNotify } from "./common.action";
const config = {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
};

export const getPostList = (limit) => {
  return async (dispatch) => {
    try {
      const res = await apis.post.getPostList(limit);
      await dispatch(getPostListAction(res));
    } catch (err) {
      dispatch(getPostListAction(err.response));
    }
  };
};

// export const getPostList = (limit) => {
//   return async (dispatch) => {
//     try {
//       const res = await axios.get(
//         `${HTTP_CONNECT}/post?limitPost=${limit}`,

//         config
//       );
//       await dispatch(getPostListAction(res));
//     } catch (err) {
//       dispatch(getPostListAction(err.response));
//     }
//   };
// };

const getPostListAction = (data) => {
  return { type: GET_POST_LIST, payload: data };
};

export const createPost = (post) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(`${HTTP_CONNECT}/post`, post, config);
      await dispatch(createPostAction(res));
      await dispatch(setNotify(res.status));
    } catch (err) {
      await dispatch(setNotify(err.response.status));
    }
  };
};

const createPostAction = (data) => {
  return {
    type: CREATE_POST_SUCCESS,
    payload: data,
  };
};

export const editPost = (post) => {
  return async (dispatch) => {
    try {
      const res = await axios.put(`${HTTP_CONNECT}/post`, post, config);
      if (res.status === 200) {
        await dispatch(editPostAction(res));
        await dispatch(setNotify(res.status));
      }
    } catch (err) {
      // console.log(err.response);
      dispatch(setNotify(err.response.status));
    }
  };
};

const editPostAction = (data) => {
  return {
    type: EDIT_POST_SUCCESS,
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
        await dispatch(detelePostAction(res));
        await dispatch(setNotify(res.status));
      }
    } catch (err) {
      await dispatch(setNotify(err.response.status));
    }
  };
};

export const likePost = (postId) => {
  return async (dispatch) => {
    try {
      const res = await axios.get(
        `${HTTP_CONNECT}/post/likepost/${postId}`,
        config
      );
      if (res.status === 200) {
        await dispatch(likePostSuccess(res.data));
      }
    } catch (err) {
      await dispatch(setNotify(err.response.status));
    }
  };
};

const likePostSuccess = (data) => {
  return {
    type: LIKE_POST_SUCCESS,
    payload: data,
  };
};


const detelePostAction = (data) => {
  return {
    type: DELETE_POST_SUCCESS,
    payload: data,
  };
};

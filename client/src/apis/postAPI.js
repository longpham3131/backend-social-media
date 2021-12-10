import axios from "axios";
import { HTTP_CONNECT } from "@/config";
const BASE_URL = `${HTTP_CONNECT}/post`;
const config = {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
};
const postAPI = {
  getPostList(params) {
    const url = `${BASE_URL}`;
    return axios.get(url, {
      params: {
        limitPost: params.limitPost,
        index: params.index,
        profile: params.profile,
        userId: params.userId,
      },
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  createPost(data) {
    const url = `${BASE_URL}`;
    return axios.post(url, data, config);
  },
  editPost(data) {
    const url = `${BASE_URL}`;
    return axios.put(url, data, config);
  },
  deletePost(postId) {
    const url = `${BASE_URL}/delete/${postId}`;
    return axios.delete(url, config);
  },
  likePost(postId) {
    const url = `${BASE_URL}/likepost/${postId}`;
    return axios.get(url, config);
  },
  comment(data) {
    const url = `${HTTP_CONNECT}/comment`;
    return axios.post(url, data, config);
  },
  likeComment(data) {
    const url = `${HTTP_CONNECT}/comment/likeComment`;
    return axios.post(url, data, config);
  },
  deleteComment(data) {
    const url = `${HTTP_CONNECT}/comment`;
    return axios.delete(url, data, config);
  },
  editComment(data) {
    const url = `${HTTP_CONNECT}/comment`;
    return axios.put(url, data, config);
  },
};

export default postAPI;

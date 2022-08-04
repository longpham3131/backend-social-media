import axios from "axios";
import { HTTP_CONNECT } from "@/config";
const BASE_URL = `${HTTP_CONNECT}/post`;
const postAPI = {
  getPostList(params) {
    const url = `${BASE_URL}`;
    return axios.get(url, {
      params: {
        limitPost: params.limitPost,
        index: params.index,
        userId: params.userId,
        groupId: params.groupId,
        postId: params?.postId ?? undefined,
      },
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  getPostById(postId) {
    const url = `${BASE_URL}/getPostById/${postId}`;
    return axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  createPost(data) {
    const url = `${BASE_URL}`;
    return axios.post(url, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  editPost(data) {
    const url = `${BASE_URL}`;
    return axios.put(url, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  deletePost(postId) {
    const url = `${BASE_URL}/delete/${postId}`;
    return axios.delete(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  likePost(postId) {
    const url = `${BASE_URL}/likepost/${postId}`;
    return axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  comment(data) {
    const url = `${HTTP_CONNECT}/comment`;
    return axios.post(url, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  likeComment(data) {
    const url = `${HTTP_CONNECT}/comment/likeComment`;
    return axios.post(url, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  deleteComment(data) {
    const url = `${HTTP_CONNECT}/comment/commentDelete`;
    return axios.post(url, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  editComment(data) {
    const url = `${HTTP_CONNECT}/comment`;
    return axios.put(url, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  getPostByImgId(imgId) {
    const url = `${BASE_URL}/getPostByIdImage/${imgId}`;
    return axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  getPhotosRelate(keySearch){
    const url = `${BASE_URL}/ultimateSearch/${keySearch}`;
    return axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  }
};

export default postAPI;

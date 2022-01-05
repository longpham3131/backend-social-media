import { HTTP_CONNECT } from "@/config";
import axios from "axios";
import { useSelector } from "react-redux";
const BASE_URL = `${HTTP_CONNECT}/users`;
const config = {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
};

const userAPI = {
  getProfile(userId) {
    const url = `${BASE_URL}/${userId}`;
    return axios.get(url, config);
  },
  getMyProfile() {
    const url = `${BASE_URL}/profile`;
    return axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  updateProfile(newProfile) {
    const url = `${BASE_URL}`;
    return axios.put(url, newProfile, config);
  },
  friendRequest(data) {
    const url = `${BASE_URL}/friendRequest`;
    return axios.post(url, data, config);
  },
  friendRespone(data) {
    const url = `${BASE_URL}/friendRespone`;
    return axios.post(url, data, config);
  },
  unfriend(data) {
    const url = `${BASE_URL}/unfriend`;
    return axios.post(url, data, config);
  },
  getFriendsRequest() {
    const url = `${BASE_URL}/getFriendRequest`;
    return axios.get(url, config);
  },
  getImageUser(data) {
    const url = `${HTTP_CONNECT}/upload/getAllMediaByUserId?userId=${data}`;
    return axios.get(url, config);
  },
  getSearch(keySearch) {
    const url = `${BASE_URL}/search/${keySearch}`;
    return axios.get(url, config);
  },
  checkInAtivity(){
    const url = `${HTTP_CONNECT}/admin/checkInActivity`;
    return axios.get(url, config);
  }
};

export default userAPI;

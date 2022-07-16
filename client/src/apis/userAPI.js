import { HTTP_CONNECT } from "@/config";
import axios from "axios";

const BASE_URL = `${HTTP_CONNECT}/users`;

const userAPI = {
  getProfile(userId) {
    const url = `${BASE_URL}/${userId}`;
    return axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  getMyProfile() {
    const url = `${BASE_URL}/profile`;
    return axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  getFriends(id) {
    const url = `${BASE_URL}/getFriends/${id}`;
    return axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  updateProfile(newProfile) {
    const url = `${BASE_URL}`;
    return axios.put(url, newProfile, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  friendRequest(data) {
    const url = `${BASE_URL}/friendRequest`;
    return axios.post(url, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  friendRespone(data) {
    const url = `${BASE_URL}/friendRespone`;
    return axios.post(url, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  unfriend(data) {
    const url = `${BASE_URL}/unfriend`;
    return axios.post(url, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  getFriendsRequest() {
    const url = `${BASE_URL}/getFriendRequest`;
    return axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  getImageUser(userId) {
    const url = `${HTTP_CONNECT}/upload/getAllMediaByUserId?userId=${userId}`;
    return axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  getSearch(keySearch) {
    const url = `${BASE_URL}/search/${keySearch}`;
    return axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  getSearch2({ page, pageSize, searchKey }) {
    const url = `${BASE_URL}/v2/search?pageSize=${pageSize}&page=${page}&searchKey=${searchKey}`;
    return axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  checkInAtivity() {
    const url = `${HTTP_CONNECT}/admin/checkInActivity`;
    return axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  updatePassword(data) {
    const url = `${BASE_URL}/changePassword`;
    return axios.post(url, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  getMembers() {
    const url = `${BASE_URL}/getUsers2?page=0&pageSize=1000`;
    return axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  getSuggestedFriends() {
    const url = `${BASE_URL}/recommendFriends`;
    return axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
};

export default userAPI;

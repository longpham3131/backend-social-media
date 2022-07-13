import { HTTP_CONNECT } from "@/config";
import axios from "axios";
const BASE_URL = `${HTTP_CONNECT}/group`;

const groupAPI = {
  getAllGroups() {
    const url = `${BASE_URL}`;
    return axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  getGroupJoinedByUserId(userID) {
    const url = `${BASE_URL}/getGroupUserJoined/${userID}`;
    return axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  getGroupDetail(groupId) {
    const url = `${BASE_URL}/getGroupDetail/${groupId} `;
    return axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  getUserWithoutGroup(groupId) {
    const url = `${BASE_URL}/getUsersNotJoinedGroup/${groupId} `;
    return axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  getImagesGroup(groupId) {
    const url = `${BASE_URL}/getImages/${groupId} `;
    return axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },

  createGroup(data) {
    const url = `${BASE_URL}`;
    return axios.post(url, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  inviteUser(data) {
    const url = `${BASE_URL}/inviteToGroup`;
    return axios.post(url, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  updateRole(data) {
    const url = `${BASE_URL}/updateRoleMember`;
    return axios.post(url, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  kickMember(data) {
    const url = `${BASE_URL}/kickOutOfGroup`;
    return axios.post(url, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  responseRequestJoin(data) {
    const url = `${BASE_URL}/joinGroup`;
    return axios.post(url, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  responeIntiveToGroup(data) {
    const url = `${BASE_URL}/responeIntiveToGroup`;
    return axios.post(url, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  requestJoinGroup(data) {
    const url = `${BASE_URL}/requestJoinGroup`;
    return axios.post(url, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  requestLeaveGroup(groupId) {
    const url = `${BASE_URL}/requestQuitGroup/${groupId} `;
    return axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  updateGroupInfo(data) {
    const url = `${BASE_URL}`;
    return axios.put(url, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  deleteGroup(groupId) {
    const url = `${BASE_URL}/${groupId}`;
    return axios.delete(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
};

export default groupAPI;

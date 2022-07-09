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
};

export default groupAPI;

import { HTTP_CONNECT } from "@/config";
import axios from "axios";
const BASE_URL = `${HTTP_CONNECT}/group`;
const config = {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
};

const groupAPI = {
  getAllGroups() {
    const url = `${BASE_URL}`;
    return axios.get(url, config);
  },
  getMyGroup() {
    const url = `${BASE_URL}/getGroupUserJoined`;
    return axios.get(url, config);
  },
  getGroupDetail(groupId) {
    const url = `${BASE_URL}/getGroupDetail/${groupId} `;
    return axios.get(url, config);
  },
};

export default groupAPI;

import axios from "axios";
import { HTTP_CONNECT } from "@/config";
const BASE_URL = `${HTTP_CONNECT}/notification`;
const config = {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
};
const notificationAPI = {
  getNotify() {
    const url = `${BASE_URL}`;
    return axios.get(url, config);
  },
  seenNotify(id){
    const url = `${BASE_URL}/notificationSeen/${id}`;
    return axios.get(url, config);
  }
};

export default notificationAPI;

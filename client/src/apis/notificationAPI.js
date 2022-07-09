import axios from "axios";
import { HTTP_CONNECT } from "@/config";
const BASE_URL = `${HTTP_CONNECT}/notification`;
const notificationAPI = {
  getNotify() {
    const url = `${BASE_URL}`;
    return axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  seenNotify(id) {
    const url = `${BASE_URL}/notificationSeen/${id}`;
    return axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
};

export default notificationAPI;

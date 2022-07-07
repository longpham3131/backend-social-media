import { HTTP_CONNECT } from "@/config";
import axios from "axios";
import { useSelector } from "react-redux";
const BASE_URL = `${HTTP_CONNECT}/group`;
const config = {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
};

const groupAPI = {
  getAllGroups() {
    const url = `${BASE_URL}`;
    return axios.get(url, config);
  },
};

export default groupAPI;

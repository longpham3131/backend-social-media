import axios from "axios";
import { HTTP_CONNECT } from "config";
const BASE_URL = `${HTTP_CONNECT}/auth`;
const authAPI = {
    login(data){
        const url =`${BASE_URL}/login`;
        return axios.post(url, data);
    },
    register(data){
        const url =`${BASE_URL}/register`;
        return axios.post(url, data);
    }
}

export default authAPI;
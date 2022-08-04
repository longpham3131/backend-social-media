import axios from "axios";
import { HTTP_CONNECT } from "@/config";
const BASE_URL = `${HTTP_CONNECT}/auth`;
const authAPI = {
    login(data){
        const url =`${BASE_URL}/login`;
        return axios.post(url, data);
    },
    register(data){
        const url =`${BASE_URL}/register`;
        return axios.post(url, data);
    },
    sendCode(data){
        const url =`${BASE_URL}/forgetPassword`;
        return axios.post(url, data);
    },
    changePasswordByCode(data){
        const url =`${BASE_URL}/changePasswordByCode`;
        return axios.post(url, data); 
    },
    verifyCode(data){
        const url =`${BASE_URL}/verifyCode`;
        return axios.post(url, data);
    },
}

export default authAPI;
import axios from "axios";

const BASE_URL = `https://api.chatengine.io`;
const authObject = {
  "PRIVATE-KEY": "4c09f7e7-aee2-47fb-9a92-c1d3b3532c6d",
};
const chatAPI = {
  registerUser(data) {
    const url = `${BASE_URL}/users`;
    return axios.post(url, data, { headers: authObject });
  },
  updateUser(data, avatarForChat) {
    const url = `${BASE_URL}/users/me`;
    const { username, password, fullName } = data;

    let formData = new FormData();
    formData.append("username", username);
    formData.append("first_name", "");
    formData.append("last_name", fullName);
    formData.append("secret", password);
    if (avatarForChat) {
      formData.append("avatar", avatarForChat);
    }
    return axios.patch(url, formData, {
      headers: {
        "Project-ID": "3908f871-d99f-49c8-a920-0dde0a608682",
        "User-Name": username,
        "User-Secret": password,
      },
    });
  },
  changePassword(userChatId, newPass) {
    const url = `${BASE_URL}/users/${userChatId}`;
    let formData = new FormData();
    formData.append("secret", newPass);

    return axios.patch(url, formData, {
      headers: authObject,
    });
  },
  getUser() {
    const url = `${BASE_URL}/users`;
    return axios.get(url, { headers: authObject });
  },
};

export default chatAPI;

import axios from "axios";
const addressAPI = {
  getProvinces(codeProvince) {
    const url = `https://provinces.open-api.vn/api/p/${
      codeProvince ?? ""
    }?depth=2`;
    return axios.get(url);
  },
};

export default addressAPI;

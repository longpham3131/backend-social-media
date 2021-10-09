import axios from "axios";
import get from "lodash/get";
import isNil from "lodash/isNil";
import { HTTP_CONNECT } from "config";

const FIXED_DOMAIN = process.env.REACT_APP_FIXED_DOMAIN;

// const UPLOAD_HEADER = {
//   accept: "application/json",
//   "Accept-Language": "en-US,en;q=0.8",
//   "Content-Type": "application/binary",
// };

class BaseApi {
  constructor(opts = {}) {
    Object.assign(this, opts);

    const baseURL = 'http://localhost:4000/api';

    this.client = axios.create({
      timeout: 120000,
    });

    this.client.interceptors.response.use(
      (response) => {
        const { code } = response.data;
        if (code === 401) {
          if (window.location.hostname.split(".").length === 2) {
            window.location.pathname = "/";
          } else {
            window.location = `https://${FIXED_DOMAIN}`;
          }
        }
        return response;
      },
      (error) => {
        if (error?.response?.status === 401) {
          if (window.location.hostname.split(".").length === 2) {
            window.location.pathname = "/";
          } else {
            window.location = `https://${FIXED_DOMAIN}`;
          }
        }
        // console.log("Error status", error?.response?.status);
      }
    );

    if (baseURL) {
      this.client.defaults.baseURL = baseURL;
    }
  }

  static getInstance() {
    return new BaseApi();
  }

  static buildOptions(method, url, params = {}, headers = { Authorization: `Bearer ${localStorage.getItem("token")}` }) {
    return {
      method,
      url,
      params,
      headers,
    };
  }

  setBaseURL(baseURL) {
    this.client.defaults.baseURL = baseURL;
  }

  setClearCallback(clearStore) {
    this.clearStore = clearStore;
  }

  clearSession() {
    if (this.clearStore) {
      this.clearStore();
    }
  }

  setDefaultHeader(key, value) {
    this.client.defaults.headers[key] = value;
  }


  setDefaultHeaders(headers) {
    this.client.defaults.headers = {
      ...this.client.defaults.headers,
      ...headers,
    };
  }

  async request(opts) {
    const requestOpts = BaseApi.preRequest(opts);

    return this.client(requestOpts)
      .then((response) => BaseApi.preResponse(response, requestOpts))
      .catch((error) => {
        return BaseApi.preResponse(error, requestOpts);
      });
  }

  async delete(uri, params, headers) {
    const opts = BaseApi.buildOptions("delete", uri, params, headers);
    opts.data = params;
    return this.request(opts);
  }

  async get(uri, params, headers) {
    const opts = BaseApi.buildOptions("get", uri, params, headers);
    return this.request(opts);
  }

  async post(uri, payload, params, headers) {
    const opts = BaseApi.buildOptions("post", uri, params, headers);

    opts.data = payload;
    return this.request(opts);
  }

  async put(uri, payload, params, headers) {
    const opts = BaseApi.buildOptions("put", uri, params, headers);

    opts.data = payload;

    return this.request(opts);
  }

//   async upload(uri, file) {
//     return this.client
//       .post(uri, file, { headers: UPLOAD_HEADER })
//       .then((response) => BaseApi.preResponse(response, {}))
//       .catch((error) => BaseApi.preResponse(error, {}));
//   }

  static preRequest(opts) {
    return {
      ...opts,
    };
  }

  static processError(rawResponse) {
    const {
      response: { data },
    } = rawResponse;
    const { error, message } = data;

    if (error) {
      throw Object.assign(error, { data: message });
    }
    throw message;
  }

  static preResponse(rawResponse) {
    if (rawResponse?.response || rawResponse?.code) {
      BaseApi.processError(rawResponse);
    }

    const status =
      get(rawResponse, ["status"]) || get(rawResponse, ["response", "status"]);
    let data;
    let error;
    switch (status) {
      case 200:
      case 201:
        data = get(rawResponse, ["data", "data"]) || get(rawResponse, ["data"]);
        const besideData = get(rawResponse, ["data"]);
        if (besideData && besideData.code && besideData.message) {
          data = {
            data: data,
            code: besideData.code,
            message: besideData.message,
          };
        }
        break;
      case 400:
        error = "400 Bad Request Error";
        break;
      case 401:
        this.clearSession();
        error = "401 Unauthorize";
        break;
      case 402:
        error = "402 Unauthorize";
        break;
      case 403:
        error = "403 Forbidden";
        break;
      case 404:
        error = "404 Not Found";
        break;
      default:
        error = "Unknown Error";
    }

    if (isNil(error)) return data;

    // eslint-disable-next-line no-console
    console.error(rawResponse);
    throw error;
  }
}

export default BaseApi.getInstance();

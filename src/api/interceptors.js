import axios from "axios";

import config from "../config";
import { getLocalStorage, removeLocalStorage } from "../helpers";

axios.interceptors.request.use(
  async (config) => {
    const token = await getLocalStorage("sid");
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => Promise.resolve(response),
  (err) => {
    const {
      response: { status, data },
    } = err;
    const { url, method } = config.paths.getToken;

    if (
      err.response.request.responseURL ===
        `${config.app.apiHost}${config.paths.getToken.url}` &&
      data.status !== 200
    ) {
      removeLocalStorage("sid");
      removeLocalStorage("rid");
      window.location.reload();
    }

    if (status === 403 && data.message === "Forbidden") {
      return axios({
        url: `${config.app.apiHost}${url}`,
        method: method,
        data: { refreshToken: localStorage.getItem("rid") },
      }).then((response) => {
        localStorage.setItem("sid", response && response.data.token);
        err.response.config.headers["Authorization"] =
          response && response.data.token;
        return axios(err.response.config);
      });
    }

    return Promise.reject(err);
  }
);

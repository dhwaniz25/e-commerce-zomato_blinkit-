import axios from "axios";
import SummaryApi, { baseURL } from "../common/SummaryApi";

const Axios = axios.create({
  baseURL: baseURL,
  withCredentials: true, //as we have cookies in the requestion sending
});

//sending access token in the headers
Axios.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Axios.interceptors.request.use(
  (response) => {
    return response;
  },
  async (error) => {
    let originalRequest = error.config;
    if (error.response.status === 400 && !originalRequest.retry) {
      originalRequest.retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        const newAccessToken = await refreshAccessToken(refreshToken);
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return Axios(originalRequest);
        }
      }
    }
    return Promise.reject(error);
  }
);

const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await Axios({
      ...SummaryApi.refreshToken,
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    const accessToken = response.data.data.accessToken;
    localStorage.setItem("accessToken", accessToken);
    return accessToken;
    console.log(response);
  } catch (error) {
    console.log("Error occured while fetching refresh token", error.message);
  }
};

export default Axios;

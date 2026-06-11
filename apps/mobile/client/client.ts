import axios from "axios";
import { router } from "expo-router";

export const apiClient = axios.create({
  baseURL: "BE URL",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      router.replace("/login");
    }
    return Promise.reject(error);
  },
);

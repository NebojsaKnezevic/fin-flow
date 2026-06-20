import axios from "axios";
import { router } from "expo-router";
import { Notify } from "../helpers/toast.helper";

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axios.interceptors.response.use(
  function (response) {
    // Notify.success(JSON.stringify(response));
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      Notify.error(JSON.stringify(error));
      router.replace("/login");
    }
    return Promise.reject(error);
  },
);

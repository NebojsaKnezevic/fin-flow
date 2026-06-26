import axios from "axios";
import { router } from "expo-router";
import { Notify } from "../helpers/toast.helper";
import * as SecureStore from "expo-secure-store";

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    // console.log(config);
    try {
      const token = await SecureStore.getItemAsync("user_token");
      Notify.success(JSON.stringify(token));
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      Notify.error(
        "Error fetching token from expo-secure-store" + JSON.stringify(error),
      );
    }

    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);

apiClient.interceptors.response.use(
  function (response) {
    // Notify.success(JSON.stringify(response));
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      Notify.error(JSON.stringify(error));
      router.replace("/login");
    }
    return Promise.reject(`axios` + error);
  },
);

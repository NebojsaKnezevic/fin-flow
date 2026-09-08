import axios from "axios";
import { router } from "expo-router";
import { Notify } from "../helpers/toast.helper";
import * as SecureStore from "expo-secure-store";

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 155000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    // console.log(config);
    try {
      const token = await SecureStore.getItemAsync("user_token");
      // Notify.success(JSON.stringify(token));
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      //================ IMAGE MIME TYPE ====================
      //Expo camera always returns image/jpeg
      if (config.url?.endsWith("/expenses/createExpenseAI")) {
        config.headers["X-Image-Mime-Type"] = "image/jpeg";
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

    if (error.status === 401) {
      SecureStore.deleteItemAsync("user_token");
    }
    return Promise.reject(`axios` + error);
  },
);

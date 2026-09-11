import axios from "axios";
import { tokenStorage } from "@/lib/tokenStorage";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const apiClient = axios.create({ baseURL: BASE_URL });
const rawClient = axios.create({ baseURL: BASE_URL });

apiClient.interceptors.request.use(async (config) => {
  const token = await tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue: Array<() => void> = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        await new Promise<void>((resolve) => pendingQueue.push(resolve));
        return apiClient(originalRequest);
      }

      isRefreshing = true;
      try {
        const refreshToken = await tokenStorage.getRefreshToken();
        const { data } = await rawClient.post("/auth/refresh-token", {
          refreshToken,
        });
        await tokenStorage.setTokens(data.accessToken, data.refreshToken);
        pendingQueue.forEach((resolve) => resolve());
        pendingQueue = [];
        return apiClient(originalRequest);
      } catch (refreshError) {
        await tokenStorage.clear();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

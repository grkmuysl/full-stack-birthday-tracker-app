import axios from "axios";
import { tokenStorage } from "@/lib/tokenStorage";
import { toast } from "sonner";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiClient = axios.create({ baseURL: BASE_URL });

const rawClient = axios.create({ baseURL: BASE_URL });

// add access token to each request if it exists in localStorage
apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// if returns 401, get new token with refresh token and retry the request
let isRefreshing = false;
let pendingQueue: Array<() => void> = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // If a refresh request is already in progress, wait for it to complete
        await new Promise<void>((resolve) => pendingQueue.push(resolve));
        return apiClient(originalRequest);
      }

      isRefreshing = true;
      try {
        const refreshToken = tokenStorage.getRefreshToken();
        const { data } = await rawClient.post("/auth/refresh-token", {
          refreshToken,
        });
        tokenStorage.setTokens(data.accessToken, data.refreshToken);
        pendingQueue.forEach((resolve) => resolve());
        pendingQueue = [];
        return apiClient(originalRequest);
      } catch (refreshError) {
        tokenStorage.clear();
        toast.error("Token expired. Please log in again.");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

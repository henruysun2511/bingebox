import { useAuthStore } from "@/stores/useAuthStore";
import axios, { InternalAxiosRequestConfig } from "axios";
import qs from "qs";

export const refreshApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: { Accept: "application/json" },
});

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: { Accept: "application/json" },
  paramsSerializer: (params) =>
    qs.stringify(params, { arrayFormat: "repeat" }),
});

// ===== Request interceptor =====
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// ===== Refresh token handling =====
let isRefreshing = false;
let queue: ((token: string) => void)[] = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {

      // ✅ FIX 1: Nếu chính refresh-token bị 401 → logout ngay, không retry
      if (originalRequest.url?.includes("/auth/refresh-token")) {
        useAuthStore.getState().logout();
        localStorage.removeItem("auth-storage");
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          queue.push((token: string) => {
            originalRequest.headers!.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const res = await refreshApi.post("/auth/refresh-token");
        const newToken = res.data.data.accessToken;

        // ✅ FIX 2: Sync token vào cả store lẫn cookie cùng lúc
        useAuthStore.getState().setAccessToken(newToken);

        queue.forEach((cb) => cb(newToken));
        queue = [];

        originalRequest.headers!.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        queue = [];
        useAuthStore.getState().logout();
        localStorage.removeItem("auth-storage");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import api from "./api";
import { useAuthStore } from "@/stores/authStore";
import { authService } from "./authService";

/**
 * Queue pattern for token refresh:
 * When multiple requests fail with 401 simultaneously,
 * only ONE refresh call is made. Others wait for its result.
 */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
}

/**
 * Call once at app startup to attach request/response interceptors.
 * Separated from api.ts to avoid circular dependency with authStore.
 */
export function setupInterceptors() {
  // --- Request Interceptor ---
  // Attach Bearer token to every request (if available)
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = useAuthStore.getState().accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  // --- Response Interceptor ---
  // On 401: attempt token refresh, then retry the original request
  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // Only intercept 401s, and don't retry the refresh endpoint itself
      if (
        error.response?.status !== 401 ||
        originalRequest._retry ||
        originalRequest.url?.includes("/auth/refresh")
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Another refresh is in progress — queue this request
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await authService.refreshToken();
        const result = response.data;

        if (result.success) {
          const newToken = result.data.accessToken;
          useAuthStore.getState().setAccessToken(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          processQueue(null, newToken);
          return api(originalRequest);
        } else {
          // Refresh failed — log user out
          useAuthStore.getState().setAccessToken(null);
          processQueue(new Error("Refresh failed"), null);
          return Promise.reject(error);
        }
      } catch (refreshError) {
        useAuthStore.getState().setAccessToken(null);
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );
}

import api from "./api";
import type { ApiResponse } from "@/types/api";
import type { AuthDTO, LoginRequest, RegisterRequest } from "@/types/auth";

/**
 * Auth API service — handles all authentication-related HTTP calls.
 * Business logic (state updates, redirects) belongs in the store, not here.
 */
export const authService = {
  login(data: LoginRequest) {
    return api.post<ApiResponse<AuthDTO>>("/auth/login", data);
  },

  register(data: RegisterRequest) {
    return api.post<ApiResponse<boolean>>("/auth/register", data);
  },

  refreshToken() {
    return api.post<ApiResponse<AuthDTO>>("/auth/refresh");
  },

  logout() {
    return api.post<ApiResponse<boolean>>("/auth/logout");
  },

  forgetPassword(email: string) {
    return api.post<ApiResponse<boolean>>(
      `/auth/forget-password?email=${encodeURIComponent(email)}`
    );
  },
};

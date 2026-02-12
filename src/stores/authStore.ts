import { create } from "zustand";
import { authService } from "@/services/authService";
import type { LoginRequest, RegisterRequest } from "@/types/auth";
import { getErrorMessage } from "@/types/api";

interface AuthState {
  /** JWT access token — stored in memory only */
  accessToken: string | null;
  /** Whether the initial auth check (refresh) has completed */
  isInitialized: boolean;
  /** Loading state for auth operations */
  isLoading: boolean;

  // --- Derived ---
  isAuthenticated: boolean;

  // --- Actions ---
  setAccessToken: (token: string | null) => void;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

/**
 * Auth store — manages authentication state.
 *
 * - `accessToken` luu trong memory (Zustand), mat khi reload page
 * - Khi app mount, goi `initialize()` -> POST /auth/refresh de restore session
 * - Login/Register throw error voi message tieng Viet de component bat va hien thi
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  isInitialized: false,
  isLoading: false,
  isAuthenticated: false,

  setAccessToken: (token) =>
    set({ accessToken: token, isAuthenticated: !!token }),

  login: async (data) => {
    set({ isLoading: true });
    try {
      const response = await authService.login(data);
      const result = response.data;

      if (!result.success) {
        throw new Error(getErrorMessage(result.message));
      }

      set({
        accessToken: result.data.accessToken,
        isAuthenticated: true,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      const response = await authService.register(data);
      const result = response.data;

      if (!result.success) {
        throw new Error(getErrorMessage(result.message));
      }
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      set({
        accessToken: null,
        isAuthenticated: false,
      });
    }
  },

  initialize: async () => {
    // Don't re-initialize if already done or if already authenticated
    if (get().isInitialized) return;

    try {
      const response = await authService.refreshToken();
      const result = response.data;

      if (result.success) {
        set({
          accessToken: result.data.accessToken,
          isAuthenticated: true,
        });
      }
    } catch {
      // Refresh failed — user is not logged in, that's fine
    } finally {
      set({ isInitialized: true });
    }
  },
}));

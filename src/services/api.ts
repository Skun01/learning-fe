import axios from "axios";

const API_BASE_URL = "http://localhost:5246";

/**
 * Axios instance pre-configured for the backend API.
 *
 * - `withCredentials: true` ensures HttpOnly cookies (refreshToken) are sent
 * - Interceptors are attached separately in `setupInterceptors()`
 *   to avoid circular dependency with authStore
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

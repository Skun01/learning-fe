/**
 * Auth request/response DTOs — matches backend contracts
 */

// === Request DTOs ===

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// === Response DTOs ===

export interface AuthDTO {
  accessToken: string;
}

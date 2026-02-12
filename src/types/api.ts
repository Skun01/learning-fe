/**
 * Generic API response wrapper — matches backend ApiResponse<T>
 */
export interface ApiResponse<T> {
  code: number;
  success: boolean;
  message: string | null;
  data: T;
  metaData?: ApiMetaData;
}

/**
 * Pagination metadata
 */
export interface ApiMetaData {
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Backend error codes — keys match the actual `message` field
 * returned by the API (e.g. "Invalid_400", not "INVALID_LOGIN").
 */
export type ApiErrorCode =
  | "Common_404"
  | "Common_400"
  | "Common_401"
  | "Common_405"
  | "Common_505"
  | "Invalid_400"
  | "Email_Exist_409"
  | "Token_Expried_409";

/**
 * Map backend error codes → Vietnamese user-facing messages
 */
export const ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  Common_404: "Không tìm thấy dữ liệu",
  Common_400: "Dữ liệu không hợp lệ",
  Common_401: "Phiên đăng nhập đã hết hạn",
  Common_405: "Bạn không có quyền thực hiện hành động này",
  Common_505: "Đã xảy ra lỗi, vui lòng thử lại sau",
  Invalid_400: "Email hoặc mật khẩu không đúng",
  Email_Exist_409: "Email đã được sử dụng",
  Token_Expried_409: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
};

/**
 * Get user-friendly error message from API error code
 */
export function getErrorMessage(code: string | null): string {
  if (!code) return "Đã xảy ra lỗi không xác định";
  return ERROR_MESSAGES[code as ApiErrorCode] ?? "Đã xảy ra lỗi không xác định";
}

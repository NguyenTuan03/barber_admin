export interface ApiResponseSuccess<T = unknown> {
  success: true;
  message: string;
  data: T;
}

export interface ApiResponseError {
  success: false;
  message: string;
}

export interface PaginationInfo {
  current_page: number;
  next_page: number | null;
  prev_page: number | null;
  total_pages: number;
  total_count: number;
  per_page: number;
}

export interface ApiPaginationResponseSuccess<T = unknown> {
  success: true;
  message: string;
  data: T;
  pagination: PaginationInfo;
}

// Kiểu hợp (Union Types) để thuận tiện cho việc xử lý kết quả API
export type ApiResponse<T = unknown> = ApiResponseSuccess<T> | ApiResponseError;
export type ApiPaginationResponse<T = unknown> = ApiPaginationResponseSuccess<T> | ApiResponseError;
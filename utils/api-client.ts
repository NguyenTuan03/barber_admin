const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const VERSION = process.env.NEXT_PUBLIC_API_VERSION || "api/v1";
interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
  locale?: string;
}

export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, locale, headers, ...customOptions } = options;

  // 1. Tạo query string nếu có
  let url = `${BASE_URL}/${VERSION}/${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  // 2. Cấu hình default headers
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (locale) {
    defaultHeaders["Accept-Language"] = locale;
  }

  const mergedHeaders = {
    ...defaultHeaders,
    ...(headers as Record<string, string>),
  };

  // 3. Thực hiện fetch request
  const response = await fetch(url, {
    ...customOptions,
    headers: mergedHeaders,
  });

  // 4. Kiểm tra mã lỗi HTTP
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  // 5. Tự động parse JSON
  return response.json() as Promise<T>;
}

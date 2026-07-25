/**
 * Giải mã JSON an toàn từ giá trị site setting (hỗ trợ cả chuỗi JSON thô và cấu trúc đã giải mã sẵn).
 * @param value Giá trị cần giải mã (thường là siteSetting.value)
 * @returns Đối tượng đã giải mã có kiểu T hoặc null nếu thất bại
 */
export function safeParseJson<T>(value: unknown): T | null {
  if (value === null || value === undefined) return null;

  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.error("safeParseJson: Failed to parse JSON string:", error);
      return null;
    }
  }

  // Nếu dữ liệu đã được parse sẵn từ backend thành object hoặc array
  return value as T;
}

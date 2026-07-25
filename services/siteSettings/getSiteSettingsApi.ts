import { apiFetch } from "@/utils/api-client";
import { ApiResponseSuccess } from "@/types/apiResponse";

export interface SiteSetting {
  key: string;
  value: string | Record<string, unknown> | Array<Record<string, unknown>> | null;
}

/**
 * Fetch cấu hình thiết lập trang web (site setting) theo khóa key.
 * @param locale Ngôn ngữ hiện tại ("vi" | "en")
 * @param key Khóa của thiết lập cần lấy (ví dụ: "hero_subtitle")
 * @returns Đối tượng SiteSetting hoặc null nếu xảy ra lỗi
 */
export default async function getSiteSettingApi(
  locale: string,
  key: string
): Promise<SiteSetting | null> {
  try {
    const response = await apiFetch<ApiResponseSuccess<SiteSetting>>(`site_settings/${key}`, {
      locale,
      next: { revalidate: 60 },
    });

    if (!response.success) {
      return null;
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching site setting for key ${key}:`, error);
    return null;
  }
}
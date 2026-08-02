import { ApiResponse, ApiPaginationResponse } from "@/types/apiResponse";
import { SiteSettingsIndexData, SiteSettingItem } from "@/types/siteSetting";
import {
  BackendService,
  BackendProduct,
  BackendGallery,
  BackendAboutSection,
  BackendMilestone,
  BackendBarber,
  BackendLocation,
  UploadResponseData,
} from "@/types/backendResource";
import { LoginResponseData } from "@/types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8386";
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || "api/v1";

const AUTH_URL = `${API_BASE_URL}/${API_VERSION}/auth`;
const ADMIN_URL = `${API_BASE_URL}/${API_VERSION}/admin`;

// Dispatched whenever an admin request comes back 401, so AuthContext can react
// (clear its state and bounce the user back to the login screen) without this
// plain module needing to import React or hold a reference to the context.
export const UNAUTHORIZED_EVENT = "barber-admin:unauthorized";

function clearStoredAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("barber_admin_token");
  localStorage.removeItem("barber_admin_user");
}

/**
 * Every authenticated admin request should call this right after `fetch` resolves.
 * A 401 here means the token is missing/expired/invalid (e.g. the 24h JWT expired,
 * or the backend secret rotated) — not a specific-endpoint bug. Instead of leaving
 * the caller to throw a raw "Unauthorized" error into the console, we clear the
 * stale session and let the UI redirect to the login screen.
 */
function checkUnauthorized(res: Response) {
  if (res.status === 401 && typeof window !== "undefined") {
    clearStoredAuth();
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
  }
}

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("barber_admin_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
}

/**
 * 0. Authentication API
 */
export async function loginAdmin(email: string, password: string): Promise<LoginResponseData> {
  const res = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const json: LoginResponseData = await res.json();
  if (!res.ok || json.error) {
    throw new Error(json.error || "Invalid email or password");
  }

  return json;
}

/**
 * 1. Site Settings APIs
 */
export async function getAdminSiteSettings(): Promise<SiteSettingsIndexData> {
  const res = await fetch(`${ADMIN_URL}/site_settings`, {
    cache: "no-store",
    headers: getAuthHeaders(),
  });
  checkUnauthorized(res);

  if (!res.ok) {
    throw new Error(`Failed to fetch site settings: ${res.statusText}`);
  }

  const json: ApiPaginationResponse<SiteSettingsIndexData> = await res.json();
  if (!json.success) {
    throw new Error(json.message || "Error fetching site settings");
  }

  return json.data;
}

export async function saveAdminSiteSetting(
  key: string,
  value_vi: unknown,
  value_en: unknown
): Promise<SiteSettingItem> {
  const res = await fetch(`${ADMIN_URL}/site_settings`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      key,
      value_vi: typeof value_vi === "object" ? JSON.stringify(value_vi) : value_vi,
      value_en: typeof value_en === "object" ? JSON.stringify(value_en) : value_en,
    }),
  });
  checkUnauthorized(res);

  const json: ApiResponse<SiteSettingItem> = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to save site setting");
  }

  return json.data;
}

/**
 * 2. Upload API (S3)
 */
export async function uploadAdminFile(
  file: File,
  uploadType: string = "site_settings"
): Promise<UploadResponseData> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_type", uploadType);

  const headers: Record<string, string> = {};
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("barber_admin_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${ADMIN_URL}/uploads`, {
    method: "POST",
    headers,
    body: formData,
  });
  checkUnauthorized(res);

  const json: ApiResponse<UploadResponseData> = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Upload failed");
  }

  return json.data;
}

/**
 * 3. Services CRUD APIs
 */
export async function getAdminServices(): Promise<BackendService[]> {
  const res = await fetch(`${ADMIN_URL}/services?limit=100`, {
    cache: "no-store",
    headers: getAuthHeaders(),
  });
  checkUnauthorized(res);
  const json: ApiPaginationResponse<BackendService[]> = await res.json();
  if (!res.ok || !json.success) return [];
  return json.data;
}

export async function createAdminService(data: Partial<BackendService>): Promise<BackendService> {
  const res = await fetch(`${ADMIN_URL}/services`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  checkUnauthorized(res);
  const json: ApiResponse<BackendService> = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Thêm dịch vụ thất bại");
  return json.data;
}

export async function updateAdminService(id: number | string, data: Partial<BackendService>): Promise<BackendService> {
  const res = await fetch(`${ADMIN_URL}/services/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  checkUnauthorized(res);
  const json: ApiResponse<BackendService> = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Cập nhật dịch vụ thất bại");
  return json.data;
}

export async function deleteAdminService(id: number | string): Promise<boolean> {
  const res = await fetch(`${ADMIN_URL}/services/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  checkUnauthorized(res);
  const json: ApiResponse<null> = await res.json();
  return res.ok && json.success;
}

/**
 * 4. Products CRUD APIs
 */
export async function getAdminProducts(): Promise<BackendProduct[]> {
  const res = await fetch(`${ADMIN_URL}/products?limit=100`, {
    cache: "no-store",
    headers: getAuthHeaders(),
  });
  checkUnauthorized(res);
  const json: ApiPaginationResponse<BackendProduct[]> = await res.json();
  if (!res.ok || !json.success) return [];
  return json.data;
}

export async function createAdminProduct(data: Partial<BackendProduct>): Promise<BackendProduct> {
  const res = await fetch(`${ADMIN_URL}/products`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  checkUnauthorized(res);
  const json: ApiResponse<BackendProduct> = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Thêm sản phẩm thất bại");
  return json.data;
}

export async function updateAdminProduct(id: number | string, data: Partial<BackendProduct>): Promise<BackendProduct> {
  const res = await fetch(`${ADMIN_URL}/products/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  checkUnauthorized(res);
  const json: ApiResponse<BackendProduct> = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Cập nhật sản phẩm thất bại");
  return json.data;
}

export async function deleteAdminProduct(id: number | string): Promise<boolean> {
  const res = await fetch(`${ADMIN_URL}/products/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  checkUnauthorized(res);
  const json: ApiResponse<null> = await res.json();
  return res.ok && json.success;
}

/**
 * 5. Galleries CRUD APIs
 */
export async function getAdminGalleries(): Promise<BackendGallery[]> {
  const res = await fetch(`${ADMIN_URL}/galleries?limit=100`, {
    cache: "no-store",
    headers: getAuthHeaders(),
  });
  checkUnauthorized(res);
  const json: ApiPaginationResponse<BackendGallery[]> = await res.json();
  if (!res.ok || !json.success) return [];
  return json.data;
}

export async function createAdminGallery(data: Partial<BackendGallery>): Promise<BackendGallery> {
  const res = await fetch(`${ADMIN_URL}/galleries`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  checkUnauthorized(res);
  const json: ApiResponse<BackendGallery> = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Thêm mẫu tóc thất bại");
  return json.data;
}

export async function updateAdminGallery(id: number | string, data: Partial<BackendGallery>): Promise<BackendGallery> {
  const res = await fetch(`${ADMIN_URL}/galleries/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  checkUnauthorized(res);
  const json: ApiResponse<BackendGallery> = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Cập nhật mẫu tóc thất bại");
  return json.data;
}

export async function deleteAdminGallery(id: number | string): Promise<boolean> {
  const res = await fetch(`${ADMIN_URL}/galleries/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  checkUnauthorized(res);
  const json: ApiResponse<null> = await res.json();
  return res.ok && json.success;
}

/**
 * 6. About Sections CRUD APIs
 */
export async function getAdminAboutSections(): Promise<BackendAboutSection[]> {
  const res = await fetch(`${ADMIN_URL}/about_sections?limit=100`, {
    cache: "no-store",
    headers: getAuthHeaders(),
  });
  checkUnauthorized(res);
  const json: ApiPaginationResponse<BackendAboutSection[]> = await res.json();
  if (!res.ok || !json.success) return [];
  return json.data;
}

export async function createAdminAboutSection(data: Partial<BackendAboutSection>): Promise<BackendAboutSection> {
  const res = await fetch(`${ADMIN_URL}/about_sections`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  checkUnauthorized(res);
  const json: ApiResponse<BackendAboutSection> = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Thêm phần giới thiệu thất bại");
  return json.data;
}

export async function updateAdminAboutSection(
  id: number | string,
  data: Partial<BackendAboutSection>
): Promise<BackendAboutSection> {
  const res = await fetch(`${ADMIN_URL}/about_sections/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  checkUnauthorized(res);
  const json: ApiResponse<BackendAboutSection> = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Cập nhật phần giới thiệu thất bại");
  return json.data;
}

export async function deleteAdminAboutSection(id: number | string): Promise<boolean> {
  const res = await fetch(`${ADMIN_URL}/about_sections/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  checkUnauthorized(res);
  const json: ApiResponse<null> = await res.json();
  return res.ok && json.success;
}

/**
 * 7. Milestones CRUD APIs
 */
export async function getAdminMilestones(): Promise<BackendMilestone[]> {
  const res = await fetch(`${ADMIN_URL}/milestones?limit=100`, {
    cache: "no-store",
    headers: getAuthHeaders(),
  });
  checkUnauthorized(res);
  const json: ApiPaginationResponse<BackendMilestone[]> = await res.json();
  if (!res.ok || !json.success) return [];
  return json.data;
}

export async function createAdminMilestone(data: Partial<BackendMilestone>): Promise<BackendMilestone> {
  const res = await fetch(`${ADMIN_URL}/milestones`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  checkUnauthorized(res);
  const json: ApiResponse<BackendMilestone> = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Thêm cột mốc thất bại");
  return json.data;
}

export async function updateAdminMilestone(
  id: number | string,
  data: Partial<BackendMilestone>
): Promise<BackendMilestone> {
  const res = await fetch(`${ADMIN_URL}/milestones/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  checkUnauthorized(res);
  const json: ApiResponse<BackendMilestone> = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Cập nhật cột mốc thất bại");
  return json.data;
}

export async function deleteAdminMilestone(id: number | string): Promise<boolean> {
  const res = await fetch(`${ADMIN_URL}/milestones/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  checkUnauthorized(res);
  const json: ApiResponse<null> = await res.json();
  return res.ok && json.success;
}

/**
 * 8. Barbers CRUD APIs
 */
export async function getAdminBarbers(): Promise<BackendBarber[]> {
  const res = await fetch(`${ADMIN_URL}/barbers?limit=100`, {
    cache: "no-store",
    headers: getAuthHeaders(),
  });
  checkUnauthorized(res);
  const json: ApiPaginationResponse<BackendBarber[]> = await res.json();
  if (!res.ok || !json.success) return [];
  return json.data;
}

export async function createAdminBarber(data: Partial<BackendBarber>): Promise<BackendBarber> {
  const res = await fetch(`${ADMIN_URL}/barbers`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  checkUnauthorized(res);
  const json: ApiResponse<BackendBarber> = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Thêm thợ cắt tóc thất bại");
  return json.data;
}

export async function updateAdminBarber(id: number | string, data: Partial<BackendBarber>): Promise<BackendBarber> {
  const res = await fetch(`${ADMIN_URL}/barbers/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  checkUnauthorized(res);
  const json: ApiResponse<BackendBarber> = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Cập nhật thợ cắt tóc thất bại");
  return json.data;
}

export async function deleteAdminBarber(id: number | string): Promise<boolean> {
  const res = await fetch(`${ADMIN_URL}/barbers/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  checkUnauthorized(res);
  const json: ApiResponse<null> = await res.json();
  return res.ok && json.success;
}

/**
 * 9. Locations CRUD APIs
 */
export async function getAdminLocations(): Promise<BackendLocation[]> {
  const res = await fetch(`${ADMIN_URL}/locations?limit=100`, {
    cache: "no-store",
    headers: getAuthHeaders(),
  });
  checkUnauthorized(res);
  const json: ApiPaginationResponse<BackendLocation[]> = await res.json();
  if (!res.ok || !json.success) return [];
  return json.data;
}

export async function createAdminLocation(data: Partial<BackendLocation>): Promise<BackendLocation> {
  const res = await fetch(`${ADMIN_URL}/locations`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  checkUnauthorized(res);
  const json: ApiResponse<BackendLocation> = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Thêm chi nhánh thất bại");
  return json.data;
}

export async function updateAdminLocation(id: number | string, data: Partial<BackendLocation>): Promise<BackendLocation> {
  const res = await fetch(`${ADMIN_URL}/locations/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  checkUnauthorized(res);
  const json: ApiResponse<BackendLocation> = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Cập nhật chi nhánh thất bại");
  return json.data;
}

export async function deleteAdminLocation(id: number | string): Promise<boolean> {
  const res = await fetch(`${ADMIN_URL}/locations/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  checkUnauthorized(res);
  const json: ApiResponse<null> = await res.json();
  return res.ok && json.success;
}

export interface BackendService {
  id?: number | string;
  name_vi: string;
  name_en: string;
  description_vi: string;
  description_en: string;
  price: number;
  duration_minutes: number;
  image_url: string;
  created_at?: string;
  updated_at?: string;
}

export interface BackendProduct {
  id?: number | string;
  name_vi: string;
  name_en: string;
  description_vi: string;
  description_en: string;
  price: number;
  image_url: string;
  created_at?: string;
  updated_at?: string;
}

export interface BackendGallery {
  id?: number | string;
  title_vi: string;
  title_en: string;
  description_vi: string;
  description_en: string;
  image_url: string;
  created_at?: string;
  updated_at?: string;
}

export interface BackendAboutSection {
  id?: number | string;
  section_type: "hero" | "story" | "stats" | "value" | "team_intro";
  position: number;
  is_active: boolean;
  image_url?: string;
  title_vi: string;
  title_en: string;
  subtitle_vi?: string;
  subtitle_en?: string;
  content_vi?: string;
  content_en?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BackendMilestone {
  id?: number | string;
  year: string;
  position: number;
  is_active: boolean;
  title_vi: string;
  title_en: string;
  description_vi?: string;
  description_en?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BackendBarber {
  id?: number | string;
  avatar_url?: string;
  years_of_experience?: number;
  instagram_url?: string;
  twitter_url?: string;
  facebook_url?: string;
  position: number;
  is_active: boolean;
  name_vi: string;
  name_en: string;
  role_vi: string;
  role_en: string;
  created_at?: string;
  updated_at?: string;
}

export interface UploadResponseData {
  url: string;
  upload_type: string;
}

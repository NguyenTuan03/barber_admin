import { SiteSettingGroupEnum, SiteSettingKeyEnum } from "@/enum/AppEnum";

export interface SiteSettingItem {
  id?: number | string;
  key: SiteSettingKeyEnum | string;
  value_vi: unknown;
  value_en: unknown;
  created_at?: string;
  updated_at?: string;
}

export interface SiteSettingGroupConfig {
  group: SiteSettingGroupEnum;
  title: string;
  description: string;
  keys: SiteSettingKeyEnum[];
}

export interface SiteSettingsIndexData {
  allowed_keys: string[];
  settings: SiteSettingItem[];
}

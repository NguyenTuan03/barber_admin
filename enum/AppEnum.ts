export enum AuthStatusEnum {
  AUTHENTICATED = 'AUTHENTICATED',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  LOADING = 'LOADING',
}

export enum ThemeEnum {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export enum AdminTabEnum {
  HOME = 'HOME',
  SERVICES = 'SERVICES',
  PRODUCTS = 'PRODUCTS',
  ABOUT = 'ABOUT',
  USERS = 'USERS',
}

// Sub-navigation inside the Home tab (site-wide settings + hairstyle gallery + locations)
export enum HomeSubTabEnum {
  SITE_SETTINGS = 'SITE_SETTINGS',
  GALLERIES = 'GALLERIES',
  LOCATIONS = 'LOCATIONS',
}

// Sub-navigation inside the About tab (story/stats, timeline, team)
export enum AboutSubTabEnum {
  SECTIONS = 'SECTIONS',
  MILESTONES = 'MILESTONES',
  BARBERS = 'BARBERS',
}

export enum SiteSettingGroupEnum {
  HERO = 'HERO',
  FLOATING_INFO = 'FLOATING_INFO',
  ABOUT_SERVICE = 'ABOUT_SERVICE',
  SERVICES = 'SERVICES',
  PROMO = 'PROMO',
  REVIEWS = 'REVIEWS',
  CONTACT = 'CONTACT',
}

export enum SiteSettingKeyEnum {
  HOME_HERO_TITLE = 'home_hero_title',
  HOME_HERO_SUBTITLE = 'home_hero_subtitle',
  HOME_HERO_IMAGE_URL = 'home_hero_image_url',
  HOME_FLOATING_INFO_BLOCK = 'home_floating_info_block',
  HOME_ABOUT_SERVICE_TITLE = 'home_about_service_title',
  HOME_ABOUT_SERVICE_DESCRIPTION = 'home_about_service_description',
  HOME_ABOUT_SERVICE_STATS = 'home_about_service_stats',
  HOME_ABOUT_SERVICE_IMAGE = 'home_about_service_image',
  HOME_SERVICE_TITLE = 'home_service_title',
  HOME_SERVICE_DESCRIPTION = 'home_service_description',
  HOME_PROMO_TITLE = 'home_promo_title',
  HOME_PROMO_BG_IMAGE = 'home_promo_bg_image',
  HOME_REVIEW_FEATS = 'home_review_feats',
  HOME_CONTACT_INFO = 'home_contact_info',
  HOME_GOOGLE_MAP = 'home_google_map',
}

export enum InfoBlockTypeEnum {
  ADDRESS = 'address',
  PHONE = 'phone',
  HOURS = 'hours',
}

export enum AppointmentStatusEnum {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export enum BarberStatusEnum {
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
  OFF_DUTY = 'OFF_DUTY',
}

export enum ServiceCategoryEnum {
  HAIRCUT = 'HAIRCUT',
  SHAVING = 'SHAVING',
  COMBO = 'COMBO',
  TREATMENT = 'TREATMENT',
}
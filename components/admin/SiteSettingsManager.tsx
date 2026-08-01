"use client";

import React, { useState, useEffect } from "react";
import { Card, Segmented, Input, Button, Tag, Space, Spin, App as AntdApp } from "antd";
import {
  SettingOutlined,
  SaveOutlined,
  GlobalOutlined,
  LayoutOutlined,
  InfoCircleOutlined,
  TrophyOutlined,
  ControlOutlined,
  EnvironmentOutlined,
  CodeOutlined,
} from "@ant-design/icons";
import { SiteSettingGroupEnum, SiteSettingKeyEnum } from "@/enum/AppEnum";
import { SiteSettingItem, SiteSettingsIndexData } from "@/types/siteSetting";
import { getAdminSiteSettings, saveAdminSiteSetting } from "@/services/adminApi";
import { ImageUploader } from "@/components/admin/ImageUploader";

const { TextArea } = Input;

interface SettingGroupMeta {
  group: SiteSettingGroupEnum;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  keys: {
    key: SiteSettingKeyEnum;
    label: string;
    description: string;
    type: "text" | "textarea" | "image" | "json";
  }[];
}

const GROUPS_META: SettingGroupMeta[] = [
  {
    group: SiteSettingGroupEnum.HERO,
    title: "Banner Trang Chủ (Hero)",
    subtitle: "Hero Title, Subtitle, Background Image",
    description: "Cấu hình Tiêu đề chính, Dòng khẩu hiệu và Hình ảnh Banner xuất hiện ở đầu website.",
    icon: <LayoutOutlined />,
    keys: [
      {
        key: SiteSettingKeyEnum.HOME_HERO_TITLE,
        label: "Tiêu đề Banner Hero (Title)",
        description: "Dòng chữ tiêu đề lớn thu hút khách hàng ở đầu trang.",
        type: "text",
      },
      {
        key: SiteSettingKeyEnum.HOME_HERO_SUBTITLE,
        label: "Dòng Phụ đề (Subtitle)",
        description: "Đoạn văn miêu tả khẩu hiệu/slogan bên dưới tiêu đề.",
        type: "textarea",
      },
      {
        key: SiteSettingKeyEnum.HOME_HERO_IMAGE_URL,
        label: "Hình ảnh Banner (Hero Image)",
        description: "Đường dẫn ảnh minh họa hoặc hình nền cho Banner Hero.",
        type: "image",
      },
    ],
  },
  {
    group: SiteSettingGroupEnum.FLOATING_INFO,
    title: "Khối Thông Tin Nổi",
    subtitle: "Floating Info Block (Hours, Address, Phone)",
    description: "Cấu hình khối thông tin địa chỉ, hotline & giờ mở cửa nổi ở trang chủ.",
    icon: <InfoCircleOutlined />,
    keys: [
      {
        key: SiteSettingKeyEnum.HOME_FLOATING_INFO_BLOCK,
        label: "Dữ liệu Khối Thông Tin Nổi (JSON / Text)",
        description: "Cấu trúc thông tin Địa chỉ, Giờ mở cửa, Số điện thoại.",
        type: "json",
      },
    ],
  },
  {
    group: SiteSettingGroupEnum.ABOUT_SERVICE,
    title: "Giới Thiệu & Con Số Thống Kê",
    subtitle: "About Title, Description, Stats JSON",
    description: "Cấu hình phần giới thiệu thương hiệu và các chỉ số thống kê ấn tượng.",
    icon: <TrophyOutlined />,
    keys: [
      {
        key: SiteSettingKeyEnum.HOME_ABOUT_SERVICE_TITLE,
        label: "Tiêu đề Giới thiệu (About Title)",
        description: "Tiêu đề cho khối giới thiệu thương hiệu.",
        type: "text",
      },
      {
        key: SiteSettingKeyEnum.HOME_ABOUT_SERVICE_DESCRIPTION,
        label: "Nội dung Giới thiệu (About Description)",
        description: "Bài viết ngắn giới thiệu về đẳng cấp dịch vụ của T99 Barbershop.",
        type: "textarea",
      },
      {
        key: SiteSettingKeyEnum.HOME_ABOUT_SERVICE_STATS,
        label: "Các con số thống kê (Stats List JSON)",
        description: "Danh sách chỉ số (VD: 36% Sản phẩm chính hãng, 10+ Năm kinh nghiệm...).",
        type: "json",
      },
    ],
  },
  {
    group: SiteSettingGroupEnum.SERVICES,
    title: "Mô tả Dịch Vụ & Banner Khuyến Mãi",
    subtitle: "Services Description, Promo Title & Image",
    description: "Cấu hình mô tả tổng quan gói dịch vụ và banner chương trình ưu đãi đặc biệt.",
    icon: <ControlOutlined />,
    keys: [
      {
        key: SiteSettingKeyEnum.HOME_SERVICE_DESCRIPTION,
        label: "Mô tả Khối Dịch Vụ",
        description: "Đoạn mô tả cam kết chất lượng sản phẩm & dịch vụ.",
        type: "textarea",
      },
      {
        key: SiteSettingKeyEnum.HOME_PROMO_TITLE,
        label: "Tiêu đề Chương Trình Khuyến Mãi (Promo Title)",
        description: "Tiêu đề nổi bật cho banner ưu đãi.",
        type: "text",
      },
      {
        key: SiteSettingKeyEnum.HOME_PROMO_BG_IMAGE,
        label: "Ảnh Nền Khuyến Mãi (Promo Background Image)",
        description: "Đường dẫn ảnh nền chương trình ưu đãi.",
        type: "image",
      },
    ],
  },
  {
    group: SiteSettingGroupEnum.REVIEWS,
    title: "Đánh Giá & Bản Đồ Google Maps",
    subtitle: "Review Feats, Contact Info, Map iFrame",
    description: "Cấu hình tiêu chí chất lượng, thông tin đặt lịch và vị trí bản đồ.",
    icon: <EnvironmentOutlined />,
    keys: [
      {
        key: SiteSettingKeyEnum.HOME_REVIEW_FEATS,
        label: "Danh sách Tiêu chí Đánh giá (Review Feats JSON)",
        description: "Danh sách các điểm nổi bật (Cam kết chính hãng, Thợ lành nghề...).",
        type: "json",
      },
      {
        key: SiteSettingKeyEnum.HOME_CONTACT_INFO,
        label: "Thông tin Đặt lịch & Liên hệ (Contact Info)",
        description: "Số điện thoại, hotline hoặc ghi chú đặt lịch.",
        type: "textarea",
      },
      {
        key: SiteSettingKeyEnum.HOME_GOOGLE_MAP,
        label: "Đường dẫn Bản đồ Google Maps (Map URL)",
        description: "Đường dẫn iFrame hoặc nhúng Google Maps vị trí tiệm.",
        type: "text",
      },
    ],
  },
];

export function SiteSettingsManager() {
  const { message } = AntdApp.useApp();
  const [activeGroup, setActiveGroup] = useState<SiteSettingGroupEnum>(SiteSettingGroupEnum.HERO);
  const [activeLang, setActiveLang] = useState<"vi" | "en">("vi");
  const [loading, setLoading] = useState<boolean>(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const [settingsData, setSettingsData] = useState<Record<string, { value_vi: string; value_en: string }>>({});

  useEffect(() => {
    let isMounted = true;
    getAdminSiteSettings()
      .then((data: SiteSettingsIndexData) => {
        if (!isMounted) return;

        const initialMap: Record<string, { value_vi: string; value_en: string }> = {};

        data.allowed_keys.forEach((key) => {
          initialMap[key] = { value_vi: "", value_en: "" };
        });

        data.settings.forEach((item: SiteSettingItem) => {
          const valVi = typeof item.value_vi === "object" ? JSON.stringify(item.value_vi, null, 2) : String(item.value_vi || "");
          const valEn = typeof item.value_en === "object" ? JSON.stringify(item.value_en, null, 2) : String(item.value_en || "");

          initialMap[item.key] = {
            value_vi: valVi,
            value_en: valEn,
          };
        });

        setSettingsData(initialMap);
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error("Error loading site settings:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleInputChange = (key: string, field: "value_vi" | "value_en", value: string) => {
    setSettingsData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const handleSaveSetting = async (key: string) => {
    const data = settingsData[key];
    if (!data) return;

    setSavingKey(key);
    try {
      let valViToSave: unknown = data.value_vi;
      let valEnToSave: unknown = data.value_en;

      if (data.value_vi.trim().startsWith("[") || data.value_vi.trim().startsWith("{")) {
        try {
          valViToSave = JSON.parse(data.value_vi);
        } catch {
          // keep as string
        }
      }

      if (data.value_en.trim().startsWith("[") || data.value_en.trim().startsWith("{")) {
        try {
          valEnToSave = JSON.parse(data.value_en);
        } catch {
          // keep as string
        }
      }

      await saveAdminSiteSetting(key, valViToSave, valEnToSave);
      message.success(`Đã lưu cấu hình '${key}' lên Backend thành công!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lưu cấu hình thất bại";
      message.error(`Lỗi: ${msg}`);
    } finally {
      setSavingKey(null);
    }
  };

  const currentGroupMeta = GROUPS_META.find((g) => g.group === activeGroup) || GROUPS_META[0];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-3">
        <Spin size="large" />
        <p className="text-xs font-bold tracking-wider text-zinc-500 uppercase">
          Đang kết nối Rails API Backend lấy 13 cấu hình...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 select-none">
      {/* Top Banner Header Card */}
      <Card className="shadow-xs rounded-2xl border-solid border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Space className="mb-1">
              <Tag color="warning" icon={<SettingOutlined />} className="font-extrabold uppercase tracking-widest text-[10px] rounded-full px-3 py-0.5 border-amber-500/30">
                Dynamic Site Settings
              </Tag>
            </Space>
            <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight m-0">
              Cấu hình Giao diện Trang chủ (Frontend Design Studio)
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 m-0">
              Quản lý dữ liệu động kết nối trực tiếp API Backend (`/api/v1/admin/site_settings`).
            </p>
          </div>

          {/* Bilingual Language Switcher with Segmented */}
          <Segmented
            value={activeLang}
            onChange={(val) => setActiveLang(val as "vi" | "en")}
            options={[
              { label: "🇻🇳 Tiếng Việt (VI)", value: "vi" },
              { label: "🇬🇧 Tiếng Anh (EN)", value: "en" },
            ]}
            className="font-extrabold text-xs"
          />
        </div>
      </Card>

      {/* Main Form Layout: Group Menu + Form Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Side Group Menu */}
        <div className="space-y-2">
          <div className="px-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
            Khối Cấu hình (Groups)
          </div>

          {GROUPS_META.map((meta) => {
            const isActive = activeGroup === meta.group;
            return (
              <button
                key={meta.group}
                onClick={() => setActiveGroup(meta.group)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left transition-all duration-200 border-none cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 shadow-md font-extrabold"
                    : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{meta.icon}</span>
                  <span className="text-xs font-bold tracking-tight">{meta.title}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Side Form Cards */}
        <div className="md:col-span-3 space-y-6">
          <Card
            title={
              <div className="flex items-center gap-2 text-xs font-extrabold text-amber-600 dark:text-amber-500 uppercase tracking-wider">
                <GlobalOutlined />
                <span>
                  Đang soạn thảo: {activeLang === "vi" ? "Tiếng Việt (value_vi)" : "Tiếng Anh (value_en)"}
                </span>
              </div>
            }
            className="rounded-2xl shadow-xs border-solid border-zinc-200 dark:border-zinc-800"
          >
            <div className="mb-6 pb-4 border-b border-solid border-zinc-200 dark:border-zinc-800">
              <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100 m-0">
                {currentGroupMeta.title}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 m-0">{currentGroupMeta.description}</p>
            </div>

            <div className="space-y-6">
              {currentGroupMeta.keys.map((config) => {
                const currentData = settingsData[config.key] || { value_vi: "", value_en: "" };
                const currentValue = activeLang === "vi" ? currentData.value_vi : currentData.value_en;
                const isSavingThis = savingKey === config.key;

                return (
                  <div
                    key={config.key}
                    className="p-4 rounded-xl border border-solid border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/40 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-zinc-900 dark:text-zinc-200 uppercase tracking-wide">
                            {config.label}
                          </span>
                          <Tag color="warning" className="font-mono text-[9px] font-bold m-0 border-amber-500/30">
                            {config.key}
                          </Tag>
                        </div>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 m-0">
                          {config.description}
                        </p>
                      </div>

                      <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        loading={isSavingThis}
                        onClick={() => handleSaveSetting(config.key)}
                        className="bg-amber-500 hover:bg-amber-600 font-extrabold text-xs rounded-lg px-4 border-none shadow-xs"
                      >
                        Lưu {config.key}
                      </Button>
                    </div>

                    {/* Control input rendering */}
                    {config.type === "image" ? (
                      <ImageUploader
                        label="Hình ảnh S3 URL"
                        value={currentValue}
                        onChange={(newUrl: string) =>
                          handleInputChange(config.key, activeLang === "vi" ? "value_vi" : "value_en", newUrl)
                        }
                      />
                    ) : config.type === "textarea" ? (
                      <TextArea
                        rows={3}
                        value={currentValue}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          handleInputChange(config.key, activeLang === "vi" ? "value_vi" : "value_en", e.target.value)
                        }
                        placeholder={`Nhập ${config.label} (${activeLang.toUpperCase()})...`}
                        className="text-xs rounded-lg"
                      />
                    ) : config.type === "json" ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-500 font-mono font-bold">
                          <CodeOutlined /> Chuỗi JSON hợp lệ
                        </div>
                        <TextArea
                          rows={6}
                          value={currentValue}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            handleInputChange(config.key, activeLang === "vi" ? "value_vi" : "value_en", e.target.value)
                          }
                          placeholder="[ { &quot;title&quot;: &quot;...&quot;, &quot;content&quot;: &quot;...&quot; } ]"
                          className="font-mono text-xs text-amber-500 rounded-lg"
                        />
                      </div>
                    ) : (
                      <Input
                        type="text"
                        value={currentValue}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange(config.key, activeLang === "vi" ? "value_vi" : "value_en", e.target.value)
                        }
                        placeholder={`Nhập ${config.label} (${activeLang.toUpperCase()})...`}
                        className="text-xs rounded-lg"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

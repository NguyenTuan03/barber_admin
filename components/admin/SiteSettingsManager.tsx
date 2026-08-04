"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, Segmented, Input, Button, Spin, Tag, Tooltip, App as AntdApp } from "antd";
import {
  LayoutOutlined,
  InfoCircleOutlined,
  TrophyOutlined,
  ControlOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { SiteSettingGroupEnum, SiteSettingKeyEnum } from "@/enum/AppEnum";
import { SiteSettingItem, SiteSettingsIndexData } from "@/types/siteSetting";
import { getAdminSiteSettings, saveAdminSiteSetting } from "@/services/adminApi";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { FloatingInfoBlockEditor } from "@/components/admin/FloatingInfoBlockEditor";
import { AboutServiceStatsEditor } from "@/components/admin/AboutServiceStatsEditor";
import { ReviewFeatsEditor } from "@/components/admin/ReviewFeatsEditor";
import { ContactInfoEditor } from "@/components/admin/ContactInfoEditor";

const { TextArea } = Input;

type SettingValue = { value_vi: string; value_en: string };
type SettingsMap = Record<string, SettingValue>;

interface SettingGroupMeta {
  group: SiteSettingGroupEnum;
  title: string;
  description: string;
  icon: React.ReactNode;
  keys: {
    key: SiteSettingKeyEnum;
    label: string;
    description: string;
    type: "text" | "textarea" | "image" | "floating_info" | "about_stats" | "review_feats" | "contact_info";
  }[];
}

const GROUPS_META: SettingGroupMeta[] = [
  {
    group: SiteSettingGroupEnum.HERO,
    title: "Banner trang chủ",
    description: "Tiêu đề, khẩu hiệu và hình ảnh xuất hiện ở đầu website.",
    icon: <LayoutOutlined />,
    keys: [
      {
        key: SiteSettingKeyEnum.HOME_HERO_TITLE,
        label: "Tiêu đề banner",
        description: "Dòng chữ tiêu đề lớn ở đầu trang.",
        type: "text",
      },
      {
        key: SiteSettingKeyEnum.HOME_HERO_SUBTITLE,
        label: "Phụ đề",
        description: "Đoạn khẩu hiệu ngắn bên dưới tiêu đề.",
        type: "textarea",
      },
      {
        key: SiteSettingKeyEnum.HOME_HERO_IMAGE_URL,
        label: "Hình ảnh banner",
        description: "Ảnh nền cho khối banner đầu trang.",
        type: "image",
      },
    ],
  },
  {
    group: SiteSettingGroupEnum.FLOATING_INFO,
    title: "Khối thông tin nổi",
    description: "Địa chỉ, hotline và giờ mở cửa hiển thị nổi ở trang chủ.",
    icon: <InfoCircleOutlined />,
    keys: [
      {
        key: SiteSettingKeyEnum.HOME_FLOATING_INFO_BLOCK,
        label: "Nội dung khối thông tin",
        description: "Tiêu đề và các dòng nội dung cho Địa chỉ, Điện thoại, Giờ mở cửa.",
        type: "floating_info",
      },
    ],
  },
  {
    group: SiteSettingGroupEnum.ABOUT_SERVICE,
    title: "Giới thiệu & số liệu",
    description: "Phần giới thiệu thương hiệu và các chỉ số nổi bật.",
    icon: <TrophyOutlined />,
    keys: [
      {
        key: SiteSettingKeyEnum.HOME_ABOUT_SERVICE_TITLE,
        label: "Tiêu đề giới thiệu",
        description: "Tiêu đề cho khối giới thiệu thương hiệu.",
        type: "text",
      },
      {
        key: SiteSettingKeyEnum.HOME_ABOUT_SERVICE_DESCRIPTION,
        label: "Nội dung giới thiệu",
        description: "Đoạn giới thiệu ngắn về dịch vụ của T99 Barbershop.",
        type: "textarea",
      },
      {
        key: SiteSettingKeyEnum.HOME_ABOUT_SERVICE_STATS,
        label: "Các con số thống kê",
        description: "Chỉ số nổi bật, ví dụ “10+ năm kinh nghiệm”.",
        type: "about_stats",
      },
      {
        key: SiteSettingKeyEnum.HOME_ABOUT_SERVICE_IMAGE,
        label: "Hình ảnh giới thiệu",
        description: "Ảnh hiển thị bên cạnh phần giới thiệu.",
        type: "image",
      },
    ],
  },
  {
    group: SiteSettingGroupEnum.SERVICES,
    title: "Dịch vụ & khuyến mãi",
    description: "Mô tả tổng quan gói dịch vụ và banner chương trình ưu đãi.",
    icon: <ControlOutlined />,
    keys: [
      {
        key: SiteSettingKeyEnum.HOME_SERVICE_DESCRIPTION,
        label: "Mô tả khối dịch vụ",
        description: "Đoạn mô tả cam kết chất lượng sản phẩm & dịch vụ.",
        type: "textarea",
      },
      {
        key: SiteSettingKeyEnum.HOME_PROMO_TITLE,
        label: "Tiêu đề khuyến mãi",
        description: "Tiêu đề nổi bật cho banner ưu đãi.",
        type: "text",
      },
      {
        key: SiteSettingKeyEnum.HOME_PROMO_BG_IMAGE,
        label: "Ảnh nền khuyến mãi",
        description: "Ảnh nền cho banner chương trình ưu đãi.",
        type: "image",
      },
    ],
  },
  {
    group: SiteSettingGroupEnum.REVIEWS,
    title: "Đánh giá & liên hệ",
    description: "Tiêu chí chất lượng và thông tin đặt lịch hiển thị ở cuối trang chủ.",
    icon: <EnvironmentOutlined />,
    keys: [
      {
        key: SiteSettingKeyEnum.HOME_REVIEW_FEATS,
        label: "Tiêu chí đánh giá",
        description: "3 điểm nổi bật phía trên khu vực đánh giá.",
        type: "review_feats",
      },
      {
        key: SiteSettingKeyEnum.HOME_CONTACT_INFO,
        label: "Thông tin đặt lịch & liên hệ",
        description: "Email, số điện thoại hoặc hotline đặt lịch.",
        type: "contact_info",
      },
    ],
  },
];

const isSameValue = (a?: SettingValue, b?: SettingValue) =>
  (a?.value_vi ?? "") === (b?.value_vi ?? "") && (a?.value_en ?? "") === (b?.value_en ?? "");

/** Values that look like JSON are sent as objects; everything else stays a string. */
const toPayload = (raw: string): unknown => {
  const trimmed = raw.trim();
  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return raw;
    }
  }
  return raw;
};

export function SiteSettingsManager() {
  const { message } = AntdApp.useApp();
  const [activeGroup, setActiveGroup] = useState<SiteSettingGroupEnum>(SiteSettingGroupEnum.HERO);
  const [activeLang, setActiveLang] = useState<"vi" | "en">("vi");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const [settingsData, setSettingsData] = useState<SettingsMap>({});
  // Last known server state, used to work out which fields still need saving.
  const [savedData, setSavedData] = useState<SettingsMap>({});

  useEffect(() => {
    let isMounted = true;
    getAdminSiteSettings()
      .then((data: SiteSettingsIndexData) => {
        if (!isMounted) return;

        const initialMap: SettingsMap = {};

        data.allowed_keys.forEach((key) => {
          initialMap[key] = { value_vi: "", value_en: "" };
        });

        data.settings.forEach((item: SiteSettingItem) => {
          const valVi = typeof item.value_vi === "object" ? JSON.stringify(item.value_vi, null, 2) : String(item.value_vi || "");
          const valEn = typeof item.value_en === "object" ? JSON.stringify(item.value_en, null, 2) : String(item.value_en || "");

          initialMap[item.key] = { value_vi: valVi, value_en: valEn };
        });

        setSettingsData(initialMap);
        setSavedData(initialMap);
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

  const dirtyKeys = useMemo(
    () => Object.keys(settingsData).filter((key) => !isSameValue(settingsData[key], savedData[key])),
    [settingsData, savedData]
  );

  // Edits live in component state until saved, so a full page reload would throw
  // them away without any warning otherwise.
  useEffect(() => {
    if (dirtyKeys.length === 0) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirtyKeys.length]);

  const handleInputChange = (key: string, value: string) => {
    const field = activeLang === "vi" ? "value_vi" : "value_en";
    setSettingsData((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const handleSaveAll = async () => {
    if (dirtyKeys.length === 0) return;

    setSaving(true);
    const failed: string[] = [];
    const succeeded: string[] = [];

    for (const key of dirtyKeys) {
      const data = settingsData[key];
      try {
        await saveAdminSiteSetting(key, toPayload(data.value_vi), toPayload(data.value_en));
        succeeded.push(key);
      } catch (err: unknown) {
        console.error(`Failed to save site setting '${key}':`, err);
        failed.push(key);
      }
    }

    if (succeeded.length > 0) {
      setSavedData((prev) => {
        const next = { ...prev };
        succeeded.forEach((key) => {
          next[key] = settingsData[key];
        });
        return next;
      });
    }

    if (failed.length === 0) {
      message.success(`Đã lưu ${succeeded.length} thay đổi.`);
    } else if (succeeded.length === 0) {
      message.error("Không lưu được thay đổi nào. Vui lòng thử lại.");
    } else {
      message.warning(`Đã lưu ${succeeded.length} mục, ${failed.length} mục lưu thất bại.`);
    }

    setSaving(false);
  };

  const currentGroupMeta = GROUPS_META.find((g) => g.group === activeGroup) || GROUPS_META[0];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24">
        <Spin size="large" />
        <p className="m-0 text-sm text-slate-500 dark:text-slate-400">Đang tải nội dung trang chủ...</p>
      </div>
    );
  }

  const renderControl = (
    config: SettingGroupMeta["keys"][number],
    currentValue: string
  ) => {
    const onChange = (next: string) => handleInputChange(config.key, next);

    switch (config.type) {
      case "floating_info":
        return <FloatingInfoBlockEditor value={currentValue} onChange={onChange} />;
      case "about_stats":
        return <AboutServiceStatsEditor value={currentValue} onChange={onChange} />;
      case "review_feats":
        return <ReviewFeatsEditor value={currentValue} onChange={onChange} />;
      case "contact_info":
        return <ContactInfoEditor value={currentValue} onChange={onChange} />;
      case "image":
        // The field row above already renders the label.
        return <ImageUploader value={currentValue} onChange={onChange} />;
      case "textarea":
        return (
          <TextArea
            id={config.key}
            rows={3}
            value={currentValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Nhập ${config.label.toLowerCase()}...`}
          />
        );
      default:
        return (
          <Input
            id={config.key}
            value={currentValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Nhập ${config.label.toLowerCase()}...`}
          />
        );
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      {/* Group navigation */}
      <nav aria-label="Khối nội dung trang chủ" className="flex flex-col gap-1">
        {GROUPS_META.map((meta) => {
          const isActive = activeGroup === meta.group;
          const groupDirty = meta.keys.filter((k) => dirtyKeys.includes(k.key)).length;

          return (
            <button
              key={meta.group}
              type="button"
              onClick={() => setActiveGroup(meta.group)}
              aria-current={isActive ? "true" : undefined}
              className={`flex w-full cursor-pointer items-center gap-2.5 rounded-md border-0 px-3 py-2.5 text-left text-sm transition-colors duration-200 ${
                isActive
                  ? "bg-blue-50 font-medium text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
                  : "bg-transparent text-slate-700 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-700/60"
              }`}
            >
              <span className="shrink-0 text-base">{meta.icon}</span>
              <span className="min-w-0 flex-1">{meta.title}</span>
              {groupDirty > 0 && (
                <Tooltip title={`${groupDirty} thay đổi chưa lưu`}>
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                </Tooltip>
              )}
            </button>
          );
        })}
      </nav>

      {/* Fields for the selected group */}
      <div className="md:col-span-3">
        <Card
          title={
            <div className="py-3">
              <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {currentGroupMeta.title}
              </div>
              <div className="mt-0.5 text-sm font-normal whitespace-normal text-slate-600 dark:text-slate-400">
                {currentGroupMeta.description}
              </div>
            </div>
          }
          extra={
            <Segmented
              value={activeLang}
              onChange={(val) => setActiveLang(val as "vi" | "en")}
              options={[
                { label: "Tiếng Việt", value: "vi" },
                { label: "English", value: "en" },
              ]}
            />
          }
        >
          <div className="space-y-6">
            {currentGroupMeta.keys.map((config) => {
              const currentData = settingsData[config.key] || { value_vi: "", value_en: "" };
              const currentValue = activeLang === "vi" ? currentData.value_vi : currentData.value_en;
              const isDirty = dirtyKeys.includes(config.key);

              return (
                <div key={config.key} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor={config.key}
                      className="text-sm font-medium text-slate-900 dark:text-slate-100"
                    >
                      {config.label}
                    </label>
                    {isDirty && (
                      <Tag color="warning" variant="filled" className="m-0">
                        Chưa lưu
                      </Tag>
                    )}
                  </div>
                  <p className="m-0 text-[13px] text-slate-600 dark:text-slate-400">
                    {config.description}
                  </p>
                  {renderControl(config, currentValue)}
                </div>
              );
            })}
          </div>

          {/* Save bar: one action for every pending edit, across all groups. */}
          <div className="sticky bottom-0 -mx-6 -mb-6 mt-6 flex flex-col gap-2 border-0 border-t border-solid border-slate-200 bg-white px-6 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700 dark:bg-slate-800">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {dirtyKeys.length === 0
                ? "Đã lưu toàn bộ thay đổi."
                : `${dirtyKeys.length} mục chưa lưu (tính cả các khối khác).`}
            </span>
            <Button
              type="primary"
              onClick={handleSaveAll}
              loading={saving}
              disabled={dirtyKeys.length === 0}
            >
              Lưu thay đổi
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

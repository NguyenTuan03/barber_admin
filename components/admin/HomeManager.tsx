"use client";

import React, { useState } from "react";
import { Card, Tabs } from "antd";
import { HomeOutlined, SettingOutlined, PictureOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { HomeSubTabEnum } from "@/enum/AppEnum";
import { SiteSettingsManager } from "@/components/admin/SiteSettingsManager";
import { GalleriesManager } from "@/components/admin/GalleriesManager";
import { LocationsManager } from "@/components/admin/LocationsManager";

export function HomeManager() {
  const [activeSubTab, setActiveSubTab] = useState<HomeSubTabEnum>(HomeSubTabEnum.SITE_SETTINGS);

  const items = [
    {
      key: HomeSubTabEnum.SITE_SETTINGS,
      label: (
        <span className="inline-flex items-center gap-1.5">
          <SettingOutlined /> Cấu hình Trang chủ
        </span>
      ),
      children: <SiteSettingsManager />,
    },
    {
      key: HomeSubTabEnum.GALLERIES,
      label: (
        <span className="inline-flex items-center gap-1.5">
          <PictureOutlined /> Bộ sưu tập Mẫu tóc
        </span>
      ),
      children: <GalleriesManager />,
    },
    {
      key: HomeSubTabEnum.LOCATIONS,
      label: (
        <span className="inline-flex items-center gap-1.5">
          <EnvironmentOutlined /> Chi nhánh & Bản đồ
        </span>
      ),
      children: <LocationsManager />,
    },
  ];

  return (
    <div className="space-y-6 select-none">
      <Card className="shadow-xs rounded-2xl border-solid border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg">
            <HomeOutlined />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 m-0">
              Quản lý Trang Chủ
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 m-0">
              Quản lý banner, thông tin nổi bật, khuyến mãi và bộ sưu tập mẫu tóc hiển thị ở trang chủ.
            </p>
          </div>
        </div>
      </Card>

      <Tabs
        activeKey={activeSubTab}
        onChange={(key) => setActiveSubTab(key as HomeSubTabEnum)}
        items={items}
        className="font-bold [&_.ant-tabs-tab]:text-xs [&_.ant-tabs-tab]:font-bold"
      />
    </div>
  );
}

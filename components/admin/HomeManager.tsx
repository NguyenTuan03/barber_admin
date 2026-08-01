"use client";

import React, { useState } from "react";
import { Card, Tabs, Tag } from "antd";
import { HomeOutlined, SettingOutlined, PictureOutlined } from "@ant-design/icons";
import { HomeSubTabEnum } from "@/enum/AppEnum";
import { SiteSettingsManager } from "@/components/admin/SiteSettingsManager";
import { GalleriesManager } from "@/components/admin/GalleriesManager";

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
  ];

  return (
    <div className="space-y-6 select-none">
      <Card className="shadow-xs rounded-2xl border-solid border-zinc-200 dark:border-zinc-800">
        <Tag
          color="warning"
          icon={<HomeOutlined />}
          className="font-extrabold uppercase tracking-widest text-[10px] mb-1 rounded-full px-3 py-0.5 border-amber-500/30"
        >
          Home Page Content
        </Tag>
        <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight m-0">
          Quản lý Trang Chủ
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 m-0">
          Quản lý banner, thông tin nổi bật, khuyến mãi và bộ sưu tập mẫu tóc hiển thị ở trang chủ.
        </p>
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

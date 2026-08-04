"use client";

import React, { useState } from "react";
import { Tabs } from "antd";
import { SettingOutlined, PictureOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { HomeSubTabEnum } from "@/enum/AppEnum";
import { SiteSettingsManager } from "@/components/admin/SiteSettingsManager";
import { GalleriesManager } from "@/components/admin/GalleriesManager";
import { LocationsManager } from "@/components/admin/LocationsManager";

export function HomeManager() {
  const [activeSubTab, setActiveSubTab] = useState<HomeSubTabEnum>(HomeSubTabEnum.SITE_SETTINGS);

  const items = [
    {
      key: HomeSubTabEnum.SITE_SETTINGS,
      icon: <SettingOutlined />,
      label: "Nội dung trang chủ",
      children: <SiteSettingsManager />,
    },
    {
      key: HomeSubTabEnum.GALLERIES,
      icon: <PictureOutlined />,
      label: "Mẫu tóc",
      children: <GalleriesManager />,
    },
    {
      key: HomeSubTabEnum.LOCATIONS,
      icon: <EnvironmentOutlined />,
      label: "Chi nhánh",
      children: <LocationsManager />,
    },
  ];

  return (
    <Tabs
      activeKey={activeSubTab}
      onChange={(key) => setActiveSubTab(key as HomeSubTabEnum)}
      items={items}
    />
  );
}

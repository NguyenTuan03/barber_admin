"use client";

import React, { useState } from "react";
import { Tabs } from "antd";
import { ProfileOutlined, TrophyOutlined, TeamOutlined } from "@ant-design/icons";
import { AboutSubTabEnum } from "@/enum/AppEnum";
import { AboutSectionsManager } from "@/components/admin/AboutSectionsManager";
import { MilestonesManager } from "@/components/admin/MilestonesManager";
import { BarbersManager } from "@/components/admin/BarbersManager";

export function AboutManager() {
  const [activeSubTab, setActiveSubTab] = useState<AboutSubTabEnum>(AboutSubTabEnum.SECTIONS);

  const items = [
    {
      key: AboutSubTabEnum.SECTIONS,
      icon: <ProfileOutlined />,
      label: "Câu chuyện & số liệu",
      children: <AboutSectionsManager />,
    },
    {
      key: AboutSubTabEnum.MILESTONES,
      icon: <TrophyOutlined />,
      label: "Cột mốc lịch sử",
      children: <MilestonesManager />,
    },
    {
      key: AboutSubTabEnum.BARBERS,
      icon: <TeamOutlined />,
      label: "Đội ngũ thợ",
      children: <BarbersManager />,
    },
  ];

  return (
    <Tabs
      activeKey={activeSubTab}
      onChange={(key) => setActiveSubTab(key as AboutSubTabEnum)}
      items={items}
    />
  );
}

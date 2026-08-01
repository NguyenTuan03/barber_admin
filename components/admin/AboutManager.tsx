"use client";

import React, { useState } from "react";
import { Card, Tabs, Tag } from "antd";
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
      label: (
        <span className="inline-flex items-center gap-1.5">
          <ProfileOutlined /> Câu chuyện &amp; Số liệu
        </span>
      ),
      children: <AboutSectionsManager />,
    },
    {
      key: AboutSubTabEnum.MILESTONES,
      label: (
        <span className="inline-flex items-center gap-1.5">
          <TrophyOutlined /> Cột mốc Lịch sử
        </span>
      ),
      children: <MilestonesManager />,
    },
    {
      key: AboutSubTabEnum.BARBERS,
      label: (
        <span className="inline-flex items-center gap-1.5">
          <TeamOutlined /> Đội ngũ Thợ
        </span>
      ),
      children: <BarbersManager />,
    },
  ];

  return (
    <div className="space-y-6 select-none">
      <Card className="shadow-xs rounded-2xl border-solid border-zinc-200 dark:border-zinc-800">
        <Tag
          color="warning"
          icon={<ProfileOutlined />}
          className="font-extrabold uppercase tracking-widest text-[10px] mb-1 rounded-full px-3 py-0.5 border-amber-500/30"
        >
          About Page Content
        </Tag>
        <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight m-0">
          Quản lý Trang Giới Thiệu
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 m-0">
          Quản lý toàn bộ nội dung trang Giới thiệu: câu chuyện thương hiệu &amp; số liệu, cột mốc lịch sử, và đội ngũ thợ cắt tóc.
        </p>
      </Card>

      <Tabs
        activeKey={activeSubTab}
        onChange={(key) => setActiveSubTab(key as AboutSubTabEnum)}
        items={items}
        className="font-bold [&_.ant-tabs-tab]:text-xs [&_.ant-tabs-tab]:font-bold"
      />
    </div>
  );
}

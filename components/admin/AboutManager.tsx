"use client";

import React, { useState } from "react";
import { Card, Tabs } from "antd";
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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg">
            <ProfileOutlined />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 m-0">
              Quản lý Trang Giới Thiệu
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 m-0">
              Quản lý toàn bộ nội dung trang Giới thiệu: câu chuyện thương hiệu &amp; số liệu, cột mốc lịch sử, và đội ngũ thợ cắt tóc.
            </p>
          </div>
        </div>
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

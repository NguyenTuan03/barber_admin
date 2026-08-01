"use client";

import React from "react";
import { Layout, Button, Space } from "antd";
import { SunOutlined, MoonOutlined, ShopOutlined } from "@ant-design/icons";
import { useAntdTheme } from "@/context/AntdThemeContext";

const { Header } = Layout;

export function AdminHeader() {
  const { isDark, toggleTheme } = useAntdTheme();

  return (
    <Header className="h-16 px-6 bg-white dark:bg-zinc-950 border-b border-solid border-zinc-200 dark:border-zinc-800 flex items-center justify-between sticky top-0 z-40 leading-none select-none transition-colors duration-300">
      {/* Branch Info Pill */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-solid border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300">
        <ShopOutlined className="text-amber-500" />
        <span className="uppercase tracking-wider text-[11px]">T99 Ba Đình (Hà Nội)</span>
      </div>

      {/* Theme Switcher Actions */}
      <Space size="middle" align="center">
        <Button
          type="default"
          shape="circle"
          icon={isDark ? <SunOutlined className="text-amber-400 rotate-0 hover:rotate-45 transition-transform" /> : <MoonOutlined className="text-zinc-700" />}
          onClick={toggleTheme}
          title={isDark ? "Chuyển sang Chế độ Sáng" : "Chuyển sang Chế độ Tối"}
          className="border-solid border-zinc-200 dark:border-zinc-800 hover:border-amber-500"
        />
      </Space>
    </Header>
  );
}

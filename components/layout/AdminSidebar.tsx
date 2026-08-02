"use client";

import React from "react";
import Link from "next/link";
import { Layout, Menu, Tag, Button, Tooltip } from "antd";
import {
  HomeOutlined,
  ScissorOutlined,
  ShoppingOutlined,
  ProfileOutlined,
  UserOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { AdminTabEnum } from "@/enum/AppEnum";
import { useAntdTheme } from "@/context/AntdThemeContext";
import { useAuth } from "@/context/AuthContext";

const { Sider } = Layout;

interface AdminSidebarProps {
  activeTab?: AdminTabEnum;
  onTabChange?: (tab: AdminTabEnum) => void;
}

export function AdminSidebar({
  activeTab = AdminTabEnum.HOME,
  onTabChange,
}: AdminSidebarProps) {
  const { isDark } = useAntdTheme();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      key: AdminTabEnum.HOME,
      icon: <HomeOutlined />,
      label: "Trang Chủ",
    },
    {
      key: AdminTabEnum.SERVICES,
      icon: <ScissorOutlined />,
      label: "Dịch Vụ",
    },
    {
      key: AdminTabEnum.PRODUCTS,
      icon: <ShoppingOutlined />,
      label: "Sản Phẩm",
    },
    {
      key: AdminTabEnum.ABOUT,
      icon: <ProfileOutlined />,
      label: "Giới Thiệu",
    },
  ];

  return (
    <Sider
      width={270}
      theme={isDark ? "dark" : "light"}
      className="border-r border-solid border-zinc-200 dark:border-zinc-800 min-h-screen select-none flex flex-col justify-between"
    >
      <div>
        {/* Doppelrand Double-Bezel Branding Header */}
        <div className="p-4 border-b border-solid border-zinc-200 dark:border-zinc-800">
          <Link href="/" className="flex items-center gap-3 no-underline group">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center font-black text-zinc-950 text-xl shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              T99
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xs tracking-widest text-zinc-900 dark:text-zinc-100 uppercase">
                T99 BARBERSHOP
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-500 font-bold tracking-wider flex items-center gap-1 uppercase">
                <SafetyCertificateOutlined /> Workshop Admin
              </span>
            </div>
          </Link>
        </div>

        {/* Telemetry Status Box */}
        <div className="px-4 py-3">
          <div className="bg-zinc-100/80 dark:bg-zinc-900/60 p-2.5 rounded-xl border border-solid border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 font-semibold text-[11px]">
              <ThunderboltOutlined className="text-amber-500" /> Rails Engine
            </span>
            <Tag color="warning" className="m-0 font-mono text-[10px] font-extrabold border-amber-500/30">
              :8386
            </Tag>
          </div>
        </div>

        {/* Navigation Menu */}
        <Menu
          mode="inline"
          theme={isDark ? "dark" : "light"}
          selectedKeys={[activeTab]}
          onClick={({ key }) => onTabChange && onTabChange(key as AdminTabEnum)}
          items={menuItems}
          className="border-none font-bold text-xs py-2"
        />
      </div>

      {/* Admin User Footer Profile */}
      <div className="p-4 border-t border-solid border-zinc-200 dark:border-zinc-800 mt-auto">
        <div className="bg-zinc-100/80 dark:bg-zinc-900/40 p-2.5 rounded-xl border border-solid border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
              AD
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                {user?.name || "Anh Tuấn"}
              </span>
              <span className="text-[10px] text-zinc-500 truncate">{user?.email || "admin@t99barber.com"}</span>
            </div>
          </div>

          <Tooltip title="Đăng xuất khỏi hệ thống">
            <Button
              type="text"
              danger
              icon={<LogoutOutlined />}
              onClick={logout}
              className="shrink-0"
            />
          </Tooltip>
        </div>
      </div>
    </Sider>
  );
}

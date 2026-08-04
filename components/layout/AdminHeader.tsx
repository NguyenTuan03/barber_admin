"use client";

import React from "react";
import { Layout, Button, Dropdown, Tooltip } from "antd";
import type { MenuProps } from "antd";
import {
  SunOutlined,
  MoonOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useAntdTheme } from "@/context/AntdThemeContext";
import { useAuth } from "@/context/AuthContext";

const { Header } = Layout;

interface AdminHeaderProps {
  /** Name of the section currently open, so the user always knows where they are. */
  title: string;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export function AdminHeader({ title, collapsed, onToggleCollapsed }: AdminHeaderProps) {
  const { isDark, toggleTheme } = useAntdTheme();
  const { user, logout } = useAuth();

  const displayName = user?.name || "Admin";
  const displayEmail = user?.email || "";

  const accountItems: MenuProps["items"] = [
    {
      key: "account",
      type: "group",
      label: (
        <div className="py-1">
          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
            {displayName}
          </div>
          {displayEmail && (
            <div className="text-xs text-slate-500 dark:text-slate-400">{displayEmail}</div>
          )}
        </div>
      ),
    },
    { type: "divider" },
    {
      key: "logout",
      danger: true,
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: logout,
    },
  ];

  return (
    <Header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-0 border-b border-solid border-slate-200 dark:border-slate-700">
      <div className="flex min-w-0 items-center gap-2">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
        />
        <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
          {title}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Tooltip title={isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}>
          <Button
            type="text"
            icon={isDark ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggleTheme}
            aria-label={isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
          />
        </Tooltip>

        <Dropdown menu={{ items: accountItems }} trigger={["click"]} placement="bottomRight">
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2 rounded-md border-0 bg-transparent px-2 py-1.5 transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-700 dark:bg-slate-600 dark:text-slate-100">
              {getInitials(displayName)}
            </span>
            <span className="hidden max-w-32 truncate text-sm text-slate-700 sm:inline dark:text-slate-200">
              {displayName}
            </span>
            <DownOutlined className="text-[10px] text-slate-400" />
          </button>
        </Dropdown>
      </div>
    </Header>
  );
}

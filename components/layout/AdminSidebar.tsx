"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Layout, Menu } from "antd";
import { ADMIN_NAV, getNavItemByPath } from "@/components/layout/adminNav";

const { Sider } = Layout;

interface AdminSidebarProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

export function AdminSidebar({ collapsed, onCollapsedChange }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const activePath = getNavItemByPath(pathname).path;

  return (
    <Sider
      theme="light"
      width={232}
      collapsedWidth={64}
      collapsed={collapsed}
      breakpoint="lg"
      onBreakpoint={onCollapsedChange}
      trigger={null}
      className="border-0 border-r border-solid border-slate-200 dark:border-slate-700"
    >
      <div className="flex h-14 items-center gap-2.5 border-0 border-b border-solid border-slate-200 px-4 dark:border-slate-700">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-900 text-[11px] font-semibold text-white dark:bg-slate-600">
          T99
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
              T99 Barbershop
            </div>
            <div className="truncate text-xs text-slate-500 dark:text-slate-400">
              Trang quản trị
            </div>
          </div>
        )}
      </div>

      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[activePath]}
        onClick={({ key }) => router.push(key)}
        items={ADMIN_NAV.map((item) => ({
          key: item.path,
          icon: item.icon,
          label: item.label,
        }))}
        className="border-0 pt-2"
      />
    </Sider>
  );
}

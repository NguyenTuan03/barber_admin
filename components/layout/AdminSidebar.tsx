"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Users,
  Scissors,
  Settings,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  Clock,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    title: "Tổng quan Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Quản lý Lịch hẹn",
    href: "/appointments",
    icon: CalendarDays,
    badge: "12 mới",
  },
  {
    title: "Danh sách Thợ cắt tóc",
    href: "/barbers",
    icon: Users,
  },
  {
    title: "Bảng Dịch vụ & Giá",
    href: "/services",
    icon: Scissors,
  },
  {
    title: "Báo cáo Doanh thu",
    href: "/reports",
    icon: TrendingUp,
  },
  {
    title: "Cấu hình Website",
    href: "/site-settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 border-r border-zinc-200 bg-zinc-900 text-zinc-100 flex flex-col justify-between min-h-screen dark:border-zinc-800">
      <div>
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-zinc-800">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-amber-600 flex items-center justify-center font-bold text-white shadow-md">
              T99
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-wide text-zinc-100">
                T99 BARBERSHOP
              </span>
              <span className="text-[11px] text-amber-500 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 inline" /> Admin Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Operating status info */}
        <div className="mx-4 my-4 p-3 rounded-lg bg-zinc-800/60 border border-zinc-700/50 flex items-center gap-3">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </div>
          <div className="text-xs">
            <p className="font-medium text-zinc-200">Trạng thái tiệm</p>
            <p className="text-zinc-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> 08:30 - 20:30 (Mở cửa)
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                  isActive
                    ? "bg-amber-600 text-white shadow-sm"
                    : "text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive ? "text-white" : "text-zinc-400 group-hover:text-amber-500"
                    )}
                  />
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                      isActive
                        ? "bg-zinc-950/40 text-white"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Admin User Footer Profile */}
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-amber-600/20 border border-amber-500/40 flex items-center justify-center font-semibold text-amber-500 text-sm">
              AD
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-zinc-200">Anh Tuấn</span>
              <span className="text-xs text-zinc-400">Chủ tiệm / Quản lý</span>
            </div>
          </div>
          <button
            title="Đăng xuất"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

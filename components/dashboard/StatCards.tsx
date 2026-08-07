"use client";

import React from "react";
import { CalendarCheck, DollarSign, Users, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AppointmentStats } from "@/types/appointment";

interface StatCardsProps {
  stats: AppointmentStats;
}

export function StatCards({ stats }: StatCardsProps) {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const statItems = [
    {
      title: "Lịch hẹn hôm nay",
      value: stats.totalAppointments.toString(),
      subtext: `${stats.confirmedCount} đã xác nhận, ${stats.inProgressCount} đang cắt`,
      icon: CalendarCheck,
      accent: false,
    },
    {
      title: "Doanh thu dự kiến",
      value: formatCurrency(stats.estimatedRevenue),
      subtext: "Dựa trên các dịch vụ đã đặt",
      icon: DollarSign,
      accent: true,
    },
    {
      title: "Đã hoàn thành",
      value: `${stats.completedCount} lịch`,
      subtext: `Đạt ${Math.round((stats.completedCount / (stats.totalAppointments || 1)) * 100)}% công suất`,
      icon: CheckCircle2,
      accent: false,
    },
    {
      title: "Thợ đang trực",
      value: "4 thợ",
      subtext: "2 thợ bận, 2 thợ sẵn sàng",
      icon: Users,
      accent: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <Card key={idx}>
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {item.title}
                </p>
                <p className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {item.value}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {item.subtext}
                </p>
              </div>
              <div
                className={
                  item.accent
                    ? "p-3 rounded-xl bg-amber-600 shadow-[var(--shadow-card)]"
                    : "p-3 rounded-xl bg-zinc-900/5 dark:bg-white/5"
                }
              >
                <Icon
                  className={
                    item.accent
                      ? "w-6 h-6 text-white"
                      : "w-6 h-6 text-zinc-600 dark:text-zinc-300"
                  }
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

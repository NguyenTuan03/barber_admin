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
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/40",
    },
    {
      title: "Doanh thu dự kiến",
      value: formatCurrency(stats.estimatedRevenue),
      subtext: "Dựa trên các dịch vụ đã đặt",
      icon: DollarSign,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/40",
    },
    {
      title: "Đã hoàn thành",
      value: `${stats.completedCount} lịch`,
      subtext: `Đạt ${Math.round((stats.completedCount / (stats.totalAppointments || 1)) * 100)}% công suất`,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/40",
    },
    {
      title: "Thợ đang trực",
      value: "4 thợ",
      subtext: "2 thợ bận, 2 thợ sẵn sàng",
      icon: Users,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/40",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <Card key={idx} className="border-zinc-200 dark:border-zinc-800">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {item.title}
                </p>
                <p className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {item.value}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {item.subtext}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${item.bgColor}`}>
                <Icon className={`w-6 h-6 ${item.color}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

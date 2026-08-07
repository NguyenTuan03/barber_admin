"use client";

import React from "react";
import { BarberStatusEnum } from "@/enum/AppEnum";
import { BarberWorkload } from "@/types/barber";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, UserCheck } from "lucide-react";

interface BarberStatusListProps {
  workloads: BarberWorkload[];
}

export function BarberStatusList({ workloads }: BarberStatusListProps) {
  const getBarberStatusBadge = (status: BarberStatusEnum) => {
    switch (status) {
      case BarberStatusEnum.AVAILABLE:
        return <Badge variant="success">Sẵn sàng</Badge>;
      case BarberStatusEnum.BUSY:
        return <Badge variant="warning">Đang cắt khách</Badge>;
      case BarberStatusEnum.OFF_DUTY:
      default:
        return <Badge variant="secondary">Nghỉ ca</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <CardTitle className="text-base font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-amber-600" />
            Trạng thái & Tải làm việc của Thợ
          </span>
          <span className="text-xs text-zinc-500 font-normal">Hôm nay</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 divide-y divide-zinc-100 dark:divide-zinc-800 space-y-3">
        {workloads.map((item) => (
          <div key={item.barber.id} className="pt-3 first:pt-0 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Avatar placeholder */}
              <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold text-xs text-amber-600">
                {item.barber.name.split(" ").pop()?.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {item.barber.name}
                  </span>
                  <span className="text-xs text-amber-500 flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    {item.barber.rating}
                  </span>
                </div>
                <div className="text-xs text-zinc-500 flex items-center gap-2">
                  <span>{item.barber.specialties.join(", ")}</span>
                  <span>•</span>
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    {item.todayCount} khách hôm nay
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              {getBarberStatusBadge(item.barber.status)}
              {item.currentCustomerName && (
                <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-600" />
                  Đang cắt: {item.currentCustomerName}
                </span>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

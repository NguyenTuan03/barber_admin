"use client";

import React, { useState } from "react";
import { Search, Plus, Bell, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AdminHeaderProps {
  onOpenQuickBooking: () => void;
}

export function AdminHeader({ onOpenQuickBooking }: AdminHeaderProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <header className="h-16 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Search Input */}
      <div className="flex items-center gap-4 w-1/3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            type="text"
            placeholder="Tìm theo tên khách, SĐT, mã đặt lịch..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="pl-9 bg-zinc-50 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 text-sm"
          />
        </div>
      </div>

      {/* Branch & Actions */}
      <div className="flex items-center gap-4">
        {/* Branch selection badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300">
          <Store className="w-3.5 h-3.5 text-amber-600" />
          <span>Chi nhánh: T99 Ba Đình (Hà Nội)</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-600 ring-2 ring-white dark:ring-zinc-950" />
        </button>

        {/* Quick Add Appointment Button */}
        <Button onClick={onOpenQuickBooking} className="gap-2 bg-amber-600 hover:bg-amber-700 text-white font-medium shadow-sm">
          <Plus className="w-4 h-4" />
          <span>Tạo lịch hẹn nhanh</span>
        </Button>
      </div>
    </header>
  );
}

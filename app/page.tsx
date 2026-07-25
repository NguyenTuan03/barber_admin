"use client";

import React, { useState } from "react";
import { AppointmentStatusEnum, BarberStatusEnum } from "@/enum/AppEnum";
import { Appointment, AppointmentStats } from "@/types/appointment";
import { BarberWorkload } from "@/types/barber";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { StatCards } from "@/components/dashboard/StatCards";
import { AppointmentTable } from "@/components/dashboard/AppointmentTable";
import { BarberStatusList } from "@/components/dashboard/BarberStatusList";
import { QuickBookingModal } from "@/components/dashboard/QuickBookingModal";
import { Calendar, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const initialAppointments: Appointment[] = [
  {
    id: "app-101",
    bookingCode: "T99-8812",
    customer: {
      name: "Anh Hoàng Minh",
      phone: "0904 123 456",
      notes: "Cắt undercut vuốt sáp, gội đầu kỹ",
    },
    barberId: "barber-1",
    barberName: "Huy Nguyễn",
    barberAvatar: "",
    services: [
      {
        id: "s1",
        name: "Combo Cắt + Gội Massage + Cạo viền",
        price: 180000,
        durationMinutes: 45,
      },
    ],
    totalPrice: 180000,
    totalDurationMinutes: 45,
    appointmentDate: "2026-07-25",
    startTime: "14:30",
    endTime: "15:15",
    status: AppointmentStatusEnum.IN_PROGRESS,
    createdAt: "2026-07-25T08:00:00Z",
  },
  {
    id: "app-102",
    bookingCode: "T99-8813",
    customer: {
      name: "Anh Quốc Bảo",
      phone: "0912 345 678",
    },
    barberId: "barber-2",
    barberName: "Hoàng Nam",
    barberAvatar: "",
    services: [
      {
        id: "s2",
        name: "Cắt tạo kiểu Sidepart Pompadour",
        price: 150000,
        durationMinutes: 35,
      },
    ],
    totalPrice: 150000,
    totalDurationMinutes: 35,
    appointmentDate: "2026-07-25",
    startTime: "15:00",
    endTime: "15:35",
    status: AppointmentStatusEnum.CONFIRMED,
    createdAt: "2026-07-25T09:15:00Z",
  },
  {
    id: "app-103",
    bookingCode: "T99-8814",
    customer: {
      name: "Anh Văn Tuấn",
      phone: "0988 777 666",
    },
    barberId: "barber-3",
    barberName: "Minh Triết",
    barberAvatar: "",
    services: [
      {
        id: "s3",
        name: "Cạo râu khăn nóng + Chăm sóc da mặt",
        price: 120000,
        durationMinutes: 30,
      },
    ],
    totalPrice: 120000,
    totalDurationMinutes: 30,
    appointmentDate: "2026-07-25",
    startTime: "15:30",
    endTime: "16:00",
    status: AppointmentStatusEnum.CONFIRMED,
    createdAt: "2026-07-25T10:00:00Z",
  },
  {
    id: "app-104",
    bookingCode: "T99-8810",
    customer: {
      name: "Anh Đức Trí",
      phone: "0977 112 233",
    },
    barberId: "barber-1",
    barberName: "Huy Nguyễn",
    barberAvatar: "",
    services: [
      {
        id: "s1",
        name: "Cắt uốn tạo xoăn nam",
        price: 350000,
        durationMinutes: 60,
      },
    ],
    totalPrice: 350000,
    totalDurationMinutes: 60,
    appointmentDate: "2026-07-25",
    startTime: "13:00",
    endTime: "14:00",
    status: AppointmentStatusEnum.COMPLETED,
    createdAt: "2026-07-25T07:30:00Z",
  },
  {
    id: "app-105",
    bookingCode: "T99-8809",
    customer: {
      name: "Anh Lê Kiên",
      phone: "0933 445 566",
    },
    barberId: "barber-2",
    barberName: "Hoàng Nam",
    barberAvatar: "",
    services: [
      {
        id: "s2",
        name: "Cắt tạo kiểu",
        price: 150000,
        durationMinutes: 30,
      },
    ],
    totalPrice: 150000,
    totalDurationMinutes: 30,
    appointmentDate: "2026-07-25",
    startTime: "11:30",
    endTime: "12:00",
    status: AppointmentStatusEnum.CANCELLED,
    createdAt: "2026-07-25T06:00:00Z",
  },
];

const initialWorkloads: BarberWorkload[] = [
  {
    barber: {
      id: "barber-1",
      name: "Huy Nguyễn",
      avatarUrl: "",
      phone: "0901 111 222",
      specialties: ["Fade", "Pompadour", "Uốn"],
      rating: 4.9,
      completedBookingsCount: 1420,
      status: BarberStatusEnum.BUSY,
      workingHours: "08:30 - 17:30",
    },
    currentCustomerName: "Anh Hoàng Minh",
    todayCount: 6,
  },
  {
    barber: {
      id: "barber-2",
      name: "Hoàng Nam",
      avatarUrl: "",
      phone: "0902 222 333",
      specialties: ["Classic Cut", "Cạo khăn nóng"],
      rating: 4.8,
      completedBookingsCount: 980,
      status: BarberStatusEnum.AVAILABLE,
      workingHours: "09:00 - 18:00",
    },
    nextAppointmentTime: "15:00",
    todayCount: 5,
  },
  {
    barber: {
      id: "barber-3",
      name: "Minh Triết",
      avatarUrl: "",
      phone: "0903 333 444",
      specialties: ["Tattoo tóc", "Mullet", "Nhuộm"],
      rating: 4.9,
      completedBookingsCount: 1150,
      status: BarberStatusEnum.AVAILABLE,
      workingHours: "12:00 - 20:30",
    },
    nextAppointmentTime: "15:30",
    todayCount: 4,
  },
];

export default function AdminDashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [workloads] = useState<BarberWorkload[]>(initialWorkloads);
  const [isQuickBookingOpen, setIsQuickBookingOpen] = useState<boolean>(false);

  // Xử lý đổi trạng thái lịch hẹn bằng Enum
  const handleStatusChange = (id: string, newStatus: AppointmentStatusEnum) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
  };

  // Thêm lịch hẹn mới
  const handleAddAppointment = (newApp: Appointment) => {
    setAppointments((prev) => [newApp, ...prev]);
  };

  // Tính thống kê KPI
  const stats: AppointmentStats = {
    totalAppointments: appointments.length,
    confirmedCount: appointments.filter(
      (a) => a.status === AppointmentStatusEnum.CONFIRMED
    ).length,
    completedCount: appointments.filter(
      (a) => a.status === AppointmentStatusEnum.COMPLETED
    ).length,
    cancelledCount: appointments.filter(
      (a) => a.status === AppointmentStatusEnum.CANCELLED
    ).length,
    inProgressCount: appointments.filter(
      (a) => a.status === AppointmentStatusEnum.IN_PROGRESS
    ).length,
    estimatedRevenue: appointments
      .filter((a) => a.status !== AppointmentStatusEnum.CANCELLED)
      .reduce((sum, a) => sum + a.totalPrice, 0),
  };

  return (
    <div className="flex min-h-screen bg-zinc-100 dark:bg-zinc-900 font-sans text-zinc-900 dark:text-zinc-100">
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <AdminHeader onOpenQuickBooking={() => setIsQuickBookingOpen(true)} />

        {/* Dashboard Body */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Welcome Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                Xin chào, Anh Tuấn! 👋
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Đây là bảng tổng quan lịch hẹn & hoạt động hôm nay tại T99 Barbershop.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 text-xs font-semibold">
                <Calendar className="w-3.5 h-3.5" />
                <span>Thứ Bảy, 25/07/2026</span>
              </div>
              <Button size="sm" variant="outline" className="h-8 text-xs gap-1">
                <RefreshCw className="w-3 h-3" /> Làm mới
              </Button>
            </div>
          </div>

          {/* KPI Stat Cards */}
          <StatCards stats={stats} />

          {/* Grid Layout: Main Appointments Table (Left) + Barber Workload List (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Interactive Appointment Management Table (Span 2) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Quản lý Lịch hẹn hôm nay
                </h2>
                <span className="text-xs text-zinc-500 font-medium">
                  {appointments.length} lượt đặt lịch
                </span>
              </div>
              <AppointmentTable
                appointments={appointments}
                onStatusChange={handleStatusChange}
              />
            </div>

            {/* Right: Barber Status & Workload Panel (Span 1) */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Đội ngũ Thợ cắt tóc
              </h2>
              <BarberStatusList workloads={workloads} />
            </div>
          </div>
        </main>
      </div>

      {/* Modal tạo lịch hẹn nhanh */}
      <QuickBookingModal
        isOpen={isQuickBookingOpen}
        onClose={() => setIsQuickBookingOpen(false)}
        onAddAppointment={handleAddAppointment}
      />
    </div>
  );
}

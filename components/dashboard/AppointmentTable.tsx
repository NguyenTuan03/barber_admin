"use client";

import React, { useState } from "react";
import { AppointmentStatusEnum } from "@/enum/AppEnum";
import { Appointment } from "@/types/appointment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  User,
  Scissors,
  CheckCircle,
  XCircle,
  PlayCircle,
  Filter,
} from "lucide-react";

interface AppointmentTableProps {
  appointments: Appointment[];
  onStatusChange: (id: string, newStatus: AppointmentStatusEnum) => void;
}

export function AppointmentTable({
  appointments,
  onStatusChange,
}: AppointmentTableProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedBarberId, setSelectedBarberId] = useState<string>("ALL");

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusBadge = (status: AppointmentStatusEnum) => {
    switch (status) {
      case AppointmentStatusEnum.CONFIRMED:
        return <Badge variant="info">Đã xác nhận</Badge>;
      case AppointmentStatusEnum.IN_PROGRESS:
        return <Badge variant="warning">Đang thực hiện</Badge>;
      case AppointmentStatusEnum.COMPLETED:
        return <Badge variant="success">Hoàn thành</Badge>;
      case AppointmentStatusEnum.CANCELLED:
        return <Badge variant="destructive">Đã hủy</Badge>;
      case AppointmentStatusEnum.NO_SHOW:
        return <Badge variant="destructive">Khách không đến</Badge>;
      case AppointmentStatusEnum.PENDING:
      default:
        return <Badge variant="secondary">Chờ xử lý</Badge>;
    }
  };

  // Lọc lịch hẹn
  const filteredAppointments = appointments.filter((app) => {
    const matchStatus =
      selectedStatus === "ALL" || app.status === selectedStatus;
    const matchBarber =
      selectedBarberId === "ALL" || app.barberId === selectedBarberId;
    return matchStatus && matchBarber;
  });

  return (
    <div className="space-y-4">
      {/* Table Toolbar & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          <Filter className="w-4 h-4 text-amber-600" />
          <span>Bộ lọc lịch hẹn:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStatus(e.target.value)}
            className="h-9 rounded-lg border border-zinc-200 bg-white px-3 text-xs focus:ring-2 focus:ring-amber-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value={AppointmentStatusEnum.CONFIRMED}>Đã xác nhận</option>
            <option value={AppointmentStatusEnum.IN_PROGRESS}>Đang thực hiện</option>
            <option value={AppointmentStatusEnum.COMPLETED}>Hoàn thành</option>
            <option value={AppointmentStatusEnum.CANCELLED}>Đã hủy</option>
          </select>

          {/* Barber Filter */}
          <select
            value={selectedBarberId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedBarberId(e.target.value)}
            className="h-9 rounded-lg border border-zinc-200 bg-white px-3 text-xs focus:ring-2 focus:ring-amber-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
          >
            <option value="ALL">Tất cả Thợ cắt</option>
            <option value="barber-1">Huy Nguyễn (Master)</option>
            <option value="barber-2">Hoàng Nam (Senior)</option>
            <option value="barber-3">Minh Triết (Stylist)</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
            <TableRow>
              <TableHead className="w-[110px]">Mã đặt lịch</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Khung giờ</TableHead>
              <TableHead>Thợ phục vụ</TableHead>
              <TableHead>Dịch vụ đã chọn</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-zinc-500">
                  Không tìm thấy lịch hẹn phù hợp với bộ lọc.
                </TableCell>
              </TableRow>
            ) : (
              filteredAppointments.map((app) => (
                <TableRow key={app.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40">
                  {/* Mã lịch */}
                  <TableCell className="font-mono text-xs font-bold text-amber-600 dark:text-amber-500">
                    {app.bookingCode}
                  </TableCell>

                  {/* Khách hàng */}
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-zinc-400" />
                        {app.customer.name}
                      </span>
                      <span className="text-xs text-zinc-500">{app.customer.phone}</span>
                    </div>
                  </TableCell>

                  {/* Khung giờ */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{app.startTime} - {app.endTime}</span>
                    </div>
                  </TableCell>

                  {/* Thợ cắt */}
                  <TableCell>
                    <span className="text-xs font-medium px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                      {app.barberName}
                    </span>
                  </TableCell>

                  {/* Dịch vụ */}
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400">
                      <Scissors className="w-3.5 h-3.5 text-zinc-400" />
                      <span>
                        {app.services.map((s) => s.name).join(", ")}
                      </span>
                    </div>
                  </TableCell>

                  {/* Tổng tiền */}
                  <TableCell className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                    {formatCurrency(app.totalPrice)}
                  </TableCell>

                  {/* Trạng thái */}
                  <TableCell>{getStatusBadge(app.status)}</TableCell>

                  {/* Thao tác */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {app.status === AppointmentStatusEnum.CONFIRMED && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onStatusChange(app.id, AppointmentStatusEnum.IN_PROGRESS)}
                          className="h-7 px-2 text-xs text-amber-600 border-amber-300 hover:bg-amber-50"
                        >
                          <PlayCircle className="w-3.5 h-3.5 mr-1" />
                          Vào cắt
                        </Button>
                      )}

                      {app.status === AppointmentStatusEnum.IN_PROGRESS && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => onStatusChange(app.id, AppointmentStatusEnum.COMPLETED)}
                          className="h-7 px-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <CheckCircle className="w-3.5 h-3.5 mr-1" />
                          Xong
                        </Button>
                      )}

                      {app.status !== AppointmentStatusEnum.COMPLETED &&
                        app.status !== AppointmentStatusEnum.CANCELLED && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onStatusChange(app.id, AppointmentStatusEnum.CANCELLED)}
                            className="h-7 px-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1" />
                            Hủy
                          </Button>
                        )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

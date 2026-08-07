"use client";

import React, { useState } from "react";
import { AppointmentStatusEnum } from "@/enum/AppEnum";
import { Appointment } from "@/types/appointment";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface QuickBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAppointment: (newAppointment: Appointment) => void;
}

export function QuickBookingModal({
  isOpen,
  onClose,
  onAddAppointment,
}: QuickBookingModalProps) {
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [barberId, setBarberId] = useState<string>("barber-1");
  const [serviceName, setServiceName] = useState<string>("Cắt tạo kiểu + Gội massage");
  const [price, setPrice] = useState<number>(150000);
  const [startTime, setStartTime] = useState<string>("15:30");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    const barberMap: Record<string, string> = {
      "barber-1": "Huy Nguyễn",
      "barber-2": "Hoàng Nam",
      "barber-3": "Minh Triết",
    };

    const newApp: Appointment = {
      id: `app-${Date.now()}`,
      bookingCode: `T99-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: {
        name: customerName,
        phone: customerPhone,
      },
      barberId: barberId,
      barberName: barberMap[barberId] || "Huy Nguyễn",
      barberAvatar: "",
      services: [
        {
          id: "srv-1",
          name: serviceName,
          price: price,
          durationMinutes: 45,
        },
      ],
      totalPrice: price,
      totalDurationMinutes: 45,
      appointmentDate: new Date().toISOString().split("T")[0],
      startTime: startTime,
      endTime: "16:15",
      status: AppointmentStatusEnum.CONFIRMED,
      createdAt: new Date().toISOString(),
    };

    onAddAppointment(newApp);
    // Reset form
    setCustomerName("");
    setCustomerPhone("");
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo lịch hẹn nhanh cho khách"
      description="Nhập thông tin khách hàng trực tiếp tại tiệm hoặc gọi điện đặt trước."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            Tên khách hàng *
          </label>
          <Input
            required
            type="text"
            placeholder="Ví dụ: Anh Tuấn"
            value={customerName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            Số điện thoại *
          </label>
          <Input
            required
            type="tel"
            placeholder="Ví dụ: 0987654321"
            value={customerPhone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerPhone(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Thợ phụ trách
            </label>
            <select
              value={barberId}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBarberId(e.target.value)}
              className="w-full h-10 rounded-lg border border-zinc-200/80 bg-white px-3 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/70 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
            >
              <option value="barber-1">Huy Nguyễn (Master)</option>
              <option value="barber-2">Hoàng Nam (Senior)</option>
              <option value="barber-3">Minh Triết (Stylist)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Giờ hẹn
            </label>
            <Input
              type="time"
              value={startTime}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartTime(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            Gói dịch vụ
          </label>
          <select
            value={serviceName}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setServiceName(e.target.value);
              if (e.target.value.includes("Combo")) setPrice(220000);
              else if (e.target.value.includes("Cắt")) setPrice(150000);
              else setPrice(100000);
            }}
            className="w-full h-10 rounded-lg border border-zinc-200 bg-white px-3 text-xs focus:ring-2 focus:ring-amber-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
          >
            <option value="Cắt tạo kiểu + Gội massage">Cắt tạo kiểu + Gội massage (150.000 đ)</option>
            <option value="Combo VIP Barber Special">Combo VIP Barber Special (220.000 đ)</option>
            <option value="Cạo râu & Chăm sóc da mặt">Cạo râu & Chăm sóc da mặt (100.000 đ)</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button type="submit" variant="default">
            Xác nhận tạo lịch
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

import { AppointmentStatusEnum } from '@/enum/AppEnum';

export interface AppointmentCustomer {
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}

export interface AppointmentServiceItem {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
}

export interface Appointment {
  id: string;
  bookingCode: string;
  customer: AppointmentCustomer;
  barberId: string;
  barberName: string;
  barberAvatar: string;
  services: AppointmentServiceItem[];
  totalPrice: number;
  totalDurationMinutes: number;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatusEnum;
  createdAt: string;
}

export interface AppointmentFilter {
  date?: string;
  barberId?: string;
  status?: AppointmentStatusEnum | 'ALL';
  searchQuery?: string;
}

export interface AppointmentStats {
  totalAppointments: number;
  confirmedCount: number;
  completedCount: number;
  cancelledCount: number;
  inProgressCount: number;
  estimatedRevenue: number;
}

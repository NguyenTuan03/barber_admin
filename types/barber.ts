import { BarberStatusEnum } from '@/enum/AppEnum';

export interface Barber {
  id: string;
  name: string;
  avatarUrl: string;
  phone: string;
  specialties: string[];
  rating: number;
  completedBookingsCount: number;
  status: BarberStatusEnum;
  workingHours: string;
}

export interface BarberWorkload {
  barber: Barber;
  currentCustomerName?: string;
  nextAppointmentTime?: string;
  todayCount: number;
}

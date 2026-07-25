import { ServiceCategoryEnum } from '@/enum/AppEnum';

export interface BarberService {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  imageUrl: string;
  category: ServiceCategoryEnum;
  isActive: boolean;
}

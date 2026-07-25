import { apiFetch } from "@/utils/api-client";
import { ReactNode } from "react";

interface APIServiceItem {
  id: number | string;
  name: string;
  description?: string;
  price: string;
  image_url?: string;
}

interface DefaultServiceItem {
  id: string;
  price: string;
  icon: ReactNode;
}

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: string;
  icon: ReactNode;
}

export default async function getServiceApi(
  locale: string,
  defaultServicesList: DefaultServiceItem[],
  tServices: (key: string) => string
): Promise<ServiceItem[]> {
  let servicesList: ServiceItem[] = [];

  try {
    const data = await apiFetch<APIServiceItem[]>("/api/v1/services", {
      locale,
      next: { revalidate: 60 },
    });

    servicesList = data.map((item: APIServiceItem, index: number) => {
      const defaultService = defaultServicesList[index % defaultServicesList.length];
      return {
        id: item.id.toString(),
        name: item.name || "",
        description: item.description || "",
        price: item.price || defaultService.price,
        icon: defaultService.icon,
      };
    });
  } catch {
    servicesList = defaultServicesList.map((service) => ({
      id: service.id,
      name: tServices(`${service.id}Title`),
      description: tServices(`${service.id}Desc`),
      price: service.price,
      icon: service.icon,
    }));
  }

  return servicesList;
}
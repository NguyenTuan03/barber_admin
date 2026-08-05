"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { ServicesManager } from "@/components/admin/ServicesManager";
import { ADMIN_NAV } from "@/components/layout/adminNav";

const section = ADMIN_NAV.find((item) => item.path === "/services")!;

export default function AdminServicesPage() {
  return (
    <>
      <PageHeader title={section.label} description={section.description} />
      <ServicesManager />
    </>
  );
}

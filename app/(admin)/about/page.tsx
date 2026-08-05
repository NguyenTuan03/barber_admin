"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { AboutManager } from "@/components/admin/AboutManager";
import { ADMIN_NAV } from "@/components/layout/adminNav";

const section = ADMIN_NAV.find((item) => item.path === "/about")!;

export default function AdminAboutPage() {
  return (
    <>
      <PageHeader title={section.label} description={section.description} />
      <AboutManager />
    </>
  );
}

"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { HomeManager } from "@/components/admin/HomeManager";
import { ADMIN_NAV } from "@/components/layout/adminNav";

const section = ADMIN_NAV.find((item) => item.path === "/")!;

export default function AdminHomePage() {
  return (
    <>
      <PageHeader title={section.label} description={section.description} />
      <HomeManager />
    </>
  );
}

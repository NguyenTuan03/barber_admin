"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { ProductsManager } from "@/components/admin/ProductsManager";
import { ADMIN_NAV } from "@/components/layout/adminNav";

const section = ADMIN_NAV.find((item) => item.path === "/products")!;

export default function AdminProductsPage() {
  return (
    <>
      <PageHeader title={section.label} description={section.description} />
      <ProductsManager />
    </>
  );
}

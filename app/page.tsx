"use client";

import { useState } from "react";
import { Layout, Spin } from "antd";
import { AdminTabEnum, AuthStatusEnum } from "@/enum/AppEnum";
import { useAuth } from "@/context/AuthContext";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { PageHeader } from "@/components/layout/PageHeader";
import { getNavItem } from "@/components/layout/adminNav";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { HomeManager } from "@/components/admin/HomeManager";
import { ServicesManager } from "@/components/admin/ServicesManager";
import { ProductsManager } from "@/components/admin/ProductsManager";
import { AboutManager } from "@/components/admin/AboutManager";

const { Content } = Layout;

export default function AdminDashboardPage() {
  const { authStatus } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTabEnum>(AdminTabEnum.HOME);
  const [collapsed, setCollapsed] = useState<boolean>(false);

  // 1. Loading state
  if (authStatus === AuthStatusEnum.LOADING) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3">
        <Spin size="large" />
        <span className="text-sm text-slate-500 dark:text-slate-400">
          Đang kiểm tra phiên đăng nhập...
        </span>
      </div>
    );
  }

  // 2. Unauthenticated state -> Render Admin Login Form
  if (authStatus === AuthStatusEnum.UNAUTHENTICATED) {
    return <AdminLoginForm />;
  }

  // 3. Authenticated state -> Render Admin Dashboard
  const currentSection = getNavItem(activeTab);

  return (
    // Inline height: antd's own `.ant-layout { min-height: 0 }` is injected after
    // Tailwind's stylesheet, so a `min-h-screen` class here loses to it.
    <Layout style={{ minHeight: "100vh" }}>
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
      />

      <Layout className="flex min-w-0 flex-1 flex-col">
        <AdminHeader
          title={currentSection.label}
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((prev) => !prev)}
        />

        <Content className="overflow-y-auto p-4 lg:p-6">
          <div className="mx-auto max-w-7xl space-y-5">
            <PageHeader
              title={currentSection.label}
              description={currentSection.description}
            />

            {activeTab === AdminTabEnum.HOME && <HomeManager />}
            {activeTab === AdminTabEnum.SERVICES && <ServicesManager />}
            {activeTab === AdminTabEnum.PRODUCTS && <ProductsManager />}
            {activeTab === AdminTabEnum.ABOUT && <AboutManager />}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

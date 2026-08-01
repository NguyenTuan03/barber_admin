"use client";

import React, { useState } from "react";
import { Layout, Card, Spin } from "antd";
import { AdminTabEnum, AuthStatusEnum } from "@/enum/AppEnum";
import { useAuth } from "@/context/AuthContext";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { HomeManager } from "@/components/admin/HomeManager";
import { ServicesManager } from "@/components/admin/ServicesManager";
import { ProductsManager } from "@/components/admin/ProductsManager";
import { AboutManager } from "@/components/admin/AboutManager";

const { Content } = Layout;

export default function AdminDashboardPage() {
  const { authStatus } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTabEnum>(AdminTabEnum.HOME);

  // 1. Loading state
  if (authStatus === AuthStatusEnum.LOADING) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-950 gap-3">
        <Spin size="large" />
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
          Đang kiểm tra phiên làm việc Admin...
        </span>
      </div>
    );
  }

  // 2. Unauthenticated state -> Render Admin Login Form
  if (authStatus === AuthStatusEnum.UNAUTHENTICATED) {
    return <AdminLoginForm />;
  }

  // 3. Authenticated state -> Render Admin Dashboard
  return (
    <Layout className="min-h-screen">
      {/* Sidebar Navigation */}
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Layout */}
      <Layout className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <AdminHeader />

        {/* Dynamic Body Content */}
        <Content className="p-6 overflow-y-auto">
          {activeTab === AdminTabEnum.HOME && <HomeManager />}
          {activeTab === AdminTabEnum.SERVICES && <ServicesManager />}
          {activeTab === AdminTabEnum.PRODUCTS && <ProductsManager />}
          {activeTab === AdminTabEnum.ABOUT && <AboutManager />}
          {activeTab === AdminTabEnum.USERS && (
            <Card className="rounded-2xl shadow-sm text-center text-xs text-zinc-500">
              Quản lý Tài khoản Quản trị viên (Users API Endpoint `/api/v1/admin/users`).
            </Card>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}

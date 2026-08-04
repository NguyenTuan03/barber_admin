"use client";

import React, { useState } from "react";
import { Form, Input, Button, Tooltip, App as AntdApp } from "antd";
import { UserOutlined, LockOutlined, SunOutlined, MoonOutlined } from "@ant-design/icons";
import { useAuth } from "@/context/AuthContext";
import { useAntdTheme } from "@/context/AntdThemeContext";
import { LoginPayload } from "@/types/auth";

export function AdminLoginForm() {
  const { message } = AntdApp.useApp();
  const { login } = useAuth();
  const { isDark, toggleTheme } = useAntdTheme();
  const [loading, setLoading] = useState<boolean>(false);

  const [form] = Form.useForm<LoginPayload>();

  const handleSubmit = async (values: LoginPayload) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success("Đăng nhập thành công.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đăng nhập thất bại. Vui lòng kiểm tra lại.";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-[11px] font-semibold text-white dark:bg-slate-700">
              T99
            </div>
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              T99 Barbershop
            </span>
          </div>

          <Tooltip title={isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}>
            <Button
              type="text"
              icon={isDark ? <SunOutlined /> : <MoonOutlined />}
              onClick={toggleTheme}
              aria-label={isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
            />
          </Tooltip>
        </div>

        <div className="rounded-lg border border-solid border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h1 className="m-0 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Đăng nhập
          </h1>
          <p className="m-0 mt-1 mb-5 text-sm text-slate-600 dark:text-slate-400">
            Dùng tài khoản quản trị để vào trang quản lý nội dung website.
          </p>

          <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email." },
                { type: "email", message: "Email không hợp lệ." },
              ]}
            >
              <Input
                size="large"
                prefix={<UserOutlined className="text-slate-400" />}
                placeholder="admin@t99barber.com"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu." }]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined className="text-slate-400" />}
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              className="mt-2 w-full"
            >
              Đăng nhập
            </Button>
          </Form>
        </div>

        <p className="m-0 text-center text-[13px] text-slate-500 dark:text-slate-400">
          © 2026 T99 Barbershop
        </p>
      </div>
    </div>
  );
}

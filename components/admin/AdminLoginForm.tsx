"use client";

import React, { useState } from "react";
import { Form, Input, Button, App as AntdApp } from "antd";
import {
  UserOutlined,
  LockOutlined,
  SunOutlined,
  MoonOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
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
      message.success("Đăng nhập thành công!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đăng nhập thất bại. Vui lòng kiểm tra lại!";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 select-none transition-colors duration-300">
      <div className="w-full max-w-sm space-y-6">
        {/* Top Header Row with Theme Switcher */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-amber-500 flex items-center justify-center font-black text-zinc-950 text-xs shadow-xs">
              T99
            </div>
            <span className="text-xs font-black tracking-wider uppercase text-zinc-800 dark:text-zinc-200">
              T99 BARBERSHOP
            </span>
          </div>

          <Button
            type="text"
            shape="circle"
            icon={isDark ? <SunOutlined className="text-amber-400" /> : <MoonOutlined className="text-zinc-600" />}
            onClick={toggleTheme}
            title={isDark ? "Chuyển sang Chế độ Sáng" : "Chuyển sang Chế độ Tối"}
          />
        </div>

        {/* Clean Login Box */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-solid border-zinc-200 dark:border-zinc-800/80 p-8 shadow-xs space-y-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 m-0">
              Đăng nhập Quản trị
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 m-0">
              Nhập email và mật khẩu để vào Admin Portal.
            </p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="space-y-4"
          >
            <Form.Item
              label={<span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Email</span>}
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-zinc-400 text-xs" />}
                placeholder="Nhập email tài khoản admin..."
                className="rounded-lg h-10 text-xs"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Mật khẩu</span>}
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-zinc-400 text-xs" />}
                placeholder="••••••••"
                className="rounded-lg h-10 text-xs"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              icon={<ArrowRightOutlined />}
              iconPosition="end"
              loading={loading}
              className="w-full h-10 font-bold text-xs rounded-lg bg-amber-500 hover:bg-amber-600 border-none shadow-xs mt-2"
            >
              Đăng nhập
            </Button>
          </Form>
        </div>

        <div className="text-center text-[11px] text-zinc-400">
          © 2026 T99 Barbershop Admin System. All rights reserved.
        </div>
      </div>
    </div>
  );
}

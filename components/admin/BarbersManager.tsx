"use client";

import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Switch, Tag, Popconfirm, Space, Card, App as AntdApp } from "antd";
import {
  UserOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  StarOutlined,
  InstagramOutlined,
  TwitterOutlined,
  FacebookOutlined,
} from "@ant-design/icons";
import { BackendBarber } from "@/types/backendResource";
import { getAdminBarbers, createAdminBarber, updateAdminBarber, deleteAdminBarber } from "@/services/adminApi";
import { ImageUploader } from "@/components/admin/ImageUploader";
import Image from "next/image";

export function BarbersManager() {
  const { message } = AntdApp.useApp();
  const [barbers, setBarbers] = useState<BackendBarber[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingBarber, setEditingBarber] = useState<BackendBarber | null>(null);

  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAdminBarbers();
      setBarbers(data);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    getAdminBarbers()
      .then((data) => {
        if (isMounted) {
          setBarbers(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const openModal = (barber?: BackendBarber) => {
    if (barber) {
      setEditingBarber(barber);
      form.setFieldsValue({
        name_vi: barber.name_vi || "",
        name_en: barber.name_en || "",
        role_vi: barber.role_vi || "",
        role_en: barber.role_en || "",
        years_of_experience: barber.years_of_experience ?? 1,
        instagram_url: barber.instagram_url || "",
        twitter_url: barber.twitter_url || "",
        facebook_url: barber.facebook_url || "",
        position: barber.position ?? 0,
        is_active: barber.is_active ?? true,
      });
      setAvatarUrl(barber.avatar_url || "");
    } else {
      setEditingBarber(null);
      form.resetFields();
      form.setFieldsValue({
        years_of_experience: 1,
        position: barbers.length,
        is_active: true,
      });
      setAvatarUrl("");
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: Partial<BackendBarber>) => {
    try {
      const payload: Partial<BackendBarber> = {
        ...values,
        years_of_experience: values.years_of_experience ? Number(values.years_of_experience) : undefined,
        position: Number(values.position),
        avatar_url: avatarUrl,
      };

      if (editingBarber?.id) {
        await updateAdminBarber(editingBarber.id, payload);
        message.success("Cập nhật hồ sơ thợ thành công!");
      } else {
        await createAdminBarber(payload);
        message.success("Thêm thợ mới thành công!");
      }

      setIsModalOpen(false);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Thao tác thất bại";
      message.error(msg);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      await deleteAdminBarber(id);
      message.success("Đã xóa hồ sơ thợ!");
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Xóa thất bại";
      message.error(msg);
    }
  };

  const columns = [
    {
      title: "Ảnh Đại diện",
      dataIndex: "avatar_url",
      key: "avatar_url",
      width: 90,
      render: (url: string, record: BackendBarber) =>
        url ? (
          <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-solid border-zinc-200 dark:border-zinc-800 bg-zinc-900 group">
            <Image src={url} alt={record.name_vi} fill className="object-cover object-top transition-transform duration-500 group-hover:scale-110" />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
            <UserOutlined />
          </div>
        ),
    },
    {
      title: "Thợ Cắt Tóc (VI / EN)",
      key: "name",
      render: (_: unknown, record: BackendBarber) => (
        <div className="flex flex-col">
          <span className="font-extrabold text-xs text-zinc-900 dark:text-zinc-100">{record.name_vi}</span>
          <span className="text-[11px] text-amber-600 dark:text-amber-500 font-medium">{record.name_en}</span>
        </div>
      ),
    },
    {
      title: "Chức danh (VI / EN)",
      key: "role",
      render: (_: unknown, record: BackendBarber) => (
        <div className="flex flex-col max-w-xs text-xs text-zinc-500 space-y-0.5">
          <span className="line-clamp-1">{record.role_vi}</span>
          <span className="line-clamp-1 italic text-[11px] text-zinc-400">{record.role_en}</span>
        </div>
      ),
    },
    {
      title: "Kinh nghiệm",
      dataIndex: "years_of_experience",
      key: "years_of_experience",
      width: 110,
      render: (years?: number) =>
        years ? (
          <Tag icon={<StarOutlined />} color="warning" className="font-mono text-xs font-extrabold border-amber-500/30">
            {years} năm
          </Tag>
        ) : (
          <span className="text-zinc-400 text-xs">—</span>
        ),
    },
    {
      title: "Mạng xã hội",
      key: "social",
      width: 110,
      render: (_: unknown, record: BackendBarber) => (
        <Space size="small">
          {record.instagram_url && <InstagramOutlined className="text-amber-500" />}
          {record.twitter_url && <TwitterOutlined className="text-amber-500" />}
          {record.facebook_url && <FacebookOutlined className="text-amber-500" />}
          {!record.instagram_url && !record.twitter_url && !record.facebook_url && (
            <span className="text-zinc-400 text-xs">—</span>
          )}
        </Space>
      ),
    },
    {
      title: "Hiển thị",
      dataIndex: "is_active",
      key: "is_active",
      width: 100,
      render: (active: boolean) =>
        active ? (
          <Tag color="success" className="font-bold text-[10px]">
            Đang hiện
          </Tag>
        ) : (
          <Tag color="default" className="font-bold text-[10px]">
            Đã ẩn
          </Tag>
        ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "right" as const,
      render: (_: unknown, record: BackendBarber) => (
        <Space size="small">
          <Button icon={<EditOutlined />} type="text" onClick={() => openModal(record)} className="text-amber-500" />
          <Popconfirm
            title="Xóa hồ sơ thợ"
            description="Bạn có chắc chắn muốn xóa thợ này?"
            onConfirm={() => record.id && handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button icon={<DeleteOutlined />} type="text" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6 select-none">
      <Card className="shadow-xs rounded-2xl border-solid border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Tag color="warning" icon={<UserOutlined />} className="font-extrabold uppercase tracking-widest text-[10px] mb-1 rounded-full px-3 py-0.5 border-amber-500/30">
              Team Profiles API
            </Tag>
            <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight m-0">
              Quản lý Đội Ngũ Thợ Cắt Tóc
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 m-0">
              Hiển thị ở trang chủ và trang Giới thiệu. Kết nối API `/api/v1/admin/barbers`.
            </p>
          </div>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
            className="font-extrabold text-xs rounded-xl px-5 bg-gradient-to-r from-amber-500 to-amber-600 border-none shadow-md shadow-amber-500/20"
          >
            Thêm Thợ mới
          </Button>
        </div>
      </Card>

      <Card className="shadow-xs rounded-2xl border-solid border-zinc-200 dark:border-zinc-800 p-0 overflow-hidden">
        <Table
          columns={columns}
          dataSource={barbers.map((b) => ({ ...b, key: b.id }))}
          loading={loading}
          pagination={{ pageSize: 8 }}
          className="text-xs"
        />
      </Card>

      <Modal
        title={editingBarber ? "Chỉnh sửa Hồ sơ Thợ" : "Thêm Thợ Mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="text-xs pt-2">
          <div className="grid grid-cols-2 gap-3">
            <Form.Item label="Tên Thợ (VI)" name="name_vi" rules={[{ required: true, message: "Vui lòng nhập tên VI!" }]}>
              <Input placeholder="Nguyễn Văn A" />
            </Form.Item>
            <Form.Item label="Tên Thợ (EN)" name="name_en" rules={[{ required: true, message: "Vui lòng nhập tên EN!" }]}>
              <Input placeholder="Arthur Pendelton" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Form.Item label="Chức danh (VI)" name="role_vi" rules={[{ required: true, message: "Vui lòng nhập chức danh VI!" }]}>
              <Input placeholder="Thợ Cả & Nhà Sáng Lập" />
            </Form.Item>
            <Form.Item label="Chức danh (EN)" name="role_en" rules={[{ required: true, message: "Vui lòng nhập chức danh EN!" }]}>
              <Input placeholder="Master Barber & Founder" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Form.Item label="Số năm kinh nghiệm" name="years_of_experience">
              <InputNumber className="w-full" min={0} />
            </Form.Item>
            <Form.Item label="Thứ tự hiển thị" name="position" rules={[{ required: true, message: "Vui lòng nhập thứ tự!" }]}>
              <InputNumber className="w-full" min={0} />
            </Form.Item>
          </div>

          <div className="mb-4">
            <ImageUploader label="Ảnh Đại diện" value={avatarUrl} onChange={setAvatarUrl} uploadType="barber" />
          </div>

          <Form.Item label={<span><InstagramOutlined /> Đường dẫn Instagram</span>} name="instagram_url">
            <Input placeholder="https://instagram.com/..." />
          </Form.Item>

          <Form.Item label={<span><TwitterOutlined /> Đường dẫn Twitter/X</span>} name="twitter_url">
            <Input placeholder="https://twitter.com/..." />
          </Form.Item>

          <Form.Item label={<span><FacebookOutlined /> Đường dẫn Facebook</span>} name="facebook_url">
            <Input placeholder="https://facebook.com/..." />
          </Form.Item>

          <Form.Item label="Hiển thị trên Website" name="is_active" valuePropName="checked">
            <Switch checkedChildren="Hiện" unCheckedChildren="Ẩn" />
          </Form.Item>

          <div className="flex justify-end gap-2 pt-3 border-t border-solid border-zinc-200 dark:border-zinc-800">
            <Button onClick={() => setIsModalOpen(false)}>Hủy bỏ</Button>
            <Button type="primary" htmlType="submit" className="bg-amber-500 font-extrabold border-none">
              Lưu Hồ Sơ Thợ
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

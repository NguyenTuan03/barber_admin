"use client";

import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Switch, Tag, Popconfirm, Space, Card, App as AntdApp } from "antd";
import { TrophyOutlined, PlusOutlined, EditOutlined, DeleteOutlined, CalendarOutlined } from "@ant-design/icons";
import { BackendMilestone } from "@/types/backendResource";
import {
  getAdminMilestones,
  createAdminMilestone,
  updateAdminMilestone,
  deleteAdminMilestone,
} from "@/services/adminApi";

const { TextArea } = Input;

export function MilestonesManager() {
  const { message } = AntdApp.useApp();
  const [milestones, setMilestones] = useState<BackendMilestone[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingMilestone, setEditingMilestone] = useState<BackendMilestone | null>(null);

  const [form] = Form.useForm();

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAdminMilestones();
      setMilestones(data);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    getAdminMilestones()
      .then((data) => {
        if (isMounted) {
          setMilestones(data);
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

  const openModal = (milestone?: BackendMilestone) => {
    if (milestone) {
      setEditingMilestone(milestone);
      form.setFieldsValue({
        year: milestone.year || "",
        position: milestone.position ?? 0,
        is_active: milestone.is_active ?? true,
        title_vi: milestone.title_vi || "",
        title_en: milestone.title_en || "",
        description_vi: milestone.description_vi || "",
        description_en: milestone.description_en || "",
      });
    } else {
      setEditingMilestone(null);
      form.resetFields();
      form.setFieldsValue({
        year: new Date().getFullYear().toString(),
        position: milestones.length,
        is_active: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: Partial<BackendMilestone>) => {
    try {
      const payload: Partial<BackendMilestone> = {
        ...values,
        position: Number(values.position),
      };

      if (editingMilestone?.id) {
        await updateAdminMilestone(editingMilestone.id, payload);
        message.success("Cập nhật cột mốc thành công!");
      } else {
        await createAdminMilestone(payload);
        message.success("Thêm cột mốc mới thành công!");
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
      await deleteAdminMilestone(id);
      message.success("Đã xóa cột mốc!");
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Xóa thất bại";
      message.error(msg);
    }
  };

  const columns = [
    {
      title: "Năm",
      dataIndex: "year",
      key: "year",
      width: 90,
      render: (year: string) => (
        <Tag icon={<CalendarOutlined />} color="warning" className="font-mono text-xs font-extrabold border-amber-500/30">
          {year}
        </Tag>
      ),
    },
    {
      title: "Thứ tự",
      dataIndex: "position",
      key: "position",
      width: 80,
      render: (pos: number) => <span className="font-mono text-xs text-zinc-500">#{pos}</span>,
    },
    {
      title: "Tiêu đề Cột mốc (VI / EN)",
      key: "title",
      render: (_: unknown, record: BackendMilestone) => (
        <div className="flex flex-col">
          <span className="font-extrabold text-xs text-zinc-900 dark:text-zinc-100">{record.title_vi}</span>
          <span className="text-[11px] text-amber-600 dark:text-amber-500 font-medium">{record.title_en}</span>
        </div>
      ),
    },
    {
      title: "Mô tả",
      key: "description",
      render: (_: unknown, record: BackendMilestone) => (
        <div className="flex flex-col max-w-xs text-xs text-zinc-500 space-y-0.5">
          <span className="line-clamp-1">{record.description_vi}</span>
          <span className="line-clamp-1 italic text-[11px] text-zinc-400">{record.description_en}</span>
        </div>
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
      render: (_: unknown, record: BackendMilestone) => (
        <Space size="small">
          <Button icon={<EditOutlined />} type="text" onClick={() => openModal(record)} className="text-amber-500" />
          <Popconfirm
            title="Xóa cột mốc"
            description="Bạn có chắc chắn muốn xóa cột mốc này?"
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
            <Tag color="warning" icon={<TrophyOutlined />} className="font-extrabold uppercase tracking-widest text-[10px] mb-1 rounded-full px-3 py-0.5 border-amber-500/30">
              Milestones Timeline API
            </Tag>
            <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight m-0">
              Quản lý Cột Mốc Lịch Sử
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 m-0">
              Hiển thị trên dòng thời gian trang Giới thiệu. Kết nối API `/api/v1/admin/milestones`.
            </p>
          </div>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
            className="font-extrabold text-xs rounded-xl px-5 bg-gradient-to-r from-amber-500 to-amber-600 border-none shadow-md shadow-amber-500/20"
          >
            Thêm Cột mốc mới
          </Button>
        </div>
      </Card>

      <Card className="shadow-xs rounded-2xl border-solid border-zinc-200 dark:border-zinc-800 p-0 overflow-hidden">
        <Table
          columns={columns}
          dataSource={milestones.map((m) => ({ ...m, key: m.id }))}
          loading={loading}
          pagination={{ pageSize: 8 }}
          className="text-xs"
        />
      </Card>

      <Modal
        title={editingMilestone ? "Chỉnh sửa Cột mốc" : "Thêm Cột mốc Mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="text-xs pt-2">
          <div className="grid grid-cols-2 gap-3">
            <Form.Item label="Năm" name="year" rules={[{ required: true, message: "Vui lòng nhập năm!" }]}>
              <Input placeholder="2024" />
            </Form.Item>
            <Form.Item label="Thứ tự hiển thị" name="position" rules={[{ required: true, message: "Vui lòng nhập thứ tự!" }]}>
              <InputNumber className="w-full" min={0} />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Form.Item label="Tiêu đề Cột mốc (VI)" name="title_vi" rules={[{ required: true, message: "Vui lòng nhập tiêu đề VI!" }]}>
              <Input placeholder="T99 Barbershop Ra Đời" />
            </Form.Item>
            <Form.Item label="Tiêu đề Cột mốc (EN)" name="title_en" rules={[{ required: true, message: "Vui lòng nhập tiêu đề EN!" }]}>
              <Input placeholder="T99 Barbershop Is Born" />
            </Form.Item>
          </div>

          <Form.Item label="Mô tả Cột mốc (VI)" name="description_vi">
            <TextArea rows={2} />
          </Form.Item>

          <Form.Item label="Mô tả Cột mốc (EN)" name="description_en">
            <TextArea rows={2} />
          </Form.Item>

          <Form.Item label="Hiển thị trên Website" name="is_active" valuePropName="checked">
            <Switch checkedChildren="Hiện" unCheckedChildren="Ẩn" />
          </Form.Item>

          <div className="flex justify-end gap-2 pt-3 border-t border-solid border-zinc-200 dark:border-zinc-800">
            <Button onClick={() => setIsModalOpen(false)}>Hủy bỏ</Button>
            <Button type="primary" htmlType="submit" className="bg-amber-500 font-extrabold border-none">
              Lưu Cột Mốc
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

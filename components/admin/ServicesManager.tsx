"use client";

import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Tag, Popconfirm, Space, Card, App as AntdApp } from "antd";
import { ScissorOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { BackendService } from "@/types/backendResource";
import { getAdminServices, createAdminService, updateAdminService, deleteAdminService } from "@/services/adminApi";
import { ImageUploader } from "@/components/admin/ImageUploader";
import Image from "next/image";

const { TextArea } = Input;

export function ServicesManager() {
  const { message } = AntdApp.useApp();
  const [services, setServices] = useState<BackendService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<BackendService | null>(null);

  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string>("");

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAdminServices();
      setServices(data);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    getAdminServices()
      .then((data) => {
        if (isMounted) {
          setServices(data);
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

  const openModal = (service?: BackendService) => {
    setEditingService(service || null);
    setIsModalOpen(true);
  };

  // Populate the form only after the Modal (and its Form) have actually
  // mounted — calling form.setFieldsValue/resetFields from openModal() runs
  // before the Modal's `open` state change is committed, which logs antd's
  // "Instance created by useForm is not connected to any Form element"
  // warning since destroyOnHidden unmounts the Form between opens.
  useEffect(() => {
    if (!isModalOpen) return;

    if (editingService) {
      form.setFieldsValue({
        name_vi: editingService.name_vi || "",
        name_en: editingService.name_en || "",
        description_vi: editingService.description_vi || "",
        description_en: editingService.description_en || "",
        price: editingService.price || 100000,
        duration_minutes: editingService.duration_minutes || 30,
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImageUrl(editingService.image_url || "");
    } else {
      form.resetFields();
      form.setFieldsValue({
        price: 100000,
        duration_minutes: 30,
      });
      setImageUrl("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  const handleSubmit = async (values: Partial<BackendService>) => {
    try {
      const payload: Partial<BackendService> = {
        ...values,
        price: Number(values.price),
        duration_minutes: Number(values.duration_minutes),
        image_url: imageUrl,
      };

      if (editingService?.id) {
        await updateAdminService(editingService.id, payload);
        message.success("Cập nhật gói dịch vụ thành công!");
      } else {
        await createAdminService(payload);
        message.success("Thêm gói dịch vụ mới thành công!");
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
      await deleteAdminService(id);
      message.success("Đã xóa gói dịch vụ!");
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Xóa thất bại";
      message.error(msg);
    }
  };

  const columns = [
    {
      title: "Ảnh Dịch vụ",
      dataIndex: "image_url",
      key: "image_url",
      width: 100,
      render: (url: string, record: BackendService) =>
        url ? (
          <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-solid border-zinc-200 dark:border-zinc-800 bg-zinc-900 group">
            <Image src={url} alt={record.name_vi || "Hình ảnh dịch vụ"} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
            No Pic
          </div>
        ),
    },
    {
      title: "Tên Dịch vụ (VI / EN)",
      key: "name",
      render: (_: unknown, record: BackendService) => (
        <div className="flex flex-col">
          <span className="font-extrabold text-xs text-zinc-900 dark:text-zinc-100">{record.name_vi}</span>
          <span className="text-[11px] text-amber-600 dark:text-amber-500 font-medium">{record.name_en}</span>
        </div>
      ),
    },
    {
      title: "Mô tả",
      key: "description",
      render: (_: unknown, record: BackendService) => (
        <div className="flex flex-col max-w-xs text-xs text-zinc-500 space-y-0.5">
          <span className="line-clamp-1">{record.description_vi}</span>
          <span className="line-clamp-1 italic text-[11px] text-zinc-400">{record.description_en}</span>
        </div>
      ),
    },
    {
      title: "Giá Niêm Yết",
      dataIndex: "price",
      key: "price",
      render: (price: number) => (
        <span className="font-extrabold font-mono text-emerald-600 dark:text-emerald-400 text-xs">
          {price?.toLocaleString("vi-VN")} VNĐ
        </span>
      ),
    },
    {
      title: "Thời lượng",
      dataIndex: "duration_minutes",
      key: "duration_minutes",
      render: (duration: number) => (
        <Tag icon={<ClockCircleOutlined />} color="warning" className="font-mono text-xs border-amber-500/30">
          {duration} phút
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "right" as const,
      render: (_: unknown, record: BackendService) => (
        <Space size="small">
          <Button icon={<EditOutlined />} type="text" onClick={() => openModal(record)} className="text-amber-500" />
          <Popconfirm
            title="Xóa gói dịch vụ"
            description="Bạn có chắc chắn muốn xóa dịch vụ này?"
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg">
              <ScissorOutlined />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 m-0">
                Quản lý Gói Dịch Vụ Cắt Tóc
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 m-0">
                Thêm, chỉnh sửa hoặc xoá các dịch vụ hiển thị trên trang Dịch vụ.
              </p>
            </div>
          </div>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
            className="font-extrabold text-xs rounded-xl px-5 bg-gradient-to-r from-amber-500 to-amber-600 border-none shadow-md shadow-amber-500/20"
          >
            Thêm Dịch vụ mới
          </Button>
        </div>
      </Card>

      <Card className="shadow-xs rounded-2xl border-solid border-zinc-200 dark:border-zinc-800 p-0 overflow-hidden">
        <Table
          columns={columns}
          dataSource={services.map((s) => ({ ...s, key: s.id }))}
          loading={loading}
          pagination={{ pageSize: 8 }}
          className="text-xs"
        />
      </Card>

      <Modal
        title={editingService ? "Chỉnh sửa Gói Dịch Vụ" : "Thêm Gói Dịch Vụ Mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="text-xs pt-2">
          <div className="grid grid-cols-2 gap-3">
            <Form.Item label="Tên Dịch vụ (VI)" name="name_vi" rules={[{ required: true, message: "Vui lòng nhập tên VI!" }]}>
              <Input placeholder="Cắt Tóc Classic" />
            </Form.Item>
            <Form.Item label="Tên Dịch vụ (EN)" name="name_en" rules={[{ required: true, message: "Vui lòng nhập tên EN!" }]}>
              <Input placeholder="Classic Haircut" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Form.Item label="Giá Niêm Yết (VNĐ)" name="price" rules={[{ required: true, message: "Vui lòng nhập giá!" }]}>
              <InputNumber className="w-full" min={0} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
            </Form.Item>
            <Form.Item label="Thời lượng (Phút)" name="duration_minutes" rules={[{ required: true, message: "Vui lòng nhập thời lượng!" }]}>
              <InputNumber className="w-full" min={5} />
            </Form.Item>
          </div>

          <Form.Item label="Mô tả Dịch vụ (VI)" name="description_vi">
            <TextArea rows={2} />
          </Form.Item>

          <Form.Item label="Mô tả Dịch vụ (EN)" name="description_en">
            <TextArea rows={2} />
          </Form.Item>

          <div className="mb-4">
            <ImageUploader label="Hình ảnh Dịch vụ" value={imageUrl} onChange={setImageUrl} uploadType="service" />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-solid border-zinc-200 dark:border-zinc-800">
            <Button onClick={() => setIsModalOpen(false)}>Hủy bỏ</Button>
            <Button type="primary" htmlType="submit" className="bg-amber-500 font-extrabold border-none">
              Lưu Dịch Vụ
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Switch, Tag, Popconfirm, Space, Card, App as AntdApp } from "antd";
import { EnvironmentOutlined, PlusOutlined, EditOutlined, DeleteOutlined, LinkOutlined } from "@ant-design/icons";
import { BackendLocation } from "@/types/backendResource";
import { getAdminLocations, createAdminLocation, updateAdminLocation, deleteAdminLocation } from "@/services/adminApi";

const { TextArea } = Input;

export function LocationsManager() {
  const { message } = AntdApp.useApp();
  const [locations, setLocations] = useState<BackendLocation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingLocation, setEditingLocation] = useState<BackendLocation | null>(null);

  const [form] = Form.useForm();

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAdminLocations();
      setLocations(data);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    getAdminLocations()
      .then((data) => {
        if (isMounted) {
          setLocations(data);
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

  const openModal = (location?: BackendLocation) => {
    setEditingLocation(location || null);
    setIsModalOpen(true);
  };

  // Populate the form only after the Modal (and its Form) have actually
  // mounted — calling form.setFieldsValue/resetFields from openModal() runs
  // before the Modal's `open` state change is committed, which logs antd's
  // "Instance created by useForm is not connected to any Form element"
  // warning since destroyOnHidden unmounts the Form between opens.
  useEffect(() => {
    if (!isModalOpen) return;

    if (editingLocation) {
      form.setFieldsValue({
        name_vi: editingLocation.name_vi || "",
        name_en: editingLocation.name_en || "",
        address_vi: editingLocation.address_vi || "",
        address_en: editingLocation.address_en || "",
        location_url: editingLocation.location_url || "",
        position: editingLocation.position ?? 0,
        is_active: editingLocation.is_active ?? true,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        position: locations.length,
        is_active: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  const handleSubmit = async (values: Partial<BackendLocation>) => {
    try {
      const payload: Partial<BackendLocation> = {
        ...values,
        position: Number(values.position),
      };

      if (editingLocation?.id) {
        await updateAdminLocation(editingLocation.id, payload);
        message.success("Cập nhật chi nhánh thành công!");
      } else {
        await createAdminLocation(payload);
        message.success("Thêm chi nhánh mới thành công!");
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
      await deleteAdminLocation(id);
      message.success("Đã xóa chi nhánh!");
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Xóa thất bại";
      message.error(msg);
    }
  };

  const columns = [
    {
      title: "Chi nhánh (VI / EN)",
      key: "name",
      render: (_: unknown, record: BackendLocation) => (
        <div className="flex flex-col">
          <span className="font-extrabold text-xs text-zinc-900 dark:text-zinc-100">{record.name_vi}</span>
          <span className="text-[11px] text-amber-600 dark:text-amber-500 font-medium">{record.name_en}</span>
        </div>
      ),
    },
    {
      title: "Địa chỉ (VI / EN)",
      key: "address",
      render: (_: unknown, record: BackendLocation) => (
        <div className="flex flex-col max-w-xs text-xs text-zinc-500 space-y-0.5">
          <span className="line-clamp-1">{record.address_vi}</span>
          <span className="line-clamp-1 italic text-[11px] text-zinc-400">{record.address_en}</span>
        </div>
      ),
    },
    {
      title: "Bản đồ",
      dataIndex: "location_url",
      key: "location_url",
      width: 90,
      render: (url?: string) =>
        url ? (
          <a href={url} target="_blank" rel="noreferrer" className="text-amber-500">
            <LinkOutlined /> Xem link
          </a>
        ) : (
          <span className="text-zinc-400 text-xs">—</span>
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
      render: (_: unknown, record: BackendLocation) => (
        <Space size="small">
          <Button icon={<EditOutlined />} type="text" onClick={() => openModal(record)} className="text-amber-500" />
          <Popconfirm
            title="Xóa chi nhánh"
            description="Bạn có chắc chắn muốn xóa chi nhánh này?"
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
              <EnvironmentOutlined />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 m-0">
                Quản lý Chi Nhánh & Bản Đồ
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 m-0">
                Quản lý danh sách cửa hàng (tên, địa chỉ, bản đồ) hiển thị ở trang chủ.
              </p>
            </div>
          </div>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
            className="font-extrabold text-xs rounded-xl px-5 bg-gradient-to-r from-amber-500 to-amber-600 border-none shadow-md shadow-amber-500/20"
          >
            Thêm Chi nhánh mới
          </Button>
        </div>
      </Card>

      <Card className="shadow-xs rounded-2xl border-solid border-zinc-200 dark:border-zinc-800 p-0 overflow-hidden">
        <Table
          columns={columns}
          dataSource={locations.map((l) => ({ ...l, key: l.id }))}
          loading={loading}
          pagination={{ pageSize: 8 }}
          className="text-xs"
        />
      </Card>

      <Modal
        title={editingLocation ? "Chỉnh sửa Chi nhánh" : "Thêm Chi nhánh Mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="text-xs pt-2">
          <div className="grid grid-cols-2 gap-3">
            <Form.Item label="Tên Chi nhánh (VI)" name="name_vi" rules={[{ required: true, message: "Vui lòng nhập tên VI!" }]}>
              <Input placeholder="T99 Barbershop - An Khánh" />
            </Form.Item>
            <Form.Item label="Tên Chi nhánh (EN)" name="name_en" rules={[{ required: true, message: "Vui lòng nhập tên EN!" }]}>
              <Input placeholder="T99 Barbershop - An Khanh" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Form.Item label="Địa chỉ (VI)" name="address_vi" rules={[{ required: true, message: "Vui lòng nhập địa chỉ VI!" }]}>
              <TextArea rows={2} placeholder="33/1 Quốc Hương, P. An Khánh, TP. HCM" />
            </Form.Item>
            <Form.Item label="Địa chỉ (EN)" name="address_en" rules={[{ required: true, message: "Vui lòng nhập địa chỉ EN!" }]}>
              <TextArea rows={2} placeholder="33/1 Quoc Huong, An Khanh Ward, HCMC" />
            </Form.Item>
          </div>

          <Form.Item
            label={<span><LinkOutlined /> Link Google Maps</span>}
            name="location_url"
            rules={[{ required: true, message: "Vui lòng nhập link Google Maps!" }]}
            extra="Mở Google Maps, tìm cửa hàng, bấm nút Chia sẻ và dán link vào đây. Hệ thống sẽ tự động xử lý, không cần lấy link nhúng (embed)."
          >
            <Input placeholder="https://maps.app.goo.gl/..." />
          </Form.Item>

          <div className="grid grid-cols-2 gap-3">
            <Form.Item label="Thứ tự hiển thị" name="position" rules={[{ required: true, message: "Vui lòng nhập thứ tự!" }]}>
              <InputNumber className="w-full" min={0} />
            </Form.Item>
            <Form.Item label="Hiển thị trên Website" name="is_active" valuePropName="checked">
              <Switch checkedChildren="Hiện" unCheckedChildren="Ẩn" />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-solid border-zinc-200 dark:border-zinc-800">
            <Button onClick={() => setIsModalOpen(false)}>Hủy bỏ</Button>
            <Button type="primary" htmlType="submit" className="bg-amber-500 font-extrabold border-none">
              Lưu Chi nhánh
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

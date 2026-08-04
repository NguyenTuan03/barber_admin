"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Space,
  Card,
  Tooltip,
  App as AntdApp,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { BackendService } from "@/types/backendResource";
import { getAdminServices, createAdminService, updateAdminService, deleteAdminService } from "@/services/adminApi";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ListToolbar, matchesSearch } from "@/components/admin/ListToolbar";
import { Thumbnail, BilingualCell, DescriptionCell, PriceCell } from "@/components/admin/cells";

const { TextArea } = Input;

export function ServicesManager() {
  const { message } = AntdApp.useApp();
  const [services, setServices] = useState<BackendService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<BackendService | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

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
    setSaving(true);
    try {
      const payload: Partial<BackendService> = {
        ...values,
        price: Number(values.price),
        duration_minutes: Number(values.duration_minutes),
        image_url: imageUrl,
      };

      if (editingService?.id) {
        await updateAdminService(editingService.id, payload);
        message.success("Đã cập nhật dịch vụ.");
      } else {
        await createAdminService(payload);
        message.success("Đã thêm dịch vụ mới.");
      }

      setIsModalOpen(false);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Thao tác thất bại";
      message.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      await deleteAdminService(id);
      message.success("Đã xóa dịch vụ.");
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Xóa thất bại";
      message.error(msg);
    }
  };

  const filtered = useMemo(
    () =>
      services.filter((s) =>
        matchesSearch(search, s.name_vi, s.name_en, s.description_vi, s.description_en)
      ),
    [services, search]
  );

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "image_url",
      key: "image_url",
      width: 80,
      render: (url: string, record: BackendService) => (
        <Thumbnail url={url} alt={record.name_vi || "Hình ảnh dịch vụ"} />
      ),
    },
    {
      title: "Tên dịch vụ",
      key: "name",
      render: (_: unknown, record: BackendService) => (
        <BilingualCell vi={record.name_vi} en={record.name_en} />
      ),
    },
    {
      title: "Mô tả",
      key: "description",
      render: (_: unknown, record: BackendService) => (
        <DescriptionCell vi={record.description_vi} en={record.description_en} />
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 130,
      align: "right" as const,
      sorter: (a: BackendService, b: BackendService) => (a.price || 0) - (b.price || 0),
      render: (price: number) => <PriceCell value={price} />,
    },
    {
      title: "Thời lượng",
      dataIndex: "duration_minutes",
      key: "duration_minutes",
      width: 110,
      align: "right" as const,
      sorter: (a: BackendService, b: BackendService) =>
        (a.duration_minutes || 0) - (b.duration_minutes || 0),
      render: (duration: number) => (
        <span className="tabular-nums text-slate-600 dark:text-slate-400">{duration} phút</span>
      ),
    },
    {
      title: "",
      key: "action",
      width: 88,
      align: "right" as const,
      render: (_: unknown, record: BackendService) => (
        <Space size={0}>
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<EditOutlined />}
              type="text"
              aria-label={`Chỉnh sửa ${record.name_vi || "dịch vụ"}`}
              onClick={() => openModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa dịch vụ"
            description="Dịch vụ sẽ bị gỡ khỏi website. Bạn chắc chắn chứ?"
            onConfirm={() => record.id && handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button
                icon={<DeleteOutlined />}
                type="text"
                danger
                aria-label={`Xóa ${record.name_vi || "dịch vụ"}`}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card styles={{ body: { padding: 0 } }}>
        <ListToolbar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Tìm dịch vụ theo tên..."
          shown={filtered.length}
          total={services.length}
        >
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
            Thêm dịch vụ
          </Button>
        </ListToolbar>

        <Table
          columns={columns}
          dataSource={filtered.map((s) => ({ ...s, key: s.id }))}
          loading={loading}
          pagination={{ pageSize: 10, hideOnSinglePage: true, showSizeChanger: false }}
          // Numeric x switches antd to a fixed table layout, so the flexible
          // columns share the leftover width and long text truncates instead of
          // pushing the action column off screen.
          scroll={{ x: 800 }}
          locale={{
            emptyText: search
              ? "Không tìm thấy dịch vụ nào khớp với từ khóa."
              : "Chưa có dịch vụ nào. Bấm “Thêm dịch vụ” để tạo mục đầu tiên.",
          }}
        />
      </Card>

      <Modal
        title={editingService ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={640}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="pt-2">
          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <Form.Item label="Tên dịch vụ (Tiếng Việt)" name="name_vi" rules={[{ required: true, message: "Vui lòng nhập tên tiếng Việt." }]}>
              <Input placeholder="Cắt Tóc Classic" />
            </Form.Item>
            <Form.Item label="Tên dịch vụ (English)" name="name_en" rules={[{ required: true, message: "Vui lòng nhập tên tiếng Anh." }]}>
              <Input placeholder="Classic Haircut" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <Form.Item label="Giá niêm yết (VNĐ)" name="price" rules={[{ required: true, message: "Vui lòng nhập giá." }]}>
              <InputNumber<number>
                className="w-full"
                min={0}
                step={10000}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                parser={(value) => Number((value || "").replace(/\./g, ""))}
              />
            </Form.Item>
            <Form.Item label="Thời lượng (phút)" name="duration_minutes" rules={[{ required: true, message: "Vui lòng nhập thời lượng." }]}>
              <InputNumber className="w-full" min={5} step={5} />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <Form.Item label="Mô tả (Tiếng Việt)" name="description_vi">
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item label="Mô tả (English)" name="description_en">
              <TextArea rows={3} />
            </Form.Item>
          </div>

          <div className="mb-6">
            <ImageUploader label="Hình ảnh dịch vụ" value={imageUrl} onChange={setImageUrl} uploadType="service" />
          </div>

          <div className="flex justify-end gap-2 border-0 border-t border-solid border-slate-200 pt-4 dark:border-slate-700">
            <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={saving}>
              {editingService ? "Lưu thay đổi" : "Thêm dịch vụ"}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}

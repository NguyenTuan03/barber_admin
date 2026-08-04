"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Table, Button, Modal, Form, Input, Popconfirm, Space, Card, Tooltip, App as AntdApp } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { BackendGallery } from "@/types/backendResource";
import { getAdminGalleries, createAdminGallery, updateAdminGallery, deleteAdminGallery } from "@/services/adminApi";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ListToolbar, matchesSearch } from "@/components/admin/ListToolbar";
import { Thumbnail, BilingualCell, DescriptionCell } from "@/components/admin/cells";

const { TextArea } = Input;

export function GalleriesManager() {
  const { message } = AntdApp.useApp();
  const [galleries, setGalleries] = useState<BackendGallery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingGallery, setEditingGallery] = useState<BackendGallery | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string>("");

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAdminGalleries();
      setGalleries(data);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    getAdminGalleries()
      .then((data) => {
        if (isMounted) {
          setGalleries(data);
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

  const openModal = (gal?: BackendGallery) => {
    setEditingGallery(gal || null);
    setIsModalOpen(true);
  };

  // Populate the form only after the Modal (and its Form) have actually
  // mounted — calling form.setFieldsValue/resetFields from openModal() runs
  // before the Modal's `open` state change is committed, which logs antd's
  // "Instance created by useForm is not connected to any Form element"
  // warning since destroyOnHidden unmounts the Form between opens.
  useEffect(() => {
    if (!isModalOpen) return;

    if (editingGallery) {
      form.setFieldsValue({
        title_vi: editingGallery.title_vi || "",
        title_en: editingGallery.title_en || "",
        description_vi: editingGallery.description_vi || "",
        description_en: editingGallery.description_en || "",
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImageUrl(editingGallery.image_url || "");
    } else {
      form.resetFields();
      setImageUrl("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  const handleSubmit = async (values: Partial<BackendGallery>) => {
    setSaving(true);
    try {
      const payload: Partial<BackendGallery> = {
        ...values,
        image_url: imageUrl,
      };

      if (editingGallery?.id) {
        await updateAdminGallery(editingGallery.id, payload);
        message.success("Đã cập nhật mẫu tóc.");
      } else {
        await createAdminGallery(payload);
        message.success("Đã thêm mẫu tóc mới.");
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
      await deleteAdminGallery(id);
      message.success("Đã xóa mẫu tóc.");
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Xóa thất bại";
      message.error(msg);
    }
  };

  const filtered = useMemo(
    () =>
      galleries.filter((g) =>
        matchesSearch(search, g.title_vi, g.title_en, g.description_vi, g.description_en)
      ),
    [galleries, search]
  );

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image_url",
      key: "image_url",
      width: 100,
      render: (url: string, record: BackendGallery) => (
        <Thumbnail url={url} alt={record.title_vi || "Hình ảnh mẫu tóc"} width={80} />
      ),
    },
    {
      title: "Tiêu đề",
      key: "title",
      render: (_: unknown, record: BackendGallery) => (
        <BilingualCell vi={record.title_vi} en={record.title_en} />
      ),
    },
    {
      title: "Mô tả",
      key: "description",
      render: (_: unknown, record: BackendGallery) => (
        <DescriptionCell vi={record.description_vi} en={record.description_en} />
      ),
    },
    {
      title: "",
      key: "action",
      width: 88,
      align: "right" as const,
      render: (_: unknown, record: BackendGallery) => (
        <Space size={0}>
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<EditOutlined />}
              type="text"
              aria-label={`Chỉnh sửa ${record.title_vi || "mẫu tóc"}`}
              onClick={() => openModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa mẫu tóc"
            description="Ảnh mẫu tóc sẽ bị gỡ khỏi trang chủ. Bạn chắc chắn chứ?"
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
                aria-label={`Xóa ${record.title_vi || "mẫu tóc"}`}
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
          searchPlaceholder="Tìm mẫu tóc theo tiêu đề..."
          shown={filtered.length}
          total={galleries.length}
        >
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
            Thêm mẫu tóc
          </Button>
        </ListToolbar>

        <Table
          columns={columns}
          dataSource={filtered.map((g) => ({ ...g, key: g.id }))}
          loading={loading}
          pagination={{ pageSize: 10, hideOnSinglePage: true, showSizeChanger: false }}
          // Numeric x switches antd to a fixed table layout, so the flexible
          // columns share the leftover width and long text truncates instead of
          // pushing the action column off screen.
          scroll={{ x: 680 }}
          locale={{
            emptyText: search
              ? "Không tìm thấy mẫu tóc nào khớp với từ khóa."
              : "Chưa có mẫu tóc nào. Bấm “Thêm mẫu tóc” để tạo mục đầu tiên.",
          }}
        />
      </Card>

      <Modal
        title={editingGallery ? "Chỉnh sửa mẫu tóc" : "Thêm mẫu tóc"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={640}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="pt-2">
          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <Form.Item label="Tiêu đề (Tiếng Việt)" name="title_vi" rules={[{ required: true, message: "Vui lòng nhập tiêu đề tiếng Việt." }]}>
              <Input placeholder="Undercut Hiện Đại" />
            </Form.Item>
            <Form.Item label="Tiêu đề (English)" name="title_en" rules={[{ required: true, message: "Vui lòng nhập tiêu đề tiếng Anh." }]}>
              <Input placeholder="Modern Undercut" />
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
            <ImageUploader label="Hình ảnh mẫu tóc" value={imageUrl} onChange={setImageUrl} uploadType="gallery" />
          </div>

          <div className="flex justify-end gap-2 border-0 border-t border-solid border-slate-200 pt-4 dark:border-slate-700">
            <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={saving}>
              {editingGallery ? "Lưu thay đổi" : "Thêm mẫu tóc"}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}

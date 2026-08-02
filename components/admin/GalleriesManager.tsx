"use client";

import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Popconfirm, Space, Card, App as AntdApp } from "antd";
import { PictureOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { BackendGallery } from "@/types/backendResource";
import { getAdminGalleries, createAdminGallery, updateAdminGallery, deleteAdminGallery } from "@/services/adminApi";
import { ImageUploader } from "@/components/admin/ImageUploader";
import Image from "next/image";

const { TextArea } = Input;

export function GalleriesManager() {
  const { message } = AntdApp.useApp();
  const [galleries, setGalleries] = useState<BackendGallery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingGallery, setEditingGallery] = useState<BackendGallery | null>(null);

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
    try {
      const payload: Partial<BackendGallery> = {
        ...values,
        image_url: imageUrl,
      };

      if (editingGallery?.id) {
        await updateAdminGallery(editingGallery.id, payload);
        message.success("Cập nhật mẫu tóc thành công!");
      } else {
        await createAdminGallery(payload);
        message.success("Thêm mẫu tóc mới thành công!");
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
      await deleteAdminGallery(id);
      message.success("Đã xóa ảnh mẫu tóc!");
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Xóa thất bại";
      message.error(msg);
    }
  };

  const columns = [
    {
      title: "Hình ảnh Mẫu tóc",
      dataIndex: "image_url",
      key: "image_url",
      width: 120,
      render: (url: string, record: BackendGallery) =>
        url ? (
          <div className="relative w-20 h-14 rounded-xl overflow-hidden border border-solid border-zinc-200 dark:border-zinc-800 bg-zinc-900 group">
            <Image src={url} alt={record.title_vi || "Hình ảnh mẫu tóc"} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
          </div>
        ) : (
          <div className="w-20 h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
            No Pic
          </div>
        ),
    },
    {
      title: "Tiêu đề Mẫu tóc (VI / EN)",
      key: "title",
      render: (_: unknown, record: BackendGallery) => (
        <div className="flex flex-col">
          <span className="font-extrabold text-xs text-zinc-900 dark:text-zinc-100">{record.title_vi}</span>
          <span className="text-[11px] text-amber-600 dark:text-amber-500 font-medium">{record.title_en}</span>
        </div>
      ),
    },
    {
      title: "Mô tả Mẫu tóc",
      key: "description",
      render: (_: unknown, record: BackendGallery) => (
        <div className="flex flex-col max-w-xs text-xs text-zinc-500 space-y-0.5">
          <span className="line-clamp-1">{record.description_vi}</span>
          <span className="line-clamp-1 italic text-[11px] text-zinc-400">{record.description_en}</span>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "right" as const,
      render: (_: unknown, record: BackendGallery) => (
        <Space size="small">
          <Button icon={<EditOutlined />} type="text" onClick={() => openModal(record)} className="text-amber-500" />
          <Popconfirm
            title="Xóa mẫu tóc"
            description="Bạn có chắc chắn muốn xóa mẫu tóc này?"
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
              <PictureOutlined />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 m-0">
                Quản lý Bộ Sưu Tập Mẫu Tóc Hot Trend
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 m-0">
                Quản lý các mẫu tóc nổi bật hiển thị ở trang chủ.
              </p>
            </div>
          </div>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
            className="font-extrabold text-xs rounded-xl px-5 bg-gradient-to-r from-amber-500 to-amber-600 border-none shadow-md shadow-amber-500/20"
          >
            Thêm Mẫu tóc mới
          </Button>
        </div>
      </Card>

      <Card className="shadow-xs rounded-2xl border-solid border-zinc-200 dark:border-zinc-800 p-0 overflow-hidden">
        <Table
          columns={columns}
          dataSource={galleries.map((g) => ({ ...g, key: g.id }))}
          loading={loading}
          pagination={{ pageSize: 8 }}
          className="text-xs"
        />
      </Card>

      <Modal
        title={editingGallery ? "Chỉnh sửa Mẫu Tóc" : "Thêm Mẫu Tóc Mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="text-xs pt-2">
          <div className="grid grid-cols-2 gap-3">
            <Form.Item label="Tiêu đề Mẫu tóc (VI)" name="title_vi" rules={[{ required: true, message: "Vui lòng nhập tiêu đề VI!" }]}>
              <Input placeholder="Modern Undercut" />
            </Form.Item>
            <Form.Item label="Tiêu đề Mẫu tóc (EN)" name="title_en" rules={[{ required: true, message: "Vui lòng nhập tiêu đề EN!" }]}>
              <Input placeholder="Modern Undercut" />
            </Form.Item>
          </div>

          <Form.Item label="Mô tả Mẫu tóc (VI)" name="description_vi">
            <TextArea rows={2} />
          </Form.Item>

          <Form.Item label="Mô tả Mẫu tóc (EN)" name="description_en">
            <TextArea rows={2} />
          </Form.Item>

          <div className="mb-4">
            <ImageUploader label="Hình ảnh Mẫu tóc" value={imageUrl} onChange={setImageUrl} uploadType="gallery" />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-solid border-zinc-200 dark:border-zinc-800">
            <Button onClick={() => setIsModalOpen(false)}>Hủy bỏ</Button>
            <Button type="primary" htmlType="submit" className="bg-amber-500 font-extrabold border-none">
              Lưu Mẫu Tóc
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

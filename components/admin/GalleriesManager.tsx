"use client";

import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Tag, Popconfirm, Space, Card, App as AntdApp } from "antd";
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
    if (gal) {
      setEditingGallery(gal);
      form.setFieldsValue({
        title_vi: gal.title_vi || "",
        title_en: gal.title_en || "",
        description_vi: gal.description_vi || "",
        description_en: gal.description_en || "",
      });
      setImageUrl(gal.image_url || "");
    } else {
      setEditingGallery(null);
      form.resetFields();
      setImageUrl("");
    }
    setIsModalOpen(true);
  };

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
            <Image src={url} alt={record.title_vi} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
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
          <div>
            <Tag color="warning" icon={<PictureOutlined />} className="font-extrabold uppercase tracking-widest text-[10px] mb-1 rounded-full px-3 py-0.5 border-amber-500/30">
              Galleries Showcase API
            </Tag>
            <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight m-0">
              Quản lý Bộ Sưu Tập Mẫu Tóc Hot Trend
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 m-0">
              Kết nối trực tiếp API Backend `/api/v1/admin/galleries`.
            </p>
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
        destroyOnClose
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
            <ImageUploader label="Hình ảnh Mẫu tóc" value={imageUrl} onChange={setImageUrl} uploadType="galleries" />
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

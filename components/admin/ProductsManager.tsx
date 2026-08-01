"use client";

import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Tag, Popconfirm, Space, Card, App as AntdApp } from "antd";
import { ShoppingOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { BackendProduct } from "@/types/backendResource";
import { getAdminProducts, createAdminProduct, updateAdminProduct, deleteAdminProduct } from "@/services/adminApi";
import { ImageUploader } from "@/components/admin/ImageUploader";
import Image from "next/image";

const { TextArea } = Input;

export function ProductsManager() {
  const { message } = AntdApp.useApp();
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<BackendProduct | null>(null);

  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string>("");

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAdminProducts();
      setProducts(data);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    getAdminProducts()
      .then((data) => {
        if (isMounted) {
          setProducts(data);
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

  const openModal = (prod?: BackendProduct) => {
    if (prod) {
      setEditingProduct(prod);
      form.setFieldsValue({
        name_vi: prod.name_vi || "",
        name_en: prod.name_en || "",
        description_vi: prod.description_vi || "",
        description_en: prod.description_en || "",
        price: prod.price || 200000,
      });
      setImageUrl(prod.image_url || "");
    } else {
      setEditingProduct(null);
      form.resetFields();
      form.setFieldsValue({
        price: 200000,
      });
      setImageUrl("");
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: Partial<BackendProduct>) => {
    try {
      const payload: Partial<BackendProduct> = {
        ...values,
        price: Number(values.price),
        image_url: imageUrl,
      };

      if (editingProduct?.id) {
        await updateAdminProduct(editingProduct.id, payload);
        message.success("Cập nhật sản phẩm thành công!");
      } else {
        await createAdminProduct(payload);
        message.success("Thêm sản phẩm mới thành công!");
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
      await deleteAdminProduct(id);
      message.success("Đã xóa sản phẩm!");
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Xóa thất bại";
      message.error(msg);
    }
  };

  const columns = [
    {
      title: "Ảnh Sản phẩm",
      dataIndex: "image_url",
      key: "image_url",
      width: 100,
      render: (url: string, record: BackendProduct) =>
        url ? (
          <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-solid border-zinc-200 dark:border-zinc-800 bg-zinc-900 group">
            <Image src={url} alt={record.name_vi} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
            No Pic
          </div>
        ),
    },
    {
      title: "Tên Sản phẩm (VI / EN)",
      key: "name",
      render: (_: unknown, record: BackendProduct) => (
        <div className="flex flex-col">
          <span className="font-extrabold text-xs text-zinc-900 dark:text-zinc-100">{record.name_vi}</span>
          <span className="text-[11px] text-amber-600 dark:text-amber-500 font-medium">{record.name_en}</span>
        </div>
      ),
    },
    {
      title: "Mô tả",
      key: "description",
      render: (_: unknown, record: BackendProduct) => (
        <div className="flex flex-col max-w-xs text-xs text-zinc-500 space-y-0.5">
          <span className="line-clamp-1">{record.description_vi}</span>
          <span className="line-clamp-1 italic text-[11px] text-zinc-400">{record.description_en}</span>
        </div>
      ),
    },
    {
      title: "Giá Bán",
      dataIndex: "price",
      key: "price",
      render: (price: number) => (
        <span className="font-extrabold font-mono text-emerald-600 dark:text-emerald-400 text-xs">
          {price?.toLocaleString("vi-VN")} VNĐ
        </span>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "right" as const,
      render: (_: unknown, record: BackendProduct) => (
        <Space size="small">
          <Button icon={<EditOutlined />} type="text" onClick={() => openModal(record)} className="text-amber-500" />
          <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn có chắc chắn muốn xóa sản phẩm này?"
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
            <Tag color="warning" icon={<ShoppingOutlined />} className="font-extrabold uppercase tracking-widest text-[10px] mb-1 rounded-full px-3 py-0.5 border-amber-500/30">
              Products Store API
            </Tag>
            <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight m-0">
              Quản lý Sản Phẩm Chăm Sóc Tóc & Râu
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 m-0">
              Kết nối trực tiếp API Backend `/api/v1/admin/products`.
            </p>
          </div>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
            className="font-extrabold text-xs rounded-xl px-5 bg-gradient-to-r from-amber-500 to-amber-600 border-none shadow-md shadow-amber-500/20"
          >
            Thêm Sản phẩm mới
          </Button>
        </div>
      </Card>

      <Card className="shadow-xs rounded-2xl border-solid border-zinc-200 dark:border-zinc-800 p-0 overflow-hidden">
        <Table
          columns={columns}
          dataSource={products.map((p) => ({ ...p, key: p.id }))}
          loading={loading}
          pagination={{ pageSize: 8 }}
          className="text-xs"
        />
      </Card>

      <Modal
        title={editingProduct ? "Chỉnh sửa Sản phẩm" : "Thêm Sản phẩm mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="text-xs pt-2">
          <div className="grid grid-cols-2 gap-3">
            <Form.Item label="Tên Sản phẩm (VI)" name="name_vi" rules={[{ required: true, message: "Vui lòng nhập tên VI!" }]}>
              <Input placeholder="Sáp Vuốt Tóc Matte Clay" />
            </Form.Item>
            <Form.Item label="Tên Sản phẩm (EN)" name="name_en" rules={[{ required: true, message: "Vui lòng nhập tên EN!" }]}>
              <Input placeholder="Matte Clay Wax" />
            </Form.Item>
          </div>

          <Form.Item label="Giá Bán (VNĐ)" name="price" rules={[{ required: true, message: "Vui lòng nhập giá!" }]}>
            <InputNumber className="w-full" min={0} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
          </Form.Item>

          <Form.Item label="Mô tả Sản phẩm (VI)" name="description_vi">
            <TextArea rows={2} />
          </Form.Item>

          <Form.Item label="Mô tả Sản phẩm (EN)" name="description_en">
            <TextArea rows={2} />
          </Form.Item>

          <div className="mb-4">
            <ImageUploader label="Hình ảnh Sản phẩm" value={imageUrl} onChange={setImageUrl} uploadType="products" />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-solid border-zinc-200 dark:border-zinc-800">
            <Button onClick={() => setIsModalOpen(false)}>Hủy bỏ</Button>
            <Button type="primary" htmlType="submit" className="bg-amber-500 font-extrabold border-none">
              Lưu Sản Phẩm
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

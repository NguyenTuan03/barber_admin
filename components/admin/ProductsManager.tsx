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
import { BackendProduct } from "@/types/backendResource";
import { getAdminProducts, createAdminProduct, updateAdminProduct, deleteAdminProduct } from "@/services/adminApi";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ListToolbar, matchesSearch } from "@/components/admin/ListToolbar";
import { Thumbnail, BilingualCell, DescriptionCell, PriceCell } from "@/components/admin/cells";

const { TextArea } = Input;

export function ProductsManager() {
  const { message } = AntdApp.useApp();
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<BackendProduct | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

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
    setEditingProduct(prod || null);
    setIsModalOpen(true);
  };

  // Populate the form only after the Modal (and its Form) have actually
  // mounted — calling form.setFieldsValue/resetFields from openModal() runs
  // before the Modal's `open` state change is committed, which logs antd's
  // "Instance created by useForm is not connected to any Form element"
  // warning since destroyOnHidden unmounts the Form between opens.
  useEffect(() => {
    if (!isModalOpen) return;

    if (editingProduct) {
      form.setFieldsValue({
        name_vi: editingProduct.name_vi || "",
        name_en: editingProduct.name_en || "",
        description_vi: editingProduct.description_vi || "",
        description_en: editingProduct.description_en || "",
        price: editingProduct.price || 200000,
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImageUrl(editingProduct.image_url || "");
    } else {
      form.resetFields();
      form.setFieldsValue({
        price: 200000,
      });
      setImageUrl("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  const handleSubmit = async (values: Partial<BackendProduct>) => {
    setSaving(true);
    try {
      const payload: Partial<BackendProduct> = {
        ...values,
        price: Number(values.price),
        image_url: imageUrl,
      };

      if (editingProduct?.id) {
        await updateAdminProduct(editingProduct.id, payload);
        message.success("Đã cập nhật sản phẩm.");
      } else {
        await createAdminProduct(payload);
        message.success("Đã thêm sản phẩm mới.");
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
      await deleteAdminProduct(id);
      message.success("Đã xóa sản phẩm.");
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Xóa thất bại";
      message.error(msg);
    }
  };

  const filtered = useMemo(
    () =>
      products.filter((p) =>
        matchesSearch(search, p.name_vi, p.name_en, p.description_vi, p.description_en)
      ),
    [products, search]
  );

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "image_url",
      key: "image_url",
      width: 80,
      render: (url: string, record: BackendProduct) => (
        <Thumbnail url={url} alt={record.name_vi || "Hình ảnh sản phẩm"} />
      ),
    },
    {
      title: "Tên sản phẩm",
      key: "name",
      render: (_: unknown, record: BackendProduct) => (
        <BilingualCell vi={record.name_vi} en={record.name_en} />
      ),
    },
    {
      title: "Mô tả",
      key: "description",
      render: (_: unknown, record: BackendProduct) => (
        <DescriptionCell vi={record.description_vi} en={record.description_en} />
      ),
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      width: 130,
      align: "right" as const,
      sorter: (a: BackendProduct, b: BackendProduct) => (a.price || 0) - (b.price || 0),
      render: (price: number) => <PriceCell value={price} />,
    },
    {
      title: "",
      key: "action",
      width: 88,
      align: "right" as const,
      render: (_: unknown, record: BackendProduct) => (
        <Space size={0}>
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<EditOutlined />}
              type="text"
              aria-label={`Chỉnh sửa ${record.name_vi || "sản phẩm"}`}
              onClick={() => openModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa sản phẩm"
            description="Sản phẩm sẽ bị gỡ khỏi website. Bạn chắc chắn chứ?"
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
                aria-label={`Xóa ${record.name_vi || "sản phẩm"}`}
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
          searchPlaceholder="Tìm sản phẩm theo tên..."
          shown={filtered.length}
          total={products.length}
        >
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
            Thêm sản phẩm
          </Button>
        </ListToolbar>

        <Table
          columns={columns}
          dataSource={filtered.map((p) => ({ ...p, key: p.id }))}
          loading={loading}
          pagination={{ pageSize: 10, hideOnSinglePage: true, showSizeChanger: false }}
          // Numeric x switches antd to a fixed table layout, so the flexible
          // columns share the leftover width and long text truncates instead of
          // pushing the action column off screen.
          scroll={{ x: 720 }}
          locale={{
            emptyText: search
              ? "Không tìm thấy sản phẩm nào khớp với từ khóa."
              : "Chưa có sản phẩm nào. Bấm “Thêm sản phẩm” để tạo mục đầu tiên.",
          }}
        />
      </Card>

      <Modal
        title={editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={640}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="pt-2">
          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <Form.Item label="Tên sản phẩm (Tiếng Việt)" name="name_vi" rules={[{ required: true, message: "Vui lòng nhập tên tiếng Việt." }]}>
              <Input placeholder="Sáp Vuốt Tóc Matte Clay" />
            </Form.Item>
            <Form.Item label="Tên sản phẩm (English)" name="name_en" rules={[{ required: true, message: "Vui lòng nhập tên tiếng Anh." }]}>
              <Input placeholder="Matte Clay Wax" />
            </Form.Item>
          </div>

          <Form.Item label="Giá bán (VNĐ)" name="price" rules={[{ required: true, message: "Vui lòng nhập giá." }]}>
            <InputNumber<number>
              className="w-full sm:w-1/2"
              min={0}
              step={10000}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
              parser={(value) => Number((value || "").replace(/\./g, ""))}
            />
          </Form.Item>

          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <Form.Item label="Mô tả (Tiếng Việt)" name="description_vi">
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item label="Mô tả (English)" name="description_en">
              <TextArea rows={3} />
            </Form.Item>
          </div>

          <div className="mb-6">
            <ImageUploader label="Hình ảnh sản phẩm" value={imageUrl} onChange={setImageUrl} uploadType="product" />
          </div>

          <div className="flex justify-end gap-2 border-0 border-t border-solid border-slate-200 pt-4 dark:border-slate-700">
            <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={saving}>
              {editingProduct ? "Lưu thay đổi" : "Thêm sản phẩm"}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}

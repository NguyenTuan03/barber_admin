"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Popconfirm,
  Space,
  Card,
  Tooltip,
  App as AntdApp,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, LinkOutlined } from "@ant-design/icons";
import { BackendLocation } from "@/types/backendResource";
import { getAdminLocations, createAdminLocation, updateAdminLocation, deleteAdminLocation } from "@/services/adminApi";
import { ListToolbar, matchesSearch } from "@/components/admin/ListToolbar";
import { BilingualCell, DescriptionCell, VisibilityTag } from "@/components/admin/cells";

const { TextArea } = Input;

export function LocationsManager() {
  const { message } = AntdApp.useApp();
  const [locations, setLocations] = useState<BackendLocation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingLocation, setEditingLocation] = useState<BackendLocation | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

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
    setSaving(true);
    try {
      const payload: Partial<BackendLocation> = {
        ...values,
        position: Number(values.position),
      };

      if (editingLocation?.id) {
        await updateAdminLocation(editingLocation.id, payload);
        message.success("Đã cập nhật chi nhánh.");
      } else {
        await createAdminLocation(payload);
        message.success("Đã thêm chi nhánh mới.");
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
      await deleteAdminLocation(id);
      message.success("Đã xóa chi nhánh.");
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Xóa thất bại";
      message.error(msg);
    }
  };

  const filtered = useMemo(
    () =>
      locations.filter((l) =>
        matchesSearch(search, l.name_vi, l.name_en, l.address_vi, l.address_en)
      ),
    [locations, search]
  );

  const columns = [
    {
      title: "Thứ tự",
      dataIndex: "position",
      key: "position",
      width: 80,
      align: "center" as const,
      sorter: (a: BackendLocation, b: BackendLocation) => (a.position || 0) - (b.position || 0),
      render: (pos: number) => (
        <span className="tabular-nums text-slate-500 dark:text-slate-400">{pos}</span>
      ),
    },
    {
      title: "Chi nhánh",
      key: "name",
      render: (_: unknown, record: BackendLocation) => (
        <BilingualCell vi={record.name_vi} en={record.name_en} />
      ),
    },
    {
      title: "Địa chỉ",
      key: "address",
      render: (_: unknown, record: BackendLocation) => (
        <DescriptionCell vi={record.address_vi} en={record.address_en} />
      ),
    },
    {
      title: "Bản đồ",
      dataIndex: "location_url",
      key: "location_url",
      width: 110,
      render: (url?: string) =>
        url ? (
          <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">
            <LinkOutlined /> Mở bản đồ
          </a>
        ) : (
          <span className="text-slate-400">—</span>
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      key: "is_active",
      width: 110,
      render: (active: boolean) => <VisibilityTag active={active} />,
    },
    {
      title: "",
      key: "action",
      width: 88,
      align: "right" as const,
      render: (_: unknown, record: BackendLocation) => (
        <Space size={0}>
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<EditOutlined />}
              type="text"
              aria-label={`Chỉnh sửa ${record.name_vi || "chi nhánh"}`}
              onClick={() => openModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa chi nhánh"
            description="Chi nhánh sẽ bị gỡ khỏi website. Bạn chắc chắn chứ?"
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
                aria-label={`Xóa ${record.name_vi || "chi nhánh"}`}
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
          searchPlaceholder="Tìm chi nhánh theo tên hoặc địa chỉ..."
          shown={filtered.length}
          total={locations.length}
        >
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
            Thêm chi nhánh
          </Button>
        </ListToolbar>

        <Table
          columns={columns}
          dataSource={filtered.map((l) => ({ ...l, key: l.id }))}
          loading={loading}
          pagination={{ pageSize: 10, hideOnSinglePage: true, showSizeChanger: false }}
          // Numeric x switches antd to a fixed table layout, so the flexible
          // columns share the leftover width and long text truncates instead of
          // pushing the action column off screen.
          scroll={{ x: 800 }}
          locale={{
            emptyText: search
              ? "Không tìm thấy chi nhánh nào khớp với từ khóa."
              : "Chưa có chi nhánh nào. Bấm “Thêm chi nhánh” để tạo mục đầu tiên.",
          }}
        />
      </Card>

      <Modal
        title={editingLocation ? "Chỉnh sửa chi nhánh" : "Thêm chi nhánh"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={640}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="pt-2">
          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <Form.Item label="Tên chi nhánh (Tiếng Việt)" name="name_vi" rules={[{ required: true, message: "Vui lòng nhập tên tiếng Việt." }]}>
              <Input placeholder="T99 Barbershop - An Khánh" />
            </Form.Item>
            <Form.Item label="Tên chi nhánh (English)" name="name_en" rules={[{ required: true, message: "Vui lòng nhập tên tiếng Anh." }]}>
              <Input placeholder="T99 Barbershop - An Khanh" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <Form.Item label="Địa chỉ (Tiếng Việt)" name="address_vi" rules={[{ required: true, message: "Vui lòng nhập địa chỉ tiếng Việt." }]}>
              <TextArea rows={2} placeholder="33/1 Quốc Hương, P. An Khánh, TP. HCM" />
            </Form.Item>
            <Form.Item label="Địa chỉ (English)" name="address_en" rules={[{ required: true, message: "Vui lòng nhập địa chỉ tiếng Anh." }]}>
              <TextArea rows={2} placeholder="33/1 Quoc Huong, An Khanh Ward, HCMC" />
            </Form.Item>
          </div>

          <Form.Item
            label="Link Google Maps"
            name="location_url"
            rules={[{ required: true, message: "Vui lòng nhập link Google Maps." }]}
            extra="Mở Google Maps, tìm cửa hàng, bấm Chia sẻ và dán link vào đây. Không cần link nhúng (embed)."
          >
            <Input prefix={<LinkOutlined className="text-slate-400" />} placeholder="https://maps.app.goo.gl/..." />
          </Form.Item>

          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <Form.Item
              label="Thứ tự hiển thị"
              name="position"
              rules={[{ required: true, message: "Vui lòng nhập thứ tự." }]}
              extra="Số nhỏ hơn hiển thị trước."
            >
              <InputNumber className="w-full" min={0} />
            </Form.Item>
            <Form.Item label="Hiển thị trên website" name="is_active" valuePropName="checked">
              <Switch checkedChildren="Hiện" unCheckedChildren="Ẩn" />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-2 border-0 border-t border-solid border-slate-200 pt-4 dark:border-slate-700">
            <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={saving}>
              {editingLocation ? "Lưu thay đổi" : "Thêm chi nhánh"}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}

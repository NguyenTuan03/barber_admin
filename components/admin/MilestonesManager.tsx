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
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { BackendMilestone } from "@/types/backendResource";
import {
  getAdminMilestones,
  createAdminMilestone,
  updateAdminMilestone,
  deleteAdminMilestone,
} from "@/services/adminApi";
import { ListToolbar, matchesSearch } from "@/components/admin/ListToolbar";
import { BilingualCell, DescriptionCell, VisibilityTag } from "@/components/admin/cells";

const { TextArea } = Input;

export function MilestonesManager() {
  const { message } = AntdApp.useApp();
  const [milestones, setMilestones] = useState<BackendMilestone[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingMilestone, setEditingMilestone] = useState<BackendMilestone | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

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
    setEditingMilestone(milestone || null);
    setIsModalOpen(true);
  };

  // Populate the form only after the Modal (and its Form) have actually
  // mounted — calling form.setFieldsValue/resetFields from openModal() runs
  // before the Modal's `open` state change is committed, which logs antd's
  // "Instance created by useForm is not connected to any Form element"
  // warning since destroyOnHidden unmounts the Form between opens.
  useEffect(() => {
    if (!isModalOpen) return;

    if (editingMilestone) {
      form.setFieldsValue({
        year: editingMilestone.year || "",
        position: editingMilestone.position ?? 0,
        is_active: editingMilestone.is_active ?? true,
        title_vi: editingMilestone.title_vi || "",
        title_en: editingMilestone.title_en || "",
        description_vi: editingMilestone.description_vi || "",
        description_en: editingMilestone.description_en || "",
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        year: new Date().getFullYear().toString(),
        position: milestones.length,
        is_active: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  const handleSubmit = async (values: Partial<BackendMilestone>) => {
    setSaving(true);
    try {
      const payload: Partial<BackendMilestone> = {
        ...values,
        position: Number(values.position),
      };

      if (editingMilestone?.id) {
        await updateAdminMilestone(editingMilestone.id, payload);
        message.success("Đã cập nhật cột mốc.");
      } else {
        await createAdminMilestone(payload);
        message.success("Đã thêm cột mốc mới.");
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
      await deleteAdminMilestone(id);
      message.success("Đã xóa cột mốc.");
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Xóa thất bại";
      message.error(msg);
    }
  };

  const filtered = useMemo(
    () =>
      milestones.filter((m) =>
        matchesSearch(search, m.year, m.title_vi, m.title_en, m.description_vi, m.description_en)
      ),
    [milestones, search]
  );

  const columns = [
    {
      title: "Năm",
      dataIndex: "year",
      key: "year",
      width: 90,
      sorter: (a: BackendMilestone, b: BackendMilestone) =>
        String(a.year || "").localeCompare(String(b.year || "")),
      render: (year: string) => (
        <span className="tabular-nums font-medium text-slate-900 dark:text-slate-100">{year}</span>
      ),
    },
    {
      title: "Thứ tự",
      dataIndex: "position",
      key: "position",
      width: 80,
      align: "center" as const,
      sorter: (a: BackendMilestone, b: BackendMilestone) => (a.position || 0) - (b.position || 0),
      render: (pos: number) => (
        <span className="tabular-nums text-slate-500 dark:text-slate-400">{pos}</span>
      ),
    },
    {
      title: "Tiêu đề",
      key: "title",
      render: (_: unknown, record: BackendMilestone) => (
        <BilingualCell vi={record.title_vi} en={record.title_en} />
      ),
    },
    {
      title: "Mô tả",
      key: "description",
      render: (_: unknown, record: BackendMilestone) => (
        <DescriptionCell vi={record.description_vi} en={record.description_en} />
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
      render: (_: unknown, record: BackendMilestone) => (
        <Space size={0}>
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<EditOutlined />}
              type="text"
              aria-label={`Chỉnh sửa cột mốc ${record.year || ""}`}
              onClick={() => openModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa cột mốc"
            description="Cột mốc sẽ bị gỡ khỏi trang Giới thiệu. Bạn chắc chắn chứ?"
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
                aria-label={`Xóa cột mốc ${record.year || ""}`}
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
          searchPlaceholder="Tìm cột mốc theo năm hoặc tiêu đề..."
          shown={filtered.length}
          total={milestones.length}
        >
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
            Thêm cột mốc
          </Button>
        </ListToolbar>

        <Table
          columns={columns}
          dataSource={filtered.map((m) => ({ ...m, key: m.id }))}
          loading={loading}
          pagination={{ pageSize: 10, hideOnSinglePage: true, showSizeChanger: false }}
          // Numeric x switches antd to a fixed table layout, so the flexible
          // columns share the leftover width and long text truncates instead of
          // pushing the action column off screen.
          scroll={{ x: 800 }}
          locale={{
            emptyText: search
              ? "Không tìm thấy cột mốc nào khớp với từ khóa."
              : "Chưa có cột mốc nào. Bấm “Thêm cột mốc” để tạo mục đầu tiên.",
          }}
        />
      </Card>

      <Modal
        title={editingMilestone ? "Chỉnh sửa cột mốc" : "Thêm cột mốc"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={640}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="pt-2">
          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <Form.Item label="Năm" name="year" rules={[{ required: true, message: "Vui lòng nhập năm." }]}>
              <Input placeholder="2024" />
            </Form.Item>
            <Form.Item
              label="Thứ tự hiển thị"
              name="position"
              rules={[{ required: true, message: "Vui lòng nhập thứ tự." }]}
              extra="Số nhỏ hơn hiển thị trước."
            >
              <InputNumber className="w-full" min={0} />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <Form.Item label="Tiêu đề (Tiếng Việt)" name="title_vi" rules={[{ required: true, message: "Vui lòng nhập tiêu đề tiếng Việt." }]}>
              <Input placeholder="T99 Barbershop ra đời" />
            </Form.Item>
            <Form.Item label="Tiêu đề (English)" name="title_en" rules={[{ required: true, message: "Vui lòng nhập tiêu đề tiếng Anh." }]}>
              <Input placeholder="T99 Barbershop Is Born" />
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

          <Form.Item label="Hiển thị trên website" name="is_active" valuePropName="checked">
            <Switch checkedChildren="Hiện" unCheckedChildren="Ẩn" />
          </Form.Item>

          <div className="flex justify-end gap-2 border-0 border-t border-solid border-slate-200 pt-4 dark:border-slate-700">
            <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={saving}>
              {editingMilestone ? "Lưu thay đổi" : "Thêm cột mốc"}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}

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
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  InstagramOutlined,
  TwitterOutlined,
  FacebookOutlined,
} from "@ant-design/icons";
import { BackendBarber } from "@/types/backendResource";
import { getAdminBarbers, createAdminBarber, updateAdminBarber, deleteAdminBarber } from "@/services/adminApi";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ListToolbar, matchesSearch } from "@/components/admin/ListToolbar";
import { Thumbnail, BilingualCell, DescriptionCell, VisibilityTag } from "@/components/admin/cells";

const SOCIAL_LINKS: { key: keyof BackendBarber; label: string; icon: React.ReactNode }[] = [
  { key: "instagram_url", label: "Instagram", icon: <InstagramOutlined /> },
  { key: "twitter_url", label: "Twitter/X", icon: <TwitterOutlined /> },
  { key: "facebook_url", label: "Facebook", icon: <FacebookOutlined /> },
];

export function BarbersManager() {
  const { message } = AntdApp.useApp();
  const [barbers, setBarbers] = useState<BackendBarber[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingBarber, setEditingBarber] = useState<BackendBarber | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAdminBarbers();
      setBarbers(data);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    getAdminBarbers()
      .then((data) => {
        if (isMounted) {
          setBarbers(data);
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

  const openModal = (barber?: BackendBarber) => {
    setEditingBarber(barber || null);
    setIsModalOpen(true);
  };

  // Populate the form only after the Modal (and its Form) have actually
  // mounted — calling form.setFieldsValue/resetFields from openModal() runs
  // before the Modal's `open` state change is committed, which logs antd's
  // "Instance created by useForm is not connected to any Form element"
  // warning since destroyOnHidden unmounts the Form between opens.
  useEffect(() => {
    if (!isModalOpen) return;

    if (editingBarber) {
      form.setFieldsValue({
        name_vi: editingBarber.name_vi || "",
        name_en: editingBarber.name_en || "",
        role_vi: editingBarber.role_vi || "",
        role_en: editingBarber.role_en || "",
        years_of_experience: editingBarber.years_of_experience ?? 1,
        instagram_url: editingBarber.instagram_url || "",
        twitter_url: editingBarber.twitter_url || "",
        facebook_url: editingBarber.facebook_url || "",
        position: editingBarber.position ?? 0,
        is_active: editingBarber.is_active ?? true,
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAvatarUrl(editingBarber.avatar_url || "");
    } else {
      form.resetFields();
      form.setFieldsValue({
        years_of_experience: 1,
        position: barbers.length,
        is_active: true,
      });
      setAvatarUrl("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  const handleSubmit = async (values: Partial<BackendBarber>) => {
    setSaving(true);
    try {
      const payload: Partial<BackendBarber> = {
        ...values,
        years_of_experience: values.years_of_experience ? Number(values.years_of_experience) : undefined,
        position: Number(values.position),
        avatar_url: avatarUrl,
      };

      if (editingBarber?.id) {
        await updateAdminBarber(editingBarber.id, payload);
        message.success("Đã cập nhật hồ sơ thợ.");
      } else {
        await createAdminBarber(payload);
        message.success("Đã thêm thợ mới.");
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
      await deleteAdminBarber(id);
      message.success("Đã xóa hồ sơ thợ.");
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Xóa thất bại";
      message.error(msg);
    }
  };

  const filtered = useMemo(
    () =>
      barbers.filter((b) => matchesSearch(search, b.name_vi, b.name_en, b.role_vi, b.role_en)),
    [barbers, search]
  );

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "avatar_url",
      key: "avatar_url",
      width: 80,
      render: (url: string, record: BackendBarber) => (
        <Thumbnail url={url} alt={record.name_vi || "Ảnh đại diện thợ"} className="object-top" />
      ),
    },
    {
      title: "Thợ cắt tóc",
      key: "name",
      render: (_: unknown, record: BackendBarber) => (
        <BilingualCell vi={record.name_vi} en={record.name_en} />
      ),
    },
    {
      title: "Chức danh",
      key: "role",
      render: (_: unknown, record: BackendBarber) => (
        <DescriptionCell vi={record.role_vi} en={record.role_en} />
      ),
    },
    {
      title: "Kinh nghiệm",
      dataIndex: "years_of_experience",
      key: "years_of_experience",
      width: 120,
      align: "right" as const,
      sorter: (a: BackendBarber, b: BackendBarber) =>
        (a.years_of_experience || 0) - (b.years_of_experience || 0),
      render: (years?: number) =>
        years ? (
          <span className="tabular-nums text-slate-600 dark:text-slate-400">{years} năm</span>
        ) : (
          <span className="text-slate-400">—</span>
        ),
    },
    {
      title: "Mạng xã hội",
      key: "social",
      width: 130,
      render: (_: unknown, record: BackendBarber) => {
        const links = SOCIAL_LINKS.filter((social) => record[social.key]);
        if (links.length === 0) return <span className="text-slate-400">—</span>;
        return (
          <Space size="middle">
            {links.map((social) => (
              <Tooltip key={social.key} title={social.label}>
                <a
                  href={String(record[social.key])}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${social.label} của ${record.name_vi || "thợ"}`}
                >
                  {social.icon}
                </a>
              </Tooltip>
            ))}
          </Space>
        );
      },
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
      render: (_: unknown, record: BackendBarber) => (
        <Space size={0}>
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<EditOutlined />}
              type="text"
              aria-label={`Chỉnh sửa ${record.name_vi || "thợ"}`}
              onClick={() => openModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa hồ sơ thợ"
            description="Hồ sơ sẽ bị gỡ khỏi website. Bạn chắc chắn chứ?"
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
                aria-label={`Xóa ${record.name_vi || "thợ"}`}
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
          searchPlaceholder="Tìm thợ theo tên hoặc chức danh..."
          shown={filtered.length}
          total={barbers.length}
        >
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
            Thêm thợ
          </Button>
        </ListToolbar>

        <Table
          columns={columns}
          dataSource={filtered.map((b) => ({ ...b, key: b.id }))}
          loading={loading}
          pagination={{ pageSize: 10, hideOnSinglePage: true, showSizeChanger: false }}
          // Numeric x switches antd to a fixed table layout, so the flexible
          // columns share the leftover width and long text truncates instead of
          // pushing the action column off screen.
          scroll={{ x: 900 }}
          locale={{
            emptyText: search
              ? "Không tìm thấy thợ nào khớp với từ khóa."
              : "Chưa có thợ nào. Bấm “Thêm thợ” để tạo hồ sơ đầu tiên.",
          }}
        />
      </Card>

      <Modal
        title={editingBarber ? "Chỉnh sửa hồ sơ thợ" : "Thêm thợ"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={640}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="pt-2">
          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <Form.Item label="Tên thợ (Tiếng Việt)" name="name_vi" rules={[{ required: true, message: "Vui lòng nhập tên tiếng Việt." }]}>
              <Input placeholder="Nguyễn Văn A" />
            </Form.Item>
            <Form.Item label="Tên thợ (English)" name="name_en" rules={[{ required: true, message: "Vui lòng nhập tên tiếng Anh." }]}>
              <Input placeholder="Arthur Pendelton" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <Form.Item label="Chức danh (Tiếng Việt)" name="role_vi" rules={[{ required: true, message: "Vui lòng nhập chức danh tiếng Việt." }]}>
              <Input placeholder="Thợ Cả & Nhà Sáng Lập" />
            </Form.Item>
            <Form.Item label="Chức danh (English)" name="role_en" rules={[{ required: true, message: "Vui lòng nhập chức danh tiếng Anh." }]}>
              <Input placeholder="Master Barber & Founder" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <Form.Item label="Số năm kinh nghiệm" name="years_of_experience">
              <InputNumber className="w-full" min={0} />
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

          <div className="mb-6">
            <ImageUploader label="Ảnh đại diện" value={avatarUrl} onChange={setAvatarUrl} uploadType="barber" />
          </div>

          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-3">
            <Form.Item label="Instagram" name="instagram_url">
              <Input prefix={<InstagramOutlined className="text-slate-400" />} placeholder="https://instagram.com/..." />
            </Form.Item>
            <Form.Item label="Twitter/X" name="twitter_url">
              <Input prefix={<TwitterOutlined className="text-slate-400" />} placeholder="https://twitter.com/..." />
            </Form.Item>
            <Form.Item label="Facebook" name="facebook_url">
              <Input prefix={<FacebookOutlined className="text-slate-400" />} placeholder="https://facebook.com/..." />
            </Form.Item>
          </div>

          <Form.Item label="Hiển thị trên website" name="is_active" valuePropName="checked">
            <Switch checkedChildren="Hiện" unCheckedChildren="Ẩn" />
          </Form.Item>

          <div className="flex justify-end gap-2 border-0 border-t border-solid border-slate-200 pt-4 dark:border-slate-700">
            <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={saving}>
              {editingBarber ? "Lưu thay đổi" : "Thêm thợ"}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}

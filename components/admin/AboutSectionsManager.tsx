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
  Select,
  Tag,
  Popconfirm,
  Space,
  Card,
  Tooltip,
  Alert,
  App as AntdApp,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { BackendAboutSection } from "@/types/backendResource";
import {
  getAdminAboutSections,
  createAdminAboutSection,
  updateAdminAboutSection,
  deleteAdminAboutSection,
} from "@/services/adminApi";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ListToolbar, matchesSearch } from "@/components/admin/ListToolbar";
import { Thumbnail, BilingualCell, VisibilityTag } from "@/components/admin/cells";

const { TextArea } = Input;

const SECTION_TYPE_META: Record<BackendAboutSection["section_type"], { label: string }> = {
  hero: { label: "Hero (đầu trang)" },
  story: { label: "Câu chuyện" },
  stats: { label: "Số liệu thống kê" },
  value: { label: "Giá trị cốt lõi" },
  team_intro: { label: "Giới thiệu đội ngũ" },
};

export function AboutSectionsManager() {
  const { message } = AntdApp.useApp();
  const [sections, setSections] = useState<BackendAboutSection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSection, setEditingSection] = useState<BackendAboutSection | null>(null);
  const [sectionType, setSectionType] = useState<BackendAboutSection["section_type"]>("story");
  const [saving, setSaving] = useState<boolean>(false);

  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string>("");

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAdminAboutSections();
      setSections(data);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    getAdminAboutSections()
      .then((data) => {
        if (isMounted) {
          setSections(data);
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

  const openModal = (section?: BackendAboutSection) => {
    setEditingSection(section || null);
    setIsModalOpen(true);
  };

  // Populate the form only after the Modal (and its Form) have actually
  // mounted — calling form.setFieldsValue/resetFields from openModal() runs
  // before the Modal's `open` state change is committed, which logs antd's
  // "Instance created by useForm is not connected to any Form element"
  // warning since destroyOnHidden unmounts the Form between opens.
  useEffect(() => {
    if (!isModalOpen) return;

    if (editingSection) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSectionType(editingSection.section_type);
      form.setFieldsValue({
        section_type: editingSection.section_type,
        position: editingSection.position ?? 0,
        is_active: editingSection.is_active ?? true,
        title_vi: editingSection.title_vi || "",
        title_en: editingSection.title_en || "",
        subtitle_vi: editingSection.subtitle_vi || "",
        subtitle_en: editingSection.subtitle_en || "",
        content_vi: editingSection.content_vi || "",
        content_en: editingSection.content_en || "",
      });
      setImageUrl(editingSection.image_url || "");
    } else {
      setSectionType("story");
      form.resetFields();
      form.setFieldsValue({
        section_type: "story",
        position: sections.length,
        is_active: true,
      });
      setImageUrl("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  const handleSubmit = async (values: Partial<BackendAboutSection>) => {
    setSaving(true);
    try {
      const payload: Partial<BackendAboutSection> = {
        ...values,
        position: Number(values.position),
        image_url: imageUrl,
      };

      if (editingSection?.id) {
        await updateAdminAboutSection(editingSection.id, payload);
        message.success("Đã cập nhật phần nội dung.");
      } else {
        await createAdminAboutSection(payload);
        message.success("Đã thêm phần nội dung mới.");
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
      await deleteAdminAboutSection(id);
      message.success("Đã xóa phần nội dung.");
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Xóa thất bại";
      message.error(msg);
    }
  };

  const filtered = useMemo(
    () =>
      sections.filter((s) =>
        matchesSearch(
          search,
          s.title_vi,
          s.title_en,
          SECTION_TYPE_META[s.section_type]?.label,
          s.subtitle_vi
        )
      ),
    [sections, search]
  );

  const isStats = sectionType === "stats";

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "image_url",
      key: "image_url",
      width: 80,
      render: (url: string, record: BackendAboutSection) => (
        <Thumbnail url={url} alt={record.title_vi || "Hình ảnh phần nội dung"} />
      ),
    },
    {
      title: "Loại",
      dataIndex: "section_type",
      key: "section_type",
      width: 160,
      filters: Object.entries(SECTION_TYPE_META).map(([value, meta]) => ({
        text: meta.label,
        value,
      })),
      onFilter: (value: boolean | React.Key, record: BackendAboutSection) =>
        record.section_type === value,
      render: (type: BackendAboutSection["section_type"]) => (
        <Tag variant="filled">{SECTION_TYPE_META[type]?.label || type}</Tag>
      ),
    },
    {
      title: "Tiêu đề",
      key: "title",
      render: (_: unknown, record: BackendAboutSection) => (
        <BilingualCell vi={record.title_vi} en={record.title_en} />
      ),
    },
    {
      title: "Thứ tự",
      dataIndex: "position",
      key: "position",
      width: 80,
      align: "center" as const,
      sorter: (a: BackendAboutSection, b: BackendAboutSection) =>
        (a.position || 0) - (b.position || 0),
      render: (pos: number) => (
        <span className="tabular-nums text-slate-500 dark:text-slate-400">{pos}</span>
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
      render: (_: unknown, record: BackendAboutSection) => (
        <Space size={0}>
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<EditOutlined />}
              type="text"
              aria-label={`Chỉnh sửa ${record.title_vi || "phần nội dung"}`}
              onClick={() => openModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa phần nội dung"
            description="Phần này sẽ bị gỡ khỏi trang Giới thiệu. Bạn chắc chắn chứ?"
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
                aria-label={`Xóa ${record.title_vi || "phần nội dung"}`}
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
          searchPlaceholder="Tìm theo tiêu đề hoặc loại..."
          shown={filtered.length}
          total={sections.length}
        >
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
            Thêm phần nội dung
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
              ? "Không tìm thấy phần nội dung nào khớp với từ khóa."
              : "Chưa có phần nội dung nào. Bấm “Thêm phần nội dung” để tạo mục đầu tiên.",
          }}
        />
      </Card>

      <Modal
        title={editingSection ? "Chỉnh sửa phần nội dung" : "Thêm phần nội dung"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={640}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="pt-2">
          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <Form.Item label="Loại nội dung" name="section_type" rules={[{ required: true }]}>
              <Select
                onChange={(val) => setSectionType(val)}
                options={Object.entries(SECTION_TYPE_META).map(([value, meta]) => ({
                  value,
                  label: meta.label,
                }))}
              />
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
              <Input placeholder="Câu chuyện & Sứ mệnh" />
            </Form.Item>
            <Form.Item label="Tiêu đề (English)" name="title_en" rules={[{ required: true, message: "Vui lòng nhập tiêu đề tiếng Anh." }]}>
              <Input placeholder="Our Story & Mission" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <Form.Item label="Phụ đề (Tiếng Việt)" name="subtitle_vi">
              <Input placeholder="Hơn 10 năm xây dựng thương hiệu" />
            </Form.Item>
            <Form.Item label="Phụ đề (English)" name="subtitle_en">
              <Input placeholder="Over 10 years of brand building" />
            </Form.Item>
          </div>

          {isStats && (
            <Alert
              type="info"
              showIcon
              className="mb-4"
              message="Loại “Số liệu thống kê” cần nội dung ở dạng JSON"
              description={`Ví dụ: [ { "type": "stats", "title": "100%", "content": "Sản phẩm chính hãng" } ]`}
            />
          )}

          <Form.Item label="Nội dung (Tiếng Việt)" name="content_vi">
            <TextArea rows={isStats ? 5 : 3} className={isStats ? "font-mono" : ""} />
          </Form.Item>

          <Form.Item label="Nội dung (English)" name="content_en">
            <TextArea rows={isStats ? 5 : 3} className={isStats ? "font-mono" : ""} />
          </Form.Item>

          <div className="mb-6">
            <ImageUploader label="Hình ảnh" value={imageUrl} onChange={setImageUrl} />
          </div>

          <Form.Item label="Hiển thị trên website" name="is_active" valuePropName="checked">
            <Switch checkedChildren="Hiện" unCheckedChildren="Ẩn" />
          </Form.Item>

          <div className="flex justify-end gap-2 border-0 border-t border-solid border-slate-200 pt-4 dark:border-slate-700">
            <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={saving}>
              {editingSection ? "Lưu thay đổi" : "Thêm phần nội dung"}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}

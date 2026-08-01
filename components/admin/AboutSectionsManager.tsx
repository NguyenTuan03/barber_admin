"use client";

import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Switch, Select, Tag, Popconfirm, Space, Card, App as AntdApp } from "antd";
import { ProfileOutlined, PlusOutlined, EditOutlined, DeleteOutlined, CodeOutlined } from "@ant-design/icons";
import { BackendAboutSection } from "@/types/backendResource";
import {
  getAdminAboutSections,
  createAdminAboutSection,
  updateAdminAboutSection,
  deleteAdminAboutSection,
} from "@/services/adminApi";
import { ImageUploader } from "@/components/admin/ImageUploader";
import Image from "next/image";

const { TextArea } = Input;

const SECTION_TYPE_META: Record<BackendAboutSection["section_type"], { label: string; color: string }> = {
  hero: { label: "Hero (Đầu trang)", color: "gold" },
  story: { label: "Câu chuyện", color: "blue" },
  stats: { label: "Số liệu Thống kê", color: "purple" },
  value: { label: "Giá trị Cốt lõi", color: "green" },
  team_intro: { label: "Giới thiệu Đội ngũ", color: "volcano" },
};

export function AboutSectionsManager() {
  const { message } = AntdApp.useApp();
  const [sections, setSections] = useState<BackendAboutSection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSection, setEditingSection] = useState<BackendAboutSection | null>(null);
  const [sectionType, setSectionType] = useState<BackendAboutSection["section_type"]>("story");

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
    if (section) {
      setEditingSection(section);
      setSectionType(section.section_type);
      form.setFieldsValue({
        section_type: section.section_type,
        position: section.position ?? 0,
        is_active: section.is_active ?? true,
        title_vi: section.title_vi || "",
        title_en: section.title_en || "",
        subtitle_vi: section.subtitle_vi || "",
        subtitle_en: section.subtitle_en || "",
        content_vi: section.content_vi || "",
        content_en: section.content_en || "",
      });
      setImageUrl(section.image_url || "");
    } else {
      setEditingSection(null);
      setSectionType("story");
      form.resetFields();
      form.setFieldsValue({
        section_type: "story",
        position: sections.length,
        is_active: true,
      });
      setImageUrl("");
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: Partial<BackendAboutSection>) => {
    try {
      const payload: Partial<BackendAboutSection> = {
        ...values,
        position: Number(values.position),
        image_url: imageUrl,
      };

      if (editingSection?.id) {
        await updateAdminAboutSection(editingSection.id, payload);
        message.success("Cập nhật phần giới thiệu thành công!");
      } else {
        await createAdminAboutSection(payload);
        message.success("Thêm phần giới thiệu mới thành công!");
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
      await deleteAdminAboutSection(id);
      message.success("Đã xóa phần giới thiệu!");
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Xóa thất bại";
      message.error(msg);
    }
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image_url",
      key: "image_url",
      width: 90,
      render: (url: string, record: BackendAboutSection) =>
        url ? (
          <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-solid border-zinc-200 dark:border-zinc-800 bg-zinc-900 group">
            <Image src={url} alt={record.title_vi} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
            No Pic
          </div>
        ),
    },
    {
      title: "Loại Section",
      dataIndex: "section_type",
      key: "section_type",
      width: 150,
      render: (type: BackendAboutSection["section_type"]) => (
        <Tag color={SECTION_TYPE_META[type]?.color || "default"} className="font-bold text-[10px]">
          {SECTION_TYPE_META[type]?.label || type}
        </Tag>
      ),
    },
    {
      title: "Tiêu đề (VI / EN)",
      key: "title",
      render: (_: unknown, record: BackendAboutSection) => (
        <div className="flex flex-col">
          <span className="font-extrabold text-xs text-zinc-900 dark:text-zinc-100">{record.title_vi}</span>
          <span className="text-[11px] text-amber-600 dark:text-amber-500 font-medium">{record.title_en}</span>
        </div>
      ),
    },
    {
      title: "Thứ tự",
      dataIndex: "position",
      key: "position",
      width: 80,
      render: (pos: number) => <span className="font-mono text-xs text-zinc-500">#{pos}</span>,
    },
    {
      title: "Hiển thị",
      dataIndex: "is_active",
      key: "is_active",
      width: 100,
      render: (active: boolean) =>
        active ? (
          <Tag color="success" className="font-bold text-[10px]">
            Đang hiện
          </Tag>
        ) : (
          <Tag color="default" className="font-bold text-[10px]">
            Đã ẩn
          </Tag>
        ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "right" as const,
      render: (_: unknown, record: BackendAboutSection) => (
        <Space size="small">
          <Button icon={<EditOutlined />} type="text" onClick={() => openModal(record)} className="text-amber-500" />
          <Popconfirm
            title="Xóa phần giới thiệu"
            description="Bạn có chắc chắn muốn xóa section này?"
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
            <Tag color="warning" icon={<ProfileOutlined />} className="font-extrabold uppercase tracking-widest text-[10px] mb-1 rounded-full px-3 py-0.5 border-amber-500/30">
              About Sections API
            </Tag>
            <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight m-0">
              Quản lý Câu Chuyện & Số Liệu
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 m-0">
              Hiển thị ở đầu trang Giới thiệu. Kết nối API `/api/v1/admin/about_sections`.
            </p>
          </div>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
            className="font-extrabold text-xs rounded-xl px-5 bg-gradient-to-r from-amber-500 to-amber-600 border-none shadow-md shadow-amber-500/20"
          >
            Thêm Section mới
          </Button>
        </div>
      </Card>

      <Card className="shadow-xs rounded-2xl border-solid border-zinc-200 dark:border-zinc-800 p-0 overflow-hidden">
        <Table
          columns={columns}
          dataSource={sections.map((s) => ({ ...s, key: s.id }))}
          loading={loading}
          pagination={{ pageSize: 8 }}
          className="text-xs"
        />
      </Card>

      <Modal
        title={editingSection ? "Chỉnh sửa Section" : "Thêm Section Mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="text-xs pt-2">
          <div className="grid grid-cols-2 gap-3">
            <Form.Item label="Loại Section" name="section_type" rules={[{ required: true }]}>
              <Select
                onChange={(val) => setSectionType(val)}
                options={Object.entries(SECTION_TYPE_META).map(([value, meta]) => ({
                  value,
                  label: meta.label,
                }))}
              />
            </Form.Item>
            <Form.Item label="Thứ tự hiển thị" name="position" rules={[{ required: true, message: "Vui lòng nhập thứ tự!" }]}>
              <InputNumber className="w-full" min={0} />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Form.Item label="Tiêu đề (VI)" name="title_vi" rules={[{ required: true, message: "Vui lòng nhập tiêu đề VI!" }]}>
              <Input placeholder="Câu chuyện & Sứ mệnh" />
            </Form.Item>
            <Form.Item label="Tiêu đề (EN)" name="title_en" rules={[{ required: true, message: "Vui lòng nhập tiêu đề EN!" }]}>
              <Input placeholder="Our Story & Mission" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Form.Item label="Phụ đề (VI)" name="subtitle_vi">
              <Input placeholder="Hơn 10 năm xây dựng thương hiệu" />
            </Form.Item>
            <Form.Item label="Phụ đề (EN)" name="subtitle_en">
              <Input placeholder="Over 10 years of brand building" />
            </Form.Item>
          </div>

          {sectionType === "stats" && (
            <div className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-500 font-mono font-bold mb-1.5">
              <CodeOutlined /> Loại &quot;Số liệu Thống kê&quot; cần nội dung là chuỗi JSON hợp lệ
            </div>
          )}

          <Form.Item
            label="Nội dung (VI)"
            name="content_vi"
            extra={sectionType === "stats" ? `[ { "type": "stats", "title": "100%", "content": "Sản phẩm chính hãng" } ]` : undefined}
          >
            <TextArea rows={sectionType === "stats" ? 5 : 3} className={sectionType === "stats" ? "font-mono" : ""} />
          </Form.Item>

          <Form.Item label="Nội dung (EN)" name="content_en">
            <TextArea rows={sectionType === "stats" ? 5 : 3} className={sectionType === "stats" ? "font-mono" : ""} />
          </Form.Item>

          <div className="mb-4">
            <ImageUploader label="Hình ảnh Section" value={imageUrl} onChange={setImageUrl} />
          </div>

          <Form.Item label="Hiển thị trên Website" name="is_active" valuePropName="checked">
            <Switch checkedChildren="Hiện" unCheckedChildren="Ẩn" />
          </Form.Item>

          <div className="flex justify-end gap-2 pt-3 border-t border-solid border-zinc-200 dark:border-zinc-800">
            <Button onClick={() => setIsModalOpen(false)}>Hủy bỏ</Button>
            <Button type="primary" htmlType="submit" className="bg-amber-500 font-extrabold border-none">
              Lưu Section
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

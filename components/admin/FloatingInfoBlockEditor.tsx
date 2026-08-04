"use client";

import React from "react";
import { Input, Button } from "antd";
import { PlusOutlined, DeleteOutlined, EnvironmentOutlined, PhoneOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { InfoBlockTypeEnum } from "@/enum/AppEnum";

export interface FloatingInfoBlockItem {
  type: string;
  title: string;
  content: string[];
}

interface FloatingInfoBlockEditorProps {
  value: string;
  onChange: (jsonValue: string) => void;
}

const BLOCK_META: { type: InfoBlockTypeEnum; label: string; icon: React.ReactNode; placeholder: string }[] = [
  {
    type: InfoBlockTypeEnum.ADDRESS,
    label: "Địa chỉ",
    icon: <EnvironmentOutlined />,
    placeholder: "VD: 33/1 Quốc Hương, P. An Khánh, TP. HCM",
  },
  {
    type: InfoBlockTypeEnum.PHONE,
    label: "Điện thoại",
    icon: <PhoneOutlined />,
    placeholder: "VD: +84 765 300 800",
  },
  {
    type: InfoBlockTypeEnum.HOURS,
    label: "Giờ mở cửa",
    icon: <ClockCircleOutlined />,
    placeholder: "VD: T2 - T7: 9:00 - 20:00",
  },
];

const ALL_TYPES = BLOCK_META.map((meta) => meta.type);

function parseItems(value: string): FloatingInfoBlockItem[] {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // Not valid JSON yet (e.g. empty string on first load) — fall back to blank blocks below.
  }
  return [];
}

// Presents the 3 fixed floating-info blocks (address / phone / hours) as plain
// title + repeatable-line inputs instead of raw JSON, so a non-technical admin
// can edit them without knowing the underlying data shape. The frontend
// (FloatingInfoBlock.tsx) always looks up blocks by `type`, so the set of
// blocks and their types are fixed — only title and content lines are editable.
export function FloatingInfoBlockEditor({ value, onChange }: FloatingInfoBlockEditorProps) {
  const items = parseItems(value);

  const getBlock = (type: InfoBlockTypeEnum): FloatingInfoBlockItem =>
    items.find((item) => item.type === type) || { type, title: "", content: [] };

  const updateBlock = (type: InfoBlockTypeEnum, updated: FloatingInfoBlockItem) => {
    const nextItems = ALL_TYPES.map((t) => (t === type ? updated : getBlock(t)));
    onChange(JSON.stringify(nextItems));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {BLOCK_META.map((meta) => {
        const block = getBlock(meta.type);
        return (
          <div
            key={meta.type}
            className="space-y-3 rounded-md border border-solid border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/40"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
              <span className="text-slate-500 dark:text-slate-400">{meta.icon}</span>
              <span>{meta.label}</span>
            </div>

            <div>
              <label
                htmlFor={`${meta.type}-title`}
                className="mb-1 block text-[13px] text-slate-600 dark:text-slate-400"
              >
                Tiêu đề hiển thị
              </label>
              <Input
                id={`${meta.type}-title`}
                value={block.title}
                onChange={(e) => updateBlock(meta.type, { ...block, title: e.target.value })}
                placeholder={`VD: ${meta.label}`}
              />
            </div>

            <div className="space-y-2">
              <div className="text-[13px] text-slate-600 dark:text-slate-400">
                Nội dung (mỗi dòng một mục)
              </div>

              {block.content.length === 0 && (
                <div className="text-[13px] text-slate-500 dark:text-slate-400">
                  Chưa có dòng nào — bấm &quot;Thêm dòng&quot; bên dưới.
                </div>
              )}

              {block.content.map((line, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <Input
                    value={line}
                    onChange={(e) => {
                      const nextContent = [...block.content];
                      nextContent[idx] = e.target.value;
                      updateBlock(meta.type, { ...block, content: nextContent });
                    }}
                    placeholder={meta.placeholder}
                    aria-label={`${meta.label} - dòng ${idx + 1}`}
                  />
                  <Button
                    danger
                    type="text"
                    icon={<DeleteOutlined />}
                    aria-label={`Xóa dòng ${idx + 1} của ${meta.label}`}
                    onClick={() => {
                      const nextContent = block.content.filter((_, i) => i !== idx);
                      updateBlock(meta.type, { ...block, content: nextContent });
                    }}
                  />
                </div>
              ))}

              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => updateBlock(meta.type, { ...block, content: [...block.content, ""] })}
                className="w-full"
              >
                Thêm dòng
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

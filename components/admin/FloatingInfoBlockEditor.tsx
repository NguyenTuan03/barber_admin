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
            className="rounded-xl border border-solid border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3"
          >
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 text-xs font-extrabold uppercase tracking-wide">
              {meta.icon}
              <span>{meta.label}</span>
            </div>

            <div>
              <div className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
                Tiêu đề hiển thị
              </div>
              <Input
                size="small"
                value={block.title}
                onChange={(e) => updateBlock(meta.type, { ...block, title: e.target.value })}
                placeholder={`VD: ${meta.label.toUpperCase()}`}
                className="text-xs rounded-lg"
              />
            </div>

            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                Nội dung (mỗi dòng một mục)
              </div>

              {block.content.length === 0 && (
                <div className="text-[11px] text-zinc-400 italic">
                  Chưa có dòng nào, bấm &quot;Thêm dòng&quot; bên dưới.
                </div>
              )}

              {block.content.map((line, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <Input
                    size="small"
                    value={line}
                    onChange={(e) => {
                      const nextContent = [...block.content];
                      nextContent[idx] = e.target.value;
                      updateBlock(meta.type, { ...block, content: nextContent });
                    }}
                    placeholder={meta.placeholder}
                    className="text-xs rounded-lg"
                  />
                  <Button
                    size="small"
                    danger
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      const nextContent = block.content.filter((_, i) => i !== idx);
                      updateBlock(meta.type, { ...block, content: nextContent });
                    }}
                  />
                </div>
              ))}

              <Button
                size="small"
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => updateBlock(meta.type, { ...block, content: [...block.content, ""] })}
                className="w-full text-xs"
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

"use client";

import React from "react";
import { Input } from "antd";
import { SafetyCertificateOutlined, ScissorOutlined, SafetyOutlined } from "@ant-design/icons";

const { TextArea } = Input;

export interface ReviewFeatItem {
  type: string;
  title: string;
  description: string;
}

interface ReviewFeatsEditorProps {
  value: string;
  onChange: (jsonValue: string) => void;
}

// Fixed 3 slots, in display order — the public site (ReviewsSection.tsx) picks the
// icon by array position, not by the `type` field, so the set and order of blocks
// here must stay fixed. Only title/description are meant to be edited by the admin.
const BLOCK_META = [
  {
    type: "licence",
    label: "Giấy phép Kinh doanh",
    icon: <SafetyCertificateOutlined />,
    titlePlaceholder: "VD: Giấy phép Kinh doanh",
    descPlaceholder: "VD: Đảm bảo mọi hoạt động đều tuân thủ quy định của pháp luật.",
  },
  {
    type: "master_barber",
    label: "Thợ cắt tóc chính",
    icon: <ScissorOutlined />,
    titlePlaceholder: "VD: Thợ cắt tóc chính",
    descPlaceholder: "VD: Được đào tạo chuyên nghiệp và có nhiều năm kinh nghiệm trong ngành.",
  },
  {
    type: "guarantee",
    label: "Bảo hành dịch vụ",
    icon: <SafetyOutlined />,
    titlePlaceholder: "VD: Bảo hành dịch vụ",
    descPlaceholder: "VD: Tự tin cam kết chất lượng, nếu khách hàng không hài lòng, chúng tôi sẽ hoàn tiền.",
  },
];

function parseItems(value: string): ReviewFeatItem[] {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // Not valid JSON yet (e.g. empty string on first load) — fall back to blank blocks below.
  }
  return [];
}

export function ReviewFeatsEditor({ value, onChange }: ReviewFeatsEditorProps) {
  const items = parseItems(value);

  const getItem = (index: number, type: string): ReviewFeatItem =>
    items[index] || { type, title: "", description: "" };

  const updateItem = (index: number, type: string, patch: Partial<ReviewFeatItem>) => {
    const nextItems = BLOCK_META.map((meta, i) => ({ ...getItem(i, meta.type), ...(i === index ? patch : {}) }));
    onChange(JSON.stringify(nextItems));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {BLOCK_META.map((meta, idx) => {
        const item = getItem(idx, meta.type);
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
                Tiêu đề
              </div>
              <Input
                size="small"
                value={item.title}
                onChange={(e) => updateItem(idx, meta.type, { title: e.target.value })}
                placeholder={meta.titlePlaceholder}
                className="text-xs rounded-lg"
              />
            </div>

            <div>
              <div className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
                Mô tả ngắn
              </div>
              <TextArea
                rows={3}
                value={item.description}
                onChange={(e) => updateItem(idx, meta.type, { description: e.target.value })}
                placeholder={meta.descPlaceholder}
                className="text-xs rounded-lg"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

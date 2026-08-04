"use client";

import React from "react";
import { Input, Button } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

export interface AboutServiceStatItem {
  type: string;
  title: string;
  content: string;
}

interface AboutServiceStatsEditorProps {
  value: string;
  onChange: (jsonValue: string) => void;
}

function parseItems(value: string): AboutServiceStatItem[] {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // Not valid JSON yet (e.g. empty string on first load) — start from an empty list.
  }
  return [];
}

// Presents the stats list (e.g. "300.000+ / SẢN PHẨM CHÍNH HÃNG") as a plain
// repeatable list of "Số liệu" + "Mô tả" pairs instead of raw JSON. The `type`
// field in the underlying data isn't shown anywhere on the public site, so it's
// generated automatically and hidden from the admin — one less thing to fill in.
export function AboutServiceStatsEditor({ value, onChange }: AboutServiceStatsEditorProps) {
  const items = parseItems(value);

  const emit = (nextItems: AboutServiceStatItem[]) => onChange(JSON.stringify(nextItems));

  const updateItem = (idx: number, patch: Partial<AboutServiceStatItem>) => {
    const nextItems = items.map((item, i) => (i === idx ? { ...item, ...patch } : item));
    emit(nextItems);
  };

  const removeItem = (idx: number) => {
    emit(items.filter((_, i) => i !== idx));
  };

  const addItem = () => {
    emit([...items, { type: `stat-${items.length + 1}`, title: "", content: "" }]);
  };

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <div className="text-[13px] text-slate-500 dark:text-slate-400">
          Chưa có số liệu nào — bấm &quot;Thêm số liệu&quot; bên dưới.
        </div>
      )}

      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex items-end gap-3 rounded-md border border-solid border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/40"
        >
          <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <div>
              <label
                htmlFor={`stat-${idx}-title`}
                className="mb-1 block text-[13px] text-slate-600 dark:text-slate-400"
              >
                Con số
              </label>
              <Input
                id={`stat-${idx}-title`}
                value={item.title}
                onChange={(e) => updateItem(idx, { title: e.target.value })}
                placeholder="VD: 300.000+"
              />
            </div>
            <div>
              <label
                htmlFor={`stat-${idx}-content`}
                className="mb-1 block text-[13px] text-slate-600 dark:text-slate-400"
              >
                Mô tả ngắn
              </label>
              <Input
                id={`stat-${idx}-content`}
                value={item.content}
                onChange={(e) => updateItem(idx, { content: e.target.value })}
                placeholder="VD: Sản phẩm chính hãng"
              />
            </div>
          </div>

          <Button
            danger
            type="text"
            icon={<DeleteOutlined />}
            aria-label={`Xóa số liệu ${idx + 1}`}
            onClick={() => removeItem(idx)}
          />
        </div>
      ))}

      <Button type="dashed" icon={<PlusOutlined />} onClick={addItem} className="w-full">
        Thêm số liệu
      </Button>
    </div>
  );
}

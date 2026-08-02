"use client";

import React from "react";
import { Input, Button } from "antd";
import { PlusOutlined, DeleteOutlined, TrophyOutlined } from "@ant-design/icons";

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
        <div className="text-[11px] text-zinc-400 italic">
          Chưa có số liệu nào, bấm &quot;Thêm số liệu&quot; bên dưới.
        </div>
      )}

      {items.map((item, idx) => (
        <div
          key={idx}
          className="rounded-xl border border-solid border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 flex flex-col sm:flex-row gap-3"
        >
          <div className="flex-1 space-y-2">
            <div>
              <div className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
                Con số (VD: 300.000+)
              </div>
              <Input
                size="small"
                value={item.title}
                onChange={(e) => updateItem(idx, { title: e.target.value })}
                placeholder="VD: 300.000+"
                className="text-xs rounded-lg font-bold"
              />
            </div>
            <div>
              <div className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
                Mô tả ngắn (VD: Sản phẩm chính hãng)
              </div>
              <Input
                size="small"
                value={item.content}
                onChange={(e) => updateItem(idx, { content: e.target.value })}
                placeholder="VD: Sản phẩm chính hãng"
                className="text-xs rounded-lg"
              />
            </div>
          </div>

          <div className="flex sm:flex-col items-center justify-end gap-1">
            <Button size="small" danger type="text" icon={<DeleteOutlined />} onClick={() => removeItem(idx)} />
          </div>
        </div>
      ))}

      <Button size="small" type="dashed" icon={<PlusOutlined />} onClick={addItem} className="w-full text-xs">
        <span className="inline-flex items-center gap-1">
          <TrophyOutlined /> Thêm số liệu
        </span>
      </Button>
    </div>
  );
}

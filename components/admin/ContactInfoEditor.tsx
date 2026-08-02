"use client";

import React from "react";
import { Input, Button } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

export interface ContactInfoItem {
  type: string;
  title: string;
}

interface ContactInfoEditorProps {
  value: string;
  onChange: (jsonValue: string) => void;
}

function parseItems(value: string): ContactInfoItem[] {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // Not valid JSON yet (e.g. empty string on first load) — start from an empty list.
  }
  return [];
}

// Presents the contact info list (email, hotline, etc.) as a plain repeatable
// list of text lines instead of raw JSON. The `type` field isn't shown anywhere
// on the public site, so it's generated automatically and hidden from the admin.
export function ContactInfoEditor({ value, onChange }: ContactInfoEditorProps) {
  const items = parseItems(value);

  const emit = (nextItems: ContactInfoItem[]) => onChange(JSON.stringify(nextItems));

  const updateItem = (idx: number, title: string) => {
    emit(items.map((item, i) => (i === idx ? { ...item, title } : item)));
  };

  const removeItem = (idx: number) => {
    emit(items.filter((_, i) => i !== idx));
  };

  const addItem = () => {
    emit([...items, { type: "contact", title: "" }]);
  };

  return (
    <div className="space-y-2">
      {items.length === 0 && (
        <div className="text-[11px] text-zinc-400 italic">
          Chưa có thông tin liên hệ nào, bấm &quot;Thêm dòng&quot; bên dưới.
        </div>
      )}

      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-1.5">
          <Input
            size="small"
            value={item.title}
            onChange={(e) => updateItem(idx, e.target.value)}
            placeholder="VD: hello@gmail.com hoặc 0909.999.999"
            className="text-xs rounded-lg"
          />
          <Button size="small" danger type="text" icon={<DeleteOutlined />} onClick={() => removeItem(idx)} />
        </div>
      ))}

      <Button size="small" type="dashed" icon={<PlusOutlined />} onClick={addItem} className="w-full text-xs">
        Thêm dòng
      </Button>
    </div>
  );
}

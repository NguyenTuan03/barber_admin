"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Tag } from "antd";
import { PictureOutlined } from "@ant-design/icons";

/** Table thumbnail. Fixed size so rows keep a constant height while images load. */
export function Thumbnail({
  url,
  alt,
  width = 56,
  className = "",
}: {
  url?: string;
  alt: string;
  width?: number;
  className?: string;
}) {
  // Image URLs are entered by hand or point at external storage, so a broken
  // link is normal — fall back to the placeholder instead of spilling alt text.
  // Remembering *which* url failed resets the state when the row's url changes.
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const failed = Boolean(url) && failedUrl === url;

  if (!url || failed) {
    return (
      <div
        style={{ width, height: 56 }}
        className="flex items-center justify-center rounded-md border border-dashed border-slate-300 text-slate-400 dark:border-slate-600"
        title={url ? "Không tải được hình ảnh" : "Chưa có hình ảnh"}
        aria-label={url ? "Không tải được hình ảnh" : "Chưa có hình ảnh"}
      >
        <PictureOutlined />
      </div>
    );
  }

  return (
    <div
      style={{ width, height: 56 }}
      className="relative overflow-hidden rounded-md border border-solid border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
    >
      <Image
        src={url}
        alt={alt}
        fill
        sizes="80px"
        onError={() => setFailedUrl(url)}
        className={`object-cover ${className}`}
      />
    </div>
  );
}

/** Bilingual name cell: Vietnamese on top, English underneath as supporting text. */
export function BilingualCell({ vi, en }: { vi?: string; en?: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-medium text-slate-900 dark:text-slate-100">{vi || "—"}</span>
      {en && <span className="text-[13px] text-slate-500 dark:text-slate-400">{en}</span>}
    </div>
  );
}

/** Two-line description cell, truncated to keep row heights even. */
export function DescriptionCell({ vi, en }: { vi?: string; en?: string }) {
  if (!vi && !en) return <span className="text-slate-400">—</span>;
  return (
    <div className="flex flex-col text-slate-600 dark:text-slate-400">
      {vi && <span className="line-clamp-1">{vi}</span>}
      {en && <span className="line-clamp-1 text-[13px] text-slate-500">{en}</span>}
    </div>
  );
}

/** Published / hidden state for rows backed by an `is_active` flag. */
export function VisibilityTag({ active }: { active?: boolean }) {
  return active ? (
    <Tag color="success" variant="filled">
      Đang hiện
    </Tag>
  ) : (
    <Tag variant="filled">Đã ẩn</Tag>
  );
}

/** Money is right-aligned and tabular so columns of prices line up. */
export function PriceCell({ value }: { value?: number }) {
  if (value == null) return <span className="text-slate-400">—</span>;
  return (
    <span className="tabular-nums font-medium text-slate-900 dark:text-slate-100">
      {value.toLocaleString("vi-VN")} ₫
    </span>
  );
}

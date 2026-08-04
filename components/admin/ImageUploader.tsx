"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Upload, Input, Button, App as AntdApp } from "antd";
import { UploadOutlined, LinkOutlined, PictureOutlined } from "@ant-design/icons";
import { uploadAdminFile } from "@/services/adminApi";

interface ImageUploaderProps {
  /** Omit where the surrounding form already labels the field. */
  label?: string;
  value: string;
  onChange: (url: string) => void;
  uploadType?: string;
}

export function ImageUploader({
  label,
  value,
  onChange,
  uploadType = "site_setting",
}: ImageUploaderProps) {
  const { message } = AntdApp.useApp();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  // A pasted URL can point anywhere, so a load failure is an expected outcome.
  // Storing the failing url (rather than a flag) resets it as soon as it changes.
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const previewFailed = Boolean(value) && failedUrl === value;

  const handleCustomUpload = async (options: { file: unknown }) => {
    const fileObj = options.file as File;
    if (!fileObj) return;

    setIsUploading(true);
    try {
      const data = await uploadAdminFile(fileObj, uploadType);
      onChange(data.url);
      message.success("Đã tải ảnh lên.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Tải ảnh thất bại";
      message.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <span className="block text-sm font-medium text-slate-900 dark:text-slate-100">{label}</span>
      )}

      <div className="flex flex-col gap-3 rounded-md border border-solid border-slate-200 bg-slate-50 p-3 sm:flex-row dark:border-slate-700 dark:bg-slate-900/40">
        {/* Preview keeps a fixed footprint so the form doesn't jump while loading. */}
        {value && !previewFailed ? (
          <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-md border border-solid border-slate-200 bg-slate-100 sm:w-44 dark:border-slate-700 dark:bg-slate-800">
            <Image
              src={value}
              alt={label || "Xem trước hình ảnh"}
              fill
              sizes="176px"
              onError={() => setFailedUrl(value)}
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-28 w-full shrink-0 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-slate-300 px-2 text-center text-slate-400 sm:w-44 dark:border-slate-600">
            <PictureOutlined className="text-xl" />
            <span className="text-[13px]">
              {previewFailed ? "Không tải được ảnh" : "Chưa có ảnh"}
            </span>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
          <Input
            placeholder="Dán đường dẫn ảnh (URL)..."
            prefix={<LinkOutlined className="text-slate-400" />}
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
            aria-label={label ? `Đường dẫn ${label}` : "Đường dẫn hình ảnh"}
            allowClear
          />

          <Upload customRequest={handleCustomUpload} showUploadList={false} accept="image/*">
            <Button icon={<UploadOutlined />} loading={isUploading}>
              Tải ảnh từ máy
            </Button>
          </Upload>
        </div>
      </div>
    </div>
  );
}

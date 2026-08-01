"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Upload, Input, Button, App as AntdApp } from "antd";
import { UploadOutlined, LinkOutlined, PictureOutlined, LoadingOutlined } from "@ant-design/icons";
import { uploadAdminFile } from "@/services/adminApi";

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  uploadType?: string;
}

export function ImageUploader({
  label,
  value,
  onChange,
  uploadType = "site_settings",
}: ImageUploaderProps) {
  const { message } = AntdApp.useApp();
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleCustomUpload = async (options: { file: unknown }) => {
    const fileObj = options.file as File;
    if (!fileObj) return;

    setIsUploading(true);
    try {
      const data = await uploadAdminFile(fileObj, uploadType);
      onChange(data.url);
      message.success("Tải ảnh lên AWS S3 thành công!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Tải ảnh thất bại";
      message.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-300 uppercase tracking-wider">
          {label}
        </label>
        <span className="text-[10px] text-zinc-500 font-mono">AWS S3 Endpoint</span>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-xl border border-solid border-zinc-200 dark:border-zinc-800 space-y-3">
        {/* Preview Box */}
        {value ? (
          <div className="relative w-full h-44 rounded-lg overflow-hidden border border-solid border-zinc-200 dark:border-zinc-800 bg-zinc-900 group">
            <Image
              src={value}
              alt={label}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 text-center text-xs text-white">
              <span className="truncate max-w-full font-mono text-[10px] bg-black/80 px-2 py-1 rounded border border-white/10">
                {value}
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full h-24 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-800 flex flex-col items-center justify-center gap-1.5 text-zinc-400 text-xs">
            <PictureOutlined className="text-xl text-zinc-400" />
            <span>Chưa có hình ảnh. Hãy dán URL hoặc tải từ máy.</span>
          </div>
        )}

        {/* Input Controls */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Dán đường dẫn ảnh URL..."
            prefix={<LinkOutlined className="text-zinc-400" />}
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
            className="text-xs"
          />

          <Upload
            customRequest={handleCustomUpload}
            showUploadList={false}
            accept="image/*"
          >
            <Button
              icon={isUploading ? <LoadingOutlined /> : <UploadOutlined />}
              loading={isUploading}
              className="text-xs font-bold font-mono"
            >
              Tải ảnh từ máy
            </Button>
          </Upload>
        </div>
      </div>
    </div>
  );
}

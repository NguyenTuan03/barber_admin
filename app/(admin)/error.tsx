"use client";

import { useEffect } from "react";
import { Button, Result } from "antd";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Result
      status="error"
      title="Không thể tải Trang chủ"
      subTitle="Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại."
      extra={
        <Button type="primary" onClick={() => unstable_retry()}>
          Thử lại
        </Button>
      }
    />
  );
}

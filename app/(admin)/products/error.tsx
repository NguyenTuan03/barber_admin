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
      title="Không thể tải Sản phẩm"
      subTitle="Đã có lỗi xảy ra khi tải danh sách sản phẩm. Vui lòng thử lại."
      extra={
        <Button type="primary" onClick={() => unstable_retry()}>
          Thử lại
        </Button>
      }
    />
  );
}

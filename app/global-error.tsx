"use client";

import { useEffect } from "react";
import "./globals.css";

export default function GlobalError({
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
    <html lang="vi">
      <body className="min-h-full antialiased">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-sm space-y-4 text-center">
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-[11px] font-semibold text-white">
              T99
            </div>

            <div className="rounded-lg border border-solid border-slate-200 bg-white p-6">
              <h1 className="m-0 text-lg font-semibold text-slate-900">
                Ứng dụng gặp sự cố nghiêm trọng
              </h1>
              <p className="m-0 mt-1 mb-5 text-sm text-slate-600">
                Vui lòng tải lại trang. Nếu lỗi vẫn tiếp diễn, hãy liên hệ bộ phận kỹ thuật.
              </p>

              <button
                type="button"
                onClick={() => unstable_retry()}
                className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-blue-600 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Tải lại
              </button>

              {error.digest && (
                <p className="m-0 mt-3 text-xs text-slate-400">Mã lỗi: {error.digest}</p>
              )}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

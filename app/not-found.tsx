import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-4 text-center">
        <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-[11px] font-semibold text-white dark:bg-slate-700">
          T99
        </div>

        <div className="rounded-lg border border-solid border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h1 className="m-0 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Không tìm thấy trang
          </h1>
          <p className="m-0 mt-1 mb-5 text-sm text-slate-600 dark:text-slate-400">
            Trang bạn truy cập không tồn tại hoặc đã bị di chuyển.
          </p>

          <Link
            href="/"
            className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-blue-600 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Về trang quản trị
          </Link>
        </div>
      </div>
    </div>
  );
}

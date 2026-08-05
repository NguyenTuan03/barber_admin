export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-500" />
      <span className="text-sm text-slate-500 dark:text-slate-400">Đang tải...</span>
    </div>
  );
}

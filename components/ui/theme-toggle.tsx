"use client";

import React, { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { ThemeEnum } from "@/enum/AppEnum";

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isMounted) {
    return (
      <div className="w-9 h-9 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900" />
    );
  }

  const isDark = theme === ThemeEnum.DARK;

  return (
    <button
      onClick={() => setTheme(isDark ? ThemeEnum.LIGHT : ThemeEnum.DARK)}
      title={isDark ? "Chuyển sang Chế độ Sáng (Light Mode)" : "Chuyển sang Chế độ Tối (Dark Mode)"}
      className="relative p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-all duration-300 active:scale-95 flex items-center justify-center shrink-0"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform duration-500 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-zinc-700 dark:text-zinc-300 transition-transform duration-500 rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
}

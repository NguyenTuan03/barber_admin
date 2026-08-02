"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ConfigProvider, theme as antdTheme, App as AntdApp } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ThemeEnum } from "@/enum/AppEnum";

interface AntdThemeContextType {
  themeMode: ThemeEnum;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeEnum) => void;
}

const AntdThemeContext = createContext<AntdThemeContextType>({
  themeMode: ThemeEnum.DARK,
  isDark: true,
  toggleTheme: () => {},
  setThemeMode: () => {},
});

export const useAntdTheme = () => useContext(AntdThemeContext);

export function AntdThemeProvider({ children }: { children: React.ReactNode }) {
  // IMPORTANT: must match on server and first client render (localStorage isn't
  // available during SSR), so we always start at DARK and sync the saved
  // preference from localStorage inside a useEffect after mount.
  const [themeMode, setThemeModeState] = useState<ThemeEnum>(ThemeEnum.DARK);

  // Intentional one-time sync from localStorage (a browser-only external system)
  // right after mount, to avoid the SSR/client hydration mismatch that reading it
  // during render would cause.
  useEffect(() => {
    const saved = localStorage.getItem("barber_admin_theme") as ThemeEnum;
    if (saved === ThemeEnum.LIGHT || saved === ThemeEnum.DARK) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThemeModeState(saved);
    }
  }, []);

  const setThemeMode = (mode: ThemeEnum) => {
    setThemeModeState(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("barber_admin_theme", mode);
    }
  };

  const toggleTheme = () => {
    const next = themeMode === ThemeEnum.DARK ? ThemeEnum.LIGHT : ThemeEnum.DARK;
    setThemeMode(next);
  };

  const isDark = themeMode === ThemeEnum.DARK;

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <AntdThemeContext.Provider value={{ themeMode, isDark, toggleTheme, setThemeMode }}>
      <AntdRegistry>
        <ConfigProvider
          theme={{
            algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
            token: {
              colorPrimary: "#d97706",
              borderRadius: 8,
              fontFamily: "var(--font-geist-sans), sans-serif",
            },
          }}
        >
          <AntdApp>{children}</AntdApp>
        </ConfigProvider>
      </AntdRegistry>
    </AntdThemeContext.Provider>
  );
}

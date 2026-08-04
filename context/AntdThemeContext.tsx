"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ConfigProvider, theme as antdTheme, App as AntdApp } from "antd";
import type { ThemeConfig } from "antd";
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

/*
 * Neutral slate surfaces + a single blue accent. Mirrors the CSS variables in
 * app/globals.css — change both together. Amber (the storefront brand colour)
 * is intentionally not the UI accent here.
 */
const LIGHT_TOKENS: ThemeConfig["token"] = {
  colorPrimary: "#2563eb",
  colorInfo: "#2563eb",
  colorBgLayout: "#f1f5f9",
  colorBgContainer: "#ffffff",
  colorBgElevated: "#ffffff",
  colorBorder: "#e2e8f0",
  colorBorderSecondary: "#e2e8f0",
  colorText: "#0f172a",
  colorTextSecondary: "#334155",
  colorTextTertiary: "#475569",
  colorTextDescription: "#475569",
};

const DARK_TOKENS: ThemeConfig["token"] = {
  colorPrimary: "#3b82f6",
  colorInfo: "#3b82f6",
  colorBgLayout: "#0f172a",
  colorBgContainer: "#1e293b",
  colorBgElevated: "#1e293b",
  colorBorder: "#334155",
  colorBorderSecondary: "#334155",
  colorText: "#e2e8f0",
  colorTextSecondary: "#cbd5e1",
  colorTextTertiary: "#94a3b8",
  colorTextDescription: "#94a3b8",
};

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
              ...(isDark ? DARK_TOKENS : LIGHT_TOKENS),
              borderRadius: 6,
              fontSize: 14,
              fontFamily: "var(--font-geist-sans), sans-serif",
              wireframe: false,
            },
            components: {
              Layout: {
                headerBg: isDark ? "#1e293b" : "#ffffff",
                headerHeight: 56,
                headerPadding: "0 16px",
                // Sider is always rendered with theme="light" so that the Menu
                // picks up the tokens below in both modes; the dark surface
                // comes from lightSiderBg, not from antd's "dark" sider theme.
                siderBg: isDark ? "#1e293b" : "#ffffff",
                lightSiderBg: isDark ? "#1e293b" : "#ffffff",
                bodyBg: isDark ? "#0f172a" : "#f1f5f9",
              },
              Menu: {
                itemBg: "transparent",
                itemHeight: 38,
                itemMarginInline: 8,
                itemBorderRadius: 6,
                itemSelectedBg: isDark ? "#1d4ed8" : "#eff6ff",
                itemSelectedColor: isDark ? "#ffffff" : "#1d4ed8",
                itemHoverBg: isDark ? "#334155" : "#f1f5f9",
              },
              Table: {
                headerBg: isDark ? "#172033" : "#f8fafc",
                headerColor: isDark ? "#94a3b8" : "#475569",
                headerSplitColor: "transparent",
                rowHoverBg: isDark ? "#243449" : "#f8fafc",
                cellPaddingBlock: 12,
              },
              Card: {
                headerHeight: 48,
                headerFontSize: 14,
              },
              Button: {
                primaryShadow: "none",
                defaultShadow: "none",
                dangerShadow: "none",
                fontWeight: 500,
              },
              Tabs: {
                horizontalItemPadding: "10px 0",
              },
            },
          }}
        >
          <AntdApp>{children}</AntdApp>
        </ConfigProvider>
      </AntdRegistry>
    </AntdThemeContext.Provider>
  );
}

"use client";

import { ConfigProvider, theme } from "antd";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";

interface AntdThemeProviderProps {
  children: ReactNode;
}

export function AntdThemeProvider({ children }: AntdThemeProviderProps) {
  const { theme: currentTheme } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: currentTheme === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#1890ff",
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

"use client";

import { BulbFilled, BulbOutlined } from "@ant-design/icons";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const handleToggle = () => {
    setIsSwitching(true);
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    // Reset animation after completion
    setTimeout(() => setIsSwitching(false), 600);
  };

  return (
    <button
      onClick={handleToggle}
      className={`theme-toggle ${isSwitching ? 'switching' : ''}`}
      aria-label={theme === "light" ? "Chuyển sang chế độ tối" : "Chuyển sang chế độ sáng"}
      title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
    >
      {theme === "light" ? (
        <BulbOutlined style={{ fontSize: '20px' }} />
      ) : (
        <BulbFilled style={{ fontSize: '20px' }} />
      )}
    </button>
  );
}

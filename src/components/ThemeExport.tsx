'use client';

import styles from '@/styles/ThemeExport.module.css';
import { CopyOutlined, DownloadOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { useTheme } from 'next-themes';

interface ThemeExportProps {
  onExportHistory: (format: 'json' | 'copy') => void;
}

export default function ThemeExport({ onExportHistory }: ThemeExportProps) {
  const { theme, setTheme } = useTheme();
  const [msgApi, contextHolder] = message.useMessage();

  return (
    <div className={styles.themeSection}>
      {contextHolder}
      <div className={styles.sectionHeader}>
        <MoonOutlined />
        🌙 QUICK THEME
      </div>
      <div className={styles.sectionContent}>
        <div className={styles.themeButtons}>
          <button
            className={`${styles.themeBtn} ${theme === 'light' ? styles.active : ''}`}
            onClick={() => {
              setTheme('light');
            }}
          >
            <SunOutlined /> Light
          </button>
          <button
            className={`${styles.themeBtn} ${theme === 'dark' ? styles.active : ''}`}
            onClick={() => {
              setTheme('dark');
            }}
          >
            <MoonOutlined /> Dark
          </button>
        </div>
        <div style={{ marginTop: '1rem', marginBottom: '0.5rem', fontWeight: 600 }}>
          💾 Export History
        </div>
        <div className={styles.exportButtons}>
          <button
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={() => {
              onExportHistory('copy');
              msgApi.success('Copied to clipboard');
            }}
          >
            <CopyOutlined /> Copy
          </button>
          <button
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={() => {
              onExportHistory('json');
              msgApi.success('Exported as JSON');
            }}
          >
            <DownloadOutlined /> JSON
          </button>
        </div>
      </div>
    </div>
  );
}

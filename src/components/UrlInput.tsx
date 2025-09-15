'use client';

import styles from '@/styles/UrlInput.module.css';
import { EditOutlined, LoadingOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Input, message } from 'antd';

interface UrlInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onAnalyze: (url: string) => void;
  loading: boolean;
  onCreate: () => void;
}

export default function UrlInput({ inputValue, setInputValue, onAnalyze, loading, onCreate }: UrlInputProps) {
  const [msgApi, contextHolder] = message.useMessage();
  // Validate and normalize URL before invoking analyze
  function isValidHttpUrl(u: string) {
    try {
      const parsed = new URL(u);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }

  function normalizeUrl(input: string): { valid: boolean; url?: string; message?: string } {
    const raw = (input || '').trim();
    if (!raw) return { valid: false, message: 'Empty URL. Please enter a URL.' };

    const hasScheme = /^https?:\/\//i.test(raw);
    const guessHttps = hasScheme ? raw : `https://${raw}`;

    const isLocalHost = /^(localhost(:\d+)?|127\.0\.0\.1(:\d+)?)(\/|$)/i.test(raw);
    const guessHttpForLocal = hasScheme ? raw : `http://${raw}`;

    const hostIsIp = (host: string) => /^(\d{1,3}\.){3}\d{1,3}$/.test(host);
    const isValidHost = (host: string) => hostIsIp(host) || host === 'localhost' || host.includes('.');

    if (isLocalHost) {
      if (isValidHttpUrl(guessHttpForLocal)) {
        try {
          const u = new URL(guessHttpForLocal);
          if (isValidHost(u.hostname)) return { valid: true, url: u.toString() };
        } catch {}
      }
      return { valid: false, message: 'Invalid localhost URL. Example: http://localhost:3000' };
    }

    if (isValidHttpUrl(guessHttps)) {
      try {
        const u = new URL(guessHttps);
        if (isValidHost(u.hostname)) return { valid: true, url: u.toString() };
      } catch {}
    }

    if (hasScheme && isValidHttpUrl(raw)) {
      try {
        const u = new URL(raw);
        if (isValidHost(u.hostname)) return { valid: true, url: u.toString() };
      } catch {}
    }
    return { valid: false, message: 'Invalid URL. Example: https://example.com' };
  }

  function handleAnalyze() {
    if (loading) {
      msgApi.warning('Please wait for the current request to finish.');
      return;
    }
    const normalized = normalizeUrl(inputValue);
    if (!normalized.valid || !normalized.url) {
      msgApi.error(normalized.message || 'Invalid URL');
      return;
    }
    onAnalyze(normalized.url);
  }
  return (
    <div className={styles.urlInputSection}>
      {contextHolder}
      <div className={styles.sectionHeader}>
        <EditOutlined />
        📝 URL INPUT
      </div>
      <div className={styles.sectionContent}>
        <div className={styles.inputGroup}>
          <Input
            type="text"
            className={styles.urlInput}
            placeholder="🔗 Enter URL..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAnalyze();
            }}
          />
        </div>
        <div className={styles.actionButtons}>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? <LoadingOutlined spin /> : <SearchOutlined />} {loading ? 'Loading...' : 'Preview'}
          </button>
          <button
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={() => {
              if (loading) {
                msgApi.warning('Please wait for the current request to finish.');
                return;
              }
              onCreate();
            }}
            disabled={loading}
          >
            <PlusOutlined /> Create
          </button>
          <button
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? <LoadingOutlined spin /> : <ReloadOutlined />}
          </button>
        </div>
      </div>
    </div>
  );
}

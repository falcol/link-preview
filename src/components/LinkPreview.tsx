'use client';

import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import HistoryList from './HistoryList';
import MetaTabs from './MetaTabs';
import PreviewVisual from './PreviewVisual';
import ThemeExport from './ThemeExport';
import UrlInput from './UrlInput';
import UserStats from './UserStats';

interface Metadata {
  title?: string;
  description?: string;
  image?: string;
  cached?: boolean;
  url?: string;
}

interface UserStats {
  totalAnalyzed: number;
  todayCount: number;
  weekCount: number;
  successCount: number;
  cacheHits: number;
  totalTime: number;
  lastWeekReset: string;
}

interface HistoryItem {
  url: string;
  timestamp: number;
  success: boolean;
  cached: boolean;
  responseTime: number;
  title?: string;
}

export default function LinkPreview() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [urlHistory, setUrlHistory] = useState<HistoryItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [userStats, setUserStats] = useState<UserStats>({
    totalAnalyzed: 0,
    todayCount: 0,
    weekCount: 0,
    successCount: 0,
    cacheHits: 0,
    totalTime: 0,
    lastWeekReset: new Date().toISOString().split('T')[0]
  });
  const [mounted, setMounted] = useState(false);
  const currentRequest = useRef<AbortController | null>(null);

  // Fix hydration by setting mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load data from localStorage on component mount
  useEffect(() => {
    if (!mounted) return;

    const savedHistory = localStorage.getItem('urlHistory');
    const savedStats = localStorage.getItem('userStats');

    if (savedHistory) {
      try {
        setUrlHistory(JSON.parse(savedHistory));
      } catch {
        console.error('Failed to parse history from localStorage');
      }
    }

    if (savedStats) {
      try {
        setUserStats(JSON.parse(savedStats));
      } catch {
        console.error('Failed to parse stats from localStorage');
      }
    }
  }, [mounted]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('urlHistory', JSON.stringify(urlHistory));
  }, [urlHistory, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('userStats', JSON.stringify(userStats));
  }, [userStats, mounted]);

  // Helpers: validate and normalize URL input
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

    if (!raw) {
      return { valid: false, message: 'URL is invalid. Please enter a valid URL.' };
    }

    // If no protocol, try to add https:// by default
    const hasScheme = /^https?:\/\//i.test(raw);
    const guessHttps = hasScheme ? raw : `https://${raw}`;

    // Localhost special-case prefers http
    const isLocalHost = /^(localhost(:\d+)?|127\.0\.0\.1(:\d+)?)(\/|$)/i.test(raw);
    const guessHttpForLocal = hasScheme ? raw : `http://${raw}`;

    // Helper: validate hostname (domain with a dot, IP, or localhost)
    const hostIsIp = (host: string) => /^(\d{1,3}\.){3}\d{1,3}$/.test(host);
    const isValidHost = (host: string) => hostIsIp(host) || host === 'localhost' || host.includes('.');

    if (isLocalHost) {
      if (isValidHttpUrl(guessHttpForLocal)) {
        try {
          const u = new URL(guessHttpForLocal);
          if (isValidHost(u.hostname)) return { valid: true, url: u.toString() };
        } catch {}
      }
      return { valid: false, message: 'URL localhost is invalid. Example: http://localhost:3000' };
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

    return { valid: false, message: 'URL is invalid. Example: https://example.com' };
  }

  async function fetchMetadata(urlInput: string) {
    if (!urlInput) return;

    const normalized = normalizeUrl(urlInput);
    if (!normalized.valid || !normalized.url) {
      setError(normalized.message || 'URL is invalid');
      return;
    }
    const url = normalized.url;

    const startTime = Date.now();
    // Cancel in-flight request to avoid race conditions and UI flicker
    if (currentRequest.current) {
      try { currentRequest.current.abort(); } catch {}
    }
    const controller = new AbortController();
    currentRequest.current = controller;

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get(`/api/fetch?url=${encodeURIComponent(url)}`, { signal: controller.signal });
      const responseTime = Date.now() - startTime;

      setMetadata({ ...data, url });

      // Update history - Remove duplicates and add new item to top
      const newHistoryItem: HistoryItem = {
        url,
        timestamp: Date.now(),
        success: true,
        cached: data.cached || false,
        responseTime,
        title: data.title
      };

      setUrlHistory(prev => {
        // Remove duplicate URLs first
        const filteredHistory = prev.filter(item => item.url !== url);
        // Add new item to the beginning and limit to 100 items
        return [newHistoryItem, ...filteredHistory].slice(0, 100);
      });

      // Update stats
      setUserStats(prev => ({
        ...prev,
        totalAnalyzed: prev.totalAnalyzed + 1,
        todayCount: prev.todayCount + 1,
        weekCount: prev.weekCount + 1,
        successCount: prev.successCount + 1,
        cacheHits: data.cached ? prev.cacheHits + 1 : prev.cacheHits,
        totalTime: prev.totalTime + responseTime
      }));

    } catch (err: unknown) {
      // Ignore aborted requests (Axios abort -> ERR_CANCELED / CanceledError)
      const e = err as { code?: string; name?: string; message?: string } | undefined;
      if (e && (e.code === 'ERR_CANCELED' || e.name === 'CanceledError' || e.message === 'canceled')) {
        return;
      }
      setError('Failed to fetch metadata');

      // Update history with failed item - Remove duplicates and add new item to top
      const newHistoryItem: HistoryItem = {
        url,
        timestamp: Date.now(),
        success: false,
        cached: false,
        responseTime: Date.now() - startTime,
        title: 'Failed to load'
      };

      setUrlHistory(prev => {
        // Remove duplicate URLs first
        const filteredHistory = prev.filter(item => item.url !== url);
        // Add new item to the beginning and limit to 100 items
        return [newHistoryItem, ...filteredHistory].slice(0, 100);
      });

      // Update stats
      setUserStats(prev => ({
        ...prev,
        totalAnalyzed: prev.totalAnalyzed + 1,
        todayCount: prev.todayCount + 1,
        weekCount: prev.weekCount + 1
      }));
    } finally {
      // Clear controller reference if it is the same
      if (currentRequest.current === controller) {
        currentRequest.current = null;
      }
      setLoading(false);
    }
  }

  function handleHistoryClick(url: string) {
    setInputValue(url);
    // Debounce quick repeated clicks
    const id = setTimeout(() => fetchMetadata(url), 120);
    return () => clearTimeout(id);
  }

  function clearHistory() {
    setUrlHistory([]);
    localStorage.removeItem('urlHistory');
  }

  function deleteHistoryItem(index: number) {
    setUrlHistory(prev => prev.filter((_, i) => i !== index));
  }

  function exportHistory(format: 'json' | 'copy') {
    if (format === 'json') {
      const dataStr = JSON.stringify(urlHistory, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = 'url-history.json';

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } else {
      const urlList = urlHistory.map(item => item.url).join('\n');
      navigator.clipboard.writeText(urlList);
    }
  }

  const avgTime = userStats.successCount > 0 ? (userStats.totalTime / userStats.successCount / 1000).toFixed(1) : '0.0';

  // Don't render theme-dependent content until mounted
  if (!mounted) {
    return (
      <>
        {/* Left Panel */}
        <div className="left-panel">
          <UrlInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            onAnalyze={fetchMetadata}
            loading={loading}
          />
          <HistoryList
            urlHistory={urlHistory}
            onHistoryClick={handleHistoryClick}
            onClearHistory={clearHistory}
            onDeleteItem={deleteHistoryItem}
          />
        </div>

        {/* Center Panel (loading) - FIXED: No Spin components to avoid hydration mismatch */}
        <div className="center-panel">
          <div className="loading-container">
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }} />
          </div>
        </div>

        {/* Right Sidebar (loading) - FIXED: No Spin components to avoid hydration mismatch */}
        <div className="right-sidebar">
          <div className="loading-container">
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid #f3f3f3',
              borderTop: '2px solid #3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Left Panel */}
      <div className="left-panel">
        <UrlInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          onAnalyze={fetchMetadata}
          loading={loading}
        />
        <HistoryList
          urlHistory={urlHistory}
          onHistoryClick={handleHistoryClick}
          onClearHistory={clearHistory}
          onDeleteItem={deleteHistoryItem}
        />
      </div>

      {/* Center Panel */}
      <div className="center-panel">
        <PreviewVisual
          loading={loading}
          metadata={metadata}
          avgTime={avgTime}
        />

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {metadata && <MetaTabs metadata={metadata} />}

        {/* Banner Ad */}
        {/* <div className="banner-ad">
          [Google Ad] 728x90 Banner
        </div> */}
      </div>

      {/* Right Sidebar - Stats and Theme */}
      <div className="right-sidebar">
        <UserStats userStats={userStats} />
        <ThemeExport onExportHistory={exportHistory} />
      </div>
    </>
  );
}

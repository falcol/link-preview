'use client';

import styles from '@/styles/HistoryList.module.css';
import { DeleteOutlined, HistoryOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import { useState } from 'react';

interface HistoryItem {
  url: string;
  timestamp: number;
  success: boolean;
  cached: boolean;
  responseTime: number;
  title?: string;
}

interface HistoryListProps {
  urlHistory: HistoryItem[];
  onHistoryClick: (url: string) => void;
  onClearHistory: () => void;
  onDeleteItem: (index: number) => void;
}

export default function HistoryList({ urlHistory, onHistoryClick, onClearHistory, onDeleteItem }: HistoryListProps) {
  const [displayCount, setDisplayCount] = useState(10);

  const displayOptions = [
    { value: 5, label: '5 items' },
    { value: 10, label: '10 items' },
    { value: 20, label: '20 items' },
    { value: 50, label: '50 items' },
    { value: 100, label: '100 items' },
    { value: urlHistory.length, label: 'All items' }
  ];

  return (
    <div className={styles.historySection}>
      <div className={styles.sectionHeader}>
        <HistoryOutlined />
        📚 RECENT ({displayCount})
      </div>
      <div className={styles.sectionContent}>
        {/* Display Count Selector */}
        <div className={styles.displayControls}>
          <Select
            value={displayCount}
            onChange={setDisplayCount}
            options={displayOptions}
            size="small"
            className={styles.displaySelect}
          />
        </div>

        <ul className={styles.historyList}>
          {urlHistory.slice(0, displayCount).map((item, index) => {
            const u = new URL(item.url);
            const path = u.pathname || '/';
            const queryAndHash = `${u.search || ''}${u.hash || ''}`;
            const firstLine = `${u.hostname}${path}`;
            // Prefer showing params on second line; if none, fall back to title
            const secondLine = queryAndHash || (item.title && item.title.trim().length > 0 ? item.title : '');
            const responseMs = `${Math.max(0, Math.round(item.responseTime))}ms`;
            return (
              <li
                key={index}
                className={styles.historyItem}
                title={item.url}
              >
                <div
                  className={styles.historyContent}
                  onClick={() => onHistoryClick(item.url)}
                >
                  <div className={styles.historyTexts}>
                    <span className={styles.historyUrl}>• {firstLine}</span>
                    {secondLine && <span className={styles.historySubtitle}>{secondLine}</span>}
                  </div>
                  <div className={styles.historyBadges}>
                    <span className={`${styles.historyStatus} ${item.success ? styles.statusSuccess : styles.statusError}`}>
                      {item.success ? '[✓]' : '[❌]'}
                    </span>
                    {item.cached && <span className={styles.badgeMuted}>[⚡]</span>}
                    <span className={styles.badgeMuted}>[{responseMs}]</span>
                  </div>
                </div>
                <button
                  className={styles.deleteBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteItem(index);
                  }}
                  title="Delete this item"
                >
                  <DeleteOutlined />
                </button>
              </li>
            );
          })}
        </ul>

        {urlHistory.length > 0 && (
          <button
            className={`${styles.btn} ${styles.btnSecondary} ${styles.clearHistoryBtn}`}
            onClick={onClearHistory}
          >
            🗑️ Clear All
          </button>
        )}
      </div>
    </div>
  );
}

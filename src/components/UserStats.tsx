'use client';

import styles from '@/styles/UserStats.module.css';
import { FileTextOutlined } from '@ant-design/icons';

interface UserStats {
  totalAnalyzed: number;
  todayCount: number;
  weekCount: number;
  successCount: number;
  cacheHits: number;
  totalTime: number;
  lastWeekReset: string;
}

interface UserStatsProps {
  userStats: UserStats;
}

export default function UserStats({ userStats }: UserStatsProps) {
  const successRate = userStats.totalAnalyzed > 0 ? Math.round((userStats.successCount / userStats.totalAnalyzed) * 100) : 0;
  const cacheRate = userStats.totalAnalyzed > 0 ? Math.round((userStats.cacheHits / userStats.totalAnalyzed) * 100) : 0;
  const avgTime = userStats.successCount > 0 ? (userStats.totalTime / userStats.successCount / 1000).toFixed(1) : '0.0';

  return (
    <div className={styles.panelSection}>
      <div className={styles.sectionHeader}>
        <FileTextOutlined />
        📈 YOUR STATS
      </div>
      <div className={styles.sectionContent}>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{userStats.weekCount}</span>
            <div className={styles.statLabel}>This week</div>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{userStats.totalAnalyzed}</span>
            <div className={styles.statLabel}>Total</div>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{successRate}% ✅</span>
            <div className={styles.statLabel}>Success</div>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{cacheRate}% ⚡</span>
            <div className={styles.statLabel}>Cached</div>
          </div>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{avgTime}s</span>
          <div className={styles.statLabel}>Avg time</div>
        </div>
      </div>
    </div>
  );
}

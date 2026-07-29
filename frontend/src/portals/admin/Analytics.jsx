import React from 'react';
import styles from './Analytics.module.css';

export default function Analytics() {
  const hotspotList = [
    { zone: 'Bus Stand Chowk (Ward 12)', occurrences: 48, trend: '+12% this week', alert: 'High' },
    { zone: 'Dhamangaon Rd Market (Ward 8)', occurrences: 32, trend: '-5% this week', alert: 'Medium' },
    { zone: 'Civil Lines Library (Ward 4)', occurrences: 19, trend: '+2% this week', alert: 'Low' },
  ];

  return (
    <div className={styles.container}>
      {/* Header Banner */}
      <div className={styles.headerCard}>
        <div className={styles.headerIcon}>📈</div>
        <div>
          <h1 className={styles.title}>Analytics</h1>
          <p className={styles.subtitle}>Trend analysis, litter hotspot identification, and resolution performance.</p>
        </div>
      </div>

      {/* KPI Cards with top accent lines */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.statCardBlue}`}>
          <span className={styles.statLabel}>AI Detections (30 Days)</span>
          <div className={styles.statValue}>1,240</div>
          <span className={styles.statSub}>94% Accuracy Rate</span>
        </div>
        <div className={`${styles.statCard} ${styles.statCardGreen}`}>
          <span className={styles.statLabel}>Avg. Clearance Time</span>
          <div className={styles.statValue}>42 Mins</div>
          <span className={styles.statSubGreen}>↓ 18% Faster than last month</span>
        </div>
        <div className={`${styles.statCard} ${styles.statCardPurple}`}>
          <span className={styles.statLabel}>Swachh Survekshan Score</span>
          <div className={styles.statValueHighlight}>895 / 1000</div>
          <span className={styles.statSub}>Top 10% Rank Potential</span>
        </div>
      </div>

      {/* Main Analytics Content */}
      <div className={styles.contentGrid}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Chronic Litter Hotspots (Yavatmal)</h3>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Location / Ward</th>
                  <th>Detections</th>
                  <th>Weekly Trend</th>
                  <th>Severity</th>
                </tr>
              </thead>
              <tbody>
                {hotspotList.map((spot, index) => (
                  <tr key={index}>
                    <td><strong>{spot.zone}</strong></td>
                    <td>{spot.occurrences} events</td>
                    <td>{spot.trend}</td>
                    <td>
                      <span className={`${styles.badge} ${spot.alert === 'High' ? styles.badgeHigh : spot.alert === 'Medium' ? styles.badgeMedium : styles.badgeLow}`}>
                        {spot.alert}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Detection Insights</h3>
          <div className={styles.insightBox}>
            <div className={styles.insightItem}>
              <strong>Peak Littering Hours</strong>
              <p>4:00 PM – 7:30 PM (Post-market hours)</p>
            </div>
            <div className={styles.insightItem}>
              <strong>Most Detected Waste Type</strong>
              <p>Single-use plastic & food packaging (68%)</p>
            </div>
            <div className={styles.insightItem}>
              <strong>Resolution Rate</strong>
              <p>91.4% cleared within 2 hours of AI alert</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
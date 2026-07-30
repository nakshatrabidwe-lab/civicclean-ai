import React, { useState, useEffect } from 'react';
import { getStoredIssues, resetToDefaultData } from '../../services/dataService';
import styles from './TrackIssues.module.css';

export default function TrackIssues() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    setIssues(getStoredIssues());
  }, []);

  const handleReset = () => {
    const defaultData = resetToDefaultData();
    setIssues(defaultData);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerCard}>
        <div className={styles.headerIcon}>📋</div>
        <div>
          <h1 className={styles.title}>Track Reported Issues</h1>
          <p className={styles.subtitle}>Real-time citizen grievances and automated status tracker.</p>
        </div>
        <button 
          onClick={handleReset} 
          style={{ marginLeft: 'auto', padding: '8px 14px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          🔄 Reset Baseline Data
        </button>
      </div>

      <div className={styles.grid}>
        {issues.map((issue) => (
          <div key={issue.id} className={styles.card}>
            <div className={styles.cardBanner}>
              <span className={styles.statusTag}>{issue.status}</span>
              <div className={styles.trashIcon}>🗑️</div>
            </div>

            {issue.image && (
              <img src={issue.image} alt={issue.title} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
            )}

            <div className={styles.cardContent}>
              <span className={styles.issueId}>{issue.id} • {issue.date}</span>
              <h3 className={styles.issueTitle}>{issue.title}</h3>
              <p className={styles.location}>📍 {issue.location}</p>
              <div className={styles.aiTag}>🤖 {issue.aiConfidence}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
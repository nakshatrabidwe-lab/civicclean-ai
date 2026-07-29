import React from 'react';
import styles from './TeamsDispatch.module.css';

const teams = [
  {
    id: 'TEAM-01',
    name: 'Sanitation Unit Alpha',
    lead: 'Ramesh Patil',
    ward: 'Ward 12 (Bus Stand Chowk)',
    status: 'ACTIVE',
    assignedTasks: 3,
    phone: '+91 98230 11223',
    headerColor: styles.headerGreen,
    initials: 'RP'
  },
  {
    id: 'TEAM-02',
    name: 'Ward 8 Rapid Response',
    lead: 'Suresh Deshmukh',
    ward: 'Ward 8 (Market Area)',
    status: 'IN FIELD',
    assignedTasks: 5,
    phone: '+91 94221 44556',
    headerColor: styles.headerBlue,
    initials: 'SD'
  },
  {
    id: 'TEAM-03',
    name: 'Heavy Clean Crew B',
    lead: 'Vikas Jadhav',
    ward: 'Ward 4 (Civil Lines)',
    status: 'STANDBY',
    assignedTasks: 0,
    phone: '+91 91580 99887',
    headerColor: styles.headerDark,
    initials: 'VJ'
  }
];

export default function TeamsDispatch() {
  return (
    <div className={styles.container}>
      {/* Header Banner */}
      <div className={styles.headerCard}>
        <div className={styles.headerIcon}>👷</div>
        <div>
          <h1 className={styles.title}>Teams & Dispatch</h1>
          <p className={styles.subtitle}>Manage field crews, track active deployments, and dispatch work orders.</p>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.statCardBlue}`}>
          <span className={styles.statLabel}>Total Field Crews</span>
          <div className={styles.statValue}>8 Units</div>
        </div>
        <div className={`${styles.statCard} ${styles.statCardGreen}`}>
          <span className={styles.statLabel}>Active Dispatches</span>
          <div className={styles.statValueHighlight}>14 Tasks</div>
        </div>
        <div className={`${styles.statCard} ${styles.statCardPurple}`}>
          <span className={styles.statLabel}>Avg. Response Time</span>
          <div className={styles.statValue}>32 mins</div>
        </div>
      </div>

      {/* Teams Card Grid (Matching Rewards Card Layout) */}
      <div className={styles.teamGrid}>
        {teams.map((team) => (
          <div key={team.id} className={styles.teamCard}>
            {/* Dark/Green Header Block */}
            <div className={`${styles.cardTopHeader} ${team.headerColor}`}>
              <span className={styles.statusBadge}>{team.status}</span>
              <div className={styles.header3DIcon}>🚛</div>
            </div>

            {/* Content Body */}
            <div className={styles.cardBody}>
              <div className={styles.leadRow}>
                <div className={styles.avatar}>{team.initials}</div>
                <div>
                  <h4 className={styles.leadName}>{team.lead}</h4>
                  <span className={styles.teamId}>{team.id} • {team.name}</span>
                </div>
              </div>

              <h3 className={styles.wardTitle}>{team.ward}</h3>
              
              <div className={styles.tagsRow}>
                <span className={styles.tag}>📞 {team.phone}</span>
                <span className={styles.tagHighlight}>📋 {team.assignedTasks} Tasks</span>
              </div>

              <div className={styles.cardActions}>
                <button className={styles.btnSecondary}>Reassign</button>
                <button className={styles.btnPrimary}>Dispatch Task</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import React from 'react'
import { NavLink, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import CarbonTracker from './CarbonTracker'
import Leaderboard   from './Leaderboard'
import styles from './EcoHub.module.css'

const TABS = [
  { to: '/citizen/eco/tracker',     label: 'Carbon Tracker', emoji: '🌍', desc: 'Track your daily footprint', color: '#16a34a' },
  { to: '/citizen/eco/leaderboard', label: 'CivicHero Board', emoji: '🏆', desc: 'See top community heroes',   color: '#f0a500' },
]

export default function EcoHub() {
  const location = useLocation()
  const isRoot   = ['/citizen/eco', '/citizen/eco/'].includes(location.pathname)

  return (
    <div className={styles.wrap}>
      <div className={styles.subNav}>
        {TABS.map(t => (
          <NavLink key={t.to} to={t.to}
            className={({ isActive }) => [styles.tab, isActive ? styles.tabActive : ''].join(' ')}
            style={({ isActive }) => isActive ? { '--tc': t.color } : {}}>
            <span className={styles.tabEmoji}>{t.emoji}</span>
            <div className={styles.tabText}>
              <span className={styles.tabLabel}>{t.label}</span>
              <span className={styles.tabDesc}>{t.desc}</span>
            </div>
          </NavLink>
        ))}
      </div>

      {isRoot && <EcoLanding />}

      <Routes>
        <Route path="tracker"     element={<CarbonTracker />} />
        <Route path="leaderboard" element={<Leaderboard />} />
      </Routes>
    </div>
  )
}

function EcoLanding() {
  const navigate = useNavigate()
  return (
    <div className={styles.landing}>
      <div className={styles.hero}>
        <h1>Eco Hub</h1>
        <p>Measure your carbon impact and compete with fellow civic heroes in your community.</p>
      </div>
      <div className={styles.cards}>
        {TABS.map(t => (
          <button key={t.to} className={styles.card}
            style={{ '--tc': t.color }} onClick={() => navigate(t.to)}>
            <span className={styles.cardEmoji}>{t.emoji}</span>
            <h2>{t.label}</h2>
            <p>{t.desc}</p>
            <span className={styles.cta}>Explore →</span>
          </button>
        ))}
      </div>
    </div>
  )
}

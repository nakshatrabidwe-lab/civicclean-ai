import React from 'react'
import { NavLink, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import CarbonTracker from './CarbonTracker'
import Leaderboard   from './Leaderboard'
import styles from './GreenSection.module.css'

const TABS = [
  {
    to:    '/citizen/green/tracker',
    label: 'Carbon Tracker',
    emoji: '🌍',
    desc:  'Your footprint, streak & eco level',
    color: '#1a6b3c',
  },
  {
    to:    '/citizen/green/leaderboard',
    label: 'CivicHero Board',
    emoji: '🏆',
    desc:  'Plantation & Cleanup champions',
    color: '#f0a500',
  },
]

export default function GreenSection() {
  const location = useLocation()
  const navigate  = useNavigate()
  const isRoot = location.pathname === '/citizen/green' || location.pathname === '/citizen/green/'

  return (
    <div className={styles.wrap}>
      {/* Sub-nav */}
      <div className={styles.subNav}>
        {TABS.map(tab => (
          <NavLink
            key={tab.to} to={tab.to}
            className={({ isActive }) =>
              [styles.subTab, isActive ? styles.subTabActive : ''].join(' ')
            }
            style={({ isActive }) => isActive ? { '--tab-color': tab.color } : {}}
          >
            <span className={styles.subTabEmoji}>{tab.emoji}</span>
            <div className={styles.subTabText}>
              <span className={styles.subTabLabel}>{tab.label}</span>
              <span className={styles.subTabDesc}>{tab.desc}</span>
            </div>
          </NavLink>
        ))}
      </div>

      {/* Landing */}
      {isRoot && (
        <div className={styles.landing}>
          <div className={styles.landingHero}>
            <h1>🌿 Go Green</h1>
            <p>Track your personal carbon footprint and compete with Nashik's top eco-heroes.</p>
          </div>
          <div className={styles.landingCards}>
            {TABS.map(tab => (
              <button key={tab.to} className={styles.landingCard}
                style={{ '--card-color': tab.color }}
                onClick={() => navigate(tab.to)}>
                <span className={styles.landingEmoji}>{tab.emoji}</span>
                <h2>{tab.label}</h2>
                <p>{tab.desc}</p>
                <span className={styles.landingArrow} style={{ color: tab.color }}>Explore →</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sub-routes */}
      <Routes>
        <Route path="tracker"     element={<CarbonTracker />} />
        <Route path="leaderboard" element={<Leaderboard />} />
      </Routes>
    </div>
  )
}

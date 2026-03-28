import React from 'react'
import { NavLink, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import GrievanceForm from './GrievanceForm'
import Marketplace   from './Marketplace'
import styles from './ActSection.module.css'

const ACT_TABS = [
  {
    to:    '/citizen/act/grievance',
    label: 'File Grievance',
    emoji: '📢',
    desc:  'Report a civic issue in your area',
    color: '#dc2626',
  },
  {
    to:    '/citizen/act/marketplace',
    label: 'Marketplace',
    emoji: '♻️',
    desc:  'Buy, Sell or Donate recyclables',
    color: '#16a34a',
  },
]

export default function ActSection() {
  const location = useLocation()
  const isRoot   = location.pathname === '/citizen/act' || location.pathname === '/citizen/act/'

  return (
    <div className={styles.wrap}>
      {/* Sub-nav tabs */}
      <div className={styles.subNav}>
        {ACT_TABS.map(tab => (
          <NavLink
            key={tab.to}
            to={tab.to}
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

      {/* Landing choice if at /citizen/act */}
      {isRoot && <ActLanding />}

      {/* Sub-routes */}
      <Routes>
        <Route path="grievance"   element={<GrievanceForm />} />
        <Route path="marketplace" element={<Marketplace />} />
      </Routes>
    </div>
  )
}

function ActLanding() {
  const navigate = useNavigate()
  return (
    <div className={styles.landing}>
      <div className={styles.landingHero}>
        <h1>Take Action</h1>
        <p>Report civic issues or participate in the circular economy. Every action makes your city cleaner.</p>
      </div>
      <div className={styles.landingCards}>
        {ACT_TABS.map(tab => (
          <button
            key={tab.to}
            className={styles.landingCard}
            style={{ '--card-color': tab.color }}
            onClick={() => navigate(tab.to)}
          >
            <span className={styles.landingEmoji}>{tab.emoji}</span>
            <h2>{tab.label}</h2>
            <p>{tab.desc}</p>
            <span className={styles.landingArrow}>Get Started →</span>
          </button>
        ))}
      </div>
    </div>
  )
}

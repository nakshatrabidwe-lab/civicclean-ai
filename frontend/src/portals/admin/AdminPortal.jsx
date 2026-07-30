import React, { Suspense, lazy } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import styles from './AdminPortal.module.css'

// Importing actual full components
import IssueQueue from './IssueQueue';
import Settings from './Settings';

// Lazy loading other tabs
const Overview          = lazy(() => import('./Overview'))
const CCTVSurveillance  = lazy(() => import('./CCTVSurveillance'))
const RewardsManagement = lazy(() => import('./RewardsManagement'))
const Analytics         = lazy(() => import('./Analytics'))
const TeamsDispatch     = lazy(() => import('./TeamsDispatch'))

function Loading() {
  return <div style={{ padding: '40px', color: '#94a3b8' }}>Loading...</div>
}

export default function AdminPortal() {
  const navigate = useNavigate()

  const navItems = [
    { to: '/admin',           label: '📊 Overview',          end: true },
    { to: '/admin/queue',     label: '📋 Issue Queue',        end: true },
    { to: '/admin/cctv',      label: '📡 CCTV Surveillance',  end: true },
    { to: '/admin/rewards',   label: '🎖️ Rewards',            end: true },
    { to: '/admin/analytics', label: '📈 Analytics',          end: true },
    { to: '/admin/teams',     label: '👷 Teams & Dispatch',   end: true },
    { to: '/admin/settings',  label: '⚙️ Settings',          end: true },
  ]

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <button className={styles.brand} onClick={() => navigate('/')}>
          <span>♻</span> CivicClean <em>AI</em>
        </button>
        <div className={styles.portalBadge}>Municipal Admin</div>
        <nav className={styles.nav}>
          {navItems.map(({ to, label, end }) => (
            <NavLink
              key={to} to={to} end={end}
              className={({ isActive }) =>
                [styles.navItem, isActive ? styles.navActive : ''].join(' ')
              }
            >{label}</NavLink>
          ))}
        </nav>
        <button className={styles.switchPortal} onClick={() => navigate('/citizen')}>
          Switch to Citizen →
        </button>
      </aside>

      <main className={styles.main}>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route index           element={<Overview />} />
            <Route path="queue"     element={<IssueQueue />} />
            <Route path="cctv"      element={<CCTVSurveillance />} />
            <Route path="rewards"   element={<RewardsManagement />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="teams"     element={<TeamsDispatch />} />
            <Route path="settings"  element={<Settings />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}
import React, { Suspense, lazy } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import styles from './CitizenPortal.module.css'
import TrackIssues from './TrackIssues';
import Profile from './Profile';

const Dashboard          = lazy(() => import('./Dashboard'))
const RegisterPage       = lazy(() => import('./RegisterPage'))
const ActSection         = lazy(() => import('./ActSection'))
const GreenSection       = lazy(() => import('./GreenSection'))
const TransparencyReport = lazy(() => import('./TransparencyReport'))
const TreeAdoption       = lazy(() => import('./TreeAdoption'))
const CitizenRewards     = lazy(() => import('./CitizenRewards'))

function PlaceholderPage({ title, desc }) {
  return (
    <div className={styles.placeholder}>
      <h2>{title}</h2>
      <p>{desc}</p>
    </div>
  )
}

function Loading() {
  return <div style={{ padding: '40px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Loading...</div>
}



export default function CitizenPortal() {
  const navigate = useNavigate()

  const navItems = [
    { to: '/citizen',              label: '🏠 Dashboard',    end: true  },
    { to: '/citizen/act',          label: '⚡ Act',           end: false },
    { to: '/citizen/green',        label: '🌿 Go Green',      end: false },
    { to: '/citizen/trees',        label: '🌳 My Trees',      end: true  },
    { to: '/citizen/rewards',      label: '🎖️ My Rewards',    end: true  },
    { to: '/citizen/transparency', label: '📊 City Report',   end: true  },
    { to: '/citizen/act/grievance', label: '📍 Report Issue',  end: true  },
    { to: '/citizen/track',        label: '🔍 Track Issues',  end: true  },
    { to: '/citizen/profile',      label: '👤 Profile',       end: true  },
    { to: '/citizen/register',     label: '✅ Register',      end: true  },
  ]

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <button className={styles.brand} onClick={() => navigate('/')}>
          <span>♻</span> CivicClean <em>AI</em>
        </button>
        <div className={styles.portalBadge}>Citizen Portal</div>
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
        <button className={styles.switchPortal} onClick={() => navigate('/admin')}>
          Switch to Admin →
        </button>
      </aside>

      <main className={styles.main}>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route index               element={<Dashboard />} />
            <Route path="act/*"        element={<ActSection />} />
            <Route path="green/*"      element={<GreenSection />} />
            <Route path="trees"        element={<TreeAdoption />} />
            <Route path="rewards"      element={<CitizenRewards />} />
            <Route path="transparency" element={<TransparencyReport />} />
            <Route path="track"        element={<TrackIssues />} />
            <Route path="profile"      element={<Profile />} />
            <Route path="register"     element={<RegisterPage />} />
            <Route path="login"        element={<PlaceholderPage title="Sign In" desc="Login page coming soon." />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}

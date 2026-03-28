import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CURRENT_USER, ECO_LEVELS, BADGES, TODAY_ACTIONS } from '../../shared/data/ecoData'
import { getPosts, subscribe } from '../../shared/data/sharedStore'
import styles from './Dashboard.module.css'

// ── Animated counter ─────────────────────────────────────────
function AnimCounter({ target, duration = 1200 }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let raf, start = null
    function step(ts) {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setVal(Math.floor(target * ease))
      if (p < 1) raf = requestAnimationFrame(step)
      else setVal(target)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target])
  return <>{val.toLocaleString()}</>
}

// ── Progress ring ─────────────────────────────────────────────
function MiniRing({ pct, color, size = 56, stroke = 5 }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const [dash, setDash] = useState(0)
  useEffect(() => { const t = setTimeout(() => setDash((pct / 100) * circ), 200); return () => clearTimeout(t) }, [pct, circ])
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--color-surface-alt)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={circ - dash} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }} />
    </svg>
  )
}

// ── Quick action button ───────────────────────────────────────
function QuickAction({ emoji, label, desc, color, onClick }) {
  return (
    <button className={styles.qaBtn} style={{ '--qa-color': color }} onClick={onClick}>
      <span className={styles.qaEmoji}>{emoji}</span>
      <div className={styles.qaText}>
        <span className={styles.qaLabel}>{label}</span>
        <span className={styles.qaDesc}>{desc}</span>
      </div>
      <span className={styles.qaArrow}>→</span>
    </button>
  )
}

// ── Status badge ──────────────────────────────────────────────
const STATUS = {
  pending:  { label: 'Pending',     color: '#f59e0b', bg: 'rgba(245,158,11,.1)'  },
  approved: { label: 'Approved',    color: '#22c55e', bg: 'rgba(34,197,94,.1)'   },
  rejected: { label: 'Rejected',    color: '#ef4444', bg: 'rgba(239,68,68,.1)'   },
  open:     { label: 'Open',        color: '#ef4444', bg: 'rgba(239,68,68,.1)'   },
  resolved: { label: 'Resolved',    color: '#22c55e', bg: 'rgba(34,197,94,.1)'   },
}

function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000)
  if (s < 60)    return `${s}s ago`
  if (s < 3600)  return `${Math.floor(s/60)}m ago`
  if (s < 86400) return `${Math.floor(s/3600)}h ago`
  return `${Math.floor(s/86400)}d ago`
}

// ── My recent grievances (mock) ───────────────────────────────
const MY_GRIEVANCES = [
  { id: 'GRV-18470', type: 'Garbage Dump',   ward: 'Ward 1 – Nashik Rd', status: 'resolved',  submittedAt: new Date(Date.now() - 2*86400000) },
  { id: 'GRV-18451', type: 'Broken Road',    ward: 'Ward 1 – Nashik Rd', status: 'open',       submittedAt: new Date(Date.now() - 5*86400000) },
  { id: 'GRV-18432', type: 'Water Logging',  ward: 'Ward 1 – Nashik Rd', status: 'resolved',   submittedAt: new Date(Date.now() - 9*86400000) },
  { id: 'GRV-18410', type: 'Open Burning',   ward: 'Ward 1 – Nashik Rd', status: 'pending',    submittedAt: new Date(Date.now() - 12*86400000) },
]

// ── Community feed ────────────────────────────────────────────
const COMMUNITY_FEED = [
  { id:'f1', user:'Priya S.',  avatar:'PS', action:'planted 15 trees',   icon:'🌳', time:'2h ago',  points:375,  city:'Panchavati' },
  { id:'f2', user:'Suresh P.', avatar:'SP', action:'cleared a dump site', icon:'🗑️', time:'4h ago',  points:240,  city:'Cidco' },
  { id:'f3', user:'Vijay D.',  avatar:'VD', action:'joined cleanup drive',icon:'🧹', time:'6h ago',  points:150,  city:'Igatpuri' },
  { id:'f4', user:'Anita B.',  avatar:'AB', action:'filed 3 grievances',  icon:'📋', time:'9h ago',  points:90,   city:'Nashik Rd' },
  { id:'f5', user:'Meena J.',  avatar:'MJ', action:'donated on Marketplace',icon:'♻️', time:'12h ago', points:60,  city:'Satpur' },
]

// ── Main Dashboard ────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate()
  const [posts, setPosts]       = useState(getPosts)
  const [actions, setActions]   = useState(TODAY_ACTIONS)
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const h = new Date().getHours()
    setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening')
    return subscribe(setPosts)
  }, [])

  const user       = CURRENT_USER
  const levelMeta  = ECO_LEVELS[user.level - 1]
  const nextLevel  = ECO_LEVELS[user.level] ?? ECO_LEVELS[ECO_LEVELS.length - 1]
  const xpToNext   = nextLevel.min - levelMeta.min
  const xpProgress = user.ecoPoints - levelMeta.min
  const xpPct      = Math.min(Math.round((xpProgress / xpToNext) * 100), 100)

  const myPosts      = posts.filter(p => p.userId === 'USR-4821').slice(0, 3)
  const approvedCount = posts.filter(p => p.status === 'approved').length
  const pendingCount  = posts.filter(p => p.status === 'pending').length

  function toggleAction(id) {
    setActions(prev => prev.map(a => a.id === id ? { ...a, done: !a.done } : a))
  }

  const doneActions  = actions.filter(a => a.done).length
  const todayPoints  = actions.filter(a => a.done).reduce((s, a) => s + a.points, 0)

  return (
    <div className={styles.page}>

      {/* ── Welcome banner ──────────────────────────────── */}
      <div className={styles.welcomeBanner}>
        <div className={styles.welcomeLeft}>
          <div className={styles.avatar} style={{ background: user.avatarColor }}>
            {user.initials}
          </div>
          <div>
            <p className={styles.welcomeGreeting}>{greeting},</p>
            <h1 className={styles.welcomeName}>{user.name} <span className={styles.levelEmoji}>{levelMeta.emoji}</span></h1>
            <p className={styles.welcomeSub}>📍 {user.city} · Joined {user.joinedAt}</p>
          </div>
        </div>
        <div className={styles.streakChip}>
          <span className={styles.streakFire}>🔥</span>
          <div>
            <span className={styles.streakNum}>{user.streak}</span>
            <span className={styles.streakLabel}> day streak</span>
          </div>
        </div>
      </div>

      {/* ── Stat cards ──────────────────────────────────── */}
      <div className={styles.statGrid}>
        {[
          { icon:'📋', label:'Reports Filed',  val: user.reports,     color:'#3b82f6', bg:'linear-gradient(135deg,#1e3a5f,#1e40af)' },
          { icon:'🧹', label:'Cleanups Joined', val: user.cleanups,    color:'#22c55e', bg:'linear-gradient(135deg,#0f3324,#166534)' },
          { icon:'🌳', label:'Trees Planted',   val: user.plantations, color:'#f59e0b', bg:'linear-gradient(135deg,#3d2200,#92400e)' },
          { icon:'🌿', label:'Eco Points',      val: user.ecoPoints,   color:'#a78bfa', bg:'linear-gradient(135deg,#2e1065,#4c1d95)' },
        ].map(s => (
          <div key={s.label} className={styles.statCard} style={{ background: s.bg }}>
            <div className={styles.statTop}>
              <span className={styles.statIcon}>{s.icon}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
            <span className={styles.statVal} style={{ color: s.color }}>
              <AnimCounter target={s.val} />
            </span>
          </div>
        ))}
      </div>

      {/* ── Middle row ──────────────────────────────────── */}
      <div className={styles.midRow}>

        {/* Eco Level card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>🦸 Your Eco Level</h2>
          <div className={styles.levelRow}>
            <div className={styles.levelRingWrap}>
              <MiniRing pct={xpPct} color={levelMeta.color} size={72} stroke={7} />
              <div className={styles.levelRingInner}>
                <span style={{ fontSize: '1.4rem' }}>{levelMeta.emoji}</span>
              </div>
            </div>
            <div className={styles.levelInfo}>
              <div className={styles.levelBadge} style={{ background: levelMeta.color + '22', color: levelMeta.color }}>
                Level {user.level} · {levelMeta.title}
              </div>
              <p className={styles.levelPoints}>{user.ecoPoints.toLocaleString()} pts</p>
              <div className={styles.xpBar}>
                <div className={styles.xpFill} style={{ width: `${xpPct}%`, background: levelMeta.color }} />
              </div>
              <p className={styles.xpLabel}>{xpPct}% to Level {user.level + 1} · {(xpToNext - xpProgress).toLocaleString()} pts to go</p>
            </div>
          </div>

          {/* Badges */}
          <div className={styles.badgesRow}>
            {BADGES.map(b => (
              <div
                key={b.id}
                className={`${styles.badge} ${b.locked ? styles.badgeLocked : ''}`}
                title={b.locked ? `🔒 ${b.label}: ${b.desc}` : `${b.label} · ${b.earnedAt}`}
              >
                <span>{b.emoji}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Today's actions */}
        <div className={styles.card}>
          <div className={styles.cardTitleRow}>
            <h2 className={styles.cardTitle}>⚡ Today's Eco Actions</h2>
            <span className={styles.actionScore}>+{todayPoints} pts · {doneActions}/{actions.length}</span>
          </div>
          <div className={styles.actionProgress}>
            <div className={styles.actionBar}>
              <div className={styles.actionBarFill} style={{ width: `${(doneActions / actions.length) * 100}%` }} />
            </div>
          </div>
          <div className={styles.actionList}>
            {actions.map(a => (
              <div key={a.id} className={`${styles.actionRow} ${a.done ? styles.actionDone : ''}`}
                onClick={() => toggleAction(a.id)}>
                <span className={styles.actionCheck}>{a.done ? '✅' : '⬜'}</span>
                <span className={styles.actionEmoji}>{a.emoji}</span>
                <span className={styles.actionLabel}>{a.label}</span>
                <span className={styles.actionPts}>+{a.points}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick actions ────────────────────────────────── */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>🚀 Quick Actions</h2>
        <div className={styles.qaGrid}>
          <QuickAction emoji="📢" label="File a Grievance"    desc="Report a civic issue near you"      color="#ef4444" onClick={() => navigate('/citizen/act/grievance')} />
          <QuickAction emoji="♻️" label="Visit Marketplace"   desc="Buy, sell or donate recyclables"    color="#22c55e" onClick={() => navigate('/citizen/act/marketplace')} />
          <QuickAction emoji="🌍" label="Carbon Tracker"      desc="Log today's eco footprint"          color="#3b82f6" onClick={() => navigate('/citizen/green/tracker')} />
          <QuickAction emoji="📊" label="City Report"         desc="See Nashik's cleanliness stats"     color="#f59e0b" onClick={() => navigate('/citizen/transparency')} />
          <QuickAction emoji="🏆" label="Leaderboard"         desc="Your city ranking this week"        color="#8b5cf6" onClick={() => navigate('/citizen/green/leaderboard')} />
          <QuickAction emoji="✅" label="My Profile"          desc="Update your details & preferences"  color="#06b6d4" onClick={() => navigate('/citizen/profile')} />
        </div>
      </div>

      {/* ── Bottom row: grievances + community ──────────── */}
      <div className={styles.bottomRow}>

        {/* My grievances */}
        <div className={styles.card}>
          <div className={styles.cardTitleRow}>
            <h2 className={styles.cardTitle}>📋 My Grievances</h2>
            <button className={styles.viewAllBtn} onClick={() => navigate('/citizen/track')}>View All →</button>
          </div>
          <div className={styles.grievanceList}>
            {MY_GRIEVANCES.map(g => {
              const sm = STATUS[g.status]
              return (
                <div key={g.id} className={styles.grievanceRow}>
                  <div className={styles.grievanceDot} style={{ background: sm.color }} />
                  <div className={styles.grievanceBody}>
                    <div className={styles.grievanceTop}>
                      <span className={styles.grievanceId}>{g.id}</span>
                      <span className={styles.grievanceBadge} style={{ color: sm.color, background: sm.bg }}>{sm.label}</span>
                    </div>
                    <p className={styles.grievanceType}>{g.type}</p>
                    <p className={styles.grievanceMeta}>📍 {g.ward} · {timeAgo(g.submittedAt)}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Voucher summary */}
          {approvedCount > 0 && (
            <div className={styles.voucherSummary}>
              <span>🎟️</span>
              <span><strong>{approvedCount} voucher{approvedCount > 1 ? 's' : ''}</strong> earned from approved submissions!</span>
            </div>
          )}
          {pendingCount > 0 && (
            <div className={styles.pendingSummary}>
              <span>⏳</span>
              <span><strong>{pendingCount} submission{pendingCount > 1 ? 's' : ''}</strong> awaiting admin review</span>
            </div>
          )}
        </div>

        {/* Community feed */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>🌍 Community Activity</h2>
          <div className={styles.feedList}>
            {COMMUNITY_FEED.map(f => (
              <div key={f.id} className={styles.feedRow}>
                <div className={styles.feedAvatar}>{f.avatar}</div>
                <div className={styles.feedBody}>
                  <p className={styles.feedText}>
                    <strong>{f.user}</strong> {f.action}
                  </p>
                  <p className={styles.feedMeta}>📍 {f.city} · {f.time}</p>
                </div>
                <span className={styles.feedPoints}>+{f.points} 🌿</span>
              </div>
            ))}
          </div>
          <button className={styles.joinBtn} onClick={() => navigate('/citizen/green/leaderboard')}>
            View Full Leaderboard →
          </button>
        </div>

      </div>

      {/* ── City health strip ───────────────────────────── */}
      <div className={styles.cityStrip}>
        <span className={styles.cityStripTitle}>📍 Nashik Today</span>
        {[
          { label: 'AQI', val: '68', sub: 'Moderate',  color: '#f59e0b' },
          { label: 'Active Drives', val: '12', sub: 'in progress', color: '#22c55e' },
          { label: 'Grievances Open', val: '38', sub: 'city-wide', color: '#ef4444' },
          { label: 'Trees This Week', val: '420', sub: 'planted',  color: '#16a34a' },
          { label: 'Volunteers Today', val: '284', sub: 'active',  color: '#3b82f6' },
        ].map(s => (
          <div key={s.label} className={styles.cityStatItem}>
            <span className={styles.cityStatVal} style={{ color: s.color }}>{s.val}</span>
            <span className={styles.cityStatLabel}>{s.label}</span>
            <span className={styles.cityStatSub}>{s.sub}</span>
          </div>
        ))}
      </div>

    </div>
  )
}

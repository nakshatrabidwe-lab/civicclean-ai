import React, { useState, useEffect, useRef } from 'react'
import styles from './Overview.module.css'

// ── Sparkline SVG (mini trend line) ─────────────────────────
function Sparkline({ data, color, fill }) {
  const w = 80, h = 32
  const min = Math.min(...data), max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 4) - 2
    return `${x},${y}`
  })
  const path = 'M' + pts.join('L')
  const fillPath = `${path}L${w},${h}L0,${h}Z`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ overflow: 'visible' }}>
      {fill && <path d={fillPath} fill={color} fillOpacity="0.12" />}
      <path d={path} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Animated counter ─────────────────────────────────────────
function AnimCounter({ target, duration = 1200, prefix = '', suffix = '' }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setVal(target); clearInterval(timer) }
      else setVal(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target])
  return <>{prefix}{val.toLocaleString()}{suffix}</>
}

// ── Ring progress ────────────────────────────────────────────
function RingProgress({ pct, color, size = 80, stroke = 7 }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const [dash, setDash] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setDash((pct / 100) * circ), 100)
    return () => clearTimeout(t)
  }, [pct, circ])
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={circ - dash}
        strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }} />
    </svg>
  )
}

// ── Horizontal bar ────────────────────────────────────────────
function ProgressBar({ pct, color }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW(pct), 120); return () => clearTimeout(t) }, [pct])
  return (
    <div className={styles.barTrack}>
      <div className={styles.barFill} style={{ width: `${w}%`, background: color, transition: 'width 1s cubic-bezier(.4,0,.2,1)' }} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────
const KPI_CARDS = [
  {
    id: 'total',
    label: 'Total Grievances',
    value: 1847,
    delta: '+12%',
    deltaDir: 'up',
    icon: '📋',
    color: '#3b82f6',
    bg: 'linear-gradient(135deg,#1e3a5f,#1e40af)',
    spark: [32,45,38,55,48,62,58,70,65,80,72,88],
    suffix: '',
  },
  {
    id: 'resolved',
    label: 'Resolved Issues',
    value: 1423,
    delta: '+8%',
    deltaDir: 'up',
    icon: '✅',
    color: '#22c55e',
    bg: 'linear-gradient(135deg,#0f3324,#166534)',
    spark: [20,28,24,36,31,42,38,50,46,58,52,65],
    suffix: '',
  },
  {
    id: 'pending',
    label: 'Pending Review',
    value: 284,
    delta: '-5%',
    deltaDir: 'down',
    icon: '⏳',
    color: '#f59e0b',
    bg: 'linear-gradient(135deg,#3d2200,#92400e)',
    spark: [45,40,48,38,42,36,40,32,38,30,35,28],
    suffix: '',
  },
  {
    id: 'critical',
    label: 'Critical Alerts',
    value: 37,
    delta: '+3',
    deltaDir: 'up',
    icon: '🚨',
    color: '#ef4444',
    bg: 'linear-gradient(135deg,#3b0f0f,#991b1b)',
    spark: [5,8,6,12,9,14,11,16,13,18,15,20],
    suffix: '',
  },
]

const PLANTATION_ZONES = [
  { zone: 'Nashik Road Belt',     target: 5000, planted: 4230, species: 'Neem, Peepal', health: 92 },
  { zone: 'Gangapur Dam Stretch', target: 3200, planted: 2890, species: 'Bamboo, Teak',  health: 88 },
  { zone: 'Cidco Sector 4–8',     target: 4100, planted: 2150, species: 'Mango, Banyan', health: 74 },
  { zone: 'Trimbak Road Median',  target: 2800, planted: 2800, species: 'Gulmohar',      health: 97 },
  { zone: 'Panchavati Riverbank', target: 6000, planted: 3100, species: 'Arjun, Kadamba',health: 65 },
]

const WARD_STATS = [
  { ward: 'Ward 1 – Nashik Road',    grievances: 312, resolved: 289, pct: 93, color: '#22c55e' },
  { ward: 'Ward 2 – Panchavati',     grievances: 278, resolved: 231, pct: 83, color: '#3b82f6' },
  { ward: 'Ward 3 – Cidco',          grievances: 245, resolved: 186, pct: 76, color: '#f59e0b' },
  { ward: 'Ward 4 – Satpur',         grievances: 198, resolved: 140, pct: 71, color: '#f59e0b' },
  { ward: 'Ward 5 – Deolali Camp',   grievances: 167, resolved: 102, pct: 61, color: '#ef4444' },
  { ward: 'Ward 6 – Igatpuri',       grievances: 134, resolved:  98, pct: 73, color: '#f59e0b' },
]

const RECENT_ACTIVITY = [
  { id: 'GRV-18472', type: 'Garbage Dump',    ward: 'Panchavati',  status: 'resolved',  time: '2m ago',  urgency: 'high' },
  { id: 'GRV-18471', type: 'Open Burning',    ward: 'Nashik Road', status: 'in_progress',time: '8m ago', urgency: 'high' },
  { id: 'GRV-18470', type: 'Broken Road',     ward: 'Cidco',       status: 'open',       time: '14m ago', urgency: 'medium' },
  { id: 'GRV-18469', type: 'Water Logging',   ward: 'Satpur',      status: 'resolved',   time: '22m ago', urgency: 'low' },
  { id: 'GRV-18468', type: 'Sewage Leak',     ward: 'Deolali',     status: 'open',       time: '35m ago', urgency: 'high' },
  { id: 'GRV-18467', type: 'Illegal Dumping', ward: 'Nashik Road', status: 'in_progress',time: '41m ago', urgency: 'medium' },
]

const STATUS_META = {
  resolved:    { label: 'Resolved',    color: '#22c55e', bg: 'rgba(34,197,94,.12)' },
  in_progress: { label: 'In Progress', color: '#f59e0b', bg: 'rgba(245,158,11,.12)' },
  open:        { label: 'Open',        color: '#ef4444', bg: 'rgba(239,68,68,.12)' },
}

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────
export default function Overview() {
  const totalPlanted = PLANTATION_ZONES.reduce((a, z) => a + z.planted, 0)
  const totalTarget  = PLANTATION_ZONES.reduce((a, z) => a + z.target, 0)
  const plantPct     = Math.round((totalPlanted / totalTarget) * 100)
  const resolvePct   = Math.round((1423 / 1847) * 100)

  return (
    <div className={styles.page}>

      {/* ── Header ──────────────────────────────────────── */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>City Overview</h1>
          <p className={styles.subtitle}>Nashik Municipal Corporation · Live Dashboard</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.liveChip}><span className={styles.liveDot}/>LIVE</div>
          <div className={styles.dateChip}>
            {new Date().toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short', year:'numeric' })}
          </div>
        </div>
      </div>

      {/* ── KPI Cards ────────────────────────────────────── */}
      <div className={styles.kpiGrid}>
        {KPI_CARDS.map(card => (
          <div key={card.id} className={styles.kpiCard} style={{ background: card.bg }}>
            <div className={styles.kpiTop}>
              <div className={styles.kpiMeta}>
                <span className={styles.kpiIcon}>{card.icon}</span>
                <span className={styles.kpiLabel}>{card.label}</span>
              </div>
              <span className={`${styles.kpiDelta} ${card.deltaDir === 'down' ? styles.deltaDown : styles.deltaUp}`}>
                {card.deltaDir === 'up' ? '↑' : '↓'} {card.delta}
              </span>
            </div>
            <div className={styles.kpiBottom}>
              <span className={styles.kpiValue}>
                <AnimCounter target={card.value} />
              </span>
              <Sparkline data={card.spark} color={card.color} fill />
            </div>
          </div>
        ))}
      </div>

      {/* ── Middle row: resolution ring + plantation ──── */}
      <div className={styles.midRow}>

        {/* Resolution gauge */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Overall Resolution Rate</h2>
          <div className={styles.gaugeWrap}>
            <div className={styles.gaugeRing}>
              <RingProgress pct={resolvePct} color="#22c55e" size={120} stroke={10} />
              <div className={styles.gaugeCenter}>
                <span className={styles.gaugePct}>{resolvePct}%</span>
                <span className={styles.gaugeLabel}>Resolved</span>
              </div>
            </div>
            <div className={styles.gaugeLegend}>
              {[
                { label: 'Resolved',    val: 1423, color: '#22c55e' },
                { label: 'In Progress', val:  284, color: '#f59e0b' },
                { label: 'Open',        val:  140, color: '#ef4444' },
              ].map(l => (
                <div key={l.label} className={styles.legendRow}>
                  <span className={styles.legendDot} style={{ background: l.color }} />
                  <span className={styles.legendLabel}>{l.label}</span>
                  <span className={styles.legendVal}>{l.val.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Category breakdown */}
          <div className={styles.catBreakdown}>
            {[
              { label: 'Garbage Dump',   pct: 38, color: '#ef4444' },
              { label: 'Broken Roads',   pct: 22, color: '#f59e0b' },
              { label: 'Water Logging',  pct: 16, color: '#3b82f6' },
              { label: 'Open Burning',   pct: 14, color: '#f97316' },
              { label: 'Other',          pct: 10, color: '#8b5cf6' },
            ].map(c => (
              <div key={c.label} className={styles.catRow}>
                <span className={styles.catLabel}>{c.label}</span>
                <ProgressBar pct={c.pct} color={c.color} />
                <span className={styles.catPct}>{c.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plantation progress */}
        <div className={styles.card}>
          <div className={styles.cardTitleRow}>
            <h2 className={styles.cardTitle}>🌳 Plantation Progress</h2>
            <span className={styles.plantTotal}>
              <AnimCounter target={totalPlanted} duration={1400} /> / {totalTarget.toLocaleString()} trees
            </span>
          </div>
          <div className={styles.plantMeter}>
            <ProgressBar pct={plantPct} color="#22c55e" />
            <span className={styles.plantPct}>{plantPct}% of city target</span>
          </div>
          <div className={styles.zoneList}>
            {PLANTATION_ZONES.map(z => {
              const pct = Math.round((z.planted / z.target) * 100)
              const healthColor = z.health >= 90 ? '#22c55e' : z.health >= 75 ? '#f59e0b' : '#ef4444'
              return (
                <div key={z.zone} className={styles.zoneRow}>
                  <div className={styles.zoneInfo}>
                    <span className={styles.zoneName}>{z.zone}</span>
                    <span className={styles.zoneSpecies}>{z.species}</span>
                  </div>
                  <div className={styles.zoneRight}>
                    <div className={styles.zoneMini}>
                      <ProgressBar pct={pct} color="#22c55e" />
                    </div>
                    <span className={styles.zonePct}>{pct}%</span>
                    <span className={styles.zoneHealth} style={{ color: healthColor, borderColor: healthColor + '44', background: healthColor + '14' }}>
                      ♥ {z.health}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Bottom row: ward breakdown + recent activity ── */}
      <div className={styles.bottomRow}>

        {/* Ward-wise resolution */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Ward-wise Resolution</h2>
          <div className={styles.wardList}>
            {WARD_STATS.map(w => (
              <div key={w.ward} className={styles.wardRow}>
                <div className={styles.wardHeader}>
                  <span className={styles.wardName}>{w.ward}</span>
                  <span className={styles.wardFraction}>{w.resolved}/{w.grievances}</span>
                </div>
                <div className={styles.wardBarWrap}>
                  <ProgressBar pct={w.pct} color={w.color} />
                  <span className={styles.wardPct} style={{ color: w.color }}>{w.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity feed */}
        <div className={styles.card}>
          <div className={styles.cardTitleRow}>
            <h2 className={styles.cardTitle}>Recent Activity</h2>
            <span className={styles.viewAll}>View All →</span>
          </div>
          <div className={styles.feed}>
            {RECENT_ACTIVITY.map(item => {
              const sm = STATUS_META[item.status]
              return (
                <div key={item.id} className={styles.feedRow}>
                  <div className={styles.feedDot} style={{ background: sm.color }} />
                  <div className={styles.feedBody}>
                    <div className={styles.feedTop}>
                      <span className={styles.feedId}>{item.id}</span>
                      <span className={styles.feedBadge} style={{ color: sm.color, background: sm.bg }}>{sm.label}</span>
                    </div>
                    <span className={styles.feedType}>{item.type}</span>
                    <div className={styles.feedMeta}>
                      <span className={styles.feedWard}>📍 {item.ward}</span>
                      <span className={styles.feedTime}>{item.time}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

    </div>
  )
}

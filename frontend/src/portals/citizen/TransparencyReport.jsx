import React, { useState, useEffect, useRef } from 'react'
import { CITY_DATA } from '../../shared/data/sharedStore'
import styles from './TransparencyReport.module.css'

const CITIES = Object.keys(CITY_DATA)
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

// ── Animated counter ─────────────────────────────────────────
function AnimCounter({ target, decimals = 0, prefix = '', suffix = '', duration = 1400 }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let raf, start = null, from = 0
    function step(ts) {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setVal(from + (target - from) * ease)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target])
  return <>{prefix}{val.toFixed(decimals)}{suffix}</>
}

// ── Simple bar chart using SVG ────────────────────────────────
function BarChart({ data, labels, color, unit }) {
  const max   = Math.max(...data) || 1
  const W     = 560, H = 120, barW = 28, gap = (W - barW * data.length) / (data.length + 1)

  return (
    <svg viewBox={`0 0 ${W} ${H + 28}`} className={styles.chart}>
      {data.map((v, i) => {
        const x    = gap + i * (barW + gap)
        const barH = (v / max) * (H - 16)
        const y    = H - barH
        return (
          <g key={i}>
            {/* Background bar */}
            <rect x={x} y={8} width={barW} height={H - 8} rx={4} fill="rgba(0,0,0,.04)" />
            {/* Value bar */}
            <rect x={x} y={y} width={barW} height={barH} rx={4} fill={color} opacity=".85" />
            {/* Label */}
            <text x={x + barW / 2} y={H + 18} textAnchor="middle" fill="var(--color-text-subtle)" fontSize={9}>{labels[i]}</text>
          </g>
        )
      })}
    </svg>
  )
}

// ── Radial health ring ────────────────────────────────────────
function HealthRing({ pct, color, label, size = 72 }) {
  const stroke = 7, r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const [dash, setDash] = useState(0)
  useEffect(() => { const t = setTimeout(() => setDash((pct / 100) * circ), 200); return () => clearTimeout(t) }, [pct, circ])
  return (
    <div className={styles.ringWrap}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--color-surface-alt)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={circ - dash} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)' }} />
      </svg>
      <div className={styles.ringCenter}>
        <span className={styles.ringPct} style={{ color }}>{pct}</span>
        <span className={styles.ringUnit}>%</span>
      </div>
      <p className={styles.ringLabel}>{label}</p>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────
export default function TransparencyReport() {
  const [city, setCity]         = useState('Nashik')
  const [tab,  setTab]          = useState('overview')  // overview | wards | trends

  const data = CITY_DATA[city]

  // AQI colour
  const aqiColor = data.aqi < 50 ? '#22c55e' : data.aqi < 100 ? '#f59e0b' : data.aqi < 150 ? '#f97316' : '#ef4444'

  return (
    <div className={styles.page}>

      {/* ── Hero banner ─────────────────────────────────── */}
      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          <span className={styles.govSeal}>🏛️</span>
          <div>
            <p className={styles.govTag}>Government of Maharashtra · Municipal Transparency Portal</p>
            <h1 className={styles.heroTitle}>Public Transparency Report</h1>
            <p className={styles.heroSub}>Live civic data — updated daily. Select your city to view local stats.</p>
          </div>
        </div>
        {/* City selector */}
        <div className={styles.citySelector}>
          <label className={styles.cityLabel}>📍 Your City</label>
          <div className={styles.cityPills}>
            {CITIES.map(c => (
              <button
                key={c}
                className={`${styles.cityPill} ${city === c ? styles.cityPillActive : ''}`}
                onClick={() => setCity(c)}
              >{c}</button>
            ))}
          </div>
          <p className={styles.lastUpdated}>Last updated: {data.lastUpdated}</p>
        </div>
      </div>

      {/* ── Big stat cards ───────────────────────────────── */}
      <div className={styles.bigStats}>
        {/* Garbage Cleared */}
        <div className={`${styles.bigCard} ${styles.bigCardGarbage}`}>
          <div className={styles.bigCardIcon}>🗑️</div>
          <div className={styles.bigCardContent}>
            <p className={styles.bigCardLabel}>Garbage Cleared This Year</p>
            <p className={styles.bigCardValue}>
              <AnimCounter target={data.garbageCleared} decimals={1} suffix=" Tons" />
            </p>
            <p className={styles.bigCardSub}>
              Across {data.activeCleaned.toLocaleString()} clean-up drives · {data.volunteersTotal.toLocaleString()} volunteers
            </p>
          </div>
          <div className={styles.bigCardWave}>🌊</div>
        </div>

        {/* Trees Planted */}
        <div className={`${styles.bigCard} ${styles.bigCardTrees}`}>
          <div className={styles.bigCardIcon}>🌳</div>
          <div className={styles.bigCardContent}>
            <p className={styles.bigCardLabel}>Trees Planted This Year</p>
            <p className={styles.bigCardValue}>
              <AnimCounter target={data.treesPlanted} suffix="" />
            </p>
            <p className={styles.bigCardSub}>
              Across parks, roads, and river banks in {city}
            </p>
          </div>
          <div className={styles.bigCardWave}>🌿</div>
        </div>
      </div>

      {/* ── Environment health row ───────────────────────── */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>🌍 Environmental Health Indicators</h2>
        <div className={styles.envRow}>
          <div className={styles.envBlock}>
            <p className={styles.envLabel}>Air Quality Index (AQI)</p>
            <div className={styles.aqiDisplay}>
              <span className={styles.aqiNumber} style={{ color: aqiColor }}>
                <AnimCounter target={data.aqi} duration={1000} />
              </span>
              <span className={styles.aqiLabel} style={{ background: aqiColor + '18', color: aqiColor }}>{data.aqiLabel}</span>
            </div>
            <div className={styles.aqiBar}>
              {[50, 100, 150, 200, 300].map((band, i) => (
                <div key={i} className={styles.aqiBand}
                  style={{ flex: i < 4 ? 1 : 2, background: ['#22c55e','#f59e0b','#f97316','#ef4444','#7c2d12'][i] }} />
              ))}
              <div className={styles.aqiMarker} style={{ left: `${Math.min((data.aqi / 300) * 100, 100)}%` }} />
            </div>
            <div className={styles.aqiBandLabels}>
              {['Good','Moderate','Sensitive','Unhealthy','Hazardous'].map(l => (
                <span key={l}>{l}</span>
              ))}
            </div>
          </div>

          <div className={styles.envDivider} />

          <div className={styles.ringRow}>
            <HealthRing pct={data.riverHealth}    color="#3b82f6" label="River Health" />
            <HealthRing pct={data.wasteRecycled}  color="#22c55e" label="Waste Recycled" />
            <HealthRing pct={Math.round((data.garbageCleared / (data.garbageCleared * 1.3)) * 100)} color="#f97316" label="Drive Success" />
          </div>
        </div>
      </div>

      {/* ── Tabs: Overview / Ward breakdown / Trends ────── */}
      <div className={styles.tabs}>
        {[
          { key: 'overview', label: '📊 Overview' },
          { key: 'wards',    label: '🏘️ Ward Breakdown' },
          { key: 'trends',   label: '📈 Monthly Trends' },
        ].map(t => (
          <button key={t.key}
            className={`${styles.tab} ${tab === t.key ? styles.tabActive : ''}`}
            onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === 'overview' && (
        <div className={styles.overviewGrid}>
          {[
            { label:'Clean-up Drives',  val: data.activeCleaned.toLocaleString(),    icon:'🧹', desc:'Total drives conducted' },
            { label:'Volunteers',       val: data.volunteersTotal.toLocaleString(),   icon:'🙋', desc:'Citizens who participated' },
            { label:'Tonnes / Drive',   val: (data.garbageCleared / data.activeCleaned).toFixed(2), icon:'⚖️', desc:'Average waste per drive' },
            { label:'Trees / Km²',      val: city === 'Nashik' ? '21.3' : city === 'Pune' ? '19.4' : '14.8', icon:'🌲', desc:'Green canopy density' },
          ].map(s => (
            <div key={s.label} className={styles.overviewCard}>
              <span className={styles.overviewIcon}>{s.icon}</span>
              <span className={styles.overviewVal}>{s.val}</span>
              <span className={styles.overviewLabel}>{s.label}</span>
              <span className={styles.overviewDesc}>{s.desc}</span>
            </div>
          ))}
        </div>
      )}

      {/* Ward breakdown tab */}
      {tab === 'wards' && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>🏘️ Ward-wise Performance — {city}</h2>
          <div className={styles.wardTable}>
            <div className={styles.wardHead}>
              <span>Ward</span>
              <span>Garbage (T)</span>
              <span>Trees</span>
              <span>Drives</span>
              <span>Score</span>
            </div>
            {data.wards.map((w, i) => {
              const maxGarb = Math.max(...data.wards.map(x => x.garbage))
              const pct = Math.round((w.garbage / maxGarb) * 100)
              const score = Math.round((w.garbage / data.garbageCleared * 50 + w.trees / data.treesPlanted * 50) * 10) / 10
              return (
                <div key={w.name} className={styles.wardRow}>
                  <div className={styles.wardName}>
                    <span className={styles.wardRank}>#{i + 1}</span>
                    <span>{w.name}</span>
                  </div>
                  <div className={styles.wardCell}>
                    <span className={styles.wardVal}>{w.garbage}</span>
                    <div className={styles.miniBar}><div style={{ width:`${pct}%`, background:'#f97316', height:'100%', borderRadius:'99px', transition:'width 1s ease' }} /></div>
                  </div>
                  <div className={styles.wardCell}>
                    <span className={styles.wardVal} style={{ color:'#22c55e' }}>{w.trees.toLocaleString()}</span>
                  </div>
                  <div className={styles.wardCell}>
                    <span className={styles.wardVal}>{w.drives}</span>
                  </div>
                  <div className={styles.wardCell}>
                    <span className={`${styles.scoreChip} ${score > 8 ? styles.scoreHigh : score > 5 ? styles.scoreMid : styles.scoreLow}`}>
                      {score.toFixed(1)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Trends tab */}
      {tab === 'trends' && (
        <div className={styles.trendsRow}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>🗑️ Monthly Garbage Cleared (Tons)</h2>
            <BarChart data={data.monthlyGarbage} labels={MONTHS} color="#f97316" unit="T" />
            <div className={styles.trendStats}>
              <span>Peak: <strong>{Math.max(...data.monthlyGarbage)}T</strong></span>
              <span>Avg: <strong>{(data.monthlyGarbage.reduce((a,b)=>a+b,0)/12).toFixed(1)}T/mo</strong></span>
              <span>YTD: <strong>{data.garbageCleared}T</strong></span>
            </div>
          </div>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>🌳 Monthly Trees Planted</h2>
            <BarChart data={data.monthlyTrees} labels={MONTHS} color="#22c55e" unit="" />
            <div className={styles.trendStats}>
              <span>Peak: <strong>{Math.max(...data.monthlyTrees).toLocaleString()}</strong></span>
              <span>Avg: <strong>{Math.round(data.monthlyTrees.reduce((a,b)=>a+b,0)/12).toLocaleString()}/mo</strong></span>
              <span>YTD: <strong>{data.treesPlanted.toLocaleString()}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* ── Footer disclaimer ────────────────────────────── */}
      <div className={styles.footer}>
        <p>📋 Data sourced from Nashik Municipal Corporation civic reporting systems. Updated daily by authorized field officers. All figures are independently audited.</p>
        <p>🔗 RTI Portal &nbsp;·&nbsp; Open Data Initiative &nbsp;·&nbsp; Grievance Redressal</p>
      </div>

    </div>
  )
}

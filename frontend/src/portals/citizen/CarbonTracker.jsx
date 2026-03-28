import React, { useState, useEffect, useRef } from 'react'
import {
  CURRENT_USER, ECO_LEVELS, DAILY_LOG,
  FOOTPRINT_CATEGORIES, BADGES, TODAY_ACTIONS,
} from '../../shared/data/ecoData'
import styles from './CarbonTracker.module.css'

// ── SVG Icons ─────────────────────────────────────────────────
const IconFlame  = () => <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/></svg>
const IconLeaf   = () => <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
const IconBolt   = () => <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/></svg>
const IconCheck  = () => <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
const IconTrend  = () => <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"/></svg>
const IconInfo   = () => <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/></svg>
const IconStar   = () => <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>

// ── Animated count-up hook ────────────────────────────────────
function useCountUp(target, duration = 1400, delay = 0) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => {
      const start = performance.now()
      const tick = now => {
        const p = Math.min((now - start) / duration, 1)
        const ease = 1 - Math.pow(1 - p, 3)
        setVal(Math.round(ease * target))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, delay)
    return () => clearTimeout(t)
  }, [target, duration, delay])
  return val
}

// ── Mini bar chart (SVG) ──────────────────────────────────────
function BarChart({ data }) {
  const maxCO2   = Math.max(...data.map(d => d.co2kg))
  const maxPts   = Math.max(...data.map(d => d.points))
  const W = 420, H = 90, barW = 18, gap = (W - barW) / (data.length - 1)
  const [hovered, setHovered] = useState(null)

  return (
    <div className={styles.chartWrap}>
      <svg viewBox={`0 0 ${W} ${H + 30}`} className={styles.chartSvg} role="img" aria-label="14-day CO₂ chart">
        {data.map((d, i) => {
          const x    = i * gap
          const h    = (d.co2kg / maxCO2) * H
          const isToday = !!d.today
          const isHov = hovered === i
          return (
            <g key={d.day}
               onMouseEnter={() => setHovered(i)}
               onMouseLeave={() => setHovered(null)}
               style={{ cursor: 'pointer' }}>
              {/* Bar */}
              <rect
                x={x} y={H - h} width={barW} height={h}
                rx="4"
                fill={isToday ? '#1a6b3c' : isHov ? '#22924f' : '#d4ecd1'}
                style={{ transition: 'fill 0.15s' }}
              />
              {/* Day label */}
              <text
                x={x + barW / 2} y={H + 16}
                textAnchor="middle" fontSize="8" fill="#9aaa8e"
              >
                {d.day.slice(-2)}
              </text>
              {/* Tooltip */}
              {isHov && (
                <g>
                  <rect x={x - 16} y={H - h - 34} width={50} height={28} rx="5" fill="#1a1f16" opacity=".85"/>
                  <text x={x + 9} y={H - h - 19} textAnchor="middle" fontSize="9" fill="#fff" fontWeight="700">{d.co2kg} kg</text>
                  <text x={x + 9} y={H - h - 9}  textAnchor="middle" fontSize="8" fill="#86efac">+{d.points} pts</text>
                </g>
              )}
            </g>
          )
        })}
        {/* Today line */}
        <line x1={(data.length-1)*gap + barW/2} y1="0" x2={(data.length-1)*gap + barW/2} y2={H}
          stroke="#1a6b3c" strokeWidth="1.5" strokeDasharray="3 3" opacity=".5"/>
      </svg>
      <div className={styles.chartLegend}>
        <span><span className={styles.legendDot} style={{ background: '#1a6b3c' }}/> Today</span>
        <span><span className={styles.legendDot} style={{ background: '#d4ecd1' }}/> Past days</span>
        <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--color-text-subtle)' }}>Hover bars for detail</span>
      </div>
    </div>
  )
}

// ── Ring progress (SVG) ───────────────────────────────────────
function RingProgress({ pct, size = 100, stroke = 9, color = '#1a6b3c', children }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <div className={styles.ring} style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#eef1eb" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div className={styles.ringInner}>{children}</div>
    </div>
  )
}

// ── Streak flame widget ───────────────────────────────────────
function StreakWidget({ streak, longest }) {
  const count = useCountUp(streak, 900)
  return (
    <div className={styles.streakCard}>
      <div className={styles.streakFlames}>
        {Array.from({ length: Math.min(streak, 7) }).map((_, i) => (
          <span key={i} className={styles.flame}
            style={{ animationDelay: `${i * 0.08}s`, fontSize: `${0.85 + i * 0.04}rem` }}>
            🔥
          </span>
        ))}
      </div>
      <div className={styles.streakNum}>{count}</div>
      <div className={styles.streakLabel}>Day Streak</div>
      <div className={styles.streakSub}>Best: {longest} days</div>
    </div>
  )
}

// ── Eco Points widget ─────────────────────────────────────────
function EcoPointsWidget({ points }) {
  const count = useCountUp(points, 1600, 200)
  return (
    <div className={styles.pointsCard}>
      <div className={styles.pointsGlow} aria-hidden />
      <div className={styles.pointsIcon}><IconBolt /></div>
      <div className={styles.pointsNum}>{count.toLocaleString()}</div>
      <div className={styles.pointsLabel}>Eco Points</div>
      <div className={styles.pointsSub}>+400 today</div>
    </div>
  )
}

// ── Eco Level progress bar ────────────────────────────────────
function LevelBar({ user }) {
  const levelData = ECO_LEVELS.find(l => l.level === user.level) ?? ECO_LEVELS[3]
  const nextLevel = ECO_LEVELS.find(l => l.level === user.level + 1)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 400)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={styles.levelCard}>
      <div className={styles.levelHeader}>
        <div className={styles.levelBadge} style={{ background: levelData.color + '20', borderColor: levelData.color + '50' }}>
          <span className={styles.levelNum}>Lv.{user.level}</span>
          <span className={styles.levelTitle} style={{ color: levelData.color }}>{levelData.title}</span>
        </div>
        {nextLevel && (
          <span className={styles.levelNext}>
            Next: <strong style={{ color: nextLevel.color }}>{nextLevel.title}</strong>
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className={styles.levelBarWrap}>
        <div className={styles.levelBarTrack}>
          <div
            className={styles.levelBarFill}
            style={{
              width: animated ? `${user.levelXP}%` : '0%',
              background: `linear-gradient(90deg, ${levelData.color}, ${nextLevel?.color ?? levelData.color})`,
            }}
          />
          {/* Milestone ticks */}
          {[25, 50, 75].map(m => (
            <div key={m} className={styles.levelTick} style={{ left: `${m}%` }} />
          ))}
        </div>
        <div className={styles.levelBarMeta}>
          <span>{user.levelXP}%</span>
          <span>{((1 - user.levelXP / 100) * (nextLevel ? nextLevel.min - levelData.min : 1000)).toFixed(0)} pts to next level</span>
        </div>
      </div>

      {/* XP stats row */}
      <div className={styles.xpStats}>
        {[
          { icon: '🧹', label: 'Cleanups',    val: user.cleanups    },
          { icon: '🌱', label: 'Plantations', val: user.plantations },
          { icon: '📍', label: 'Reports',     val: user.reports     },
          { icon: '🤝', label: 'Donations',   val: user.donations   },
        ].map(s => (
          <div key={s.label} className={styles.xpStat}>
            <span className={styles.xpStatIcon}>{s.icon}</span>
            <span className={styles.xpStatVal}>{s.val}</span>
            <span className={styles.xpStatLabel}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Today's CO₂ breakdown ─────────────────────────────────────
function CO2Breakdown() {
  const total = FOOTPRINT_CATEGORIES.reduce((s, c) => s + c.kg, 0)
  const avgTotal = FOOTPRINT_CATEGORIES.reduce((s, c) => s + c.avg, 0)
  const saved = (avgTotal - total).toFixed(1)
  const [tip, setTip] = useState(null)

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}><IconLeaf /> Today's Carbon Footprint</h3>
        <div className={styles.co2Total}>{total.toFixed(1)} kg CO₂</div>
      </div>
      {saved > 0 && (
        <div className={styles.savedBanner}>
          <IconTrend /> You saved <strong>{saved} kg CO₂</strong> vs city average today!
        </div>
      )}
      <div className={styles.categories}>
        {FOOTPRINT_CATEGORIES.map(cat => {
          const pct = Math.round((cat.kg / (cat.avg * 1.5)) * 100)
          const vs  = cat.kg < cat.avg ? 'below' : 'above'
          return (
            <div key={cat.id} className={styles.catRow}>
              <div className={styles.catLeft}>
                <span className={styles.catEmoji}>{cat.emoji}</span>
                <div>
                  <p className={styles.catLabel}>{cat.label}</p>
                  <p className={styles.catVs} style={{ color: cat.kg < cat.avg ? '#16a34a' : '#dc2626' }}>
                    {cat.kg} kg · {vs} avg
                  </p>
                </div>
              </div>
              <div className={styles.catRight}>
                <div className={styles.catBarTrack}>
                  <div className={styles.catBarFill}
                    style={{ width: `${pct}%`, background: cat.color }} />
                  <div className={styles.catAvgLine}
                    style={{ left: `${Math.round((cat.avg / (cat.avg * 1.5)) * 100)}%` }} />
                </div>
                <button className={styles.tipBtn} onClick={() => setTip(tip === cat.id ? null : cat.id)}>
                  <IconInfo />
                </button>
              </div>
              {tip === cat.id && (
                <div className={styles.tipBox}>💡 {cat.tip}</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Daily action checklist ────────────────────────────────────
function ActionChecklist() {
  const [actions, setActions] = useState(TODAY_ACTIONS)
  const done    = actions.filter(a => a.done).length
  const ptsEarned = actions.filter(a => a.done).reduce((s, a) => s + a.points, 0)
  const ptsTotal  = actions.reduce((s, a) => s + a.points, 0)

  function toggle(id) {
    setActions(prev => prev.map(a => a.id === id ? { ...a, done: !a.done } : a))
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}><IconBolt /> Today's Eco Actions</h3>
        <span className={styles.actionScore}>{ptsEarned}/{ptsTotal} pts</span>
      </div>
      {/* Mini progress */}
      <div className={styles.actionProgress}>
        <div className={styles.actionProgressFill} style={{ width: `${(done / actions.length) * 100}%` }} />
      </div>
      <p className={styles.actionMeta}>{done} of {actions.length} completed</p>
      <ul className={styles.actionList}>
        {actions.map(a => (
          <li key={a.id}
            className={`${styles.actionItem} ${a.done ? styles.actionDone : ''}`}
            onClick={() => toggle(a.id)}
            role="checkbox" aria-checked={a.done} tabIndex={0}
            onKeyDown={e => e.key === ' ' && toggle(a.id)}>
            <span className={styles.actionEmoji}>{a.emoji}</span>
            <span className={styles.actionLabel}>{a.label}</span>
            <span className={styles.actionPts}>+{a.points}</span>
            <span className={styles.actionCheck}>{a.done && <IconCheck />}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ── Badges shelf ──────────────────────────────────────────────
function BadgesShelf({ earnedIds }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}><IconStar /> Your Badges</h3>
      <div className={styles.badgeGrid}>
        {BADGES.map(b => {
          const earned = earnedIds.includes(b.id)
          return (
            <div key={b.id} title={b.desc}
              className={`${styles.badge} ${earned ? styles.badgeEarned : styles.badgeLocked}`}>
              <span className={styles.badgeEmoji}>{b.emoji}</span>
              <span className={styles.badgeLabel}>{b.label}</span>
              {b.locked && <span className={styles.badgeLockIcon}>🔒</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── 14-day chart wrapper ──────────────────────────────────────
function ChartSection() {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>📅 14-Day CO₂ Trend</h3>
        <span className={styles.chartBadge}>↓ 12% vs last week</span>
      </div>
      <BarChart data={DAILY_LOG} />
    </div>
  )
}

// ── Main component ────────────────────────────────────────────
export default function CarbonTracker() {
  const u = CURRENT_USER
  const todayCO2 = FOOTPRINT_CATEGORIES.reduce((s, c) => s + c.kg, 0)

  return (
    <div className={styles.page}>

      {/* ── Header ──────────────────────────────────────── */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>🌍</div>
          <div>
            <h1 className={styles.pageTitle}>Carbon Footprint Tracker</h1>
            <p className={styles.pageDesc}>Track your daily impact, earn Eco Points, and level up.</p>
          </div>
        </div>
        <div className={styles.headerDate}>
          <span>📅</span> Today · 23 Mar 2026
        </div>
      </div>

      {/* ── Hero stats row ───────────────────────────────── */}
      <div className={styles.heroRow}>
        <StreakWidget streak={u.streak} longest={u.longestStreak} />
        <EcoPointsWidget points={u.ecoPoints} />

        {/* CO₂ ring */}
        <div className={styles.co2Ring}>
          <RingProgress pct={Math.round((todayCO2 / 10) * 100)} size={110} stroke={10} color="#ef4444">
            <span className={styles.ringVal}>{todayCO2.toFixed(1)}</span>
            <span className={styles.ringUnit}>kg CO₂</span>
          </RingProgress>
          <div className={styles.co2RingMeta}>
            <p className={styles.co2RingTitle}>Today's Emissions</p>
            <p className={styles.co2RingHint}>City avg: 4.9 kg/day</p>
            <p className={styles.co2RingGood} style={{ color: todayCO2 < 4.9 ? '#16a34a' : '#dc2626' }}>
              {todayCO2 < 4.9 ? `↓ ${(4.9 - todayCO2).toFixed(1)} kg below avg` : `↑ above avg`}
            </p>
          </div>
        </div>

        {/* Rank card */}
        <div className={styles.rankCard}>
          <div className={styles.rankIcon}>🏅</div>
          <div className={styles.rankNum}>#7</div>
          <div className={styles.rankLabel}>City Rank</div>
          <div className={styles.rankSub}>Top 10%</div>
        </div>
      </div>

      {/* ── Eco Level bar ────────────────────────────────── */}
      <LevelBar user={u} />

      {/* ── Main grid ────────────────────────────────────── */}
      <div className={styles.mainGrid}>
        <div className={styles.leftGrid}>
          <CO2Breakdown />
          <ChartSection />
        </div>
        <div className={styles.rightGrid}>
          <ActionChecklist />
          <BadgesShelf earnedIds={u.badges} />
        </div>
      </div>

    </div>
  )
}

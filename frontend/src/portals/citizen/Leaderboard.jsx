import React, { useState, useMemo } from 'react'
import { LEADERBOARD_USERS as LEADERBOARD, ECO_LEVELS } from '../../shared/data/ecoData'
import styles from './Leaderboard.module.css'

const IconFlame  = () => <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/></svg>
const IconUp     = () => <svg viewBox="0 0 20 20" fill="currentColor" width="10" height="10"><path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>
const IconDown   = () => <svg viewBox="0 0 20 20" fill="currentColor" width="10" height="10"><path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
const IconSearch = () => <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/></svg>

const SORT_MODES = [
  { key: 'ecoPoints',   label: 'Eco Points',  colLabel: 'Eco Pts'  },
  { key: 'plantations', label: 'Plantation',  colLabel: 'Trees'    },
  { key: 'cleanups',    label: 'Cleanup',     colLabel: 'Cleanups' },
  { key: 'streak',      label: 'Streak',      colLabel: 'Streak'   },
]

function Podium({ top3, sortKey }) {
  const order   = [1, 0, 2]
  const heights = [78, 110, 62]
  const metals  = ['#c0c0c0', '#f0a500', '#cd7f32']
  const labels  = ['2nd', '1st', '3rd']
  const sizes   = [58, 72, 50]

  return (
    <div className={styles.podiumWrap}>
      {order.map((idx, pos) => {
        const h = top3[idx]
        if (!h) return null
        return (
          <div key={h.id} className={styles.podiumCol}>
            <div className={styles.podiumAvatarArea}>
              {h.badge && <span className={styles.podiumBadge}>{h.badge}</span>}
              <div className={styles.podiumAvatar}
                style={{ background: h.avatarColor, width: sizes[pos], height: sizes[pos],
                  fontSize: pos === 1 ? '1.5rem' : '1.1rem',
                  boxShadow: `0 0 0 3px ${metals[pos]}55, 0 6px 20px ${metals[pos]}35` }}>
                {h.avatar}
              </div>
            </div>
            <p className={styles.podiumName}>{h.name.split(' ')[0]}</p>
            <p className={styles.podiumCity}>{h.city}</p>
            <p className={styles.podiumScore} style={{ color: metals[pos] }}>
              {sortKey === 'ecoPoints' ? h[sortKey].toLocaleString() : h[sortKey]}
              <span className={styles.podiumUnit}>{sortKey === 'ecoPoints' ? ' pts' : sortKey === 'streak' ? 'd' : ''}</span>
            </p>
            <div className={styles.podiumPlatform}
              style={{ height: heights[pos], borderColor: metals[pos] + '55',
                background: `linear-gradient(180deg,${metals[pos]}25,transparent)` }}>
              <span style={{ color: metals[pos] }} className={styles.podiumRank}>{labels[pos]}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function HeroBar({ value, max, color }) {
  const pct = Math.min(Math.round((value / max) * 100), 100)
  return (
    <div className={styles.heroBarTrack}>
      <div className={styles.heroBarFill} style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

function HeroRow({ hero, rank, sortKey, maxVal, isExpanded, onToggle }) {
  const lvl    = ECO_LEVELS.find(l => l.level === hero.level) || ECO_LEVELS[0]
  const medals = { 1: '🥇', 2: '🥈', 3: '🥉' }
  return (
    <>
      <tr className={[styles.heroRow, hero.isMe ? styles.meRow : '', rank <= 3 ? styles.topRow : ''].join(' ')}
        onClick={onToggle} role="button" tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && onToggle()}>
        <td className={styles.rankCell}>
          {medals[rank] ? <span className={styles.medal}>{medals[rank]}</span>
            : <span className={[styles.rankNum, hero.isMe ? styles.rankMe : ''].join(' ')}>{rank}</span>}
        </td>
        <td className={styles.heroCell}>
          <div className={styles.heroAvatar} style={{ background: hero.avatarColor }}>{hero.avatar}</div>
          <div className={styles.heroInfo}>
            <span className={styles.heroName}>{hero.name}{hero.isMe && <span className={styles.meTag}>You</span>}</span>
            <span className={styles.heroCity}>{hero.city}</span>
          </div>
        </td>
        <td className={styles.levelCell}>
          <span className={styles.levelPill}
            style={{ background: lvl.color + '20', color: lvl.color, borderColor: lvl.color + '40' }}>
            Lv.{hero.level}
          </span>
        </td>
        <td className={styles.metricCell}>
          <span className={styles.metricVal}>{hero[sortKey].toLocaleString()}</span>
          <HeroBar value={hero[sortKey]} max={maxVal} color={lvl.color} />
        </td>
        <td className={styles.streakCell}>
          <span className={styles.streakBadge}><IconFlame />{hero.streak}d</span>
        </td>
        <td className={styles.changeCell}>
          <span className={[styles.change, hero.weeklyChange >= 0 ? styles.up : styles.down].join(' ')}>
            {hero.weeklyChange >= 0 ? <IconUp /> : <IconDown />}{Math.abs(hero.weeklyChange)}
          </span>
        </td>
      </tr>
      {isExpanded && (
        <tr className={styles.expandedTr}><td colSpan={6}>
          <div className={styles.expandedGrid}>
            {[{i:'🌱',v:hero.plantations,l:'Trees Planted'},{i:'🧹',v:hero.cleanups,l:'Cleanups'},
              {i:'⚡',v:hero.ecoPoints.toLocaleString(),l:'Eco Points'},{i:'🔥',v:hero.streak+'d',l:'Streak'}
            ].map(s => (
              <div key={s.l} className={styles.expandedStat}>
                <span className={styles.expandedIcon}>{s.i}</span>
                <span className={styles.expandedVal}>{s.v}</span>
                <span className={styles.expandedLabel}>{s.l}</span>
              </div>
            ))}
          </div>
        </td></tr>
      )}
    </>
  )
}

export default function Leaderboard() {
  const [sortKey,    setSortKey]    = useState('ecoPoints')
  const [search,     setSearch]     = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [showAll,    setShowAll]    = useState(false)

  const sorted = useMemo(() => {
    let list = [...LEADERBOARD]
    if (search.trim())
      list = list.filter(h =>
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.city.toLowerCase().includes(search.toLowerCase()))
    list.sort((a, b) => b[sortKey] - a[sortKey])
    return list.map((h, i) => ({ ...h, rank: i + 1 }))
  }, [sortKey, search])

  const top3    = sorted.slice(0, 3)
  const rest    = sorted.slice(3)
  const view    = showAll ? rest : rest.slice(0, 5)
  const maxVal  = sorted[0]?.[sortKey] || 1
  const myRank  = sorted.find(h => h.isMe)?.rank
  const colMeta = SORT_MODES.find(s => s.key === sortKey)

  const totals = {
    plants:   LEADERBOARD.reduce((s,h) => s + h.plantations, 0),
    cleanups: LEADERBOARD.reduce((s,h) => s + h.cleanups, 0),
    points:   LEADERBOARD.reduce((s,h) => s + h.ecoPoints, 0),
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>🏆</div>
          <div>
            <h1 className={styles.pageTitle}>CivicHero Leaderboard</h1>
            <p className={styles.pageDesc}>Top contributors making Nashik cleaner and greener.</p>
          </div>
        </div>
        {myRank && (
          <div className={styles.myRankPill}>
            <span className={styles.myRankLabel}>Your Rank</span>
            <strong className={styles.myRankNum}>#{myRank}</strong>
          </div>
        )}
      </div>

      <div className={styles.sortTabs}>
        {SORT_MODES.map(m => (
          <button key={m.key} onClick={() => setSortKey(m.key)}
            className={[styles.sortTab, sortKey === m.key ? styles.sortTabActive : ''].join(' ')}>
            {m.label === 'Eco Points' ? '⚡ ' : m.label === 'Plantation' ? '🌱 ' : m.label === 'Cleanup' ? '🧹 ' : '🔥 '}
            {m.label}
          </button>
        ))}
      </div>

      <Podium top3={top3} sortKey={sortKey} />

      <div className={styles.searchBar}>
        <IconSearch />
        <input className={styles.searchInput} type="search"
          placeholder="Search heroes by name or city…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.theadRow}>
              <th className={styles.th}>#</th>
              <th className={styles.th}>Hero</th>
              <th className={styles.th}>Level</th>
              <th className={styles.th}>{colMeta?.colLabel}</th>
              <th className={styles.th}>Streak</th>
              <th className={styles.th}>±Week</th>
            </tr>
          </thead>
          <tbody>
            {view.map(hero => (
              <HeroRow key={hero.id} hero={hero} rank={hero.rank} sortKey={sortKey}
                maxVal={maxVal} isExpanded={expandedId === hero.id}
                onToggle={() => setExpandedId(expandedId === hero.id ? null : hero.id)} />
            ))}
          </tbody>
        </table>
        {rest.length > 5 && (
          <button className={styles.showMoreBtn} onClick={() => setShowAll(v => !v)}>
            {showAll ? 'Show Less ↑' : `Show All ${rest.length} Heroes ↓`}
          </button>
        )}
      </div>

      <div className={styles.insightBar}>
        {[
          { emoji: '🌱', val: totals.plants,             label: 'trees planted' },
          { emoji: '🧹', val: totals.cleanups,           label: 'cleanup drives' },
          { emoji: '⚡', val: totals.points.toLocaleString(), label: 'Eco Points earned' },
        ].map(i => (
          <div key={i.label} className={styles.insightItem}>
            <span className={styles.insightEmoji}>{i.emoji}</span>
            <span className={styles.insightVal}>{i.val}</span>
            <span className={styles.insightLabel}>{i.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

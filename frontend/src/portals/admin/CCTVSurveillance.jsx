import React, { useState, useEffect, useRef, useCallback } from 'react'
import styles from './CCTVSurveillance.module.css'

// ── Camera locations ─────────────────────────────────────────
const CAMERAS = [
  { id: 'CAM-001', name: 'Nashik Road Junction',      area: 'Ward 1',  zone: 'HIGH RISK', status: 'live',     threat: 0.12 },
  { id: 'CAM-002', name: 'Panchavati Ghat Entry',     area: 'Ward 2',  zone: 'MODERATE',  status: 'live',     threat: 0.08 },
  { id: 'CAM-003', name: 'CBS Bus Stand – Gate 3',    area: 'Ward 1',  zone: 'HIGH RISK', status: 'alert',    threat: 0.91 },
  { id: 'CAM-004', name: 'Cidco N-4 Market Road',     area: 'Ward 3',  zone: 'MODERATE',  status: 'live',     threat: 0.35 },
  { id: 'CAM-005', name: 'Satpur MIDC Back Gate',     area: 'Ward 4',  zone: 'LOW',       status: 'live',     threat: 0.05 },
  { id: 'CAM-006', name: 'Trimbak Road Near Temple',  area: 'Ward 5',  zone: 'MODERATE',  status: 'offline',  threat: 0.00 },
  { id: 'CAM-007', name: 'Old Agra Road Naka',        area: 'Ward 2',  zone: 'HIGH RISK', status: 'live',     threat: 0.48 },
  { id: 'CAM-008', name: 'Sharanpur Corner',          area: 'Ward 3',  zone: 'LOW',       status: 'live',     threat: 0.07 },
  { id: 'CAM-009', name: 'Gangapur Dam Parking',      area: 'Ward 6',  zone: 'LOW',       status: 'live',     threat: 0.03 },
]

// ── User ID pool ─────────────────────────────────────────────
const USER_POOL = [
  'USR-4821', 'USR-9034', 'USR-3317', 'USR-7756', 'USR-2289',
  'USR-6645', 'USR-1102', 'USR-8823', 'USR-5501', 'USR-4477',
]

const FINE_AMOUNTS = [500, 1000, 1500, 2000, 2500]

const DETECTION_LABELS = [
  'Garbage bag thrown on road',
  'Littering near dustbin',
  'Open burning of waste',
  'Construction debris dumping',
  'Household waste illegally dumped',
  'Bio-medical waste disposal violation',
  'Night-time illegal dumping detected',
]

// ── Generate a random alert ──────────────────────────────────
function generateAlert(overrideCamera = null) {
  const alertCams = CAMERAS.filter(c => c.status !== 'offline')
  const cam = overrideCamera ?? alertCams[Math.floor(Math.random() * alertCams.length)]
  return {
    id: `ALT-${Math.floor(Math.random() * 90000 + 10000)}`,
    cameraId:   cam.id,
    cameraName: cam.name,
    area:       cam.area,
    userId:     USER_POOL[Math.floor(Math.random() * USER_POOL.length)],
    fine:       FINE_AMOUNTS[Math.floor(Math.random() * FINE_AMOUNTS.length)],
    label:      DETECTION_LABELS[Math.floor(Math.random() * DETECTION_LABELS.length)],
    confidence: Math.floor(Math.random() * 20 + 78),   // 78–98%
    timestamp:  new Date(),
    status:     'new',   // new | acknowledged | fined
  }
}

// ── Time formatter ───────────────────────────────────────────
function timeAgo(date) {
  const s = Math.floor((Date.now() - date) / 1000)
  if (s < 60)  return `${s}s ago`
  if (s < 3600) return `${Math.floor(s/60)}m ago`
  return `${Math.floor(s/3600)}h ago`
}

// ── Scan-line animated video placeholder ─────────────────────
function FeedTile({ cam, isSelected, onClick, hasNewAlert }) {
  const canvasRef = useRef(null)
  const frameRef  = useRef(null)
  const noiseRef  = useRef(0)

  // Animated noise canvas – gives a "static" live-feed look
  useEffect(() => {
    if (cam.status === 'offline') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let tick = 0

    function draw() {
      const { width: w, height: h } = canvas
      ctx.clearRect(0, 0, w, h)

      // base dark bg
      ctx.fillStyle = cam.status === 'alert' ? '#1a0505' : '#050d12'
      ctx.fillRect(0, 0, w, h)

      // grid lines
      ctx.strokeStyle = cam.status === 'alert' ? 'rgba(220,38,38,.07)' : 'rgba(59,130,246,.06)'
      ctx.lineWidth = 1
      for (let x = 0; x < w; x += 20) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke() }
      for (let y = 0; y < h; y += 20) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke() }

      // random noise specks
      for (let i = 0; i < 18; i++) {
        const nx = Math.random() * w, ny = Math.random() * h
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.06})`
        ctx.fillRect(nx, ny, 1.5, 1.5)
      }

      // moving scan-line
      const scanY = (tick * 1.2) % h
      const grad = ctx.createLinearGradient(0, scanY - 10, 0, scanY + 10)
      grad.addColorStop(0, 'transparent')
      grad.addColorStop(0.5, cam.status === 'alert' ? 'rgba(220,38,38,.18)' : 'rgba(59,130,246,.12)')
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.fillRect(0, scanY - 10, w, 20)

      // alert pulse overlay
      if (cam.status === 'alert') {
        const alpha = (Math.sin(tick * 0.08) + 1) / 2 * 0.12
        ctx.fillStyle = `rgba(220,38,38,${alpha})`
        ctx.fillRect(0, 0, w, h)
      }

      // mock silhouette shapes
      ctx.fillStyle = cam.status === 'alert' ? 'rgba(200,30,30,.25)' : 'rgba(59,130,246,.15)'
      ctx.fillRect(w * 0.1, h * 0.55, 14, 28)
      ctx.fillRect(w * 0.55, h * 0.6, 18, 24)
      ctx.fillRect(w * 0.35, h * 0.5, 40, 8)

      tick++
      frameRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(frameRef.current)
  }, [cam.status])

  const zoneColor = { 'HIGH RISK': '#ef4444', 'MODERATE': '#f59e0b', 'LOW': '#22c55e' }[cam.zone]

  return (
    <div
      className={`${styles.tile} ${isSelected ? styles.tileSelected : ''} ${cam.status === 'alert' ? styles.tileAlert : ''} ${cam.status === 'offline' ? styles.tileOffline : ''}`}
      onClick={() => cam.status !== 'offline' && onClick(cam)}
    >
      {/* Canvas feed */}
      {cam.status !== 'offline' ? (
        <canvas ref={canvasRef} className={styles.tileCanvas} width={320} height={180} />
      ) : (
        <div className={styles.offlineSlate}>
          <span className={styles.offlineIcon}>📵</span>
          <span>Camera Offline</span>
        </div>
      )}

      {/* Overlay HUD */}
      <div className={styles.tileHud}>
        <div className={styles.tileTopRow}>
          <span className={styles.camId}>{cam.id}</span>
          <span className={`${styles.statusPill} ${styles['status_' + cam.status]}`}>
            {cam.status === 'live'    && <><span className={styles.statusDot} />LIVE</>}
            {cam.status === 'alert'   && <>⚠ ALERT</>}
            {cam.status === 'offline' && <>OFFLINE</>}
          </span>
        </div>

        {hasNewAlert && (
          <div className={styles.detectionBanner}>
            <span className={styles.detectionIcon}>🤖</span> AI Detection Active
          </div>
        )}

        <div className={styles.tileBottomRow}>
          <div>
            <p className={styles.camName}>{cam.name}</p>
            <p className={styles.camArea}>{cam.area}</p>
          </div>
          <span className={styles.zonePill} style={{ color: zoneColor, borderColor: zoneColor + '44', background: zoneColor + '14' }}>
            {cam.zone}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Alert row in sidebar ─────────────────────────────────────
function AlertRow({ alert, onAck, onFine, isNew }) {
  const [timeStr, setTimeStr] = useState(timeAgo(alert.timestamp))

  useEffect(() => {
    const t = setInterval(() => setTimeStr(timeAgo(alert.timestamp)), 10000)
    return () => clearInterval(t)
  }, [alert.timestamp])

  return (
    <div className={`${styles.alertRow} ${isNew ? styles.alertNew : ''} ${alert.status === 'acknowledged' ? styles.alertAck : ''}`}>
      <div className={styles.alertHeader}>
        <span className={styles.alertId}>{alert.id}</span>
        <span className={styles.alertTime}>{timeStr}</span>
      </div>

      <p className={styles.alertLabel}>{alert.label}</p>

      <div className={styles.alertMeta}>
        <span className={styles.alertCam}>📷 {alert.cameraId}</span>
        <span className={styles.alertConf}>🎯 {alert.confidence}% conf.</span>
      </div>

      <div className={styles.alertFineLine}>
        <div className={styles.alertUser}>
          <span className={styles.alertUserLabel}>User ID</span>
          <span className={styles.alertUserId}>{alert.userId}</span>
        </div>
        <div className={styles.alertFineBlock}>
          <span className={styles.alertFineLabel}>Fine</span>
          <span className={`${styles.alertFineAmt} ${alert.status === 'fined' ? styles.fineIssued : ''}`}>
            ₹{alert.fine.toLocaleString()}
          </span>
        </div>
      </div>

      {alert.status === 'new' && (
        <div className={styles.alertActions}>
          <button className={styles.ackBtn} onClick={() => onAck(alert.id)}>Acknowledge</button>
          <button className={styles.fineBtn} onClick={() => onFine(alert.id)}>Issue Fine</button>
        </div>
      )}
      {alert.status === 'acknowledged' && (
        <div className={styles.alertActions}>
          <span className={styles.ackLabel}>✓ Acknowledged</span>
          <button className={styles.fineBtn} onClick={() => onFine(alert.id)}>Issue Fine</button>
        </div>
      )}
      {alert.status === 'fined' && (
        <div className={styles.finedBadge}>✅ Fine Issued · ₹{alert.fine.toLocaleString()}</div>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────
export default function CCTVSurveillance() {
  const [cameras, setCameras]     = useState(CAMERAS)
  const [selected, setSelected]   = useState(CAMERAS[2])   // start on alert cam
  const [alerts, setAlerts]       = useState(() => [generateAlert(CAMERAS[2])])
  const [newIds, setNewIds]       = useState(new Set())
  const [layout, setLayout]       = useState('grid')        // grid | wide
  const [totalFines, setTotalFines] = useState(0)
  const [fineCount, setFineCount]   = useState(0)

  // ── Simulate new detections every 8–14s ─────────────────
  useEffect(() => {
    function scheduleNext() {
      const delay = 8000 + Math.random() * 6000
      return setTimeout(() => {
        const alert = generateAlert()
        setAlerts(prev => [alert, ...prev].slice(0, 30))
        setNewIds(prev => new Set([...prev, alert.id]))

        // Trigger camera flash on the relevant camera
        setCameras(prev => prev.map(c =>
          c.id === alert.cameraId ? { ...c, status: 'alert' } : c
        ))

        // Revert camera after 5s
        setTimeout(() => {
          setCameras(prev => prev.map(c =>
            c.id === alert.cameraId && c.status === 'alert' ? { ...c, status: 'live' } : c
          ))
        }, 5000)

        // Remove "new" highlight after 6s
        setTimeout(() => setNewIds(prev => { const s = new Set(prev); s.delete(alert.id); return s }), 6000)

        timerRef.current = scheduleNext()
      }, delay)
    }
    const timerRef = { current: scheduleNext() }
    return () => clearTimeout(timerRef.current)
  }, [])

  const ack  = id => setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'acknowledged' } : a))
  const fine = id => {
    setAlerts(prev => prev.map(a => {
      if (a.id !== id || a.status === 'fined') return a
      setTotalFines(t => t + a.fine)
      setFineCount(c => c + 1)
      return { ...a, status: 'fined' }
    }))
  }

  const liveCount    = cameras.filter(c => c.status === 'live').length
  const alertCount   = cameras.filter(c => c.status === 'alert').length
  const offlineCount = cameras.filter(c => c.status === 'offline').length
  const newAlertCams = new Set(alerts.filter(a => newIds.has(a.id)).map(a => a.cameraId))

  return (
    <div className={styles.page}>

      {/* ── Page header ──────────────────────────────── */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.headerIcon}>📡</span>
          <div>
            <h1 className={styles.pageTitle}>CCTV Surveillance</h1>
            <p className={styles.pageDesc}>Nashik Smart City · AI-Powered Littering Detection</p>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.statPill} style={{ background:'rgba(34,197,94,.12)', color:'#22c55e', borderColor:'rgba(34,197,94,.25)' }}>
            <span className={styles.statDot} style={{ background:'#22c55e' }} />
            {liveCount} Live
          </div>
          {alertCount > 0 && (
            <div className={styles.statPill} style={{ background:'rgba(239,68,68,.12)', color:'#ef4444', borderColor:'rgba(239,68,68,.25)' }}>
              <span className={styles.statDot} style={{ background:'#ef4444' }} />
              {alertCount} Alert{alertCount > 1 ? 's' : ''}
            </div>
          )}
          <div className={styles.statPill} style={{ background:'rgba(100,116,139,.08)', color:'#94a3b8', borderColor:'rgba(100,116,139,.2)' }}>
            {offlineCount} Offline
          </div>
          <div className={styles.layoutToggle}>
            {['grid', 'wide'].map(l => (
              <button key={l} className={`${styles.layoutBtn} ${layout === l ? styles.layoutBtnActive : ''}`}
                onClick={() => setLayout(l)}>
                {l === 'grid' ? '⊞' : '⊟'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body: feeds + sidebar ─────────────────────── */}
      <div className={styles.body}>

        {/* Camera feed area */}
        <div className={styles.feedArea}>

          {/* Main selected feed */}
          {selected && (
            <div className={styles.mainFeedWrap}>
              <FeedTile cam={selected} isSelected={false} onClick={() => {}} hasNewAlert={newAlertCams.has(selected.id)} />
              <div className={styles.mainFeedLabel}>
                <span>🔍 Focused View — {selected.name}</span>
                {selected.status === 'alert' && <span className={styles.alertBlink}>⚠ LITTERING DETECTED</span>}
              </div>
            </div>
          )}

          {/* Grid of thumbnails */}
          <div className={`${styles.feedGrid} ${layout === 'wide' ? styles.feedGridWide : ''}`}>
            {cameras.map(cam => (
              <FeedTile
                key={cam.id}
                cam={cam}
                isSelected={selected?.id === cam.id}
                onClick={setSelected}
                hasNewAlert={newAlertCams.has(cam.id)}
              />
            ))}
          </div>
        </div>

        {/* Sidebar: detection log */}
        <aside className={styles.sidebar}>

          {/* Fine summary */}
          <div className={styles.fineSummary}>
            <div className={styles.fineSumRow}>
              <div>
                <p className={styles.fineSumLabel}>Total Fines Issued</p>
                <p className={styles.fineSumVal}>₹{totalFines.toLocaleString()}</p>
              </div>
              <div>
                <p className={styles.fineSumLabel}>Cases Today</p>
                <p className={styles.fineSumVal}>{fineCount + 1}</p>
              </div>
            </div>
          </div>

          {/* Alert log header */}
          <div className={styles.logHeader}>
            <div className={styles.logTitle}>
              <span className={styles.aiChip}>🤖 AI</span>
              Littering Detection Log
            </div>
            <span className={styles.logCount}>{alerts.length} events</span>
          </div>

          {/* Scrollable alert list */}
          <div className={styles.alertList}>
            {alerts.map(alert => (
              <AlertRow
                key={alert.id}
                alert={alert}
                onAck={ack}
                onFine={fine}
                isNew={newIds.has(alert.id)}
              />
            ))}
          </div>
        </aside>

      </div>
    </div>
  )
}

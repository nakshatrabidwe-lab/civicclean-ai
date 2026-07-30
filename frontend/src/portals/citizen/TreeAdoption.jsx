import React, { useState, useEffect } from 'react'
import styles from './TreeAdoption.module.css'

const TREE_SPECIES = [
  { id: 'neem',     name: 'Neem',      emoji: '🌳', benefit: 'Air purifier · Medicinal', zone: 'Nashik Road',   co2: 21, water: 'Low',    difficulty: 'Easy',   color: '#16a34a' },
  { id: 'peepal',   name: 'Peepal',    emoji: '🌲', benefit: 'Sacred · O₂ at night',    zone: 'Panchavati',    co2: 28, water: 'Low',    difficulty: 'Easy',   color: '#15803d' },
  { id: 'mango',    name: 'Mango',     emoji: '🥭', benefit: 'Fruit · Dense canopy',    zone: 'Cidco Sector',  co2: 18, water: 'Medium', difficulty: 'Medium', color: '#f59e0b' },
  { id: 'banyan',   name: 'Banyan',    emoji: '🌴', benefit: 'Iconic · Huge canopy',    zone: 'Gangapur Dam',  co2: 35, water: 'Medium', difficulty: 'Medium', color: '#22c55e' },
  { id: 'gulmohar', name: 'Gulmohar',  emoji: '🌺', benefit: 'Flowering · Shade',       zone: 'Trimbak Road',  co2: 15, water: 'Low',    difficulty: 'Easy',   color: '#ef4444' },
  { id: 'bamboo',   name: 'Bamboo',    emoji: '🎋', benefit: 'Fast growing · Carbon+',  zone: 'Satpur MIDC',   co2: 40, water: 'High',   difficulty: 'Hard',   color: '#84cc16' },
]

const ADOPTED_TREES = [
  {
    id: 'tree-001', speciesId: 'neem', name: 'Neem',
    nickname: 'My Buddy',
    plantedOn: new Date('2024-01-15'),
    location: 'Nashik Road, Ward 1',
    zone: 'Zone A-14',
    waterLevel: 72,
    health: 88,
    growthStage: 3,   // 1–5
    co2Absorbed: 4.2,
    lastWatered: new Date(Date.now() - 2 * 86400000),
    waterStreak: 5,
    emoji: '🌳',
    color: '#16a34a',
  },
  {
    id: 'tree-002', speciesId: 'gulmohar', name: 'Gulmohar',
    nickname: 'Flame Queen',
    plantedOn: new Date('2024-03-01'),
    location: 'Trimbak Road Median',
    zone: 'Zone C-08',
    waterLevel: 45,
    health: 74,
    growthStage: 2,
    co2Absorbed: 1.8,
    lastWatered: new Date(Date.now() - 4 * 86400000),
    waterStreak: 2,
    emoji: '🌺',
    color: '#ef4444',
  },
]

function timeAgo(date) {
  const d = Math.floor((Date.now() - new Date(date)) / 86400000)
  if (d === 0) return 'Today'
  if (d === 1) return 'Yesterday'
  return `${d} days ago`
}

function daysSince(date) {
  return Math.floor((Date.now() - new Date(date)) / 86400000)
}

const STAGES = ['🌱 Seed', '🪴 Sprout', '🌿 Sapling', '🌳 Young', '🏕️ Mature']

function GrowthBar({ stage }) {
  return (
    <div className={styles.growthBar}>
      {STAGES.map((s, i) => (
        <div key={i} className={`${styles.growthStep} ${i < stage ? styles.growthDone : ''} ${i === stage - 1 ? styles.growthCurrent : ''}`}>
          <div className={styles.growthDot} />
          <span className={styles.growthLabel}>{s}</span>
        </div>
      ))}
    </div>
  )
}

function WaterModal({ tree, onClose, onWater }) {
  const [watering, setWatering] = useState(false)
  const [done, setDone] = useState(false)
  async function water() {
    setWatering(true)
    await new Promise(r => setTimeout(r, 1200))
    setDone(true)
    onWater(tree.id)
  }
  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>💧 Water {tree.nickname}</h3>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        {done ? (
          <div className={styles.modalDone}>
            <div className={styles.modalDoneIcon}>💧</div>
            <h3>{tree.nickname} has been watered!</h3>
            <p>Great job! Your tree thanks you 🌳</p>
            <p className={styles.modalDoneSub}>+10 Eco Points earned</p>
            <button className={styles.doneBtn} onClick={onClose}>Done</button>
          </div>
        ) : (
          <div className={styles.modalBody}>
            <div className={styles.treePreview} style={{ background: tree.color + '22', border: `2px solid ${tree.color}33` }}>
              <span style={{ fontSize: '3rem' }}>{tree.emoji}</span>
              <div>
                <p className={styles.treePreviewName}>{tree.nickname}</p>
                <p className={styles.treePreviewSub}>{tree.location}</p>
              </div>
            </div>
            <div className={styles.waterInfo}>
              <div className={styles.waterInfoItem}>
                <span className={styles.wiLabel}>Current Water Level</span>
                <span className={styles.wiVal}>{tree.waterLevel}%</span>
              </div>
              <div className={styles.wiBar}>
                <div className={styles.wiBarFill} style={{ width: `${tree.waterLevel}%`, background: tree.waterLevel < 40 ? '#ef4444' : '#3b82f6' }} />
              </div>
              <div className={styles.waterInfoItem}>
                <span className={styles.wiLabel}>Last Watered</span>
                <span className={styles.wiVal}>{timeAgo(tree.lastWatered)}</span>
              </div>
            </div>
            <button className={styles.waterBtn} onClick={water} disabled={watering}>
              {watering ? '💧 Watering...' : '💧 Water This Tree'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function AdoptModal({ species, onClose, onAdopt }) {
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  async function adopt() {
    if (!nickname.trim()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setDone(true)
    onAdopt(species, nickname)
  }
  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>{species.emoji} Adopt a {species.name}</h3>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        {done ? (
          <div className={styles.modalDone}>
            <div className={styles.modalDoneIcon}>{species.emoji}</div>
            <h3>"{nickname}" is now yours!</h3>
            <p>Your {species.name} has been planted in {species.zone}.</p>
            <p className={styles.modalDoneSub}>+50 Eco Points · Certificate will be emailed to you</p>
            <button className={styles.doneBtn} onClick={onClose}>Done</button>
          </div>
        ) : (
          <div className={styles.modalBody}>
            <div className={styles.treePreview} style={{ background: species.color + '18', border: `2px solid ${species.color}33` }}>
              <span style={{ fontSize: '3rem' }}>{species.emoji}</span>
              <div>
                <p className={styles.treePreviewName}>{species.name}</p>
                <p className={styles.treePreviewSub}>{species.zone} · {species.benefit}</p>
              </div>
            </div>
            <div className={styles.adoptStats}>
              <div className={styles.adoptStat}><span>🌬️ CO₂</span><strong>{species.co2} kg/yr</strong></div>
              <div className={styles.adoptStat}><span>💧 Water</span><strong>{species.water}</strong></div>
              <div className={styles.adoptStat}><span>📈 Difficulty</span><strong>{species.difficulty}</strong></div>
            </div>
            <div className={styles.nicknameField}>
              <label>Give your tree a nickname</label>
              <input
                className={styles.nicknameInput}
                placeholder={`e.g. "My ${species.name}" or "Green Giant"`}
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                maxLength={30}
              />
            </div>
            <button className={styles.adoptBtn} style={{ background: species.color }} onClick={adopt} disabled={loading || !nickname.trim()}>
              {loading ? 'Adopting...' : `🌱 Adopt this ${species.name}`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function TreeAdoption() {
  const [myTrees, setMyTrees]       = useState(ADOPTED_TREES)
  const [waterTarget, setWaterTarget] = useState(null)
  const [adoptTarget, setAdoptTarget] = useState(null)
  const [tab, setTab]               = useState('my')   // my | adopt

  function handleWater(id) {
    setMyTrees(prev => prev.map(t => t.id === id ? {
      ...t, waterLevel: Math.min(100, t.waterLevel + 30),
      lastWatered: new Date(), waterStreak: t.waterStreak + 1,
    } : t))
  }

  function handleAdopt(species, nickname) {
    const newTree = {
      id: `tree-00${myTrees.length + 1}`,
      speciesId: species.id, name: species.name, nickname,
      plantedOn: new Date(), location: species.zone,
      zone: `Zone X-0${myTrees.length + 1}`,
      waterLevel: 80, health: 100, growthStage: 1,
      co2Absorbed: 0, lastWatered: new Date(),
      waterStreak: 0, emoji: species.emoji, color: species.color,
    }
    setMyTrees(prev => [...prev, newTree])
  }

  const totalCO2 = myTrees.reduce((a, t) => a + t.co2Absorbed, 0)

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.headerIcon}>🌳</span>
          <div>
            <h1 className={styles.pageTitle}>Tree Adoption</h1>
            <p className={styles.pageDesc}>Adopt, name & nurture trees planted across {' '}
              <strong>Nashik</strong>. Track their growth in real time.</p>
          </div>
        </div>
        <div className={styles.co2Chip}>
          <span className={styles.co2Val}>{totalCO2.toFixed(1)} kg</span>
          <span className={styles.co2Label}>CO₂ absorbed by your trees</span>
        </div>
      </div>

      {/* Summary */}
      <div className={styles.summaryRow}>
        {[
          { icon: '🌳', val: myTrees.length, label: 'Trees Adopted' },
          { icon: '💧', val: myTrees.filter(t => daysSince(t.lastWatered) <= 1).length, label: 'Watered Today' },
          { icon: '❤️', val: Math.round(myTrees.reduce((a, t) => a + t.health, 0) / myTrees.length) + '%', label: 'Avg Health' },
          { icon: '🔥', val: Math.max(...myTrees.map(t => t.waterStreak)), label: 'Best Streak' },
        ].map(s => (
          <div key={s.label} className={styles.summaryCard}>
            <span className={styles.sumIcon}>{s.icon}</span>
            <span className={styles.sumVal}>{s.val}</span>
            <span className={styles.sumLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab === 'my' ? styles.tabActive : ''}`} onClick={() => setTab('my')}>
          🌳 My Trees ({myTrees.length})
        </button>
        <button className={`${styles.tab} ${tab === 'adopt' ? styles.tabActive : ''}`} onClick={() => setTab('adopt')}>
          🌱 Adopt a Tree
        </button>
      </div>

      {/* My Trees */}
      {tab === 'my' && (
        <div className={styles.treeGrid}>
          {myTrees.map(tree => {
            const daysOld   = daysSince(tree.plantedOn)
            const needsWater = tree.waterLevel < 50
            return (
              <div key={tree.id} className={`${styles.treeCard} ${needsWater ? styles.treeNeedsWater : ''}`}>
                <div className={styles.treeCardTop} style={{ background: tree.color + '18' }}>
                  <div className={styles.treeBigEmoji}>{tree.emoji}</div>
                  <div className={styles.treeCardTopRight}>
                    <span className={styles.treeNickname}>{tree.nickname}</span>
                    <span className={styles.treeSpecies}>{tree.name}</span>
                    {needsWater && <span className={styles.waterAlert}>💧 Needs water!</span>}
                  </div>
                </div>

                <div className={styles.treeCardBody}>
                  <p className={styles.treeLocation}>📍 {tree.location}</p>
                  <p className={styles.treeDays}>🌱 Planted {daysOld} days ago · {tree.zone}</p>

                  <GrowthBar stage={tree.growthStage} />

                  <div className={styles.treeMetrics}>
                    <div className={styles.metric}>
                      <span className={styles.mLabel}>Health</span>
                      <div className={styles.mBar}>
                        <div className={styles.mFill} style={{ width: `${tree.health}%`, background: tree.health > 70 ? '#22c55e' : tree.health > 40 ? '#f59e0b' : '#ef4444' }} />
                      </div>
                      <span className={styles.mVal}>{tree.health}%</span>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.mLabel}>Water</span>
                      <div className={styles.mBar}>
                        <div className={styles.mFill} style={{ width: `${tree.waterLevel}%`, background: tree.waterLevel > 60 ? '#3b82f6' : tree.waterLevel > 30 ? '#f59e0b' : '#ef4444' }} />
                      </div>
                      <span className={styles.mVal}>{tree.waterLevel}%</span>
                    </div>
                  </div>

                  <div className={styles.treeStats}>
                    <div className={styles.treeStatItem}>
                      <span>🌬️</span>
                      <div><p className={styles.tsVal}>{tree.co2Absorbed} kg</p><p className={styles.tsLabel}>CO₂ absorbed</p></div>
                    </div>
                    <div className={styles.treeStatItem}>
                      <span>🔥</span>
                      <div><p className={styles.tsVal}>{tree.waterStreak}</p><p className={styles.tsLabel}>Water streak</p></div>
                    </div>
                    <div className={styles.treeStatItem}>
                      <span>💧</span>
                      <div><p className={styles.tsVal}>{timeAgo(tree.lastWatered)}</p><p className={styles.tsLabel}>Last watered</p></div>
                    </div>
                  </div>

                  <button className={styles.waterBtnCard} style={{ borderColor: tree.color + '66', color: tree.color, background: tree.color + '0f' }}
                    onClick={() => setWaterTarget(tree)}>
                    💧 Water {tree.nickname}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Adopt tab */}
      {tab === 'adopt' && (
        <div className={styles.adoptGrid}>
          {TREE_SPECIES.map(s => (
            <div key={s.id} className={styles.speciesCard}>
              <div className={styles.speciesTop} style={{ background: s.color + '18' }}>
                <span className={styles.speciesEmoji}>{s.emoji}</span>
              </div>
              <div className={styles.speciesBody}>
                <h3 className={styles.speciesName}>{s.name}</h3>
                <p className={styles.speciesBenefit}>{s.benefit}</p>
                <p className={styles.speciesZone}>📍 {s.zone}</p>
                <div className={styles.speciesStats}>
                  <span>🌬️ {s.co2} kg CO₂/yr</span>
                  <span>💧 {s.water}</span>
                  <span className={`${styles.diffChip} ${styles['diff_' + s.difficulty.toLowerCase()]}`}>{s.difficulty}</span>
                </div>
                <button className={styles.adoptSpeciesBtn} style={{ background: s.color }} onClick={() => setAdoptTarget(s)}>
                  🌱 Adopt this tree
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {waterTarget && <WaterModal tree={waterTarget} onClose={() => setWaterTarget(null)} onWater={handleWater} />}
      {adoptTarget && <AdoptModal species={adoptTarget} onClose={() => setAdoptTarget(null)} onAdopt={handleAdopt} />}
    </div>
  )
}

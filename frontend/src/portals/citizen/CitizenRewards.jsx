import React, { useState, useEffect } from 'react'
import { getPosts, subscribe } from '../../shared/data/sharedStore'
import { CURRENT_USER, ECO_LEVELS } from '../../shared/data/ecoData'
import styles from './CitizenRewards.module.css'

const VOUCHER_SPONSORS = {
  'Swachh Bharat Mission':           { logo: '🇮🇳', color: '#f97316' },
  'National Afforestation Programme':{ logo: '🌿', color: '#16a34a' },
  'Maharashtra State Green Fund':     { logo: '🏛️', color: '#3b82f6' },
  'Nashik Municipal Green Mission':   { logo: '🌳', color: '#22c55e' },
}

const REDEEM_OPTIONS = [
  { id: 'r1', title: 'MSRTC Bus Pass (Monthly)',  value: 500,  icon: '🚌', category: 'Transport',  desc: 'Valid for Nashik city routes' },
  { id: 'r2', title: 'Agro Nursery Voucher',      value: 250,  icon: '🌱', category: 'Gardening',  desc: 'Redeem at partner nurseries in Nashik' },
  { id: 'r3', title: 'Municipal Water Bill Credit',value: 750,  icon: '💧', category: 'Utilities',  desc: 'Applied to next billing cycle' },
  { id: 'r4', title: 'Eco Product Hamper',         value: 1000, icon: '♻️', category: 'Lifestyle',  desc: 'Bamboo products, reusable bags & more' },
  { id: 'r5', title: 'Property Tax Rebate',        value: 2000, icon: '🏠', category: 'Tax Benefit',desc: '2% rebate on annual property tax' },
  { id: 'r6', title: 'Sapling Kit (10 trees)',    value: 300,  icon: '🌿', category: 'Gardening',  desc: '10 saplings delivered to your home' },
]

const POINTS_HISTORY = [
  { id:'ph1', action:'Grievance filed & resolved',  points:+120, date:'Mar 23', icon:'📋' },
  { id:'ph2', action:'Marketplace donation',         points:+60,  date:'Mar 22', icon:'♻️' },
  { id:'ph3', action:'Carbon Tracker logged',        points:+40,  date:'Mar 22', icon:'🌍' },
  { id:'ph4', action:'Tree watered (streak x5)',     points:+50,  date:'Mar 21', icon:'💧' },
  { id:'ph5', action:'Cleanup drive joined',         points:+150, date:'Mar 20', icon:'🧹' },
  { id:'ph6', action:'Grievance filed',              points:+30,  date:'Mar 19', icon:'📢' },
  { id:'ph7', action:'Marketplace sell listing',     points:+25,  date:'Mar 18', icon:'💰' },
  { id:'ph8', action:'Community referral',           points:+200, date:'Mar 15', icon:'🤝' },
]

function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000)
  if (s < 3600)  return `${Math.floor(s/60)}m ago`
  if (s < 86400) return `${Math.floor(s/3600)}h ago`
  return `${Math.floor(s/86400)}d ago`
}

function RedeemModal({ option, balance, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)
  const canAfford = balance >= option.value

  async function confirm() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setDone(true)
    onConfirm(option)
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>{option.icon} Redeem Reward</h3>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        {done ? (
          <div className={styles.redeemDone}>
            <div className={styles.redeemDoneIcon}>🎉</div>
            <h3>Reward Redeemed!</h3>
            <p>Your <strong>{option.title}</strong> has been processed. Check your registered email for the voucher code.</p>
            <p className={styles.redeemDoneSub}>−{option.value} Eco Points deducted</p>
            <button className={styles.doneBtn} onClick={onClose}>Done</button>
          </div>
        ) : (
          <div className={styles.modalBody}>
            <div className={styles.redeemPreview}>
              <span className={styles.redeemIcon}>{option.icon}</span>
              <div>
                <p className={styles.redeemTitle}>{option.title}</p>
                <p className={styles.redeemDesc}>{option.desc}</p>
              </div>
            </div>
            <div className={styles.costRow}>
              <div className={styles.costItem}>
                <span className={styles.costLabel}>Cost</span>
                <span className={styles.costVal}>🌿 {option.value} pts</span>
              </div>
              <div className={styles.costItem}>
                <span className={styles.costLabel}>Your Balance</span>
                <span className={styles.costVal} style={{ color: canAfford ? '#22c55e' : '#ef4444' }}>
                  🌿 {balance} pts
                </span>
              </div>
              <div className={styles.costItem}>
                <span className={styles.costLabel}>After Redeem</span>
                <span className={styles.costVal}>{canAfford ? `🌿 ${balance - option.value} pts` : '❌ Insufficient'}</span>
              </div>
            </div>
            {!canAfford && (
              <div className={styles.insufficientMsg}>
                You need {option.value - balance} more points. Keep filing reports and joining drives!
              </div>
            )}
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
              <button className={styles.confirmBtn} disabled={!canAfford || loading} onClick={confirm}>
                {loading ? 'Processing...' : 'Confirm Redeem'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CitizenRewards() {
  const [posts,       setPosts]       = useState(getPosts)
  const [redeemOpt,  setRedeemOpt]   = useState(null)
  const [balance,    setBalance]      = useState(CURRENT_USER.ecoPoints)
  const [redeemed,   setRedeemed]     = useState([])
  const [tab,        setTab]          = useState('vouchers') // vouchers | redeem | history

  useEffect(() => subscribe(setPosts), [])

  const myVouchers = posts.filter(p => p.status === 'approved' && p.voucher)
  const totalVoucherValue = myVouchers.reduce((a, p) => a + p.voucher.value, 0)

  function handleRedeem(option) {
    setBalance(b => b - option.value)
    setRedeemed(r => [{ ...option, redeemedAt: new Date() }, ...r])
    setRedeemOpt(null)
  }

  const user     = CURRENT_USER
  const level    = ECO_LEVELS[user.level - 1]
  const nextLevel= ECO_LEVELS[user.level] ?? level
  const xpPct    = Math.min(Math.round(((balance - level.min) / (nextLevel.min - level.min)) * 100), 100)

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.heroCard}>
        <div className={styles.heroLeft}>
          <span className={styles.heroEmoji}>🎖️</span>
          <div>
            <h1 className={styles.heroTitle}>My Rewards</h1>
            <p className={styles.heroSub}>Earn points by taking civic action. Redeem for real government benefits.</p>
          </div>
        </div>
        <div className={styles.balanceBlock}>
          <p className={styles.balanceLabel}>Eco Points Balance</p>
          <p className={styles.balanceVal}>🌿 {balance.toLocaleString()}</p>
          <div className={styles.levelRow}>
            <span className={styles.levelEmoji}>{level.emoji}</span>
            <div className={styles.levelInfo}>
              <div className={styles.xpBar}><div className={styles.xpFill} style={{ width:`${xpPct}%`, background:level.color }} /></div>
              <p className={styles.levelLabel}>Level {user.level} · {level.title} · {xpPct}% to next</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary strip */}
      <div className={styles.summaryRow}>
        {[
          { icon:'🎟️', val: myVouchers.length,              label:'Vouchers Earned' },
          { icon:'💰', val:`₹${totalVoucherValue.toLocaleString()}`, label:'Total Value' },
          { icon:'🛍️', val: redeemed.length,                label:'Rewards Redeemed' },
          { icon:'🌿', val: balance.toLocaleString(),        label:'Points Available' },
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
        {[
          { key:'vouchers', label:'🎟️ My Vouchers' },
          { key:'redeem',   label:'🛍️ Redeem Points' },
          { key:'history',  label:'📜 Points History' },
        ].map(t => (
          <button key={t.key} className={`${styles.tab} ${tab === t.key ? styles.tabActive : ''}`}
            onClick={() => setTab(t.key)}>{t.label}</button>
        ))}
      </div>

      {/* Vouchers tab */}
      {tab === 'vouchers' && (
        <div>
          {myVouchers.length === 0 ? (
            <div className={styles.empty}>
              <span>🎟️</span>
              <h3>No vouchers yet</h3>
              <p>File grievances, plant trees or clear garbage and submit to the admin for approval to earn vouchers.</p>
            </div>
          ) : (
            <div className={styles.voucherGrid}>
              {myVouchers.map(post => {
                const sponsor = VOUCHER_SPONSORS[post.voucher.sponsor] ?? { logo:'🏛️', color:'#6b7280' }
                const [copied, setCopied] = useState(false)
                function copy() {
                  navigator.clipboard?.writeText(post.voucher.code)
                  setCopied(true); setTimeout(() => setCopied(false), 2000)
                }
                return (
                  <div key={post.id} className={styles.voucherCard} style={{ '--vc': sponsor.color }}>
                    <div className={styles.vcTop}>
                      <div className={styles.vcSponsor}>
                        <span>{sponsor.logo}</span>
                        <span className={styles.vcSponsorName}>{post.voucher.sponsor}</span>
                      </div>
                      <span className={styles.vcType}>{post.type === 'garbage_cleared' ? '🗑️ Cleanup' : '🌳 Plantation'}</span>
                    </div>
                    <div className={styles.vcAmt}>₹{post.voucher.value.toLocaleString()}</div>
                    <p className={styles.vcTitle}>{post.title}</p>
                    <div className={styles.vcCode} onClick={copy}>
                      <span className={styles.vcCodeText}>{post.voucher.code}</span>
                      <span className={styles.vcCopyHint}>{copied ? '✓ Copied' : 'Tap to copy'}</span>
                    </div>
                    <div className={styles.vcMeta}>
                      <span>📍 {post.city}</span>
                      <span>🕐 {timeAgo(post.voucher.issuedAt)}</span>
                    </div>
                    <div className={styles.vcTear} />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Redeem tab */}
      {tab === 'redeem' && (
        <div className={styles.redeemGrid}>
          {REDEEM_OPTIONS.map(opt => {
            const canAfford = balance >= opt.value
            const wasRedeemed = redeemed.some(r => r.id === opt.id)
            return (
              <div key={opt.id} className={`${styles.redeemCard} ${!canAfford ? styles.redeemLocked : ''}`}>
                <div className={styles.redeemCardTop}>
                  <span className={styles.redeemCardIcon}>{opt.icon}</span>
                  <span className={`${styles.redeemCatChip}`}>{opt.category}</span>
                </div>
                <h3 className={styles.redeemCardTitle}>{opt.title}</h3>
                <p className={styles.redeemCardDesc}>{opt.desc}</p>
                <div className={styles.redeemCardBottom}>
                  <span className={styles.redeemPts}>🌿 {opt.value} pts</span>
                  <button
                    className={`${styles.redeemBtn} ${wasRedeemed ? styles.redeemBtnDone : ''}`}
                    disabled={!canAfford && !wasRedeemed}
                    onClick={() => !wasRedeemed && setRedeemOpt(opt)}
                  >
                    {wasRedeemed ? '✅ Redeemed' : canAfford ? 'Redeem →' : `Need ${opt.value - balance} more pts`}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* History tab */}
      {tab === 'history' && (
        <div className={styles.historyCard}>
          <h2 className={styles.historyTitle}>Points Activity</h2>
          <div className={styles.historyList}>
            {[...POINTS_HISTORY, ...redeemed.map(r => ({
              id: r.id + '_r', action: `Redeemed: ${r.title}`,
              points: -r.value, date: 'Today', icon: '🛍️'
            }))].map(h => (
              <div key={h.id} className={styles.historyRow}>
                <span className={styles.historyIcon}>{h.icon}</span>
                <div className={styles.historyBody}>
                  <p className={styles.historyAction}>{h.action}</p>
                  <p className={styles.historyDate}>{h.date}</p>
                </div>
                <span className={`${styles.historyPoints} ${h.points > 0 ? styles.pointsPos : styles.pointsNeg}`}>
                  {h.points > 0 ? '+' : ''}{h.points} 🌿
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {redeemOpt && <RedeemModal option={redeemOpt} balance={balance} onClose={() => setRedeemOpt(null)} onConfirm={handleRedeem} />}
    </div>
  )
}

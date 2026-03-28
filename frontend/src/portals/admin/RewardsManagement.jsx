import React, { useState, useEffect, useCallback } from 'react'
import { getPosts, updatePost, subscribe, generateVoucher } from '../../shared/data/sharedStore'
import styles from './RewardsManagement.module.css'

// ── Icons ─────────────────────────────────────────────────────
const IconCheck   = () => <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
const IconX       = () => <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
const IconTicket  = () => <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a1 1 0 01-1 1 1 1 0 000 2 1 1 0 011 1v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a1 1 0 011-1 1 1 0 000-2 1 1 0 01-1-1V6z"/></svg>
const IconEye     = () => <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>
const IconTree    = () => <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fillRule="evenodd" d="M10 2a1 1 0 00-.894.553L6.382 7H4a1 1 0 000 2h.382l-1.276 2.553A1 1 0 004 13h5v4a1 1 0 102 0v-4h5a1 1 0 00.894-1.447L15.618 9H16a1 1 0 100-2h-2.382L10.894 2.553A1 1 0 0010 2z" clipRule="evenodd"/></svg>
const IconTrash   = () => <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
const IconFilter  = () => <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.553.894l-4 2A1 1 0 016 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd"/></svg>

const STATUS_META = {
  pending:  { label: 'Pending Review', color: '#f59e0b', bg: 'rgba(245,158,11,.12)' },
  approved: { label: 'Approved',       color: '#22c55e', bg: 'rgba(34,197,94,.12)'  },
  rejected: { label: 'Rejected',       color: '#ef4444', bg: 'rgba(239,68,68,.12)'  },
}

const TYPE_META = {
  garbage_cleared: { label: 'Garbage Cleared', icon: '🗑️', color: '#f97316' },
  tree_planted:    { label: 'Tree Planted',     icon: '🌳', color: '#22c55e' },
}

function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000)
  if (s < 60)   return `${s}s ago`
  if (s < 3600) return `${Math.floor(s/60)}m ago`
  if (s < 86400)return `${Math.floor(s/3600)}h ago`
  return `${Math.floor(s/86400)}d ago`
}

// ── Voucher card (shown after approval) ───────────────────────
function VoucherCard({ voucher, userName }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard?.writeText(voucher.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className={styles.voucherCard}>
      <div className={styles.voucherHeader}>
        <IconTicket />
        <span>Government Sponsored Voucher</span>
      </div>
      <div className={styles.voucherAmt}>₹{voucher.value.toLocaleString()}</div>
      <div className={styles.voucherCode} onClick={copy} title="Click to copy">
        <span>{voucher.code}</span>
        <span className={styles.copyHint}>{copied ? '✓ Copied!' : 'Click to copy'}</span>
      </div>
      <div className={styles.voucherMeta}>
        <span>👤 {userName}</span>
        <span>🏛 {voucher.sponsor}</span>
      </div>
    </div>
  )
}

// ── Reject modal ──────────────────────────────────────────────
function RejectModal({ post, onClose, onConfirm }) {
  const [reason, setReason] = useState('')
  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Reject Submission</h3>
          <button className={styles.modalClose} onClick={onClose}><IconX /></button>
        </div>
        <div className={styles.modalBody}>
          <p className={styles.modalSubtitle}>Provide a reason for <strong>{post.userName}</strong>:</p>
          <textarea
            className={styles.rejectTextarea}
            rows={4}
            placeholder="e.g. Insufficient photographic evidence. Please resubmit with before/after photos."
            value={reason}
            onChange={e => setReason(e.target.value)}
          />
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.confirmRejectBtn} disabled={!reason.trim()} onClick={() => onConfirm(reason)}>
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Post detail modal ─────────────────────────────────────────
function DetailModal({ post, onClose, onApprove, onReject }) {
  const tm = TYPE_META[post.type]
  const sm = STATUS_META[post.status]

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`${styles.modal} ${styles.detailModal}`}>
        <div className={styles.modalHeader}>
          <h3>{tm.icon} {post.title}</h3>
          <button className={styles.modalClose} onClick={onClose}><IconX /></button>
        </div>

        <div className={styles.detailBody}>
          {/* Before / After visual */}
          <div className={styles.beforeAfter}>
            <div className={styles.baPanel} style={{ background: post.beforeBg }}>
              <span className={styles.baLabel}>BEFORE</span>
              <span className={styles.baEmoji}>🚮</span>
            </div>
            <div className={styles.baDivider}>→</div>
            <div className={styles.baPanel} style={{ background: post.afterBg }}>
              <span className={styles.baLabel}>AFTER</span>
              <span className={styles.baEmoji}>{post.type === 'tree_planted' ? '🌳' : '✨'}</span>
            </div>
          </div>

          {/* Meta grid */}
          <div className={styles.detailGrid}>
            <div className={styles.detailCell}>
              <span className={styles.dcLabel}>Submitted by</span>
              <span className={styles.dcVal}>{post.userName}</span>
            </div>
            <div className={styles.detailCell}>
              <span className={styles.dcLabel}>User ID</span>
              <span className={`${styles.dcVal} ${styles.mono}`}>{post.userId}</span>
            </div>
            <div className={styles.detailCell}>
              <span className={styles.dcLabel}>City / Ward</span>
              <span className={styles.dcVal}>{post.city} · {post.ward}</span>
            </div>
            <div className={styles.detailCell}>
              <span className={styles.dcLabel}>Submitted</span>
              <span className={styles.dcVal}>{timeAgo(post.submittedAt)}</span>
            </div>
            {post.type === 'garbage_cleared' && (
              <div className={styles.detailCell}>
                <span className={styles.dcLabel}>Weight Cleared</span>
                <span className={styles.dcVal}>{post.weight} tons</span>
              </div>
            )}
            {post.type === 'tree_planted' && (
              <div className={styles.detailCell}>
                <span className={styles.dcLabel}>Trees Planted</span>
                <span className={styles.dcVal}>{post.trees}</span>
              </div>
            )}
            <div className={styles.detailCell}>
              <span className={styles.dcLabel}>Eco Points</span>
              <span className={styles.dcVal}>🌿 {post.points}</span>
            </div>
            <div className={styles.detailCell}>
              <span className={styles.dcLabel}>Status</span>
              <span className={styles.statusBadge} style={{ color: sm.color, background: sm.bg }}>{sm.label}</span>
            </div>
          </div>

          <p className={styles.detailDesc}>{post.desc}</p>

          <div className={styles.detailTags}>
            {post.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
          </div>

          {/* Voucher if already approved */}
          {post.status === 'approved' && post.voucher && (
            <VoucherCard voucher={post.voucher} userName={post.userName} />
          )}

          {post.status === 'rejected' && post.rejectReason && (
            <div className={styles.rejectNote}>
              <strong>Rejection Reason:</strong> {post.rejectReason}
            </div>
          )}
        </div>

        {post.status === 'pending' && (
          <div className={styles.modalFooter}>
            <button className={styles.rejectBtn} onClick={onReject}><IconX /> Reject</button>
            <button className={styles.approveBtn} onClick={onApprove}><IconCheck /> Approve & Issue Voucher</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────
export default function RewardsManagement() {
  const [posts,         setPosts]         = useState(getPosts)
  const [filter,        setFilter]        = useState('all')    // all | pending | approved | rejected
  const [typeFilter,    setTypeFilter]    = useState('all')
  const [detailPost,    setDetailPost]    = useState(null)
  const [rejectTarget,  setRejectTarget]  = useState(null)
  const [approving,     setApproving]     = useState(null)     // id being processed
  const [toast,         setToast]         = useState(null)

  useEffect(() => subscribe(setPosts), [])

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  async function handleApprove(post) {
    setApproving(post.id)
    await new Promise(r => setTimeout(r, 900))
    const voucher = generateVoucher(post)
    updatePost(post.id, { status: 'approved', voucher })
    setApproving(null)
    setDetailPost(null)
    showToast(`✅ Voucher ₹${voucher.value} issued to ${post.userName}`)
  }

  function handleRejectConfirm(reason) {
    updatePost(rejectTarget.id, { status: 'rejected', rejectReason: reason })
    setRejectTarget(null)
    setDetailPost(null)
    showToast(`Submission rejected with feedback.`, 'warning')
  }

  const filtered = posts.filter(p => {
    if (filter !== 'all' && p.status !== filter) return false
    if (typeFilter !== 'all' && p.type !== typeFilter) return false
    return true
  })

  const counts = {
    all:      posts.length,
    pending:  posts.filter(p => p.status === 'pending').length,
    approved: posts.filter(p => p.status === 'approved').length,
    rejected: posts.filter(p => p.status === 'rejected').length,
  }

  const totalVoucherValue = posts.filter(p => p.status === 'approved' && p.voucher)
    .reduce((a, p) => a + p.voucher.value, 0)

  return (
    <div className={styles.page}>

      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${styles['toast_' + toast.type]}`}>{toast.msg}</div>
      )}

      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.headerIcon}>🎖️</span>
          <div>
            <h1 className={styles.pageTitle}>Rewards Management</h1>
            <p className={styles.pageDesc}>Review citizen submissions and issue government-sponsored vouchers.</p>
          </div>
        </div>
      </div>

      {/* Summary strip */}
      <div className={styles.summaryStrip}>
        {[
          { label: 'Total Submissions', val: counts.all,      icon: '📬', color: '#3b82f6' },
          { label: 'Pending Review',    val: counts.pending,  icon: '⏳', color: '#f59e0b' },
          { label: 'Vouchers Issued',   val: counts.approved, icon: '🎟️', color: '#22c55e' },
          { label: 'Total Value Issued',val: `₹${totalVoucherValue.toLocaleString()}`, icon: '💰', color: '#8b5cf6' },
        ].map(s => (
          <div key={s.label} className={styles.summaryCard} style={{ '--card-accent': s.color }}>
            <span className={styles.summaryIcon}>{s.icon}</span>
            <div>
              <p className={styles.summaryVal}>{s.val}</p>
              <p className={styles.summaryLabel}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className={styles.filterBar}>
        <div className={styles.statusTabs}>
          {['all','pending','approved','rejected'].map(f => (
            <button
              key={f}
              className={`${styles.statusTab} ${filter === f ? styles.statusTabActive : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className={styles.tabBadge}>{counts[f]}</span>
            </button>
          ))}
        </div>
        <div className={styles.typeFilter}>
          <IconFilter />
          <select className={styles.typeSelect} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="all">All Types</option>
            <option value="garbage_cleared">🗑️ Garbage Cleared</option>
            <option value="tree_planted">🌳 Tree Planted</option>
          </select>
        </div>
      </div>

      {/* Posts grid */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <span>🔍</span>
          <p>No submissions match your filters.</p>
        </div>
      ) : (
        <div className={styles.postsGrid}>
          {filtered.map(post => {
            const tm = TYPE_META[post.type]
            const sm = STATUS_META[post.status]
            const isApproving = approving === post.id

            return (
              <div key={post.id} className={`${styles.postCard} ${styles['post_' + post.status]}`}>

                {/* Card top image-like band */}
                <div className={styles.cardBand} style={{ background: post.afterBg }}>
                  <span className={styles.cardBandEmoji}>{tm.icon}</span>
                  <span className={styles.statusBadge} style={{ color: sm.color, background: 'rgba(0,0,0,.45)', borderColor: sm.color + '66' }}>
                    {sm.label}
                  </span>
                </div>

                {/* Card body */}
                <div className={styles.cardBody}>
                  {/* Submitter */}
                  <div className={styles.submitter}>
                    <div className={styles.avatar}>{post.avatar}</div>
                    <div className={styles.submitterInfo}>
                      <span className={styles.submitterName}>{post.userName}</span>
                      <span className={styles.submitterId}>{post.userId} · {post.city}</span>
                    </div>
                    <span className={styles.submittedTime}>{timeAgo(post.submittedAt)}</span>
                  </div>

                  <h3 className={styles.cardTitle}>{post.title}</h3>
                  <p className={styles.cardDesc}>{post.desc}</p>

                  {/* Impact metrics */}
                  <div className={styles.metrics}>
                    {post.type === 'garbage_cleared' && (
                      <span className={styles.metric} style={{ color:'#f97316', background:'rgba(249,115,22,.1)' }}>
                        <IconTrash /> {post.weight} tons
                      </span>
                    )}
                    {post.type === 'tree_planted' && (
                      <span className={styles.metric} style={{ color:'#22c55e', background:'rgba(34,197,94,.1)' }}>
                        <IconTree /> {post.trees} trees
                      </span>
                    )}
                    <span className={styles.metric} style={{ color:'#8b5cf6', background:'rgba(139,92,246,.1)' }}>
                      🌿 {post.points} pts
                    </span>
                    <span className={styles.metric} style={{ color:'#64748b', background:'rgba(100,116,139,.08)' }}>
                      📍 {post.ward}
                    </span>
                  </div>

                  {/* Voucher preview on approved */}
                  {post.status === 'approved' && post.voucher && (
                    <div className={styles.voucherPreview}>
                      <IconTicket />
                      <span className={styles.voucherCode}>{post.voucher.code}</span>
                      <span className={styles.voucherAmt}>₹{post.voucher.value.toLocaleString()}</span>
                    </div>
                  )}

                  {post.status === 'rejected' && post.rejectReason && (
                    <div className={styles.rejectNote}>
                      <strong>Reason:</strong> {post.rejectReason}
                    </div>
                  )}

                  {/* Actions */}
                  <div className={styles.cardActions}>
                    <button className={styles.viewBtn} onClick={() => setDetailPost(post)}><IconEye /> View</button>
                    {post.status === 'pending' && (
                      <>
                        <button
                          className={styles.rejectCardBtn}
                          onClick={() => setRejectTarget(post)}
                        ><IconX /> Reject</button>
                        <button
                          className={styles.approveCardBtn}
                          disabled={isApproving}
                          onClick={() => handleApprove(post)}
                        >
                          {isApproving ? <><span className={styles.spinner}/> Issuing…</> : <><IconCheck /> Approve</>}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modals */}
      {detailPost && (
        <DetailModal
          post={detailPost}
          onClose={() => setDetailPost(null)}
          onApprove={() => handleApprove(detailPost)}
          onReject={() => { setRejectTarget(detailPost); setDetailPost(null) }}
        />
      )}
      {rejectTarget && (
        <RejectModal
          post={rejectTarget}
          onClose={() => setRejectTarget(null)}
          onConfirm={handleRejectConfirm}
        />
      )}
    </div>
  )
}

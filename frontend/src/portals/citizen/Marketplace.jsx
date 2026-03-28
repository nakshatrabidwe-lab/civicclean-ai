import React, { useState, useMemo } from 'react'
import { SEED_ITEMS, CATEGORIES, CONDITION } from '../../shared/data/marketplaceData'
import styles from './Marketplace.module.css'

// ── Icons ────────────────────────────────────────────────────
const IconSearch  = () => <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/></svg>
const IconPlus    = () => <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/></svg>
const IconStar    = () => <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
const IconPin     = () => <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>
const IconFilter  = () => <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15"><path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.553.894l-4 2A1 1 0 016 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd"/></svg>
const IconX       = () => <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
const IconHeart   = () => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/></svg>
const IconArrow   = () => <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg>

// ── Tab config ───────────────────────────────────────────────
const TABS = [
  { key: 'sell',   label: 'Sell',   emoji: '💰', color: '#16a34a', desc: 'List recyclable items for sale' },
  { key: 'buy',    label: 'Buy',    emoji: '🛒', color: '#2563eb', desc: 'Browse items you can purchase' },
  { key: 'donate', label: 'Donate', emoji: '🤝', color: '#9333ea', desc: 'Give away items for free' },
]

const SORT_OPTIONS = [
  { value: 'newest',    label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc',label: 'Price: High → Low' },
  { value: 'rating',    label: 'Top Rated' },
]

// ── Item card ────────────────────────────────────────────────
function ItemCard({ item, tabKey }) {
  const [saved, setSaved] = useState(false)

  const conditionColor = {
    'Like New': '#16a34a', 'Good': '#2563eb', 'Fair': '#d97706',
    'For Parts': '#9333ea', 'Any': '#6b7280',
  }[item.condition] ?? '#6b7280'

  return (
    <div className={styles.card}>
      {/* Image area */}
      <div className={styles.cardImg} style={{ background: item.bg }}>
        <span className={styles.cardEmoji}>
          {CATEGORIES.find(c => c.id === item.category)?.emoji ?? '📦'}
        </span>
        <button
          className={`${styles.saveBtn} ${saved ? styles.saved : ''}`}
          onClick={() => setSaved(v => !v)}
          aria-label={saved ? 'Unsave' : 'Save'}
        >
          <IconHeart />
        </button>
        <span
          className={styles.condBadge}
          style={{ background: conditionColor + '22', color: conditionColor, borderColor: conditionColor + '44' }}
        >
          {item.condition}
        </span>
        {tabKey === 'donate' && (
          <span className={styles.freeBadge}>FREE</span>
        )}
      </div>

      {/* Body */}
      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          <span className={styles.categoryPill}>
            {CATEGORIES.find(c => c.id === item.category)?.label}
          </span>
          <span className={styles.posted}>{item.postedAt}</span>
        </div>

        <h3 className={styles.cardTitle}>{item.title}</h3>
        <p className={styles.cardDesc}>{item.desc}</p>

        {/* Tags */}
        <div className={styles.tags}>
          {item.tags.map(t => (
            <span key={t} className={styles.tag}>{t}</span>
          ))}
        </div>

        {/* Footer row */}
        <div className={styles.cardFooter}>
          <div className={styles.priceBlock}>
            {tabKey === 'donate' ? (
              <span className={styles.priceFree}>Free Donation</span>
            ) : tabKey === 'sell' ? (
              <><span className={styles.priceVal}>₹{item.price.toLocaleString()}</span>
              <span className={styles.priceUnit}>/{item.unit}</span></>
            ) : (
              <><span className={styles.priceOffer}>Offering</span>
              <span className={styles.priceVal}>₹{item.price.toLocaleString()}</span>
              <span className={styles.priceUnit}>/{item.unit}</span></>
            )}
          </div>
          <div className={styles.sellerRow}>
            <div className={styles.sellerAvatar}>{item.seller[0]}</div>
            <div>
              <p className={styles.sellerName}>{item.seller}</p>
              <p className={styles.sellerRating}>
                <IconStar />&nbsp;{item.sellerRating}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.locRow}><IconPin />{item.location} · {item.qty}</div>

        <button className={`${styles.ctaBtn} ${styles['cta_' + tabKey]}`}>
          {tabKey === 'sell' ? 'Contact Seller' : tabKey === 'buy' ? 'Make an Offer' : 'Request Item'}
          <IconArrow />
        </button>
      </div>
    </div>
  )
}

// ── Post form modal ───────────────────────────────────────────
function PostModal({ tabKey, onClose }) {
  const tab = TABS.find(t => t.key === tabKey)
  const [form, setForm] = useState({ title:'', category:'', condition:'', qty:'', price:'', desc:'', location:'' })
  const [done, setDone] = useState(false)
  const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    await new Promise(r => setTimeout(r, 1000))
    setDone(true)
  }

  return (
    <div className={styles.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{tab.emoji} Post a {tab.label} Listing</h2>
          <button className={styles.modalClose} onClick={onClose}><IconX /></button>
        </div>

        {done ? (
          <div className={styles.modalSuccess}>
            <div className={styles.modalSuccessIcon}>✓</div>
            <p>Your listing is live!</p>
            <button className={styles.modalDoneBtn} onClick={onClose}>Done</button>
          </div>
        ) : (
          <form onSubmit={submit} className={styles.modalForm}>
            <div className={styles.mField}>
              <label>Title *</label>
              <input name="title" className={styles.mInput} required
                placeholder={`e.g. ${tabKey==='buy'?'Looking for':'Old'} plastic bottles`}
                value={form.title} onChange={change} />
            </div>
            <div className={styles.mRow}>
              <div className={styles.mField}>
                <label>Category *</label>
                <select name="category" className={styles.mInput} required value={form.category} onChange={change}>
                  <option value="">Select…</option>
                  {CATEGORIES.filter(c=>c.id!=='all').map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
                </select>
              </div>
              <div className={styles.mField}>
                <label>Condition</label>
                <select name="condition" className={styles.mInput} value={form.condition} onChange={change}>
                  <option value="">Select…</option>
                  {CONDITION.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className={styles.mRow}>
              <div className={styles.mField}>
                <label>Quantity</label>
                <input name="qty" className={styles.mInput} placeholder="e.g. 10 kg / 2 units"
                  value={form.qty} onChange={change} />
              </div>
              {tabKey !== 'donate' && (
                <div className={styles.mField}>
                  <label>Price (₹)</label>
                  <input name="price" type="number" className={styles.mInput} placeholder="0"
                    value={form.price} onChange={change} />
                </div>
              )}
            </div>
            <div className={styles.mField}>
              <label>Description</label>
              <textarea name="desc" className={styles.mTextarea} rows={3}
                placeholder="Describe the item, its condition, and how to contact you…"
                value={form.desc} onChange={change} />
            </div>
            <div className={styles.mField}>
              <label>Location</label>
              <input name="location" className={styles.mInput} placeholder="City, State"
                value={form.location} onChange={change} />
            </div>
            <button type="submit" className={styles.mSubmit}
              style={{ background: tab.color }}>
              Post {tab.label} Listing
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

// ── Main Marketplace component ───────────────────────────────
export default function Marketplace() {
  const [activeTab,   setActiveTab]   = useState('sell')
  const [activeCategory, setActiveCat] = useState('all')
  const [search,      setSearch]      = useState('')
  const [sortBy,      setSortBy]      = useState('newest')
  const [showModal,   setShowModal]   = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const activeTabMeta = TABS.find(t => t.key === activeTab)

  const filtered = useMemo(() => {
    let items = SEED_ITEMS.filter(i => i.mode === activeTab)
    if (activeCategory !== 'all')
      items = items.filter(i => i.category === activeCategory)
    if (search.trim())
      items = items.filter(i =>
        i.title.toLowerCase().includes(search.toLowerCase()) ||
        i.desc.toLowerCase().includes(search.toLowerCase()) ||
        i.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
      )
    if (sortBy === 'price_asc')  items = [...items].sort((a,b) => a.price - b.price)
    if (sortBy === 'price_desc') items = [...items].sort((a,b) => b.price - a.price)
    if (sortBy === 'rating')     items = [...items].sort((a,b) => b.sellerRating - a.sellerRating)
    return items
  }, [activeTab, activeCategory, search, sortBy])

  function clearFilters() {
    setSearch(''); setActiveCat('all'); setSortBy('newest')
  }

  const hasFilters = search || activeCategory !== 'all' || sortBy !== 'newest'

  return (
    <div className={styles.page}>

      {/* ── Header ─────────────────────────────────────── */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.headerIcon}>♻️</span>
          <div>
            <h1 className={styles.pageTitle}>Circular Economy Marketplace</h1>
            <p className={styles.pageDesc}>Trade, buy, or donate recyclable items in your community.</p>
          </div>
        </div>
        <button
          className={styles.postBtn}
          style={{ '--tab-color': activeTabMeta.color }}
          onClick={() => setShowModal(true)}
        >
          <IconPlus /> Post a {activeTabMeta.label} Listing
        </button>
      </div>

      {/* ── Tabs ───────────────────────────────────────── */}
      <div className={styles.tabs}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
            style={activeTab === tab.key ? { '--tab-color': tab.color } : {}}
            onClick={() => { setActiveTab(tab.key); setActiveCat('all') }}
          >
            <span className={styles.tabEmoji}>{tab.emoji}</span>
            <span className={styles.tabLabel}>{tab.label}</span>
            <span className={styles.tabCount}>
              {SEED_ITEMS.filter(i => i.mode === tab.key).length}
            </span>
          </button>
        ))}
      </div>
      <p className={styles.tabDesc}>{activeTabMeta.desc}</p>

      {/* ── Filter bar ─────────────────────────────────── */}
      <div className={styles.filterBar}>
        {/* Search */}
        <div className={styles.searchWrap}>
          <IconSearch />
          <input
            className={styles.searchInput}
            type="search" placeholder="Search listings…"
            value={search} onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className={styles.clearSearch} onClick={() => setSearch('')}><IconX /></button>
          )}
        </div>

        {/* Sort */}
        <select className={styles.sortSelect} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {/* Filter toggle (mobile) */}
        <button className={`${styles.filterToggle} ${showFilters ? styles.filterToggleOn : ''}`}
          onClick={() => setShowFilters(v => !v)}>
          <IconFilter /> Filters {hasFilters && <span className={styles.filterDot} />}
        </button>

        {/* Clear */}
        {hasFilters && (
          <button className={styles.clearBtn} onClick={clearFilters}><IconX /> Clear</button>
        )}
      </div>

      {/* ── Category chips ──────────────────────────────── */}
      <div className={`${styles.catRow} ${showFilters ? styles.catRowOpen : ''}`}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`${styles.catChip} ${activeCategory === cat.id ? styles.catChipActive : ''}`}
            onClick={() => setActiveCat(cat.id)}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* ── Results summary ─────────────────────────────── */}
      <div className={styles.resultsMeta}>
        <span>{filtered.length} listing{filtered.length !== 1 ? 's' : ''}</span>
        {activeCategory !== 'all' && (
          <span className={styles.activeFilter}>
            {CATEGORIES.find(c => c.id === activeCategory)?.label}
            <button onClick={() => setActiveCat('all')}><IconX /></button>
          </span>
        )}
      </div>

      {/* ── Grid ────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyEmoji}>🔍</span>
          <h3>No listings found</h3>
          <p>Try a different category or clear your search.</p>
          <button className={styles.emptyBtn} onClick={clearFilters}>Clear Filters</button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map(item => (
            <ItemCard key={item.id} item={item} tabKey={activeTab} />
          ))}
        </div>
      )}

      {/* ── Post modal ──────────────────────────────────── */}
      {showModal && (
        <PostModal tabKey={activeTab} onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}

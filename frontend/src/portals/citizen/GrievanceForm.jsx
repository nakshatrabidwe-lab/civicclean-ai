import React, { useState, useRef, useCallback } from 'react'
import styles from './GrievanceForm.module.css'

// ── Inline SVG Icons ─────────────────────────────────────────
const IconUpload   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
const IconCamera   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
const IconMapPin   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
const IconX        = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IconCheck    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20"><polyline points="20 6 9 17 4 12"/></svg>
const IconLoader   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" style={{animation:'spin 0.8s linear infinite'}}><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
const IconInfo     = () => <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 4a1 1 0 110 2 1 1 0 010-2zm0 4a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1z" clipRule="evenodd"/></svg>
const IconLocation = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4"/></svg>

const CATEGORIES = [
  { value: 'garbage_dump',   label: '🗑️ Garbage Dump',      color: '#dc2626' },
  { value: 'open_burning',   label: '🔥 Open Burning',       color: '#ea580c' },
  { value: 'water_logging',  label: '💧 Water Logging',      color: '#0284c7' },
  { value: 'broken_road',    label: '🚧 Broken Road',        color: '#d97706' },
  { value: 'sewage_leak',    label: '💩 Sewage Leak',        color: '#7c3aed' },
  { value: 'illegal_dump',   label: '⚠️ Illegal Dumping',    color: '#b45309' },
  { value: 'dead_animal',    label: '🐾 Dead Animal',        color: '#6b7280' },
  { value: 'other',          label: '📌 Other',              color: '#374151' },
]

const URGENCY = [
  { value: 'low',      label: 'Low',      desc: 'Can wait a few days',    color: '#16a34a' },
  { value: 'medium',   label: 'Medium',   desc: 'Should be addressed soon', color: '#d97706' },
  { value: 'high',     label: 'High',     desc: 'Needs immediate action', color: '#dc2626' },
]

export default function GrievanceForm() {
  const fileRef = useRef(null)
  const [images, setImages]         = useState([])        // { file, preview, id }
  const [dragging, setDragging]     = useState(false)
  const [form, setForm]             = useState({
    category: '', title: '', description: '', urgency: 'medium',
    locationMode: 'manual',   // 'manual' | 'gps' | 'map'
    addressLine: '', landmark: '', pincode: '',
    lat: '', lng: '',
  })
  const [locLoading, setLocLoading] = useState(false)
  const [locError, setLocError]     = useState('')
  const [errors, setErrors]         = useState({})
  const [status, setStatus]         = useState('idle')    // idle | submitting | success

  // ── Image handling ──────────────────────────────────────────
  function addFiles(files) {
    const valid = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .slice(0, 4 - images.length)
    const mapped = valid.map(f => ({
      id: Math.random().toString(36).slice(2),
      file: f,
      preview: URL.createObjectURL(f),
    }))
    setImages(prev => [...prev, ...mapped].slice(0, 4))
  }

  function removeImage(id) {
    setImages(prev => {
      const img = prev.find(i => i.id === id)
      if (img) URL.revokeObjectURL(img.preview)
      return prev.filter(i => i.id !== id)
    })
  }

  const onDrop = useCallback(e => {
    e.preventDefault(); setDragging(false)
    addFiles(e.dataTransfer.files)
  }, [images.length])

  // ── GPS ─────────────────────────────────────────────────────
  function getGPS() {
    if (!navigator.geolocation) { setLocError('Geolocation not supported by your browser.'); return }
    setLocLoading(true); setLocError('')
    navigator.geolocation.getCurrentPosition(
      pos => {
        setForm(f => ({ ...f, lat: pos.coords.latitude.toFixed(6), lng: pos.coords.longitude.toFixed(6) }))
        setLocLoading(false)
      },
      () => { setLocError('Could not get location. Please allow location access.'); setLocLoading(false) }
    )
  }

  // ── Field change ────────────────────────────────────────────
  function change(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }))
  }

  // ── Validate ────────────────────────────────────────────────
  function validate() {
    const e = {}
    if (!form.category)                     e.category    = 'Please select a category.'
    if (!form.title.trim())                  e.title       = 'Please add a short title.'
    if (form.description.trim().length < 20) e.description = 'Add at least 20 characters of description.'
    if (form.locationMode === 'manual' && !form.addressLine.trim()) e.addressLine = 'Address is required.'
    if (form.locationMode === 'gps' && (!form.lat || !form.lng))   e.gps         = 'Click "Detect My Location" first.'
    if (images.length === 0)                 e.images      = 'Please upload at least one photo.'
    return e
  }

  // ── Submit ──────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setStatus('submitting')
    await new Promise(r => setTimeout(r, 1600))
    setStatus('success')
  }

  // ── Success ─────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className={styles.successWrap}>
        <div className={styles.successCard}>
          <div className={styles.successRing}><IconCheck /></div>
          <h2>Grievance Filed!</h2>
          <p>Your report has been submitted and assigned ID <strong>#GRV-{Math.floor(Math.random()*90000+10000)}</strong>. Municipal authorities have been notified.</p>
          <div className={styles.successMeta}>
            <span>📍 {form.addressLine || `${form.lat}, ${form.lng}`}</span>
            <span>🏷 {CATEGORIES.find(c=>c.value===form.category)?.label}</span>
          </div>
          <button className={styles.newBtn} onClick={() => { setStatus('idle'); setImages([]); setForm({ category:'',title:'',description:'',urgency:'medium',locationMode:'manual',addressLine:'',landmark:'',pincode:'',lat:'',lng:'' }) }}>
            File Another →
          </button>
        </div>
      </div>
    )
  }

  const charCount = form.description.length
  const selectedCat = CATEGORIES.find(c => c.value === form.category)

  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.headerIcon}>🗑️</span>
          <div>
            <h1 className={styles.pageTitle}>File a Grievance</h1>
            <p className={styles.pageDesc}>Report a civic issue and help keep your city clean.</p>
          </div>
        </div>
        <div className={styles.stepPills}>
          {['Evidence','Details','Location'].map((s,i) => (
            <span key={s} className={styles.step}><span className={styles.stepNum}>{i+1}</span>{s}</span>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className={styles.formLayout}>

        {/* ── LEFT COLUMN ─────────────────────────────────── */}
        <div className={styles.leftCol}>

          {/* Image Upload */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}><IconCamera /> Photo Evidence</h2>
            <p className={styles.cardSub}>Upload up to 4 photos. Clear images speed up resolution.</p>

            {/* Drop zone */}
            <div
              className={`${styles.dropZone} ${dragging ? styles.dropping : ''} ${errors.images ? styles.dropError : ''}`}
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => images.length < 4 && fileRef.current?.click()}
              role="button" tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
            >
              <input
                ref={fileRef} type="file" accept="image/*"
                multiple style={{ display: 'none' }}
                onChange={e => addFiles(e.target.files)}
              />
              {images.length === 0 ? (
                <div className={styles.dropInner}>
                  <div className={styles.dropIconWrap}><IconUpload /></div>
                  <p className={styles.dropTitle}>Drag & drop photos here</p>
                  <p className={styles.dropSub}>or <span className={styles.dropLink}>browse files</span> · JPG, PNG, WebP</p>
                </div>
              ) : (
                <div className={styles.previewGrid}>
                  {images.map(img => (
                    <div key={img.id} className={styles.previewThumb}>
                      <img src={img.preview} alt="Preview" />
                      <button type="button" className={styles.removeImg} onClick={e => { e.stopPropagation(); removeImage(img.id) }}><IconX /></button>
                    </div>
                  ))}
                  {images.length < 4 && (
                    <div className={styles.addMore}><IconUpload /><span>Add more</span></div>
                  )}
                </div>
              )}
            </div>
            {errors.images && <p className={styles.errMsg}>{errors.images}</p>}
          </section>

          {/* Category */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>🏷 Issue Category</h2>
            {errors.category && <p className={styles.errMsg}>{errors.category}</p>}
            <div className={styles.categoryGrid}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value} type="button"
                  className={`${styles.catChip} ${form.category === cat.value ? styles.catActive : ''}`}
                  style={form.category === cat.value ? { '--cat-color': cat.color } : {}}
                  onClick={() => { setForm(f => ({ ...f, category: cat.value })); setErrors(p => ({ ...p, category: '' })) }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </section>

        </div>{/* /leftCol */}

        {/* ── RIGHT COLUMN ────────────────────────────────── */}
        <div className={styles.rightCol}>

          {/* Details card */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>📝 Issue Details</h2>

            {/* Title */}
            <div className={styles.field}>
              <label className={styles.label}>Short Title <span className={styles.req}>*</span></label>
              <input
                className={`${styles.input} ${errors.title ? styles.inputErr : ''}`}
                name="title" type="text" maxLength={80}
                placeholder="e.g. Large garbage pile near State Bank ATM"
                value={form.title} onChange={change}
              />
              {errors.title && <p className={styles.errMsg}>{errors.title}</p>}
            </div>

            {/* Description */}
            <div className={styles.field}>
              <label className={styles.label}>
                Description <span className={styles.req}>*</span>
                <span className={`${styles.charCount} ${charCount > 400 ? styles.charWarn : ''}`}>{charCount}/500</span>
              </label>
              <textarea
                className={`${styles.textarea} ${errors.description ? styles.inputErr : ''}`}
                name="description" maxLength={500} rows={5}
                placeholder="Describe the issue clearly — what you see, how long it's been there, any smell or hazard…"
                value={form.description} onChange={change}
              />
              {errors.description && <p className={styles.errMsg}>{errors.description}</p>}
            </div>

            {/* Urgency */}
            <div className={styles.field}>
              <label className={styles.label}>Urgency Level</label>
              <div className={styles.urgencyRow}>
                {URGENCY.map(u => (
                  <button
                    key={u.value} type="button"
                    className={`${styles.urgencyBtn} ${form.urgency === u.value ? styles.urgencyActive : ''}`}
                    style={form.urgency === u.value ? { '--urg-color': u.color } : {}}
                    onClick={() => setForm(f => ({ ...f, urgency: u.value }))}
                  >
                    <span className={styles.urgencyLabel}>{u.label}</span>
                    <span className={styles.urgencyDesc}>{u.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Location card */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}><IconMapPin /> Location Tagging</h2>

            {/* Mode tabs */}
            <div className={styles.locTabs}>
              {[
                { k: 'manual', icon: '✍️', label: 'Type Address' },
                { k: 'gps',    icon: '📡', label: 'Use GPS' },
              ].map(t => (
                <button
                  key={t.k} type="button"
                  className={`${styles.locTab} ${form.locationMode === t.k ? styles.locTabActive : ''}`}
                  onClick={() => setForm(f => ({ ...f, locationMode: t.k }))}
                >{t.icon} {t.label}</button>
              ))}
            </div>

            {form.locationMode === 'manual' && (
              <div className={styles.locFields}>
                <div className={styles.field}>
                  <label className={styles.label}>Street Address / Area <span className={styles.req}>*</span></label>
                  <input
                    className={`${styles.input} ${errors.addressLine ? styles.inputErr : ''}`}
                    name="addressLine" type="text"
                    placeholder="e.g. Near Railway Station, MG Road"
                    value={form.addressLine} onChange={change}
                  />
                  {errors.addressLine && <p className={styles.errMsg}>{errors.addressLine}</p>}
                </div>
                <div className={styles.twoCol}>
                  <div className={styles.field}>
                    <label className={styles.label}>Landmark</label>
                    <input className={styles.input} name="landmark" type="text"
                      placeholder="e.g. Next to Temple"
                      value={form.landmark} onChange={change} />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>PIN Code</label>
                    <input className={styles.input} name="pincode" type="text"
                      maxLength={6} placeholder="421 001"
                      value={form.pincode} onChange={change} />
                  </div>
                </div>
              </div>
            )}

            {form.locationMode === 'gps' && (
              <div className={styles.gpsSection}>
                <button type="button" className={styles.gpsBtn} onClick={getGPS} disabled={locLoading}>
                  {locLoading ? <><IconLoader /> Detecting…</> : <><IconLocation /> Detect My Location</>}
                </button>
                {form.lat && form.lng && (
                  <div className={styles.gpsResult}>
                    <IconCheck />
                    <span>Location captured: <strong>{form.lat}, {form.lng}</strong></span>
                  </div>
                )}
                {locError && <p className={styles.errMsg}>{locError}</p>}
                {errors.gps && <p className={styles.errMsg}>{errors.gps}</p>}
                <p className={styles.locHint}>
                  <IconInfo /> Your browser will ask for permission to access your location.
                </p>
              </div>
            )}
          </section>

          {/* Submit */}
          <button type="submit" className={styles.submitBtn} disabled={status === 'submitting'}>
            {status === 'submitting'
              ? <><IconLoader /> Submitting Grievance…</>
              : <>🚀 Submit Grievance Report</>
            }
          </button>

          <p className={styles.submitNote}>
            Your report will be reviewed by municipal authorities within 24–48 hours.
          </p>

        </div>{/* /rightCol */}
      </form>
    </div>
  )
}

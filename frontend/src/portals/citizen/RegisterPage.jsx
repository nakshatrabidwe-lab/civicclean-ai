import React, { useState, useId } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { INDIA_LOCATIONS, STATE_LIST } from '../../shared/data/indiaCities'
import styles from './RegisterPage.module.css'

// ── tiny inline icons (no extra dep needed) ──────────────────
const IconUser     = () => <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/></svg>
const IconMail     = () => <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
const IconLock     = () => <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
const IconEye      = () => <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>
const IconEyeOff   = () => <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"/><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/></svg>
const IconMap      = () => <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>
const IconBuilding = () => <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12H4V4zm3 1h2v2H7V5zm0 4h2v2H7V9zm4-4h2v2h-2V5zm0 4h2v2h-2V9zM9 13h2v3H9v-3z" clipRule="evenodd"/></svg>
const IconCheck    = () => <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>

// ── Password strength helper ──────────────────────────────────
function getStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' }
  let score = 0
  if (pw.length >= 8)            score++
  if (/[A-Z]/.test(pw))          score++
  if (/[0-9]/.test(pw))          score++
  if (/[^A-Za-z0-9]/.test(pw))   score++
  const map = [
    { label: 'Too short',  color: '#dc2626' },
    { label: 'Weak',       color: '#dc2626' },
    { label: 'Fair',       color: '#d97706' },
    { label: 'Good',       color: '#2563eb' },
    { label: 'Strong',     color: '#16a34a' },
  ]
  return { score, ...map[score] }
}

// ── Field wrapper ─────────────────────────────────────────────
function Field({ label, error, hint, children, required }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>
        {label}{required && <span className={styles.required}>*</span>}
      </label>
      {children}
      {error && <p className={styles.errorMsg}>{error}</p>}
      {hint && !error && <p className={styles.hint}>{hint}</p>}
    </div>
  )
}

// ── Input with icon ───────────────────────────────────────────
function IconInput({ icon, rightSlot, error, ...props }) {
  return (
    <div className={`${styles.inputWrap} ${error ? styles.inputError : ''}`}>
      <span className={styles.iconLeft}>{icon}</span>
      <input className={styles.input} {...props} />
      {rightSlot && <span className={styles.iconRight}>{rightSlot}</span>}
    </div>
  )
}

// ── Select with icon ──────────────────────────────────────────
function IconSelect({ icon, error, children, ...props }) {
  return (
    <div className={`${styles.inputWrap} ${error ? styles.inputError : ''}`}>
      <span className={styles.iconLeft}>{icon}</span>
      <select className={`${styles.input} ${styles.select}`} {...props}>
        {children}
      </select>
      <span className={styles.chevron}>▾</span>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────
export default function RegisterPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: '', email: '', password: '', confirmPassword: '',
    phone: '', state: '', city: '',
  })
  const [showPw,    setShowPw]    = useState(false)
  const [showCpw,   setShowCpw]   = useState(false)
  const [errors,    setErrors]    = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)

  // Derived city list from selected state
  const cityList = form.state ? (INDIA_LOCATIONS[form.state] ?? []) : []
  const strength = getStrength(form.password)

  // ── handlers ────────────────────────────────────────────────
  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value,
      // reset city when state changes
      ...(name === 'state' ? { city: '' } : {}),
    }))
    // clear error on change
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function validate() {
    const e = {}
    if (!form.username.trim())                   e.username = 'Username is required.'
    else if (form.username.length < 3)            e.username = 'At least 3 characters.'
    else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) e.username = 'Only letters, numbers and underscores.'

    if (!form.email.trim())                      e.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.'

    if (!form.password)                          e.password = 'Password is required.'
    else if (form.password.length < 8)           e.password = 'At least 8 characters.'
    else if (strength.score < 2)                 e.password = 'Password is too weak.'

    if (!form.confirmPassword)                   e.confirmPassword = 'Please confirm your password.'
    else if (form.confirmPassword !== form.password) e.confirmPassword = 'Passwords do not match.'

    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit Indian mobile number.'

    if (!form.state)                             e.state = 'Please select your state.'
    if (form.state && !form.city)                e.city  = 'Please select your city.'

    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    // Simulate API call – replace with real fetch('/api/users/register', ...)
    await new Promise(r => setTimeout(r, 1400))
    setLoading(false)
    setSubmitted(true)
  }

  // ── Success screen ───────────────────────────────────────────
  if (submitted) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h2>You're registered!</h2>
          <p>Welcome to CivicClean AI, <strong>{form.username}</strong>. Your account has been created successfully.</p>
          <button className={styles.successBtn} onClick={() => navigate('/citizen')}>
            Go to Dashboard →
          </button>
        </div>
      </div>
    )
  }

  // ── Form ─────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      {/* Left panel – decorative */}
      <aside className={styles.panel} aria-hidden="true">
        <div className={styles.panelInner}>
          <div className={styles.panelLogo}>♻ CivicClean <em>AI</em></div>
          <p className={styles.panelTagline}>
            Join thousands of citizens helping build cleaner, smarter cities.
          </p>
          <ul className={styles.benefits}>
            {[
              'Report civic issues in seconds',
              'Track resolution in real time',
              'AI-powered smart categorisation',
              'Connect with your municipality',
            ].map(b => (
              <li key={b}><span className={styles.benefitCheck}><IconCheck /></span>{b}</li>
            ))}
          </ul>
          <div className={styles.panelDots} aria-hidden="true">
            {Array.from({ length: 30 }).map((_, i) => <span key={i} />)}
          </div>
        </div>
      </aside>

      {/* Right panel – form */}
      <main className={styles.formPanel}>
        <div className={styles.formCard}>

          {/* Header */}
          <div className={styles.formHeader}>
            <button className={styles.backLink} onClick={() => navigate('/')}>
              ← Back to Home
            </button>
            <h1 className={styles.title}>Create your account</h1>
            <p className={styles.subtitle}>
              Already have one?{' '}
              <Link to="/citizen/login" className={styles.loginLink}>Sign in</Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.grid}>

              {/* Username */}
              <Field label="Username" error={errors.username} required
                hint="Letters, numbers and underscores only.">
                <IconInput
                  icon={<IconUser />}
                  name="username" type="text"
                  placeholder="eg. civic_hero_42"
                  value={form.username}
                  onChange={handleChange}
                  autoComplete="username"
                  error={errors.username}
                />
              </Field>

              {/* Email */}
              <Field label="Email address" error={errors.email} required>
                <IconInput
                  icon={<IconMail />}
                  name="email" type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  error={errors.email}
                />
              </Field>

              {/* Password */}
              <Field label="Password" error={errors.password} required>
                <IconInput
                  icon={<IconLock />}
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  error={errors.password}
                  rightSlot={
                    <button
                      type="button"
                      className={styles.togglePw}
                      onClick={() => setShowPw(v => !v)}
                      aria-label={showPw ? 'Hide password' : 'Show password'}
                    >
                      {showPw ? <IconEyeOff /> : <IconEye />}
                    </button>
                  }
                />
                {/* Strength bar */}
                {form.password && (
                  <div className={styles.strengthWrap}>
                    <div className={styles.strengthBar}>
                      {[1,2,3,4].map(n => (
                        <div
                          key={n}
                          className={styles.strengthSegment}
                          style={{ background: n <= strength.score ? strength.color : undefined }}
                        />
                      ))}
                    </div>
                    <span className={styles.strengthLabel} style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                )}
              </Field>

              {/* Confirm Password */}
              <Field label="Confirm Password" error={errors.confirmPassword} required>
                <IconInput
                  icon={<IconLock />}
                  name="confirmPassword"
                  type={showCpw ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  error={errors.confirmPassword}
                  rightSlot={
                    <button
                      type="button"
                      className={styles.togglePw}
                      onClick={() => setShowCpw(v => !v)}
                      aria-label={showCpw ? 'Hide' : 'Show'}
                    >
                      {showCpw ? <IconEyeOff /> : <IconEye />}
                    </button>
                  }
                />
              </Field>

              {/* Phone (optional) */}
              <Field label="Mobile Number" error={errors.phone}
                hint="Optional – for issue update alerts.">
                <div className={styles.phoneWrap}>
                  <span className={styles.phoneCode}>🇮🇳 +91</span>
                  <div className={`${styles.inputWrap} ${styles.phoneInput} ${errors.phone ? styles.inputError : ''}`}>
                    <input
                      className={styles.input}
                      name="phone" type="tel"
                      placeholder="9876543210"
                      maxLength={10}
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </Field>

              {/* State */}
              <Field label="State / Union Territory" error={errors.state} required>
                <IconSelect
                  icon={<IconMap />}
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  error={errors.state}
                >
                  <option value="">— Select State —</option>
                  {STATE_LIST.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </IconSelect>
              </Field>

              {/* City – dependent on state */}
              <Field label="City" error={errors.city} required
                hint={!form.state ? 'Select a state first.' : undefined}>
                <IconSelect
                  icon={<IconBuilding />}
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  disabled={!form.state}
                  error={errors.city}
                >
                  <option value="">
                    {form.state ? '— Select City —' : '— Select State first —'}
                  </option>
                  {cityList.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </IconSelect>
              </Field>

            </div>{/* /grid */}

            {/* Submit */}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading
                ? <><span className={styles.spinner} />Creating account…</>
                : 'Create My Account →'
              }
            </button>

            <p className={styles.terms}>
              By registering you agree to our{' '}
              <a href="#" className={styles.loginLink}>Terms of Service</a> and{' '}
              <a href="#" className={styles.loginLink}>Privacy Policy</a>.
            </p>
          </form>
        </div>
      </main>
    </div>
  )
}

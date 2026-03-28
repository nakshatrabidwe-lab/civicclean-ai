import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './LandingPage.module.css'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <main className={styles.root}>
      {/* Background decoration */}
      <div className={styles.blob1} aria-hidden />
      <div className={styles.blob2} aria-hidden />

      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>♻</span>
          <span className={styles.logoText}>CivicClean <em>AI</em></span>
        </div>
      </header>

      <section className={styles.hero}>
        <h1 className={styles.headline}>
          Cleaner cities,<br />smarter governance.
        </h1>
        <p className={styles.sub}>
          AI-powered civic issue reporting for citizens and intelligent
          task management for municipal teams — all in one platform.
        </p>

        <div className={styles.cards}>
          {/* Citizen card */}
          <button
            className={`${styles.card} ${styles.cardCitizen}`}
            onClick={() => navigate('/citizen')}
          >
            <span className={styles.cardIcon}>🏘️</span>
            <span className={styles.cardTitle}>Citizen Portal</span>
            <span className={styles.cardDesc}>
              Report issues, track resolutions,<br />and engage with your city.
            </span>
            <span className={styles.cardCta}>Enter Portal →</span>
          </button>

          {/* Admin card */}
          <button
            className={`${styles.card} ${styles.cardAdmin}`}
            onClick={() => navigate('/admin')}
          >
            <span className={styles.cardIcon}>🏛️</span>
            <span className={styles.cardTitle}>Municipal Admin</span>
            <span className={styles.cardDesc}>
              Manage reports, dispatch crews,<br />and monitor city health.
            </span>
            <span className={styles.cardCta}>Enter Dashboard →</span>
          </button>
        </div>
      </section>
    </main>
  )
}

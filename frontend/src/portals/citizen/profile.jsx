import React, { useState } from 'react'
import styles from './Profile.module.css'

export default function Profile() {
  const [profile, setProfile] = useState({
    name: 'Nakshatra Bidwe',
    email: 'nakshatra@example.com',
    phone: '+91 98765 43210',
    city: 'Yavatmal, Maharashtra',
    emailAlerts: true,
    smsAlerts: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setProfile((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSave = (e) => {
    e.preventDefault()
    alert('Profile updated successfully!')
  }

  return (
    <div className={styles.container}>
      {/* Header Profile Banner */}
      <div className={styles.banner}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>NB</div>
          <div>
            <h1 className={styles.userName}>{profile.name}</h1>
            <p className={styles.userCity}>📍 {profile.city}</p>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>Reports Submitted</span>
            <span className={styles.statValue}>12</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statBox}>
            <span className={styles.statLabel}>Reward Points</span>
            <span className={styles.statValueHighlight}>480 pts</span>
          </div>
        </div>
      </div>

      {/* Main Form & Settings */}
      <div className={styles.contentGrid}>
        {/* Personal Info Card */}
        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>Personal Details</h3>
          <form onSubmit={handleSave}>
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>City / Ward</label>
                <input
                  type="text"
                  name="city"
                  value={profile.city}
                  onChange={handleChange}
                />
              </div>
            </div>
            <button type="submit" className={styles.saveBtn}>
              Save Changes
            </button>
          </form>
        </div>

        {/* Preferences Card */}
        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>Notification Preferences</h3>
          
          <div className={styles.preferenceRow}>
            <div>
              <strong>Email Notifications</strong>
              <p>Receive status changes on reported issues</p>
            </div>
            <input
              type="checkbox"
              name="emailAlerts"
              checked={profile.emailAlerts}
              onChange={handleChange}
            />
          </div>

          <div className={styles.preferenceRow}>
            <div>
              <strong>SMS Alerts</strong>
              <p>Instant SMS when dispatch team clears issue</p>
            </div>
            <input
              type="checkbox"
              name="smsAlerts"
              checked={profile.smsAlerts}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
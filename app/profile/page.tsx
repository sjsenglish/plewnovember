'use client'

import Navbar from '@/app/components/Navbar'
import BackButton from '@/app/components/BackButton'
import styles from './profile.module.css'

export default function Profile() {
  return (
    <div className={styles.container}>
      <Navbar />
      <BackButton />
      <div className={styles.content}>
        <div className={styles.profileCard}>
          <h1 className={styles.title}>Profile</h1>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Account Information</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label className={styles.label}>Email</label>
                <p className={styles.value}>Coming soon</p>
              </div>
              <div className={styles.infoItem}>
                <label className={styles.label}>Member Since</label>
                <p className={styles.value}>Coming soon</p>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Progress Stats</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <p className={styles.statValue}>0</p>
                <p className={styles.statLabel}>Packs Completed</p>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statValue}>0</p>
                <p className={styles.statLabel}>Total Questions</p>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statValue}>0%</p>
                <p className={styles.statLabel}>Accuracy</p>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Settings</h2>
            <div className={styles.settingsList}>
              <button className={styles.settingButton}>
                <span>Notification Preferences</span>
                <span className={styles.arrow}>→</span>
              </button>
              <button className={styles.settingButton}>
                <span>Language Settings</span>
                <span className={styles.arrow}>→</span>
              </button>
              <button className={styles.settingButton}>
                <span>Privacy Settings</span>
                <span className={styles.arrow}>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

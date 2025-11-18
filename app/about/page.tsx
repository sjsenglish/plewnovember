'use client'

import Navbar from '@/app/components/Navbar'
import BackButton from '@/app/components/BackButton'
import styles from './about.module.css'

export default function About() {
  return (
    <div className={styles.container}>
      <Navbar />
      <BackButton />
      <div className={styles.content}>
        <div className={styles.aboutCard}>
          <h1 className={styles.title}>Who We Are</h1>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Our Mission</h2>
            <p className={styles.text}>
              PLEW is dedicated to revolutionizing reading comprehension practice through
              AI-powered learning. We combine proven CSAT preparation methods with cutting-edge
              technology to help students master English reading comprehension.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>What Makes Us Different</h2>
            <div className={styles.featureGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🎯</div>
                <h3 className={styles.featureTitle}>Personalized Learning</h3>
                <p className={styles.featureText}>
                  AI-powered feedback tailored to your learning style and progress
                </p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>📚</div>
                <h3 className={styles.featureTitle}>Comprehensive Content</h3>
                <p className={styles.featureText}>
                  Multiple difficulty levels designed for CSAT English preparation
                </p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>📊</div>
                <h3 className={styles.featureTitle}>Progress Tracking</h3>
                <p className={styles.featureText}>
                  Monitor your improvement with detailed analytics and insights
                </p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>⚡</div>
                <h3 className={styles.featureTitle}>Instant Feedback</h3>
                <p className={styles.featureText}>
                  Get immediate responses and guidance as you practice
                </p>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Our Approach</h2>
            <p className={styles.text}>
              The PLEW method focuses on developing critical reading skills through
              interactive practice sessions. Our AI buddy guides you through each passage,
              helping you understand context, identify key information, and improve
              comprehension strategies.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Join Our Community</h2>
            <p className={styles.text}>
              Whether you're preparing for the CSAT or simply want to improve your reading
              comprehension skills, PLEW is here to support your learning journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

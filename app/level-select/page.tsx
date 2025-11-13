'use client'

import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/app/components/Navbar'
import BackButton from '@/app/components/BackButton'
import styles from './levelSelect.module.css'

const levels = [
  {
    id: 1,
    name: 'Level 1',
    iconUrl: 'https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Flevel-1-button.svg?alt=media&token=11fba54b-8e64-4485-8f66-52395470b701',
    href: '/pack-maker-level1',
    locked: false
  },
  {
    id: 2,
    name: 'Level 2',
    iconUrl: 'https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Flevel-2-button.svg?alt=media&token=dbe646a0-e048-4401-8817-51faf4cb6b39',
    href: '/pack-maker-level2',
    locked: true
  },
  {
    id: 3,
    name: 'Level 3',
    iconUrl: 'https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Flevel-3-button.svg?alt=media&token=53a1662b-3abe-469f-8057-c4e0ff445960',
    href: '/pack-maker-level3',
    locked: true
  }
]

export default function LevelSelect() {
  return (
    <div className={styles.container}>
      <Navbar />
      <BackButton />
      <div className={styles.content}>
        {/* Content layer */}
        <div className={styles.levelGrid}>
          {levels.map((level) => {
            if (level.locked) {
              return (
                <div
                  key={level.id}
                  className={`${styles.levelButton} ${styles.locked}`}
                >
                  <Image
                    src={level.iconUrl}
                    alt={level.name}
                    width={320}
                    height={320}
                    className={styles.levelImage}
                    unoptimized
                  />
                  <div className={styles.lockOverlay}>
                    <span className={styles.lockIcon}>🔒</span>
                  </div>
                </div>
              )
            }

            return (
              <Link
                key={level.id}
                href={level.href}
                className={styles.levelButton}
              >
                <Image
                  src={level.iconUrl}
                  alt={level.name}
                  width={320}
                  height={320}
                  className={styles.levelImage}
                  unoptimized
                />
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

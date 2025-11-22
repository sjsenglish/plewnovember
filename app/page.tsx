import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/app/components/Navbar'
import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        {/* Content layer */}
        <div className={styles.contentLayer}>
          {/* Icons container - side by side */}
          <div className={styles.iconsContainer}>
            {/* Dino icon with text - replaces old dino and start button */}
            <Link href="/pack-maker-level1" className={styles.iconCard}>
              <div className={styles.hoverContainer}>
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fdino.svg?alt=media&token=ff09f837-afd6-4e0b-aca7-938ab1603f54"
                  alt="Dino"
                  width={200}
                  height={200}
                  className={styles.icon}
                  priority
                />
              </div>
              <p className={styles.iconLabel}>옥스포드 로직리딩</p>
            </Link>

            {/* Ghost icon with text - linked to search page */}
            <Link href="/search" className={styles.iconCard}>
              <div className={styles.hoverContainer}>
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2FGHOST.svg?alt=media&token=52bbf8ba-2537-4a06-8b00-ff62287a3894"
                  alt="Ghost"
                  width={200}
                  height={200}
                  className={styles.icon}
                />
              </div>
              <p className={styles.iconLabel}>옥스포드 입시 문제은행</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
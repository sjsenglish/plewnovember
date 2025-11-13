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
          {/* Dino icon with bounce animation - clickable to next page */}
          <Link href="/level-select" className={styles.linkGroup}>
            <div className={styles.dinoContainer}>
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fdino-with-shadows-how-to-level-pages_option1.svg?alt=media&token=0191caff-8773-4fa2-b713-45d8495115ab"
                alt="Dino"
                width={200}
                height={200}
                className={styles.dinoImage}
                priority
              />
            </div>
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fstart-button.svg?alt=media&token=30366dfb-d1b5-4d23-afa0-88a197884e65"
              alt="Start"
              width={150}
              height={50}
              className={styles.startButton}
            />
          </Link>
        </div>
      </div>
    </div>
  )
}
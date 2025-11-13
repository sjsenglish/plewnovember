import PackSizeSelector from '@/app/components/PackSizeSelector'
import Navbar from '@/app/components/Navbar'
import BackButton from '@/app/components/BackButton'
import styles from './packMaker.module.css'

export default function PackMaker() {
  return (
    <div className={styles.container}>
      <Navbar />
      <BackButton />
      <div className={styles.content}>
        <div className={styles.innerContainer}>
          <PackSizeSelector />
        </div>
      </div>
    </div>
  )
}
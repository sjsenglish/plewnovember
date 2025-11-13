import PackSizeSelector from '@/app/components/PackSizeSelector'
import Navbar from '@/app/components/Navbar'
import BackButton from '@/app/components/BackButton'
import styles from './packMakerLevel3.module.css'

export default function PackMakerLevel3() {
  return (
    <div className={styles.container}>
      <Navbar />
      <BackButton />
      <div className={styles.content}>
        <div className={styles.innerContainer}>
          <PackSizeSelector level={3} />
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        {/* PLEW Logo - Top Left */}
        <div className={styles.logo}>
          PLEW
        </div>

        {/* Burger Menu - Top Right */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={styles.burgerButton}
          aria-label="Menu"
          type="button"
        >
          <span className={styles.burgerLine}></span>
          <span className={styles.burgerLine}></span>
          <span className={styles.burgerLine}></span>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className={styles.menuDropdown}>
          <div className={styles.menuContent}>
            <p className={styles.menuText}>Menu items coming soon...</p>
          </div>
        </div>
      )}
    </nav>
  )
}

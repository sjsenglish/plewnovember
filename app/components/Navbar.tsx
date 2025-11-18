'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        {/* PLEW Logo - Top Left */}
        <Link href="/" className={styles.logo}>
          PLEW
        </Link>

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
            <Link
              href="/profile"
              className={styles.menuItem}
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
            <Link
              href="/payment"
              className={styles.menuItem}
              onClick={() => setIsMenuOpen(false)}
            >
              Subscription
            </Link>
            <Link
              href="/about"
              className={styles.menuItem}
              onClick={() => setIsMenuOpen(false)}
            >
              Who We Are
            </Link>
            <Link
              href="/contact"
              className={styles.menuItem}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

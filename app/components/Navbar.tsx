'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated } = useAuth()

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        {/* Logo - Top Left */}
        <Link href="/" className={styles.logo}>
          옥스포드 PLEW
        </Link>

        <div className={styles.rightSection}>
          {/* Login/Signup Button or User Info */}
          {!isAuthenticated ? (
            <Link href="/login" className={styles.authButton}>
              로그인 / 회원가입
            </Link>
          ) : (
            <Link href="/profile" className={styles.userButton}>
              {user?.name || '프로필'}
            </Link>
          )}

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
              프로필
            </Link>
            <Link
              href="/payment"
              className={styles.menuItem}
              onClick={() => setIsMenuOpen(false)}
            >
              구독
            </Link>
            <Link
              href="/about"
              className={styles.menuItem}
              onClick={() => setIsMenuOpen(false)}
            >
              소개
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

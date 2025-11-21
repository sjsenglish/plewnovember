'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import styles from './login.module.css'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!email || !password) {
      setError('모든 필드를 입력해주세요')
      setIsLoading(false)
      return
    }

    const success = await login(email, password)

    if (success) {
      // Get redirect parameter from URL, default to home page
      const redirect = searchParams.get('redirect') || '/'
      router.push(redirect)
    } else {
      setError('이메일 또는 비밀번호가 잘못되었습니다')
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.loginCard}>
      <h1 className={styles.title}>로그인</h1>
      <p className={styles.subtitle}>PLEW에 다시 오신 것을 환영합니다</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            이메일
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            placeholder="your@email.com"
            autoComplete="email"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? '로그인 중...' : '로그인'}
        </button>
      </form>

      <div className={styles.footer}>
        <p className={styles.footerText}>
          계정이 없으신가요?{' '}
          <Link href="/signup" className={styles.link}>
            회원가입
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2FGHOST.svg?alt=media&token=52bbf8ba-2537-4a06-8b00-ff62287a3894"
          alt="Ghost"
          className={styles.ghostIcon}
        />
        <Suspense fallback={<div className={styles.loginCard}><p>로딩 중...</p></div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}

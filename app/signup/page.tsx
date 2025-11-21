'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import styles from './signup.module.css'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { signup } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    console.log('[DEBUG] Signup form submitted')

    if (!name || !email || !password || !confirmPassword) {
      console.log('[DEBUG] Validation failed: missing fields', { name: !!name, email: !!email, password: !!password, confirmPassword: !!confirmPassword })
      setError('모든 필드를 입력해주세요')
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      console.log('[DEBUG] Validation failed: passwords do not match')
      setError('비밀번호가 일치하지 않습니다')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      console.log('[DEBUG] Validation failed: password too short', { length: password.length })
      setError('비밀번호는 최소 6자 이상이어야 합니다')
      setIsLoading(false)
      return
    }

    console.log('[DEBUG] Form validation passed, calling signup function...', { email, name })
    const success = await signup(email, password, name)
    console.log('[DEBUG] Signup function returned:', { success })

    if (success) {
      router.push('/')
      console.log('[DEBUG] Signup successful, redirecting to /profile')
      router.push('/profile')
    } else {
      console.error('[ERROR] Signup failed - check browser console for detailed error logs')
      setError('회원가입에 실패했습니다. 이메일을 확인하고 다시 시도해주세요.')
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2FGHOST.svg?alt=media&token=52bbf8ba-2537-4a06-8b00-ff62287a3894"
          alt="Ghost"
          className={styles.ghostIcon}
        />
        <div className={styles.signupCard}>
          <h1 className={styles.title}>회원가입</h1>
          <p className={styles.subtitle}>PLEW 계정 만들기</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                이름
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
                placeholder="이름을 입력하세요"
                autoComplete="name"
              />
            </div>

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
                autoComplete="new-password"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                비밀번호 확인
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? '계정 생성 중...' : '회원가입'}
            </button>
          </form>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              이미 계정이 있으신가요?{' '}
              <Link href="/login" className={styles.link}>
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

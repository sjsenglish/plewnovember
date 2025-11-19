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
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      console.log('[DEBUG] Validation failed: passwords do not match')
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      console.log('[DEBUG] Validation failed: password too short', { length: password.length })
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    console.log('[DEBUG] Form validation passed, calling signup function...', { email, name })
    const success = await signup(email, password, name)
    console.log('[DEBUG] Signup function returned:', { success })

    if (success) {
      console.log('[DEBUG] Signup successful, redirecting to /profile')
      router.push('/profile')
    } else {
      console.error('[ERROR] Signup failed - check browser console for detailed error logs')
      setError('Signup failed. Please check your email and try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.signupCard}>
          <h1 className={styles.title}>Sign Up</h1>
          <p className={styles.subtitle}>Create your PLEW account</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
                placeholder="Your name"
                autoComplete="name"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
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
                Password
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
                Confirm Password
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
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              Already have an account?{' '}
              <Link href="/login" className={styles.link}>
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

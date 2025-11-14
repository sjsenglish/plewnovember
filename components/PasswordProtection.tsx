'use client'

import { useState, useEffect } from 'react'

const CORRECT_PASSWORD = 'SUNNY2025'
const PASSWORD_KEY = 'site-access-token'

export default function PasswordProtection({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user has already authenticated in this session
    const token = sessionStorage.getItem(PASSWORD_KEY)
    if (token === CORRECT_PASSWORD) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (password === CORRECT_PASSWORD) {
      sessionStorage.setItem(PASSWORD_KEY, password)
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Incorrect password. Please try again.')
      setPassword('')
    }
  }

  // Show loading state briefly to check session
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: 'url(https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fbackground.svg?alt=media&token=85f36310-0af9-49f9-9453-8e4064cad41e)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  // Show password prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          backgroundImage: 'url(https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fbackground.svg?alt=media&token=85f36310-0af9-49f9-9453-8e4064cad41e)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-md w-full">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 sm:p-10 border-4 border-purple-200">
            <div className="text-center mb-8">
              <div className="text-7xl mb-6 animate-bounce">🦕</div>
              <h1 className="text-4xl font-bold text-purple-800 mb-3 font-[var(--font-madimi)]">
                Welcome to PLEW!
              </h1>
              <p className="text-gray-700 text-lg">
                Enter the password to start your journey
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-purple-800 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 border-3 border-purple-300 rounded-2xl focus:ring-4 focus:ring-purple-400 focus:border-purple-500 transition-all text-lg shadow-sm"
                  placeholder="Enter password"
                  autoFocus
                />
              </div>

              {error && (
                <div className="bg-red-100 border-2 border-red-300 text-red-800 px-4 py-3 rounded-2xl text-sm font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
              >
                Unlock Adventure 🚀
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600 font-medium">
              🔒 Authorized access only
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render children if authenticated
  return <>{children}</>
}

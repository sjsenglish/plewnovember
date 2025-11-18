'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      // Get existing users
      const existingUsersStr = localStorage.getItem('users')
      const existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : []

      // Check if user already exists
      if (existingUsers.some((u: { email: string }) => u.email === email)) {
        return false
      }

      // Add new user
      const newUser = { email, password, name }
      existingUsers.push(newUser)
      localStorage.setItem('users', JSON.stringify(existingUsers))

      // Auto-login after signup
      const userInfo = { email, name }
      setUser(userInfo)
      localStorage.setItem('user', JSON.stringify(userInfo))

      return true
    } catch (error) {
      console.error('Signup error:', error)
      return false
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Get existing users
      const existingUsersStr = localStorage.getItem('users')
      const existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : []

      // Find user
      const foundUser = existingUsers.find(
        (u: { email: string; password: string; name: string }) =>
          u.email === email && u.password === password
      )

      if (foundUser) {
        const userInfo = { email: foundUser.email, name: foundUser.name }
        setUser(userInfo)
        localStorage.setItem('user', JSON.stringify(userInfo))
        return true
      }

      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  if (isLoading) {
    return null
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

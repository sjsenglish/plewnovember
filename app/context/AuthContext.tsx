'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User as SupabaseUser } from '@supabase/supabase-js'

interface User {
  email: string
  name: string
  id: string
  createdAt?: string
  subscriptionStatus?: string
  subscriptionEndDate?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  refreshUser: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          setUser({
            email: session.user.email!,
            name: session.user.user_metadata?.name || '',
            id: session.user.id,
            createdAt: session.user.created_at,
            subscriptionStatus: session.user.user_metadata?.subscription_status,
            subscriptionEndDate: session.user.user_metadata?.subscription_end_date
          })
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          email: session.user.email!,
          name: session.user.user_metadata?.name || '',
          id: session.user.id,
          createdAt: session.user.created_at,
          subscriptionStatus: session.user.user_metadata?.subscription_status,
          subscriptionEndDate: session.user.user_metadata?.subscription_end_date
        })
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    console.log('[DEBUG] Signup attempt started', { email, name, passwordLength: password.length })

    try {
      console.log('[DEBUG] Calling supabase.auth.signUp...')
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      })

      console.log('[DEBUG] Supabase signUp response:', {
        hasData: !!data,
        hasUser: !!data?.user,
        userId: data?.user?.id,
        userEmail: data?.user?.email,
        hasError: !!error,
        errorMessage: error?.message,
        errorStatus: error?.status,
        errorCode: error?.name
      })

      if (error) {
        console.error('[ERROR] Signup failed:', {
          message: error.message,
          status: error.status,
          name: error.name,
          fullError: error
        })
        return false
      }

      if (data.user) {
        console.log('[DEBUG] User created successfully:', {
          userId: data.user.id,
          email: data.user.email,
          emailConfirmed: data.user.email_confirmed_at,
          confirmationSent: data.user.confirmation_sent_at
        })

        setUser({
          email: data.user.email!,
          name,
          id: data.user.id,
          createdAt: data.user.created_at,
          subscriptionStatus: data.user.user_metadata?.subscription_status,
          subscriptionEndDate: data.user.user_metadata?.subscription_end_date
        })
        console.log('[DEBUG] User state updated in context')
        return true
      }

      console.warn('[WARN] No error but no user returned from signup')
      return false
    } catch (error) {
      console.error('[ERROR] Signup exception:', {
        error,
        errorType: typeof error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : undefined
      })
      return false
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Login error:', error.message)
        return false
      }

      if (data.user) {
        setUser({
          email: data.user.email!,
          name: data.user.user_metadata?.name || '',
          id: data.user.id,
          createdAt: data.user.created_at,
          subscriptionStatus: data.user.user_metadata?.subscription_status,
          subscriptionEndDate: data.user.user_metadata?.subscription_end_date
        })
        return true
      }

      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const refreshUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        // Force refresh the session to get latest metadata
        const { data: { user: refreshedUser }, error } = await supabase.auth.getUser()

        if (refreshedUser && !error) {
          setUser({
            email: refreshedUser.email!,
            name: refreshedUser.user_metadata?.name || '',
            id: refreshedUser.id,
            createdAt: refreshedUser.created_at,
            subscriptionStatus: refreshedUser.user_metadata?.subscription_status,
            subscriptionEndDate: refreshedUser.user_metadata?.subscription_end_date
          })
        }
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
    }
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
        refreshUser,
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

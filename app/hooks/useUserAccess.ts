'use client'

import { useState, useEffect } from 'react'
import { UserAccessCheck } from '@/lib/types/user-tracking'

export function useUserAccess(userEmail: string | null | undefined) {
  const [access, setAccess] = useState<UserAccessCheck | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userEmail) {
      setIsLoading(false)
      return
    }

    const fetchAccess = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(
          `/api/user-profile?userEmail=${encodeURIComponent(userEmail)}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch user access')
        }

        const data = await response.json()
        setAccess(data.access)
      } catch (err) {
        console.error('Error fetching user access:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAccess()
  }, [userEmail])

  const refresh = async () => {
    if (!userEmail) return

    try {
      const response = await fetch(
        `/api/user-profile?userEmail=${encodeURIComponent(userEmail)}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch user access')
      }

      const data = await response.json()
      setAccess(data.access)
    } catch (err) {
      console.error('Error refreshing user access:', err)
    }
  }

  return {
    access,
    isLoading,
    error,
    refresh,
  }
}

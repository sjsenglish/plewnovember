'use client'

import { useState, useEffect } from 'react'

export default function Timer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}mins`
  }

  return (
    <span className="font-inter font-semibold text-sm text-gray-900">
      {formatTime(seconds)}
    </span>
  )
}

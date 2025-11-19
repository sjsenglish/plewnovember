'use client'

import React from 'react'
import { AlertCircle } from 'lucide-react'

interface AccessLimitBannerProps {
  questionsRemaining: number
  onUpgrade: () => void
}

export default function AccessLimitBanner({
  questionsRemaining,
  onUpgrade,
}: AccessLimitBannerProps) {
  if (questionsRemaining < 0) return null // Premium users

  return (
    <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 text-yellow-600" size={20} />
        <div className="flex-1">
          <h3 className="font-semibold text-yellow-900">
            {questionsRemaining === 0 ? 'Free Trial Complete' : `${questionsRemaining} Question${questionsRemaining !== 1 ? 's' : ''} Remaining`}
          </h3>
          <p className="mt-1 text-sm text-yellow-800">
            {questionsRemaining === 0
              ? 'You\'ve used all your free questions. Upgrade to premium for unlimited access!'
              : `You have ${questionsRemaining} question${questionsRemaining !== 1 ? 's' : ''} left in your free trial. Upgrade for unlimited practice!`
            }
          </p>
          <button
            onClick={onUpgrade}
            className="mt-3 rounded-lg bg-yellow-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-yellow-700"
          >
            Upgrade to Premium
          </button>
        </div>
      </div>
    </div>
  )
}

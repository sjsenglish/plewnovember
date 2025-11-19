'use client'

import React from 'react'
import { X } from 'lucide-react'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  questionsCompleted: number
  onUpgrade: () => void
}

export default function UpgradeModal({
  isOpen,
  onClose,
  questionsCompleted,
  onUpgrade,
}: UpgradeModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="mb-4 text-6xl">🎓</div>

          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Free Limit Reached
          </h2>

          <p className="mb-6 text-gray-600">
            You've completed <span className="font-semibold text-blue-600">{questionsCompleted}</span> question{questionsCompleted !== 1 ? 's' : ''}.
            <br />
            Upgrade to premium for unlimited access!
          </p>

          {/* Features */}
          <div className="mb-6 space-y-3 rounded-lg bg-blue-50 p-4 text-left">
            <div className="flex items-start gap-3">
              <span className="text-xl">✓</span>
              <span className="text-sm text-gray-700">Unlimited question packs</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">✓</span>
              <span className="text-sm text-gray-700">Full AI tutoring support</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">✓</span>
              <span className="text-sm text-gray-700">Track your progress over time</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">✓</span>
              <span className="text-sm text-gray-700">All difficulty levels</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onUpgrade}
              className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Upgrade to Premium
            </button>
            <button
              onClick={onClose}
              className="w-full rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

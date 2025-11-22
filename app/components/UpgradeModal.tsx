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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-[rgba(249,249,255,0.95)] p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition-all duration-200 hover:bg-gray-100 hover:text-gray-600"
          aria-label="닫기"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="mb-6 text-6xl">🎓</div>

          <h2 className="mb-4 text-3xl font-madimi tracking-custom text-black">
            무료 한도 도달
          </h2>

          <div className="mb-6 rounded-xl bg-gradient-to-br from-custom-cyan via-custom-purple to-custom-pink p-6">
            <p className="font-figtree text-lg tracking-custom text-black">
              <span className="text-2xl font-bold">{questionsCompleted}개</span>의 문제를 완료했습니다
            </p>
          </div>

          <p className="mb-8 font-figtree text-base tracking-custom text-gray-700">
            프리미엄으로 업그레이드하여
            <br />
            무제한으로 학습하세요!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onUpgrade}
              className="w-full rounded-lg bg-gradient-to-r from-custom-cyan to-custom-purple px-6 py-4 font-madimi text-xl tracking-custom text-black shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              프리미엄 업그레이드
            </button>
            <button
              onClick={onClose}
              className="w-full rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-figtree text-base tracking-custom text-gray-700 transition-all duration-200 hover:bg-gray-50"
            >
              나중에
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

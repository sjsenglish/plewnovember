'use client'

import { useState } from 'react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md relative z-50">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        {/* PLEW Logo */}
        <div className="font-madimi text-2xl sm:text-3xl font-bold text-gray-900">
          PLEW
        </div>

        {/* Burger Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex flex-col justify-center items-center w-10 h-10 space-y-1.5 focus:outline-none"
          aria-label="Menu"
        >
          <span className="block w-8 h-0.5 bg-gray-900"></span>
          <span className="block w-8 h-0.5 bg-gray-900"></span>
          <span className="block w-8 h-0.5 bg-gray-900"></span>
        </button>
      </div>

      {/* Mobile Menu Dropdown (for future use) */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg">
          <div className="px-4 py-4">
            <p className="font-madimi text-gray-600 text-center">Menu items coming soon...</p>
          </div>
        </div>
      )}
    </nav>
  )
}

'use client'

import { useState } from 'react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md relative z-50" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="flex items-center justify-between px-8 sm:px-12 py-8">
        {/* PLEW Logo */}
        <div className="font-madimi text-4xl sm:text-6xl font-bold text-gray-900">
          PLEW
        </div>

        {/* Burger Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex flex-col justify-center items-center w-16 h-16 space-y-2.5 focus:outline-none"
          aria-label="Menu"
        >
          <span className="block w-12 h-1 bg-gray-900"></span>
          <span className="block w-12 h-1 bg-gray-900"></span>
          <span className="block w-12 h-1 bg-gray-900"></span>
        </button>
      </div>

      {/* Mobile Menu Dropdown (for future use) */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg">
          <div className="px-8 py-8">
            <p className="font-madimi text-gray-600 text-center text-xl">Menu items coming soon...</p>
          </div>
        </div>
      )}
    </nav>
  )
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <Link href="/">
        <h1>PLEW Method</h1>
      </Link>
      <button
        className="hamburger-button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
      >
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
      </button>

      {menuOpen && (
        <div style={{
          position: 'absolute',
          top: '60px',
          right: '40px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #000000',
          borderRadius: '4px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          padding: '10px',
          minWidth: '150px'
        }}>
          <Link
            href="/"
            style={{
              display: 'block',
              padding: '8px 12px',
              color: '#000000',
              textDecoration: 'none',
              fontSize: '14px'
            }}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/practice"
            style={{
              display: 'block',
              padding: '8px 12px',
              color: '#000000',
              textDecoration: 'none',
              fontSize: '14px'
            }}
            onClick={() => setMenuOpen(false)}
          >
            Practice
          </Link>
          <Link
            href="/pack-maker"
            style={{
              display: 'block',
              padding: '8px 12px',
              color: '#000000',
              textDecoration: 'none',
              fontSize: '14px'
            }}
            onClick={() => setMenuOpen(false)}
          >
            Pack Maker
          </Link>
        </div>
      )}
    </nav>
  );
}

'use client'

import { useState } from 'react'

export default function MarketingNav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 py-5 border-b border-gray-100 relative">
      <a href="/" className="text-xl font-black tracking-tight text-gray-900">OGRewards</a>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-6">
        <a href="#how" className="text-sm font-medium text-gray-900 hover:opacity-70 transition-opacity">How it works</a>
        <a href="#pricing" className="text-sm font-medium text-gray-900 hover:opacity-70 transition-opacity">Pricing</a>
        <a href="/login" className="text-sm font-medium text-gray-900 hover:opacity-70 transition-opacity">Login</a>
        <a href="mailto:admin@ogrewards.io"
          className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: '#1a1a2e' }}>
          Get Started
        </a>
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-2"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu">
        <span className={`block h-0.5 w-6 bg-gray-900 transition-all duration-200 ${open ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`block h-0.5 w-6 bg-gray-900 transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
        <span className={`block h-0.5 w-6 bg-gray-900 transition-all duration-200 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg z-50 flex flex-col md:hidden">
          <a href="#how" onClick={() => setOpen(false)} className="px-6 py-4 text-sm font-medium text-gray-900 border-b border-gray-50 hover:bg-gray-50">How it works</a>
          <a href="#pricing" onClick={() => setOpen(false)} className="px-6 py-4 text-sm font-medium text-gray-900 border-b border-gray-50 hover:bg-gray-50">Pricing</a>
          <a href="/login" onClick={() => setOpen(false)} className="px-6 py-4 text-sm font-medium text-gray-900 border-b border-gray-50 hover:bg-gray-50">Login</a>
          <div className="px-6 py-4">
            <a href="mailto:admin@ogrewards.io"
              className="block text-center px-4 py-3 rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: '#1a1a2e' }}>
              Get Started
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}

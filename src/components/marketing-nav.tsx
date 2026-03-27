'use client'

import { useState } from 'react'

export default function MarketingNav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 py-5 border-b border-white/10 relative z-50">
      <a href="/" className="text-xl font-black tracking-tight text-white flex items-center gap-2">
        <span className="h-7 w-7 rounded-lg flex items-center justify-center text-black text-sm font-black" style={{ backgroundColor: '#00d084' }}>O</span>
        OGRewards
      </a>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-8">
        <a href="#how" className="text-sm text-white/60 hover:text-white transition-colors">How it works</a>
        <a href="#pricing" className="text-sm text-white/60 hover:text-white transition-colors">Pricing</a>
        <a href="#brands" className="text-sm text-white/60 hover:text-white transition-colors">Brands</a>
      </div>

      <div className="hidden md:flex items-center gap-3">
        <a href="/admin/login"
          className="px-4 py-2 rounded-full text-sm font-bold border transition-all hover:bg-white/10"
          style={{ borderColor: '#00d084', color: '#00d084' }}>
          Brand Login
        </a>
        <a href="/login"
          className="px-4 py-2 rounded-full text-sm font-bold text-black transition-all hover:opacity-90"
          style={{ backgroundColor: '#00d084' }}>
          Customer Portal
        </a>
      </div>

      {/* Mobile hamburger */}
      <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
        <span className={`block h-0.5 w-6 bg-white transition-all duration-200 ${open ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`block h-0.5 w-6 bg-white transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
        <span className={`block h-0.5 w-6 bg-white transition-all duration-200 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-full left-0 right-0 border-b border-white/10 z-50 flex flex-col md:hidden" style={{ backgroundColor: '#0a0a0a' }}>
          <a href="#how" onClick={() => setOpen(false)} className="px-6 py-4 text-sm text-white/70 border-b border-white/10 hover:text-white">How it works</a>
          <a href="#pricing" onClick={() => setOpen(false)} className="px-6 py-4 text-sm text-white/70 border-b border-white/10 hover:text-white">Pricing</a>
          <a href="#brands" onClick={() => setOpen(false)} className="px-6 py-4 text-sm text-white/70 border-b border-white/10 hover:text-white">Brands</a>
          <a href="/admin/login" onClick={() => setOpen(false)} className="px-6 py-4 text-sm font-bold border-b border-white/10" style={{ color: '#00d084' }}>Brand Login</a>
          <div className="px-6 py-4">
            <a href="/login" className="block text-center px-4 py-3 rounded-full text-sm font-bold text-black" style={{ backgroundColor: '#00d084' }}>Customer Portal</a>
          </div>
        </div>
      )}
    </nav>
  )
}

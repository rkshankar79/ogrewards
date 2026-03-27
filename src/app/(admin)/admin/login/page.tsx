'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const GREEN = '#00d084'

export default function AdminLoginPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/admin-callback` },
    })
    if (authError) { setError(authError.message); setLoading(false); return }
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#080808' }}>
      {/* Grid bg */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(0,208,132,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,208,132,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(ellipse, #00d084 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4">
        {sent ? (
          <div className="text-center">
            <div className="text-5xl mb-4">📬</div>
            <h1 className="text-xl font-black text-white mb-2">Check your email</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>Magic link sent to <span className="text-white font-semibold">{email}</span></p>
          </div>
        ) : (
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <a href="/" className="inline-flex items-center gap-2 mb-6">
                <span className="h-8 w-8 rounded-lg flex items-center justify-center text-black text-sm font-black" style={{ backgroundColor: GREEN }}>O</span>
                <span className="text-xl font-black text-white">OGRewards</span>
              </a>
              <h1 className="text-2xl font-black text-white">Brand Admin Portal</h1>
              <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Sign in to manage your rewards</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-1">Email</label>
                <input
                  id="email" type="email" placeholder="you@yourbrand.com"
                  value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full h-12 px-4 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2"
                  style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', '--tw-ring-color': GREEN } as React.CSSProperties}
                />
              </div>

              {error && (
                <div className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full h-12 rounded-xl font-bold text-black text-base transition-all hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: GREEN }}>
                {loading ? 'Sending...' : 'Send Magic Link'}
              </button>
            </form>

            <p className="text-center text-xs mt-6" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Not a brand partner? <a href="/login" style={{ color: GREEN }}>Customer portal →</a>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

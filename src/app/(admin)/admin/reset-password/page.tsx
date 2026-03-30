'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const GREEN = '#00d084'

export default function ResetPasswordPage() {
  const supabase = createClient()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }

    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.updateUser({ password })

    if (authError) { setError(authError.message); setLoading(false); return }

    router.push('/admin/login?reset=success')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#080808' }}>
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(0,208,132,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,208,132,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(ellipse, #00d084 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <a href="/" className="inline-flex items-center gap-2 mb-6">
              <span className="h-8 w-8 rounded-lg flex items-center justify-center text-black text-sm font-black" style={{ backgroundColor: GREEN }}>O</span>
              <span className="text-xl font-black text-white">OGRewards</span>
            </a>
            <h1 className="text-2xl font-black text-white">New Password</h1>
            <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Choose a strong password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-1">New Password</label>
              <input
                id="password" type="password" placeholder="Min. 8 characters" autoComplete="new-password"
                value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full h-12 px-4 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2"
                style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', '--tw-ring-color': GREEN } as React.CSSProperties}
              />
            </div>

            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-white mb-1">Confirm Password</label>
              <input
                id="confirm" type="password" placeholder="Repeat password" autoComplete="new-password"
                value={confirm} onChange={e => setConfirm(e.target.value)} required
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
              {loading ? 'Updating...' : 'Set New Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

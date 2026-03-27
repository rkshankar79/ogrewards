'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useBrand } from '@/lib/brand-context'

const GREEN = '#00d084'

function getAge(dob: string): number {
  const today = new Date()
  const birthDate = new Date(dob)
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
  return age
}

export default function LandingPage() {
  const brand = useBrand()
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()

  const [mode, setMode] = useState<'signup' | 'signin'>('signup')
  const [email, setEmail] = useState('')
  const [dob, setDob] = useState('')
  const [stateConfirm, setStateConfirm] = useState(false)
  const [termsConfirm, setTermsConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function switchMode(next: 'signup' | 'signin') {
    setMode(next)
    setError('')
    setDob('')
    setStateConfirm(false)
    setTermsConfirm(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (mode === 'signup') {
      if (getAge(dob) < 21) { setError('You must be 21 or older to participate.'); return }
      if (!stateConfirm || !termsConfirm) { setError('Please confirm all requirements.'); return }
    }
    setLoading(true)
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?brand=${params.brand}`,
        data: mode === 'signup' ? { date_of_birth: dob, state: 'IL', brand_slug: params.brand } : {},
      },
    })
    if (authError) { setError(authError.message); setLoading(false); return }
    router.push(`/${params.brand}/check-email?email=${encodeURIComponent(email)}`)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#080808' }}>
      {/* Grid bg */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(0,208,132,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,208,132,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />
      {/* Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(ellipse, #00d084 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="relative z-10 flex flex-col flex-1">
        {/* Top brand */}
        <div className="px-5 pt-12 pb-8 text-center">
          {brand.logo_url ? (
            <img src={brand.logo_url} alt={brand.name} className="h-16 mx-auto mb-4 object-contain" />
          ) : (
            <div className="h-16 w-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl font-black text-white"
              style={{ backgroundColor: brand.primary_color }}>
              {brand.name[0]}
            </div>
          )}
          <h1 className="text-2xl font-black text-white">{brand.name} Rewards</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Scan receipts. Get real cash back.</p>
        </div>

        {/* Form */}
        <div className="flex-1 px-5 max-w-sm mx-auto w-full">
          {/* Tab toggle */}
          <div className="flex rounded-xl overflow-hidden border mb-6 p-1" style={{ borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)' }}>
            {(['signup', 'signin'] as const).map(m => (
              <button key={m} type="button" onClick={() => switchMode(m)}
                className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{
                  backgroundColor: mode === m ? GREEN : 'transparent',
                  color: mode === m ? '#000' : 'rgba(255,255,255,0.5)',
                }}>
                {m === 'signup' ? 'Create Account' : 'Sign In'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-1">Email address</label>
              <input
                id="email" type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full h-12 px-4 rounded-xl text-base text-white placeholder-white/30 focus:outline-none focus:ring-2"
                style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', '--tw-ring-color': GREEN } as React.CSSProperties}
              />
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>We'll send a magic link — no password needed.</p>
            </div>

            {mode === 'signup' && (
              <>
                <div>
                  <label htmlFor="dob" className="block text-sm font-medium text-white mb-1">Date of Birth</label>
                  <input
                    id="dob" type="date" value={dob} onChange={e => setDob(e.target.value)} required
                    className="w-full h-12 px-4 rounded-xl text-white focus:outline-none focus:ring-2"
                    style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', colorScheme: 'dark', '--tw-ring-color': GREEN } as React.CSSProperties}
                  />
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Must be 21 or older</p>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={stateConfirm} onChange={e => setStateConfirm(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded flex-shrink-0" style={{ accentColor: GREEN }} />
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>I confirm I am an Illinois resident and cannabis consumer</span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={termsConfirm} onChange={e => setTermsConfirm(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded flex-shrink-0" style={{ accentColor: GREEN }} />
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>I agree to the Terms & Conditions. No purchase necessary to join.</span>
                </label>
              </>
            )}

            {error && (
              <div className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full h-12 rounded-xl font-bold text-black text-base transition-all active:scale-95 disabled:opacity-60"
              style={{ backgroundColor: GREEN }}>
              {loading ? 'Sending link...' : 'Send My Magic Link'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs py-6" style={{ color: 'rgba(255,255,255,0.2)' }}>Powered by OGRewards</p>
      </div>
    </div>
  )
}

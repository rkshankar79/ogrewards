'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useBrand } from '@/lib/brand-context'

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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top brand bar */}
      <div className="px-5 pt-12 pb-8 text-center">
        {brand.logo_url ? (
          <img src={brand.logo_url} alt={brand.name} className="h-16 mx-auto mb-4 object-contain" />
        ) : (
          <div
            className="h-16 w-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl font-black text-white"
            style={{ backgroundColor: brand.primary_color }}>
            {brand.name[0]}
          </div>
        )}
        <h1 className="text-2xl font-black text-gray-900">{brand.name} Rewards</h1>
        <p className="text-gray-900 text-sm mt-1">Scan receipts. Get real cash back.</p>
      </div>

      {/* Form */}
      <div className="flex-1 px-5 max-w-sm mx-auto w-full">
        {/* Tab toggle */}
        <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6 p-1 bg-gray-50">
          {(['signup', 'signin'] as const).map(m => (
            <button key={m} type="button" onClick={() => switchMode(m)}
              className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                backgroundColor: mode === m ? brand.primary_color : 'transparent',
                color: mode === m ? '#fff' : '#6b7280',
              }}>
              {m === 'signup' ? 'Create Account' : 'Sign In'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input
              id="email" type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-base focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': brand.primary_color } as React.CSSProperties}
            />
            <p className="text-xs text-gray-400 mt-1">We'll send a magic link — no password needed.</p>
          </div>

          {mode === 'signup' && (
            <>
              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  id="dob" type="date" value={dob} onChange={e => setDob(e.target.value)} required
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': brand.primary_color } as React.CSSProperties}
                />
                <p className="text-xs text-gray-400 mt-1">Must be 21 or older</p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox" checked={stateConfirm} onChange={e => setStateConfirm(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-current flex-shrink-0"
                  style={{ accentColor: brand.primary_color }}
                />
                <span className="text-sm text-gray-600">I confirm I am an Illinois resident and cannabis consumer</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox" checked={termsConfirm} onChange={e => setTermsConfirm(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 flex-shrink-0"
                  style={{ accentColor: brand.primary_color }}
                />
                <span className="text-sm text-gray-600">I agree to the Terms & Conditions. No purchase necessary to join.</span>
              </label>
            </>
          )}

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full h-12 rounded-xl font-bold text-white text-base transition-all active:scale-95 disabled:opacity-60"
            style={{ backgroundColor: brand.primary_color }}>
            {loading ? 'Sending link...' : 'Send My Magic Link'}
          </button>
        </form>

      </div>

      <p className="text-center text-xs text-gray-300 py-6">Powered by OGRewards</p>
    </div>
  )
}

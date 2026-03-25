'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useBrand } from '@/lib/brand-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

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

  const [email, setEmail] = useState('')
  const [dob, setDob] = useState('')
  const [stateConfirm, setStateConfirm] = useState(false)
  const [termsConfirm, setTermsConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (getAge(dob) < 21) {
      setError('You must be 21 or older to participate.')
      return
    }

    if (!stateConfirm || !termsConfirm) {
      setError('Please confirm all requirements.')
      return
    }

    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?brand=${params.brand}`,
        data: {
          date_of_birth: dob,
          state: 'IL',
          brand_slug: params.brand,
        },
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push(`/${params.brand}/check-email?email=${encodeURIComponent(email)}`)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Brand Header */}
      <div className="mb-8 text-center">
        {brand.logo_url ? (
          <img src={brand.logo_url} alt={brand.name} className="h-16 mx-auto mb-4 object-contain" />
        ) : (
          <div
            className="h-16 w-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl"
            style={{ backgroundColor: brand.primary_color }}
          >
            {brand.name[0]}
          </div>
        )}
        <h1 className="text-2xl font-bold">{brand.name} Rewards</h1>
        <p className="text-muted-foreground mt-1">Scan receipts. Earn real cash back.</p>
      </div>

      {/* How it works */}
      <div className="w-full max-w-sm mb-8">
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { step: '1', label: 'Buy', desc: `${brand.name} products` },
            { step: '2', label: 'Scan', desc: 'Your receipt' },
            { step: '3', label: 'Earn', desc: 'Real cash back' },
          ].map(({ step, label, desc }) => (
            <div key={step} className="flex flex-col items-center gap-1">
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: brand.primary_color }}
              >
                {step}
              </div>
              <span className="font-semibold text-sm">{label}</span>
              <span className="text-xs text-muted-foreground">{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sign Up Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">
            We'll send a magic link — no password needed.
          </p>
        </div>

        <div className="space-y-1">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input
            id="dob"
            type="date"
            value={dob}
            onChange={e => setDob(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">Must be 21 or older to participate</p>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="state"
            checked={stateConfirm}
            onCheckedChange={v => setStateConfirm(!!v)}
          />
          <Label htmlFor="state" className="text-sm leading-relaxed cursor-pointer">
            I confirm I am an Illinois resident and cannabis consumer
          </Label>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="terms"
            checked={termsConfirm}
            onCheckedChange={v => setTermsConfirm(!!v)}
          />
          <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
            I agree to the Terms & Conditions. No purchase necessary to join.
          </Label>
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <Button
          type="submit"
          className="w-full text-white"
          style={{ backgroundColor: brand.primary_color }}
          disabled={loading}
        >
          {loading ? 'Sending your link...' : 'Send My Magic Link'}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Already have an account? Enter your email above to sign in.
        </p>
      </form>
    </div>
  )
}

'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useBrand } from '@/lib/brand-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PAYOUT_THRESHOLD } from '@/types'

type Step = 'select' | 'confirm' | 'success' | 'error'

function CashOutContent() {
  const brand = useBrand()
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const walletId = searchParams.get('wallet')
  const supabase = createClient()

  const [balance, setBalance] = useState<number>(0)
  const [method, setMethod] = useState<'venmo' | 'paypal' | null>(null)
  const [destination, setDestination] = useState('')
  const [step, setStep] = useState<Step>('select')
  const [loading, setLoading] = useState(false)
  const [resultMessage, setResultMessage] = useState('')
  const [amount, setAmount] = useState(0)

  useEffect(() => {
    async function fetchBalance() {
      if (!walletId) return
      const { data } = await supabase
        .from('brand_wallets')
        .select('balance')
        .eq('id', walletId)
        .single()
      if (data) setBalance(Number(data.balance))
    }
    fetchBalance()
  }, [walletId])

  async function handleSubmit() {
    if (!method || !destination || !walletId) return
    setLoading(true)

    const res = await fetch('/api/payouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet_id: walletId, method, destination }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setResultMessage(data.error || 'Something went wrong.')
      setStep('error')
    } else {
      setAmount(data.amount)
      setResultMessage(data.message)
      setStep('success')
    }
  }

  const isVenmo = method === 'venmo'
  const placeholder = isVenmo ? '@your-venmo-handle' : 'you@example.com'
  const label = isVenmo ? 'Venmo handle' : 'PayPal email'

  return (
    <div className="min-h-screen flex flex-col px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => step === 'select' ? router.back() : setStep('select')} className="text-muted-foreground text-sm">
          ← Back
        </button>
        <h1 className="text-xl font-bold">Cash Out</h1>
      </div>

      {/* Success */}
      {step === 'success' && (
        <div className="flex flex-col items-center justify-center flex-1 text-center">
          <div className="text-6xl mb-4">💸</div>
          <h2 className="text-2xl font-bold mb-2">Payment Sent!</h2>
          <p className="text-4xl font-bold mb-2" style={{ color: brand.primary_color }}>
            ${amount.toFixed(2)}
          </p>
          <p className="text-muted-foreground mb-8">{resultMessage}</p>
          <Button
            onClick={() => router.push(`/${params.brand}/dashboard`)}
            className="w-full max-w-xs text-white"
            style={{ backgroundColor: brand.primary_color }}
          >
            Back to Dashboard
          </Button>
        </div>
      )}

      {/* Error */}
      {step === 'error' && (
        <div className="flex flex-col items-center justify-center flex-1 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-bold mb-2">Payout Failed</h2>
          <p className="text-muted-foreground mb-8">{resultMessage}</p>
          <div className="flex gap-3 w-full max-w-xs">
            <Button onClick={() => setStep('select')} variant="outline" className="flex-1">Try Again</Button>
            <Button
              onClick={() => router.push(`/${params.brand}/dashboard`)}
              className="flex-1 text-white"
              style={{ backgroundColor: brand.primary_color }}
            >
              Dashboard
            </Button>
          </div>
        </div>
      )}

      {/* Confirm */}
      {step === 'confirm' && (
        <div className="flex flex-col flex-1">
          <div className="rounded-xl border bg-card p-5 mb-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-bold text-lg">${balance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Method</span>
              <span className="font-semibold capitalize">{method}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-semibold">{destination}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Brand</span>
              <span className="font-semibold">{brand.name}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mb-6 text-center">
            Your {brand.name} balance will be reset to $0.00 after this payout.
          </p>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full text-white mb-3"
            style={{ backgroundColor: brand.primary_color }}
          >
            {loading ? 'Processing...' : `Confirm — Send $${balance.toFixed(2)}`}
          </Button>
          <Button onClick={() => setStep('select')} variant="outline" className="w-full">
            Cancel
          </Button>
        </div>
      )}

      {/* Select method */}
      {step === 'select' && (
        <div className="flex flex-col flex-1">
          {/* Balance */}
          <div className="rounded-xl p-5 mb-6 text-center"
            style={{ backgroundColor: `${brand.primary_color}15` }}>
            <p className="text-sm text-muted-foreground mb-1">{brand.name} Balance</p>
            <p className="text-4xl font-bold" style={{ color: brand.primary_color }}>
              ${balance.toFixed(2)}
            </p>
            {balance < PAYOUT_THRESHOLD && (
              <p className="text-xs text-muted-foreground mt-2">
                Minimum cash out is ${PAYOUT_THRESHOLD.toFixed(2)}
              </p>
            )}
          </div>

          {/* Method selector */}
          <div className="space-y-3 mb-6">
            <Label className="text-sm font-semibold">Select Payout Method</Label>
            <div className="grid grid-cols-2 gap-3">
              {(['venmo', 'paypal'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => { setMethod(m); setDestination('') }}
                  className="p-4 rounded-xl border-2 text-center font-semibold capitalize transition-all"
                  style={{
                    borderColor: method === m ? brand.primary_color : '#e5e7eb',
                    backgroundColor: method === m ? `${brand.primary_color}10` : 'transparent',
                    color: method === m ? brand.primary_color : 'inherit',
                  }}
                >
                  {m === 'venmo' ? '💙 Venmo' : '🅿️ PayPal'}
                </button>
              ))}
            </div>
          </div>

          {/* Destination input */}
          {method && (
            <div className="space-y-2 mb-6">
              <Label htmlFor="destination">{label}</Label>
              <Input
                id="destination"
                type={isVenmo ? 'text' : 'email'}
                placeholder={placeholder}
                value={destination}
                onChange={e => setDestination(e.target.value)}
              />
            </div>
          )}

          <Button
            onClick={() => setStep('confirm')}
            disabled={!method || !destination || balance < PAYOUT_THRESHOLD}
            className="w-full text-white mt-auto"
            style={{ backgroundColor: brand.primary_color }}
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  )
}

export default function CashOutPage() {
  return (
    <Suspense>
      <CashOutContent />
    </Suspense>
  )
}

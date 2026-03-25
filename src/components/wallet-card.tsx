'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import type { BrandWallet } from '@/types'

const LEVEL_LABELS: Record<string, string> = {
  recruit: 'Recruit',
  vigilante: 'Vigilante',
  hero: 'Hero',
  legend: 'Legend',
}

const LEVEL_REWARDS: Record<string, string> = {
  recruit: 'Earn $0.50/vape · $0.25/pre-roll',
  vigilante: 'Earn $0.50/vape · $0.25/pre-roll',
  hero: 'Cash out unlocked!',
  legend: 'Bonus rate: $0.75/vape · $0.50/pre-roll',
}

type Props = {
  wallet: BrandWallet & { brand: { name: string; logo_url: string | null; primary_color: string; slug: string } }
  brandSlug: string
  nextLevel: { name: string; scansNeeded: number } | null
  payoutThreshold: number
}

export default function WalletCard({ wallet, brandSlug, nextLevel, payoutThreshold }: Props) {
  const router = useRouter()
  const brand = wallet.brand
  const balance = Number(wallet.balance)
  const progress = Math.min((balance / payoutThreshold) * 100, 100)
  const canCashOut = balance >= payoutThreshold

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      {/* Brand Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {brand.logo_url ? (
            <img src={brand.logo_url} alt={brand.name} className="h-8 w-8 object-contain rounded" />
          ) : (
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: brand.primary_color }}
            >
              {brand.name[0]}
            </div>
          )}
          <div>
            <p className="font-semibold text-sm">{brand.name}</p>
            <p className="text-xs text-muted-foreground">{LEVEL_LABELS[wallet.level]} · {wallet.scan_count} scans</p>
          </div>
        </div>
        <p className="text-xl font-bold">${balance.toFixed(2)}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-1">
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: brand.primary_color }}
          />
        </div>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mb-3">
        <span>{LEVEL_REWARDS[wallet.level]}</span>
        <span>${balance.toFixed(2)} / ${payoutThreshold.toFixed(2)}</span>
      </div>

      {/* Next level hint */}
      {nextLevel && (
        <p className="text-xs text-muted-foreground mb-3">
          {nextLevel.scansNeeded} more scan{nextLevel.scansNeeded !== 1 ? 's' : ''} to reach {nextLevel.name}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          onClick={() => router.push(`/${brandSlug}/scan?wallet=${wallet.id}&brand_id=${wallet.brand_id}`)}
          className="flex-1 text-white text-sm"
          style={{ backgroundColor: brand.primary_color }}
        >
          Scan Receipt
        </Button>
        {canCashOut && (
          <Button
            onClick={() => router.push(`/${brandSlug}/cashout?wallet=${wallet.id}`)}
            variant="outline"
            className="flex-1 text-sm"
            style={{ borderColor: brand.primary_color, color: brand.primary_color }}
          >
            Cash Out
          </Button>
        )}
      </div>
    </div>
  )
}

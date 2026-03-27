'use client'

import { useRouter } from 'next/navigation'
import type { BrandWallet } from '@/types'

const GREEN = '#00d084'

const LEVEL_LABELS: Record<string, string> = {
  recruit: '⚡ Recruit',
  vigilante: '🦸 Vigilante',
  hero: '🏆 Hero',
  legend: '👑 Legend',
}

const LEVEL_REWARDS: Record<string, string> = {
  recruit: '$0.50 vapes · $0.25 pre-rolls',
  vigilante: '$0.50 vapes · $0.25 pre-rolls',
  hero: '$0.50 vapes · $0.25 pre-rolls',
  legend: '🔥 Bonus: $0.75 vapes · $0.50 pre-rolls',
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
    <div className="rounded-2xl overflow-hidden border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}>
      {/* Colored top bar */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${brand.primary_color}, ${GREEN})` }} />

      <div className="p-4">
        {/* Brand row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {brand.logo_url ? (
              <img src={brand.logo_url} alt={brand.name} className="h-10 w-10 object-contain rounded-xl" />
            ) : (
              <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-black text-sm"
                style={{ backgroundColor: brand.primary_color }}>
                {brand.name[0]}
              </div>
            )}
            <div>
              <p className="font-bold text-white">{brand.name}</p>
              <p className="text-xs font-medium" style={{ color: GREEN }}>
                {LEVEL_LABELS[wallet.level]}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-white">${balance.toFixed(2)}</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{wallet.scan_count} scan{wallet.scan_count !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-1">
          <div className="h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${brand.primary_color}, ${GREEN})` }} />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between text-xs mb-3 gap-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <span>{LEVEL_REWARDS[wallet.level]}</span>
          <span>${balance.toFixed(2)} / ${payoutThreshold.toFixed(2)}</span>
        </div>

        {/* Next level hint */}
        {nextLevel && (
          <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {nextLevel.scansNeeded} more scan{nextLevel.scansNeeded !== 1 ? 's' : ''} to reach{' '}
            <span className="font-semibold" style={{ color: GREEN }}>{nextLevel.name}</span>
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/${brandSlug}/scan?wallet=${wallet.id}&brand_id=${wallet.brand_id}`)}
            className="flex-1 py-3 rounded-xl font-bold text-black text-sm transition-all active:scale-95"
            style={{ backgroundColor: GREEN }}>
            📷 Scan Receipt
          </button>
          {canCashOut && (
            <button
              onClick={() => router.push(`/${brandSlug}/cashout?wallet=${wallet.id}`)}
              className="flex-1 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 border"
              style={{ borderColor: GREEN, color: GREEN, backgroundColor: 'rgba(0,208,132,0.08)' }}>
              💸 Cash Out
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

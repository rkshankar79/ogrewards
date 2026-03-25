'use client'

import { useRouter } from 'next/navigation'
import type { BrandWallet } from '@/types'

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
    <div className="rounded-2xl overflow-hidden shadow-md bg-white border border-gray-100">
      {/* Colored top bar */}
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${brand.primary_color}, color-mix(in srgb, ${brand.primary_color} 60%, #6366f1))` }} />

      <div className="p-4">
        {/* Brand row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {brand.logo_url ? (
              <img src={brand.logo_url} alt={brand.name} className="h-10 w-10 object-contain rounded-xl" />
            ) : (
              <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md"
                style={{ background: `linear-gradient(135deg, ${brand.primary_color}, color-mix(in srgb, ${brand.primary_color} 70%, #6366f1))` }}>
                {brand.name[0]}
              </div>
            )}
            <div>
              <p className="font-bold text-gray-900">{brand.name}</p>
              <p className="text-xs font-medium" style={{ color: brand.primary_color }}>
                {LEVEL_LABELS[wallet.level]}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-gray-900">${balance.toFixed(2)}</p>
            <p className="text-xs text-gray-400">{wallet.scan_count} scan{wallet.scan_count !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-1">
          <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${brand.primary_color}, color-mix(in srgb, ${brand.primary_color} 60%, #6366f1))`
              }} />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between text-xs text-gray-400 mb-3 gap-0.5">
          <span>{LEVEL_REWARDS[wallet.level]}</span>
          <span>${balance.toFixed(2)} / ${payoutThreshold.toFixed(2)}</span>
        </div>

        {/* Next level hint */}
        {nextLevel && (
          <p className="text-xs text-gray-400 mb-3">
            {nextLevel.scansNeeded} more scan{nextLevel.scansNeeded !== 1 ? 's' : ''} to reach <span className="font-semibold" style={{ color: brand.primary_color }}>{nextLevel.name}</span>
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/${brandSlug}/scan?wallet=${wallet.id}&brand_id=${wallet.brand_id}`)}
            className="flex-1 py-3 rounded-xl font-bold text-white text-sm transition-all active:scale-95 shadow-md"
            style={{ background: `linear-gradient(135deg, ${brand.primary_color}, color-mix(in srgb, ${brand.primary_color} 70%, #6366f1))` }}>
            📷 Scan Receipt
          </button>
          {canCashOut && (
            <button
              onClick={() => router.push(`/${brandSlug}/cashout?wallet=${wallet.id}`)}
              className="flex-1 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 border-2"
              style={{ borderColor: brand.primary_color, color: brand.primary_color, backgroundColor: `${brand.primary_color}10` }}>
              💸 Cash Out
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PAYOUT_THRESHOLD, LEVEL_THRESHOLDS } from '@/types'
import WalletCard from '@/components/wallet-card'

export default async function DashboardPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand: slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${slug}`)

  const serviceSupabase = createServiceClient()

  const { data: wallets } = await serviceSupabase
    .from('brand_wallets')
    .select('*, brand:brands(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  const { data: recentScans } = await serviceSupabase
    .from('scans')
    .select('*, brand:brands(name, primary_color)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const totalBalance = wallets?.reduce((sum, w) => sum + Number(w.balance), 0) || 0
  const totalScans = wallets?.reduce((sum, w) => sum + w.scan_count, 0) || 0

  function getNextLevel(scanCount: number) {
    if (scanCount < LEVEL_THRESHOLDS.vigilante) return { name: 'Vigilante', scansNeeded: LEVEL_THRESHOLDS.vigilante - scanCount }
    if (scanCount < LEVEL_THRESHOLDS.hero) return { name: 'Hero', scansNeeded: LEVEL_THRESHOLDS.hero - scanCount }
    if (scanCount < LEVEL_THRESHOLDS.legend) return { name: 'Legend', scansNeeded: LEVEL_THRESHOLDS.legend - scanCount }
    return null
  }

  // Get primary brand color for header gradient
  const primaryBrand = wallets?.[0]?.brand as any
  const headerColor = primaryBrand?.primary_color || '#1a1a2e'

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="relative overflow-hidden px-5 pt-12 pb-16"
        style={{ background: `linear-gradient(160deg, ${headerColor} 0%, color-mix(in srgb, ${headerColor} 60%, #0f0f1a) 100%)` }}>

        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full opacity-10" style={{ backgroundColor: '#fff' }} />
        <div className="absolute -bottom-6 -left-6 h-28 w-28 rounded-full opacity-10" style={{ backgroundColor: '#fff' }} />

        <p className="text-white/60 text-sm font-medium mb-1">Total Balance</p>
        <p className="text-5xl font-black text-white mb-1">${totalBalance.toFixed(2)}</p>
        <p className="text-white/50 text-sm">{totalScans} scan{totalScans !== 1 ? 's' : ''} across {wallets?.length || 0} brand{wallets?.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Cards pulled up over header */}
      <div className="px-4 -mt-6 space-y-4">
        {wallets && wallets.length > 0 ? (
          wallets.map(wallet => (
            <WalletCard
              key={wallet.id}
              wallet={wallet}
              brandSlug={slug}
              nextLevel={getNextLevel(wallet.scan_count)}
              payoutThreshold={PAYOUT_THRESHOLD}
            />
          ))
        ) : (
          <div className="rounded-2xl bg-white shadow-sm border p-8 text-center">
            <div className="text-4xl mb-3">📭</div>
            <p className="font-semibold text-gray-700">No rewards yet</p>
            <p className="text-sm text-gray-400 mt-1">Scan a receipt to start earning</p>
          </div>
        )}

        {/* Recent Scans */}
        {recentScans && recentScans.length > 0 && (
          <div className="rounded-2xl bg-white shadow-sm border overflow-hidden mt-4">
            <div className="px-4 py-3 border-b">
              <h2 className="font-bold text-gray-800">Recent Scans</h2>
            </div>
            {recentScans.map(scan => (
              <div key={scan.id} className="flex items-center justify-between px-4 py-3 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: (scan.brand as any)?.primary_color || '#1a1a2e' }}>
                    {(scan.brand as any)?.name?.[0] || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{scan.store_name || 'Dispensary'}</p>
                    <p className="text-xs text-gray-400">{new Date(scan.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: scan.reward_amount > 0 ? '#16a34a' : '#9ca3af' }}>
                    {scan.reward_amount > 0 ? `+$${Number(scan.reward_amount).toFixed(2)}` : '—'}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    scan.status === 'approved' ? 'bg-green-100 text-green-700' :
                    scan.status === 'duplicate' ? 'bg-amber-100 text-amber-700' :
                    scan.status === 'rejected' ? 'bg-red-100 text-red-600' :
                    'bg-gray-100 text-gray-500'
                  }`}>{scan.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

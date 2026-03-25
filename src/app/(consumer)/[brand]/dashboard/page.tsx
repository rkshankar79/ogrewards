import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PAYOUT_THRESHOLD, LEVEL_THRESHOLDS } from '@/types'
import WalletCard from '@/components/wallet-card'

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ brand: string }>
}) {
  const { brand: slug } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${slug}`)

  // Fetch all wallets for this user with brand data
  const { data: wallets } = await supabase
    .from('brand_wallets')
    .select('*, brand:brands(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  // Fetch recent scans
  const { data: recentScans } = await supabase
    .from('scans')
    .select('*, brand:brands(name, primary_color)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const totalBalance = wallets?.reduce((sum, w) => sum + Number(w.balance), 0) || 0

  function getNextLevel(scanCount: number) {
    if (scanCount < LEVEL_THRESHOLDS.vigilante) return { name: 'Vigilante', scansNeeded: LEVEL_THRESHOLDS.vigilante - scanCount }
    if (scanCount < LEVEL_THRESHOLDS.hero) return { name: 'Hero', scansNeeded: LEVEL_THRESHOLDS.hero - scanCount }
    if (scanCount < LEVEL_THRESHOLDS.legend) return { name: 'Legend', scansNeeded: LEVEL_THRESHOLDS.legend - scanCount }
    return null
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="px-4 pt-10 pb-6">
        <p className="text-sm text-muted-foreground">Total Balance</p>
        <p className="text-4xl font-bold">${totalBalance.toFixed(2)}</p>
        <p className="text-sm text-muted-foreground mt-1">
          across {wallets?.length || 0} brand{wallets?.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Wallet Cards */}
      <div className="px-4 space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Your Rewards</h2>
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
          <p className="text-muted-foreground text-sm">No wallets yet. Scan a receipt to get started.</p>
        )}
      </div>

      {/* Recent Scans */}
      {recentScans && recentScans.length > 0 && (
        <div className="px-4 mt-8">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recent Scans</h2>
          <div className="space-y-2">
            {recentScans.map(scan => (
              <div key={scan.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium">{scan.brand?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(scan.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {scan.reward_amount > 0 ? `+$${Number(scan.reward_amount).toFixed(2)}` : '-'}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    scan.status === 'approved' ? 'bg-green-100 text-green-700' :
                    scan.status === 'duplicate' ? 'bg-yellow-100 text-yellow-700' :
                    scan.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {scan.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

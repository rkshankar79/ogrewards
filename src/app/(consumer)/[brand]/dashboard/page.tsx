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

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#080808' }}>
      {/* Grid bg */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(0,208,132,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,208,132,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Header */}
      <div className="relative px-5 pt-12 pb-16 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(ellipse, #00d084 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <p className="text-sm font-medium relative" style={{ color: 'rgba(255,255,255,0.4)' }}>Total Balance</p>
        <p className="text-5xl font-black text-white relative">${totalBalance.toFixed(2)}</p>
        <p className="text-sm relative mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
          {totalScans} scan{totalScans !== 1 ? 's' : ''} across {wallets?.length || 0} brand{wallets?.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Cards */}
      <div className="relative z-10 px-4 -mt-4 space-y-4 pt-6">
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
          <div className="rounded-2xl border p-8 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }}>
            <div className="text-4xl mb-3">📭</div>
            <p className="font-semibold text-white">No rewards yet</p>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Scan a receipt to start earning</p>
          </div>
        )}

        {/* Recent Scans */}
        {recentScans && recentScans.length > 0 && (
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }}>
            <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <h2 className="font-bold text-white">Recent Scans</h2>
            </div>
            {recentScans.map(scan => (
              <div key={scan.id} className="flex items-center justify-between px-4 py-3 border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white text-xs font-black"
                    style={{ backgroundColor: (scan.brand as any)?.primary_color || '#1a1a2e' }}>
                    {(scan.brand as any)?.name?.[0] || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{scan.store_name || 'Dispensary'}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{new Date(scan.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: scan.reward_amount > 0 ? '#00d084' : 'rgba(255,255,255,0.3)' }}>
                    {scan.reward_amount > 0 ? `+$${Number(scan.reward_amount).toFixed(2)}` : '—'}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    scan.status === 'approved' ? 'bg-green-900/50 text-green-400' :
                    scan.status === 'duplicate' ? 'bg-amber-900/50 text-amber-400' :
                    scan.status === 'rejected' ? 'bg-red-900/50 text-red-400' :
                    'bg-white/10 text-white/40'
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

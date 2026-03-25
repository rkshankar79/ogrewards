import { createClient, createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ReportsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const serviceSupabase = createServiceClient()
  const { data: adminRecord } = await serviceSupabase
    .from('brand_admins')
    .select('brand_id')
    .eq('email', user.email)
    .single()

  if (!adminRecord) redirect('/admin/login')

  const brandId = adminRecord.brand_id

  const [
    { data: levelCounts },
    { data: topStores },
    { count: totalDuplicates },
    { count: totalRejected },
    { data: dailyScans },
  ] = await Promise.all([
    // Level distribution
    serviceSupabase.from('brand_wallets').select('level').eq('brand_id', brandId),
    // Top stores
    serviceSupabase.from('scans').select('store_name').eq('brand_id', brandId).eq('status', 'approved').not('store_name', 'is', null),
    // Duplicates
    serviceSupabase.from('scans').select('*', { count: 'exact', head: true }).eq('brand_id', brandId).eq('status', 'duplicate'),
    // Rejected
    serviceSupabase.from('scans').select('*', { count: 'exact', head: true }).eq('brand_id', brandId).eq('status', 'rejected'),
    // Last 7 days scans
    serviceSupabase.from('scans').select('created_at, status, reward_amount').eq('brand_id', brandId)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: true }),
  ])

  // Level distribution counts
  const levels = { recruit: 0, vigilante: 0, hero: 0, legend: 0 }
  levelCounts?.forEach(w => { if (w.level in levels) levels[w.level as keyof typeof levels]++ })

  // Top stores
  const storeCounts: Record<string, number> = {}
  topStores?.forEach(s => { if (s.store_name) storeCounts[s.store_name] = (storeCounts[s.store_name] || 0) + 1 })
  const topStoresList = Object.entries(storeCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)

  // Daily scan totals for last 7 days
  const dailyMap: Record<string, { scans: number; earned: number }> = {}
  dailyScans?.forEach(s => {
    const day = new Date(s.created_at).toLocaleDateString()
    if (!dailyMap[day]) dailyMap[day] = { scans: 0, earned: 0 }
    dailyMap[day].scans++
    dailyMap[day].earned += Number(s.reward_amount)
  })
  const dailyList = Object.entries(dailyMap)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500 mt-0.5">Analytics and performance insights</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* User levels */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">👥 User Level Distribution</h2>
          <div className="space-y-3">
            {[
              { level: 'recruit', label: '⚡ Recruit', color: 'bg-gray-400' },
              { level: 'vigilante', label: '🦸 Vigilante', color: 'bg-blue-500' },
              { level: 'hero', label: '🏆 Hero', color: 'bg-purple-500' },
              { level: 'legend', label: '👑 Legend', color: 'bg-amber-500' },
            ].map(({ level, label, color }) => {
              const count = levels[level as keyof typeof levels]
              const pct = levelCounts?.length ? (count / levelCounts.length) * 100 : 0
              return (
                <div key={level} className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-gray-700 w-28">{label}</span>
                  <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-sm font-bold text-gray-600 w-4 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top dispensaries */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">🏪 Top Dispensaries</h2>
          {topStoresList.length > 0 ? (
            <div className="space-y-2">
              {topStoresList.map(([store, count], i) => (
                <div key={store} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-gray-300 w-4">#{i + 1}</span>
                    <span className="font-medium text-sm text-gray-800">{store}</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-400">{count} scan{count !== 1 ? 's' : ''}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No data yet</p>
          )}
        </div>

        {/* Scan quality */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">🔍 Scan Quality</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-100">
              <span className="text-sm font-medium text-amber-700">Duplicate receipts</span>
              <span className="font-black text-amber-700">{totalDuplicates || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-100">
              <span className="text-sm font-medium text-red-700">No match found</span>
              <span className="font-black text-red-700">{totalRejected || 0}</span>
            </div>
          </div>
        </div>

        {/* Last 7 days */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">📅 Last 7 Days</h2>
          {dailyList.length > 0 ? (
            <div className="space-y-2">
              {dailyList.map(([day, data]) => (
                <div key={day} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
                  <span className="text-xs text-gray-400">{day}</span>
                  <span className="text-sm">{data.scans} scans · <span className="font-bold text-green-600">${data.earned.toFixed(2)}</span></span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No scans in last 7 days</p>
          )}
        </div>
      </div>
    </div>
  )
}

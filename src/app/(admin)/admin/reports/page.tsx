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
      <h1 className="text-2xl font-bold mb-6">Reports</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* User levels */}
        <div className="rounded-xl border p-5">
          <h2 className="font-semibold mb-4">User Level Distribution</h2>
          <div className="space-y-3">
            {Object.entries(levels).map(([level, count]) => (
              <div key={level} className="flex items-center justify-between">
                <span className="capitalize text-sm font-medium">{level}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${levelCounts?.length ? (count / levelCounts.length) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top dispensaries */}
        <div className="rounded-xl border p-5">
          <h2 className="font-semibold mb-4">Top Dispensaries</h2>
          {topStoresList.length > 0 ? (
            <div className="space-y-2">
              {topStoresList.map(([store, count]) => (
                <div key={store} className="flex justify-between text-sm">
                  <span className="font-medium">{store}</span>
                  <span className="text-muted-foreground">{count} scan{count !== 1 ? 's' : ''}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No data yet</p>
          )}
        </div>

        {/* Scan quality */}
        <div className="rounded-xl border p-5">
          <h2 className="font-semibold mb-4">Scan Quality</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duplicate receipts</span>
              <span className="font-medium">{totalDuplicates || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">No match found</span>
              <span className="font-medium">{totalRejected || 0}</span>
            </div>
          </div>
        </div>

        {/* Last 7 days */}
        <div className="rounded-xl border p-5">
          <h2 className="font-semibold mb-4">Last 7 Days</h2>
          {dailyList.length > 0 ? (
            <div className="space-y-2">
              {dailyList.map(([day, data]) => (
                <div key={day} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{day}</span>
                  <span>{data.scans} scans · <span className="font-medium">${data.earned.toFixed(2)}</span> earned</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No scans in last 7 days</p>
          )}
        </div>
      </div>
    </div>
  )
}

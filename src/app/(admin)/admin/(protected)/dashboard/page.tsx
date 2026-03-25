import { createClient, createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const serviceSupabase = createServiceClient()

  const { data: adminRecord } = await serviceSupabase
    .from('brand_admins')
    .select('brand_id, brand:brands(*)')
    .eq('email', user.email)
    .single()

  if (!adminRecord) redirect('/admin/login')

  const brandId = adminRecord.brand_id
  const brand = adminRecord.brand as any

  // Fetch stats in parallel
  const [
    { count: totalScans },
    { count: totalUsers },
    { count: approvedScans },
    { data: recentScans },
    { data: payouts },
  ] = await Promise.all([
    serviceSupabase.from('scans').select('*', { count: 'exact', head: true }).eq('brand_id', brandId),
    serviceSupabase.from('brand_wallets').select('*', { count: 'exact', head: true }).eq('brand_id', brandId),
    serviceSupabase.from('scans').select('*', { count: 'exact', head: true }).eq('brand_id', brandId).eq('status', 'approved'),
    serviceSupabase.from('scans').select('*, user:users(email)').eq('brand_id', brandId).order('created_at', { ascending: false }).limit(8),
    serviceSupabase.from('payouts').select('amount').eq('brand_id', brandId).eq('status', 'paid'),
  ])

  const totalPaid = payouts?.reduce((sum, p) => sum + Number(p.amount), 0) || 0

  const isLow = Number(brand.reward_pool_balance) < 50
  const stats = [
    { label: 'Total Scans', value: totalScans || 0, emoji: '📷', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
    { label: 'Active Users', value: totalUsers || 0, emoji: '👥', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100' },
    { label: 'Approved Scans', value: approvedScans || 0, emoji: '✅', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100' },
    { label: 'Total Paid Out', value: `$${totalPaid.toFixed(2)}`, emoji: '💸', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
    { label: 'Reward Pool', value: `$${Number(brand.reward_pool_balance).toFixed(2)}`, emoji: '💰', bg: isLow ? 'bg-red-50' : 'bg-emerald-50', text: isLow ? 'text-red-700' : 'text-emerald-700', border: isLow ? 'border-red-100' : 'border-emerald-100' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">{brand.name} · Overview</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {stats.map(stat => (
          <div key={stat.label} className={`rounded-xl border ${stat.border} ${stat.bg} p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{stat.emoji}</span>
              <p className={`text-xs font-medium ${stat.text}`}>{stat.label}</p>
            </div>
            <p className={`text-2xl font-black ${stat.text}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Pool balance warning */}
      {isLow && (
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 mb-6 text-sm text-destructive font-medium">
          ⚠️ Reward pool is low (${Number(brand.reward_pool_balance).toFixed(2)}). Fund it before users can't cash out.
        </div>
      )}

      {/* Recent scans */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Recent Scans</h2>
        <div className="rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-3 font-semibold text-gray-600">User</th>
                <th className="text-left p-3 font-semibold text-gray-600">Store</th>
                <th className="text-left p-3 font-semibold text-gray-600">Date</th>
                <th className="text-left p-3 font-semibold text-gray-600">Status</th>
                <th className="text-right p-3 font-semibold text-gray-600">Reward</th>
              </tr>
            </thead>
            <tbody>
              {recentScans?.map(scan => (
                <tr key={scan.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-3 text-gray-500 font-mono text-xs">{(scan.user as any)?.email?.split('@')[0]}…</td>
                  <td className="p-3 font-medium text-gray-800">{scan.store_name || '—'}</td>
                  <td className="p-3 text-gray-400 text-xs">
                    {scan.receipt_date ? new Date(scan.receipt_date).toLocaleDateString() : '—'}
                  </td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      scan.status === 'approved' ? 'bg-green-100 text-green-700' :
                      scan.status === 'duplicate' ? 'bg-amber-100 text-amber-700' :
                      scan.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {scan.status}
                    </span>
                  </td>
                  <td className="p-3 text-right font-bold text-gray-900">
                    {scan.reward_amount > 0 ? <span className="text-green-600">+${Number(scan.reward_amount).toFixed(2)}</span> : <span className="text-gray-300">—</span>}
                  </td>
                </tr>
              ))}
              {!recentScans?.length && (
                <tr><td colSpan={5} className="p-8 text-center text-gray-400">No scans yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

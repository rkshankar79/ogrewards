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

  const stats = [
    { label: 'Total Scans', value: totalScans || 0 },
    { label: 'Active Users', value: totalUsers || 0 },
    { label: 'Approved Scans', value: approvedScans || 0 },
    { label: 'Total Paid Out', value: `$${totalPaid.toFixed(2)}` },
    { label: 'Reward Pool', value: `$${Number(brand.reward_pool_balance).toFixed(2)}` },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {stats.map(stat => (
          <div key={stat.label} className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Pool balance warning */}
      {Number(brand.reward_pool_balance) < 50 && (
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 mb-6 text-sm text-destructive font-medium">
          ⚠️ Reward pool is low (${Number(brand.reward_pool_balance).toFixed(2)}). Fund it before users can't cash out.
        </div>
      )}

      {/* Recent scans */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Recent Scans</h2>
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">User</th>
                <th className="text-left p-3 font-medium">Store</th>
                <th className="text-left p-3 font-medium">Date</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-right p-3 font-medium">Reward</th>
              </tr>
            </thead>
            <tbody>
              {recentScans?.map(scan => (
                <tr key={scan.id} className="border-t">
                  <td className="p-3 text-muted-foreground">{(scan.user as any)?.email?.split('@')[0]}...</td>
                  <td className="p-3">{scan.store_name || '—'}</td>
                  <td className="p-3 text-muted-foreground">
                    {scan.receipt_date ? new Date(scan.receipt_date).toLocaleDateString() : '—'}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      scan.status === 'approved' ? 'bg-green-100 text-green-700' :
                      scan.status === 'duplicate' ? 'bg-yellow-100 text-yellow-700' :
                      scan.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {scan.status}
                    </span>
                  </td>
                  <td className="p-3 text-right font-medium">
                    {scan.reward_amount > 0 ? `$${Number(scan.reward_amount).toFixed(2)}` : '—'}
                  </td>
                </tr>
              ))}
              {!recentScans?.length && (
                <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No scans yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

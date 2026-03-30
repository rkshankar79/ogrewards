import { createServiceClient } from '@/lib/supabase/server'

const GREEN = '#00d084'

export default async function SuperAdminDashboard() {
  const db = createServiceClient()

  const [
    { data: brands },
    { count: totalUsers },
    { count: totalScans },
    { count: approvedScans },
    { data: payouts },
    { data: recentScans },
  ] = await Promise.all([
    db.from('brands').select('*, brand_admins(email)').order('created_at', { ascending: false }),
    db.from('users').select('*', { count: 'exact', head: true }),
    db.from('scans').select('*', { count: 'exact', head: true }),
    db.from('scans').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    db.from('payouts').select('amount').eq('status', 'paid'),
    db.from('scans').select('*, brand:brands(name, primary_color), user:users(email)').order('created_at', { ascending: false }).limit(10),
  ])

  const totalPaid = payouts?.reduce((sum, p) => sum + Number(p.amount), 0) || 0
  const totalPool = brands?.reduce((sum, b) => sum + Number(b.reward_pool_balance), 0) || 0
  const lowPoolBrands = brands?.filter(b => Number(b.reward_pool_balance) < 50) || []

  const stats = [
    { label: 'Total Brands', value: brands?.length || 0, emoji: '🏷️', color: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.25)', text: '#a5b4fc' },
    { label: 'Total Users', value: totalUsers || 0, emoji: '👥', color: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.25)', text: '#d8b4fe' },
    { label: 'Total Scans', value: totalScans || 0, emoji: '📷', color: 'rgba(0,208,132,0.08)', border: 'rgba(0,208,132,0.25)', text: GREEN },
    { label: 'Approved Scans', value: approvedScans || 0, emoji: '✅', color: 'rgba(0,208,132,0.08)', border: 'rgba(0,208,132,0.25)', text: GREEN },
    { label: 'Total Paid Out', value: `$${totalPaid.toFixed(2)}`, emoji: '💸', color: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.25)', text: '#fbbf24' },
    { label: 'Total Pool Balance', value: `$${totalPool.toFixed(2)}`, emoji: '💰', color: 'rgba(0,208,132,0.08)', border: 'rgba(0,208,132,0.25)', text: GREEN },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Overview</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>All brands and activity across OGRewards</p>
        </div>
      </div>

      {/* Low pool warnings */}
      {lowPoolBrands.length > 0 && (
        <div className="rounded-xl border px-4 py-3 mb-6 text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)', color: '#f87171' }}>
          ⚠️ Low pool balance: {lowPoolBrands.map(b => `${b.name} ($${Number(b.reward_pool_balance).toFixed(2)})`).join(', ')}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map(stat => (
          <div key={stat.label} className="rounded-xl border p-4" style={{ backgroundColor: stat.color, borderColor: stat.border, color: stat.text }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{stat.emoji}</span>
            </div>
            <p className="text-2xl font-black">{stat.value}</p>
            <p className="text-xs mt-1 opacity-70">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Brands table */}
      <div className="rounded-2xl border overflow-hidden mb-8" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
          <h2 className="font-bold text-white">All Brands</h2>
          <a href="/superadmin/brands" className="text-xs font-medium" style={{ color: GREEN }}>View all →</a>
        </div>
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
            <tr>
              <th className="text-left p-3 font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Brand</th>
              <th className="text-left p-3 font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Admin</th>
              <th className="text-left p-3 font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Status</th>
              <th className="text-right p-3 font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Pool Balance</th>
            </tr>
          </thead>
          <tbody>
            {brands?.map(brand => (
              <tr key={brand.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg flex items-center justify-center text-white text-xs font-black"
                      style={{ backgroundColor: brand.primary_color }}>
                      {brand.name[0]}
                    </div>
                    <span className="font-medium text-white">{brand.name}</span>
                  </div>
                </td>
                <td className="p-3 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {(brand.brand_admins as any)?.[0]?.email || '—'}
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={brand.is_active
                      ? { backgroundColor: 'rgba(0,208,132,0.1)', color: GREEN }
                      : { backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}>
                    {brand.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-3 text-right font-bold"
                  style={{ color: Number(brand.reward_pool_balance) < 50 ? '#f87171' : 'rgba(255,255,255,0.7)' }}>
                  ${Number(brand.reward_pool_balance).toFixed(2)}
                  {Number(brand.reward_pool_balance) < 50 && ' ⚠️'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent scans */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
          <h2 className="font-bold text-white">Recent Scans</h2>
        </div>
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
            <tr>
              <th className="text-left p-3 font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>User</th>
              <th className="text-left p-3 font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Brand</th>
              <th className="text-left p-3 font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Store</th>
              <th className="text-left p-3 font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Status</th>
              <th className="text-right p-3 font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Reward</th>
            </tr>
          </thead>
          <tbody>
            {recentScans?.map(scan => (
              <tr key={scan.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <td className="p-3 text-xs font-mono" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {(scan.user as any)?.email?.split('@')[0]}…
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded flex items-center justify-center text-white text-xs font-black"
                      style={{ backgroundColor: (scan.brand as any)?.primary_color }}>
                      {(scan.brand as any)?.name?.[0]}
                    </div>
                    <span className="text-white text-xs">{(scan.brand as any)?.name}</span>
                  </div>
                </td>
                <td className="p-3 text-white">{scan.store_name || '—'}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    scan.status === 'approved' ? 'bg-green-900/40 text-green-400' :
                    scan.status === 'duplicate' ? 'bg-amber-900/40 text-amber-400' :
                    scan.status === 'rejected' ? 'bg-red-900/40 text-red-400' :
                    'bg-white/10 text-white/40'
                  }`}>{scan.status}</span>
                </td>
                <td className="p-3 text-right font-bold" style={{ color: scan.reward_amount > 0 ? GREEN : 'rgba(255,255,255,0.2)' }}>
                  {scan.reward_amount > 0 ? `+$${Number(scan.reward_amount).toFixed(2)}` : '—'}
                </td>
              </tr>
            ))}
            {!recentScans?.length && (
              <tr><td colSpan={5} className="p-8 text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>No scans yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

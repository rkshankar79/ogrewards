import { createServiceClient } from '@/lib/supabase/server'

const GREEN = '#00d084'

export default async function SuperAdminBrands() {
  const db = createServiceClient()

  const { data: brands } = await db
    .from('brands')
    .select('*, brand_admins(email), scans(count), brand_wallets(count)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Brands</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{brands?.length || 0} brands on the platform</p>
        </div>
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <tr>
              <th className="text-left p-4 font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Brand</th>
              <th className="text-left p-4 font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Slug</th>
              <th className="text-left p-4 font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Admin</th>
              <th className="text-left p-4 font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Users</th>
              <th className="text-left p-4 font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Scans</th>
              <th className="text-left p-4 font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Status</th>
              <th className="text-right p-4 font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Pool</th>
            </tr>
          </thead>
          <tbody>
            {brands?.map(brand => (
              <tr key={brand.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white font-black text-sm"
                      style={{ backgroundColor: brand.primary_color }}>
                      {brand.name[0]}
                    </div>
                    <span className="font-semibold text-white">{brand.name}</span>
                  </div>
                </td>
                <td className="p-4 font-mono text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{brand.slug}</td>
                <td className="p-4 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {(brand.brand_admins as any)?.[0]?.email || '—'}
                </td>
                <td className="p-4 text-white">{(brand.brand_wallets as any)?.[0]?.count ?? 0}</td>
                <td className="p-4 text-white">{(brand.scans as any)?.[0]?.count ?? 0}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={brand.is_active
                      ? { backgroundColor: 'rgba(0,208,132,0.1)', color: GREEN }
                      : { backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}>
                    {brand.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 text-right font-bold"
                  style={{ color: Number(brand.reward_pool_balance) < 50 ? '#f87171' : 'rgba(255,255,255,0.8)' }}>
                  ${Number(brand.reward_pool_balance).toFixed(2)}
                  {Number(brand.reward_pool_balance) < 50 && ' ⚠️'}
                </td>
              </tr>
            ))}
            {!brands?.length && (
              <tr><td colSpan={7} className="p-8 text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>No brands yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

import { createServiceClient } from '@/lib/supabase/server'

const GREEN = '#00d084'

export default async function SuperAdminUsers() {
  const db = createServiceClient()

  const { data: users } = await db
    .from('users')
    .select('*, brand_wallets(balance, scan_count, level, brand:brands(name, primary_color))')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Users</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{users?.length || 0} registered users</p>
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <tr>
              <th className="text-left p-4 font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Email</th>
              <th className="text-left p-4 font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>State</th>
              <th className="text-left p-4 font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Brands</th>
              <th className="text-left p-4 font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Total Scans</th>
              <th className="text-right p-4 font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Total Balance</th>
              <th className="text-right p-4 font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users?.map(user => {
              const wallets = user.brand_wallets as any[] || []
              const totalBalance = wallets.reduce((sum, w) => sum + Number(w.balance), 0)
              const totalScans = wallets.reduce((sum, w) => sum + w.scan_count, 0)
              return (
                <tr key={user.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <td className="p-4 font-medium text-white">{user.email}</td>
                  <td className="p-4 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{user.state || '—'}</td>
                  <td className="p-4">
                    <div className="flex gap-1 flex-wrap">
                      {wallets.map((w: any) => (
                        <div key={w.brand?.name} className="h-5 w-5 rounded flex items-center justify-center text-white text-xs font-black"
                          style={{ backgroundColor: w.brand?.primary_color }}>
                          {w.brand?.name?.[0]}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-white">{totalScans}</td>
                  <td className="p-4 text-right font-bold" style={{ color: totalBalance > 0 ? GREEN : 'rgba(255,255,255,0.3)' }}>
                    ${totalBalance.toFixed(2)}
                  </td>
                  <td className="p-4 text-right text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              )
            })}
            {!users?.length && (
              <tr><td colSpan={6} className="p-8 text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>No users yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

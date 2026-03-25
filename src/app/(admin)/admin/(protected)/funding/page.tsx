import { createClient, createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function FundingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const serviceSupabase = createServiceClient()
  const { data: adminRecord } = await serviceSupabase
    .from('brand_admins')
    .select('brand_id, brand:brands(name, reward_pool_balance)')
    .eq('email', user.email)
    .single()

  if (!adminRecord) redirect('/admin/login')

  const brand = adminRecord.brand as any

  const { data: fundingHistory } = await serviceSupabase
    .from('brand_funding')
    .select('*')
    .eq('brand_id', adminRecord.brand_id)
    .order('created_at', { ascending: false })
    .limit(20)

  const { data: payoutHistory } = await serviceSupabase
    .from('payouts')
    .select('amount, status, created_at, method')
    .eq('brand_id', adminRecord.brand_id)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Reward Pool</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your funding balance and track payouts</p>
      </div>

      {/* Current balance */}
      <div className={`rounded-2xl border p-6 mb-6 ${Number(brand.reward_pool_balance) < 50 ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
        <div className="flex items-start justify-between">
          <div>
            <p className={`text-sm font-medium mb-1 ${Number(brand.reward_pool_balance) < 50 ? 'text-red-600' : 'text-emerald-600'}`}>💰 Available Balance</p>
            <p className={`text-5xl font-black ${Number(brand.reward_pool_balance) < 50 ? 'text-red-700' : 'text-emerald-700'}`}>${Number(brand.reward_pool_balance).toFixed(2)}</p>
            {Number(brand.reward_pool_balance) < 50 && (
              <p className="text-sm text-red-600 mt-2 font-medium">
                ⚠️ Balance is low — users won't earn rewards when this hits $0
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-black/5">
          <p className="text-sm text-gray-500">
            Stripe funding coming soon. Contact <strong className="text-gray-700">admin@ogrewards.io</strong> to add funds manually.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Funding history */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Funding History</h2>
          <div className="rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left p-3 font-semibold text-gray-600">Date</th>
                  <th className="text-right p-3 font-semibold text-gray-600">Amount</th>
                </tr>
              </thead>
              <tbody>
                {fundingHistory?.map(f => (
                  <tr key={f.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                    <td className="p-3 text-gray-400 text-xs">{new Date(f.created_at).toLocaleDateString()}</td>
                    <td className="p-3 text-right font-bold text-green-600">+${Number(f.amount).toFixed(2)}</td>
                  </tr>
                ))}
                {!fundingHistory?.length && (
                  <tr><td colSpan={2} className="p-8 text-center text-gray-400">No funding history</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payout history */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Payout History</h2>
          <div className="rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left p-3 font-semibold text-gray-600">Date</th>
                  <th className="text-left p-3 font-semibold text-gray-600">Method</th>
                  <th className="text-left p-3 font-semibold text-gray-600">Status</th>
                  <th className="text-right p-3 font-semibold text-gray-600">Amount</th>
                </tr>
              </thead>
              <tbody>
                {payoutHistory?.map((p, i) => (
                  <tr key={i} className="border-t border-gray-50 hover:bg-gray-50/50">
                    <td className="p-3 text-gray-400 text-xs">{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="p-3 capitalize text-gray-700 font-medium">{p.method}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        p.status === 'paid' ? 'bg-green-100 text-green-700' :
                        p.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                        p.status === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold text-red-600">-${Number(p.amount).toFixed(2)}</td>
                  </tr>
                ))}
                {!payoutHistory?.length && (
                  <tr><td colSpan={4} className="p-8 text-center text-gray-400">No payouts yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

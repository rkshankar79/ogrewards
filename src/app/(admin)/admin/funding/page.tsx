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
      <h1 className="text-2xl font-bold mb-6">Reward Pool</h1>

      {/* Current balance */}
      <div className="rounded-xl border bg-card p-6 mb-6">
        <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
        <p className="text-4xl font-bold">${Number(brand.reward_pool_balance).toFixed(2)}</p>
        {Number(brand.reward_pool_balance) < 50 && (
          <p className="text-sm text-destructive mt-2 font-medium">
            ⚠️ Balance is low — users won't be able to earn rewards when this reaches $0
          </p>
        )}
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">
            Stripe funding integration coming soon. Contact <strong>admin@ogrewards.io</strong> to add funds manually.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Funding history */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Funding History</h2>
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-right p-3 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {fundingHistory?.map(f => (
                  <tr key={f.id} className="border-t">
                    <td className="p-3 text-muted-foreground">{new Date(f.created_at).toLocaleDateString()}</td>
                    <td className="p-3 text-right font-medium text-green-600">+${Number(f.amount).toFixed(2)}</td>
                  </tr>
                ))}
                {!fundingHistory?.length && (
                  <tr><td colSpan={2} className="p-6 text-center text-muted-foreground">No funding history</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payout history */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Payout History</h2>
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-left p-3 font-medium">Method</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-right p-3 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {payoutHistory?.map((p, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-3 text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="p-3 capitalize">{p.method}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        p.status === 'paid' ? 'bg-green-100 text-green-700' :
                        p.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                        p.status === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-right font-medium text-red-600">-${Number(p.amount).toFixed(2)}</td>
                  </tr>
                ))}
                {!payoutHistory?.length && (
                  <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">No payouts yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

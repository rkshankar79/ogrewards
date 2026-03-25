import { createClient, createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SKUManager from '@/components/admin/sku-manager'

export default async function SKUsPage() {
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

  const { data: skus } = await serviceSupabase
    .from('skus')
    .select('*')
    .eq('brand_id', adminRecord.brand_id)
    .order('created_at', { ascending: true })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">SKU Manager</h1>
      </div>
      <SKUManager skus={skus || []} brandId={adminRecord.brand_id} />
    </div>
  )
}

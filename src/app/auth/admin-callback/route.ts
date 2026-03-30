import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) return NextResponse.redirect(`${origin}/admin/login?error=missing_code`)

  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !user) return NextResponse.redirect(`${origin}/admin/login?error=auth_failed`)

  // Password reset flow — redirect to set new password
  const type = searchParams.get('type')
  if (type === 'recovery') {
    return NextResponse.redirect(`${origin}/admin/reset-password`)
  }

  // Check if user is a brand admin
  const serviceSupabase = createServiceClient()
  const { data: adminRecord } = await serviceSupabase
    .from('brand_admins')
    .select('brand_id')
    .eq('email', user.email)
    .single()

  if (!adminRecord) {
    await supabase.auth.signOut()
    return NextResponse.redirect(`${origin}/admin/login?error=not_authorized`)
  }

  return NextResponse.redirect(`${origin}/admin/dashboard`)
}

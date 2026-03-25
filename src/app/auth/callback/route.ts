import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const brandSlug = searchParams.get('brand') || 'nightphantom'

  if (!code) {
    return NextResponse.redirect(`${origin}/${brandSlug}?error=missing_code`)
  }

  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !user) {
    return NextResponse.redirect(`${origin}/${brandSlug}?error=auth_failed`)
  }

  // Check if user profile exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!existingUser) {
    // New user — create profile from magic link metadata
    const meta = user.user_metadata || {}

    const { error: insertError } = await supabase.from('users').insert({
      id: user.id,
      email: user.email!,
      date_of_birth: meta.date_of_birth,
      state: meta.state || 'IL',
    })

    if (insertError) {
      return NextResponse.redirect(`${origin}/${brandSlug}?error=profile_failed`)
    }

    // Create wallet for the brand they came from
    const { data: brand } = await supabase
      .from('brands')
      .select('id')
      .eq('slug', brandSlug)
      .single()

    if (brand) {
      await supabase.from('brand_wallets').insert({
        user_id: user.id,
        brand_id: brand.id,
      })
    }

    return NextResponse.redirect(`${origin}/${brandSlug}/onboarding`)
  }

  // Existing user — ensure they have a wallet for this brand
  const { data: brand } = await supabase
    .from('brands')
    .select('id')
    .eq('slug', brandSlug)
    .single()

  if (brand) {
    await supabase.from('brand_wallets').upsert({
      user_id: user.id,
      brand_id: brand.id,
    }, { onConflict: 'user_id,brand_id', ignoreDuplicates: true })
  }

  return NextResponse.redirect(`${origin}/${brandSlug}/dashboard`)
}

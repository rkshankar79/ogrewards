import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendPayout } from '@/lib/tremendous'
import { NextRequest, NextResponse } from 'next/server'
import { PAYOUT_THRESHOLD } from '@/types'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const serviceSupabase = createServiceClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { wallet_id, method, destination } = await request.json()

  if (!wallet_id || !method || !destination) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (!['venmo', 'paypal'].includes(method)) {
    return NextResponse.json({ error: 'Invalid payout method' }, { status: 400 })
  }

  // Fetch wallet with brand
  const { data: wallet } = await serviceSupabase
    .from('brand_wallets')
    .select('*, brand:brands(*)')
    .eq('id', wallet_id)
    .eq('user_id', user.id)
    .single()

  if (!wallet) return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })

  const balance = Number(wallet.balance)

  // Must meet threshold
  if (balance < PAYOUT_THRESHOLD) {
    return NextResponse.json({
      error: `Minimum cash out is $${PAYOUT_THRESHOLD.toFixed(2)}. Your balance is $${balance.toFixed(2)}.`
    }, { status: 400 })
  }

  // Check for pending payout already in flight
  const { data: pendingPayout } = await serviceSupabase
    .from('payouts')
    .select('id')
    .eq('user_id', user.id)
    .eq('brand_id', wallet.brand_id)
    .in('status', ['pending', 'processing'])
    .single()

  if (pendingPayout) {
    return NextResponse.json({ error: 'You already have a payout in progress.' }, { status: 409 })
  }

  // Fetch user profile for recipient name
  const { data: userProfile } = await serviceSupabase
    .from('users')
    .select('email')
    .eq('id', user.id)
    .single()

  // Create payout record first (pending)
  const { data: payout, error: payoutInsertError } = await serviceSupabase
    .from('payouts')
    .insert({
      user_id: user.id,
      brand_id: wallet.brand_id,
      amount: balance,
      method,
      destination,
      status: 'pending',
    })
    .select()
    .single()

  if (payoutInsertError || !payout) {
    return NextResponse.json({ error: 'Failed to create payout record' }, { status: 500 })
  }

  // Zero out wallet balance immediately to prevent double payout
  await serviceSupabase
    .from('brand_wallets')
    .update({ balance: 0 })
    .eq('id', wallet_id)

  // Send via Tremendous
  const result = await sendPayout({
    amount: balance,
    method: method.toUpperCase() as 'VENMO' | 'PAYPAL',
    destination,
    recipientName: userProfile?.email || user.email || 'OGRewards User',
    recipientEmail: userProfile?.email || user.email || '',
  })

  if (!result.success) {
    // Restore wallet balance on failure
    await serviceSupabase
      .from('brand_wallets')
      .update({ balance })
      .eq('id', wallet_id)

    // Mark payout as failed
    await serviceSupabase
      .from('payouts')
      .update({ status: 'failed' })
      .eq('id', payout.id)

    return NextResponse.json({ error: result.error || 'Payout failed. Your balance has been restored.' }, { status: 500 })
  }

  // Mark payout as processing with Tremendous IDs
  await serviceSupabase
    .from('payouts')
    .update({
      status: 'processing',
      tremendous_id: result.order_id,
    })
    .eq('id', payout.id)

  return NextResponse.json({
    success: true,
    amount: balance,
    method,
    message: `$${balance.toFixed(2)} is on its way to your ${method === 'venmo' ? 'Venmo' : 'PayPal'}!`,
  })
}

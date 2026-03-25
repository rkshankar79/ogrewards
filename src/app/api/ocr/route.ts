import { createServiceClient } from '@/lib/supabase/server'
import { scanReceipt } from '@/lib/anthropic/ocr'
import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

const VELOCITY_LIMIT = 3 // max scans per 24 hours per brand

// Reward amounts by level and category
const REWARD_RATES: Record<string, Record<string, number>> = {
  legend: { vape: 0.75, preroll: 0.50, flower: 0.50, other: 0.25 },
  standard: { vape: 0.50, preroll: 0.25, flower: 0.25, other: 0.25 },
}

export async function POST(request: NextRequest) {
  const supabase = await createServiceClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('receipt') as File | null
  const brandId = formData.get('brand_id') as string | null
  const walletId = formData.get('wallet_id') as string | null

  if (!file || !brandId || !walletId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!validTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type. Use JPG, PNG, or WebP.' }, { status: 400 })
  }

  // Fetch brand and wallet
  const [{ data: brand }, { data: wallet }] = await Promise.all([
    supabase.from('brands').select('*').eq('id', brandId).single(),
    supabase.from('brand_wallets').select('*').eq('id', walletId).eq('user_id', user.id).single(),
  ])

  if (!brand) return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
  if (!wallet) return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })

  // Check reward pool balance
  if (Number(brand.reward_pool_balance) <= 0) {
    return NextResponse.json({ error: 'Rewards temporarily unavailable for this brand.' }, { status: 503 })
  }

  // Velocity limit — max scans per 24 hours
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { count } = await supabase
    .from('scans')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('brand_id', brandId)
    .gte('created_at', since)

  if ((count || 0) >= (brand.scan_velocity_limit || VELOCITY_LIMIT)) {
    return NextResponse.json({
      error: `You've reached the daily scan limit of ${brand.scan_velocity_limit || VELOCITY_LIMIT} receipts. Try again tomorrow.`
    }, { status: 429 })
  }

  // Convert image to base64
  const buffer = Buffer.from(await file.arrayBuffer())
  const base64 = buffer.toString('base64')
  const mediaType = file.type as 'image/jpeg' | 'image/png' | 'image/webp'

  // Upload to Supabase Storage
  const fileName = `${user.id}/${brandId}/${Date.now()}.${file.type.split('/')[1]}`
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('receipts')
    .upload(fileName, buffer, { contentType: file.type })

  if (uploadError) {
    return NextResponse.json({ error: 'Failed to upload receipt image.' }, { status: 500 })
  }

  const imageUrl = uploadData.path

  // Call Claude Haiku OCR
  let ocrResult
  try {
    ocrResult = await scanReceipt(base64, mediaType, brand.name)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to read receipt. Please try a clearer photo.' }, { status: 422 })
  }

  // Generate receipt fingerprint
  const hashInput = `${ocrResult.store_name}|${ocrResult.receipt_date}|${ocrResult.receipt_total}|${ocrResult.dispensary_sku_code}`
  const receiptHash = createHash('sha256').update(hashInput).digest('hex')

  // Check for duplicate
  const { data: existing } = await supabase
    .from('scans')
    .select('id')
    .eq('receipt_hash', receiptHash)
    .eq('brand_id', brandId)
    .single()

  if (existing) {
    await supabase.from('scans').insert({
      user_id: user.id,
      brand_id: brandId,
      image_url: imageUrl,
      receipt_hash: receiptHash,
      store_name: ocrResult.store_name,
      receipt_date: ocrResult.receipt_date,
      receipt_total: ocrResult.receipt_total,
      raw_ocr_response: ocrResult as unknown as Record<string, unknown>,
      status: 'duplicate',
      reward_amount: 0,
    })
    return NextResponse.json({ status: 'duplicate', message: 'This receipt has already been submitted.' })
  }

  // No matched products
  if (!ocrResult.matched_products || ocrResult.matched_products.length === 0) {
    await supabase.from('scans').insert({
      user_id: user.id,
      brand_id: brandId,
      image_url: imageUrl,
      receipt_hash: receiptHash,
      store_name: ocrResult.store_name,
      receipt_date: ocrResult.receipt_date,
      receipt_total: ocrResult.receipt_total,
      raw_ocr_response: ocrResult as unknown as Record<string, unknown>,
      status: 'rejected',
      reward_amount: 0,
    })
    return NextResponse.json({ status: 'no_match', message: `No ${brand.name} products found on this receipt.` })
  }

  // Calculate reward based on user level
  const rates = wallet.level === 'legend' ? REWARD_RATES.legend : REWARD_RATES.standard
  let totalReward = 0

  for (const product of ocrResult.matched_products) {
    const qty = product.quantity || 1
    const rate = (rates as Record<string, number>)[product.category] ?? 0.25
    totalReward += rate * qty
  }

  // Cap reward at available pool balance
  totalReward = Math.min(totalReward, Number(brand.reward_pool_balance))
  totalReward = Math.round(totalReward * 100) / 100

  // Calculate new level
  const newScanCount = wallet.scan_count + 1
  let newLevel = 'recruit'
  if (newScanCount >= 25) newLevel = 'legend'
  else if (newScanCount >= 10) newLevel = 'hero'
  else if (newScanCount >= 3) newLevel = 'vigilante'

  // Write scan record
  await supabase.from('scans').insert({
    user_id: user.id,
    brand_id: brandId,
    image_url: imageUrl,
    receipt_hash: receiptHash,
    store_name: ocrResult.store_name,
    receipt_date: ocrResult.receipt_date,
    receipt_total: ocrResult.receipt_total,
    raw_ocr_response: ocrResult as unknown as Record<string, unknown>,
    status: 'approved',
    reward_amount: totalReward,
  })

  // Update wallet balance, scan count, level
  await supabase.from('brand_wallets').update({
    balance: Number(wallet.balance) + totalReward,
    total_earned: Number(wallet.total_earned) + totalReward,
    scan_count: newScanCount,
    level: newLevel,
  }).eq('id', walletId)

  // Deduct from brand reward pool
  await supabase.from('brands').update({
    reward_pool_balance: Number(brand.reward_pool_balance) - totalReward,
  }).eq('id', brandId)

  return NextResponse.json({
    status: 'approved',
    reward_amount: totalReward,
    products_found: ocrResult.matched_products.length,
    new_balance: Number(wallet.balance) + totalReward,
    new_level: newLevel,
    leveled_up: newLevel !== wallet.level,
    message: `+$${totalReward.toFixed(2)} added to your ${brand.name} wallet!`,
  })
}

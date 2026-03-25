export type Brand = {
  id: string
  name: string
  slug: string
  logo_url: string | null
  primary_color: string
  custom_domain: string | null
  reward_pool_balance: number
  stripe_customer_id: string | null
  scan_velocity_limit: number
  is_active: boolean
  created_at: string
}

export type SKU = {
  id: string
  brand_id: string
  name: string
  reward_amount: number
  is_active: boolean
  created_at: string
}

export type User = {
  id: string
  email: string
  date_of_birth: string
  state: string
  created_at: string
}

export type BrandWallet = {
  id: string
  user_id: string
  brand_id: string
  balance: number
  total_earned: number
  scan_count: number
  level: 'recruit' | 'vigilante' | 'hero' | 'legend'
  created_at: string
  brand?: Brand
}

export type Scan = {
  id: string
  user_id: string
  brand_id: string
  image_url: string
  receipt_hash: string
  store_name: string | null
  receipt_date: string | null
  receipt_total: number | null
  raw_ocr_response: Record<string, unknown> | null
  status: 'pending' | 'approved' | 'rejected' | 'duplicate'
  reward_amount: number
  created_at: string
}

export type Payout = {
  id: string
  user_id: string
  brand_id: string
  amount: number
  method: 'venmo' | 'paypal'
  destination: string
  tremendous_id: string | null
  status: 'pending' | 'processing' | 'paid' | 'failed'
  created_at: string
}

export type BrandFunding = {
  id: string
  brand_id: string
  amount: number
  stripe_payment_id: string
  created_at: string
}

export type Level = 'recruit' | 'vigilante' | 'hero' | 'legend'

export const LEVEL_THRESHOLDS: Record<Level, number> = {
  recruit: 0,
  vigilante: 3,
  hero: 10,
  legend: 25,
}

export const PAYOUT_THRESHOLD = 5.00

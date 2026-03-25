const BASE_URL = process.env.TREMENDOUS_TEST_MODE === 'true'
  ? 'https://testflight.tremendous.com/api/v2'
  : 'https://www.tremendous.com/api/v2'

const headers = {
  'Authorization': `Bearer ${process.env.TREMENDOUS_API_KEY}`,
  'Content-Type': 'application/json',
}

export type PayoutMethod = 'VENMO' | 'PAYPAL'

export type TremendousResult = {
  success: boolean
  order_id?: string
  reward_id?: string
  error?: string
}

export async function sendPayout({
  amount,
  method,
  destination,
  recipientName,
  recipientEmail,
}: {
  amount: number
  method: PayoutMethod
  destination: string
  recipientName: string
  recipientEmail: string
}): Promise<TremendousResult> {
  const productId = method === 'VENMO' ? 'VENMO_PAYOUT' : 'PAYPAL_PAYOUT'

  const body = {
    payment: {
      funding_source_id: 'BALANCE',
    },
    rewards: [
      {
        value: {
          denomination: amount,
          currency_code: 'USD',
        },
        delivery: {
          method: method === 'VENMO' ? 'VENMO' : 'PAYPAL',
        },
        recipient: {
          name: recipientName,
          email: recipientEmail,
          ...(method === 'VENMO' ? { phone: destination } : { email: destination }),
        },
        products: [productId],
      },
    ],
  }

  try {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('Tremendous error:', data)
      return { success: false, error: data?.errors?.[0]?.message || 'Payout failed' }
    }

    const reward = data?.order?.rewards?.[0]
    return {
      success: true,
      order_id: data?.order?.id,
      reward_id: reward?.id,
    }
  } catch (err) {
    console.error('Tremendous network error:', err)
    return { success: false, error: 'Network error sending payout' }
  }
}

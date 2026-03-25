import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export type OCRResult = {
  store_name: string | null
  receipt_date: string | null
  receipt_total: number | null
  dispensary_sku_code: string | null
  matched_products: {
    name: string
    category: 'vape' | 'preroll' | 'flower' | 'other'
    quantity: number
    unit_price: number
    final_price: number
    dispensary_sku_code: string | null
  }[]
}

export async function scanReceipt(
  imageBase64: string,
  mediaType: 'image/jpeg' | 'image/png' | 'image/webp',
  brandName: string
): Promise<OCRResult> {
  const prompt = `You are a receipt scanner for a cannabis loyalty rewards program.

Analyze this dispensary receipt and extract all products from the brand "${brandName}".

Instructions:
- Look for any product line items where "${brandName}" appears in the product name
- For each matched product, classify it as: vape (carts, vapes, cartridges), preroll (pre-rolls, joints, blunts), or flower (bud, eighths, grams, oz)
- Extract the dispensary's internal SKU/item code (usually an alphanumeric code like "QD1PYCJZ")
- Use the FINAL price paid after any discounts (not the original price)
- Extract store name, date, and receipt total

Return ONLY valid JSON in this exact format:
{
  "store_name": "string or null",
  "receipt_date": "YYYY-MM-DD or null",
  "receipt_total": number or null,
  "dispensary_sku_code": "first sku code found or null",
  "matched_products": [
    {
      "name": "full product name from receipt",
      "category": "vape | preroll | flower | other",
      "quantity": 1,
      "unit_price": 0.00,
      "final_price": 0.00,
      "dispensary_sku_code": "alphanumeric code or null"
    }
  ]
}

If no "${brandName}" products are found, return an empty matched_products array.
Do not include any explanation — only the JSON object.`

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: imageBase64,
            },
          },
          {
            type: 'text',
            text: prompt,
          },
        ],
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''

  // Strip markdown code fences if present
  const cleaned = text.replace(/```json\n?|\n?```/g, '').trim()
  const result: OCRResult = JSON.parse(cleaned)
  return result
}

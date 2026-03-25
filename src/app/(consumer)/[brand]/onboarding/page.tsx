'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useBrand } from '@/lib/brand-context'
import { Button } from '@/components/ui/button'

const slides = [
  {
    emoji: '🧾',
    title: 'Scan Your Receipt',
    desc: 'After buying our products at any dispensary, upload a photo of your receipt.',
  },
  {
    emoji: '💰',
    title: 'Earn Real Cash',
    desc: 'Earn $0.50 per vape and $0.25 per pre-roll or flower. No points — actual dollars.',
  },
  {
    emoji: '🏆',
    title: 'Cash Out at $5',
    desc: 'Hit $5.00 and cash out directly to your Venmo or PayPal. Level up for bonus rewards.',
  },
]

export default function OnboardingPage() {
  const brand = useBrand()
  const params = useParams()
  const router = useRouter()
  const [current, setCurrent] = useState(0)

  const isLast = current === slides.length - 1

  function next() {
    if (isLast) {
      router.push(`/${params.brand}/dashboard`)
    } else {
      setCurrent(c => c + 1)
    }
  }

  const slide = slides[current]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      {/* Brand name */}
      <p className="text-sm font-medium mb-12" style={{ color: brand.primary_color }}>
        {brand.name} Rewards
      </p>

      {/* Slide */}
      <div className="text-6xl mb-6">{slide.emoji}</div>
      <h2 className="text-2xl font-bold mb-3">{slide.title}</h2>
      <p className="text-muted-foreground max-w-xs mb-12">{slide.desc}</p>

      {/* Dots */}
      <div className="flex gap-2 mb-8">
        {slides.map((_, i) => (
          <div
            key={i}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === current ? '24px' : '8px',
              backgroundColor: i === current ? brand.primary_color : '#e5e7eb',
            }}
          />
        ))}
      </div>

      <Button
        onClick={next}
        className="w-full max-w-xs text-white"
        style={{ backgroundColor: brand.primary_color }}
      >
        {isLast ? 'Go to Dashboard' : 'Next'}
      </Button>

      {!isLast && (
        <button
          onClick={() => router.push(`/${params.brand}/dashboard`)}
          className="mt-4 text-sm text-muted-foreground underline"
        >
          Skip
        </button>
      )}
    </div>
  )
}

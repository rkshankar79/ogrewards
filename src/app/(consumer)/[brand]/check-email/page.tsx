'use client'

import { useSearchParams } from 'next/navigation'
import { useBrand } from '@/lib/brand-context'
import { Suspense } from 'react'

function CheckEmailContent() {
  const brand = useBrand()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || 'your email'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div
        className="h-20 w-20 rounded-full flex items-center justify-center text-4xl mb-6"
        style={{ backgroundColor: `${brand.primary_color}20` }}
      >
        📬
      </div>
      <h1 className="text-2xl font-bold mb-2">Check your email</h1>
      <p className="text-muted-foreground mb-1">
        We sent a magic link to
      </p>
      <p className="font-semibold mb-6">{email}</p>
      <p className="text-sm text-muted-foreground max-w-xs">
        Click the link in your email to sign in. No password needed — the link expires in 1 hour.
      </p>
    </div>
  )
}

export default function CheckEmailPage() {
  return (
    <Suspense>
      <CheckEmailContent />
    </Suspense>
  )
}

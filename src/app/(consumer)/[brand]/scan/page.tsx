'use client'

import { useState, useRef } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useBrand } from '@/lib/brand-context'
import { Button } from '@/components/ui/button'
import { Suspense } from 'react'

type ScanResult = {
  status: 'approved' | 'duplicate' | 'no_match' | 'error'
  message: string
  reward_amount?: number
  new_balance?: number
  leveled_up?: boolean
  new_level?: string
  products_found?: number
}

function ScanContent() {
  const brand = useBrand()
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const walletId = searchParams.get('wallet')
  const brandId = searchParams.get('brand_id')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    setResult(null)
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(selected)
  }

  async function handleSubmit() {
    if (!file || !walletId || !brandId) return
    setLoading(true)
    setResult(null)

    const formData = new FormData()
    formData.append('receipt', file)
    formData.append('brand_id', brandId)
    formData.append('wallet_id', walletId)

    try {
      const res = await fetch('/api/ocr', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) {
        setResult({ status: 'error', message: data.error || 'Something went wrong.' })
      } else {
        setResult(data)
      }
    } catch {
      setResult({ status: 'error', message: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setFile(null)
    setPreview(null)
    setResult(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="min-h-screen flex flex-col px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => router.back()} className="text-muted-foreground text-sm">← Back</button>
        <h1 className="text-xl font-bold">Scan Receipt</h1>
      </div>

      {/* Result Screen */}
      {result && (
        <div className="flex flex-col items-center justify-center flex-1 text-center">
          {result.status === 'approved' && (
            <>
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold mb-1">{result.message}</h2>
              <p className="text-muted-foreground mb-2">
                {result.products_found} {brand.name} product{result.products_found !== 1 ? 's' : ''} found
              </p>
              <p className="text-3xl font-bold mb-1" style={{ color: brand.primary_color }}>
                +${result.reward_amount?.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                New balance: ${result.new_balance?.toFixed(2)}
              </p>
              {result.leveled_up && (
                <div className="mb-6 px-4 py-2 rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: brand.primary_color }}>
                  🏆 Leveled up to {result.new_level}!
                </div>
              )}
              <div className="flex gap-3 w-full max-w-xs">
                <Button onClick={reset} variant="outline" className="flex-1">Scan Another</Button>
                <Button
                  onClick={() => router.push(`/${params.brand}/dashboard`)}
                  className="flex-1 text-white"
                  style={{ backgroundColor: brand.primary_color }}
                >
                  Dashboard
                </Button>
              </div>
            </>
          )}

          {result.status === 'duplicate' && (
            <>
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold mb-2">Already Submitted</h2>
              <p className="text-muted-foreground mb-6">{result.message}</p>
              <div className="flex gap-3 w-full max-w-xs">
                <Button onClick={reset} variant="outline" className="flex-1">Try Another</Button>
                <Button
                  onClick={() => router.push(`/${params.brand}/dashboard`)}
                  className="flex-1 text-white"
                  style={{ backgroundColor: brand.primary_color }}
                >
                  Dashboard
                </Button>
              </div>
            </>
          )}

          {result.status === 'no_match' && (
            <>
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-xl font-bold mb-2">No Products Found</h2>
              <p className="text-muted-foreground mb-6">{result.message}</p>
              <div className="flex gap-3 w-full max-w-xs">
                <Button onClick={reset} variant="outline" className="flex-1">Try Again</Button>
                <Button
                  onClick={() => router.push(`/${params.brand}/dashboard`)}
                  className="flex-1 text-white"
                  style={{ backgroundColor: brand.primary_color }}
                >
                  Dashboard
                </Button>
              </div>
            </>
          )}

          {result.status === 'error' && (
            <>
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
              <p className="text-muted-foreground mb-6">{result.message}</p>
              <Button onClick={reset} variant="outline">Try Again</Button>
            </>
          )}
        </div>
      )}

      {/* Upload UI */}
      {!result && (
        <div className="flex flex-col flex-1">
          {/* Image Preview / Upload Area */}
          <div
            onClick={() => !loading && fileInputRef.current?.click()}
            className="relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl min-h-64 mb-6 cursor-pointer overflow-hidden"
            style={{ borderColor: preview ? brand.primary_color : '#e5e7eb' }}
          >
            {preview ? (
              <img src={preview} alt="Receipt preview" className="w-full h-full object-contain max-h-80" />
            ) : (
              <div className="text-center p-8">
                <div className="text-5xl mb-3">📷</div>
                <p className="font-semibold">Tap to take photo or upload</p>
                <p className="text-sm text-muted-foreground mt-1">JPG, PNG, or WebP</p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Loading Spinner */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-8">
              <div
                className="h-12 w-12 rounded-full border-4 border-t-transparent animate-spin mb-4"
                style={{ borderColor: `${brand.primary_color}40`, borderTopColor: brand.primary_color }}
              />
              <p className="font-medium">Reading your receipt...</p>
              <p className="text-sm text-muted-foreground mt-1">This takes a few seconds</p>
            </div>
          )}

          {/* Actions */}
          {!loading && (
            <div className="space-y-3 mt-auto">
              {preview && (
                <Button
                  onClick={handleSubmit}
                  className="w-full text-white"
                  style={{ backgroundColor: brand.primary_color }}
                >
                  Submit Receipt
                </Button>
              )}
              {preview && (
                <Button onClick={reset} variant="outline" className="w-full">
                  Choose Different Photo
                </Button>
              )}
              {!preview && (
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full text-white"
                  style={{ backgroundColor: brand.primary_color }}
                >
                  Choose Photo
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ScanPage() {
  return (
    <Suspense>
      <ScanContent />
    </Suspense>
  )
}

import { createClient } from '@/lib/supabase/server'
import { BrandProvider } from '@/lib/brand-context'
import { notFound } from 'next/navigation'

export default async function BrandLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ brand: string }>
}) {
  const { brand: slug } = await params
  const supabase = await createClient()

  const { data: brand } = await supabase
    .from('brands')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!brand) notFound()

  return (
    <BrandProvider brand={brand}>
      <div
        style={{ '--brand-color': brand.primary_color } as React.CSSProperties}
        className="min-h-screen bg-background"
      >
        {children}
      </div>
    </BrandProvider>
  )
}

'use client'

import { createContext, useContext } from 'react'
import type { Brand } from '@/types'

const BrandContext = createContext<Brand | null>(null)

export function BrandProvider({ brand, children }: { brand: Brand; children: React.ReactNode }) {
  return (
    <BrandContext.Provider value={brand}>
      {children}
    </BrandContext.Provider>
  )
}

export function useBrand() {
  const brand = useContext(BrandContext)
  if (!brand) throw new Error('useBrand must be used within BrandProvider')
  return brand
}

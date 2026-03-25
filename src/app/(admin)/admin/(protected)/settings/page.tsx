'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SettingsPage() {
  const supabase = createClient()
  const [brandId, setBrandId] = useState('')
  const [name, setName] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#000000')
  const [customDomain, setCustomDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: adminRecord } = await supabase
        .from('brand_admins')
        .select('brand_id, brand:brands(*)')
        .eq('email', user.email)
        .single()

      if (!adminRecord) return
      const brand = adminRecord.brand as any
      setBrandId(adminRecord.brand_id)
      setName(brand.name || '')
      setPrimaryColor(brand.primary_color || '#000000')
      setCustomDomain(brand.custom_domain || '')
    }
    load()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSaved(false)
    setError('')

    const { error: updateError } = await supabase
      .from('brands')
      .update({ name, primary_color: primaryColor, custom_domain: customDomain || null })
      .eq('id', brandId)

    if (updateError) {
      setError(updateError.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setLoading(false)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Customize your brand appearance and domain</p>
      </div>

      <form onSubmit={handleSave} className="max-w-md space-y-5">
        <div className="space-y-1">
          <Label htmlFor="name">Brand Name</Label>
          <Input
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="color">Primary Color</Label>
          <div className="flex items-center gap-3">
            <input
              id="color"
              type="color"
              value={primaryColor}
              onChange={e => setPrimaryColor(e.target.value)}
              className="h-10 w-16 rounded cursor-pointer border"
            />
            <Input
              value={primaryColor}
              onChange={e => setPrimaryColor(e.target.value)}
              placeholder="#000000"
              className="w-32 font-mono"
            />
            <div className="h-10 w-10 rounded-full border" style={{ backgroundColor: primaryColor }} />
          </div>
          <p className="text-xs text-muted-foreground">Used for progress bars and buttons in the consumer app</p>
        </div>

        <div className="space-y-1">
          <Label htmlFor="domain">Custom Domain</Label>
          <Input
            id="domain"
            value={customDomain}
            onChange={e => setCustomDomain(e.target.value)}
            placeholder="rewards.yourbrand.com"
          />
          <p className="text-xs text-muted-foreground">
            Point a CNAME record to <code className="bg-muted px-1 rounded">cname.vercel-dns.com</code> then enter your domain here
          </p>
        </div>

        {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
        {saved && <p className="text-sm text-green-600 font-semibold">✓ Settings saved</p>}

        <button type="submit" disabled={loading}
          className="px-6 py-2.5 rounded-xl font-bold text-white text-sm transition-all active:scale-95 disabled:opacity-60 shadow-md"
          style={{ background: primaryColor || '#1a1a2e' }}>
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}

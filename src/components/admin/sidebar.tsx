'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Brand } from '@/types'

const GREEN = '#00d084'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', emoji: '📊' },
  { href: '/admin/skus', label: 'SKU Manager', emoji: '🏷️' },
  { href: '/admin/funding', label: 'Reward Pool', emoji: '💰' },
  { href: '/admin/reports', label: 'Reports', emoji: '📈' },
  { href: '/admin/settings', label: 'Settings', emoji: '⚙️' },
]

export default function AdminSidebar({ brand }: { brand: Brand }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const isLow = Number(brand.reward_pool_balance) < 50

  return (
    <aside className="w-60 min-h-screen flex flex-col border-r" style={{ backgroundColor: '#0a0a0a', borderColor: 'rgba(255,255,255,0.08)' }}>
      {/* Brand header */}
      <div className="p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3">
          {brand.logo_url ? (
            <img src={brand.logo_url} alt={brand.name} className="h-8 w-8 object-contain rounded-lg" />
          ) : (
            <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-sm font-black"
              style={{ backgroundColor: brand.primary_color }}>
              {brand.name[0]}
            </div>
          )}
          <div>
            <p className="font-bold text-sm text-white leading-none">{brand.name}</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Pool balance pill */}
      <div className="mx-4 mt-4 px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between"
        style={{
          backgroundColor: isLow ? 'rgba(239,68,68,0.1)' : 'rgba(0,208,132,0.08)',
          border: `1px solid ${isLow ? 'rgba(239,68,68,0.2)' : 'rgba(0,208,132,0.2)'}`,
          color: isLow ? '#f87171' : GREEN,
        }}>
        <span>Reward Pool</span>
        <span className="font-black text-sm">
          ${Number(brand.reward_pool_balance).toFixed(2)}
          {isLow && ' ⚠️'}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 mt-3">
        {navItems.map(item => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={active
                ? { backgroundColor: GREEN, color: '#000' }
                : { color: 'rgba(255,255,255,0.5)' }
              }
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.06)' }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}>
              <span className="text-base">{item.emoji}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* OGRewards branding */}
      <div className="px-5 py-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.15)' }}>Powered by OGRewards</p>
      </div>

      {/* Sign out */}
      <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <button onClick={handleSignOut}
          className="w-full text-left px-3 py-2 text-sm rounded-xl transition-all"
          style={{ color: 'rgba(255,255,255,0.3)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'white'; (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.06)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)'; (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}>
          Sign Out →
        </button>
      </div>
    </aside>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Brand } from '@/types'

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
    <aside className="w-60 min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Brand header */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3 mb-1">
          {brand.logo_url ? (
            <img src={brand.logo_url} alt={brand.name} className="h-8 w-8 object-contain rounded-lg" />
          ) : (
            <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-sm font-black"
              style={{ backgroundColor: brand.primary_color }}>
              {brand.name[0]}
            </div>
          )}
          <div>
            <p className="font-bold text-sm leading-none">{brand.name}</p>
            <p className="text-white/40 text-xs mt-0.5">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Pool balance pill */}
      <div className={`mx-4 mt-4 px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${isLow ? 'bg-red-500/20 text-red-300' : 'bg-white/10 text-white/70'}`}>
        <span>Reward Pool</span>
        <span className={`font-black text-sm ${isLow ? 'text-red-300' : 'text-white'}`}>
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active ? 'bg-white text-gray-900' : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}>
              <span className="text-base">{item.emoji}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* OGRewards branding */}
      <div className="px-5 py-3 border-t border-white/10">
        <p className="text-white/20 text-xs font-semibold tracking-widest uppercase">Powered by OGRewards</p>
      </div>

      {/* Sign out */}
      <div className="p-3 border-t border-white/10">
        <button onClick={handleSignOut}
          className="w-full text-left px-3 py-2 text-sm text-white/40 hover:text-white rounded-xl hover:bg-white/10 transition-all">
          Sign Out →
        </button>
      </div>
    </aside>
  )
}

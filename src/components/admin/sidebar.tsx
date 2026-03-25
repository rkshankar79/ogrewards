'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Brand } from '@/types'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/skus', label: 'SKU Manager' },
  { href: '/admin/funding', label: 'Reward Pool' },
  { href: '/admin/reports', label: 'Reports' },
  { href: '/admin/settings', label: 'Settings' },
]

export default function AdminSidebar({ brand }: { brand: Brand }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <aside className="w-56 border-r bg-muted/30 flex flex-col">
      {/* Brand header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          {brand.logo_url ? (
            <img src={brand.logo_url} alt={brand.name} className="h-7 w-7 object-contain rounded" />
          ) : (
            <div
              className="h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: brand.primary_color }}
            >
              {brand.name[0]}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold leading-none">{brand.name}</p>
            <p className="text-xs text-muted-foreground">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === item.href
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Pool balance */}
      <div className="p-4 border-t">
        <p className="text-xs text-muted-foreground">Reward Pool</p>
        <p className="text-lg font-bold">${Number(brand.reward_pool_balance).toFixed(2)}</p>
      </div>

      {/* Sign out */}
      <div className="p-3 border-t">
        <button
          onClick={handleSignOut}
          className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
        >
          Sign Out
        </button>
      </div>
    </aside>
  )
}

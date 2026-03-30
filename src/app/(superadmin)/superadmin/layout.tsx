import { createClient, createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const SUPER_ADMIN_EMAILS = ['rkshankar@gmail.com']

const navItems = [
  { href: '/superadmin/dashboard', label: 'Overview', emoji: '📊' },
  { href: '/superadmin/brands', label: 'Brands', emoji: '🏷️' },
  { href: '/superadmin/users', label: 'Users', emoji: '👥' },
]

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !SUPER_ADMIN_EMAILS.includes(user.email!)) {
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#080808' }}>
      {/* Sidebar */}
      <aside className="w-56 min-h-screen flex flex-col border-r" style={{ backgroundColor: '#0a0a0a', borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-2">
            <span className="h-7 w-7 rounded-lg flex items-center justify-center text-black text-xs font-black" style={{ backgroundColor: '#00d084' }}>O</span>
            <div>
              <p className="font-black text-white text-sm">OGRewards</p>
              <p className="text-xs" style={{ color: '#00d084' }}>Super Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 mt-2">
          {navItems.map(item => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ color: 'rgba(255,255,255,0.5)' }}>
              <span>{item.emoji}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <p className="text-xs px-3" style={{ color: 'rgba(255,255,255,0.2)' }}>{user.email}</p>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto text-white">
        {children}
      </main>
    </div>
  )
}

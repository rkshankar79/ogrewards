'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SuperAdminSignOut() {
  const supabase = createClient()
  const router = useRouter()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <button onClick={handleSignOut}
      className="w-full text-left px-3 py-2 text-sm rounded-xl transition-all"
      style={{ color: 'rgba(255,255,255,0.3)' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'white'; (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.06)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)'; (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}>
      Sign Out →
    </button>
  )
}

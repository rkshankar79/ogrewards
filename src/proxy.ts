import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect admin routes (exclude public auth pages)
  const adminPublicPaths = ['/admin/login', '/admin/forgot-password', '/admin/reset-password', '/auth/admin-callback']
  const isAdminPublic = adminPublicPaths.some(p => request.nextUrl.pathname.startsWith(p))
  if (request.nextUrl.pathname.startsWith('/admin') && !isAdminPublic && !user) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Protect superadmin routes
  if (request.nextUrl.pathname.startsWith('/superadmin') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

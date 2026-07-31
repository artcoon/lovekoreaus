import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

const protectedPaths = ['/dashboard', '/seller-onboarding']
const adminPaths = ['/admin']

const categorySlugs = [
  'k-beauty', 'k-food', 'k-fashion', 'k-pop', 'k-health',
  'k-stationery', 'k-baby', 'k-pets', 'k-traditional', 'k-automotive',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect root category paths like /k-beauty to /categories/k-beauty
  // Let next-intl handle the locale prefix (default -> /en/categories/...)
  const isRootCategory = categorySlugs.some((slug) =>
    pathname === `/${slug}` || pathname.startsWith(`/${slug}/`)
  )
  if (isRootCategory) {
    const newPath = pathname.replace(/^\/(k-[^/]+)/, '/categories/$1')
    return NextResponse.redirect(new URL(newPath, request.url))
  }
  // Run next-intl middleware for locale routing
  const intlResponse = intlMiddleware(request)
  const response = intlResponse || NextResponse.next({ request })

  // Disable Edge Network cache for content pages that depend on DB data
  if (pathname.includes('/k-contents') || pathname.includes('/categories/')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }

  // If Supabase is not configured, skip auth
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return response
  }

  // Refresh session via Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Check protected routes
  const isProtected = protectedPaths.some((p) => pathname.includes(p))
  if (isProtected && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check admin routes
  const isAdmin = adminPaths.some((p) => pathname.includes(p))
  if (isAdmin && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAdmin && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}

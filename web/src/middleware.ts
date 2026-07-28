import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

const protectedPaths = ['/dashboard', '/seller-onboarding']
const adminPaths = ['/admin']

const categorySlugs = [
  'k-beauty', 'k-food', 'k-fashion', 'k-pop', 'k-health', 'k-tech', 'k-home',
  'k-stationery', 'k-baby', 'k-pets', 'k-traditional', 'k-automotive',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect root category paths like /k-beauty to /en/categories/k-beauty
  const isRootCategory = categorySlugs.some((slug) =>
    pathname === `/${slug}` || pathname.startsWith(`/${slug}/`)
  )
  if (isRootCategory) {
    const newPath = pathname.replace(/^\/(k-[^/]+)/, '/en/categories/$1')
    return NextResponse.redirect(new URL(newPath, request.url))
  }

  // Also handle /categories/k-beauty without locale prefix
  const categoriesMatch = pathname.match(/^\/categories\/(k-[^/]+)/)
  if (categoriesMatch) {
    return NextResponse.redirect(new URL(`/en${pathname}`, request.url))
  }

  // Run next-intl middleware for locale routing
  const intlResponse = intlMiddleware(request)
  const response = intlResponse || NextResponse.next({ request })

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

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create Supabase client with user context (not service role)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected API routes - require authentication
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Exclude demo, public endpoints, and webhooks from auth requirement
    const publicEndpoints = ['/api/demo-chat', '/api/verify-site-password', '/api/webhooks/']
    const isPublicEndpoint = publicEndpoints.some(endpoint =>
      request.nextUrl.pathname.startsWith(endpoint)
    )

    if (!isPublicEndpoint && !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      )
    }
  }

  // Protected pages - redirect to login if not authenticated
  const protectedPaths = ['/profile', '/pack-maker', '/pack-maker-level1', '/pack-maker-level2', '/pack-maker-level3', '/payment']
  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedPath && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Add security headers to all responses
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // Content Security Policy
  // Note: Adjust CSP based on your actual needs
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co https://api.anthropic.com https://api.stripe.com https://*.algolia.net https://*.algolianet.com",
    "frame-src https://js.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ')

  response.headers.set('Content-Security-Policy', cspHeader)

  return response
}

export const config = {
  matcher: [
    '/api/:path*',
    '/profile/:path*',
    '/pack-maker/:path*',
    '/pack-maker-level1/:path*',
    '/pack-maker-level2/:path*',
    '/pack-maker-level3/:path*',
    '/payment/:path*',
    '/practice/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

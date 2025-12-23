import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip setup checks for API routes, static files, and setup page itself
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname === '/setup'
  ) {
    return NextResponse.next()
  }

  // Check if SETUP_SECRET is configured
  const setupSecret = process.env.SETUP_SECRET

  if (setupSecret) {
    // Redirect to setup page when SETUP_SECRET is present
    return NextResponse.redirect(new URL('/setup', request.url))
  }

  // No setup secret, proceed normally
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// Simple in-memory store for rate limiting
const ipRequests = new Map<string, { count: number; timestamp: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS = 100 // Max requests per minute per IP

// List of known crawler User-Agents
const KNOWN_BOTS = [
  'Googlebot',
  'Googlebot-Image',
  'Googlebot-News',
  'Googlebot-Video',
  'AdsBot-Google',
  'Bingbot',
  'DuckDuckBot',
]

// List of paths that should bypass middleware
const BYPASS_PATHS = [
  '/robots.txt',
  '/sitemap.xml',
  '/_next',
  '/favicon.ico',
  '/public',
]

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const token = request.cookies.get('token')?.value;

  // Admin route protection
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const { payload } = await jwtVerify(token, secret) as any;
      
      // DEBUG: Log JWT payload structure in development
      if (process.env.NODE_ENV === 'development') {
        console.log('🔐 Middleware JWT Payload:', {
          hasRole: !!payload.role,
          role: payload.role,
          hasUserId: !!payload.id || !!payload.userId || !!payload.user_id,
          userId: payload.id || payload.userId || payload.user_id,
          exp: payload.exp,
          iat: payload.iat,
          fullPayload: payload
        });
      }
      
      // ROBUST: Check for role in different possible locations
      let userRole;
      if (payload.role) {
        userRole = payload.role;
      } else if (payload.user?.role) {
        userRole = payload.user.role;
      } else if (payload.data?.role) {
        userRole = payload.data.role;
      } else {
        console.error('❌ No role found in JWT payload:', payload);
        return NextResponse.redirect(new URL('/login', request.url));
      }
      
      // Verify admin role
      if (userRole !== 'admin') {
        console.log('🚫 Non-admin user attempting to access admin route:', userRole);
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
      
      console.log('✅ Admin access granted for role:', userRole);
    } catch (err) {
      console.error('❌ JWT verification failed in middleware:', err);
      // Token is invalid or expired
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Regular user dashboard protection
  if (pathname.startsWith('/dashboard') && pathname !== '/dashboard') {
    // For any nested dashboard routes, ensure user is authenticated
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const { payload } = await jwtVerify(token, secret) as any;
      
      // Just verify the token is valid, don't restrict by role for regular dashboard
      console.log('✅ Authenticated user accessing dashboard:', payload.role || 'unknown role');
    } catch (err) {
      console.error('❌ JWT verification failed for dashboard access:', err);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Check if the path should bypass middleware
  if (BYPASS_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Check if the request is for a static file
  if (pathname.match(/\.(jpg|jpeg|gif|png|webp|svg|css|js|mp4)$/i)) {
    return NextResponse.next()
  }

  const response = NextResponse.next()
  
  // Check if the request is from a known bot
  const userAgent = request.headers.get('user-agent') || ''
  const isBot = KNOWN_BOTS.some(bot => userAgent.includes(bot))

  // Skip rate limiting and some security headers for known bots
  if (!isBot) {
    // Get the client's IP address
    const ip = request.headers.get('x-real-ip') || 
               request.headers.get('x-forwarded-for')?.split(',')[0] || 
               'unknown'
    
    // Basic Rate Limiting
    const now = Date.now()
    const requestData = ipRequests.get(ip) || { count: 0, timestamp: now }
    
    // Reset counter if outside window
    if (now - requestData.timestamp > RATE_LIMIT_WINDOW) {
      requestData.count = 0
      requestData.timestamp = now
    }
    
    requestData.count++
    ipRequests.set(ip, requestData)
    
    // If rate limit exceeded, return 429 Too Many Requests
    if (requestData.count > MAX_REQUESTS) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': '60',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }
  }

  // Get hostname (e.g. finaticlabs.com, www.finaticlabs.com, etc.)
  const hostname = request.headers.get('host') || ''
  const url = new URL(request.url)

  // Only handle www to non-www redirect for production domain
  if (hostname.startsWith('www.finaticlabs.com')) {
    const newUrl = `https://finaticlabs.com${url.pathname}${url.search}`
    return NextResponse.redirect(newUrl, 301)
  }

  // Add security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // More permissive CSP for crawlers
  const cspValue = isBot
    ? "default-src 'self' * data: blob: 'unsafe-inline' 'unsafe-eval'"
    : "default-src 'self' vercel.app *.vercel.app; script-src 'self' 'unsafe-inline' 'unsafe-eval' vercel.app *.vercel.app cdnjs.cloudflare.com unpkg.com cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' data: fonts.googleapis.com fonts.gstatic.com; connect-src 'self' *.vercel.app https://sec-x-backend.onrender.com;"

  response.headers.set('Content-Security-Policy', cspValue)

  return response
}

export const config = {
  matcher: [
    // Match all paths except static files and api routes
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
} 
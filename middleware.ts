import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

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
    : "default-src 'self' vercel.app *.vercel.app; script-src 'self' 'unsafe-inline' 'unsafe-eval' vercel.app *.vercel.app; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' *.vercel.app;"

  response.headers.set('Content-Security-Policy', cspValue)

  return response
}

export const config = {
  matcher: [
    // Match all paths except static files and api routes
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
} 
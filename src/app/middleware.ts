import { NextRequest, NextResponse } from 'next/server';

// Rate limiting store (in production, use Redis or a database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 10; // Max 10 requests per window

// Protected routes that require authentication
const PROTECTED_ROUTES = [
  '/jobs',
  '/profile',
  '/applications',
  '/settings',
  '/for-you',
  '/help'
];

function getRateLimitKey(request: NextRequest): string {
  // Use IP address for rate limiting
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
  return `rate_limit:${ip}`;
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  record.count++;
  return false;
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Apply security measures to Stripe API endpoints
  if (pathname.startsWith('/api/create-checkout-session') || pathname.startsWith('/api/webhooks/stripe')) {
    
    // Rate limiting for checkout session creation
    if (pathname.startsWith('/api/create-checkout-session')) {
      const rateLimitKey = getRateLimitKey(request);
      
      if (isRateLimited(rateLimitKey)) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        );
      }
    }

    // Security headers
    const response = NextResponse.next();
    
    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // For webhook endpoint, ensure it's only accessible via POST
    if (pathname.startsWith('/api/webhooks/stripe') && request.method !== 'POST') {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
    }

    return response;
  }

  // Check if the route is protected
  if (isProtectedRoute(pathname)) {
    // Note: We can't check Firebase auth in middleware since it runs on the edge
    // The actual auth check is handled by the ProtectedPage component on the client side
    // This middleware serves as documentation and could be extended for server-side auth
    
    // Add security headers for protected routes
    const response = NextResponse.next();
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/create-checkout-session/:path*',
    '/api/webhooks/stripe/:path*',
    '/jobs/:path*',
    '/profile/:path*',
    '/applications/:path*',
    '/settings/:path*',
    '/for-you/:path*',
    '/help/:path*'
  ],
};
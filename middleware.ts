import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Add debugging headers to API responses if in development
  const response = NextResponse.next();
  
  if (process.env.NODE_ENV === 'development') {
    // Add CORS headers for local development
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  
  return response;
}

// Configure which paths should use this middleware
export const config = {
  matcher: [
    // Apply to all API routes
    '/api/:path*',
  ],
};

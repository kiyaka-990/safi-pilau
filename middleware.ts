import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Modern auth check placeholder
  if (path.startsWith('/admin')) {
    // Logic for 'safi_auth' verification goes here in production
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
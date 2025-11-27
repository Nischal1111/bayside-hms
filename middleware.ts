import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
);

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const isPublicPath = path === '/' || path === '/login' || path === '/register';

  // Protected paths
  const isProtectedPath = path.startsWith('/dashboard');

  const token = request.cookies.get('auth-token')?.value;

  // Redirect to login if accessing protected path without token
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to dashboard if accessing public path with valid token
  if (isPublicPath && token && (path === '/login' || path === '/register')) {
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      const role = (payload as any).role;
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    } catch (error) {
      // Invalid token, clear it
      const response = NextResponse.next();
      response.cookies.delete('auth-token');
      return response;
    }
  }

  // Role-based access control for dashboard routes
  if (isProtectedPath && token) {
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      const role = (payload as any).role;

      // Check if user is accessing their correct dashboard
      if (path.startsWith('/dashboard/admin') && role !== 'admin') {
        return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
      }
      if (path.startsWith('/dashboard/doctor') && role !== 'doctor') {
        return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
      }
      if (path.startsWith('/dashboard/patient') && role !== 'patient') {
        return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
      }
    } catch (error) {
      // Invalid token, redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth-token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/register', '/dashboard/:path*'],
};

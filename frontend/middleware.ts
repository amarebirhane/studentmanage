import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get the token from cookies
    const token = request.cookies.get('token')?.value;

    // Define public routes that don't require authentication
    const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    // If user is not authenticated and trying to access protected route
    if (!token && !isPublicRoute && pathname !== '/') {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // If user is authenticated and trying to access auth pages, redirect to their dashboard
    // Note: We can't easily decode JWT in middleware, so we redirect to a generic dashboard
    // The actual role-based redirect happens in the login page after authentication
    if (token && isPublicRoute) {
        // Redirect to admin dashboard as default - the app will handle role-based routing
        return NextResponse.redirect(new URL('/dashboard/admin', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const roleRoutes = {
    SUPER_ADMIN: '/dashboard/super-admin',
    ADMIN: '/dashboard/admin',
    TEACHER: '/dashboard/teacher',
    STUDENT: '/dashboard/student',
    PARENT: '/dashboard/parent',
};

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token')?.value;
    const userRole = request.cookies.get('user_role')?.value as keyof typeof roleRoutes | undefined;

    // Public routes
    const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/'];
    const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));

    // 1. Redirect unauthenticated users to login
    if (!token) {
        if (!isPublicRoute) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }
        return NextResponse.next();
    }

    // 2. Redirect authenticated users away from auth pages
    if (isPublicRoute && pathname !== '/') {
        const dashboardUrl = userRole ? roleRoutes[userRole] : '/dashboard';
        return NextResponse.redirect(new URL(dashboardUrl || '/dashboard', request.url));
    }

    // 3. Role-Based Access Control
    if (pathname.startsWith('/dashboard')) {
        // Enforce role boundaries
        if (userRole) {
            if (pathname.startsWith('/dashboard/super-admin') && userRole !== 'SUPER_ADMIN') {
                return NextResponse.redirect(new URL(roleRoutes[userRole], request.url));
            }
            if (pathname.startsWith('/dashboard/admin') && userRole !== 'ADMIN') {
                return NextResponse.redirect(new URL(roleRoutes[userRole], request.url));
            }
            if (pathname.startsWith('/dashboard/teacher') && userRole !== 'TEACHER') {
                return NextResponse.redirect(new URL(roleRoutes[userRole], request.url));
            }
            if (pathname.startsWith('/dashboard/student') && userRole !== 'STUDENT') {
                return NextResponse.redirect(new URL(roleRoutes[userRole], request.url));
            }
            if (pathname.startsWith('/dashboard/parent') && userRole !== 'PARENT') {
                return NextResponse.redirect(new URL(roleRoutes[userRole], request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - uploads (static uploads)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|uploads).*)',
    ],
};

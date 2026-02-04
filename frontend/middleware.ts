import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const roleRoutes = {
    SUPER_ADMIN: '/dashboard/super-admin',
    ADMIN: '/dashboard/admin',
    TEACHER: '/dashboard/teacher',
    STUDENT: '/dashboard/student',
    PARENT: '/dashboard/parent',
};

import createMiddleware from 'next-intl/middleware';



const intlMiddleware = createMiddleware({
    locales: ['en', 'am', 'or'],
    defaultLocale: 'en'
});

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Extract locale and path without locale
    const localeMatch = pathname.match(/^\/(en|am|or)(\/|$)/);
    const locale = localeMatch ? localeMatch[1] : 'en';
    const pathWithoutLocale = pathname.replace(/^\/(en|am|or)/, '') || '/';

    const token = request.cookies.get('token')?.value;
    const userRole = request.cookies.get('user_role')?.value as keyof typeof roleRoutes | undefined;

    // Public routes (checking pathWithoutLocale)
    const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/'];
    const isPublicRoute = publicRoutes.some(route => pathWithoutLocale === route || pathWithoutLocale.startsWith(route + '/'));

    // 1. Redirect unauthenticated users to login
    if (!token) {
        if (!isPublicRoute) {
            // Construct login URL with locale
            const loginUrl = new URL(`/${locale}/login`, request.url);
            loginUrl.searchParams.set('redirect', pathWithoutLocale);
            return NextResponse.redirect(loginUrl);
        }
    }

    // 2. Role-Based Access Control
    if (pathWithoutLocale.startsWith('/dashboard')) {
        // Enforce role boundaries
        if (userRole) {
            if (pathWithoutLocale.startsWith('/dashboard/super-admin') && userRole !== 'SUPER_ADMIN') {
                return NextResponse.redirect(new URL(`/${locale}${roleRoutes[userRole]}`, request.url));
            }
            if (pathWithoutLocale.startsWith('/dashboard/admin') && userRole !== 'ADMIN') {
                return NextResponse.redirect(new URL(`/${locale}${roleRoutes[userRole]}`, request.url));
            }
            if (pathWithoutLocale.startsWith('/dashboard/teacher') && userRole !== 'TEACHER') {
                return NextResponse.redirect(new URL(`/${locale}${roleRoutes[userRole]}`, request.url));
            }
            if (pathWithoutLocale.startsWith('/dashboard/student') && userRole !== 'STUDENT') {
                return NextResponse.redirect(new URL(`/${locale}${roleRoutes[userRole]}`, request.url));
            }
            if (pathWithoutLocale.startsWith('/dashboard/parent') && userRole !== 'PARENT') {
                return NextResponse.redirect(new URL(`/${locale}${roleRoutes[userRole]}`, request.url));
            }
        }
    }

    return intlMiddleware(request);
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

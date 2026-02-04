import { UserRole } from '@/types/user';

/**
 * Get the dashboard route for a specific user role
 * @param role - The user's role (SUPER_ADMIN, ADMIN, TEACHER, STUDENT, PARENT, ACCOUNTANT, STAFF)
 * @returns The dashboard route path
 */
export function getDashboardRoute(role: UserRole): string {
    const routes: Record<UserRole, string> = {
        SUPER_ADMIN: '/dashboard/super-admin',
        ADMIN: '/dashboard/admin',
        TEACHER: '/dashboard/teacher',
        STUDENT: '/dashboard/student',
        PARENT: '/dashboard/parent',
        ACCOUNTANT: '/dashboard/accountant',
        STAFF: '/dashboard/staff',
    };

    return routes[role] || '/dashboard/admin';
}

/**
 * Check if a user has access to a specific route based on their role
 * @param userRole - The user's role
 * @param routePath - The route path to check
 * @returns True if the user has access, false otherwise
 */
export function hasRouteAccess(userRole: UserRole, routePath: string): boolean {
    const allowedRoute = getDashboardRoute(userRole);

    // Allow access to the user's own dashboard and its sub-routes
    return routePath.startsWith(allowedRoute);
}

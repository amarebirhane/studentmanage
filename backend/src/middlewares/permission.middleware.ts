import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { PermissionService } from '../modules/permissions/permission.service';
import { ApiError } from '../utils/apiResponse';

/**
 * Middleware to check for granular permissions on a specific module and action.
 * Should be used AFTER 'protect' and 'tenantMiddleware'.
 * 
 * @param module - The module name (e.g., 'students', 'teachers', 'fees')
 * @param action - The action type (view, create, edit, delete)
 */
export const checkPermission = (module: string, action: 'view' | 'create' | 'edit' | 'delete') => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                return next(new ApiError(401, 'Authentication required'));
            }

            // 1. Super Admins bypass all permission checks
            if (req.user.role === 'SUPER_ADMIN' as any) {
                return next();
            }

            // 2. School Admins typically have all permissions for their school
            if (req.user.role === 'ADMIN' as any) {
                return next();
            }

            // 3. Special Case: Core features like 'messages' are allowed by default for all roles
            if (module === 'messages' && (action === 'view' || action === 'create')) {
                return next();
            }

            // 4. Special Case: Accountant gets default access to fees and reports
            if (req.user.role === 'ACCOUNTANT' as any && (
                module === 'fees' ||
                module === 'reports' ||
                module === 'fee-structures' ||
                module === 'announcements'
            )) {
                return next();
            }

            // 5. Special Case: Staff gets default access to essential modules
            if (req.user.role === 'STAFF' as any && (
                module === 'students' ||
                module === 'classes' ||
                module === 'attendance' ||
                module === 'timetable' ||
                module === 'teachers' ||
                module === 'announcements'
            )) {
                if (action === 'view' || action === 'create' || action === 'edit') {
                    return next();
                }
            }

            // 6. Special Case: Student/Teacher get default access to view essential modules
            if ((req.user.role === 'STUDENT' as any || req.user.role === 'TEACHER' as any) && (
                module === 'announcements' ||
                module === 'timetable' ||
                module === 'assignments' ||
                module === 'exams'
            )) {
                if (action === 'view') {
                    return next();
                }
            }

            // 7. Special Case: Parents get default access to view essential modules for their children
            if (req.user.role === 'PARENT' as any && (
                module === 'students' ||
                module === 'attendance' ||
                module === 'timetable' ||
                module === 'assignments' ||
                module === 'exams' ||
                module === 'results' ||
                module === 'fees' ||
                module === 'announcements'
            )) {
                if (action === 'view') {
                    return next();
                }
            }

            // 7. Check granular permissions in the database
            const hasPermission = await PermissionService.checkPermission(req.user.id, module, action);

            if (!hasPermission) {
                return next(new ApiError(403, `Access Denied: You do not have '${action}' permission for the '${module}' module.`));
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

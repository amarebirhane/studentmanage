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

            console.log(`[PermissionCheck] User: ${req.user.id}, Role: ${req.user.role}, Module: ${module}, Action: ${action}`);

            // 1. Super Admins bypass all permission checks
            if (req.user.role === 'SUPER_ADMIN' as any) {
                console.log(`[PermissionCheck] SUPER_ADMIN bypass`);
                return next();
            }

            // 2. School Admins typically have all permissions for their school
            if (req.user.role === 'ADMIN' as any) {
                console.log(`[PermissionCheck] ADMIN bypass`);
                return next();
            }

            // 3. Special Case: Core features like 'messages' are allowed by default for all roles
            if (module === 'messages' && (action === 'view' || action === 'create')) {
                console.log(`[PermissionCheck] Special case allowed: ${module}:${action}`);
                return next();
            }

            // 4. Check granular permissions in the database
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

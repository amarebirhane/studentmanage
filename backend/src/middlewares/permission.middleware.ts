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
            if (req.user.role === 'SUPER_ADMIN') {
                return next();
            }

            // 2. School Admins typically have all permissions for their school, 
            // but we can still check the DB if we want custom role flexibility later.
            // For now, let's treat ADMIN as having all permissions within their school.
            if (req.user.role === 'ADMIN') {
                return next();
            }

            // 3. Check granular permissions in the database
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

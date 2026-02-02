import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { ApiError } from '../utils/apiResponse';

/**
 * Middleware to enforce multi-tenancy (School Isolation).
 * Should be used AFTER the 'protect' middleware.
 */
export const tenantMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new ApiError(401, 'Authentication required for tenant context'));
    }

    const { role, schoolId: userSchoolId } = req.user;

    // 1. Super Admin: Can access any school. Can specify 'X-School-ID' header to switch context.
    if (role === 'SUPER_ADMIN') {
        const targetSchoolId = req.headers['x-school-id'] as string;
        if (targetSchoolId) {
            req.schoolId = targetSchoolId;
        }
        // If no header, Super Admin stays in platform-wide/global scope (req.schoolId remains undefined)
        return next();
    }

    // 2. All other roles: Must be assigned to a school and are locked to it.
    if (!userSchoolId) {
        return next(new ApiError(403, 'User is not assigned to any school'));
    }

    // Lock the request to the user's school
    req.schoolId = userSchoolId;

    // (Optional) If they tried to provide a different X-School-ID, block or ignore it.
    const headerSchoolId = req.headers['x-school-id'];
    if (headerSchoolId && headerSchoolId !== userSchoolId) {
        return next(new ApiError(403, 'You do not have permission to access this school'));
    }

    next();
};

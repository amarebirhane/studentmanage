import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { ApiError } from '../utils/apiResponse';

/**
 * Middleware to restrict access based on user roles.
 */
export const authorize = (...roles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new ApiError(401, 'Authentication required'));
        }

        const userRole = req.user.role as string;

        // Super Admin has access to everything
        if (userRole === 'SUPER_ADMIN') {
            return next();
        }

        if (!roles.includes(userRole)) {
            return next(
                new ApiError(
                    403,
                    `Access Denied: Role '${userRole}' does not have permission to access this resource`
                )
            );
        }
        next();
    };
};

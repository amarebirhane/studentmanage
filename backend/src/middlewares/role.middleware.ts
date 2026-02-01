import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { UserRole } from '@prisma/client';
import { ApiError } from '../utils/apiResponse';

export const authorize = (...roles: UserRole[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new ApiError(401, 'Not authorized to access this route'));
        }

        if (!roles.includes(req.user.role)) {
            return next(
                new ApiError(
                    403,
                    `User role ${req.user.role} is not authorized to access this route`
                )
            );
        }
        next();
    };
};

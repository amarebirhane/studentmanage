import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { prisma } from '../config';

/**
 * Middleware to capture and log significant user actions (POST, PUT, DELETE, PATCH).
 * This helps in tracking who changed what and when.
 */
export const auditLog = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // We only care about data-modifying methods
    const methodsToLog = ['POST', 'PUT', 'DELETE', 'PATCH'];

    // Capture the original send to log after the request is processed
    const originalSend = res.send;

    // @ts-ignore
    res.send = function (body) {
        // Only log if the request was successful (2xx) and it's a modifying method
        if (req.user && methodsToLog.includes(req.method) && res.statusCode >= 200 && res.statusCode < 300) {
            const module = req.baseUrl.split('/').pop() || 'Unknown';
            const action = `${req.method} ${req.path}`;

            // Fire and forget logging so it doesn't block the response
            prisma.auditLog.create({
                data: {
                    action,
                    module,
                    userId: req.user.id,
                    userName: `${req.user.firstName} ${req.user.lastName}`,
                    schoolId: req.user.schoolId,
                    details: {
                        body: req.body,
                        params: req.params,
                        query: req.query,
                        statusCode: res.statusCode
                    }
                }
            }).catch(err => console.error('Error creating audit log:', err));
        }

        return originalSend.apply(res, arguments as any);
    };

    next();
};

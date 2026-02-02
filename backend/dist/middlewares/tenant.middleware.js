"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantMiddleware = void 0;
const apiResponse_1 = require("../utils/apiResponse");
/**
 * Middleware to enforce multi-tenancy (School Isolation).
 * Should be used AFTER the 'protect' middleware.
 */
const tenantMiddleware = (req, res, next) => {
    if (!req.user) {
        return next(new apiResponse_1.ApiError(401, 'Authentication required for tenant context'));
    }
    const { role, schoolId: userSchoolId } = req.user;
    // 1. Super Admin: Can access any school. Can specify 'X-School-ID' header to switch context.
    if (role === 'SUPER_ADMIN') {
        const targetSchoolId = req.headers['x-school-id'];
        if (targetSchoolId) {
            req.schoolId = targetSchoolId;
        }
        // If no header, Super Admin stays in platform-wide/global scope (req.schoolId remains undefined)
        return next();
    }
    // 2. All other roles: Must be assigned to a school and are locked to it.
    if (!userSchoolId) {
        return next(new apiResponse_1.ApiError(403, 'User is not assigned to any school'));
    }
    // Lock the request to the user's school
    req.schoolId = userSchoolId;
    // (Optional) If they tried to provide a different X-School-ID, block or ignore it.
    const headerSchoolId = req.headers['x-school-id'];
    if (headerSchoolId && headerSchoolId !== userSchoolId) {
        return next(new apiResponse_1.ApiError(403, 'You do not have permission to access this school'));
    }
    next();
};
exports.tenantMiddleware = tenantMiddleware;

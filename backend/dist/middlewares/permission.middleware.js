"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermission = void 0;
const permission_service_1 = require("../modules/permissions/permission.service");
const apiResponse_1 = require("../utils/apiResponse");
/**
 * Middleware to check for granular permissions on a specific module and action.
 * Should be used AFTER 'protect' and 'tenantMiddleware'.
 *
 * @param module - The module name (e.g., 'students', 'teachers', 'fees')
 * @param action - The action type (view, create, edit, delete)
 */
const checkPermission = (module, action) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return next(new apiResponse_1.ApiError(401, 'Authentication required'));
            }
            // 1. Super Admins bypass all permission checks
            if (req.user.role === 'SUPER_ADMIN') {
                return next();
            }
            // 2. School Admins typically have all permissions for their school
            if (req.user.role === 'ADMIN') {
                return next();
            }
            // 3. Check granular permissions in the database
            const hasPermission = await permission_service_1.PermissionService.checkPermission(req.user.id, module, action);
            if (!hasPermission) {
                return next(new apiResponse_1.ApiError(403, `Access Denied: You do not have '${action}' permission for the '${module}' module.`));
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.checkPermission = checkPermission;

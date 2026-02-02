"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const apiResponse_1 = require("../utils/apiResponse");
/**
 * Middleware to restrict access based on user roles.
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new apiResponse_1.ApiError(401, 'Authentication required'));
        }
        const userRole = req.user.role;
        // Super Admin has access to everything
        if (userRole === 'SUPER_ADMIN') {
            return next();
        }
        if (!roles.includes(userRole)) {
            return next(new apiResponse_1.ApiError(403, `Access Denied: Role '${userRole}' does not have permission to access this resource`));
        }
        next();
    };
};
exports.authorize = authorize;

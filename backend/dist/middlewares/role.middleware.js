"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new apiResponse_1.ApiError(401, 'Not authorized to access this route'));
        }
        if (!roles.includes(req.user.role)) {
            return next(new apiResponse_1.ApiError(403, `User role ${req.user.role} is not authorized to access this route`));
        }
        next();
    };
};
exports.authorize = authorize;

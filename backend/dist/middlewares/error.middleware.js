"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const config_1 = require("../config");
const apiResponse_1 = require("../utils/apiResponse");
const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const errors = config_1.config.env === 'development' ? err.stack : null;
    return apiResponse_1.ApiResponse.error(res, message, statusCode, errors);
};
exports.errorMiddleware = errorMiddleware;

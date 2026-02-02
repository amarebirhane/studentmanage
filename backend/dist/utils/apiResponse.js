"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = exports.ApiError = void 0;
class ApiError extends Error {
    constructor(statusCode, message, errors = null) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApiError = ApiError;
class ApiResponse {
    constructor(res, statusCode, message, data = null) {
        this.res = res;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.successStatus = statusCode < 400;
    }
    send() {
        if (this.res) {
            return this.res.status(this.statusCode).json({
                success: this.successStatus,
                message: this.message,
                data: this.data,
            });
        }
    }
    static success(res, data, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }
    static error(res, message = 'Error', statusCode = 500, errors = null) {
        return res.status(statusCode).json({
            success: false,
            message,
            errors,
        });
    }
}
exports.ApiResponse = ApiResponse;

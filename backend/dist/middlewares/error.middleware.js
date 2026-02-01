"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const config_1 = require("../config");
const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || 'Internal Server Error',
        stack: config_1.config.env === 'development' ? err.stack : undefined,
    });
};
exports.errorMiddleware = errorMiddleware;

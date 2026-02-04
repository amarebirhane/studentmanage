import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import { ApiResponse } from '../utils/apiResponse';


export class ApiError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const errors = config.env === 'development' ? err.stack : null;

    console.error('❌ [ErrorMiddleware]:', err);

    return ApiResponse.error(res, message, statusCode, errors);
};

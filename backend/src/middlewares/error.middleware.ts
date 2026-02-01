import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        message: err.message || 'Internal Server Error',
        stack: config.env === 'development' ? err.stack : undefined,
    });
};

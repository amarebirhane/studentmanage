import { Response } from 'express';

export class ApiError extends Error {
    statusCode: number;
    errors?: any;

    constructor(statusCode: number, message: string, errors: any) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ApiResponse {
    private res?: Response;
    private statusCode: number;
    private message: string;
    private data: any;
    private successStatus: boolean;

    constructor(res: Response, statusCode: number, message: string, data: any = null) {
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

    static success(res: Response, data: any, message: string = 'Success', statusCode: number = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }

    static error(res: Response, message: string = 'Error', statusCode: number = 500, errors: any = null) {
        return res.status(statusCode).json({
            success: false,
            message,
            errors,
        });
    }
}

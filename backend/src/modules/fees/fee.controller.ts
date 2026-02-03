import { Response, NextFunction } from 'express';
import * as feeService from './fee.service';
import { ApiResponse } from '../../utils/apiResponse';
import { AuthenticatedRequest } from '../../types';

export const createFeeInvoice = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const feeInvoice = await feeService.createFeeInvoice(req.body, req.schoolId);
        new ApiResponse(res, 201, 'Fee invoice created successfully', feeInvoice).send();
    } catch (error) {
        next(error);
    }
};

export const getFeeInvoice = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const feeInvoice = await feeService.getFeeInvoiceById(req.params.id as string, req.schoolId);
        new ApiResponse(res, 200, 'Fee invoice details', feeInvoice).send();
    } catch (error) {
        next(error);
    }
};

export const updateFeeInvoice = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const feeInvoice = await feeService.updateFeeInvoice(req.params.id as string, req.body, req.schoolId);
        new ApiResponse(res, 200, 'Fee invoice updated successfully', feeInvoice).send();
    } catch (error) {
        next(error);
    }
};

export const deleteFeeInvoice = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        await feeService.deleteFeeInvoice(req.params.id as string, req.schoolId);
        new ApiResponse(res, 200, 'Fee invoice deleted successfully').send();
    } catch (error) {
        next(error);
    }
};

export const getAllFeeInvoices = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const role = req.user?.role;
        const feeInvoices = await feeService.getAllFeeInvoices(req.query, req.schoolId, userId, role);
        new ApiResponse(res, 200, 'All fee invoices', feeInvoices).send();
    } catch (error) {
        next(error);
    }
};

export const applyAdjustment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const feeInvoice = await feeService.applyDiscountAndScholarship(req.params.id as string, req.body, req.schoolId);
        new ApiResponse(res, 200, 'Financial adjustment applied successfully', feeInvoice).send();
    } catch (error) {
        next(error);
    }
};

export const recordPayment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const payment = await feeService.recordPayment(req.params.id as string, req.body, req.schoolId);
        new ApiResponse(res, 201, 'Payment recorded successfully', payment).send();
    } catch (error) {
        next(error);
    }
};

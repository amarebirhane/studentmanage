import { Request, Response, NextFunction } from 'express';
import * as feeService from './fee.service';
import { ApiResponse } from '../../utils/apiResponse';

export const createFeeInvoice = async (req: any, res: Response, next: NextFunction) => {
    try {
        const feeInvoice = await feeService.createFeeInvoice(req.body, req.schoolId);
        new ApiResponse(res, 201, 'Fee invoice created successfully', feeInvoice).send();
    } catch (error) {
        next(error);
    }
};

export const getFeeInvoice = async (req: any, res: Response, next: NextFunction) => {
    try {
        const feeInvoice = await feeService.getFeeInvoiceById(req.params.id as string);
        // Additional check for role-based access if needed
        new ApiResponse(res, 200, 'Fee invoice details', feeInvoice).send();
    } catch (error) {
        next(error);
    }
};

export const updateFeeInvoice = async (req: any, res: Response, next: NextFunction) => {
    try {
        const feeInvoice = await feeService.updateFeeInvoice(req.params.id as string, req.body, req.schoolId);
        new ApiResponse(res, 200, 'Fee invoice updated successfully', feeInvoice).send();
    } catch (error) {
        next(error);
    }
};

export const deleteFeeInvoice = async (req: any, res: Response, next: NextFunction) => {
    try {
        await feeService.deleteFeeInvoice(req.params.id as string);
        new ApiResponse(res, 200, 'Fee invoice deleted successfully').send();
    } catch (error) {
        next(error);
    }
};

export const getAllFeeInvoices = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id: userId, role } = req.user;
        const feeInvoices = await feeService.getAllFeeInvoices(req.query, req.schoolId, userId, role);
        new ApiResponse(res, 200, 'All fee invoices', feeInvoices).send();
    } catch (error) {
        next(error);
    }
};

export const applyAdjustment = async (req: any, res: Response, next: NextFunction) => {
    try {
        const feeInvoice = await feeService.applyDiscountAndScholarship(req.params.id as string, req.body, req.schoolId);
        new ApiResponse(res, 200, 'Financial adjustment applied successfully', feeInvoice).send();
    } catch (error) {
        next(error);
    }
};

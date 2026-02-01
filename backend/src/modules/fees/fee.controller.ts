import { Request, Response, NextFunction } from 'express';
import * as feeService from './fee.service';
import { ApiResponse } from '../../utils/apiResponse';

export const createFeeInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const feeInvoice = await feeService.createFeeInvoice(req.body);
        new ApiResponse(res, 201, 'Fee invoice created successfully', feeInvoice).send();
    } catch (error) {
        next(error);
    }
};

export const getFeeInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const feeInvoice = await feeService.getFeeInvoiceById(req.params.id);
        new ApiResponse(res, 200, 'Fee invoice details', feeInvoice).send();
    } catch (error) {
        next(error);
    }
};

export const updateFeeInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const feeInvoice = await feeService.updateFeeInvoice(req.params.id, req.body);
        new ApiResponse(res, 200, 'Fee invoice updated successfully', feeInvoice).send();
    } catch (error) {
        next(error);
    }
};

export const deleteFeeInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await feeService.deleteFeeInvoice(req.params.id);
        new ApiResponse(res, 200, 'Fee invoice deleted successfully').send();
    } catch (error) {
        next(error);
    }
};

export const getAllFeeInvoices = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const feeInvoices = await feeService.getAllFeeInvoices(req.query);
        new ApiResponse(res, 200, 'All fee invoices', feeInvoices).send();
    } catch (error) {
        next(error);
    }
};

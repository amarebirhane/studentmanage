import { Response, NextFunction } from 'express';
import { FeeStructureService } from './fee-structure.service';
import { ApiResponse } from '../../utils/apiResponse';
import { AuthenticatedRequest } from '../../types';

export const createFeeStructure = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const feeStructure = await FeeStructureService.createFeeStructure({
            ...req.body,
            schoolId: req.schoolId as string,
        });
        return ApiResponse.success(res, feeStructure, 'Fee structure created successfully', 201);
    } catch (error) {
        next(error);
    }
};

export const getAllFeeStructures = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const feeStructures = await FeeStructureService.getAllFeeStructures(
            req.schoolId,
            req.query.classId as string
        );
        return ApiResponse.success(res, feeStructures, 'Fee structures retrieved');
    } catch (error) {
        next(error);
    }
};

export const getFeeStructureById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const feeStructure = await FeeStructureService.getFeeStructureById(req.params.id as string, req.schoolId);
        return ApiResponse.success(res, feeStructure, 'Fee structure details');
    } catch (error) {
        next(error);
    }
};

export const updateFeeStructure = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const feeStructure = await FeeStructureService.updateFeeStructure(
            req.params.id as string,
            req.body,
            req.schoolId
        );
        return ApiResponse.success(res, feeStructure, 'Fee structure updated successfully');
    } catch (error) {
        next(error);
    }
};

export const deleteFeeStructure = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        await FeeStructureService.deleteFeeStructure(req.params.id as string, req.schoolId);
        return ApiResponse.success(res, {}, 'Fee structure deleted successfully');
    } catch (error) {
        next(error);
    }
};

export const bulkGenerateInvoices = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const invoices = await FeeStructureService.bulkGenerateInvoices({
            ...req.body,
            schoolId: req.schoolId,
        });
        return ApiResponse.success(res, invoices, `${invoices.length} invoices generated successfully`, 201);
    } catch (error) {
        next(error);
    }
};

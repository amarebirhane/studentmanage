import { Request, Response, NextFunction } from 'express';
import { FeeStructureService } from './fee-structure.service';
import { ApiResponse } from '../../utils/apiResponse';

export const createFeeStructure = async (req: any, res: Response, next: NextFunction) => {
    try {
        const feeStructure = await FeeStructureService.createFeeStructure({
            ...req.body,
            schoolId: req.schoolId,
        });
        new ApiResponse(res, 201, 'Fee structure created successfully', feeStructure).send();
    } catch (error) {
        next(error);
    }
};

export const getAllFeeStructures = async (req: any, res: Response, next: NextFunction) => {
    try {
        const feeStructures = await FeeStructureService.getAllFeeStructures(
            req.schoolId,
            req.query.classId as string
        );
        new ApiResponse(res, 200, 'Fee structures retrieved', feeStructures).send();
    } catch (error) {
        next(error);
    }
};

export const getFeeStructureById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const feeStructure = await FeeStructureService.getFeeStructureById(req.params.id);
        new ApiResponse(res, 200, 'Fee structure details', feeStructure).send();
    } catch (error) {
        next(error);
    }
};

export const updateFeeStructure = async (req: any, res: Response, next: NextFunction) => {
    try {
        const feeStructure = await FeeStructureService.updateFeeStructure(
            req.params.id,
            req.body,
            req.schoolId
        );
        new ApiResponse(res, 200, 'Fee structure updated successfully', feeStructure).send();
    } catch (error) {
        next(error);
    }
};

export const deleteFeeStructure = async (req: any, res: Response, next: NextFunction) => {
    try {
        await FeeStructureService.deleteFeeStructure(req.params.id, req.schoolId);
        new ApiResponse(res, 200, 'Fee structure deleted successfully').send();
    } catch (error) {
        next(error);
    }
};

export const bulkGenerateInvoices = async (req: any, res: Response, next: NextFunction) => {
    try {
        const invoices = await FeeStructureService.bulkGenerateInvoices({
            ...req.body,
            schoolId: req.schoolId,
        });
        new ApiResponse(res, 201, `${invoices.length} invoices generated successfully`, invoices).send();
    } catch (error) {
        next(error);
    }
};

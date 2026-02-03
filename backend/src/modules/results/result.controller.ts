import { Response, NextFunction } from 'express';
import * as resultService from './result.service';
import { ApiResponse } from '../../utils/apiResponse';
import { AuthenticatedRequest } from '../../types';

export const createResult = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const result = await resultService.createResult({
            ...req.body,
            schoolId: req.schoolId
        });
        new ApiResponse(res, 201, 'Result created successfully', result).send();
    } catch (error) {
        next(error);
    }
};

export const getResult = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const result = await resultService.getResultById(req.params.id as string);
        new ApiResponse(res, 200, 'Result details', result).send();
    } catch (error) {
        next(error);
    }
};

export const updateResult = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const result = await resultService.updateResult(req.params.id as string, req.body);
        new ApiResponse(res, 200, 'Result updated successfully', result).send();
    } catch (error) {
        next(error);
    }
};

export const deleteResult = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        await resultService.deleteResult(req.params.id as string, req.schoolId);
        new ApiResponse(res, 200, 'Result deleted successfully').send();
    } catch (error) {
        next(error);
    }
};

export const getAllResults = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const filters = { ...req.query, schoolId: req.schoolId };
        const results = await resultService.getAllResults(filters);
        new ApiResponse(res, 200, 'All results', results).send();
    } catch (error) {
        next(error);
    }
};

import { Request, Response, NextFunction } from 'express';
import * as resultService from './result.service';
import { ApiResponse } from '../../utils/apiResponse';

export const createResult = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await resultService.createResult(req.body);
        new ApiResponse(res, 201, 'Result created successfully', result).send();
    } catch (error) {
        next(error);
    }
};

export const getResult = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await resultService.getResultById(req.params.id as string);
        new ApiResponse(res, 200, 'Result details', result).send();
    } catch (error) {
        next(error);
    }
};

export const updateResult = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await resultService.updateResult(req.params.id as string, req.body);
        new ApiResponse(res, 200, 'Result updated successfully', result).send();
    } catch (error) {
        next(error);
    }
};

export const deleteResult = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await resultService.deleteResult(req.params.id as string);
        new ApiResponse(res, 200, 'Result deleted successfully').send();
    } catch (error) {
        next(error);
    }
};

export const getAllResults = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await resultService.getAllResults(req.query);
        new ApiResponse(res, 200, 'All results', results).send();
    } catch (error) {
        next(error);
    }
};

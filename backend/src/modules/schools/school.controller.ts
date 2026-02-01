import { Request, Response, NextFunction } from 'express';
import * as schoolService from './school.service';
import { ApiResponse } from '../../utils/apiResponse';

export const createSchool = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const school = await schoolService.createSchool(req.body);
        new ApiResponse(res, 201, 'School created successfully', school).send();
    } catch (error) {
        next(error);
    }
};

export const getSchool = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const school = await schoolService.getSchoolById(req.params.id);
        new ApiResponse(res, 200, 'School details', school).send();
    } catch (error) {
        next(error);
    }
};

export const updateSchool = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const school = await schoolService.updateSchool(req.params.id, req.body);
        new ApiResponse(res, 200, 'School updated successfully', school).send();
    } catch (error) {
        next(error);
    }
};

export const deleteSchool = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schoolService.deleteSchool(req.params.id);
        new ApiResponse(res, 200, 'School deleted successfully').send();
    } catch (error) {
        next(error);
    }
};

export const getSchools = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const schools = await schoolService.getAllSchools();
        new ApiResponse(res, 200, 'All schools', schools).send();
    } catch (error) {
        next(error);
    }
};

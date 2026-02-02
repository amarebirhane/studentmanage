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
        const school = await schoolService.getSchoolById(req.params.id as string);
        new ApiResponse(res, 200, 'School details', school).send();
    } catch (error) {
        next(error);
    }
};

export const updateSchool = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const school = await schoolService.updateSchool(req.params.id as string, req.body);
        new ApiResponse(res, 200, 'School updated successfully', school).send();
    } catch (error) {
        next(error);
    }
};

export const deleteSchool = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schoolService.deleteSchool(req.params.id as string);
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

export const setSuspension = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const school = await schoolService.setSuspensionStatus(req.params.id as string, req.body.isSuspended);
        new ApiResponse(res, 200, `School suspension status updated to ${req.body.isSuspended}`, school).send();
    } catch (error) {
        next(error);
    }
};

export const configureAcademicYear = async (req: any, res: Response, next: NextFunction) => {
    try {
        const schoolId = req.schoolId || req.params.id;
        const school = await schoolService.configureAcademicYear(schoolId, req.body.academicYear);
        new ApiResponse(res, 200, 'Academic year configured', school).send();
    } catch (error) {
        next(error);
    }
};

export const updateGradingSystem = async (req: any, res: Response, next: NextFunction) => {
    try {
        const schoolId = req.schoolId || req.params.id;
        const school = await schoolService.updateGradingSystem(schoolId, req.body.gradingSystem);
        new ApiResponse(res, 200, 'Grading system updated', school).send();
    } catch (error) {
        next(error);
    }
};

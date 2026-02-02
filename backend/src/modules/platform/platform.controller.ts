import { Response, NextFunction } from 'express';
import { PlatformService } from './platform.service';
import { ApiResponse } from '../../utils/apiResponse';

export const getGlobalStats = async (req: any, res: Response, next: NextFunction) => {
    try {
        const stats = await PlatformService.getGlobalStats();
        new ApiResponse(res, 200, 'Global system statistics', stats).send();
    } catch (error) {
        next(error);
    }
};

export const assignSchoolAdmin = async (req: any, res: Response, next: NextFunction) => {
    try {
        const result = await PlatformService.assignSchoolAdmin(req.body);
        new ApiResponse(res, 200, 'School admin assigned successfully', result).send();
    } catch (error) {
        next(error);
    }
};

export const getAllSchools = async (req: any, res: Response, next: NextFunction) => {
    try {
        const schools = await PlatformService.getAllSchools();
        new ApiResponse(res, 200, 'All schools retrieved', schools).send();
    } catch (error) {
        next(error);
    }
};

export const getSystemLogs = async (req: any, res: Response, next: NextFunction) => {
    try {
        // Placeholder for audit logs
        new ApiResponse(res, 200, 'System audit logs', []).send();
    } catch (error) {
        next(error);
    }
};

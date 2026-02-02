import { Response, NextFunction } from 'express';
import { PlatformService } from './platform.service';
import { AuditLogService } from './audit.service';
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
        const { module, userId, page, limit } = req.query;
        const result = await AuditLogService.getLogs({
            module: module as string,
            userId: userId as string,
            page: page ? parseInt(page as string) : 1,
            limit: limit ? parseInt(limit as string) : 50,
        });
        new ApiResponse(res, 200, 'System audit logs', result).send();
    } catch (error) {
        next(error);
    }
};

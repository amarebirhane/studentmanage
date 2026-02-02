import { Response, NextFunction } from 'express';
import { prisma } from '../../config';
import { ApiResponse } from '../../utils/apiResponse';

export const getGlobalStats = async (req: any, res: Response, next: NextFunction) => {
    try {
        const [schoolCount, userCount, studentCount, teacherCount] = await Promise.all([
            prisma.school.count(),
            prisma.user.count(),
            prisma.studentProfile.count(),
            prisma.teacherProfile.count(),
        ]);

        new ApiResponse(res, 200, 'Global system statistics', {
            schools: schoolCount,
            users: userCount,
            students: studentCount,
            teachers: teacherCount,
        }).send();
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

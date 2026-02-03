import { Response } from 'express';
import { prisma } from '../../config';
import { DashboardService } from './dashboard.service';
import { ApiResponse } from '../../utils/apiResponse';

export class DashboardController {
    static async getDashboard(req: any, res: Response) {
        try {
            const { role, id: userId, schoolId } = req.user;
            let data;

            switch (role) {
                case 'SUPER_ADMIN':
                    data = await DashboardService.getSuperAdminDashboard();
                    break;
                case 'ADMIN':
                    data = await DashboardService.getSchoolAdminDashboard(schoolId);
                    break;
                case 'TEACHER':
                    // Need teacher profile ID
                    const teacher = await prisma.teacherProfile.findUnique({ where: { userId } });
                    if (!teacher) throw new Error('Teacher profile not found');
                    data = await DashboardService.getTeacherDashboard(teacher.id, schoolId);
                    break;
                case 'STUDENT':
                    // Need student profile ID
                    const student = await prisma.studentProfile.findUnique({ where: { userId } });
                    if (!student) throw new Error('Student profile not found');
                    data = await DashboardService.getStudentDashboard(student.id, schoolId);
                    break;
                case 'PARENT':
                    data = await DashboardService.getParentDashboard(userId, schoolId);
                    break;
                default:
                    throw new Error('Invalid role for dashboard');
            }

            return ApiResponse.success(res, data, `${role} dashboard data retrieved`);
        } catch (error: any) {
            console.error('Dashboard Error Stack:', error);
            return ApiResponse.error(res, error.message);
        }
    }
}

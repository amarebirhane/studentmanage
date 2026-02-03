import { Response } from 'express';
import { TeacherService } from './teacher.service';
import { ApiResponse } from '../../utils/apiResponse';
import { AuthenticatedRequest } from '../../types';

export class TeacherController {
    static async getTeachers(req: AuthenticatedRequest, res: Response) {
        try {
            const teachers = await TeacherService.getTeachers(req.schoolId);
            return ApiResponse.success(res, teachers, 'Teachers retrieved');
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    static async getTeacherById(req: AuthenticatedRequest, res: Response) {
        try {
            const teacher = await TeacherService.getTeacherById(req.params.id as string, req.schoolId);
            return ApiResponse.success(res, teacher, 'Teacher retrieved');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 404);
        }
    }

    static async createTeacher(req: AuthenticatedRequest, res: Response) {
        try {
            const teacher = await TeacherService.createTeacher(req.body, req.schoolId);
            return ApiResponse.success(res, teacher, 'Teacher created successfully', 201);
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 400);
        }
    }

    static async updateTeacher(req: AuthenticatedRequest, res: Response) {
        try {
            const teacher = await TeacherService.updateTeacher(req.params.id as string, req.body, req.schoolId);
            return ApiResponse.success(res, teacher, 'Teacher updated successfully');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 400);
        }
    }

    static async deleteTeacher(req: AuthenticatedRequest, res: Response) {
        try {
            await TeacherService.deleteTeacher(req.params.id as string, req.schoolId);
            return ApiResponse.success(res, {}, 'Teacher deleted successfully');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 400);
        }
    }

    static async getDashboardStats(req: AuthenticatedRequest, res: Response) {
        try {
            const stats = await TeacherService.getDashboardStats(req.user?.id as string, req.schoolId);
            return ApiResponse.success(res, stats, 'Dashboard stats retrieved');
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    static async getTeacherClasses(req: AuthenticatedRequest, res: Response) {
        try {
            const result = await TeacherService.getTeacherClasses(req.user?.id as string, req.schoolId);
            return ApiResponse.success(res, result?.sections || [], 'Teacher classes retrieved');
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }
}

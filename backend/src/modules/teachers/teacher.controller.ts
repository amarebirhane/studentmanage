import { Request, Response } from 'express';
import { TeacherService } from './teacher.service';
import { ApiResponse } from '../../utils/apiResponse';

export class TeacherController {
    static async getTeachers(req: Request, res: Response) {
        try {
            const teachers = await TeacherService.getTeachers();
            return ApiResponse.success(res, teachers, 'Teachers retrieved');
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    static async getTeacherById(req: Request, res: Response) {
        try {
            const teacher = await TeacherService.getTeacherById(req.params.id as string);
            return ApiResponse.success(res, teacher, 'Teacher retrieved');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 404);
        }
    }

    static async createTeacher(req: Request, res: Response) {
        try {
            const teacher = await TeacherService.createTeacher(req.body);
            return ApiResponse.success(res, teacher, 'Teacher created successfully', 201);
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 400);
        }
    }

    static async updateTeacher(req: Request, res: Response) {
        try {
            const teacher = await TeacherService.updateTeacher(req.params.id as string, req.body);
            return ApiResponse.success(res, teacher, 'Teacher updated successfully');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 400);
        }
    }

    static async deleteTeacher(req: Request, res: Response) {
        try {
            await TeacherService.deleteTeacher(req.params.id as string);
            return ApiResponse.success(res, {}, 'Teacher deleted successfully');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 400);
        }
    }
}

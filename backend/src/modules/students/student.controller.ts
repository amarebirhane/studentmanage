import { Response } from 'express';
import { StudentService } from './student.service';
import { ApiResponse } from '../../utils/apiResponse';
import { AuthenticatedRequest } from '../../types';

export class StudentController {
    static async getStudents(req: AuthenticatedRequest, res: Response) {
        try {
            const filters = {
                search: req.query.search as string,
                classId: req.query.classId as string,
                sectionId: req.query.sectionId as string,
                page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
                limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
            };

            const result = await StudentService.getStudents(filters, req.schoolId, req.user?.id, req.user?.role);
            return ApiResponse.success(res, result, 'Students retrieved');
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    static async getStudentById(req: AuthenticatedRequest, res: Response) {
        try {
            const student = await StudentService.getStudentById(req.params.id as string, req.schoolId);
            return ApiResponse.success(res, student, 'Student retrieved');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 404);
        }
    }

    static async approveAdmission(req: AuthenticatedRequest, res: Response) {
        try {
            const student = await StudentService.approveAdmission(req.params.id as string, req.schoolId);
            return ApiResponse.success(res, student, 'Student admission approved');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 400);
        }
    }

    static async createStudent(req: AuthenticatedRequest, res: Response) {
        try {
            const student = await StudentService.createStudent(req.body, req.schoolId);
            return ApiResponse.success(res, student, 'Student created successfully', 201);
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 400);
        }
    }

    static async updateStudent(req: AuthenticatedRequest, res: Response) {
        try {
            const student = await StudentService.updateStudent(req.params.id as string, req.body, req.schoolId);
            return ApiResponse.success(res, student, 'Student updated successfully');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 400);
        }
    }

    static async deleteStudent(req: AuthenticatedRequest, res: Response) {
        try {
            await StudentService.deleteStudent(req.params.id as string, req.schoolId);
            return ApiResponse.success(res, {}, 'Student deleted successfully');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 400);
        }
    }
}

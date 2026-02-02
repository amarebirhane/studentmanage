import { Request, Response } from 'express';
import { StudentService } from './student.service';
import { ApiResponse } from '../../utils/apiResponse';

export class StudentController {
    static async getStudents(req: Request, res: Response) {
        try {
            const filters = {
                search: req.query.search as string,
                classId: req.query.classId as string,
                sectionId: req.query.sectionId as string,
                page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
                limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
            };

            const result = await StudentService.getStudents(filters, (req as any).schoolId, (req as any).user?.id, (req as any).user?.role);
            return ApiResponse.success(res, result, 'Students retrieved');
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    static async getStudentById(req: Request, res: Response) {
        try {
            const student = await StudentService.getStudentById(req.params.id as string, (req as any).schoolId);
            return ApiResponse.success(res, student, 'Student retrieved');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 404);
        }
    }

    static async approveAdmission(req: Request, res: Response) {
        try {
            const student = await StudentService.approveAdmission(req.params.id as string, (req as any).schoolId);
            return ApiResponse.success(res, student, 'Student admission approved');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 400);
        }
    }

    static async createStudent(req: Request, res: Response) {
        try {
            const student = await StudentService.createStudent(req.body);
            return ApiResponse.success(res, student, 'Student created successfully', 201);
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 400);
        }
    }

    static async updateStudent(req: Request, res: Response) {
        try {
            const student = await StudentService.updateStudent(req.params.id as string, req.body);
            return ApiResponse.success(res, student, 'Student updated successfully');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 400);
        }
    }

    static async deleteStudent(req: Request, res: Response) {
        try {
            await StudentService.deleteStudent(req.params.id as string);
            return ApiResponse.success(res, {}, 'Student deleted successfully');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 400);
        }
    }
}

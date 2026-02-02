import { Response } from 'express';
import { ClassService } from './class.service';
import { ApiResponse } from '../../utils/apiResponse';
import { AuthenticatedRequest } from '../../types';

export class ClassController {
    static async getClasses(req: AuthenticatedRequest, res: Response) {
        try {
            const classes = await ClassService.getClasses(req.schoolId);
            return ApiResponse.success(res, classes, 'Classes retrieved');
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    static async getSections(req: AuthenticatedRequest, res: Response) {
        try {
            const sections = await ClassService.getSections(req.schoolId);
            return ApiResponse.success(res, sections, 'Sections retrieved');
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    static async createClass(req: AuthenticatedRequest, res: Response) {
        try {
            const { name, grade } = req.body;
            const cls = await ClassService.createClass(name, grade, req.schoolId);
            return ApiResponse.success(res, cls, 'Class created successfully', 201);
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 400);
        }
    }

    static async createSection(req: AuthenticatedRequest, res: Response) {
        try {
            const { name, classId } = req.body;
            const section = await ClassService.createSection(name, classId, req.schoolId);
            return ApiResponse.success(res, section, 'Section created successfully', 201);
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 400);
        }
    }

    static async deleteClass(req: AuthenticatedRequest, res: Response) {
        try {
            await ClassService.deleteClass(req.params.id as string, req.schoolId);
            return ApiResponse.success(res, {}, 'Class deleted successfully');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 400);
        }
    }

    static async deleteSection(req: AuthenticatedRequest, res: Response) {
        try {
            await ClassService.deleteSection(req.params.id as string, req.schoolId);
            return ApiResponse.success(res, {}, 'Section deleted successfully');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 400);
        }
    }
}

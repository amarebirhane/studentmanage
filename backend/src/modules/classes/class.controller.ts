import { Request, Response } from 'express';
import { ClassService } from './class.service';
import { ApiResponse } from '../../utils/apiResponse';

export class ClassController {
    static async getClasses(req: Request, res: Response) {
        try {
            const classes = await ClassService.getClasses();
            return ApiResponse.success(res, classes, 'Classes retrieved');
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    static async getSections(req: Request, res: Response) {
        try {
            const sections = await ClassService.getSections();
            return ApiResponse.success(res, sections, 'Sections retrieved');
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    static async createClass(req: Request, res: Response) {
        try {
            const { name } = req.body;
            const cls = await ClassService.createClass(name);
            return ApiResponse.success(res, cls, 'Class created successfully', 201);
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 400);
        }
    }

    static async createSection(req: Request, res: Response) {
        try {
            const { name, classId } = req.body;
            const section = await ClassService.createSection(name, classId);
            return ApiResponse.success(res, section, 'Section created successfully', 201);
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 400);
        }
    }

    static async deleteClass(req: Request, res: Response) {
        try {
            await ClassService.deleteClass(req.params.id);
            return ApiResponse.success(res, {}, 'Class deleted successfully');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 400);
        }
    }

    static async deleteSection(req: Request, res: Response) {
        try {
            await ClassService.deleteSection(req.params.id);
            return ApiResponse.success(res, {}, 'Section deleted successfully');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 400);
        }
    }
}

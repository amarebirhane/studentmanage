import { Request, Response } from 'express';
import { ParentService } from './parent.service';
import { ApiResponse } from '../../utils/apiResponse';

export class ParentController {
    static async getParents(req: Request, res: Response) {
        try {
            const parents = await ParentService.getParents();
            return ApiResponse.success(res, parents, 'Parents retrieved');
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    static async getParentById(req: Request, res: Response) {
        try {
            const parent = await ParentService.getParentById(req.params.id as string);
            return ApiResponse.success(res, parent, 'Parent retrieved');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 404);
        }
    }

    static async createParent(req: Request, res: Response) {
        try {
            const parent = await ParentService.createParent(req.body);
            return ApiResponse.success(res, parent, 'Parent created successfully', 201);
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 400);
        }
    }

    static async updateParent(req: Request, res: Response) {
        try {
            const parent = await ParentService.updateParent(req.params.id as string, req.body);
            return ApiResponse.success(res, parent, 'Parent updated successfully');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 400);
        }
    }

    static async deleteParent(req: Request, res: Response) {
        try {
            await ParentService.deleteParent(req.params.id as string);
            return ApiResponse.success(res, {}, 'Parent deleted successfully');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 400);
        }
    }

    static async getFinancials(req: any, res: Response) {
        try {
            const stats = await ParentService.getFinancialSummary(req.user.id);
            return ApiResponse.success(res, stats, 'Financial summary retrieved');
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }
}

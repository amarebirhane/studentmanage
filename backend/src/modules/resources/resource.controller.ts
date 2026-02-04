import { Response } from 'express';
import { AuthenticatedRequest } from '../../types';
import { ResourceService } from './resource.service';
import { ApiResponse } from '../../utils/apiResponse';

export class ResourceController {
    static async createResource(req: AuthenticatedRequest, res: Response) {
        try {
            const resource = await ResourceService.createResource(
                req.body,
                req.user!.id,
                req.user!.schoolId!
            );
            return ApiResponse.success(res, resource, 'Resource uploaded successfully');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, error.statusCode || 500);
        }
    }

    static async getResources(req: AuthenticatedRequest, res: Response) {
        try {
            const resources = await ResourceService.getResources(
                req.query,
                req.user!.schoolId!
            );
            return ApiResponse.success(res, resources, 'Resources fetched successfully');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, error.statusCode || 500);
        }
    }

    static async deleteResource(req: AuthenticatedRequest, res: Response) {
        try {
            await ResourceService.deleteResource(
                req.params.id,
                req.user!.schoolId!
            );
            return ApiResponse.success(res, null, 'Resource deleted successfully');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, error.statusCode || 500);
        }
    }
}

import { Request, Response } from 'express';
import { UserService } from './user.service';
import { ApiResponse } from '../../utils/apiResponse';

export class UserController {
    static async getUsers(req: any, res: Response) {
        try {
            const users = await UserService.getUsers(req.schoolId);
            return ApiResponse.success(res, users, 'Users retrieved');
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    static async searchUsers(req: any, res: Response) {
        try {
            const { q } = req.query;
            const users = await UserService.searchUsers(q as string, req.schoolId);
            return ApiResponse.success(res, users, 'Users found');
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    static async getUserById(req: any, res: Response) {
        try {
            const user = await UserService.getUserById(req.params.id as string, req.schoolId);
            return ApiResponse.success(res, user, 'User retrieved');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 404);
        }
    }

    static async updateUser(req: Request, res: Response) {
        try {
            const user = await UserService.updateUser(req.params.id as string, req.body);
            return ApiResponse.success(res, user, 'User updated successfully');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 400);
        }
    }

    static async deleteUser(req: any, res: Response) {
        try {
            await UserService.deleteUser(req.params.id as string, req.schoolId);
            return ApiResponse.success(res, {}, 'User deleted successfully');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 400);
        }
    }
}

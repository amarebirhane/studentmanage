import { Request, Response } from 'express';
import { UserService } from './user.service';
import { ApiResponse } from '../../utils/apiResponse';

export class UserController {
    static async getUsers(req: Request, res: Response) {
        try {
            const users = await UserService.getUsers();
            return ApiResponse.success(res, users, 'Users retrieved');
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    static async getUserById(req: Request, res: Response) {
        try {
            const user = await UserService.getUserById(req.params.id);
            return ApiResponse.success(res, user, 'User retrieved');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 404);
        }
    }

    static async updateUser(req: Request, res: Response) {
        try {
            const user = await UserService.updateUser(req.params.id, req.body);
            return ApiResponse.success(res, user, 'User updated successfully');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 400);
        }
    }

    static async deleteUser(req: Request, res: Response) {
        try {
            await UserService.deleteUser(req.params.id);
            return ApiResponse.success(res, {}, 'User deleted successfully');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 400);
        }
    }
}

import { Response } from 'express';
import { AuthenticatedRequest } from '../../types';
import { AuthService } from './auth.service';
import { ApiResponse } from '../../utils/apiResponse';
import { config } from '../../config';

export class AuthController {
    static async register(req: AuthenticatedRequest, res: Response) {
        try {
            const user = await AuthService.register(req.body);
            return ApiResponse.success(res, user, 'User registered successfully', 201);
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 400);
        }
    }

    static async login(req: AuthenticatedRequest, res: Response) {
        try {
            const { user, token } = await AuthService.login(req.body);

            // Set cookie
            res.cookie('token', token, {
                httpOnly: true,
                expires: new Date(Date.now() + config.jwt.cookieExpire * 24 * 60 * 60 * 1000),
                secure: config.env === 'production',
                sameSite: 'lax',
                path: '/',
            });

            const { password, ...userWithoutPassword } = user;
            return ApiResponse.success(res, { ...userWithoutPassword, token }, 'Login successful');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 401);
        }
    }

    static async logout(req: AuthenticatedRequest, res: Response) {
        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(0),
            secure: config.env === 'production',
            sameSite: 'strict',
            path: '/'
        });
        return ApiResponse.success(res, {}, 'Logged out successfully');
    }

    static async getProfile(req: AuthenticatedRequest, res: Response) {
        try {
            const user = await AuthService.getProfile(req.user!.id);
            return ApiResponse.success(res, user, 'Profile retrieved');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 404);
        }
    }
}

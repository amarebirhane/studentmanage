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
            const { user, token, refreshToken } = await AuthService.login(req.body);

            // Set cookies
            const cookieOptions = {
                httpOnly: true,
                secure: config.env === 'production',
                sameSite: 'lax' as const,
                path: '/',
            };

            res.cookie('token', token, {
                ...cookieOptions,
                expires: new Date(Date.now() + config.jwt.cookieExpire * 24 * 60 * 60 * 1000),
            });

            res.cookie('refreshToken', refreshToken, {
                ...cookieOptions,
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            });

            const { password, ...userWithoutPassword } = user;
            return ApiResponse.success(res, { ...userWithoutPassword, token, refreshToken }, 'Login successful');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 401);
        }
    }

    static async refresh(req: AuthenticatedRequest, res: Response) {
        try {
            const oldToken = req.cookies.refreshToken || req.body.refreshToken;
            if (!oldToken) {
                return ApiResponse.error(res, 'Refresh token required', 400);
            }

            const { token, refreshToken } = await AuthService.refreshToken(oldToken);

            const cookieOptions = {
                httpOnly: true,
                secure: config.env === 'production',
                sameSite: 'lax' as const,
                path: '/',
            };

            res.cookie('token', token, {
                ...cookieOptions,
                expires: new Date(Date.now() + config.jwt.cookieExpire * 24 * 60 * 60 * 1000),
            });

            res.cookie('refreshToken', refreshToken, {
                ...cookieOptions,
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            });

            return ApiResponse.success(res, { token, refreshToken }, 'Token refreshed');
        } catch (error: any) {
            return ApiResponse.error(res, 'Invalid refresh token', 401);
        }
    }

    static async logout(req: AuthenticatedRequest, res: Response) {
        // Clear refresh token in DB if user is found
        if (req.user) {
            await prisma.user.update({
                where: { id: req.user.id },
                data: { refreshToken: null },
            });
        }

        const cookieOptions = {
            httpOnly: true,
            expires: new Date(0),
            secure: config.env === 'production',
            sameSite: 'strict' as const,
            path: '/'
        };
        res.cookie('token', '', cookieOptions);
        res.cookie('refreshToken', '', cookieOptions);
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
    static async updateProfile(req: AuthenticatedRequest, res: Response) {
        try {
            const user = await AuthService.updateProfile(req.user!.id, req.body);
            return ApiResponse.success(res, user, 'Profile updated successfully');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 400);
        }
    }
}

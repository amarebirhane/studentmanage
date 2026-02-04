import { Response } from 'express';
import { AuthenticatedRequest } from '../../types';
import { AuthService } from './auth.service';
import { ApiResponse } from '../../utils/apiResponse';
import { config, prisma } from '../../config';

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
            const responseData = { user: userWithoutPassword, token, refreshToken };
            console.log('[AuthController] Sending login response data:', JSON.stringify(responseData, null, 2));
            return ApiResponse.success(res, responseData, 'Login successful');
        } catch (error: any) {
            console.error('Login error:', error);
            if (error.message === 'Invalid email or password') {
                return ApiResponse.error(res, error.message, 401);
            }
            return ApiResponse.error(res, 'Internal server error', 500);
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

    static async changePassword(req: AuthenticatedRequest, res: Response) {
        try {
            await AuthService.changePassword(req.user!.id, req.body);
            return ApiResponse.success(res, {}, 'Password changed successfully');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 400);
        }
    }

    // 2FA Endpoints
    static async generateTwoFactor(req: AuthenticatedRequest, res: Response) {
        try {
            const data = await AuthService.generateTwoFactorSecret(req.user!.id);
            return ApiResponse.success(res, data, '2FA secret generated');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 500);
        }
    }

    static async enableTwoFactor(req: AuthenticatedRequest, res: Response) {
        try {
            const { token, secret } = req.body;
            const result = await AuthService.enableTwoFactor(req.user!.id, token, secret);
            return ApiResponse.success(res, result, '2FA enabled successfully');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 400);
        }
    }

    static async verifyTwoFactor(req: AuthenticatedRequest, res: Response) {
        try {
            const result = await AuthService.verifyTwoFactor(req.user!.id, req.body.token);
            return ApiResponse.success(res, { valid: result }, 'Token verified');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 400);
        }
    }

    static async disableTwoFactor(req: AuthenticatedRequest, res: Response) {
        try {
            const result = await AuthService.disableTwoFactor(req.user!.id);
            return ApiResponse.success(res, result, '2FA disabled successfully');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 500);
        }
    }
}

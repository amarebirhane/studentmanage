"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const apiResponse_1 = require("../../utils/apiResponse");
const config_1 = require("../../config");
class AuthController {
    static async register(req, res) {
        try {
            const user = await auth_service_1.AuthService.register(req.body);
            return apiResponse_1.ApiResponse.success(res, user, 'User registered successfully', 201);
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message, 400);
        }
    }
    static async login(req, res) {
        try {
            const { user, token, refreshToken } = await auth_service_1.AuthService.login(req.body);
            // Set cookies
            const cookieOptions = {
                httpOnly: true,
                secure: config_1.config.env === 'production',
                sameSite: 'lax',
                path: '/',
            };
            res.cookie('token', token, {
                ...cookieOptions,
                expires: new Date(Date.now() + config_1.config.jwt.cookieExpire * 24 * 60 * 60 * 1000),
            });
            res.cookie('refreshToken', refreshToken, {
                ...cookieOptions,
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            });
            const { password, ...userWithoutPassword } = user;
            return apiResponse_1.ApiResponse.success(res, { ...userWithoutPassword, token, refreshToken }, 'Login successful');
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message, 401);
        }
    }
    static async refresh(req, res) {
        try {
            const oldToken = req.cookies.refreshToken || req.body.refreshToken;
            if (!oldToken) {
                return apiResponse_1.ApiResponse.error(res, 'Refresh token required', 400);
            }
            const { token, refreshToken } = await auth_service_1.AuthService.refreshToken(oldToken);
            const cookieOptions = {
                httpOnly: true,
                secure: config_1.config.env === 'production',
                sameSite: 'lax',
                path: '/',
            };
            res.cookie('token', token, {
                ...cookieOptions,
                expires: new Date(Date.now() + config_1.config.jwt.cookieExpire * 24 * 60 * 60 * 1000),
            });
            res.cookie('refreshToken', refreshToken, {
                ...cookieOptions,
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            });
            return apiResponse_1.ApiResponse.success(res, { token, refreshToken }, 'Token refreshed');
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, 'Invalid refresh token', 401);
        }
    }
    static async logout(req, res) {
        // Clear refresh token in DB if user is found
        if (req.user) {
            await config_1.prisma.user.update({
                where: { id: req.user.id },
                data: { refreshToken: null },
            });
        }
        const cookieOptions = {
            httpOnly: true,
            expires: new Date(0),
            secure: config_1.config.env === 'production',
            sameSite: 'strict',
            path: '/'
        };
        res.cookie('token', '', cookieOptions);
        res.cookie('refreshToken', '', cookieOptions);
        return apiResponse_1.ApiResponse.success(res, {}, 'Logged out successfully');
    }
    static async getProfile(req, res) {
        try {
            const user = await auth_service_1.AuthService.getProfile(req.user.id);
            return apiResponse_1.ApiResponse.success(res, user, 'Profile retrieved');
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message, 404);
        }
    }
    static async updateProfile(req, res) {
        try {
            const user = await auth_service_1.AuthService.updateProfile(req.user.id, req.body);
            return apiResponse_1.ApiResponse.success(res, user, 'Profile updated successfully');
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message, 400);
        }
    }
}
exports.AuthController = AuthController;

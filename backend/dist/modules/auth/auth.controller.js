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
            const { user, token } = await auth_service_1.AuthService.login(req.body);
            // Set cookie
            res.cookie('token', token, {
                httpOnly: true,
                expires: new Date(Date.now() + config_1.config.jwt.cookieExpire * 24 * 60 * 60 * 1000),
                secure: config_1.config.env === 'production',
                sameSite: 'lax',
                path: '/',
            });
            const { password, ...userWithoutPassword } = user;
            return apiResponse_1.ApiResponse.success(res, { ...userWithoutPassword, token }, 'Login successful');
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message, 401);
        }
    }
    static async logout(req, res) {
        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(0),
            secure: config_1.config.env === 'production',
            sameSite: 'strict',
            path: '/'
        });
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

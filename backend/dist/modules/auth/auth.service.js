"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const config_1 = require("../../config");
const password_1 = require("../../utils/password");
const jwt_1 = require("../../utils/jwt");
const apiResponse_1 = require("../../utils/apiResponse");
const crypto_1 = __importDefault(require("crypto"));
class AuthService {
    static async register(data) {
        const { firstName, lastName, email, password, role, phone, schoolId } = data;
        const userExists = await config_1.prisma.user.findUnique({ where: { email } });
        if (userExists) {
            throw new apiResponse_1.ApiError(400, 'User already exists');
        }
        const hashedPassword = await (0, password_1.hashPassword)(password);
        // Default role logic if not provided or valid
        const formattedRole = role?.toUpperCase() || 'STUDENT';
        const user = await config_1.prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: formattedRole,
                phone,
                schoolId,
            },
        });
        return user;
    }
    static async login(data) {
        const { email, password } = data;
        const user = await config_1.prisma.user.findFirst({
            where: {
                email,
                deletedAt: null
            },
        });
        if (!user || !(await (0, password_1.comparePassword)(password, user.password))) {
            throw new Error('Invalid email or password');
        }
        const token = (0, jwt_1.signToken)(user.id);
        const refreshToken = (0, jwt_1.signRefreshToken)(user.id);
        // Update refresh token in db
        await config_1.prisma.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });
        return { user, token, refreshToken };
    }
    static async refreshToken(oldToken) {
        try {
            const decoded = (0, jwt_1.verifyRefreshToken)(oldToken);
            const user = await config_1.prisma.user.findUnique({
                where: { id: decoded.id },
            });
            if (!user || user.refreshToken !== oldToken) {
                throw new Error('Invalid refresh token');
            }
            const token = (0, jwt_1.signToken)(user.id);
            const refreshToken = (0, jwt_1.signRefreshToken)(user.id);
            // Update refresh token in db (rotation)
            await config_1.prisma.user.update({
                where: { id: user.id },
                data: { refreshToken },
            });
            return { token, refreshToken };
        }
        catch (error) {
            throw new Error('Token verification failed');
        }
    }
    static async getProfile(userId) {
        const user = await config_1.prisma.user.findUnique({
            where: { id: userId },
            include: {
                studentProfile: true,
                teacherProfile: true,
            }
        });
        if (!user) {
            throw new Error('User not found');
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    static async updateProfile(userId, data) {
        const { firstName, lastName, phone, avatarUrl } = data;
        const user = await config_1.prisma.user.update({
            where: { id: userId },
            data: {
                firstName,
                lastName,
                phone,
                avatarUrl,
            },
        });
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    static async requestPasswordReset(email) {
        const user = await config_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new apiResponse_1.ApiError(404, 'User not found');
        }
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
        await config_1.prisma.user.update({
            where: { id: user.id },
            data: { resetToken, resetTokenExpiry },
        });
        // TODO: Send email
        console.log(`Password reset token for ${email}: ${resetToken}`);
        return resetToken;
    }
    static async resetPassword(token, newPassword) {
        const user = await config_1.prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gte: new Date() },
            },
        });
        if (!user) {
            throw new apiResponse_1.ApiError(400, 'Invalid or expired reset token');
        }
        const hashedPassword = await (0, password_1.hashPassword)(newPassword);
        await config_1.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });
        return true;
    }
}
exports.AuthService = AuthService;

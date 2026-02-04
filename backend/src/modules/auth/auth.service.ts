import { prisma } from '../../config';
import { hashPassword, comparePassword } from '../../utils/password';
import { signToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { UserRole } from './auth.types';
import { ApiError } from '../../utils/apiResponse';
import crypto from 'crypto';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

export class AuthService {
    static async register(data: any) {
        const { firstName, lastName, email, password, role, phone, schoolId } = data;

        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) {
            throw new ApiError(400, 'User already exists');
        }

        const hashedPassword = await hashPassword(password);

        // Default role logic if not provided or valid
        const formattedRole = (role?.toUpperCase() as UserRole) || 'STUDENT';

        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: formattedRole as any,
                phone,
                schoolId,
            },
        });

        return user;
    }

    static async login(data: any) {
        const { email, password, code } = data;

        const user = await prisma.user.findFirst({
            where: {
                email,
                deletedAt: null
            },
        });

        if (!user || !(await comparePassword(password, user.password))) {
            throw new Error('Invalid email or password');
        }

        if (user.twoFactorEnabled) {
            if (code) {
                // Verify 2FA code
                const verified = speakeasy.totp.verify({
                    secret: user.twoFactorSecret!,
                    encoding: 'base32',
                    token: code
                });
                if (!verified) throw new ApiError(400, 'Invalid 2FA Code');
            } else {
                return {
                    twoFactorRequired: true,
                    userId: user.id
                };
            }
        }

        const token = signToken(user.id);
        const refreshToken = signRefreshToken(user.id);

        // Update refresh token in db
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });

        return { user, token, refreshToken };
    }

    static async refreshToken(oldToken: string) {
        try {
            const decoded = verifyRefreshToken(oldToken);
            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
            });

            if (!user || (user as any).refreshToken !== oldToken) {
                throw new Error('Invalid refresh token');
            }

            const token = signToken(user.id);
            const refreshToken = signRefreshToken(user.id);

            // Update refresh token in db (rotation)
            await prisma.user.update({
                where: { id: user.id },
                data: { refreshToken },
            });

            return { token, refreshToken };
        } catch (error) {
            throw new Error('Token verification failed');
        }
    }

    static async getProfile(userId: string) {
        const user = await prisma.user.findUnique({
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

    static async updateProfile(userId: string, data: any) {
        const { firstName, lastName, phone, avatarUrl } = data;

        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                firstName,
                lastName,
                phone,
                avatarUrl,
            },
        });

        const { password, ...userWithoutPassword } = user as any;
        return userWithoutPassword;
    }

    static async requestPasswordReset(email: string) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        await prisma.user.update({
            where: { id: user.id },
            data: { resetToken, resetTokenExpiry },
        });

        // TODO: Send email
        console.log(`Password reset token for ${email}: ${resetToken}`);
        return resetToken;
    }

    static async resetPassword(token: string, newPassword: any) {
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gte: new Date() },
            },
        });

        if (!user) {
            throw new ApiError(400, 'Invalid or expired reset token');
        }

        const hashedPassword = await hashPassword(newPassword);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        return true;
    }

    static async changePassword(userId: string, data: any) {
        const { currentPassword, newPassword } = data;

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        const isMatch = await comparePassword(currentPassword, user.password);
        if (!isMatch) {
            throw new ApiError(400, 'Incorrect current password');
        }

        const hashedPassword = await hashPassword(newPassword);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        return true;
    }

    // 2FA Methods
    static async generateTwoFactorSecret(userId: string) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new ApiError(404, 'User not found');

        const secret = speakeasy.generateSecret({
            name: `EduSmart (${user.email})`
        });

        const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url!);

        return {
            secret: secret.base32,
            qrCodeUrl
        };
    }

    static async enableTwoFactor(userId: string, token: string, secret: string) {
        const verified = speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token
        });

        if (!verified) throw new ApiError(400, 'Invalid OTP');

        await prisma.user.update({
            where: { id: userId },
            data: {
                twoFactorSecret: secret,
                twoFactorEnabled: true
            }
        });

        return { message: '2FA enabled successfully' };
    }

    static async verifyTwoFactor(userId: string, token: string) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.twoFactorSecret) throw new ApiError(400, '2FA not enabled');

        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token
        });

        if (!verified) throw new ApiError(400, 'Invalid OTP');

        return true;
    }

    static async disableTwoFactor(userId: string) {
        await prisma.user.update({
            where: { id: userId },
            data: {
                twoFactorSecret: null,
                twoFactorEnabled: false
            }
        });
        return { message: '2FA disabled successfully' };
    }
}

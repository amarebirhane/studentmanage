import { prisma } from '../../config';
import { hashPassword, comparePassword } from '../../utils/password';
import { signToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { UserRole } from './auth.types';
import { ApiError } from '../../utils/apiResponse';

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
                role: formattedRole as any, // Cast to any until prisma client is regenerated
                phone,
                schoolId,
            },
        });

        return user;
    }

    static async login(data: any) {
        const { email, password } = data;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !(await comparePassword(password, user.password))) {
            throw new Error('Invalid email or password');
        }

        const token = signToken(user.id);
        const refreshToken = signRefreshToken(user.id);

        // Update refresh token in db
        await (prisma.user as any).update({
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

            if (!user || user.refreshToken !== oldToken) {
                throw new Error('Invalid refresh token');
            }

            const token = signToken(user.id);
            const refreshToken = signRefreshToken(user.id);

            // Update refresh token in db (rotation)
            await (prisma.user as any).update({
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
}

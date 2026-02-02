import { prisma } from '../../config';
import { hashPassword, comparePassword } from '../../utils/password';
import { signToken } from '../../utils/jwt';
import { UserRole } from './auth.types';

export class AuthService {
    static async register(data: any) {
        const { firstName, lastName, email, password, role, phone } = data;

        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) {
            throw new Error('User already exists');
        }

        const hashedPassword = await hashPassword(password);

        // Default role logic if not provided or valid
        const formattedRole = (role?.toUpperCase() as UserRole) || 'TEACHER';

        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: formattedRole,
                phone,
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

        return { user, token };
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
        const { firstName, lastName, phone } = data;

        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                firstName,
                lastName,
                phone,
            },
        });

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}

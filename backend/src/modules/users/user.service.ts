import { prisma } from '../../config';

export class UserService {
    static async getUsers(schoolId?: string) {
        const where: any = { deletedAt: null };
        if (schoolId) where.schoolId = schoolId;

        return prisma.user.findMany({
            where,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                phone: true,
                createdAt: true,
                schoolId: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    static async getUserById(id: string, schoolId?: string) {
        const where: any = { id, deletedAt: null };
        if (schoolId) where.schoolId = schoolId;

        const user = await prisma.user.findUnique({
            where,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                phone: true,
                schoolId: true,
            },
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    static async updateUser(id: string, data: any) {
        return prisma.user.update({
            where: { id },
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email?.toLowerCase(),
                role: data.role?.toUpperCase(),
                phone: data.phone,
            },
        });
    }

    static async deleteUser(id: string, schoolId?: string) {
        const where: any = { id };
        if (schoolId) where.schoolId = schoolId;

        const user = await prisma.user.findFirst({ where });
        if (!user) throw new Error('User not found');

        return prisma.user.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
    }
}

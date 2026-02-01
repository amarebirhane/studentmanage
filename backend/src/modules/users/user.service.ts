import { prisma } from '../../config';

export class UserService {
    static async getUsers() {
        return prisma.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                phone: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    static async getUserById(id: string) {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                phone: true,
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

    static async deleteUser(id: string) {
        return prisma.user.delete({ where: { id } });
    }
}

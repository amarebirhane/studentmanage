"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const config_1 = require("../../config");
class UserService {
    static async getUsers() {
        return config_1.prisma.user.findMany({
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
    static async getUserById(id) {
        const user = await config_1.prisma.user.findUnique({
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
    static async updateUser(id, data) {
        return config_1.prisma.user.update({
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
    static async deleteUser(id) {
        return config_1.prisma.user.delete({ where: { id } });
    }
}
exports.UserService = UserService;

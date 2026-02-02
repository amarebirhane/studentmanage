"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentService = void 0;
const config_1 = require("../../config");
const password_1 = require("../../utils/password");
class ParentService {
    static async getParents() {
        return config_1.prisma.user.findMany({
            where: { role: 'PARENT' },
            include: {
                parentProfiles: {
                    include: {
                        student: {
                            include: {
                                user: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    static async getParentById(id) {
        const parent = await config_1.prisma.user.findFirst({
            where: { id, role: 'PARENT' },
            include: {
                parentProfiles: {
                    include: {
                        student: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
        });
        if (!parent) {
            throw new Error('Parent not found');
        }
        return parent;
    }
    static async createParent(data) {
        const { firstName, lastName, email, password, phone, studentIds, relationship } = data;
        const userExists = await config_1.prisma.user.findUnique({ where: { email } });
        if (userExists) {
            throw new Error('User with this email already exists');
        }
        const hashedPassword = await (0, password_1.hashPassword)(password || 'Parent@123');
        return await config_1.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword,
                    role: 'PARENT',
                    phone,
                },
            });
            if (studentIds && Array.isArray(studentIds)) {
                for (const studentId of studentIds) {
                    await tx.parentProfile.create({
                        data: {
                            userId: user.id,
                            studentId,
                            relationship: relationship || 'Parent',
                        },
                    });
                }
            }
            return tx.user.findUnique({
                where: { id: user.id },
                include: { parentProfiles: true },
            });
        });
    }
    static async updateParent(id, data) {
        const { firstName, lastName, phone, email, studentIds, relationship } = data;
        const parent = await config_1.prisma.user.findFirst({ where: { id, role: 'PARENT' } });
        if (!parent) {
            throw new Error('Parent not found');
        }
        return await config_1.prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id },
                data: { firstName, lastName, phone, email },
            });
            if (studentIds && Array.isArray(studentIds)) {
                // Remove old associations
                await tx.parentProfile.deleteMany({ where: { userId: id } });
                // Add new associations
                for (const studentId of studentIds) {
                    await tx.parentProfile.create({
                        data: {
                            userId: id,
                            studentId,
                            relationship: relationship || 'Parent',
                        },
                    });
                }
            }
            return tx.user.findUnique({
                where: { id },
                include: { parentProfiles: true },
            });
        });
    }
    static async deleteParent(id) {
        const parent = await config_1.prisma.user.findFirst({ where: { id, role: 'PARENT' } });
        if (!parent) {
            throw new Error('Parent not found');
        }
        return await config_1.prisma.$transaction(async (tx) => {
            await tx.parentProfile.deleteMany({ where: { userId: id } });
            await tx.user.delete({ where: { id } });
        });
    }
}
exports.ParentService = ParentService;

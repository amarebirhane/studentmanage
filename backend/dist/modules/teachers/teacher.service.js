"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherService = void 0;
const config_1 = require("../../config");
const password_1 = require("../../utils/password");
class TeacherService {
    static async getTeachers() {
        return config_1.prisma.teacherProfile.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                    },
                },
                sections: {
                    include: {
                        class: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    static async getTeacherById(id) {
        const teacher = await config_1.prisma.teacherProfile.findUnique({
            where: { id },
            include: {
                user: true,
                sections: {
                    include: {
                        class: true,
                    },
                },
            },
        });
        if (!teacher) {
            throw new Error('Teacher not found');
        }
        return teacher;
    }
    static async createTeacher(data) {
        const { firstName, lastName, email, password, phone, bio, subjects } = data;
        const userExists = await config_1.prisma.user.findUnique({ where: { email } });
        if (userExists) {
            throw new Error('User with this email already exists');
        }
        const hashedPassword = await (0, password_1.hashPassword)(password || 'Teacher@123');
        return await config_1.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword,
                    role: 'TEACHER',
                    phone,
                },
            });
            const profile = await tx.teacherProfile.create({
                data: {
                    userId: user.id,
                    bio,
                    subjects,
                },
                include: { user: true },
            });
            return profile;
        });
    }
    static async updateTeacher(id, data) {
        const { firstName, lastName, phone, email, bio, subjects } = data;
        const teacher = await config_1.prisma.teacherProfile.findUnique({ where: { id } });
        if (!teacher) {
            throw new Error('Teacher not found');
        }
        return await config_1.prisma.$transaction(async (tx) => {
            if (firstName || lastName || phone || email) {
                await tx.user.update({
                    where: { id: teacher.userId },
                    data: { firstName, lastName, phone, email },
                });
            }
            const updatedProfile = await tx.teacherProfile.update({
                where: { id },
                data: { bio, subjects },
                include: { user: true },
            });
            return updatedProfile;
        });
    }
    static async deleteTeacher(id) {
        const teacher = await config_1.prisma.teacherProfile.findUnique({ where: { id } });
        if (!teacher) {
            throw new Error('Teacher not found');
        }
        return await config_1.prisma.$transaction(async (tx) => {
            await tx.teacherProfile.delete({ where: { id } });
            await tx.user.delete({ where: { id: teacher.userId } });
        });
    }
}
exports.TeacherService = TeacherService;

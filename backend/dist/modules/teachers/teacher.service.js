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
                    schoolId: data.schoolId,
                },
            });
            const profile = await tx.teacherProfile.create({
                data: {
                    userId: user.id,
                    bio,
                    subjects,
                    schoolId: data.schoolId,
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
    static async getTeacherClasses(userId) {
        return config_1.prisma.teacherProfile.findUnique({
            where: { userId },
            include: {
                sections: {
                    include: {
                        class: true,
                    },
                },
            },
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
    static async getDashboardStats(userId) {
        const teacher = await config_1.prisma.teacherProfile.findUnique({
            where: { userId },
            include: {
                sections: {
                    include: {
                        _count: {
                            select: { students: true }
                        }
                    }
                }
            }
        });
        if (!teacher)
            throw new Error('Teacher profile not found');
        // 1. Calculate student count
        const totalStudents = teacher.sections.reduce((sum, section) => sum + section._count.students, 0);
        // 2. Pending Assignments (Assignments created by teacher with ungraded submissions)
        const pendingGrading = await config_1.prisma.assignmentSubmission.count({
            where: {
                assignment: {
                    teacherId: teacher.id
                },
                gradedAt: null
            }
        });
        // 3. Today's Classes (from timetable - assuming simple daily schedule for now)
        // For now, returning total sections as "classes"
        const totalClasses = teacher.sections.length;
        // 4. Recent Messages
        const recentMessages = await config_1.prisma.message.findMany({
            where: { recipientId: userId },
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                sender: {
                    select: { firstName: true, lastName: true, role: true }
                }
            }
        });
        return {
            totalStudents,
            totalClasses,
            pendingGrading,
            recentMessages
        };
    }
}
exports.TeacherService = TeacherService;

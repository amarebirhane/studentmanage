import { prisma } from '../../config';
import { hashPassword } from '../../utils/password';
import { AuditLogService } from '../platform/audit.service';

export class TeacherService {
    static async getTeachers(schoolId?: string) {
        const where: any = { deletedAt: null };
        if (schoolId) where.schoolId = schoolId;

        return prisma.teacherProfile.findMany({
            where,
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
                _count: {
                    select: {
                        subjects: true,
                        sections: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    static async getTeacherById(id: string, schoolId?: string) {
        const where: any = { id, deletedAt: null };
        if (schoolId) where.schoolId = schoolId;

        const teacher = await prisma.teacherProfile.findFirst({
            where,
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

    static async createTeacher(data: any, schoolId?: string) {
        const { firstName, lastName, email, password, phone, bio, subjects } = data;

        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) {
            throw new Error('User with this email already exists');
        }

        const hashedPassword = await hashPassword(password || 'Teacher@123');

        return await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword,
                    role: 'TEACHER',
                    phone,
                    schoolId,
                },
            });

            const profile = await tx.teacherProfile.create({
                data: {
                    userId: user.id,
                    bio,
                    subjects,
                    schoolId,
                },
                include: { user: true },
            });

            await AuditLogService.log({
                action: 'CREATE_TEACHER',
                module: 'TEACHERS',
                userId: user.id,
                schoolId,
                details: { profileId: profile.id }
            });

            return profile;
        });
    }

    static async updateTeacher(id: string, data: any, schoolId?: string) {
        const { firstName, lastName, phone, email, bio, subjects } = data;

        const where: any = { id };
        if (schoolId) where.schoolId = schoolId;

        const teacher = await prisma.teacherProfile.findFirst({ where });
        if (!teacher) {
            throw new Error('Teacher not found');
        }

        return await prisma.$transaction(async (tx) => {
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

            await AuditLogService.log({
                action: 'UPDATE_TEACHER',
                module: 'TEACHERS',
                userId: teacher.userId,
                schoolId,
                details: { profileId: updatedProfile.id, updatedFields: Object.keys(data) }
            });

            return updatedProfile;
        });
    }

    static async getTeacherClasses(userId: string, schoolId?: string) {
        const where: any = { userId };
        if (schoolId) where.schoolId = schoolId;

        return prisma.teacherProfile.findFirst({
            where,
            include: {
                sections: {
                    include: {
                        class: true,
                    },
                },
            },
        });
    }

    static async deleteTeacher(id: string, schoolId?: string) {
        const where: any = { id };
        if (schoolId) where.schoolId = schoolId;

        const teacher = await prisma.teacherProfile.findFirst({ where });
        if (!teacher) {
            throw new Error('Teacher not found');
        }

        return await prisma.$transaction(async (tx) => {
            await tx.teacherProfile.update({
                where: { id },
                data: { deletedAt: new Date() }
            });
            await tx.user.update({
                where: { id: teacher.userId },
                data: { deletedAt: new Date() }
            });

            await AuditLogService.log({
                action: 'DELETE_TEACHER',
                module: 'TEACHERS',
                userId: teacher.userId,
                schoolId,
                details: { profileId: id }
            });
        });
    }

    static async getDashboardStats(userId: string, schoolId?: string) {
        const where: any = { userId };
        if (schoolId) where.schoolId = schoolId;

        const teacher = await prisma.teacherProfile.findFirst({
            where,
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

        if (!teacher) throw new Error('Teacher profile not found');

        // 1. Calculate student count
        const totalStudents = teacher.sections.reduce((sum, section) => sum + section._count.students, 0);

        // 2. Pending Assignments (Assignments created by teacher with ungraded submissions)
        const pendingGrading = await prisma.assignmentSubmission.count({
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
        const recentMessages = await prisma.message.findMany({
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

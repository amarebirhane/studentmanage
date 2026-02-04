import { prisma } from '../../config';
import { hashPassword } from '../../utils/password';
import { StudentFilters } from './student.types';
import { AuditLogService } from '../platform/audit.service';

export class StudentService {
    static async getStudents(filters: any, schoolId?: string, userId?: string, role?: string) {
        const { search, classId, sectionId, page = 1, limit = 10 } = filters;
        const skip = (page - 1) * limit;

        const where: any = { deletedAt: null };
        if (schoolId) where.schoolId = schoolId;

        // Role-based filtering
        if (role === 'PARENT' && userId) {
            where.parentProfiles = { some: { userId } };
        } else if (role === 'STUDENT' && userId) {
            where.userId = userId;
        }

        if (classId) where.classId = classId;
        if (sectionId) where.sectionId = sectionId;
        if (search) {
            where.OR = [
                { user: { firstName: { contains: search, mode: 'insensitive' } } },
                { user: { lastName: { contains: search, mode: 'insensitive' } } },
                { user: { email: { contains: search, mode: 'insensitive' } } },
                { enrollmentNo: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [students, total] = await Promise.all([
            prisma.studentProfile.findMany({
                where,
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                            phone: true,
                        },
                    },
                    class: true,
                    section: true,
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.studentProfile.count({ where }),
        ]);

        return {
            students,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    static async getStudentById(id: string, schoolId?: string) {
        const where: any = { id, deletedAt: null };
        if (schoolId) where.schoolId = schoolId;

        const student = await prisma.studentProfile.findUnique({
            where,
            include: {
                user: true,
                class: true,
                section: true,
            },
        });

        if (!student) {
            throw new Error('Student not found');
        }

        return student;
    }

    static async createStudent(data: any, schoolId?: string) {
        const {
            firstName,
            lastName,
            email,
            password,
            phone,
            enrollmentNo,
            ...profileData
        } = data;

        // Check if user already exists
        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) {
            throw new Error('User with this email already exists');
        }

        // Check if enrollmentNo exists
        if (enrollmentNo) {
            const enNoExists = await prisma.studentProfile.findUnique({ where: { enrollmentNo } });
            if (enNoExists) {
                throw new Error('Enrollment number already exists');
            }
        }

        // Normalize empty strings to null for foreign key fields
        const normalizedClassId = profileData.classId && typeof profileData.classId === 'string' && profileData.classId.trim() !== ''
            ? profileData.classId.trim()
            : null;
        const normalizedSectionId = profileData.sectionId && typeof profileData.sectionId === 'string' && profileData.sectionId.trim() !== ''
            ? profileData.sectionId.trim()
            : null;

        // Validate classId if provided
        if (normalizedClassId) {
            const classExists = await prisma.class.findFirst({
                where: {
                    id: normalizedClassId,
                    deletedAt: null,
                    ...(schoolId && { schoolId })
                }
            });
            if (!classExists) {
                throw new Error('Selected class does not exist');
            }
        }

        // Validate sectionId if provided
        if (normalizedSectionId) {
            const sectionExists = await prisma.section.findFirst({
                where: {
                    id: normalizedSectionId,
                    deletedAt: null,
                    ...(normalizedClassId && { classId: normalizedClassId })
                }
            });
            if (!sectionExists) {
                throw new Error('Selected section does not exist');
            }
        }

        const hashedPassword = await hashPassword(password || 'Student@123');

        return await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword,
                    role: 'STUDENT',
                    phone,
                    schoolId,
                },
            });

            // Prepare profile data, excluding classId and sectionId from spread
            const { classId, sectionId, dateOfBirth, ...restProfileData } = profileData;

            const profile = await tx.studentProfile.create({
                data: {
                    ...restProfileData,
                    userId: user.id,
                    enrollmentNo,
                    schoolId,
                    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                    ...(normalizedClassId && { classId: normalizedClassId }),
                    ...(normalizedSectionId && { sectionId: normalizedSectionId }),
                },
                include: { user: true },
            });

            await AuditLogService.log({
                action: 'CREATE_STUDENT',
                module: 'STUDENTS',
                userId: user.id,
                schoolId,
                details: { profileId: profile.id }
            });

            return profile;
        });
    }

    static async updateStudent(id: string, data: any, schoolId?: string) {
        const { firstName, lastName, phone, email, dateOfBirth, status, ...profileData } = data;

        const where: any = { id };
        if (schoolId) where.schoolId = schoolId;

        const student = await prisma.studentProfile.findFirst({ where });
        if (!student) {
            throw new Error('Student not found');
        }

        return await prisma.$transaction(async (tx) => {
            if (firstName || lastName || phone || email) {
                await tx.user.update({
                    where: { id: student.userId },
                    data: { firstName, lastName, phone, email },
                });
            }

            const updatedProfile = await tx.studentProfile.update({
                where: { id },
                data: {
                    ...profileData,
                    status: status || undefined,
                    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
                },
                include: { user: true },
            });

            await AuditLogService.log({
                action: 'UPDATE_STUDENT',
                module: 'STUDENTS',
                userId: student.userId,
                schoolId,
                details: { profileId: updatedProfile.id, updatedFields: Object.keys(data) }
            });

            return updatedProfile;
        });
    }

    static async approveAdmission(id: string, schoolId?: string) {
        const where: any = { id, deletedAt: null };
        if (schoolId) where.schoolId = schoolId;

        const student = await prisma.studentProfile.findFirst({ where });
        if (!student) {
            throw new Error('Student not found');
        }

        return await prisma.studentProfile.update({
            where: { id },
            data: { status: 'ADMITTED' },
            include: { user: true },
        });
    }

    static async deleteStudent(id: string, schoolId?: string) {
        const where: any = { id, deletedAt: null };
        if (schoolId) where.schoolId = schoolId;

        const student = await prisma.studentProfile.findFirst({ where });
        if (!student) {
            throw new Error('Student not found');
        }

        return await prisma.$transaction(async (tx) => {
            await tx.studentProfile.update({
                where: { id },
                data: { deletedAt: new Date() }
            });
            await tx.user.update({
                where: { id: student.userId },
                data: { deletedAt: new Date() }
            });

            await AuditLogService.log({
                action: 'DELETE_STUDENT',
                module: 'STUDENTS',
                userId: student.userId,
                schoolId,
                details: { profileId: id }
            });
        });
    }

    static async bulkPromoteStudents(data: {
        studentIds: string[];
        targetClassId: string;
        targetSectionId?: string;
        schoolId?: string;
    }) {
        const { studentIds, targetClassId, targetSectionId, schoolId } = data;

        return await prisma.studentProfile.updateMany({
            where: {
                id: { in: studentIds },
                schoolId,
                deletedAt: null,
            },
            data: {
                classId: targetClassId,
                sectionId: targetSectionId || null,
            },
        });
    }

    static async updateStudentStatus(id: string, status: string, schoolId?: string) {
        const where: any = { id, deletedAt: null };
        if (schoolId) where.schoolId = schoolId;

        const student = await prisma.studentProfile.findFirst({ where });
        if (!student) {
            throw new Error('Student not found');
        }

        return await prisma.studentProfile.update({
            where: { id },
            data: { status },
            include: { user: true },
        });
    }
}

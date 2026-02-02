import { prisma } from '../../config';
import { hashPassword } from '../../utils/password';
import { StudentFilters } from './student.types';

export class StudentService {
    static async getStudents(filters: any, schoolId?: string, userId?: string, role?: string) {
        const { search, classId, sectionId, page = 1, limit = 10 } = filters;
        const skip = (page - 1) * limit;

        const where: any = {};
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
        const where: any = { id };
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

            const profile = await tx.studentProfile.create({
                data: {
                    ...profileData,
                    userId: user.id,
                    enrollmentNo,
                    schoolId,
                    dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth) : null,
                },
                include: { user: true },
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

            return updatedProfile;
        });
    }

    static async approveAdmission(id: string, schoolId?: string) {
        const student = await prisma.studentProfile.findUnique({ where: { id } });
        if (!student || (schoolId && student.schoolId !== schoolId)) {
            throw new Error('Student not found');
        }

        return await prisma.studentProfile.update({
            where: { id },
            data: { status: 'ADMITTED' },
            include: { user: true },
        });
    }

    static async deleteStudent(id: string, schoolId?: string) {
        const where: any = { id };
        if (schoolId) where.schoolId = schoolId;

        const student = await prisma.studentProfile.findFirst({ where });
        if (!student) {
            throw new Error('Student not found');
        }

        return await prisma.$transaction(async (tx) => {
            await tx.studentProfile.delete({ where: { id } });
            await tx.user.delete({ where: { id: student.userId } });
        });
    }
}

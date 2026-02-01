"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentService = void 0;
const config_1 = require("../../config");
const password_1 = require("../../utils/password");
class StudentService {
    static async getStudents(filters) {
        const { search, classId, sectionId, page = 1, limit = 10 } = filters;
        const skip = (page - 1) * limit;
        const where = {};
        if (classId)
            where.classId = classId;
        if (sectionId)
            where.sectionId = sectionId;
        if (search) {
            where.OR = [
                { user: { firstName: { contains: search, mode: 'insensitive' } } },
                { user: { lastName: { contains: search, mode: 'insensitive' } } },
                { user: { email: { contains: search, mode: 'insensitive' } } },
                { enrollmentNo: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [students, total] = await Promise.all([
            config_1.prisma.studentProfile.findMany({
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
            config_1.prisma.studentProfile.count({ where }),
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
    static async getStudentById(id) {
        const student = await config_1.prisma.studentProfile.findUnique({
            where: { id },
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
    static async createStudent(data) {
        const { firstName, lastName, email, password, phone, enrollmentNo, ...profileData } = data;
        // Check if user already exists
        const userExists = await config_1.prisma.user.findUnique({ where: { email } });
        if (userExists) {
            throw new Error('User with this email already exists');
        }
        // Check if enrollmentNo exists
        if (enrollmentNo) {
            const enNoExists = await config_1.prisma.studentProfile.findUnique({ where: { enrollmentNo } });
            if (enNoExists) {
                throw new Error('Enrollment number already exists');
            }
        }
        const hashedPassword = await (0, password_1.hashPassword)(password || 'Student@123');
        return await config_1.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword,
                    role: 'STUDENT',
                    phone,
                },
            });
            const profile = await tx.studentProfile.create({
                data: {
                    userId: user.id,
                    enrollmentNo,
                    ...profileData,
                    dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth) : null,
                },
                include: { user: true },
            });
            return profile;
        });
    }
    static async updateStudent(id, data) {
        const { firstName, lastName, phone, email, dateOfBirth, ...profileData } = data;
        const student = await config_1.prisma.studentProfile.findUnique({ where: { id } });
        if (!student) {
            throw new Error('Student not found');
        }
        return await config_1.prisma.$transaction(async (tx) => {
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
                    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
                },
                include: { user: true },
            });
            return updatedProfile;
        });
    }
    static async deleteStudent(id) {
        const student = await config_1.prisma.studentProfile.findUnique({ where: { id } });
        if (!student) {
            throw new Error('Student not found');
        }
        return await config_1.prisma.$transaction(async (tx) => {
            await tx.studentProfile.delete({ where: { id } });
            await tx.user.delete({ where: { id: student.userId } });
        });
    }
}
exports.StudentService = StudentService;

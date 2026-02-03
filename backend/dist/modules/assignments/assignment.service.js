"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentService = void 0;
const config_1 = require("../../config");
class AssignmentService {
    static async createAssignment(data) {
        return config_1.prisma.assignment.create({
            data: {
                ...data,
                status: 'PUBLISHED',
            },
            include: {
                class: true,
                section: true,
                teacher: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
        });
    }
    static async getAssignments(filters, schoolId, userId, role) {
        const where = {};
        if (schoolId)
            where.schoolId = schoolId;
        if (filters.classId)
            where.classId = filters.classId;
        if (filters.sectionId)
            where.sectionId = filters.sectionId;
        if (filters.status)
            where.status = filters.status;
        // Role-based filtering
        if (role === 'TEACHER' && userId) {
            where.userId = userId;
        }
        else if (role === 'STUDENT' && userId) {
            // Students see assignments for their class
            const student = await config_1.prisma.studentProfile.findUnique({
                where: { userId },
                select: { classId: true, sectionId: true },
            });
            if (student) {
                where.OR = [
                    { classId: student.classId, sectionId: null },
                    { sectionId: student.sectionId },
                ];
            }
        }
        return config_1.prisma.assignment.findMany({
            where,
            include: {
                class: true,
                section: true,
                teacher: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
                submissions: role === 'TEACHER',
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    static async submitAssignment(data) {
        // Verify assignment exists and belongs to the school
        const assignment = await config_1.prisma.assignment.findFirst({
            where: {
                id: data.assignmentId,
                schoolId: data.schoolId,
            }
        });
        if (!assignment) {
            throw new Error('Assignment not found in this school');
        }
        // Check if already submitted
        const existing = await config_1.prisma.assignmentSubmission.findUnique({
            where: {
                assignmentId_studentId: {
                    assignmentId: data.assignmentId,
                    studentId: data.studentId,
                },
            },
        });
        if (existing) {
            throw new Error('Assignment already submitted');
        }
        return config_1.prisma.assignmentSubmission.create({
            data: {
                assignmentId: data.assignmentId,
                studentId: data.studentId,
                fileUrl: data.fileUrl,
                content: data.content,
            },
            include: {
                assignment: {
                    select: {
                        title: true,
                        dueDate: true,
                    },
                },
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
        });
    }
    static async gradeSubmission(data) {
        const submission = await config_1.prisma.assignmentSubmission.findFirst({
            where: {
                id: data.submissionId,
                assignment: {
                    schoolId: data.schoolId,
                }
            }
        });
        if (!submission) {
            throw new Error('Submission not found');
        }
        return config_1.prisma.assignmentSubmission.update({
            where: { id: data.submissionId },
            data: {
                marks: data.marks,
                grade: data.grade,
                feedback: data.feedback,
                gradedBy: data.gradedBy,
                gradedAt: new Date(),
            },
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
                assignment: true,
            },
        });
    }
    static async getMySubmissions(studentId) {
        return config_1.prisma.assignmentSubmission.findMany({
            where: { studentId },
            include: {
                assignment: {
                    include: {
                        class: true,
                        section: true,
                        teacher: {
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
            orderBy: { submittedAt: 'desc' },
        });
    }
    static async getAssignmentSubmissions(assignmentId, teacherId, schoolId) {
        const assignment = await config_1.prisma.assignment.findFirst({
            where: {
                id: assignmentId,
                schoolId: schoolId,
            },
        });
        if (!assignment) {
            throw new Error('Assignment not found');
        }
        // Verify teacher ownership
        if (teacherId && assignment.userId !== teacherId) {
            throw new Error('Unauthorized');
        }
        return config_1.prisma.assignmentSubmission.findMany({
            where: { assignmentId },
            include: {
                student: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },
            },
            orderBy: { submittedAt: 'desc' },
        });
    }
}
exports.AssignmentService = AssignmentService;

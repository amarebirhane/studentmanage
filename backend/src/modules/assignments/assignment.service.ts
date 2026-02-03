import { prisma } from '../../config';

export class AssignmentService {
    static async createAssignment(data: {
        title: string;
        description?: string;
        subjectId?: string;
        dueDate?: Date;
        classId?: string;
        sectionId?: string;
        attachmentUrl?: string;
        resourcesUrl?: string;
        teacherId: string;
        schoolId?: string;
        userId: string;
    }) {
        return prisma.assignment.create({
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

    static async getAssignments(filters: {
        classId?: string;
        sectionId?: string;
        teacherId?: string;
        status?: string;
    }, schoolId?: string, userId?: string, role?: string) {
        const where: any = {};

        if (schoolId) where.schoolId = schoolId;
        if (filters.classId) where.classId = filters.classId;
        if (filters.sectionId) where.sectionId = filters.sectionId;
        if (filters.status) where.status = filters.status;

        // Role-based filtering
        if (role === 'TEACHER' && userId) {
            where.userId = userId;
        } else if (role === 'STUDENT' && userId) {
            // Students see assignments for their class
            const student = await prisma.studentProfile.findUnique({
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

        return prisma.assignment.findMany({
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

    static async submitAssignment(data: {
        assignmentId: string;
        studentId: string;
        fileUrl?: string;
        content?: string;
        schoolId?: string;
    }) {
        // Verify assignment exists and belongs to the school
        const assignment = await prisma.assignment.findFirst({
            where: {
                id: data.assignmentId,
                schoolId: data.schoolId,
            }
        });

        if (!assignment) {
            throw new Error('Assignment not found in this school');
        }

        // Check if already submitted
        const existing = await prisma.assignmentSubmission.findUnique({
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

        return prisma.assignmentSubmission.create({
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

    static async gradeSubmission(data: {
        submissionId: string;
        marks?: number;
        grade?: string;
        feedback?: string;
        gradedBy: string;
        schoolId?: string;
    }) {
        const submission = await prisma.assignmentSubmission.findFirst({
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

        return prisma.assignmentSubmission.update({
            where: { id: data.submissionId },
            data: {
                marks: data.marks as any,
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

    static async getMySubmissions(studentId: string) {
        return prisma.assignmentSubmission.findMany({
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

    static async getAssignmentSubmissions(assignmentId: string, teacherId?: string, schoolId?: string) {
        const assignment = await prisma.assignment.findFirst({
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

        return prisma.assignmentSubmission.findMany({
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

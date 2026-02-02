import { prisma } from '../../config';

export class AssignmentService {
    static async createAssignment(data: {
        title: string;
        description?: string;
        subject?: string;
        dueDate?: Date;
        classId?: string;
        sectionId?: string;
        attach mentUrl?: string;
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
}, schoolId ?: string, userId ?: string, role ?: string) {
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
}) {
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
        data,
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
}) {
    return prisma.assignmentSubmission.update({
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

    static async getAssignmentSubmissions(assignmentId: string, teacherId ?: string) {
    const assignment = await prisma.assignment.findUnique({
        where: { id: assignmentId },
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

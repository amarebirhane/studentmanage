import { prisma } from '../../config';
import { Prisma } from '@prisma/client';

export class ExamService {
    static async createExam(data: {
        name: string;
        subject: string;
        examDate: Date;
        maxMarks: number;
        classId?: string;
        sectionId?: string;
        createdById: string;
        schoolId?: string;
        term?: string;
    }) {
        return prisma.exam.create({
            data: {
                ...data,
                published: false,
            },
            include: {
                class: true,
                section: true,
            },
        });
    }

    static async getExams(filters: {
        classId?: string;
        sectionId?: string;
        term?: string;
        schoolId?: string;
        teacherId?: string;
    }) {
        const where: any = {};
        if (filters.schoolId) where.schoolId = filters.schoolId;
        if (filters.classId) where.classId = filters.classId;
        if (filters.sectionId) where.sectionId = filters.sectionId;
        if (filters.term) where.term = filters.term;
        if (filters.teacherId) where.createdById = filters.teacherId;

        return prisma.exam.findMany({
            where,
            include: {
                class: true,
                section: true,
                _count: {
                    select: { grades: true },
                },
            },
            orderBy: { examDate: 'desc' },
        });
    }

    static async getExamById(id: string, schoolId?: string) {
        const where: any = { id };
        if (schoolId) where.schoolId = schoolId;

        const exam = await prisma.exam.findFirst({
            where,
            include: {
                class: true,
                section: true,
                grades: {
                    include: {
                        student: {
                            include: {
                                user: {
                                    select: { firstName: true, lastName: true },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!exam) throw new Error('Exam not found');
        return exam;
    }

    static async updateExam(id: string, data: any, schoolId?: string) {
        const where: any = { id };
        if (schoolId) where.schoolId = schoolId;

        const exam = await prisma.exam.findFirst({ where });
        if (!exam) throw new Error('Exam not found');

        return prisma.exam.update({
            where: { id },
            data,
        });
    }

    static async deleteExam(id: string, schoolId?: string) {
        const where: any = { id };
        if (schoolId) where.schoolId = schoolId;

        const exam = await prisma.exam.findFirst({ where });
        if (!exam) throw new Error('Exam not found');

        return prisma.exam.delete({
            where: { id },
        });
    }

    static calculateGrade(percentage: number): string {
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B';
        if (percentage >= 60) return 'C';
        if (percentage >= 50) return 'D';
        return 'F';
    }

    static async enterMarks(data: {
        examId: string;
        marks: Array<{
            studentId: string;
            scoredMarks: number;
            remarks?: string;
        }>;
        schoolId?: string;
    }) {
        const where: any = { id: data.examId };
        if (data.schoolId) where.schoolId = data.schoolId;

        const exam = await prisma.exam.findFirst({
            where,
        });

        if (!exam) throw new Error('Exam not found');

        const results = await Promise.all(
            data.marks.map((entry) => {
                const percentage = (entry.scoredMarks / exam.maxMarks) * 100;
                const grade = this.calculateGrade(percentage);

                return prisma.gradeRecord.upsert({
                    where: {
                        studentId_examId_subject: {
                            studentId: entry.studentId,
                            examId: data.examId,
                            subject: (exam as any).subject || 'General',
                        },
                    },
                    update: {
                        scoredMarks: entry.scoredMarks,
                        totalMarks: exam.maxMarks,
                        grade,
                        remarks: entry.remarks,
                    },
                    create: {
                        studentId: entry.studentId,
                        examId: data.examId,
                        subject: (exam as any).subject || 'General',
                        scoredMarks: entry.scoredMarks,
                        totalMarks: exam.maxMarks,
                        grade,
                        remarks: entry.remarks,
                    },
                });
            })
        );

        return results;
    }

    static async publishResults(examId: string, schoolId?: string) {
        const where: any = { id: examId };
        if (schoolId) where.schoolId = schoolId;

        const exam = await prisma.exam.findFirst({ where });
        if (!exam) throw new Error('Exam not found');

        return prisma.exam.update({
            where: { id: examId },
            data: {
                published: true,
                publishedAt: new Date(),
            },
        });
    }

    static async getMyResults(studentId: string, filters: { term?: string, schoolId?: string } = {}) {
        const where: any = {
            studentId,
            exam: {
                published: true,
                ...(filters.term ? { term: filters.term } : {}),
            },
        };

        if (filters.schoolId) {
            where.exam.schoolId = filters.schoolId;
        }

        return prisma.gradeRecord.findMany({
            where,
            include: {
                exam: true,
            },
            orderBy: { exam: { examDate: 'desc' } },
        });
    }
}

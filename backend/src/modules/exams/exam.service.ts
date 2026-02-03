import { prisma } from '../../config';
import { Prisma } from '@prisma/client';
import { AuditLogService } from '../platform/audit.service';

export class ExamService {
    static async createExam(data: {
        name: string;
        subjectId: string;
        examDate: Date;
        maxMarks: number;
        classId?: string;
        sectionId?: string;
        createdById: string;
        schoolId?: string;
        term?: string;
    }) {
        const exam = await prisma.exam.create({
            data: {
                ...data,
                published: false,
            },
            include: {
                class: true,
                section: true,
            },
        });

        await AuditLogService.log({
            action: 'CREATE_EXAM',
            module: 'EXAMS',
            userId: data.createdById,
            schoolId: data.schoolId,
            details: { examId: exam.id }
        });

        return exam;
    }

    static async getExams(filters: any, schoolId?: string) {
        const { classId, sectionId, subjectId, term, teacherId } = filters;
        const where: any = { deletedAt: null };
        if (schoolId) where.schoolId = schoolId;
        if (classId) where.classId = classId;
        if (sectionId) where.sectionId = sectionId;
        if (subjectId) where.subjectId = subjectId;
        if (term) where.term = term;
        if (teacherId) where.createdById = teacherId;

        return prisma.exam.findMany({
            where,
            include: {
                class: true,
                section: true,
                subject: true,
                _count: {
                    select: { grades: true },
                },
            },
            orderBy: { examDate: 'desc' },
        });
    }

    static async getExamById(id: string, schoolId?: string) {
        const where: any = { id, deletedAt: null };
        if (schoolId) where.schoolId = schoolId;

        const exam = await prisma.exam.findUnique({
            where,
            include: {
                class: true,
                section: true,
                subject: true,
                grades: {
                    include: {
                        student: {
                            include: {
                                user: {
                                    select: { firstName: true, lastName: true }
                                }
                            }
                        }
                    }
                }
            },
        });

        if (!exam) throw new Error('Exam not found');
        return exam;
    }

    static async updateExam(id: string, data: any, schoolId?: string) {
        const where: any = { id, deletedAt: null };
        if (schoolId) where.schoolId = schoolId;

        const exam = await prisma.exam.update({
            where: { id },
            data,
        });

        await AuditLogService.log({
            action: 'UPDATE_EXAM',
            module: 'EXAMS',
            userId: exam.createdById,
            schoolId,
            details: { examId: id, updatedFields: Object.keys(data) }
        });

        return exam;
    }

    static async deleteExam(id: string, schoolId?: string) {
        const where: any = { id, deletedAt: null };
        if (schoolId) where.schoolId = schoolId;

        const exam = await prisma.exam.findFirst({ where });
        if (!exam) throw new Error('Exam not found');

        await prisma.exam.update({
            where: { id },
            data: { deletedAt: new Date() }
        });

        await AuditLogService.log({
            action: 'DELETE_EXAM',
            module: 'EXAMS',
            userId: exam.createdById,
            schoolId,
            details: { examId: id }
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
        const where: any = { id: data.examId, deletedAt: null };
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
                        studentId_examId_subjectId: {
                            studentId: entry.studentId,
                            examId: data.examId,
                            subjectId: exam.subjectId!,
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
                        subjectId: exam.subjectId!,
                        scoredMarks: entry.scoredMarks,
                        totalMarks: exam.maxMarks,
                        grade,
                        remarks: entry.remarks,
                    },
                });
            })
        );

        await AuditLogService.log({
            action: 'ENTER_MARKS',
            module: 'EXAMS',
            userId: exam.createdById,
            schoolId: data.schoolId,
            details: { examId: data.examId, studentCount: data.marks.length }
        });

        return results;
    }

    static async publishResults(examId: string, schoolId?: string) {
        const where: any = { id: examId, deletedAt: null };
        if (schoolId) where.schoolId = schoolId;

        const exam = await prisma.exam.findFirst({ where });
        if (!exam) throw new Error('Exam not found');

        const updatedExam = await prisma.exam.update({
            where: { id: examId },
            data: {
                published: true,
                publishedAt: new Date(),
            },
        });

        await AuditLogService.log({
            action: 'PUBLISH_RESULTS',
            module: 'EXAMS',
            userId: exam.createdById,
            schoolId,
            details: { examId }
        });

        return updatedExam;
    }

    static async getMyResults(studentId: string, filters: { term?: string, schoolId?: string } = {}) {
        const where: any = {
            studentId,
            exam: {
                published: true,
                deletedAt: null,
                ...(filters.term ? { term: filters.term } : {}),
            },
        };

        if (filters.schoolId) {
            where.exam.schoolId = filters.schoolId;
        }

        return prisma.gradeRecord.findMany({
            where,
            include: {
                exam: {
                    include: { subject: true }
                },
            },
            orderBy: { exam: { examDate: 'desc' } },
        });
    }
}

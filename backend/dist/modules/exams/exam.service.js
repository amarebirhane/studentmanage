"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamService = void 0;
const config_1 = require("../../config");
class ExamService {
    static async createExam(data) {
        return config_1.prisma.exam.create({
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
    static async getExams(filters) {
        const where = {};
        if (filters.schoolId)
            where.schoolId = filters.schoolId;
        if (filters.classId)
            where.classId = filters.classId;
        if (filters.sectionId)
            where.sectionId = filters.sectionId;
        if (filters.term)
            where.term = filters.term;
        if (filters.teacherId)
            where.createdById = filters.teacherId;
        return config_1.prisma.exam.findMany({
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
    static async getExamById(id, schoolId) {
        const where = { id };
        if (schoolId)
            where.schoolId = schoolId;
        const exam = await config_1.prisma.exam.findFirst({
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
        if (!exam)
            throw new Error('Exam not found');
        return exam;
    }
    static async updateExam(id, data, schoolId) {
        const where = { id };
        if (schoolId)
            where.schoolId = schoolId;
        const exam = await config_1.prisma.exam.findFirst({ where });
        if (!exam)
            throw new Error('Exam not found');
        return config_1.prisma.exam.update({
            where: { id },
            data,
        });
    }
    static async deleteExam(id, schoolId) {
        const where = { id };
        if (schoolId)
            where.schoolId = schoolId;
        const exam = await config_1.prisma.exam.findFirst({ where });
        if (!exam)
            throw new Error('Exam not found');
        return config_1.prisma.exam.delete({
            where: { id },
        });
    }
    static calculateGrade(percentage) {
        if (percentage >= 90)
            return 'A+';
        if (percentage >= 80)
            return 'A';
        if (percentage >= 70)
            return 'B';
        if (percentage >= 60)
            return 'C';
        if (percentage >= 50)
            return 'D';
        return 'F';
    }
    static async enterMarks(data) {
        const where = { id: data.examId };
        if (data.schoolId)
            where.schoolId = data.schoolId;
        const exam = await config_1.prisma.exam.findFirst({
            where,
        });
        if (!exam)
            throw new Error('Exam not found');
        const results = await Promise.all(data.marks.map((entry) => {
            const percentage = (entry.scoredMarks / exam.maxMarks) * 100;
            const grade = this.calculateGrade(percentage);
            return config_1.prisma.gradeRecord.upsert({
                where: {
                    studentId_examId_subject: {
                        studentId: entry.studentId,
                        examId: data.examId,
                        subject: exam.subject || 'General',
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
                    subject: exam.subject || 'General',
                    scoredMarks: entry.scoredMarks,
                    totalMarks: exam.maxMarks,
                    grade,
                    remarks: entry.remarks,
                },
            });
        }));
        return results;
    }
    static async publishResults(examId, schoolId) {
        const where = { id: examId };
        if (schoolId)
            where.schoolId = schoolId;
        const exam = await config_1.prisma.exam.findFirst({ where });
        if (!exam)
            throw new Error('Exam not found');
        return config_1.prisma.exam.update({
            where: { id: examId },
            data: {
                published: true,
                publishedAt: new Date(),
            },
        });
    }
    static async getMyResults(studentId, filters = {}) {
        const where = {
            studentId,
            exam: {
                published: true,
                ...(filters.term ? { term: filters.term } : {}),
            },
        };
        if (filters.schoolId) {
            where.exam.schoolId = filters.schoolId;
        }
        return config_1.prisma.gradeRecord.findMany({
            where,
            include: {
                exam: true,
            },
            orderBy: { exam: { examDate: 'desc' } },
        });
    }
}
exports.ExamService = ExamService;

import { Exam, Prisma } from '@prisma/client';
import { prisma } from '../../config';

export const createExam = async (data: Prisma.ExamCreateInput): Promise<Exam> => {
    return prisma.exam.create({
        data,
    });
};

export const findExamById = async (id: string): Promise<Exam | null> => {
    return prisma.exam.findUnique({
        where: { id },
        include: {
            class: true,
            section: true,
        },
    });
};

export const updateExam = async (id: string, data: Prisma.ExamUpdateInput): Promise<Exam> => {
    return prisma.exam.update({
        where: { id },
        data,
    });
};

export const deleteExam = async (id: string): Promise<Exam> => {
    return prisma.exam.delete({
        where: { id },
    });
};

export const findAllExams = async (params: {
    where?: Prisma.ExamWhereInput
}): Promise<Exam[]> => {
    const { where } = params;
    return prisma.exam.findMany({
        where,
        include: {
            class: true,
            section: true
        }
    });
};

import * as examRepository from './exam.repository';
import { Prisma } from '@prisma/client';
import { ApiError } from '../../utils/apiResponse';

export const createExam = async (data: Prisma.ExamCreateInput) => {
    return examRepository.createExam(data);
};

export const getExamById = async (id: string) => {
    const exam = await examRepository.findExamById(id);
    if (!exam) {
        throw new ApiError(404, 'Exam not found');
    }
    return exam;
};

export const updateExam = async (id: string, data: Prisma.ExamUpdateInput) => {
    const exam = await examRepository.findExamById(id);
    if (!exam) {
        throw new ApiError(404, 'Exam not found');
    }
    return examRepository.updateExam(id, data);
};

export const deleteExam = async (id: string) => {
    const exam = await examRepository.findExamById(id);
    if (!exam) {
        throw new ApiError(404, 'Exam not found');
    }
    return examRepository.deleteExam(id);
};

export const getAllExams = async (filters: any = {}) => {
    return examRepository.findAllExams({ where: filters });
};

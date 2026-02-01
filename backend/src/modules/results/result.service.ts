import * as resultRepository from './result.repository';
import { Prisma } from '@prisma/client';
import { ApiError } from '../../utils/apiResponse';

export const createResult = async (data: Prisma.GradeRecordCreateInput) => {
    return resultRepository.createResult(data);
};

export const getResultById = async (id: string) => {
    const result = await resultRepository.findResultById(id);
    if (!result) {
        throw new ApiError(404, 'Result not found');
    }
    return result;
};

export const updateResult = async (id: string, data: Prisma.GradeRecordUpdateInput) => {
    const result = await resultRepository.findResultById(id);
    if (!result) {
        throw new ApiError(404, 'Result not found');
    }
    return resultRepository.updateResult(id, data);
};

export const deleteResult = async (id: string) => {
    const result = await resultRepository.findResultById(id);
    if (!result) {
        throw new ApiError(404, 'Result not found');
    }
    return resultRepository.deleteResult(id);
};

export const getAllResults = async (filters: any = {}) => {
    return resultRepository.findAllResults({ where: filters });
};

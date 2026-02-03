import * as resultRepository from './result.repository';
import { Prisma } from '@prisma/client';
import { ApiError } from '../../utils/apiResponse';
import { AuditLogService } from '../platform/audit.service';

export const createResult = async (data: Prisma.GradeRecordCreateInput) => {
    const result = await resultRepository.createResult(data);

    await AuditLogService.log({
        action: 'CREATE_RESULT',
        module: 'RESULTS',
        userId: result.studentId,
        schoolId: (data as any).schoolId,
        details: { resultId: result.id }
    });

    return result;
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

export const deleteResult = async (id: string, schoolId?: string) => {
    const result = await resultRepository.findResultById(id);
    if (!result) {
        throw new ApiError(404, 'Result not found');
    }
    const deleted = await resultRepository.deleteResult(id);

    await AuditLogService.log({
        action: 'DELETE_RESULT',
        module: 'RESULTS',
        userId: result.studentId,
        schoolId,
        details: { resultId: id }
    });

    return deleted;
};

export const getAllResults = async (filters: any = {}) => {
    return resultRepository.findAllResults({ where: filters });
};

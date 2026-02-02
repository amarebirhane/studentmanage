import * as feeRepository from './fee.repository';
import { Prisma } from '@prisma/client';
import { ApiError } from '../../utils/apiResponse';

export const createFeeInvoice = async (data: any, schoolId?: string) => {
    return feeRepository.createFeeInvoice({
        ...data,
        school: schoolId ? { connect: { id: schoolId } } : undefined
    });
};

export const getFeeInvoiceById = async (id: string) => {
    const feeInvoice = await feeRepository.findFeeInvoiceById(id);
    if (!feeInvoice) {
        throw new ApiError(404, 'Fee invoice not found');
    }
    return feeInvoice;
};

export const updateFeeInvoice = async (id: string, data: any, schoolId?: string) => {
    const feeInvoice = await feeRepository.findFeeInvoiceById(id);
    if (!feeInvoice || (schoolId && feeInvoice.schoolId !== schoolId)) {
        throw new ApiError(404, 'Fee invoice not found');
    }
    return feeRepository.updateFeeInvoice(id, data);
};

export const deleteFeeInvoice = async (id: string) => {
    const feeInvoice = await feeRepository.findFeeInvoiceById(id);
    if (!feeInvoice) {
        throw new ApiError(404, 'Fee invoice not found');
    }
    return feeRepository.deleteFeeInvoice(id);
};

export const getAllFeeInvoices = async (filters: any = {}, schoolId?: string, userId?: string, role?: string) => {
    const where: any = { ...filters };

    if (schoolId) where.schoolId = schoolId;

    // Role-based filtering
    if (role === 'STUDENT' && userId) {
        where.student = { userId };
    } else if (role === 'PARENT' && userId) {
        where.student = { parentProfiles: { some: { userId } } };
    }

    return feeRepository.findAllFeeInvoices({ where });
};

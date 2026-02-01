import * as feeRepository from './fee.repository';
import { Prisma } from '@prisma/client';
import { ApiError } from '../../utils/apiResponse';

export const createFeeInvoice = async (data: Prisma.FeeInvoiceCreateInput) => {
    return feeRepository.createFeeInvoice(data);
};

export const getFeeInvoiceById = async (id: string) => {
    const feeInvoice = await feeRepository.findFeeInvoiceById(id);
    if (!feeInvoice) {
        throw new ApiError(404, 'Fee invoice not found');
    }
    return feeInvoice;
};

export const updateFeeInvoice = async (id: string, data: Prisma.FeeInvoiceUpdateInput) => {
    const feeInvoice = await feeRepository.findFeeInvoiceById(id);
    if (!feeInvoice) {
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

export const getAllFeeInvoices = async (filters: any = {}) => {
    return feeRepository.findAllFeeInvoices({ where: filters });
};

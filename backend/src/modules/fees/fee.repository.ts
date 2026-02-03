import { FeeInvoice, Prisma } from '@prisma/client';
import { prisma } from '../../config';

export const createFeeInvoice = async (data: Prisma.FeeInvoiceCreateInput): Promise<FeeInvoice> => {
    return prisma.feeInvoice.create({
        data,
    });
};

export const findFeeInvoiceById = async (id: string): Promise<FeeInvoice | null> => {
    return prisma.feeInvoice.findFirst({
        where: { id, deletedAt: null },
        include: {
            student: {
                include: {
                    user: true
                }
            },
            payments: true,
        },
    });
};

export const updateFeeInvoice = async (id: string, data: Prisma.FeeInvoiceUpdateInput): Promise<FeeInvoice> => {
    return prisma.feeInvoice.update({
        where: { id },
        data,
    });
};

export const deleteFeeInvoice = async (id: string): Promise<FeeInvoice> => {
    return prisma.feeInvoice.update({
        where: { id },
        data: { deletedAt: new Date() }
    });
};

export const findAllFeeInvoices = async (params: {
    where?: Prisma.FeeInvoiceWhereInput
}): Promise<FeeInvoice[]> => {
    const { where } = params;
    return prisma.feeInvoice.findMany({
        where: { ...where, deletedAt: null },
        include: {
            student: {
                include: {
                    user: true
                }
            },
            payments: true
        }
    });
};

export const createFeePayment = async (data: Prisma.FeePaymentCreateInput) => {
    return prisma.feePayment.create({
        data,
    });
};

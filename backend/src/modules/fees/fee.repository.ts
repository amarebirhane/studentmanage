import { PrismaClient, FeeInvoice, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const createFeeInvoice = async (data: Prisma.FeeInvoiceCreateInput): Promise<FeeInvoice> => {
    return prisma.feeInvoice.create({
        data,
    });
};

export const findFeeInvoiceById = async (id: string): Promise<FeeInvoice | null> => {
    return prisma.feeInvoice.findUnique({
        where: { id },
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
    return prisma.feeInvoice.delete({
        where: { id },
    });
};

export const findAllFeeInvoices = async (params: {
    where?: Prisma.FeeInvoiceWhereInput
}): Promise<FeeInvoice[]> => {
    const { where } = params;
    return prisma.feeInvoice.findMany({
        where,
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

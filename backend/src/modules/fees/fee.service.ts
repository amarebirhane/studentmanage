import * as feeRepository from './fee.repository';
import { Prisma } from '@prisma/client';
import { ApiError } from '../../utils/apiResponse';
import { AuditLogService } from '../platform/audit.service';

export const createFeeInvoice = async (data: any, schoolId?: string) => {
    const invoice = await feeRepository.createFeeInvoice({
        ...data,
        discount: data.discount || 0,
        scholarship: data.scholarship || 0,
        school: schoolId ? { connect: { id: schoolId } } : undefined
    });

    await AuditLogService.log({
        action: 'CREATE_FEE_INVOICE',
        module: 'FEES',
        userId: invoice.studentId, // Or appropriate user
        schoolId,
        details: { invoiceId: invoice.id }
    });

    return invoice;
};

export const applyDiscountAndScholarship = async (id: string, data: { discount?: number, scholarship?: number }, schoolId?: string) => {
    const feeInvoice = await feeRepository.findFeeInvoiceById(id);
    if (!feeInvoice || (schoolId && (feeInvoice as any).schoolId !== schoolId)) {
        throw new ApiError(404, 'Fee invoice not found');
    }
    return feeRepository.updateFeeInvoice(id, data);
};

export const getFeeInvoiceById = async (id: string, schoolId?: string) => {
    const feeInvoice = await feeRepository.findFeeInvoiceById(id);
    if (!feeInvoice || (schoolId && (feeInvoice as any).schoolId !== schoolId)) {
        throw new ApiError(404, 'Fee invoice not found');
    }
    return feeInvoice;
};

export const updateFeeInvoice = async (id: string, data: any, schoolId?: string) => {
    const feeInvoice = await feeRepository.findFeeInvoiceById(id);
    if (!feeInvoice || (schoolId && (feeInvoice as any).schoolId !== schoolId)) {
        throw new ApiError(404, 'Fee invoice not found');
    }
    return feeRepository.updateFeeInvoice(id, data);
};

export const deleteFeeInvoice = async (id: string, schoolId?: string) => {
    const feeInvoice = await feeRepository.findFeeInvoiceById(id);
    if (!feeInvoice || (schoolId && (feeInvoice as any).schoolId !== schoolId)) {
        throw new ApiError(404, 'Fee invoice not found');
    }
    const deleted = await feeRepository.deleteFeeInvoice(id);

    await AuditLogService.log({
        action: 'DELETE_FEE_INVOICE',
        module: 'FEES',
        userId: (feeInvoice as any).studentId,
        schoolId,
        details: { invoiceId: id }
    });

    return deleted;
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

export const recordPayment = async (invoiceId: string, data: { amount: number, method?: string, reference?: string }, schoolId?: string) => {
    const invoice = await feeRepository.findFeeInvoiceById(invoiceId);
    if (!invoice || (schoolId && (invoice as any).schoolId !== schoolId)) {
        throw new ApiError(404, 'Fee invoice not found');
    }

    const payment = await feeRepository.createFeePayment({
        invoice: { connect: { id: invoiceId } },
        amount: data.amount,
        method: data.method,
        reference: data.reference,
        school: schoolId ? { connect: { id: schoolId } } : undefined
    });

    // Check if invoice is fully paid
    const allPayments = await prisma.feePayment.aggregate({
        where: { invoiceId, deletedAt: null },
        _sum: { amount: true }
    });

    const totalPaid = allPayments._sum.amount || 0;
    if (totalPaid >= invoice.amount) {
        await feeRepository.updateFeeInvoice(invoiceId, { status: 'PAID' });
    }

    await AuditLogService.log({
        action: 'RECORD_PAYMENT',
        module: 'FEES',
        userId: invoice.studentId,
        schoolId,
        details: { paymentId: payment.id, invoiceId }
    });

    return payment;
};

import { prisma } from '../../config';

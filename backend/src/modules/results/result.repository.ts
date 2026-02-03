import { GradeRecord, Prisma } from '@prisma/client';
import { prisma } from '../../config';
import { AuditLogService } from '../platform/audit.service';

export const createResult = async (data: Prisma.GradeRecordCreateInput): Promise<GradeRecord> => {
    const result = await prisma.gradeRecord.create({
        data,
    });
    return result;
};

export const findResultById = async (id: string): Promise<GradeRecord | null> => {
    return prisma.gradeRecord.findFirst({
        where: { id, deletedAt: null },
        include: {
            student: {
                include: {
                    user: true
                }
            },
            exam: true,
        },
    });
};

export const updateResult = async (id: string, data: Prisma.GradeRecordUpdateInput): Promise<GradeRecord> => {
    return prisma.gradeRecord.update({
        where: { id },
        data,
    });
};

export const deleteResult = async (id: string): Promise<GradeRecord> => {
    return prisma.gradeRecord.update({
        where: { id },
        data: { deletedAt: new Date() }
    });
};

export const findAllResults = async (params: {
    where?: Prisma.GradeRecordWhereInput
}): Promise<GradeRecord[]> => {
    const { where } = params;
    return prisma.gradeRecord.findMany({
        where: { ...where, deletedAt: null },
        include: {
            student: {
                include: {
                    user: true
                }
            },
            exam: true
        }
    });
};

import { PrismaClient, GradeRecord, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const createResult = async (data: Prisma.GradeRecordCreateInput): Promise<GradeRecord> => {
    return prisma.gradeRecord.create({
        data,
    });
};

export const findResultById = async (id: string): Promise<GradeRecord | null> => {
    return prisma.gradeRecord.findUnique({
        where: { id },
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
    return prisma.gradeRecord.delete({
        where: { id },
    });
};

export const findAllResults = async (params: {
    where?: Prisma.GradeRecordWhereInput
}): Promise<GradeRecord[]> => {
    const { where } = params;
    return prisma.gradeRecord.findMany({
        where,
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

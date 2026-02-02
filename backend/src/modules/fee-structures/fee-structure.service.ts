import { prisma } from '../../config';

export class FeeStructureService {
    static async createFeeStructure(data: {
        name: string;
        category: string;
        amount: number;
        frequency: string;
        classId?: string;
        schoolId: string;
    }) {
        return prisma.feeStructure.create({
            data,
            include: {
                class: true,
                school: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }

    static async getAllFeeStructures(schoolId?: string, classId?: string) {
        const where: any = {};
        if (schoolId) where.schoolId = schoolId;
        if (classId) where.classId = classId;
        where.isActive = true;

        return prisma.feeStructure.findMany({
            where,
            include: {
                class: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    static async getFeeStructureById(id: string) {
        const feeStructure = await prisma.feeStructure.findUnique({
            where: { id },
            include: {
                class: true,
                school: true,
            },
        });

        if (!feeStructure) {
            throw new Error('Fee structure not found');
        }

        return feeStructure;
    }

    static async updateFeeStructure(id: string, data: any, schoolId?: string) {
        const existing = await prisma.feeStructure.findUnique({ where: { id } });

        if (!existing || (schoolId && existing.schoolId !== schoolId)) {
            throw new Error('Fee structure not found or unauthorized');
        }

        return prisma.feeStructure.update({
            where: { id },
            data,
            include: {
                class: true,
            },
        });
    }

    static async deleteFeeStructure(id: string, schoolId?: string) {
        const existing = await prisma.feeStructure.findUnique({ where: { id } });

        if (!existing || (schoolId && existing.schoolId !== schoolId)) {
            throw new Error('Fee structure not found or unauthorized');
        }

        // Soft delete by marking as inactive
        return prisma.feeStructure.update({
            where: { id },
            data: { isActive: false },
        });
    }

    static async bulkGenerateInvoices(data: {
        feeStructureId: string;
        studentIds: string[];
        dueDate: Date;
        schoolId?: string;
    }) {
        const feeStructure = await this.getFeeStructureById(data.feeStructureId);

        if (data.schoolId && feeStructure.schoolId !== data.schoolId) {
            throw new Error('Unauthorized');
        }

        const invoices = await Promise.all(
            data.studentIds.map((studentId) =>
                prisma.feeInvoice.create({
                    data: {
                        studentId,
                        amount: feeStructure.amount,
                        dueDate: data.dueDate,
                        description: `${feeStructure.name} - ${feeStructure.frequency}`,
                        schoolId: data.schoolId,
                    },
                })
            )
        );

        return invoices;
    }
}

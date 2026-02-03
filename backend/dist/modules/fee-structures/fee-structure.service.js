"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeeStructureService = void 0;
const config_1 = require("../../config");
class FeeStructureService {
    static async createFeeStructure(data) {
        return config_1.prisma.feeStructure.create({
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
    static async getAllFeeStructures(schoolId, classId) {
        const where = {};
        if (schoolId)
            where.schoolId = schoolId;
        if (classId)
            where.classId = classId;
        where.isActive = true;
        return config_1.prisma.feeStructure.findMany({
            where,
            include: {
                class: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    static async getFeeStructureById(id, schoolId) {
        const where = { id };
        if (schoolId)
            where.schoolId = schoolId;
        const feeStructure = await config_1.prisma.feeStructure.findFirst({
            where,
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
    static async updateFeeStructure(id, data, schoolId) {
        const existing = await config_1.prisma.feeStructure.findUnique({ where: { id } });
        if (!existing || (schoolId && existing.schoolId !== schoolId)) {
            throw new Error('Fee structure not found or unauthorized');
        }
        return config_1.prisma.feeStructure.update({
            where: { id },
            data,
            include: {
                class: true,
            },
        });
    }
    static async deleteFeeStructure(id, schoolId) {
        const existing = await config_1.prisma.feeStructure.findUnique({ where: { id } });
        if (!existing || (schoolId && existing.schoolId !== schoolId)) {
            throw new Error('Fee structure not found or unauthorized');
        }
        // Soft delete by marking as inactive
        return config_1.prisma.feeStructure.update({
            where: { id },
            data: { isActive: false },
        });
    }
    static async bulkGenerateInvoices(data) {
        const feeStructure = await this.getFeeStructureById(data.feeStructureId);
        if (data.schoolId && feeStructure.schoolId !== data.schoolId) {
            throw new Error('Unauthorized');
        }
        const invoices = await Promise.all(data.studentIds.map((studentId) => config_1.prisma.feeInvoice.create({
            data: {
                studentId,
                amount: feeStructure.amount,
                dueDate: data.dueDate,
                description: `${feeStructure.name} - ${feeStructure.frequency}`,
                schoolId: data.schoolId,
            },
        })));
        return invoices;
    }
}
exports.FeeStructureService = FeeStructureService;

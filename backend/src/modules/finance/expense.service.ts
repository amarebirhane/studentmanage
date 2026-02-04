import { prisma } from '../../config';
import { ApiError } from '../../middlewares/error.middleware';

export class ExpenseService {
    static async createExpense(data: {
        amount: number;
        category: string;
        description?: string;
        date: string;
        recordedById: string;
        schoolId: string;
        receiptUrl?: string;
    }) {
        return prisma.expense.create({
            data: {
                amount: data.amount,
                category: data.category,
                description: data.description,
                date: new Date(data.date),
                recordedById: data.recordedById,
                schoolId: data.schoolId,
                receiptUrl: data.receiptUrl,
                status: 'APPROVED' // Auto-approve for admins for now
            },
            include: {
                recordedBy: {
                    select: { firstName: true, lastName: true }
                }
            }
        });
    }

    static async getExpenses(schoolId: string, filters?: any) {
        const where: any = { schoolId };

        if (filters?.startDate && filters?.endDate) {
            where.date = {
                gte: new Date(filters.startDate),
                lte: new Date(filters.endDate)
            };
        }

        if (filters?.category && filters.category !== 'ALL') {
            where.category = filters.category;
        }

        return prisma.expense.findMany({
            where,
            orderBy: { date: 'desc' },
            include: {
                recordedBy: {
                    select: { firstName: true, lastName: true }
                }
            }
        });
    }

    static async updateExpense(id: string, data: any) {
        const expense = await prisma.expense.findUnique({ where: { id } });
        if (!expense) throw new ApiError(404, 'Expense not found');

        return prisma.expense.update({
            where: { id },
            data: {
                ...data,
                date: data.date ? new Date(data.date) : undefined
            }
        });
    }

    static async deleteExpense(id: string) {
        return prisma.expense.delete({ where: { id } });
    }

    static async getSummary(schoolId: string) {
        // Current Month
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const totalExpenses = await prisma.expense.aggregate({
            where: { schoolId },
            _sum: { amount: true }
        });

        const monthlyExpenses = await prisma.expense.aggregate({
            where: {
                schoolId,
                date: {
                    gte: firstDay,
                    lte: lastDay
                }
            },
            _sum: { amount: true }
        });

        const byCategory = await prisma.expense.groupBy({
            by: ['category'],
            where: { schoolId },
            _sum: { amount: true }
        });

        return {
            total: totalExpenses._sum.amount || 0,
            thisMonth: monthlyExpenses._sum.amount || 0,
            byCategory
        };
    }
}

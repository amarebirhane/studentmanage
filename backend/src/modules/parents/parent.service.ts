import { prisma } from '../../config';
import { hashPassword } from '../../utils/password';

export class ParentService {
    static async getParents() {
        return prisma.user.findMany({
            where: { role: 'PARENT' },
            include: {
                parentProfiles: {
                    include: {
                        student: {
                            include: {
                                user: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    static async getParentById(id: string) {
        const parent = await prisma.user.findFirst({
            where: { id, role: 'PARENT' },
            include: {
                parentProfiles: {
                    include: {
                        student: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
        });

        if (!parent) {
            throw new Error('Parent not found');
        }

        return parent;
    }

    static async createParent(data: any) {
        const { firstName, lastName, email, password, phone, studentIds, relationship } = data;

        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) {
            throw new Error('User with this email already exists');
        }

        const hashedPassword = await hashPassword(password || 'Parent@123');

        return await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword,
                    role: 'PARENT',
                    phone,
                },
            });

            if (studentIds && Array.isArray(studentIds)) {
                for (const studentId of studentIds) {
                    await tx.parentProfile.create({
                        data: {
                            userId: user.id,
                            studentId,
                            relationship: relationship || 'Parent',
                        },
                    });
                }
            }

            return tx.user.findUnique({
                where: { id: user.id },
                include: { parentProfiles: true },
            });
        });
    }

    static async updateParent(id: string, data: any) {
        const { firstName, lastName, phone, email, studentIds, relationship } = data;

        const parent = await prisma.user.findFirst({ where: { id, role: 'PARENT' } });
        if (!parent) {
            throw new Error('Parent not found');
        }

        return await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id },
                data: { firstName, lastName, phone, email },
            });

            if (studentIds && Array.isArray(studentIds)) {
                // Remove old associations
                await tx.parentProfile.deleteMany({ where: { userId: id } });

                // Add new associations
                for (const studentId of studentIds) {
                    await tx.parentProfile.create({
                        data: {
                            userId: id,
                            studentId,
                            relationship: relationship || 'Parent',
                        },
                    });
                }
            }

            return tx.user.findUnique({
                where: { id },
                include: { parentProfiles: true },
            });
        });
    }

    static async deleteParent(id: string) {
        const parent = await prisma.user.findFirst({ where: { id, role: 'PARENT' } });
        if (!parent) {
            throw new Error('Parent not found');
        }

        return await prisma.$transaction(async (tx) => {
            await tx.parentProfile.deleteMany({ where: { userId: id } });
            await tx.user.delete({ where: { id } });
        });
    }

    static async getFinancialSummary(userId: string) {
        // 1. Get all students for this parent
        const parent = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                parentProfiles: {
                    select: { studentId: true }
                }
            }
        });

        if (!parent) throw new Error('Parent not found');

        const studentIds = parent.parentProfiles.map(p => p.studentId);

        // 2. Fetch all invoices for these students
        const invoices = await prisma.feeInvoice.findMany({
            where: {
                studentId: { in: studentIds }
            },
            include: {
                student: {
                    include: {
                        user: { select: { firstName: true, lastName: true } }
                    }
                }
            },
            orderBy: { dueDate: 'asc' }
        });

        // 3. Group by status
        const history = invoices.filter(inv => inv.status === 'PAID');
        const due = invoices.filter(inv => inv.status === 'PENDING' || inv.status === 'OVERDUE');

        // 4. Calculate totals
        const totalPaid = history.reduce((sum, inv) => sum + inv.amount, 0);
        const totalDue = due.reduce((sum, inv) => sum + inv.amount, 0);

        return {
            totalPaid,
            totalDue,
            history,
            dueAlerts: due.map(inv => ({
                id: inv.id,
                studentName: `${inv.student.user.firstName} ${inv.student.user.lastName}`,
                amount: inv.amount,
                dueDate: inv.dueDate,
                status: inv.status,
                description: inv.description
            }))
        };
    }
}

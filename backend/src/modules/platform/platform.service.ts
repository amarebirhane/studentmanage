import { prisma } from '../../config';
import { UserRole } from '@prisma/client';
import { hashPassword } from '../../utils/password';

export class PlatformService {
    /**
     * Get global system analytics
     */
    static async getGlobalStats() {
        const [
            schoolCount,
            userCount,
            studentCount,
            teacherCount,
            revenue,
            recentSchools
        ] = await Promise.all([
            prisma.school.count(),
            prisma.user.count(),
            prisma.studentProfile.count(),
            prisma.teacherProfile.count(),
            prisma.feeInvoice.aggregate({
                _sum: { amount: true },
                where: { status: 'PAID' }
            }),
            prisma.school.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: { students: true }
                    }
                }
            })
        ]);

        return {
            schools: schoolCount,
            users: userCount,
            students: studentCount,
            teachers: teacherCount,
            totalRevenue: revenue._sum.amount || 0,
            recentSchools: recentSchools.map(s => ({
                id: s.id,
                name: s.name,
                students: s._count.students,
                createdAt: s.createdAt
            }))
        };
    }

    /**
     * Assign a user as School Admin
     */
    static async assignSchoolAdmin(data: {
        userId?: string;
        email?: string;
        schoolId: string;
    }) {
        const school = await prisma.school.findUnique({ where: { id: data.schoolId } });
        if (!school) throw new Error('School not found');

        let user;
        if (data.userId) {
            user = await prisma.user.findUnique({ where: { id: data.userId } });
        } else if (data.email) {
            user = await prisma.user.findUnique({ where: { email: data.email } });
        }

        if (!user) throw new Error('User not found');

        // Update user role and school
        return prisma.user.update({
            where: { id: user.id },
            data: {
                role: UserRole.ADMIN,
                schoolId: data.schoolId
            }
        });
    }

    /**
     * Get list of all schools with admin details
     */
    static async getAllSchools() {
        return prisma.school.findMany({
            include: {
                _count: {
                    select: { students: true, teachers: true }
                }
            }
        });
    }

    /**
     * Get all school administrators
     */
    static async getAllAdmins() {
        const admins = await prisma.user.findMany({
            where: {
                role: 'ADMIN',
                deletedAt: null
            },
            include: {
                school: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return admins.map(admin => ({
            id: admin.id,
            name: `${admin.firstName} ${admin.lastName}`,
            email: admin.email,
            phone: admin.phone || 'N/A',
            school: admin.school?.name || 'Unassigned',
            status: 'Active' // We can expand this later
        }));
    }
}

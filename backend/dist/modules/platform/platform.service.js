"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformService = void 0;
const config_1 = require("../../config");
const client_1 = require("@prisma/client");
class PlatformService {
    /**
     * Get global system analytics
     */
    static async getGlobalStats() {
        const [schoolCount, userCount, studentCount, teacherCount, revenue] = await Promise.all([
            config_1.prisma.school.count(),
            config_1.prisma.user.count(),
            config_1.prisma.studentProfile.count(),
            config_1.prisma.teacherProfile.count(),
            config_1.prisma.feeInvoice.aggregate({
                _sum: { amount: true },
                where: { status: 'PAID' }
            })
        ]);
        return {
            schools: schoolCount,
            users: userCount,
            students: studentCount,
            teachers: teacherCount,
            totalRevenue: revenue._sum.amount || 0
        };
    }
    /**
     * Assign a user as School Admin
     */
    static async assignSchoolAdmin(data) {
        const school = await config_1.prisma.school.findUnique({ where: { id: data.schoolId } });
        if (!school)
            throw new Error('School not found');
        let user;
        if (data.userId) {
            user = await config_1.prisma.user.findUnique({ where: { id: data.userId } });
        }
        else if (data.email) {
            user = await config_1.prisma.user.findUnique({ where: { email: data.email } });
        }
        if (!user)
            throw new Error('User not found');
        // Update user role and school
        return config_1.prisma.user.update({
            where: { id: user.id },
            data: {
                role: client_1.UserRole.ADMIN,
                schoolId: data.schoolId
            }
        });
    }
    /**
     * Get list of all schools with admin details
     */
    static async getAllSchools() {
        return config_1.prisma.school.findMany({
            include: {
                _count: {
                    select: { students: true, teachers: true }
                }
            }
        });
    }
}
exports.PlatformService = PlatformService;

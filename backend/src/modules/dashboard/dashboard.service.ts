import { prisma } from '../../config';

export class DashboardService {
    static async getSuperAdminDashboard() {
        const [
            schools,
            users,
            revenue,
            activeSubscriptions,
            recentLogs
        ] = await Promise.all([
            prisma.school.count(),
            prisma.user.count({ where: { deletedAt: null } }),
            prisma.feeInvoice.aggregate({
                _sum: { amount: true },
                where: { status: 'PAID' }
            }),
            prisma.school.count({ where: { status: 'ACTIVE' } }),
            prisma.activityLog.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { firstName: true, lastName: true, email: true } } }
            })
        ]);

        return {
            stats: {
                totalSchools: schools,
                totalUsers: users,
                totalRevenue: revenue._sum.amount || 0,
                activeSchools: activeSubscriptions,
            },
            recentActivity: recentLogs
        };
    }

    static async getSchoolAdminDashboard(schoolId: string) {
        const [
            students,
            teachers,
            classes,
            revenue,
            pendingFees,
            attendanceToday
        ] = await Promise.all([
            prisma.studentProfile.count({ where: { schoolId, deletedAt: null } }),
            prisma.teacherProfile.count({ where: { schoolId, deletedAt: null } }),
            prisma.class.count({ where: { schoolId, deletedAt: null } }),
            prisma.feeInvoice.aggregate({
                _sum: { amount: true },
                where: { schoolId, status: 'PAID' }
            }),
            prisma.feeInvoice.count({ where: { schoolId, status: 'PENDING' } }),
            prisma.attendanceRecord.count({
                where: {
                    schoolId,
                    date: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        lt: new Date(new Date().setHours(23, 59, 59, 999))
                    }
                }
            })
        ]);

        return {
            stats: {
                totalStudents: students,
                totalTeachers: teachers,
                totalClasses: classes,
                totalRevenue: revenue._sum.amount || 0,
                pendingFeesCount: pendingFees,
                todayAttendance: attendanceToday
            }
        };
    }

    static async getTeacherDashboard(teacherId: string, schoolId: string) {
        const [
            classes,
            subjects,
            assignments,
            upcomingExams
        ] = await Promise.all([
            prisma.section.count({ where: { teacherId, deletedAt: null } }),
            prisma.subject.count({ where: { teacherId, deletedAt: null } }),
            prisma.assignment.count({ where: { teacherId, deletedAt: null } }),
            prisma.exam.findMany({
                where: {
                    schoolId,
                    deletedAt: null,
                    examDate: { gte: new Date() }
                },
                take: 5,
                orderBy: { examDate: 'asc' },
                include: { subject: true, class: true }
            })
        ]);

        return {
            stats: {
                managedClasses: classes,
                taughtSubjects: subjects,
                activeAssignments: assignments
            },
            upcomingExams
        };
    }

    static async getStudentDashboard(studentId: string, schoolId: string) {
        const [
            attendance,
            assignments,
            recentGrades,
            timetable
        ] = await Promise.all([
            prisma.attendanceRecord.findMany({
                where: { studentId, schoolId },
                take: 30,
                orderBy: { date: 'desc' }
            }),
            prisma.assignment.findMany({
                where: {
                    schoolId,
                    deletedAt: null,
                    OR: [
                        { class: { students: { some: { id: studentId } } } },
                        { section: { students: { some: { id: studentId } } } }
                    ]
                },
                take: 5,
                orderBy: { dueDate: 'asc' }
            }),
            prisma.gradeRecord.findMany({
                where: { studentId },
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { exam: { include: { subject: true } } }
            }),
            prisma.timetableEntry.findMany({
                where: {
                    schoolId,
                    deletedAt: null,
                    OR: [
                        { class: { students: { some: { id: studentId } } } }
                    ]
                },
                include: { subject: true, teacher: { include: { user: true } } }
            })
        ]);

        return {
            attendanceOverview: {
                total: attendance.length,
                present: attendance.filter(a => a.status === 'PRESENT').length
            },
            upcomingAssignments: assignments,
            recentGrades,
            timetable
        };
    }

    static async getParentDashboard(userId: string, schoolId: string) {
        const children = await prisma.studentProfile.findMany({
            where: {
                schoolId,
                parentProfiles: { some: { userId } },
                deletedAt: null
            },
            include: {
                user: { select: { firstName: true, lastName: true } },
                class: true,
                section: true
            }
        });

        // Get brief stats for each child
        const childrenData = await Promise.all(children.map(async (child) => {
            const [attendance, grades] = await Promise.all([
                prisma.attendanceRecord.count({
                    where: { studentId: child.id, status: 'ABSENT' }
                }),
                prisma.gradeRecord.findMany({
                    where: { studentId: child.id },
                    take: 3,
                    orderBy: { createdAt: 'desc' },
                    include: { exam: { include: { subject: true } } }
                })
            ]);

            return {
                id: child.id,
                name: `${child.user.firstName} ${child.user.lastName}`,
                class: child.class?.name,
                section: child.section?.name,
                absentCount: attendance,
                recentGrades: grades
            };
        }));

        return {
            children: childrenData
        };
    }
}

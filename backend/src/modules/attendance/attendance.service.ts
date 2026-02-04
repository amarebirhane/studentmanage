import { prisma } from '../../config';
import { AttendanceStatus } from '@prisma/client';
import { AuditLogService } from '../platform/audit.service';

export class AttendanceService {
    /**
     * Mark attendance for a single student
     */
    static async markAttendance(data: {
        studentId: string;
        date: Date;
        periodNumber?: number;
        status: AttendanceStatus;
        remarks?: string;
        recordedById: string;
        schoolId?: string;
    }) {
        // Check for existing record
        const existing = await prisma.attendanceRecord.findFirst({
            where: {
                studentId: data.studentId,
                date: data.date,
                periodNumber: data.periodNumber || null,
            },
        });

        if (existing) {
            // Update existing record
            const updated = await prisma.attendanceRecord.update({
                where: { id: existing.id },
                data: {
                    status: data.status,
                    remarks: data.remarks,
                    recordedById: data.recordedById,
                },
            });
            return updated;
        }

        // Create new record
        const record = await prisma.attendanceRecord.create({
            data: {
                ...data,
                date: data.date,
            },
        });

        await AuditLogService.log({
            action: 'MARK_ATTENDANCE',
            module: 'ATTENDANCE',
            userId: data.recordedById,
            schoolId: data.schoolId,
            details: { studentId: data.studentId, date: data.date, status: data.status }
        });

        return record;
    }

    /**
     * Bulk mark attendance for entire class/section
     */
    static async bulkMarkAttendance(data: {
        date: Date;
        periodNumber?: number;
        sectionId: string;
        records: Array<{
            studentId: string;
            status: AttendanceStatus;
            remarks?: string;
        }>;
        recordedById: string;
        schoolId?: string;
    }) {
        const results = await Promise.all(
            data.records.map((record) =>
                this.markAttendance({
                    studentId: record.studentId,
                    date: data.date,
                    periodNumber: data.periodNumber,
                    status: record.status,
                    remarks: record.remarks,
                    recordedById: data.recordedById,
                    schoolId: data.schoolId,
                })
            )
        );

        return {
            totalRecords: results.length,
            records: results,
        };
    }

    /**
     * Get attendance records with filters
     */
    static async getAttendance(filters: {
        studentId?: string;
        sectionId?: string;
        classId?: string;
        dateFrom?: Date;
        dateTo?: Date;
        periodNumber?: number;
        schoolId?: string;
        userId?: string;
        role?: string;
    }) {
        const where: any = {};

        if (filters.schoolId) where.schoolId = filters.schoolId;
        if (filters.periodNumber !== undefined) where.periodNumber = filters.periodNumber;

        // Date range filter
        if (filters.dateFrom || filters.dateTo) {
            where.date = {};
            if (filters.dateFrom) where.date.gte = filters.dateFrom;
            if (filters.dateTo) where.date.lte = filters.dateTo;
        }

        // Role-based filtering
        if (filters.role === 'STUDENT' && filters.userId) {
            where.student = { userId: filters.userId };
        } else if (filters.role === 'PARENT' && filters.userId) {
            where.student = { parentProfiles: { some: { userId: filters.userId } } };
        } else if (filters.role === 'TEACHER' && filters.sectionId) {
            where.student = { sectionId: filters.sectionId };
        }

        // Direct filters
        if (filters.studentId) where.studentId = filters.studentId;
        if (filters.sectionId) where.student = { ...where.student, sectionId: filters.sectionId };
        if (filters.classId) where.student = { ...where.student, classId: filters.classId };

        return prisma.attendanceRecord.findMany({
            where,
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
                recordedBy: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: [{ date: 'desc' }, { periodNumber: 'asc' }],
        });
    }

    /**
     * Get attendance summary for a student
     */
    static async getAttendanceSummary(studentId: string, filters?: {
        dateFrom?: Date;
        dateTo?: Date;
        periodNumber?: number;
    }) {
        const where: any = { studentId };

        if (filters) {
            if (filters.dateFrom || filters.dateTo) {
                where.date = {};
                if (filters.dateFrom) where.date.gte = filters.dateFrom;
                if (filters.dateTo) where.date.lte = filters.dateTo;
            }
            if (filters.periodNumber !== undefined) where.periodNumber = filters.periodNumber;
        }

        const [records, recent] = await Promise.all([
            prisma.attendanceRecord.findMany({ where }),
            prisma.attendanceRecord.findMany({
                where: { studentId },
                orderBy: { date: 'desc' },
                take: 5,
            })
        ]);

        const summary = {
            total: records.length,
            totalRecords: records.length,
            present: records.filter((r) => r.status === 'PRESENT').length,
            absent: records.filter((r) => r.status === 'ABSENT').length,
            late: records.filter((r) => r.status === 'LATE').length,
            excused: records.filter((r) => r.status === 'EXCUSED').length,
            percentage: 0,
            recent,
        };

        if (summary.total > 0) {
            summary.percentage = Math.round((summary.present / summary.total) * 100);
        }

        return summary;
    }

    /**
     * Get daily attendance report for a class/section
     */
    static async getDailyReport(data: {
        date: Date;
        sectionId?: string;
        classId?: string;
        periodNumber?: number;
        schoolId?: string;
    }) {
        // Get all students in the section/class
        const studentWhere: any = {};
        if (data.sectionId) studentWhere.sectionId = data.sectionId;
        if (data.classId) studentWhere.classId = data.classId;
        if (data.schoolId) studentWhere.schoolId = data.schoolId;

        const students = await prisma.studentProfile.findMany({
            where: studentWhere,
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        // Get attendance records for the date
        const attendanceWhere: any = {
            date: data.date,
            periodNumber: data.periodNumber || null,
            studentId: {
                in: students.map((s) => s.id),
            },
        };

        const attendance = await prisma.attendanceRecord.findMany({
            where: attendanceWhere,
        });

        // Create attendance map
        const attendanceMap = new Map(attendance.map((a) => [a.studentId, a]));

        // Build report
        const report = students.map((student) => ({
            studentId: student.id,
            studentName: `${student.user.firstName} ${student.user.lastName}`,
            enrollmentNo: student.enrollmentNo,
            attendance: attendanceMap.get(student.id) || null,
            status: attendanceMap.get(student.id)?.status || 'NOT_MARKED',
        }));

        const summary = {
            totalStudents: students.length,
            present: attendance.filter((a) => a.status === 'PRESENT').length,
            absent: attendance.filter((a) => a.status === 'ABSENT').length,
            notMarked: students.length - attendance.length,
        };

        return {
            date: data.date,
            periodNumber: data.periodNumber,
            summary,
            students: report,
        };
    }
}

// Legacy exports for compatibility
export const createAttendance = (data: any, schoolId?: string) =>
    AttendanceService.markAttendance({ ...data, schoolId });

export const getAllAttendance = (filters: any, schoolId?: string, userId?: string, role?: string) =>
    AttendanceService.getAttendance({ ...filters, schoolId, userId, role });

export const getAttendanceById = async (id: string) => {
    const attendance = await prisma.attendanceRecord.findUnique({ where: { id } });
    if (!attendance) throw new Error('Attendance record not found');
    return attendance;
};

export const updateAttendance = async (id: string, data: any) => {
    return prisma.attendanceRecord.update({ where: { id }, data });
};

export const deleteAttendance = async (id: string, schoolId?: string) => {
    const where: any = { id, deletedAt: null };
    if (schoolId) where.schoolId = schoolId;

    const record = await prisma.attendanceRecord.findFirst({ where });
    if (!record) throw new Error('Attendance record not found');

    return prisma.attendanceRecord.update({
        where: { id },
        data: { deletedAt: new Date() }
    });
};

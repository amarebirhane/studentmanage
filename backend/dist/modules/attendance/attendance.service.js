"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAttendance = exports.updateAttendance = exports.getAttendanceById = exports.getAllAttendance = exports.createAttendance = exports.AttendanceService = void 0;
const config_1 = require("../../config");
class AttendanceService {
    /**
     * Mark attendance for a single student
     */
    static async markAttendance(data) {
        // Check for existing record
        const existing = await config_1.prisma.attendanceRecord.findFirst({
            where: {
                studentId: data.studentId,
                date: data.date,
                periodNumber: data.periodNumber || null,
            },
        });
        if (existing) {
            // Update existing record
            return config_1.prisma.attendanceRecord.update({
                where: { id: existing.id },
                data: {
                    status: data.status,
                    remarks: data.remarks,
                    recordedById: data.recordedById,
                },
            });
        }
        // Create new record
        return config_1.prisma.attendanceRecord.create({
            data,
        });
    }
    /**
     * Bulk mark attendance for entire class/section
     */
    static async bulkMarkAttendance(data) {
        const results = await Promise.all(data.records.map((record) => this.markAttendance({
            studentId: record.studentId,
            date: data.date,
            periodNumber: data.periodNumber,
            status: record.status,
            remarks: record.remarks,
            recordedById: data.recordedById,
            schoolId: data.schoolId,
        })));
        return {
            totalRecords: results.length,
            records: results,
        };
    }
    /**
     * Get attendance records with filters
     */
    static async getAttendance(filters) {
        const where = {};
        if (filters.schoolId)
            where.schoolId = filters.schoolId;
        if (filters.periodNumber !== undefined)
            where.periodNumber = filters.periodNumber;
        // Date range filter
        if (filters.dateFrom || filters.dateTo) {
            where.date = {};
            if (filters.dateFrom)
                where.date.gte = filters.dateFrom;
            if (filters.dateTo)
                where.date.lte = filters.dateTo;
        }
        // Role-based filtering
        if (filters.role === 'STUDENT' && filters.userId) {
            where.student = { userId: filters.userId };
        }
        else if (filters.role === 'PARENT' && filters.userId) {
            where.student = { parentProfiles: { some: { userId: filters.userId } } };
        }
        else if (filters.role === 'TEACHER' && filters.sectionId) {
            where.student = { sectionId: filters.sectionId };
        }
        // Direct filters
        if (filters.studentId)
            where.studentId = filters.studentId;
        if (filters.sectionId)
            where.student = { ...where.student, sectionId: filters.sectionId };
        if (filters.classId)
            where.student = { ...where.student, classId: filters.classId };
        return config_1.prisma.attendanceRecord.findMany({
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
    static async getAttendanceSummary(studentId, filters) {
        const where = { studentId };
        if (filters) {
            if (filters.dateFrom || filters.dateTo) {
                where.date = {};
                if (filters.dateFrom)
                    where.date.gte = filters.dateFrom;
                if (filters.dateTo)
                    where.date.lte = filters.dateTo;
            }
            if (filters.periodNumber !== undefined)
                where.periodNumber = filters.periodNumber;
        }
        const records = await config_1.prisma.attendanceRecord.findMany({ where });
        const summary = {
            totalRecords: records.length,
            present: records.filter((r) => r.status === 'PRESENT').length,
            absent: records.filter((r) => r.status === 'ABSENT').length,
            late: records.filter((r) => r.status === 'LATE').length,
            excused: records.filter((r) => r.status === 'EXCUSED').length,
            percentage: 0,
        };
        if (summary.totalRecords > 0) {
            summary.percentage = Math.round((summary.present / summary.totalRecords) * 100);
        }
        return summary;
    }
    /**
     * Get daily attendance report for a class/section
     */
    static async getDailyReport(data) {
        // Get all students in the section/class
        const studentWhere = {};
        if (data.sectionId)
            studentWhere.sectionId = data.sectionId;
        if (data.classId)
            studentWhere.classId = data.classId;
        if (data.schoolId)
            studentWhere.schoolId = data.schoolId;
        const students = await config_1.prisma.studentProfile.findMany({
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
        const attendanceWhere = {
            date: data.date,
            periodNumber: data.periodNumber || null,
            studentId: {
                in: students.map((s) => s.id),
            },
        };
        const attendance = await config_1.prisma.attendanceRecord.findMany({
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
exports.AttendanceService = AttendanceService;
// Legacy exports for compatibility
const createAttendance = (data, schoolId) => AttendanceService.markAttendance({ ...data, schoolId });
exports.createAttendance = createAttendance;
const getAllAttendance = (filters, schoolId, userId, role) => AttendanceService.getAttendance({ ...filters, schoolId, userId, role });
exports.getAllAttendance = getAllAttendance;
const getAttendanceById = async (id) => {
    const attendance = await config_1.prisma.attendanceRecord.findUnique({ where: { id } });
    if (!attendance)
        throw new Error('Attendance record not found');
    return attendance;
};
exports.getAttendanceById = getAttendanceById;
const updateAttendance = async (id, data) => {
    return config_1.prisma.attendanceRecord.update({ where: { id }, data });
};
exports.updateAttendance = updateAttendance;
const deleteAttendance = async (id) => {
    return config_1.prisma.attendanceRecord.delete({ where: { id } });
};
exports.deleteAttendance = deleteAttendance;

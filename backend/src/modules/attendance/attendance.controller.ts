import { Request, Response, NextFunction } from 'express';
import { AttendanceService } from './attendance.service';
import { ApiResponse } from '../../utils/apiResponse';

/**
 * Mark attendance for a single student
 */
export const markAttendance = async (req: any, res: Response, next: NextFunction) => {
    try {
        const attendance = await AttendanceService.markAttendance({
            ...req.body,
            recordedById: req.user.id,
            schoolId: req.schoolId,
        });
        new ApiResponse(res, 201, 'Attendance marked successfully', attendance).send();
    } catch (error) {
        next(error);
    }
};

/**
 * Bulk mark attendance for entire class/section
 */
export const bulkMarkAttendance = async (req: any, res: Response, next: NextFunction) => {
    try {
        const result = await AttendanceService.bulkMarkAttendance({
            ...req.body,
            recordedById: req.user.id,
            schoolId: req.schoolId,
        });
        new ApiResponse(
            res,
            201,
            `Attendance marked for ${result.totalRecords} students`,
            result
        ).send();
    } catch (error) {
        next(error);
    }
};

/**
 * Get attendance records with filters
 */
export const getAttendanceRecords = async (req: any, res: Response, next: NextFunction) => {
    try {
        const filters = {
            ...req.query,
            schoolId: req.schoolId,
            userId: req.user.id,
            role: req.user.role,
            dateFrom: req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined,
            dateTo: req.query.dateTo ? new Date(req.query.dateTo as string) : undefined,
            periodNumber: req.query.periodNumber
                ? parseInt(req.query.periodNumber as string)
                : undefined,
        };

        const attendance = await AttendanceService.getAttendance(filters);
        new ApiResponse(res, 200, 'Attendance records', attendance).send();
    } catch (error) {
        next(error);
    }
};

/**
 * Get attendance summary for a student
 */
export const getAttendanceSummary = async (req: any, res: Response, next: NextFunction) => {
    try {
        const filters = {
            dateFrom: req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined,
            dateTo: req.query.dateTo ? new Date(req.query.dateTo as string) : undefined,
            periodNumber: req.query.periodNumber
                ? parseInt(req.query.periodNumber as string)
                : undefined,
        };

        const summary = await AttendanceService.getAttendanceSummary(
            req.params.studentId,
            filters
        );
        new ApiResponse(res, 200, 'Attendance summary', summary).send();
    } catch (error) {
        next(error);
    }
};

/**
 * Get daily attendance report for a section/class
 */
export const getDailyReport = async (req: any, res: Response, next: NextFunction) => {
    try {
        const report = await AttendanceService.getDailyReport({
            date: new Date(req.query.date as string),
            sectionId: req.query.sectionId as string,
            classId: req.query.classId as string,
            periodNumber: req.query.periodNumber
                ? parseInt(req.query.periodNumber as string)
                : undefined,
            schoolId: req.schoolId,
        });
        new ApiResponse(res, 200, 'Daily attendance report', report).send();
    } catch (error) {
        next(error);
    }
};

// Legacy exports for compatibility
export const createAttendance = markAttendance;
export const getAllAttendance = getAttendanceRecords;

export const getAttendance = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const attendance = await require('./attendance.service').getAttendanceById(
            req.params.id
        );
        new ApiResponse(res, 200, 'Attendance details', attendance).send();
    } catch (error) {
        next(error);
    }
};

export const updateAttendance = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const attendance = await require('./attendance.service').updateAttendance(
            req.params.id,
            req.body
        );
        new ApiResponse(res, 200, 'Attendance updated successfully', attendance).send();
    } catch (error) {
        next(error);
    }
};

export const deleteAttendance = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await require('./attendance.service').deleteAttendance(req.params.id);
        new ApiResponse(res, 200, 'Attendance record deleted successfully').send();
    } catch (error) {
        next(error);
    }
};

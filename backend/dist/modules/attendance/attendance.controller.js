"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAttendance = exports.updateAttendance = exports.getAttendance = exports.getAllAttendance = exports.createAttendance = exports.getDailyReport = exports.getAttendanceSummary = exports.getAttendanceRecords = exports.bulkMarkAttendance = exports.markAttendance = void 0;
const attendance_service_1 = require("./attendance.service");
const apiResponse_1 = require("../../utils/apiResponse");
/**
 * Mark attendance for a single student
 */
const markAttendance = async (req, res, next) => {
    try {
        const attendance = await attendance_service_1.AttendanceService.markAttendance({
            ...req.body,
            recordedById: req.user.id,
            schoolId: req.schoolId,
        });
        new apiResponse_1.ApiResponse(res, 201, 'Attendance marked successfully', attendance).send();
    }
    catch (error) {
        next(error);
    }
};
exports.markAttendance = markAttendance;
/**
 * Bulk mark attendance for entire class/section
 */
const bulkMarkAttendance = async (req, res, next) => {
    try {
        const result = await attendance_service_1.AttendanceService.bulkMarkAttendance({
            ...req.body,
            recordedById: req.user.id,
            schoolId: req.schoolId,
        });
        new apiResponse_1.ApiResponse(res, 201, `Attendance marked for ${result.totalRecords} students`, result).send();
    }
    catch (error) {
        next(error);
    }
};
exports.bulkMarkAttendance = bulkMarkAttendance;
/**
 * Get attendance records with filters
 */
const getAttendanceRecords = async (req, res, next) => {
    try {
        const filters = {
            ...req.query,
            schoolId: req.schoolId,
            userId: req.user.id,
            role: req.user.role,
            dateFrom: req.query.dateFrom ? new Date(req.query.dateFrom) : undefined,
            dateTo: req.query.dateTo ? new Date(req.query.dateTo) : undefined,
            periodNumber: req.query.periodNumber
                ? parseInt(req.query.periodNumber)
                : undefined,
        };
        const attendance = await attendance_service_1.AttendanceService.getAttendance(filters);
        new apiResponse_1.ApiResponse(res, 200, 'Attendance records', attendance).send();
    }
    catch (error) {
        next(error);
    }
};
exports.getAttendanceRecords = getAttendanceRecords;
/**
 * Get attendance summary for a student
 */
const getAttendanceSummary = async (req, res, next) => {
    try {
        const filters = {
            dateFrom: req.query.dateFrom ? new Date(req.query.dateFrom) : undefined,
            dateTo: req.query.dateTo ? new Date(req.query.dateTo) : undefined,
            periodNumber: req.query.periodNumber
                ? parseInt(req.query.periodNumber)
                : undefined,
        };
        const summary = await attendance_service_1.AttendanceService.getAttendanceSummary(req.params.studentId, filters);
        new apiResponse_1.ApiResponse(res, 200, 'Attendance summary', summary).send();
    }
    catch (error) {
        next(error);
    }
};
exports.getAttendanceSummary = getAttendanceSummary;
/**
 * Get daily attendance report for a section/class
 */
const getDailyReport = async (req, res, next) => {
    try {
        const report = await attendance_service_1.AttendanceService.getDailyReport({
            date: new Date(req.query.date),
            sectionId: req.query.sectionId,
            classId: req.query.classId,
            periodNumber: req.query.periodNumber
                ? parseInt(req.query.periodNumber)
                : undefined,
            schoolId: req.schoolId,
        });
        new apiResponse_1.ApiResponse(res, 200, 'Daily attendance report', report).send();
    }
    catch (error) {
        next(error);
    }
};
exports.getDailyReport = getDailyReport;
// Legacy exports for compatibility
exports.createAttendance = exports.markAttendance;
exports.getAllAttendance = exports.getAttendanceRecords;
const getAttendance = async (req, res, next) => {
    try {
        const attendance = await require('./attendance.service').getAttendanceById(req.params.id);
        new apiResponse_1.ApiResponse(res, 200, 'Attendance details', attendance).send();
    }
    catch (error) {
        next(error);
    }
};
exports.getAttendance = getAttendance;
const updateAttendance = async (req, res, next) => {
    try {
        const attendance = await require('./attendance.service').updateAttendance(req.params.id, req.body);
        new apiResponse_1.ApiResponse(res, 200, 'Attendance updated successfully', attendance).send();
    }
    catch (error) {
        next(error);
    }
};
exports.updateAttendance = updateAttendance;
const deleteAttendance = async (req, res, next) => {
    try {
        await require('./attendance.service').deleteAttendance(req.params.id);
        new apiResponse_1.ApiResponse(res, 200, 'Attendance record deleted successfully').send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteAttendance = deleteAttendance;

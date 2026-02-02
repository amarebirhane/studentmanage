"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const attendanceController = __importStar(require("./attendance.controller"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect); // All routes require authentication
// Mark single attendance
router.post('/mark', (0, role_middleware_1.authorize)('ADMIN', 'TEACHER'), attendanceController.markAttendance);
// Bulk mark attendance for entire class/section
router.post('/bulk-mark', (0, role_middleware_1.authorize)('ADMIN', 'TEACHER'), attendanceController.bulkMarkAttendance);
// Get attendance records with filters
router.get('/', (0, role_middleware_1.authorize)('ADMIN', 'TEACHER', 'PARENT', 'STUDENT'), attendanceController.getAttendanceRecords);
// Get attendance summary for a student
router.get('/summary/:studentId', (0, role_middleware_1.authorize)('ADMIN', 'TEACHER', 'PARENT', 'STUDENT'), attendanceController.getAttendanceSummary);
// Get daily report for a section/class
router.get('/daily-report', (0, role_middleware_1.authorize)('ADMIN', 'TEACHER'), attendanceController.getDailyReport);
// Legacy routes for compatibility
router.post('/', (0, role_middleware_1.authorize)('ADMIN', 'TEACHER'), attendanceController.createAttendance);
router.get('/:id', (0, role_middleware_1.authorize)('ADMIN', 'TEACHER', 'PARENT'), attendanceController.getAttendance);
router.patch('/:id', (0, role_middleware_1.authorize)('ADMIN', 'TEACHER'), attendanceController.updateAttendance);
router.delete('/:id', (0, role_middleware_1.authorize)('ADMIN', 'TEACHER'), attendanceController.deleteAttendance);
exports.default = router;

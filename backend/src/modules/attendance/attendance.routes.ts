import { Router } from 'express';
import * as attendanceController from './attendance.controller';
import { protect } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';

const router = Router();

router.use(protect); // All routes require authentication

// Mark single attendance
router.post(
    '/mark',
    authorize('ADMIN', 'TEACHER'),
    attendanceController.markAttendance
);

// Bulk mark attendance for entire class/section
router.post(
    '/bulk-mark',
    authorize('ADMIN', 'TEACHER'),
    attendanceController.bulkMarkAttendance
);

// Get attendance records with filters
router.get(
    '/',
    authorize('ADMIN', 'TEACHER', 'PARENT', 'STUDENT'),
    attendanceController.getAttendanceRecords
);

// Get attendance summary for a student
router.get(
    '/summary/:studentId',
    authorize('ADMIN', 'TEACHER', 'PARENT', 'STUDENT'),
    attendanceController.getAttendanceSummary
);

// Get daily report for a section/class
router.get(
    '/daily-report',
    authorize('ADMIN', 'TEACHER'),
    attendanceController.getDailyReport
);

// Legacy routes for compatibility
router.post('/', authorize('ADMIN', 'TEACHER'), attendanceController.createAttendance);
router.get('/:id', authorize('ADMIN', 'TEACHER', 'PARENT'), attendanceController.getAttendance);
router.patch('/:id', authorize('ADMIN', 'TEACHER'), attendanceController.updateAttendance);
router.delete('/:id', authorize('ADMIN', 'TEACHER' as any), attendanceController.deleteAttendance);

export default router;

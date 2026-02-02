import { Router } from 'express';
import * as reportController from './report.controller';
import { protect } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';

const router = Router();

router.use(protect);

// Attendance Report (Admin, Teacher, Staff)
router.get(
    '/attendance',
    authorize('ADMIN', 'TEACHER', 'STAFF'),
    reportController.getAttendanceReport
);

// Exam Report (Admin, Teacher)
router.get(
    '/exams/:examId',
    authorize('ADMIN', 'TEACHER'),
    reportController.getExamReport
);

export default router;

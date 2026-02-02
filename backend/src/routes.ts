import { Router } from 'express';
import authRoutes from './modules/auth/auth.routes';
import studentRoutes from './modules/students/student.routes';
import classRoutes from './modules/classes/class.routes';
import userRoutes from './modules/users/user.routes';
import teacherRoutes from './modules/teachers/teacher.routes';
import parentRoutes from './modules/parents/parent.routes';
import schoolRoutes from './modules/schools/school.routes';
import attendanceRoutes from './modules/attendance/attendance.routes';
import examRoutes from './modules/exams/exam.routes';
import resultRoutes from './modules/results/result.routes';
import feeRoutes from './modules/fees/fee.routes';
import announcementRoutes from './modules/announcements/announcement.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/classes', classRoutes);
router.use('/admin', userRoutes);
router.use('/teachers', teacherRoutes);
router.use('/parents', parentRoutes);

// New Routes
router.use('/schools', schoolRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/exams', examRoutes);
router.use('/results', resultRoutes);
router.use('/fees', feeRoutes);
router.use('/announcements', announcementRoutes);

export default router;

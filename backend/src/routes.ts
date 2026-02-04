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
import platformRoutes from './modules/platform/platform.routes';
import messageRoutes from './modules/messages/message.routes';
import feeStructureRoutes from './modules/fee-structures/fee-structure.routes';
import assignmentRoutes from './modules/assignments/assignment.routes';
import permissionRoutes from './modules/permissions/permission.routes';
import reportRoutes from './modules/reports/report.routes';
import timetableRoutes from './modules/timetables/timetable.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import notificationRoutes from './modules/notifications/notification.routes';
import searchRoutes from './modules/search/search.routes';
import uploadRoutes from './routes/upload.routes';

import { protect } from './middlewares/auth.middleware';
import { tenantMiddleware } from './middlewares/tenant.middleware';

const router = Router();
console.log('🛣️  Routes initializing...');

// 1. Unprotected / Public Routes
router.use('/auth', authRoutes);
router.use('/schools', schoolRoutes);
router.use('/platform', platformRoutes);

// 2. Protected & Isolated Routes
const protectedRouter = Router();
protectedRouter.use(protect, tenantMiddleware);

protectedRouter.use('/students', studentRoutes);
protectedRouter.use('/classes', classRoutes);
protectedRouter.use('/admin', userRoutes);
protectedRouter.use('/teachers', teacherRoutes);
protectedRouter.use('/parents', parentRoutes);
protectedRouter.use('/attendance', attendanceRoutes);
protectedRouter.use('/exams', examRoutes);
protectedRouter.use('/results', resultRoutes);
protectedRouter.use('/fees', feeRoutes);
protectedRouter.use('/fee-structures', feeStructureRoutes);
protectedRouter.use('/announcements', announcementRoutes);
protectedRouter.use('/messages', messageRoutes);
protectedRouter.use('/assignments', assignmentRoutes);
protectedRouter.use('/permissions', permissionRoutes);
protectedRouter.use('/reports', reportRoutes);
protectedRouter.use('/timetables', timetableRoutes);
protectedRouter.use('/dashboard', dashboardRoutes);
protectedRouter.use('/notifications', notificationRoutes);
protectedRouter.use('/search', searchRoutes);
protectedRouter.use('/upload', uploadRoutes);

router.use(protectedRouter);

export default router;

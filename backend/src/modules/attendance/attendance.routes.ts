import { Router } from 'express';
import * as attendanceController from './attendance.controller';
import { protect } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(protect);

router.post('/', authorize(UserRole.ADMIN, UserRole.TEACHER), attendanceController.createAttendance);
router.get('/', authorize(UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT), attendanceController.getAllAttendance);
router.get('/:id', authorize(UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT), attendanceController.getAttendance);
router.patch('/:id', authorize(UserRole.ADMIN, UserRole.TEACHER), attendanceController.updateAttendance);
router.delete('/:id', authorize(UserRole.ADMIN, UserRole.TEACHER), attendanceController.deleteAttendance);

export default router;

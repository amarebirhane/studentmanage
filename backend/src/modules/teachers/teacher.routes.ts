import { Router } from 'express';
import { TeacherController } from './teacher.controller';
import { protect, authorize } from '../../middlewares/auth.middleware';

const router = Router();

router.route('/')
    .get(protect, authorize('ADMIN', 'TEACHER'), TeacherController.getTeachers)
    .post(protect, authorize('ADMIN'), TeacherController.createTeacher);

router.route('/:id')
    .get(protect, authorize('ADMIN', 'TEACHER'), TeacherController.getTeacherById)
    .put(protect, authorize('ADMIN'), TeacherController.updateTeacher)
    .delete(protect, authorize('ADMIN'), TeacherController.deleteTeacher);

export default router;

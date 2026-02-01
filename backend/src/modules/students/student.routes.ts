import { Router } from 'express';
import { StudentController } from './student.controller';
import { protect, authorize } from '../../middlewares/auth.middleware';

const router = Router();

router.route('/')
    .get(protect, authorize('ADMIN', 'TEACHER'), StudentController.getStudents)
    .post(protect, authorize('ADMIN'), StudentController.createStudent);

router.route('/:id')
    .get(protect, authorize('ADMIN', 'TEACHER'), StudentController.getStudentById)
    .put(protect, authorize('ADMIN'), StudentController.updateStudent)
    .delete(protect, authorize('ADMIN'), StudentController.deleteStudent);

export default router;

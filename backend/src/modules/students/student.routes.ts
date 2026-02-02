import { Router } from 'express';
import { StudentController } from './student.controller';
import { protect, authorize } from '../../middlewares/auth.middleware';

const router = Router();

router.route('/')
    .get(StudentController.getStudents) // Middleware in routes.ts handles protection
    .post(authorize('ADMIN', 'SUPER_ADMIN' as any), StudentController.createStudent);

router.post('/:id/approve', authorize('ADMIN', 'SUPER_ADMIN' as any), StudentController.approveAdmission);

router.route('/:id')
    .get(authorize('ADMIN', 'TEACHER', 'PARENT', 'SUPER_ADMIN' as any), StudentController.getStudentById)
    .put(authorize('ADMIN', 'SUPER_ADMIN' as any), StudentController.updateStudent)
    .delete(authorize('ADMIN', 'SUPER_ADMIN' as any), StudentController.deleteStudent);

export default router;

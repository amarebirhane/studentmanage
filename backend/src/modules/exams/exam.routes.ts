import { Router } from 'express';
import * as examController from './exam.controller';
import { protect } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(protect);

router.post('/', authorize(UserRole.ADMIN, UserRole.TEACHER), examController.createExam);
router.get('/', authorize(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT), examController.getAllExams);
router.get('/:id', authorize(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT), examController.getExam);
router.patch('/:id', authorize(UserRole.ADMIN, UserRole.TEACHER), examController.updateExam);
router.delete('/:id', authorize(UserRole.ADMIN, UserRole.TEACHER), examController.deleteExam);

export default router;

import { Router } from 'express';
import * as resultController from './result.controller';
import { protect } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(protect);

router.post('/', authorize(UserRole.ADMIN, UserRole.TEACHER), resultController.createResult);
router.get('/', authorize(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT), resultController.getAllResults);
router.get('/:id', authorize(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT), resultController.getResult);
router.patch('/:id', authorize(UserRole.ADMIN, UserRole.TEACHER), resultController.updateResult);
router.delete('/:id', authorize(UserRole.ADMIN, UserRole.TEACHER), resultController.deleteResult);

export default router;

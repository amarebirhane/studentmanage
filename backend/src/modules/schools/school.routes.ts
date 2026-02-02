import { Router } from 'express';
import * as schoolController from './school.controller';
import { protect } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(protect); // All routes require authentication
router.use(authorize('SUPER_ADMIN' as any)); // Only Super Admin can manage schools

router.post('/', schoolController.createSchool);
router.get('/', schoolController.getSchools);
router.get('/:id', schoolController.getSchool);
router.patch('/:id', schoolController.updateSchool); // using patch for partial updates
router.delete('/:id', schoolController.deleteSchool);

export default router;

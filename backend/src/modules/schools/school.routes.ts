import { Router } from 'express';
import * as schoolController from './school.controller';
import { protect } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(protect); // All routes require authentication
router.use(authorize('SUPER_ADMIN' as any)); // Only Super Admin can manage schools

// Platform management (Super Admin only)
router.post('/', authorize('SUPER_ADMIN' as any), schoolController.createSchool);
router.get('/', authorize('SUPER_ADMIN' as any), schoolController.getSchools);
router.patch('/:id/suspend', authorize('SUPER_ADMIN' as any), schoolController.setSuspension);
router.delete('/:id', authorize('SUPER_ADMIN' as any), schoolController.deleteSchool);

// School configuration (Super Admin or School Admin)
router.get('/:id', authorize('SUPER_ADMIN', 'ADMIN' as any), schoolController.getSchool);
router.patch('/:id', authorize('SUPER_ADMIN', 'ADMIN' as any), schoolController.updateSchool);
router.post('/:id/academic-year', authorize('SUPER_ADMIN', 'ADMIN' as any), schoolController.configureAcademicYear);
router.post('/:id/grading-system', authorize('SUPER_ADMIN', 'ADMIN' as any), schoolController.updateGradingSystem);

export default router;

import { Router } from 'express';
import { ParentController } from './parent.controller';
import { protect, authorize } from '../../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(protect);

// Parent Portal Routes (parents viewing their own data)
router.get('/financials', authorize('PARENT'), ParentController.getFinancials);

// Teacher Routes (teachers viewing parents of their students)
router.get('/my-parents', authorize('TEACHER'), ParentController.getTeacherParents);

// View routes (teachers and admins can view parents)
router.get('/', ParentController.getParents);
router.get('/:id', ParentController.getParentById);

// Admin-only modification routes
router.post('/', authorize('ADMIN'), ParentController.createParent);
router.put('/:id', authorize('ADMIN'), ParentController.updateParent);
router.delete('/:id', authorize('ADMIN'), ParentController.deleteParent);

export default router;

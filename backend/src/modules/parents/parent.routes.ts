import { Router } from 'express';
import { ParentController } from './parent.controller';
import { protect, authorize } from '../../middlewares/auth.middleware';

const router = Router();

// Parent Portal Routes
router.get('/financials', protect, authorize('PARENT'), ParentController.getFinancials);

// Admin-only Routes
router.use(protect, authorize('ADMIN'));

router.route('/')
    .get(ParentController.getParents)
    .post(ParentController.createParent);

router.route('/:id')
    .get(ParentController.getParentById)
    .put(ParentController.updateParent)
    .delete(ParentController.deleteParent);

export default router;

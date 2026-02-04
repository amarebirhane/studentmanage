import { Router } from 'express';
import { ResourceController } from './resource.controller';
import { protect, authorize } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', protect, authorize('ADMIN', 'TEACHER'), ResourceController.createResource);
router.get('/', protect, ResourceController.getResources);
router.delete('/:id', protect, authorize('ADMIN', 'TEACHER'), ResourceController.deleteResource);

export default router;

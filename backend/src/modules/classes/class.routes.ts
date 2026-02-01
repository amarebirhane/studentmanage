import { Router } from 'express';
import { ClassController } from './class.controller';
import { protect, authorize } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', protect, ClassController.getClasses);
router.get('/sections', protect, ClassController.getSections);

router.post('/', protect, authorize('ADMIN'), ClassController.createClass);
router.post('/sections', protect, authorize('ADMIN'), ClassController.createSection);

router.delete('/:id', protect, authorize('ADMIN'), ClassController.deleteClass);
router.delete('/sections/:id', protect, authorize('ADMIN'), ClassController.deleteSection);

export default router;

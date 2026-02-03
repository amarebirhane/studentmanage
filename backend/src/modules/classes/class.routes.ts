import { Router } from 'express';
import { ClassController } from './class.controller';
import { checkPermission } from '../../middlewares/permission.middleware';

const router = Router();

// Routes are already protected and tenant-isolated by the parent router in routes.ts

router.get('/', checkPermission('classes', 'view'), ClassController.getClasses);
router.get('/sections', checkPermission('classes', 'view'), ClassController.getSections);

router.post('/', checkPermission('classes', 'create'), ClassController.createClass);
router.post('/sections', checkPermission('classes', 'create'), ClassController.createSection);

router.delete('/:id', checkPermission('classes', 'delete'), ClassController.deleteClass);
router.delete('/sections/:id', checkPermission('classes', 'delete'), ClassController.deleteSection);

// Subject Routes
router.get('/subjects', checkPermission('classes', 'view'), ClassController.getSubjects);
router.post('/subjects', checkPermission('classes', 'create'), ClassController.createSubject);
router.delete('/subjects/:id', checkPermission('classes', 'delete'), ClassController.deleteSubject);

export default router;

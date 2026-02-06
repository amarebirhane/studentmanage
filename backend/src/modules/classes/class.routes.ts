import { Router } from 'express';
import { ClassController } from './class.controller';
import { checkPermission } from '../../middlewares/permission.middleware';

const router = Router();

// Routes are already protected and tenant-isolated by the parent router in routes.ts

// Subject Routes - Teachers need to view subjects (no permission check required, just authentication)
router.get('/subjects', ClassController.getSubjects);

// Classes and Sections - Anyone authenticated can view, but only admins can create/delete
router.get('/', ClassController.getClasses);
router.get('/sections', ClassController.getSections);

// Admin-only operations (require explicit permissions)
router.post('/', checkPermission('classes', 'create'), ClassController.createClass);
router.post('/sections', checkPermission('classes', 'create'), ClassController.createSection);
router.post('/subjects', checkPermission('classes', 'create'), ClassController.createSubject);

router.put('/:id', checkPermission('classes', 'edit'), ClassController.updateClass);
router.put('/sections/:id', checkPermission('classes', 'edit'), ClassController.updateSection);

router.delete('/:id', checkPermission('classes', 'delete'), ClassController.deleteClass);
router.delete('/sections/:id', checkPermission('classes', 'delete'), ClassController.deleteSection);
router.delete('/subjects/:id', checkPermission('classes', 'delete'), ClassController.deleteSubject);

export default router;

import { Router } from 'express';
import { TeacherController } from './teacher.controller';
import { protect } from '../../middlewares/auth.middleware';
import { tenantMiddleware } from '../../middlewares/tenant.middleware';
import { checkPermission } from '../../middlewares/permission.middleware';

const router = Router();

// Apply protection and tenant isolation to all teacher routes
router.use(protect, tenantMiddleware);

// Teacher-specific routes (no additional permissions needed - just authentication)
router.get('/dashboard', TeacherController.getDashboardStats);
router.get('/my-classes', TeacherController.getTeacherClasses);

// Admin routes (require explicit permissions)
router.route('/')
    .get(checkPermission('teachers', 'view'), TeacherController.getTeachers)
    .post(checkPermission('teachers', 'create'), TeacherController.createTeacher);

router.route('/:id')
    .get(checkPermission('teachers', 'view'), TeacherController.getTeacherById)
    .put(checkPermission('teachers', 'edit'), TeacherController.updateTeacher)
    .delete(checkPermission('teachers', 'delete'), TeacherController.deleteTeacher);

export default router;

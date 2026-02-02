import { Router } from 'express';
import { TeacherController } from './teacher.controller';
import { protect } from '../../middlewares/auth.middleware';
import { tenantMiddleware } from '../../middlewares/tenant.middleware';
import { checkPermission } from '../../middlewares/permission.middleware';

const router = Router();

// Apply protection and tenant isolation to all teacher routes
router.use(protect, tenantMiddleware);

router.route('/')
    .get(checkPermission('teachers', 'view'), TeacherController.getTeachers)
    .post(checkPermission('teachers', 'create'), TeacherController.createTeacher);

router.get('/dashboard', TeacherController.getDashboardStats); // Role-specific view

router.route('/:id')
    .get(checkPermission('teachers', 'view'), TeacherController.getTeacherById)
    .put(checkPermission('teachers', 'edit'), TeacherController.updateTeacher)
    .delete(checkPermission('teachers', 'delete'), TeacherController.deleteTeacher);

export default router;

import { Router } from 'express';
import { StudentController } from './student.controller';
import { protect } from '../../middlewares/auth.middleware';
import { checkPermission } from '../../middlewares/permission.middleware';
import { tenantMiddleware } from '../../middlewares/tenant.middleware';

const router = Router();

// Apply protection and tenant middleware to all student routes
router.use(protect, tenantMiddleware);

// Teachers need to view students for attendance, grading, etc. (no permission check)
router.get('/', StudentController.getStudents);
router.get('/:id', StudentController.getStudentById);

// Admin-only operations (require explicit permissions)
router.post('/', checkPermission('students', 'create'), StudentController.createStudent);
router.post('/:id/approve', checkPermission('students', 'edit'), StudentController.approveAdmission);
router.put('/:id', checkPermission('students', 'edit'), StudentController.updateStudent);
router.delete('/:id', checkPermission('students', 'delete'), StudentController.deleteStudent);

export default router;

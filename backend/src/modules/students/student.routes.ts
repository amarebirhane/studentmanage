import { Router } from 'express';
import { StudentController } from './student.controller';
import { protect } from '../../middlewares/auth.middleware';
import { checkPermission } from '../../middlewares/permission.middleware';
import { tenantMiddleware } from '../../middlewares/tenant.middleware';

const router = Router();

// Apply protection and tenant middleware to all student routes
router.use(protect, tenantMiddleware);

router.route('/')
    .get(checkPermission('students', 'view'), StudentController.getStudents)
    .post(checkPermission('students', 'create'), StudentController.createStudent);

router.post('/:id/approve', checkPermission('students', 'edit'), StudentController.approveAdmission);

router.route('/:id')
    .get(checkPermission('students', 'view'), StudentController.getStudentById)
    .put(checkPermission('students', 'edit'), StudentController.updateStudent)
    .delete(checkPermission('students', 'delete'), StudentController.deleteStudent);

export default router;

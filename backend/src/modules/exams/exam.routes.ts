import { Router } from 'express';
import * as examController from './exam.controller';
import { protect } from '../../middlewares/auth.middleware';
import { tenantMiddleware } from '../../middlewares/tenant.middleware';
import { checkPermission } from '../../middlewares/permission.middleware';

const router = Router();

// Apply protection and tenant isolation to all exam routes
router.use(protect, tenantMiddleware);

// Create Exam
router.post(
    '/',
    checkPermission('exams', 'create'),
    examController.createExam
);

// Get All Exams
router.get(
    '/',
    checkPermission('exams', 'view'),
    examController.getAllExams
);

// Student: Get My Results
router.get(
    '/my-results',
    examController.getMyResults // Specific view for students
);

// Enter Marks
router.put(
    '/:id/marks',
    checkPermission('exams', 'edit'),
    examController.enterMarks
);

// Publish Results
router.post(
    '/:id/publish',
    checkPermission('exams', 'edit'),
    examController.publishResults
);

// Get Single Exam
router.get(
    '/:id',
    checkPermission('exams', 'view'),
    examController.getExam
);

// Update Exam
router.patch(
    '/:id',
    checkPermission('exams', 'edit'),
    examController.updateExam
);

// Delete Exam
router.delete(
    '/:id',
    checkPermission('exams', 'delete'),
    examController.deleteExam
);

export default router;

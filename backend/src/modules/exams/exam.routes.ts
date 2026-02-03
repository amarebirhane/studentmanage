import { Router } from 'express';
import * as examController from './exam.controller';
import { protect } from '../../middlewares/auth.middleware';
import { tenantMiddleware } from '../../middlewares/tenant.middleware';
import { checkPermission } from '../../middlewares/permission.middleware';

const router = Router();

// Apply protection and tenant isolation to all exam routes
router.use(protect, tenantMiddleware);

// Teacher & Student Routes (no additional permissions needed - just authentication)
// Teachers can create exams, view them, and enter marks
router.post('/', examController.createExam);
router.get('/', examController.getAllExams);
router.get('/my-results', examController.getMyResults); // Student-specific
router.get('/:id', examController.getExam);

// Enter Marks & Publish Results (teachers only - but no permission check needed)
router.put('/:id/marks', examController.enterMarks);
router.post('/:id/publish', examController.publishResults);
router.patch('/:id', examController.updateExam);

// Admin-only operations (require explicit permissions)
router.delete(
    '/:id',
    checkPermission('exams', 'delete'),
    examController.deleteExam
);

export default router;

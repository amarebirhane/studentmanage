import { Router } from 'express';
import * as assignmentController from './assignment.controller';
import { protect } from '../../middlewares/auth.middleware';
import { tenantMiddleware } from '../../middlewares/tenant.middleware';
import { checkPermission } from '../../middlewares/permission.middleware';

const router = Router();

router.use(protect, tenantMiddleware);

// Teacher & Student Routes (no additional permissions needed - just authentication)
// Teachers can create and view assignments, students can view and submit
router.post('/', assignmentController.createAssignment);
router.get('/', assignmentController.getAssignments);
router.post('/:id/submit', assignmentController.submitAssignment);
router.get('/my-submissions', assignmentController.getMySubmissions);
router.get('/:id/submissions', assignmentController.getAssignmentSubmissions);

// Grade submission (teachers only - but no permission check needed)
router.patch(
    '/submissions/:submissionId/grade',
    assignmentController.gradeSubmission
);

export default router;

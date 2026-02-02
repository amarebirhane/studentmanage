import { Router } from 'express';
import * as assignmentController from './assignment.controller';
import { protect } from '../../middlewares/auth.middleware';
import { tenantMiddleware } from '../../middlewares/tenant.middleware';
import { checkPermission } from '../../middlewares/permission.middleware';

const router = Router();

router.use(protect, tenantMiddleware);

// Create assignment (teachers only)
router.post(
    '/',
    checkPermission('assignments', 'create'),
    assignmentController.createAssignment
);

// Get assignments (students see theirs, teachers see all they created)
router.get('/', checkPermission('assignments', 'view'), assignmentController.getAssignments);

// Submit assignment (students only)
router.post(
    '/:id/submit',
    checkPermission('assignments', 'create'), // Students 'create' a submission
    assignmentController.submitAssignment
);

// Grade submission (teachers only)
router.patch(
    '/submissions/:submissionId/grade',
    checkPermission('assignments', 'edit'), // Teachers 'edit' a submission (grading)
    assignmentController.gradeSubmission
);

// Get my submissions (students)
router.get(
    '/my-submissions',
    checkPermission('assignments', 'view'),
    assignmentController.getMySubmissions
);

// Get assignment submissions (teachers)
router.get(
    '/:id/submissions',
    checkPermission('assignments', 'view'),
    assignmentController.getAssignmentSubmissions
);

export default router;

import { Router } from 'express';
import * as assignmentController from './assignment.controller';
import { protect } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';

const router = Router();

router.use(protect); // All routes require authentication

// Create assignment (teachers only)
router.post(
    '/',
    authorize('TEACHER', 'ADMIN'),
    assignmentController.createAssignment
);

// Get assignments (students see theirs, teachers see all they created)
router.get('/', assignmentController.getAssignments);

// Submit assignment (students only)
router.post(
    '/:id/submit',
    authorize('STUDENT'),
    assignmentController.submitAssignment
);

// Grade submission (teachers only)
router.patch(
    '/submissions/:submissionId/grade',
    authorize('TEACHER', 'ADMIN'),
    assignmentController.gradeSubmission
);

// Get my submissions (students)
router.get(
    '/my-submissions',
    authorize('STUDENT'),
    assignmentController.getMySubmissions
);

// Get assignment submissions (teachers)
router.get(
    '/:id/submissions',
    authorize('TEACHER', 'ADMIN'),
    assignmentController.getAssignmentSubmissions
);

export default router;

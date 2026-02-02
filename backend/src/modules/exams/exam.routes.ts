import { Router } from 'express';
import * as examController from './exam.controller';
import { protect } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';

const router = Router();

router.use(protect); // All routes require authentication

// Create Exam (Teacher/Admin)
router.post(
    '/',
    authorize('ADMIN', 'TEACHER'),
    examController.createExam
);

// Get All Exams (Everyone with role filtering)
router.get(
    '/',
    authorize('ADMIN', 'TEACHER', 'STUDENT', 'PARENT'),
    examController.getAllExams
);

// Student: Get My Results
router.get(
    '/my-results',
    authorize('STUDENT'),
    examController.getMyResults
);

// Enter Marks (Teacher/Admin)
router.put(
    '/:id/marks',
    authorize('ADMIN', 'TEACHER'),
    examController.enterMarks
);

// Publish Results (Teacher/Admin)
router.post(
    '/:id/publish',
    authorize('ADMIN', 'TEACHER'),
    examController.publishResults
);

// Get Single Exam
router.get(
    '/:id',
    authorize('ADMIN', 'TEACHER', 'STUDENT', 'PARENT'),
    examController.getExam
);

// Update Exam
router.patch(
    '/:id',
    authorize('ADMIN', 'TEACHER'),
    examController.updateExam
);

// Delete Exam
router.delete(
    '/:id',
    authorize('ADMIN', 'TEACHER'),
    examController.deleteExam
);

export default router;

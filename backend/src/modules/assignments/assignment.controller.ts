import { Response, NextFunction } from 'express';
import { AssignmentService } from './assignment.service';
import { ApiResponse } from '../../utils/apiResponse';
import { AuthenticatedRequest } from '../../types';
import { prisma } from '../../config';

export const createAssignment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const teacherProfile = await prisma.teacherProfile.findUnique({
            where: { userId: req.user?.id as string },
        });

        if (!teacherProfile) {
            return ApiResponse.error(res, 'Only teachers can create assignments', 403);
        }

        const assignment = await AssignmentService.createAssignment({
            ...req.body,
            teacherId: teacherProfile.id,
            userId: req.user?.id as string,
            schoolId: req.schoolId,
        });

        return ApiResponse.success(res, assignment, 'Assignment created successfully', 201);
    } catch (error) {
        next(error);
    }
};

export const getAssignments = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const assignments = await AssignmentService.getAssignments(
            req.query,
            req.schoolId,
            req.user?.id as string,
            req.user?.role
        );
        return ApiResponse.success(res, assignments, 'Assignments retrieved');
    } catch (error) {
        next(error);
    }
};

export const submitAssignment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const studentProfile = await prisma.studentProfile.findUnique({
            where: { userId: req.user?.id as string },
        });

        if (!studentProfile) {
            return ApiResponse.error(res, 'Only students can submit assignments', 403);
        }

        const submission = await AssignmentService.submitAssignment({
            assignmentId: req.params.id as string,
            studentId: studentProfile.id,
            fileUrl: req.body.fileUrl,
            content: req.body.content,
            schoolId: req.schoolId,
        });

        return ApiResponse.success(res, submission, 'Assignment submitted successfully', 201);
    } catch (error) {
        next(error);
    }
};

export const gradeSubmission = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const graded = await AssignmentService.gradeSubmission({
            submissionId: req.params.submissionId as string,
            marks: req.body.marks,
            grade: req.body.grade,
            feedback: req.body.feedback,
            gradedBy: req.user?.id as string,
            schoolId: req.schoolId,
        });

        return ApiResponse.success(res, graded, 'Assignment graded successfully');
    } catch (error) {
        next(error);
    }
};

export const getMySubmissions = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const studentProfile = await prisma.studentProfile.findUnique({
            where: { userId: req.user?.id as string },
        });

        if (!studentProfile) {
            return ApiResponse.error(res, 'Student profile not found', 404);
        }

        const submissions = await AssignmentService.getMySubmissions(studentProfile.id);
        return ApiResponse.success(res, submissions, 'Submissions retrieved');
    } catch (error) {
        next(error);
    }
};

export const getAssignmentSubmissions = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const teacherProfile = await prisma.teacherProfile.findUnique({
            where: { userId: req.user?.id as string },
        });

        const submissions = await AssignmentService.getAssignmentSubmissions(
            req.params.id as string,
            teacherProfile?.userId,
            req.schoolId
        );

        return ApiResponse.success(res, submissions, 'Assignment submissions');
    } catch (error) {
        next(error);
    }
};

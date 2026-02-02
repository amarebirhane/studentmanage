import { Request, Response, NextFunction } from 'express';
import { AssignmentService } from './assignment.service';
import { ApiResponse } from '../../utils/apiResponse';

export const createAssignment = async (req: any, res: Response, next: NextFunction) => {
    try {
        const teacherProfile = await require('../../config').prisma.teacherProfile.findUnique({
            where: { userId: req.user.id },
        });

        if (!teacherProfile) {
            return new ApiResponse(res, 403, 'Only teachers can create assignments').send();
        }

        const assignment = await AssignmentService.createAssignment({
            ...req.body,
            teacherId: teacherProfile.id,
            userId: req.user.id,
            schoolId: req.schoolId,
        });

        new ApiResponse(res, 201, 'Assignment created successfully', assignment).send();
    } catch (error) {
        next(error);
    }
};

export const getAssignments = async (req: any, res: Response, next: NextFunction) => {
    try {
        const assignments = await AssignmentService.getAssignments(
            req.query,
            req.schoolId,
            req.user.id,
            req.user.role
        );
        new ApiResponse(res, 200, 'Assignments retrieved', assignments).send();
    } catch (error) {
        next(error);
    }
};

export const submitAssignment = async (req: any, res: Response, next: NextFunction) => {
    try {
        const studentProfile = await require('../../config').prisma.studentProfile.findUnique({
            where: { userId: req.user.id },
        });

        if (!studentProfile) {
            return new ApiResponse(res, 403, 'Only students can submit assignments').send();
        }

        const submission = await AssignmentService.submitAssignment({
            assignmentId: req.params.id,
            studentId: studentProfile.id,
            fileUrl: req.body.fileUrl,
            content: req.body.content,
        });

        new ApiResponse(res, 201, 'Assignment submitted successfully', submission).send();
    } catch (error) {
        next(error);
    }
};

export const gradeSubmission = async (req: any, res: Response, next: NextFunction) => {
    try {
        const graded = await AssignmentService.gradeSubmission({
            submissionId: req.params.submissionId,
            marks: req.body.marks,
            grade: req.body.grade,
            feedback: req.body.feedback,
            gradedBy: req.user.id,
        });

        new ApiResponse(res, 200, 'Assignment graded successfully', graded).send();
    } catch (error) {
        next(error);
    }
};

export const getMySubmissions = async (req: any, res: Response, next: NextFunction) => {
    try {
        const studentProfile = await require('../../config').prisma.studentProfile.findUnique({
            where: { userId: req.user.id },
        });

        if (!studentProfile) {
            return new ApiResponse(res, 404, 'Student profile not found').send();
        }

        const submissions = await AssignmentService.getMySubmissions(studentProfile.id);
        new ApiResponse(res, 200, 'Submissions retrieved', submissions).send();
    } catch (error) {
        next(error);
    }
};

export const getAssignmentSubmissions = async (req: any, res: Response, next: NextFunction) => {
    try {
        const teacherProfile = await require('../../config').prisma.teacherProfile.findUnique({
            where: { userId: req.user.id },
        });

        const submissions = await AssignmentService.getAssignmentSubmissions(
            req.params.id,
            teacherProfile?.userId
        );

        new ApiResponse(res, 200, 'Assignment submissions', submissions).send();
    } catch (error) {
        next(error);
    }
};

import { Response, NextFunction } from 'express';
import { ExamService } from './exam.service';
import { ApiResponse } from '../../utils/apiResponse';
import { AuthenticatedRequest } from '../../types';

export const createExam = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const exam = await ExamService.createExam({
            ...req.body,
            createdById: req.user?.id,
            schoolId: req.schoolId,
        });
        new ApiResponse(res, 201, 'Exam created successfully', exam).send();
    } catch (error) {
        next(error);
    }
};

export const getAllExams = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const filters = {
            ...req.query,
            schoolId: req.schoolId,
            teacherId: req.user?.role === 'TEACHER' ? req.user?.id : undefined,
        };
        const exams = await ExamService.getExams(filters);
        new ApiResponse(res, 200, 'All exams', exams).send();
    } catch (error) {
        next(error);
    }
};

export const getExam = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const exam = await ExamService.getExamById(req.params.id as string, req.schoolId);
        new ApiResponse(res, 200, 'Exam details', exam).send();
    } catch (error) {
        next(error);
    }
};

export const enterMarks = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const results = await ExamService.enterMarks({
            examId: req.params.id as string,
            marks: req.body.marks,
            schoolId: req.schoolId,
        });
        new ApiResponse(res, 200, 'Marks recorded successfully', results).send();
    } catch (error) {
        next(error);
    }
};

export const publishResults = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const exam = await ExamService.publishResults(req.params.id as string, req.schoolId);
        new ApiResponse(res, 200, 'Results published successfully', exam).send();
    } catch (error) {
        next(error);
    }
};

export const getMyResults = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const studentProfile = await require('../../config').prisma.studentProfile.findFirst({
            where: {
                userId: req.user?.id,
                schoolId: req.schoolId
            }
        });

        if (!studentProfile) {
            return new ApiResponse(res, 404, 'Student profile not found').send();
        }

        const results = await ExamService.getMyResults(studentProfile.id, {
            ...req.query,
            schoolId: req.schoolId
        } as any);
        new ApiResponse(res, 200, 'My results', results).send();
    } catch (error) {
        next(error);
    }
};

// Legacy exports
export const updateExam = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const exam = await ExamService.updateExam(req.params.id as string, req.body, req.schoolId);
        new ApiResponse(res, 200, 'Exam updated successfully', exam).send();
    } catch (error) {
        next(error);
    }
};

export const deleteExam = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        await ExamService.deleteExam(req.params.id as string, req.schoolId);
        new ApiResponse(res, 200, 'Exam deleted successfully').send();
    } catch (error) {
        next(error);
    }
};

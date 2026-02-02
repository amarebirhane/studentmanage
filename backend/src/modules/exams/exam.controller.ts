import { Request, Response, NextFunction } from 'express';
import { ExamService } from './exam.service';
import { ApiResponse } from '../../utils/apiResponse';

export const createExam = async (req: any, res: Response, next: NextFunction) => {
    try {
        const exam = await ExamService.createExam({
            ...req.body,
            createdById: req.user.id,
            schoolId: req.schoolId,
        });
        new ApiResponse(res, 201, 'Exam created successfully', exam).send();
    } catch (error) {
        next(error);
    }
};

export const getAllExams = async (req: any, res: Response, next: NextFunction) => {
    try {
        const filters = {
            ...req.query,
            schoolId: req.schoolId,
            teacherId: req.user.role === 'TEACHER' ? req.user.id : undefined,
        };
        const exams = await ExamService.getExams(filters);
        new ApiResponse(res, 200, 'All exams', exams).send();
    } catch (error) {
        next(error);
    }
};

export const getExam = async (req: any, res: Response, next: NextFunction) => {
    try {
        const exam = await ExamService.getExamById(req.params.id);
        new ApiResponse(res, 200, 'Exam details', exam).send();
    } catch (error) {
        next(error);
    }
};

export const enterMarks = async (req: any, res: Response, next: NextFunction) => {
    try {
        // Teacher/Admin validation
        // (Middleware should handle role check, but good to add ownership check)

        const results = await ExamService.enterMarks({
            examId: req.params.id,
            marks: req.body.marks,
        });
        new ApiResponse(res, 200, 'Marks recorded successfully', results).send();
    } catch (error) {
        next(error);
    }
};

export const publishResults = async (req: any, res: Response, next: NextFunction) => {
    try {
        const exam = await ExamService.publishResults(req.params.id);
        new ApiResponse(res, 200, 'Results published successfully', exam).send();
    } catch (error) {
        next(error);
    }
};

export const getMyResults = async (req: any, res: Response, next: NextFunction) => {
    try {
        const studentProfile = await require('../../config').prisma.studentProfile.findUnique({
            where: { userId: req.user.id }
        });

        if (!studentProfile) {
            return new ApiResponse(res, 404, 'Student profile not found').send();
        }

        const results = await ExamService.getMyResults(studentProfile.id, req.query);
        new ApiResponse(res, 200, 'My results', results).send();
    } catch (error) {
        next(error);
    }
};

// Legacy exports
export const updateExam = async (req: any, res: Response, next: NextFunction) => {
    try {
        const exam = await require('./exam.service').updateExam(req.params.id, req.body);
        new ApiResponse(res, 200, 'Exam updated successfully', exam).send();
    } catch (error) {
        next(error);
    }
};

export const deleteExam = async (req: any, res: Response, next: NextFunction) => {
    try {
        await require('./exam.service').deleteExam(req.params.id);
        new ApiResponse(res, 200, 'Exam deleted successfully').send();
    } catch (error) {
        next(error);
    }
};

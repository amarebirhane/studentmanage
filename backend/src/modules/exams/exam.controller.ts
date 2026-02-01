import { Request, Response, NextFunction } from 'express';
import * as examService from './exam.service';
import { ApiResponse } from '../../utils/apiResponse';

export const createExam = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const exam = await examService.createExam(req.body);
        new ApiResponse(res, 201, 'Exam created successfully', exam).send();
    } catch (error) {
        next(error);
    }
};

export const getExam = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const exam = await examService.getExamById(req.params.id as string);
        new ApiResponse(res, 200, 'Exam details', exam).send();
    } catch (error) {
        next(error);
    }
};

export const updateExam = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const exam = await examService.updateExam(req.params.id as string, req.body);
        new ApiResponse(res, 200, 'Exam updated successfully', exam).send();
    } catch (error) {
        next(error);
    }
};

export const deleteExam = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await examService.deleteExam(req.params.id as string);
        new ApiResponse(res, 200, 'Exam deleted successfully').send();
    } catch (error) {
        next(error);
    }
};

export const getAllExams = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const exams = await examService.getAllExams(req.query);
        new ApiResponse(res, 200, 'All exams', exams).send();
    } catch (error) {
        next(error);
    }
};

import { Request, Response, NextFunction } from 'express';
import { TimetableService } from './timetable.service';
import { ApiResponse } from '../../utils/apiResponse';

export const createEntry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const schoolId = (req as any).schoolId;
        const entry = await TimetableService.createEntry({ ...req.body, schoolId });
        new ApiResponse(res, 201, 'Timetable entry created', entry).send();
    } catch (error) {
        next(error);
    }
};

export const getTimetable = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const schoolId = (req as any).schoolId;
        const { classId, sectionId, teacherId } = req.query;
        const timetable = await TimetableService.getTimetable({
            classId: classId as string,
            sectionId: sectionId as string,
            teacherId: teacherId as string,
            schoolId: schoolId as string,
        });
        new ApiResponse(res, 200, 'Timetable retrieved', timetable).send();
    } catch (error) {
        next(error);
    }
};

export const updateEntry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const schoolId = (req as any).schoolId;
        const entry = await TimetableService.updateEntry(req.params.id as string, req.body, schoolId as string);
        new ApiResponse(res, 200, 'Timetable entry updated', entry).send();
    } catch (error) {
        next(error);
    }
};

export const deleteEntry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const schoolId = (req as any).schoolId;
        await TimetableService.deleteEntry(req.params.id as string, schoolId as string);
        new ApiResponse(res, 200, 'Timetable entry deleted').send();
    } catch (error) {
        next(error);
    }
};

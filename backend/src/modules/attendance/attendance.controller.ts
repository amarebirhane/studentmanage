import { Request, Response, NextFunction } from 'express';
import * as attendanceService from './attendance.service';
import { ApiResponse } from '../../utils/apiResponse';

export const createAttendance = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const attendance = await attendanceService.createAttendance(req.body);
        new ApiResponse(res, 201, 'Attendance recorded successfully', attendance).send();
    } catch (error) {
        next(error);
    }
};

export const getAttendance = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const attendance = await attendanceService.getAttendanceById(req.params.id as string);
        new ApiResponse(res, 200, 'Attendance details', attendance).send();
    } catch (error) {
        next(error);
    }
};

export const updateAttendance = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const attendance = await attendanceService.updateAttendance(req.params.id as string, req.body);
        new ApiResponse(res, 200, 'Attendance updated successfully', attendance).send();
    } catch (error) {
        next(error);
    }
};

export const deleteAttendance = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await attendanceService.deleteAttendance(req.params.id as string);
        new ApiResponse(res, 200, 'Attendance record deleted successfully').send();
    } catch (error) {
        next(error);
    }
};

export const getAllAttendance = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const attendance = await attendanceService.getAllAttendance(req.query);
        new ApiResponse(res, 200, 'All attendance records', attendance).send();
    } catch (error) {
        next(error);
    }
};

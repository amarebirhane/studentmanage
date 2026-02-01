import * as attendanceRepository from './attendance.repository';
import { Prisma } from '@prisma/client';
import { ApiError } from '../../utils/apiResponse';

export const createAttendance = async (data: Prisma.AttendanceRecordCreateInput) => {
    return attendanceRepository.createAttendance(data);
};

export const getAttendanceById = async (id: string) => {
    const attendance = await attendanceRepository.findAttendanceById(id);
    if (!attendance) {
        throw new ApiError(404, 'Attendance record not found');
    }
    return attendance;
};

export const updateAttendance = async (id: string, data: Prisma.AttendanceRecordUpdateInput) => {
    const attendance = await attendanceRepository.findAttendanceById(id);
    if (!attendance) {
        throw new ApiError(404, 'Attendance record not found');
    }
    return attendanceRepository.updateAttendance(id, data);
};

export const deleteAttendance = async (id: string) => {
    const attendance = await attendanceRepository.findAttendanceById(id);
    if (!attendance) {
        throw new ApiError(404, 'Attendance record not found');
    }
    return attendanceRepository.deleteAttendance(id);
};

export const getAllAttendance = async (filters: any = {}) => {
    return attendanceRepository.findAllAttendance({ where: filters });
};

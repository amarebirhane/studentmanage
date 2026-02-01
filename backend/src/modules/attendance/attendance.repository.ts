import { AttendanceRecord, Prisma } from '@prisma/client';
import { prisma } from '../../config';

export const createAttendance = async (data: Prisma.AttendanceRecordCreateInput): Promise<AttendanceRecord> => {
    return prisma.attendanceRecord.create({
        data,
    });
};

export const findAttendanceById = async (id: string): Promise<AttendanceRecord | null> => {
    return prisma.attendanceRecord.findUnique({
        where: { id },
        include: {
            student: {
                include: {
                    user: true
                }
            }
        }
    });
};

export const updateAttendance = async (id: string, data: Prisma.AttendanceRecordUpdateInput): Promise<AttendanceRecord> => {
    return prisma.attendanceRecord.update({
        where: { id },
        data,
    });
};

export const deleteAttendance = async (id: string): Promise<AttendanceRecord> => {
    return prisma.attendanceRecord.delete({
        where: { id },
    });
};

export const findAllAttendance = async (params: {
    where?: Prisma.AttendanceRecordWhereInput;
}): Promise<AttendanceRecord[]> => {
    const { where } = params;
    return prisma.attendanceRecord.findMany({
        where,
        include: {
            student: {
                include: {
                    user: true
                }
            },
            recordedBy: true
        }
    });
};

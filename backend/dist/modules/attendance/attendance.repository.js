"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllAttendance = exports.deleteAttendance = exports.updateAttendance = exports.findAttendanceById = exports.createAttendance = void 0;
const config_1 = require("../../config");
const createAttendance = async (data) => {
    return config_1.prisma.attendanceRecord.create({
        data,
    });
};
exports.createAttendance = createAttendance;
const findAttendanceById = async (id) => {
    return config_1.prisma.attendanceRecord.findUnique({
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
exports.findAttendanceById = findAttendanceById;
const updateAttendance = async (id, data) => {
    return config_1.prisma.attendanceRecord.update({
        where: { id },
        data,
    });
};
exports.updateAttendance = updateAttendance;
const deleteAttendance = async (id) => {
    return config_1.prisma.attendanceRecord.delete({
        where: { id },
    });
};
exports.deleteAttendance = deleteAttendance;
const findAllAttendance = async (params) => {
    const { where } = params;
    return config_1.prisma.attendanceRecord.findMany({
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
exports.findAllAttendance = findAllAttendance;

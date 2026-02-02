"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAttendance = exports.deleteAttendance = exports.updateAttendance = exports.getAttendanceById = exports.createAttendance = void 0;
const attendanceRepository = __importStar(require("./attendance.repository"));
const apiResponse_1 = require("../../utils/apiResponse");
const createAttendance = async (data) => {
    return attendanceRepository.createAttendance(data);
};
exports.createAttendance = createAttendance;
const getAttendanceById = async (id) => {
    const attendance = await attendanceRepository.findAttendanceById(id);
    if (!attendance) {
        throw new apiResponse_1.ApiError(404, 'Attendance record not found');
    }
    return attendance;
};
exports.getAttendanceById = getAttendanceById;
const updateAttendance = async (id, data) => {
    const attendance = await attendanceRepository.findAttendanceById(id);
    if (!attendance) {
        throw new apiResponse_1.ApiError(404, 'Attendance record not found');
    }
    return attendanceRepository.updateAttendance(id, data);
};
exports.updateAttendance = updateAttendance;
const deleteAttendance = async (id) => {
    const attendance = await attendanceRepository.findAttendanceById(id);
    if (!attendance) {
        throw new apiResponse_1.ApiError(404, 'Attendance record not found');
    }
    return attendanceRepository.deleteAttendance(id);
};
exports.deleteAttendance = deleteAttendance;
const getAllAttendance = async (filters = {}) => {
    return attendanceRepository.findAllAttendance({ where: filters });
};
exports.getAllAttendance = getAllAttendance;

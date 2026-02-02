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
exports.getAllAttendance = exports.deleteAttendance = exports.updateAttendance = exports.getAttendance = exports.createAttendance = void 0;
const attendanceService = __importStar(require("./attendance.service"));
const apiResponse_1 = require("../../utils/apiResponse");
const createAttendance = async (req, res, next) => {
    try {
        const attendance = await attendanceService.createAttendance(req.body);
        new apiResponse_1.ApiResponse(res, 201, 'Attendance recorded successfully', attendance).send();
    }
    catch (error) {
        next(error);
    }
};
exports.createAttendance = createAttendance;
const getAttendance = async (req, res, next) => {
    try {
        const attendance = await attendanceService.getAttendanceById(req.params.id);
        new apiResponse_1.ApiResponse(res, 200, 'Attendance details', attendance).send();
    }
    catch (error) {
        next(error);
    }
};
exports.getAttendance = getAttendance;
const updateAttendance = async (req, res, next) => {
    try {
        const attendance = await attendanceService.updateAttendance(req.params.id, req.body);
        new apiResponse_1.ApiResponse(res, 200, 'Attendance updated successfully', attendance).send();
    }
    catch (error) {
        next(error);
    }
};
exports.updateAttendance = updateAttendance;
const deleteAttendance = async (req, res, next) => {
    try {
        await attendanceService.deleteAttendance(req.params.id);
        new apiResponse_1.ApiResponse(res, 200, 'Attendance record deleted successfully').send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteAttendance = deleteAttendance;
const getAllAttendance = async (req, res, next) => {
    try {
        const attendance = await attendanceService.getAllAttendance(req.query);
        new apiResponse_1.ApiResponse(res, 200, 'All attendance records', attendance).send();
    }
    catch (error) {
        next(error);
    }
};
exports.getAllAttendance = getAllAttendance;

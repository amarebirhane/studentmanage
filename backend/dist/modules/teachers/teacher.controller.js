"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherController = void 0;
const teacher_service_1 = require("./teacher.service");
const apiResponse_1 = require("../../utils/apiResponse");
class TeacherController {
    static async getTeachers(req, res) {
        try {
            const teachers = await teacher_service_1.TeacherService.getTeachers(req.schoolId);
            return apiResponse_1.ApiResponse.success(res, teachers, 'Teachers retrieved');
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message);
        }
    }
    static async getTeacherById(req, res) {
        try {
            const teacher = await teacher_service_1.TeacherService.getTeacherById(req.params.id, req.schoolId);
            return apiResponse_1.ApiResponse.success(res, teacher, 'Teacher retrieved');
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message, 404);
        }
    }
    static async createTeacher(req, res) {
        try {
            const teacher = await teacher_service_1.TeacherService.createTeacher(req.body, req.schoolId);
            return apiResponse_1.ApiResponse.success(res, teacher, 'Teacher created successfully', 201);
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message, 400);
        }
    }
    static async updateTeacher(req, res) {
        try {
            const teacher = await teacher_service_1.TeacherService.updateTeacher(req.params.id, req.body, req.schoolId);
            return apiResponse_1.ApiResponse.success(res, teacher, 'Teacher updated successfully');
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message, 400);
        }
    }
    static async deleteTeacher(req, res) {
        try {
            await teacher_service_1.TeacherService.deleteTeacher(req.params.id, req.schoolId);
            return apiResponse_1.ApiResponse.success(res, {}, 'Teacher deleted successfully');
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message, 400);
        }
    }
    static async getDashboardStats(req, res) {
        try {
            const stats = await teacher_service_1.TeacherService.getDashboardStats(req.user?.id, req.schoolId);
            return apiResponse_1.ApiResponse.success(res, stats, 'Dashboard stats retrieved');
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message);
        }
    }
}
exports.TeacherController = TeacherController;

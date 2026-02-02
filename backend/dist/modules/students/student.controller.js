"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentController = void 0;
const student_service_1 = require("./student.service");
const apiResponse_1 = require("../../utils/apiResponse");
class StudentController {
    static async getStudents(req, res) {
        try {
            const filters = {
                search: req.query.search,
                classId: req.query.classId,
                sectionId: req.query.sectionId,
                page: req.query.page ? parseInt(req.query.page, 10) : 1,
                limit: req.query.limit ? parseInt(req.query.limit, 10) : 10,
            };
            const result = await student_service_1.StudentService.getStudents(filters, req.schoolId, req.user?.id, req.user?.role);
            return apiResponse_1.ApiResponse.success(res, result, 'Students retrieved');
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message);
        }
    }
    static async getStudentById(req, res) {
        try {
            const student = await student_service_1.StudentService.getStudentById(req.params.id, req.schoolId);
            return apiResponse_1.ApiResponse.success(res, student, 'Student retrieved');
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message, 404);
        }
    }
    static async approveAdmission(req, res) {
        try {
            const student = await student_service_1.StudentService.approveAdmission(req.params.id, req.schoolId);
            return apiResponse_1.ApiResponse.success(res, student, 'Student admission approved');
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message, 400);
        }
    }
    static async createStudent(req, res) {
        try {
            const student = await student_service_1.StudentService.createStudent(req.body, req.schoolId);
            return apiResponse_1.ApiResponse.success(res, student, 'Student created successfully', 201);
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message, 400);
        }
    }
    static async updateStudent(req, res) {
        try {
            const student = await student_service_1.StudentService.updateStudent(req.params.id, req.body, req.schoolId);
            return apiResponse_1.ApiResponse.success(res, student, 'Student updated successfully');
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message, 400);
        }
    }
    static async deleteStudent(req, res) {
        try {
            await student_service_1.StudentService.deleteStudent(req.params.id, req.schoolId);
            return apiResponse_1.ApiResponse.success(res, {}, 'Student deleted successfully');
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message, 400);
        }
    }
}
exports.StudentController = StudentController;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassController = void 0;
const class_service_1 = require("./class.service");
const apiResponse_1 = require("../../utils/apiResponse");
class ClassController {
    static async getClasses(req, res) {
        try {
            const classes = await class_service_1.ClassService.getClasses();
            return apiResponse_1.ApiResponse.success(res, classes, 'Classes retrieved');
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message);
        }
    }
    static async getSections(req, res) {
        try {
            const sections = await class_service_1.ClassService.getSections();
            return apiResponse_1.ApiResponse.success(res, sections, 'Sections retrieved');
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message);
        }
    }
    static async createClass(req, res) {
        try {
            const { name, grade } = req.body;
            const cls = await class_service_1.ClassService.createClass(name, grade);
            return apiResponse_1.ApiResponse.success(res, cls, 'Class created successfully', 201);
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message, 400);
        }
    }
    static async createSection(req, res) {
        try {
            const { name, classId } = req.body;
            const section = await class_service_1.ClassService.createSection(name, classId);
            return apiResponse_1.ApiResponse.success(res, section, 'Section created successfully', 201);
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message, 400);
        }
    }
    static async deleteClass(req, res) {
        try {
            await class_service_1.ClassService.deleteClass(req.params.id);
            return apiResponse_1.ApiResponse.success(res, {}, 'Class deleted successfully');
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message, 400);
        }
    }
    static async deleteSection(req, res) {
        try {
            await class_service_1.ClassService.deleteSection(req.params.id);
            return apiResponse_1.ApiResponse.success(res, {}, 'Section deleted successfully');
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message, 400);
        }
    }
}
exports.ClassController = ClassController;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentController = void 0;
const parent_service_1 = require("./parent.service");
const apiResponse_1 = require("../../utils/apiResponse");
class ParentController {
    static async getParents(req, res) {
        try {
            const parents = await parent_service_1.ParentService.getParents();
            return apiResponse_1.ApiResponse.success(res, parents, 'Parents retrieved');
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message);
        }
    }
    static async getParentById(req, res) {
        try {
            const parent = await parent_service_1.ParentService.getParentById(req.params.id);
            return apiResponse_1.ApiResponse.success(res, parent, 'Parent retrieved');
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message, 404);
        }
    }
    static async createParent(req, res) {
        try {
            const parent = await parent_service_1.ParentService.createParent(req.body);
            return apiResponse_1.ApiResponse.success(res, parent, 'Parent created successfully', 201);
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message, 400);
        }
    }
    static async updateParent(req, res) {
        try {
            const parent = await parent_service_1.ParentService.updateParent(req.params.id, req.body);
            return apiResponse_1.ApiResponse.success(res, parent, 'Parent updated successfully');
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message, 400);
        }
    }
    static async deleteParent(req, res) {
        try {
            await parent_service_1.ParentService.deleteParent(req.params.id);
            return apiResponse_1.ApiResponse.success(res, {}, 'Parent deleted successfully');
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message, 400);
        }
    }
    static async getFinancials(req, res) {
        try {
            const stats = await parent_service_1.ParentService.getFinancialSummary(req.user.id);
            return apiResponse_1.ApiResponse.success(res, stats, 'Financial summary retrieved');
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message);
        }
    }
}
exports.ParentController = ParentController;

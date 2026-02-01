"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("./user.service");
const apiResponse_1 = require("../../utils/apiResponse");
class UserController {
    static async getUsers(req, res) {
        try {
            const users = await user_service_1.UserService.getUsers();
            return apiResponse_1.ApiResponse.success(res, users, 'Users retrieved');
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message);
        }
    }
    static async getUserById(req, res) {
        try {
            const user = await user_service_1.UserService.getUserById(req.params.id);
            return apiResponse_1.ApiResponse.success(res, user, 'User retrieved');
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message, 404);
        }
    }
    static async updateUser(req, res) {
        try {
            const user = await user_service_1.UserService.updateUser(req.params.id, req.body);
            return apiResponse_1.ApiResponse.success(res, user, 'User updated successfully');
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message, 400);
        }
    }
    static async deleteUser(req, res) {
        try {
            await user_service_1.UserService.deleteUser(req.params.id);
            return apiResponse_1.ApiResponse.success(res, {}, 'User deleted successfully');
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message, 400);
        }
    }
}
exports.UserController = UserController;

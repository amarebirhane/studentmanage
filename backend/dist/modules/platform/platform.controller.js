"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSystemLogs = exports.getAllSchools = exports.assignSchoolAdmin = exports.getGlobalStats = void 0;
const platform_service_1 = require("./platform.service");
const apiResponse_1 = require("../../utils/apiResponse");
const getGlobalStats = async (req, res, next) => {
    try {
        const stats = await platform_service_1.PlatformService.getGlobalStats();
        new apiResponse_1.ApiResponse(res, 200, 'Global system statistics', stats).send();
    }
    catch (error) {
        next(error);
    }
};
exports.getGlobalStats = getGlobalStats;
const assignSchoolAdmin = async (req, res, next) => {
    try {
        const result = await platform_service_1.PlatformService.assignSchoolAdmin(req.body);
        new apiResponse_1.ApiResponse(res, 200, 'School admin assigned successfully', result).send();
    }
    catch (error) {
        next(error);
    }
};
exports.assignSchoolAdmin = assignSchoolAdmin;
const getAllSchools = async (req, res, next) => {
    try {
        const schools = await platform_service_1.PlatformService.getAllSchools();
        new apiResponse_1.ApiResponse(res, 200, 'All schools retrieved', schools).send();
    }
    catch (error) {
        next(error);
    }
};
exports.getAllSchools = getAllSchools;
const getSystemLogs = async (req, res, next) => {
    try {
        // Placeholder for audit logs
        new apiResponse_1.ApiResponse(res, 200, 'System audit logs', []).send();
    }
    catch (error) {
        next(error);
    }
};
exports.getSystemLogs = getSystemLogs;

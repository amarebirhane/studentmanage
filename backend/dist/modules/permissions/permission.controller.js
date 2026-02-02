"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkCreatePermissions = exports.getModulePermissions = exports.deletePermission = exports.checkPermission = exports.getUserPermissions = exports.updatePermission = exports.createPermission = void 0;
const permission_service_1 = require("./permission.service");
const apiResponse_1 = require("../../utils/apiResponse");
const createPermission = async (req, res, next) => {
    try {
        const permission = await permission_service_1.PermissionService.createPermission({
            ...req.body,
            schoolId: req.schoolId,
        });
        new apiResponse_1.ApiResponse(res, 201, 'Permission created successfully', permission).send();
    }
    catch (error) {
        next(error);
    }
};
exports.createPermission = createPermission;
const updatePermission = async (req, res, next) => {
    try {
        const permission = await permission_service_1.PermissionService.updatePermission({
            userId: req.params.userId,
            module: req.params.module,
            ...req.body,
        });
        new apiResponse_1.ApiResponse(res, 200, 'Permission updated successfully', permission).send();
    }
    catch (error) {
        next(error);
    }
};
exports.updatePermission = updatePermission;
const getUserPermissions = async (req, res, next) => {
    try {
        const permissions = await permission_service_1.PermissionService.getUserPermissions(req.params.userId);
        new apiResponse_1.ApiResponse(res, 200, 'User permissions', permissions).send();
    }
    catch (error) {
        next(error);
    }
};
exports.getUserPermissions = getUserPermissions;
const checkPermission = async (req, res, next) => {
    try {
        const hasPermission = await permission_service_1.PermissionService.checkPermission(req.params.userId, req.params.module, req.query.action);
        new apiResponse_1.ApiResponse(res, 200, 'Permission check', { hasPermission }).send();
    }
    catch (error) {
        next(error);
    }
};
exports.checkPermission = checkPermission;
const deletePermission = async (req, res, next) => {
    try {
        await permission_service_1.PermissionService.deletePermission(req.params.userId, req.params.module);
        new apiResponse_1.ApiResponse(res, 200, 'Permission deleted successfully').send();
    }
    catch (error) {
        next(error);
    }
};
exports.deletePermission = deletePermission;
const getModulePermissions = async (req, res, next) => {
    try {
        const permissions = await permission_service_1.PermissionService.getModulePermissions(req.params.module, req.schoolId);
        new apiResponse_1.ApiResponse(res, 200, 'Module permissions', permissions).send();
    }
    catch (error) {
        next(error);
    }
};
exports.getModulePermissions = getModulePermissions;
const bulkCreatePermissions = async (req, res, next) => {
    try {
        const permissions = await permission_service_1.PermissionService.bulkCreatePermissions({
            ...req.body,
            schoolId: req.schoolId,
        });
        new apiResponse_1.ApiResponse(res, 201, 'Permissions created successfully', permissions).send();
    }
    catch (error) {
        next(error);
    }
};
exports.bulkCreatePermissions = bulkCreatePermissions;

import { Request, Response, NextFunction } from 'express';
import { PermissionService } from './permission.service';
import { ApiResponse } from '../../utils/apiResponse';

export const createPermission = async (req: any, res: Response, next: NextFunction) => {
    try {
        const permission = await PermissionService.createPermission({
            ...req.body,
            schoolId: req.schoolId,
        });
        new ApiResponse(res, 201, 'Permission created successfully', permission).send();
    } catch (error) {
        next(error);
    }
};

export const updatePermission = async (req: any, res: Response, next: NextFunction) => {
    try {
        const permission = await PermissionService.updatePermission({
            userId: req.params.userId,
            module: req.params.module,
            ...req.body,
        });
        new ApiResponse(res, 200, 'Permission updated successfully', permission).send();
    } catch (error) {
        next(error);
    }
};

export const getUserPermissions = async (req: any, res: Response, next: NextFunction) => {
    try {
        const permissions = await PermissionService.getUserPermissions(req.params.userId);
        new ApiResponse(res, 200, 'User permissions', permissions).send();
    } catch (error) {
        next(error);
    }
};

export const checkPermission = async (req: any, res: Response, next: NextFunction) => {
    try {
        const hasPermission = await PermissionService.checkPermission(
            req.params.userId,
            req.params.module,
            req.query.action as 'view' | 'create' | 'edit' | 'delete'
        );
        new ApiResponse(res, 200, 'Permission check', { hasPermission }).send();
    } catch (error) {
        next(error);
    }
};

export const deletePermission = async (req: any, res: Response, next: NextFunction) => {
    try {
        await PermissionService.deletePermission(req.params.userId, req.params.module);
        new ApiResponse(res, 200, 'Permission deleted successfully').send();
    } catch (error) {
        next(error);
    }
};

export const getModulePermissions = async (req: any, res: Response, next: NextFunction) => {
    try {
        const permissions = await PermissionService.getModulePermissions(
            req.params.module,
            req.schoolId
        );
        new ApiResponse(res, 200, 'Module permissions', permissions).send();
    } catch (error) {
        next(error);
    }
};

export const bulkCreatePermissions = async (req: any, res: Response, next: NextFunction) => {
    try {
        const permissions = await PermissionService.bulkCreatePermissions({
            ...req.body,
            schoolId: req.schoolId,
        });
        new ApiResponse(res, 201, 'Permissions created successfully', permissions).send();
    } catch (error) {
        next(error);
    }
};

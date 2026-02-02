"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionService = void 0;
const config_1 = require("../../config");
class PermissionService {
    static async createPermission(data) {
        // Check if permission already exists
        const existing = await config_1.prisma.permission.findUnique({
            where: {
                userId_module: {
                    userId: data.userId,
                    module: data.module,
                },
            },
        });
        if (existing) {
            throw new Error('Permission already exists for this user and module');
        }
        return config_1.prisma.permission.create({
            data: {
                userId: data.userId,
                module: data.module,
                canView: data.canView ?? false,
                canCreate: data.canCreate ?? false,
                canEdit: data.canEdit ?? false,
                canDelete: data.canDelete ?? false,
                schoolId: data.schoolId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }
    static async updatePermission(data) {
        return config_1.prisma.permission.update({
            where: {
                userId_module: {
                    userId: data.userId,
                    module: data.module,
                },
            },
            data: {
                canView: data.canView,
                canCreate: data.canCreate,
                canEdit: data.canEdit,
                canDelete: data.canDelete,
            },
        });
    }
    static async getUserPermissions(userId) {
        return config_1.prisma.permission.findMany({
            where: { userId },
            orderBy: { module: 'asc' },
        });
    }
    static async checkPermission(userId, module, action) {
        const permission = await config_1.prisma.permission.findUnique({
            where: {
                userId_module: {
                    userId,
                    module,
                },
            },
        });
        if (!permission)
            return false;
        switch (action) {
            case 'view':
                return permission.canView;
            case 'create':
                return permission.canCreate;
            case 'edit':
                return permission.canEdit;
            case 'delete':
                return permission.canDelete;
            default:
                return false;
        }
    }
    static async deletePermission(userId, module) {
        return config_1.prisma.permission.delete({
            where: {
                userId_module: {
                    userId,
                    module,
                },
            },
        });
    }
    static async getModulePermissions(module, schoolId) {
        const where = { module };
        if (schoolId)
            where.schoolId = schoolId;
        return config_1.prisma.permission.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }
    static async bulkCreatePermissions(data) {
        const permissions = await Promise.all(data.modules.map((moduleData) => this.createPermission({
            userId: data.userId,
            ...moduleData,
            schoolId: data.schoolId,
        }).catch(() => null) // Ignore duplicates
        ));
        return permissions.filter((p) => p !== null);
    }
}
exports.PermissionService = PermissionService;

import { prisma } from '../../config';

export class PermissionService {
    static async createPermission(data: {
        userId: string;
        module: string;
        canView?: boolean;
        canCreate?: boolean;
        canEdit?: boolean;
        canDelete?: boolean;
        schoolId?: string;
    }) {
        // Check if permission already exists
        const existing = await prisma.permission.findUnique({
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

        return prisma.permission.create({
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

    static async updatePermission(data: {
        userId: string;
        module: string;
        canView?: boolean;
        canCreate?: boolean;
        canEdit?: boolean;
        canDelete?: boolean;
    }) {
        return prisma.permission.update({
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

    static async getUserPermissions(userId: string) {
        return prisma.permission.findMany({
            where: { userId },
            orderBy: { module: 'asc' },
        });
    }

    static async checkPermission(
        userId: string,
        module: string,
        action: 'view' | 'create' | 'edit' | 'delete'
    ): Promise<boolean> {
        const permission = await prisma.permission.findUnique({
            where: {
                userId_module: {
                    userId,
                    module,
                },
            },
        });

        if (!permission) return false;

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

    static async deletePermission(userId: string, module: string) {
        return prisma.permission.delete({
            where: {
                userId_module: {
                    userId,
                    module,
                },
            },
        });
    }

    static async getModulePermissions(module: string, schoolId?: string) {
        const where: any = { module };
        if (schoolId) where.schoolId = schoolId;

        return prisma.permission.findMany({
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

    static async bulkCreatePermissions(data: {
        userId: string;
        modules: Array<{
            module: string;
            canView?: boolean;
            canCreate?: boolean;
            canEdit?: boolean;
            canDelete?: boolean;
        }>;
        schoolId?: string;
    }) {
        const permissions = await Promise.all(
            data.modules.map((moduleData) =>
                this.createPermission({
                    userId: data.userId,
                    ...moduleData,
                    schoolId: data.schoolId,
                }).catch(() => null) // Ignore duplicates
            )
        );

        return permissions.filter((p) => p !== null);
    }
}

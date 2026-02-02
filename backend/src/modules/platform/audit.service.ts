import { prisma } from '../../config';

export class AuditLogService {
    static async log(data: {
        action: string;
        module: string;
        userId: string;
        details?: any;
        schoolId?: string;
    }) {
        try {
            return await prisma.auditLog.create({
                data: {
                    action: data.action,
                    module: data.module,
                    userId: data.userId,
                    details: data.details || {},
                    schoolId: data.schoolId,
                },
            });
        } catch (error) {
            console.error('Failed to create audit log:', error);
            // Don't throw error to avoid blocking the main action
        }
    }

    static async getLogs(filters: {
        schoolId?: string;
        module?: string;
        userId?: string;
        limit?: number;
        page?: number;
    }) {
        const { schoolId, module, userId, limit = 50, page = 1 } = filters;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (schoolId) where.schoolId = schoolId;
        if (module) where.module = module;
        if (userId) where.userId = userId;

        const [logs, total] = await Promise.all([
            prisma.auditLog.findMany({
                where,
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                            role: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.auditLog.count({ where }),
        ]);

        return {
            logs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}

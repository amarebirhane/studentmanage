"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogService = void 0;
const config_1 = require("../../config");
class AuditLogService {
    static async log(data) {
        try {
            return await config_1.prisma.activityLog.create({
                data: {
                    action: data.action,
                    module: data.module,
                    userId: data.userId,
                    details: data.details || {},
                    schoolId: data.schoolId,
                },
            });
        }
        catch (error) {
            console.error('Failed to create activity log:', error);
            // Don't throw error to avoid blocking the main action
        }
    }
    static async getLogs(filters) {
        const { schoolId, module, userId, limit = 50, page = 1 } = filters;
        const skip = (page - 1) * limit;
        const where = {};
        if (schoolId)
            where.schoolId = schoolId;
        if (module)
            where.module = module;
        if (userId)
            where.userId = userId;
        const [logs, total] = await Promise.all([
            config_1.prisma.activityLog.findMany({
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
            config_1.prisma.activityLog.count({ where }),
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
exports.AuditLogService = AuditLogService;

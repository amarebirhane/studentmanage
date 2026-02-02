"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAuditAction = void 0;
const config_1 = require("../config");
/**
 * Utility to log system-wide and school-specific actions.
 */
const logAuditAction = async (data) => {
    try {
        await config_1.prisma.auditLog.create({
            data: {
                ...data,
                details: data.details || {},
            },
        });
    }
    catch (error) {
        console.error('Failed to create audit log:', error);
    }
};
exports.logAuditAction = logAuditAction;

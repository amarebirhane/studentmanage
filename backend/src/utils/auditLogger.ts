import { prisma } from '../config';

/**
 * Utility to log system-wide and school-specific actions.
 */
export const logAuditAction = async (data: {
    action: string;
    module: string;
    userId: string;
    userName: string;
    schoolId?: string;
    details?: any;
}) => {
    try {
        await prisma.auditLog.create({
            data: {
                ...data,
                details: data.details || {},
            },
        });
    } catch (error) {
        console.error('Failed to create audit log:', error);
    }
};

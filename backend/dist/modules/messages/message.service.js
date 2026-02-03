"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const config_1 = require("../../config");
class MessageService {
    static async sendMessage(data) {
        return config_1.prisma.message.create({
            data,
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                    },
                },
                recipient: {
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
    static async getInbox(userId, schoolId) {
        const where = { recipientId: userId };
        if (schoolId)
            where.schoolId = schoolId;
        return config_1.prisma.message.findMany({
            where,
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        role: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    static async getSentMessages(userId, schoolId) {
        const where = { senderId: userId };
        if (schoolId)
            where.schoolId = schoolId;
        return config_1.prisma.message.findMany({
            where,
            include: {
                recipient: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        role: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    static async markAsRead(messageId, userId, schoolId) {
        const where = { id: messageId };
        if (schoolId)
            where.schoolId = schoolId;
        const message = await config_1.prisma.message.findFirst({ where });
        if (!message || message.recipientId !== userId) {
            throw new Error('Message not found or unauthorized');
        }
        return config_1.prisma.message.update({
            where: { id: messageId },
            data: { readAt: new Date() },
        });
    }
    static async deleteMessage(messageId, userId, schoolId) {
        const where = { id: messageId };
        if (schoolId)
            where.schoolId = schoolId;
        const message = await config_1.prisma.message.findFirst({ where });
        if (!message || (message.senderId !== userId && message.recipientId !== userId)) {
            throw new Error('Message not found or unauthorized');
        }
        return config_1.prisma.message.delete({ where: { id: messageId } });
    }
}
exports.MessageService = MessageService;

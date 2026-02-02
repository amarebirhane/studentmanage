"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const config_1 = require("../config");
class NotificationService {
    static async sendNotification(data) {
        return config_1.prisma.notification.create({
            data: {
                ...data,
                metadata: data.metadata || {},
            },
        });
    }
    static async getUserNotifications(userId) {
        return config_1.prisma.notification.findMany({
            where: { userId },
            orderBy: { sentAt: 'desc' },
        });
    }
    static async markAsRead(notificationId) {
        return config_1.prisma.notification.update({
            where: { id: notificationId },
            data: { readAt: new Date() },
        });
    }
}
exports.NotificationService = NotificationService;

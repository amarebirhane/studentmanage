import { prisma } from '../config';
import { NotificationChannel } from '@prisma/client';

export class NotificationService {
    static async sendNotification(data: {
        userId: string;
        title: string;
        message: string;
        channel: NotificationChannel;
        metadata?: any;
    }) {
        return prisma.notification.create({
            data: {
                ...data,
                metadata: data.metadata || {},
            },
        });
    }

    static async getUserNotifications(userId: string) {
        return prisma.notification.findMany({
            where: { userId },
            orderBy: { sentAt: 'desc' },
        });
    }

    static async markAsRead(notificationId: string) {
        return prisma.notification.update({
            where: { id: notificationId },
            data: { readAt: new Date() },
        });
    }
}

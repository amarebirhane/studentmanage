import { prisma } from '../../config';

export class MessageService {
    static async sendMessage(data: {
        senderId: string;
        recipientId: string;
        subject: string;
        content: string;
        schoolId?: string;
    }) {
        return prisma.message.create({
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

    static async getInbox(userId: string, schoolId?: string) {
        const where: any = { recipientId: userId };
        if (schoolId) where.schoolId = schoolId;

        return prisma.message.findMany({
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

    static async getSentMessages(userId: string, schoolId?: string) {
        const where: any = { senderId: userId };
        if (schoolId) where.schoolId = schoolId;

        return prisma.message.findMany({
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

    static async markAsRead(messageId: string, userId: string, schoolId?: string) {
        const where: any = { id: messageId };
        if (schoolId) where.schoolId = schoolId;

        const message = await prisma.message.findFirst({ where });

        if (!message || message.recipientId !== userId) {
            throw new Error('Message not found or unauthorized');
        }

        return prisma.message.update({
            where: { id: messageId },
            data: { readAt: new Date() },
        });
    }

    static async deleteMessage(messageId: string, userId: string, schoolId?: string) {
        const where: any = { id: messageId };
        if (schoolId) where.schoolId = schoolId;

        const message = await prisma.message.findFirst({ where });

        if (!message || (message.senderId !== userId && message.recipientId !== userId)) {
            throw new Error('Message not found or unauthorized');
        }

        return prisma.message.delete({ where: { id: messageId } });
    }
}

import { Prisma, Announcement } from '@prisma/client';
import { prisma } from '../../config';

export class AnnouncementService {
    static async createAnnouncement(data: {
        title: string;
        content: string;
        target?: string; // ALL, TEACHERS, STUDENTS, PARENTS
        createdById: string;
        schoolId?: string;
    }): Promise<Announcement> {
        return prisma.announcement.create({
            data: {
                ...data,
                target: data.target || 'ALL',
            },
        });
    }

    static async getAnnouncementById(id: string): Promise<Announcement | null> {
        return prisma.announcement.findUnique({
            where: { id },
        });
    }

    static async updateAnnouncement(
        id: string,
        data: Prisma.AnnouncementUpdateInput,
        userId: string
    ): Promise<Announcement> {
        const announcement = await prisma.announcement.findUnique({ where: { id } });

        if (!announcement || announcement.createdById !== userId) {
            throw new Error('Announcement not found or unauthorized');
        }

        return prisma.announcement.update({
            where: { id },
            data,
        });
    }

    static async deleteAnnouncement(id: string, userId: string): Promise<Announcement> {
        const announcement = await prisma.announcement.findUnique({ where: { id } });

        if (!announcement || announcement.createdById !== userId) {
            throw new Error('Announcement not found or unauthorized');
        }

        return prisma.announcement.delete({
            where: { id },
        });
    }

    static async getAnnouncements(
        schoolId?: string,
        userRole?: string
    ): Promise<Announcement[]> {
        const where: any = {};

        if (schoolId) where.schoolId = schoolId;

        // Filter by target based on user role
        if (userRole && userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
            where.OR = [
                { target: 'ALL' },
                { target: userRole === 'TEACHER' ? 'TEACHERS' : userRole + 'S' }, // STUDENTS, PARENTS
            ];
        }

        return prisma.announcement.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }
}

// Legacy exports for compatibility
export const createAnnouncement = AnnouncementService.createAnnouncement;
export const getAnnouncementById = AnnouncementService.getAnnouncementById;
export const updateAnnouncement = (id: string, data: Prisma.AnnouncementUpdateInput) =>
    AnnouncementService.updateAnnouncement(id, data, '');
export const deleteAnnouncement = (id: string) => AnnouncementService.deleteAnnouncement(id, '');
export const getAllAnnouncements = (where?: Prisma.AnnouncementWhereInput) =>
    prisma.announcement.findMany({ where, orderBy: { createdAt: 'desc' } });

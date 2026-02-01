import { PrismaClient, Prisma, Announcement } from '@prisma/client';

const prisma = new PrismaClient();

export const createAnnouncement = async (data: Prisma.AnnouncementCreateInput): Promise<Announcement> => {
    return prisma.announcement.create({
        data,
    });
};

export const getAnnouncementById = async (id: string): Promise<Announcement | null> => {
    return prisma.announcement.findUnique({
        where: { id },
    });
};

export const updateAnnouncement = async (id: string, data: Prisma.AnnouncementUpdateInput): Promise<Announcement> => {
    return prisma.announcement.update({
        where: { id },
        data,
    });
};

export const deleteAnnouncement = async (id: string): Promise<Announcement> => {
    return prisma.announcement.delete({
        where: { id },
    });
};

export const getAllAnnouncements = async (where?: Prisma.AnnouncementWhereInput): Promise<Announcement[]> => {
    return prisma.announcement.findMany({
        where,
        orderBy: { createdAt: 'desc' }
    });
};

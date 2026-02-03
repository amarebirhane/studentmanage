"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAnnouncements = exports.deleteAnnouncement = exports.updateAnnouncement = exports.getAnnouncementById = exports.createAnnouncement = exports.AnnouncementService = void 0;
const config_1 = require("../../config");
class AnnouncementService {
    static async createAnnouncement(data) {
        return config_1.prisma.announcement.create({
            data: {
                ...data,
                target: data.target || 'ALL',
            },
        });
    }
    static async getAnnouncementById(id, schoolId) {
        const where = { id };
        if (schoolId)
            where.schoolId = schoolId;
        return config_1.prisma.announcement.findFirst({
            where,
        });
    }
    static async updateAnnouncement(id, data, userId, schoolId) {
        const where = { id };
        if (schoolId)
            where.schoolId = schoolId;
        const announcement = await config_1.prisma.announcement.findFirst({ where });
        if (!announcement || announcement.createdById !== userId) {
            throw new Error('Announcement not found or unauthorized');
        }
        return config_1.prisma.announcement.update({
            where: { id },
            data,
        });
    }
    static async deleteAnnouncement(id, userId, schoolId) {
        const where = { id };
        if (schoolId)
            where.schoolId = schoolId;
        const announcement = await config_1.prisma.announcement.findFirst({ where });
        if (!announcement || announcement.createdById !== userId) {
            throw new Error('Announcement not found or unauthorized');
        }
        return config_1.prisma.announcement.delete({
            where: { id },
        });
    }
    static async getAnnouncements(schoolId, userRole) {
        const where = {};
        if (schoolId)
            where.schoolId = schoolId;
        // Filter by target based on user role
        if (userRole && userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
            where.OR = [
                { target: 'ALL' },
                { target: userRole === 'TEACHER' ? 'TEACHERS' : userRole + 'S' }, // STUDENTS, PARENTS
            ];
        }
        return config_1.prisma.announcement.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }
}
exports.AnnouncementService = AnnouncementService;
// Legacy exports for compatibility
exports.createAnnouncement = AnnouncementService.createAnnouncement;
exports.getAnnouncementById = AnnouncementService.getAnnouncementById;
const updateAnnouncement = (id, data) => AnnouncementService.updateAnnouncement(id, data, '');
exports.updateAnnouncement = updateAnnouncement;
const deleteAnnouncement = (id) => AnnouncementService.deleteAnnouncement(id, '');
exports.deleteAnnouncement = deleteAnnouncement;
const getAllAnnouncements = (where) => config_1.prisma.announcement.findMany({ where, orderBy: { createdAt: 'desc' } });
exports.getAllAnnouncements = getAllAnnouncements;

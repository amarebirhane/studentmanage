"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAnnouncements = exports.deleteAnnouncement = exports.updateAnnouncement = exports.getAnnouncementById = exports.createAnnouncement = void 0;
const config_1 = require("../../config");
const createAnnouncement = async (data) => {
    return config_1.prisma.announcement.create({
        data,
    });
};
exports.createAnnouncement = createAnnouncement;
const getAnnouncementById = async (id) => {
    return config_1.prisma.announcement.findUnique({
        where: { id },
    });
};
exports.getAnnouncementById = getAnnouncementById;
const updateAnnouncement = async (id, data) => {
    return config_1.prisma.announcement.update({
        where: { id },
        data,
    });
};
exports.updateAnnouncement = updateAnnouncement;
const deleteAnnouncement = async (id) => {
    return config_1.prisma.announcement.delete({
        where: { id },
    });
};
exports.deleteAnnouncement = deleteAnnouncement;
const getAllAnnouncements = async (where) => {
    return config_1.prisma.announcement.findMany({
        where,
        orderBy: { createdAt: 'desc' }
    });
};
exports.getAllAnnouncements = getAllAnnouncements;

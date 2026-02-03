"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnnouncements = exports.deleteAnnouncement = exports.updateAnnouncement = exports.getAnnouncement = exports.createAnnouncement = void 0;
const announcement_service_1 = require("./announcement.service");
const apiResponse_1 = require("../../utils/apiResponse");
const createAnnouncement = async (req, res, next) => {
    try {
        const announcement = await announcement_service_1.AnnouncementService.createAnnouncement({
            title: req.body.title,
            content: req.body.content,
            target: req.body.target,
            createdById: req.user?.id,
            schoolId: req.schoolId,
        });
        new apiResponse_1.ApiResponse(res, 201, 'Announcement created successfully', announcement).send();
    }
    catch (error) {
        next(error);
    }
};
exports.createAnnouncement = createAnnouncement;
const getAnnouncement = async (req, res, next) => {
    try {
        const announcement = await announcement_service_1.AnnouncementService.getAnnouncementById(req.params.id, req.schoolId);
        new apiResponse_1.ApiResponse(res, 200, 'Announcement details', announcement).send();
    }
    catch (error) {
        next(error);
    }
};
exports.getAnnouncement = getAnnouncement;
const updateAnnouncement = async (req, res, next) => {
    try {
        const announcement = await announcement_service_1.AnnouncementService.updateAnnouncement(req.params.id, req.body, req.user?.id, req.schoolId);
        new apiResponse_1.ApiResponse(res, 200, 'Announcement updated successfully', announcement).send();
    }
    catch (error) {
        next(error);
    }
};
exports.updateAnnouncement = updateAnnouncement;
const deleteAnnouncement = async (req, res, next) => {
    try {
        await announcement_service_1.AnnouncementService.deleteAnnouncement(req.params.id, req.user?.id, req.schoolId);
        new apiResponse_1.ApiResponse(res, 200, 'Announcement deleted successfully').send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteAnnouncement = deleteAnnouncement;
const getAnnouncements = async (req, res, next) => {
    try {
        const announcements = await announcement_service_1.AnnouncementService.getAnnouncements(req.schoolId, req.user?.role);
        new apiResponse_1.ApiResponse(res, 200, 'Announcements retrieved', announcements).send();
    }
    catch (error) {
        next(error);
    }
};
exports.getAnnouncements = getAnnouncements;

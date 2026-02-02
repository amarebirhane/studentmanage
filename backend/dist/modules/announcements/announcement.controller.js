"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnnouncements = exports.deleteAnnouncement = exports.updateAnnouncement = exports.getAnnouncement = exports.createAnnouncement = void 0;
const announcementService = __importStar(require("./announcement.service"));
const apiResponse_1 = require("../../utils/apiResponse");
const createAnnouncement = async (req, res, next) => {
    try {
        const announcement = await announcementService.createAnnouncement({
            ...req.body,
            createdById: req.user?.id // Assuming user is attached to req
        });
        return apiResponse_1.ApiResponse.success(res, announcement, 'Announcement created successfully', 201);
    }
    catch (error) {
        next(error);
    }
};
exports.createAnnouncement = createAnnouncement;
const getAnnouncement = async (req, res, next) => {
    try {
        const announcement = await announcementService.getAnnouncementById(req.params.id);
        return apiResponse_1.ApiResponse.success(res, announcement, 'Announcement details');
    }
    catch (error) {
        next(error);
    }
};
exports.getAnnouncement = getAnnouncement;
const updateAnnouncement = async (req, res, next) => {
    try {
        const announcement = await announcementService.updateAnnouncement(req.params.id, req.body);
        return apiResponse_1.ApiResponse.success(res, announcement, 'Announcement updated successfully');
    }
    catch (error) {
        next(error);
    }
};
exports.updateAnnouncement = updateAnnouncement;
const deleteAnnouncement = async (req, res, next) => {
    try {
        await announcementService.deleteAnnouncement(req.params.id);
        return apiResponse_1.ApiResponse.success(res, {}, 'Announcement deleted successfully');
    }
    catch (error) {
        next(error);
    }
};
exports.deleteAnnouncement = deleteAnnouncement;
const getAnnouncements = async (req, res, next) => {
    try {
        const announcements = await announcementService.getAllAnnouncements();
        return apiResponse_1.ApiResponse.success(res, announcements, 'All announcements');
    }
    catch (error) {
        next(error);
    }
};
exports.getAnnouncements = getAnnouncements;

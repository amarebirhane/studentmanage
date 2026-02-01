import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types';
import * as announcementService from './announcement.service';
import { ApiResponse } from '../../utils/apiResponse';

export const createAnnouncement = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const announcement = await announcementService.createAnnouncement({
            ...req.body,
            createdById: req.user?.id // Assuming user is attached to req
        });
        return ApiResponse.success(res, announcement, 'Announcement created successfully', 201);
    } catch (error) {
        next(error);
    }
};

export const getAnnouncement = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const announcement = await announcementService.getAnnouncementById(req.params.id as string);
        return ApiResponse.success(res, announcement, 'Announcement details');
    } catch (error) {
        next(error);
    }
};

export const updateAnnouncement = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const announcement = await announcementService.updateAnnouncement(req.params.id as string, req.body);
        return ApiResponse.success(res, announcement, 'Announcement updated successfully');
    } catch (error) {
        next(error);
    }
};

export const deleteAnnouncement = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        await announcementService.deleteAnnouncement(req.params.id as string);
        return ApiResponse.success(res, {}, 'Announcement deleted successfully');
    } catch (error) {
        next(error);
    }
};

export const getAnnouncements = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const announcements = await announcementService.getAllAnnouncements();
        return ApiResponse.success(res, announcements, 'All announcements');
    } catch (error) {
        next(error);
    }
};

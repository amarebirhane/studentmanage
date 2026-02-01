import { Request, Response, NextFunction } from 'express';
import * as announcementService from './announcement.service';
import { ApiResponse } from '../../utils/apiResponse';

export const createAnnouncement = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const announcement = await announcementService.createAnnouncement({
            ...req.body,
            createdById: req.user?.id // Assuming user is attached to req
        });
        new ApiResponse(res, 201, 'Announcement created successfully', announcement).send();
    } catch (error) {
        next(error);
    }
};

export const getAnnouncement = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const announcement = await announcementService.getAnnouncementById(req.params.id as string);
        new ApiResponse(res, 200, 'Announcement details', announcement).send();
    } catch (error) {
        next(error);
    }
};

export const updateAnnouncement = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const announcement = await announcementService.updateAnnouncement(req.params.id as string, req.body);
        new ApiResponse(res, 200, 'Announcement updated successfully', announcement).send();
    } catch (error) {
        next(error);
    }
};

export const deleteAnnouncement = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await announcementService.deleteAnnouncement(req.params.id as string);
        new ApiResponse(res, 200, 'Announcement deleted successfully').send();
    } catch (error) {
        next(error);
    }
};

export const getAnnouncements = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const announcements = await announcementService.getAllAnnouncements();
        new ApiResponse(res, 200, 'All announcements', announcements).send();
    } catch (error) {
        next(error);
    }
};

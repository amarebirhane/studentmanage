import { Response, NextFunction } from 'express';
import { AnnouncementService } from './announcement.service';
import { ApiResponse } from '../../utils/apiResponse';

export const createAnnouncement = async (req: any, res: Response, next: NextFunction) => {
    try {
        const announcement = await AnnouncementService.createAnnouncement({
            title: req.body.title,
            content: req.body.content,
            target: req.body.target,
            createdById: req.user.id,
            schoolId: req.schoolId,
        });
        new ApiResponse(res, 201, 'Announcement created successfully', announcement).send();
    } catch (error) {
        next(error);
    }
};

export const getAnnouncement = async (req: any, res: Response, next: NextFunction) => {
    try {
        const announcement = await AnnouncementService.getAnnouncementById(req.params.id);
        new ApiResponse(res, 200, 'Announcement details', announcement).send();
    } catch (error) {
        next(error);
    }
};

export const updateAnnouncement = async (req: any, res: Response, next: NextFunction) => {
    try {
        const announcement = await AnnouncementService.updateAnnouncement(
            req.params.id,
            req.body,
            req.user.id
        );
        new ApiResponse(res, 200, 'Announcement updated successfully', announcement).send();
    } catch (error) {
        next(error);
    }
};

export const deleteAnnouncement = async (req: any, res: Response, next: NextFunction) => {
    try {
        await AnnouncementService.deleteAnnouncement(req.params.id, req.user.id);
        new ApiResponse(res, 200, 'Announcement deleted successfully').send();
    } catch (error) {
        next(error);
    }
};

export const getAnnouncements = async (req: any, res: Response, next: NextFunction) => {
    try {
        const announcements = await AnnouncementService.getAnnouncements(
            req.schoolId,
            req.user.role
        );
        new ApiResponse(res, 200, 'Announcements retrieved', announcements).send();
    } catch (error) {
        next(error);
    }
};
